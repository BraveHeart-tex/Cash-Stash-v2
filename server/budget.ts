"use server";
import { BudgetSchemaType, getBudgetSchema } from "@/schemas/budget-schema";
import { BudgetSelectModel } from "@/lib/database/schema";
import { ZodError } from "zod";
import {
  generateCachePrefixWithUserId,
  getBudgetKey,
  getPaginatedBudgetsKey,
  mapRedisHashToBudget,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES } from "@/lib/constants";
import budgetRepository from "@/lib/database/repository/budgetRepository";
import redisService from "@/lib/redis/redisService";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";
import {
  CreateBudgetReturnType,
  DeleteBudgetReturnType,
  GetPaginatedBudgetsParams,
  GetPaginatedBudgetsReturnType,
  UpdateBudgetReturnType,
} from "@/typings/budgets";
import { getTranslations } from "next-intl/server";
import { authenticatedAction } from "@/lib/auth/authUtils";

export const createBudget = authenticatedAction<
  CreateBudgetReturnType,
  BudgetSchemaType
>(async (data, { user }) => {
  const actionT = await getTranslations("Actions.Budget.createBudget");

  try {
    const zodT = await getTranslations("Zod.Budget");
    const budgetSchema = getBudgetSchema({
      blankName: zodT("blankName"),
      budgetAmountRequired: zodT("budgetAmountRequired"),
      budgetAmountInvalid: zodT("budgetAmountInvalid"),
      budgetAmountPositive: zodT("budgetAmountPositive"),
      budgetCategoryRequired: zodT("budgetCategoryRequired"),
      spentAmountNegative: zodT("spentAmountNegative"),
    });
    const validatedData = budgetSchema.parse(data);
    const budgetDto = {
      ...validatedData,
      userId: user.id,
    };

    const { affectedRows, budget } = await budgetRepository.create(budgetDto);

    if (!affectedRows || !budget) {
      return {
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysStartingWith(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redisService.hset(getBudgetKey(budget.id), budget),
    ]);

    return {
      data: budget,
      fieldErrors: [],
    };
  } catch (error) {
    logger.error(error);
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error: actionT("internalErrorMessage"),
      fieldErrors: [],
    };
  }
});

export const updateBudget = authenticatedAction<
  UpdateBudgetReturnType,
  BudgetSchemaType & { budgetId: number }
>(async ({ budgetId, ...values }, { user }) => {
  let budgetToBeUpdated: BudgetSelectModel | null;

  const budgetFromCache = await redisService.hgetall(getBudgetKey(budgetId));

  if (budgetFromCache) {
    logger.info("UPDATE Budget CACHE HIT");
    budgetToBeUpdated = mapRedisHashToBudget(budgetFromCache);
  } else {
    logger.info("UPDATE Budget CACHE MISS");
    budgetToBeUpdated = await budgetRepository.getById(budgetId);
  }

  const actionT = await getTranslations("Actions.Budget.updateBudget");

  if (!budgetToBeUpdated)
    return { error: actionT("budgetNotFound"), fieldErrors: [] };

  try {
    const zodT = await getTranslations("Zod.Budget");
    const budgetSchema = getBudgetSchema({
      blankName: zodT("blankName"),
      budgetAmountRequired: zodT("budgetAmountRequired"),
      budgetAmountInvalid: zodT("budgetAmountInvalid"),
      budgetAmountPositive: zodT("budgetAmountPositive"),
      budgetCategoryRequired: zodT("budgetCategoryRequired"),
      spentAmountNegative: zodT("spentAmountNegative"),
    });
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
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysStartingWith(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_BUDGETS, user.id)
      ),
      redisService.hset(getBudgetKey(updatedBudget.id), updatedBudget),
    ]);

    return { data: updatedBudget, fieldErrors: [] };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    logger.error(error);
    return {
      error: actionT("internalErrorMessage"),
      fieldErrors: [],
    };
  }
});

export const getPaginatedBudgets = authenticatedAction<
  GetPaginatedBudgetsReturnType,
  GetPaginatedBudgetsParams
>(async (paginationParams, { user }) => {
  const { pageNumber, query, category, sortBy, sortDirection } =
    paginationParams;
  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

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
    logger.info("Budgets CACHE HIT");
    return {
      budgets: JSON.parse(cachedData).budgets,
      hasNextPage: JSON.parse(cachedData).totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(JSON.parse(cachedData).totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  }

  logger.info("Budgets CACHE MISS");

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
});

export const deleteBudget = authenticatedAction<DeleteBudgetReturnType, number>(
  async (budgetId, { user }) => {
    try {
      const affectedRows = await budgetRepository.deleteById(budgetId);

      if (affectedRows === 0) {
        return {
          error: "We encountered a problem while deleting the budget.",
        };
      }

      await Promise.all([
        redisService.invalidateKeysStartingWith(
          generateCachePrefixWithUserId(
            CACHE_PREFIXES.PAGINATED_BUDGETS,
            user.id
          )
        ),
        redisService.del(getBudgetKey(budgetId)),
      ]);

      return {
        data: "Budget deleted successfully.",
      };
    } catch (error) {
      logger.error(error);
      return {
        error: "We encountered a problem while deleting the budget.",
      };
    }
  }
);
