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
import prisma from "@/lib/data/db";
import redis from "@/lib/redis";
import {
  getGoalKey,
  getPaginatedGoalsKeys,
  invalidateKeysByPrefix,
  mapRedisHashToGoal,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES } from "@/lib/constants";

export const createGoal = async (
  values: GoalSchemaType
): Promise<IValidatedResponse<Goal>> => {
  const { user } = await getUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedData = goalSchema.parse(values);

    const createdGoal = await prisma.goal.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    if (!createdGoal) {
      return {
        error:
          "There was a problem while creating your goal. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_GOALS),
      redis.hset(getGoalKey(createdGoal.id), createdGoal),
    ]);

    return {
      data: createdGoal,
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
    redirect("/login");
  }

  let goalToBeUpdated: Goal | null = null;

  const goalFromCache = await redis.hgetall(getGoalKey(goalId));
  if (goalFromCache) {
    goalToBeUpdated = mapRedisHashToGoal(goalFromCache);
  } else {
    goalToBeUpdated = await prisma.goal.findUnique({
      where: { id: goalId },
    });
  }

  if (!goalToBeUpdated)
    return { error: `Goal to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = goalSchema.parse(values);

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId, userId: goalToBeUpdated.userId },
      data: validatedData,
    });

    if (!updatedGoal)
      return {
        error:
          "There was a problem while trying to update your goal. Please try again later.",
        fieldErrors: [],
      };

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_GOALS),
      redis.hset(getGoalKey(updatedGoal.id), updatedGoal),
    ]);

    return { data: updatedGoal, fieldErrors: [] };
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
    redirect("/login");
  }

  try {
    const PAGE_SIZE = 12;
    const skipAmount = (pageNumber - 1) * PAGE_SIZE;
    const orderByCondition =
      sortBy && sortDirection
        ? {
            orderBy: {
              [sortBy]: sortDirection,
            },
          }
        : {};

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

    const [goals, totalCount] = await Promise.all([
      prisma.goal.findMany({
        skip: skipAmount,
        take: PAGE_SIZE,
        where: {
          userId: user?.id,
          name: {
            contains: query,
          },
        },
        orderBy: orderByCondition?.orderBy,
      }),
      prisma.goal.count({
        where: {
          userId: user?.id,
          name: {
            contains: query,
          },
        },
      }),
    ]);

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
      goals,
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
    redirect("/login");
  }

  try {
    const deletedGoal = await prisma.goal.delete({
      where: { id: goalId },
    });

    if (!deletedGoal) {
      return {
        error:
          "There was a problem while deleting your goal. Please try again later.",
      };
    }

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_GOALS),
      redis.del(getGoalKey(goalId)),
    ]);

    return { data: deletedGoal };
  } catch (error) {
    console.error(error);
    return {
      error:
        "There was a problem while deleting your goal. Please try again later.",
    };
  }
};
