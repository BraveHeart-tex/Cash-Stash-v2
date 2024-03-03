"use server";
import { getUser } from "@/lib/auth/session";
import { processZodError } from "@/lib/utils";
import goalSchema, { GoalSchemaType } from "@/schemas/goal-schema";
import { Goal } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IValidatedResponse,
  IGetPaginatedGoalsParams,
  IGetPaginatedGoalsResponse,
} from "@/actions/types";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getGoalKey,
  getPaginatedGoalsKeys,
  invalidateKeysByPrefix,
  mapRedisHashToGoal,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import { createGoalDto } from "@/lib/database/dto/goalDto";
import goalRepository from "@/lib/database/goalRepository";

export const createGoal = async (
  values: GoalSchemaType
): Promise<IValidatedResponse<Goal>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = goalSchema.parse(values);
    const goalDto = createGoalDto(validatedData, user.id);

    const affectedRows = await goalRepository.create(goalDto);

    if (affectedRows === 0) {
      return {
        error:
          "There was a problem while creating your goal. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
      redis.hset(getGoalKey(goalDto.id), goalDto),
    ]);

    return {
      data: goalDto,
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "There was a problem while creating your goal. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const updateGoal = async (
  goalId: string,
  values: GoalSchemaType
): Promise<IValidatedResponse<Goal>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  let goalToBeUpdated: Goal | null;

  const goalFromCache = await redis.hgetall(getGoalKey(goalId));
  if (goalFromCache) {
    goalToBeUpdated = mapRedisHashToGoal(goalFromCache);
  } else {
    const goal = await goalRepository.getById(goalId);

    goalToBeUpdated = goal;
  }

  if (!goalToBeUpdated)
    return { error: `Goal to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = goalSchema.parse(values);
    const updatedGoalDto = {
      ...validatedData,
      id: goalId,
      updatedAt: new Date(),
    } as Goal;

    const { affectedRows, updatedGoal } =
      await goalRepository.update(updatedGoalDto);

    if (affectedRows === 0 || !updatedGoal)
      return {
        error:
          "There was a problem while trying to update your goal. Please try again later.",
        fieldErrors: [],
      };

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
      redis.hset(getGoalKey(updatedGoalDto.id), updatedGoalDto),
    ]);

    return { data: updatedGoalDto, fieldErrors: [] };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    console.error(error);
    return {
      error:
        "There was a problem while updating your goal. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const getPaginatedGoals = async ({
  pageNumber,
  query,
  sortBy,
  sortDirection,
}: IGetPaginatedGoalsParams): Promise<IGetPaginatedGoalsResponse> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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

    const cachedGoals = await redis.get(cacheKey);
    if (cachedGoals) {
      console.log("PAGINATED GOALS CACHE HIT");
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

    await redis.set(cacheKey, JSON.stringify({ goals, totalCount }));

    return {
      goals: goals,
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (error) {
    console.error(error);
    return {
      goals: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }
};

export const deleteGoal = async (goalId: string) => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const affectedRows = await goalRepository.deleteById(goalId);

    if (affectedRows === 0) {
      return {
        error:
          "There was a problem while deleting your goal. Please try again later.",
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
      redis.del(getGoalKey(goalId)),
    ]);

    return { data: "Goal deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      error:
        "There was a problem while deleting your goal. Please try again later.",
    };
  }
};
