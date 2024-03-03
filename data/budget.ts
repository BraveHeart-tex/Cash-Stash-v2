"use server";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { Budget, BudgetCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IValidatedResponse,
  IGetPaginatedBudgetsParams,
  IGetPaginatedBudgetsResponse,
} from "@/data/types";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getBudgetKey,
  getPaginatedBudgetsKey,
  invalidateKeysByPrefix,
  mapRedisHashToBudget,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import asyncPool from "@/lib/data/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createId } from "@paralleldrive/cuid2";

export const createBudget = async (
  data: BudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = budgetSchema.parse(data);
    const createBudgetDto = {
      ...validatedData,
      id: createId(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createBudgetResponse] = await asyncPool.query<ResultSetHeader>(
      "INSERT INTO BUDGET (id, userId, name, category, budgetAmount, spentAmount, progress, createdAt, updatedAt) VALUES (:id, :userId, :name, :category, :budgetAmount, :spentAmount,:progress, :createdAt, :updatedAt)",
      createBudgetDto
    );

    if (createBudgetResponse.affectedRows === 0) {
      return {
        error:
          "There was a problem while creating your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redis.hset(getBudgetKey(createBudgetDto.id), createBudgetDto),
    ]);

    return {
      data: createBudgetDto,
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "There was a problem while creating your budget. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const updateBudget = async (
  budgetId: string,
  values: BudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  let budgetToBeUpdated: Budget | null;

  const budgetFromCache = await redis.hgetall(getBudgetKey(budgetId));

  if (budgetFromCache) {
    console.log("UPDATE Budget CACHE HIT");
    budgetToBeUpdated = mapRedisHashToBudget(budgetFromCache);
  } else {
    console.log("UPDATE Budget CACHE MISS");
    const [budgetResponse] = await asyncPool.query<RowDataPacket[]>(
      "SELECT * FROM budget where id = ?",
      [budgetId]
    );

    budgetToBeUpdated = budgetResponse[0] as Budget;
  }

  if (!budgetToBeUpdated)
    return { error: `Budget to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = budgetSchema.parse(values);

    const [updateBudgetResponse] = await asyncPool.query<RowDataPacket[]>(
      "UPDATE BUDGET SET name = :name, category = :category, budgetAmount = :budgetAmount, spentAmount = :spentAmount, progress = :progress, updatedAt = :updatedAt WHERE id = :id; SELECT * FROM BUDGET WHERE id = :id",
      {
        ...validatedData,
        id: budgetId,
        updatedAt: new Date(),
      }
    );
    const affectedRows = updateBudgetResponse[0].affectedRows;

    if (affectedRows === 0) {
      return {
        error:
          "There was a problem while trying to update your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    const updatedBudget = updateBudgetResponse?.[1]?.[0];

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redis.hset(getBudgetKey(updatedBudget.id), updatedBudget),
    ]);

    return { data: updatedBudget, fieldErrors: [] };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    console.error(error);
    return {
      error:
        "There was a problem while updating your budget. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const getPaginatedBudgets = async ({
  pageNumber,
  query,
  category,
  sortBy,
  sortDirection,
}: IGetPaginatedBudgetsParams): Promise<IGetPaginatedBudgetsResponse> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  if (category && !validateEnumValue(category, BudgetCategory)) {
    return {
      budgets: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  const validBudgetSortByOptions: {
    [key: string]: boolean;
  } = {
    progress: true,
    spentAmount: true,
    budgetAmount: true,
  };

  const cacheKey = getPaginatedBudgetsKey({
    userId: user.id,
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
  });

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    console.log("Budgets CACHE HIT");
    return {
      budgets: JSON.parse(cachedData).budgets,
      hasNextPage: JSON.parse(cachedData).totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(JSON.parse(cachedData).totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  }

  console.log("Budgets CACHE MISS");

  let budgetsQuery = `SELECT * FROM Budget where userId = :userId and name like :query`;
  let totalCountQuery = `SELECT COUNT(*) as totalCount FROM Budget where userId = :userId and name like :query`;

  let budgetsQueryParams: {
    userId: string;
    query: string;
    category?: BudgetCategory;
    limit?: number;
    offset?: number;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  let totalCountQueryParams: {
    userId: string;
    query: string;
    category?: BudgetCategory;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  if (category) {
    budgetsQuery += ` and category = :category`;
    totalCountQuery += ` and category = :category`;
    budgetsQueryParams.category = category;
    totalCountQueryParams.category = category;
  }

  if (sortBy && sortDirection) {
    const validSortDirection =
      sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const validSortBy = validBudgetSortByOptions[sortBy] ? sortBy : "id";

    budgetsQuery += ` ORDER BY ${validSortBy} ${validSortDirection}`;
  }

  budgetsQuery += ` LIMIT :limit OFFSET :offset`;
  budgetsQueryParams.limit = PAGE_SIZE;
  budgetsQueryParams.offset = skipAmount;

  // Must extend the RowDataPacket with the Budget type
  const [[budgets], [totalCountResult]] = await Promise.all([
    asyncPool.query<RowDataPacket[]>(budgetsQuery, budgetsQueryParams),
    asyncPool.query<RowDataPacket[]>(totalCountQuery, totalCountQueryParams),
  ]);

  const totalCount = totalCountResult[0].totalCount;

  if (budgets.length === 0) {
    return {
      budgets: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  await redis.set(cacheKey, JSON.stringify({ budgets, totalCount }));

  return {
    budgets: budgets as Budget[],
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};

export const deleteBudget = async (id: string) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const [deleteBudgetResponse] = await asyncPool.query<ResultSetHeader>(
      "DELETE FROM Budget WHERE id = ?",
      [id]
    );

    if (deleteBudgetResponse.affectedRows === 0) {
      return {
        error: "We encountered a problem while deleting the budget.",
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redis.del(getBudgetKey(id)),
    ]);

    return {
      data: "Budget deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "We encountered a problem while deleting the budget.",
    };
  }
};
