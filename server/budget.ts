"use server";
import { getUser } from "@/lib/auth/session";
import { BudgetSchemaType, getBudgetSchema } from "@/schemas/budget-schema";
import { BudgetSelectModel } from "@/lib/database/schema";
import { redirect } from "@/navigation";
import { ZodError } from "zod";
import {
  generateCachePrefixWithUserId,
  getBudgetKey,
  getPaginatedBudgetsKey,
  mapRedisHashToBudget,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import budgetRepository from "@/lib/database/repository/budgetRepository";
import redisService from "@/lib/redis/redisService";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";
import {
  CreateBudgetReturnType,
  GetPaginatedBudgetsParams,
  GetPaginatedBudgetsReturnType,
  UpdateBudgetReturnType,
} from "@/typings/budgets";
import { getTranslations } from "next-intl/server";

export const createBudget = async (
  data: BudgetSchemaType
): CreateBudgetReturnType => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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
    logger.error(error);
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error: actionT("internalErrorMessage"),
      fieldErrors: [],
    };
  }
};

export const updateBudget = async (
  budgetId: number,
  values: BudgetSchemaType
): UpdateBudgetReturnType => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  let budgetToBeUpdated: BudgetSelectModel | null;

  const budgetFromCache = await redisService.hgetall(getBudgetKey(budgetId));

  if (budgetFromCache) {
    logger.info("UPDATE Budget CACHE HIT");
    budgetToBeUpdated = mapRedisHashToBudget(budgetFromCache);
  } else {
    logger.info("UPDATE Budget CACHE MISS");
    budgetToBeUpdated = await budgetRepository.getById(budgetId);
  }

  if (!budgetToBeUpdated)
    return { error: `Budget to be updated cannot be found.`, fieldErrors: [] };

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

    logger.error(error);
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
}: GetPaginatedBudgetsParams): GetPaginatedBudgetsReturnType => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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
};

export const deleteBudget = async (budgetId: number) => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
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
    logger.error(error);
    return {
      error: "We encountered a problem while deleting the budget.",
    };
  }
};
