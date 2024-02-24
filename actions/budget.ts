"use server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import { CreateBudgetSchemaType } from "@/schemas/CreateBudgetSchema";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";
import { Budget, BudgetCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IValidatedResponse,
  IGetPaginatedBudgetsParams,
  IGetPaginatedBudgetsResponse,
} from "@/actions/types";
import redis, {
  getBudgetKey,
  getPaginatedBudgetsKey,
  invalidateKeysByPrefix,
} from "@/lib/redis";
import { CACHE_PREFIXES } from "@/lib/constants";

export const createBudget = async (
  data: CreateBudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  const { user } = await getUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedData = budgetSchema.parse(data);

    const createdBudget = await prisma.budget.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    if (!createdBudget) {
      return {
        error:
          "There was a problem while creating your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_BUDGETS),
      redis.hset(getBudgetKey(createdBudget.id), createdBudget),
    ]);

    return {
      data: createdBudget,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return { error: "An error occurred.", fieldErrors: [] };
  }
};

export const updateBudget = async (
  budgetId: string,
  values: BudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  let budgetToBeUpdated: Budget | null = null;

  const budgetFromCache = await redis.hgetall(getBudgetKey(budgetId));

  if (budgetFromCache) {
    console.log("budgetFromCache", budgetFromCache);
    // TODO: Fix this
    budgetToBeUpdated = JSON.parse(budgetFromCache);
  } else {
    budgetToBeUpdated = await prisma.budget.findUnique({
      where: { id: budgetId },
    });
  }

  if (!budgetToBeUpdated)
    return { error: `Budget to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = budgetSchema.parse(values);

    const updatedBudget = await prisma.budget.update({
      where: { id: budgetId, userId: budgetToBeUpdated.userId },
      data: validatedData,
    });

    if (!updatedBudget)
      return {
        error:
          "There was a problem while trying to update your budget. Please try again later.",
        fieldErrors: [],
      };

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_BUDGETS),
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
    redirect("/login");
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

  const categoryCondition = category ? { category } : {};
  const sortByCondition = sortBy
    ? { orderBy: { [sortBy]: sortDirection || "asc" } }
    : {};

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

  const [budgets, totalCount] = await Promise.all([
    prisma.budget.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: user?.id,
        name: {
          contains: query,
        },
        ...categoryCondition,
      },
      orderBy: sortByCondition?.orderBy,
    }),
    prisma.budget.count({
      where: {
        userId: user?.id,
        name: {
          contains: query,
        },
        ...categoryCondition,
      },
    }),
  ]);

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
    budgets,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};
