"use server";
import { GoalSchemaType, getGoalSchema } from "@/schemas/goal-schema";
import { ZodError } from "zod";
import {
  generateCachePrefixWithUserId,
  getGoalKey,
  getPaginatedGoalsKeys,
  mapRedisHashToGoal,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES } from "@/lib/constants";
import goalRepository from "@/lib/database/repository/goalRepository";
import redisService from "@/lib/redis/redisService";
import { GoalSelectModel } from "@/lib/database/schema";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";
import {
  CreateGoalReturnType,
  DeleteGoalReturnType,
  GetPaginatedGoalsParams,
  GetPaginatedGoalsReturnType,
  UpdateGoalReturnType,
} from "@/typings/goals";
import { authenticatedAction } from "@/lib/auth/authUtils";
import { getTranslations } from "next-intl/server";

const getGoalSchemaWithTranslations = async () => {
  const zodT = await getTranslations("Zod.Goal");
  return getGoalSchema({
    currentAmountRequired: zodT("currentAmountRequired"),
    currentAmountTooSmall: zodT("currentAmountTooSmall"),
    goalAmountRequired: zodT("goalAmountRequired"),
    goalAmountTooSmall: zodT("goalAmountTooSmall"),
    nameRequired: zodT("nameRequired"),
    nameTooLong: zodT("nameTooLong"),
  });
};

export const createGoal = authenticatedAction<
  CreateGoalReturnType,
  GoalSchemaType
>(async (values, { user }) => {
  const actionT = await getTranslations("Actions.Goal.createGoal");
  try {
    const goalSchema = await getGoalSchemaWithTranslations();
    const validatedData = goalSchema.parse(values);
    const goalDto = {
      ...validatedData,
      userId: user.id,
    };

    const { affectedRows, goal } = await goalRepository.create(goalDto);

    if (!affectedRows || !goal) {
      return {
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysStartingWith(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
      redisService.hset(getGoalKey(goal.id), goal),
    ]);

    return {
      data: goal,
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

export const updateGoal = authenticatedAction<
  UpdateGoalReturnType,
  GoalSchemaType & { goalId: number }
>(async ({ goalId, ...values }, { user }) => {
  const actionT = await getTranslations("Actions.Goal.updateGoal");
  let goalToBeUpdated: GoalSelectModel | null;

  const goalFromCache = await redisService.hgetall(getGoalKey(goalId));
  if (goalFromCache) {
    goalToBeUpdated = mapRedisHashToGoal(goalFromCache);
  } else {
    goalToBeUpdated = await goalRepository.getById(goalId);
  }

  if (!goalToBeUpdated)
    return { error: actionT("goalNotFound"), fieldErrors: [] };

  try {
    const goalSchema = await getGoalSchemaWithTranslations();
    const validatedData = goalSchema.parse(values);

    const { affectedRows, updatedGoal } = await goalRepository.update(
      goalId,
      validatedData
    );

    if (affectedRows === 0 || !updatedGoal)
      return {
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };

    await Promise.all([
      redisService.invalidateKeysStartingWith(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
      redisService.hset(getGoalKey(updatedGoal.id), updatedGoal),
    ]);

    return { data: updatedGoal, fieldErrors: [] };
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

export const getPaginatedGoals = authenticatedAction<
  GetPaginatedGoalsReturnType,
  GetPaginatedGoalsParams
>(async ({ pageNumber, query, sortBy, sortDirection }, { user }) => {
  try {
    const PAGE_SIZE = 12;
    const skipAmount = (pageNumber - 1) * PAGE_SIZE;

    const cacheKey = getPaginatedGoalsKeys({
      userId: user.id,
      pageNumber,
      query,
      sortBy,
      sortDirection,
    });

    const cachedGoals = await redisService.get(cacheKey);
    if (cachedGoals) {
      logger.info("PAGINATED GOALS CACHE HIT");
      const parsedCacheData = JSON.parse(cachedGoals);
      return {
        goals: parsedCacheData.goals,
        hasNextPage: parsedCacheData.totalCount > skipAmount + PAGE_SIZE,
        hasPreviousPage: pageNumber > 1,
        currentPage: pageNumber,
        totalPages: Math.ceil(parsedCacheData.totalCount / PAGE_SIZE),
      };
    }

    const { goals, totalCount } = await goalRepository.getMultiple({
      page: pageNumber,
      userId: user.id,
      query,
      sortBy,
      sortDirection,
    });

    if (goals.length === 0) {
      return {
        goals: [],
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        totalPages: 1,
      };
    }

    await redisService.set(cacheKey, JSON.stringify({ goals, totalCount }));

    return {
      goals: goals,
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (error) {
    logger.error(error);
    return {
      goals: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }
});

export const deleteGoal = authenticatedAction<DeleteGoalReturnType, number>(
  async (goalId, { user }) => {
    const actionT = await getTranslations("Actions.Goal.deleteGoal");
    try {
      const affectedRows = await goalRepository.deleteById(goalId);

      if (affectedRows === 0) {
        return {
          error: actionT("internalErrorMessage"),
        };
      }

      await Promise.all([
        redisService.invalidateKeysStartingWith(
          generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
        ),
        redisService.del(getGoalKey(goalId)),
      ]);

      return { data: actionT("goalDeletedSuccessfully") };
    } catch (error) {
      logger.error(error);
      return {
        error: actionT("internalErrorMessage"),
      };
    }
  }
);
