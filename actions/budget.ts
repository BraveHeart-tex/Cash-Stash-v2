"use server";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { BudgetSelectModel } from "@/lib/database/schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IGetPaginatedBudgetsParams,
  IGetPaginatedBudgetsResponse,
  IValidatedResponse,
} from "@/actions/types";
import {
  generateCachePrefixWithUserId,
  getBudgetKey,
  getPaginatedBudgetsKey,
  mapRedisHashToBudget,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import { createBudgetDto } from "@/lib/database/dto/budgetDto";
import budgetRepository from "@/lib/database/repository/budgetRepository";
import { BudgetCategory } from "@/entities/budget";
import redisService from "@/lib/redis/redisService";

export const createBudget = async (
  data: BudgetSchemaType
): Promise<IValidatedResponse<BudgetSelectModel>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = budgetSchema.parse(data);
    const budgetDto = createBudgetDto(validatedData, user.id);

    const { affectedRows, budget } = await budgetRepository.create(budgetDto);

    if (!affectedRows || !budget) {
      return {
        error:
          "There was a problem while creating your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redisService.hset(getBudgetKey(budget.id), budget),
    ]);

    return {
      data: budget,
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
  budgetId: number,
  values: BudgetSchemaType
): Promise<IValidatedResponse<BudgetSelectModel>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  let budgetToBeUpdated: BudgetSelectModel | null;

  const budgetFromCache = await redisService.hgetall(getBudgetKey(budgetId));

  if (budgetFromCache) {
    console.log("UPDATE Budget CACHE HIT");
    budgetToBeUpdated = mapRedisHashToBudget(budgetFromCache);
  } else {
    console.log("UPDATE Budget CACHE MISS");
    budgetToBeUpdated = await budgetRepository.getById(budgetId);
  }

  if (!budgetToBeUpdated)
    return { error: `Budget to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = budgetSchema.parse(values);

    const updateBudgetDto = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    const { affectedRows, updatedBudget } = await budgetRepository.update(
      budgetId,
      updateBudgetDto
    );

    if (affectedRows === 0 || !updatedBudget) {
      return {
        error:
          "There was a problem while trying to update your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redisService.hset(getBudgetKey(updatedBudget.id), updatedBudget),
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

  const cacheKey = getPaginatedBudgetsKey({
    userId: user.id,
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
  });

  const cachedData = await redisService.get(cacheKey);
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

  const { budgets, totalCount } = await budgetRepository.getMultiple({
    userId: user.id,
    query,
    category,
    sortBy,
    sortDirection,
    page: pageNumber,
  });

  if (budgets.length === 0) {
    return {
      budgets: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  await redisService.set(cacheKey, JSON.stringify({ budgets, totalCount }));

  return {
    budgets: budgets,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};

export const deleteBudget = async (budgetId: number) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const affectedRows = await budgetRepository.deleteById(budgetId);

    if (affectedRows === 0) {
      return {
        error: "We encountered a problem while deleting the budget.",
      };
    }

    await Promise.all([
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redisService.del(getBudgetKey(budgetId)),
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
