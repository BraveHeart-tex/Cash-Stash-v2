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
} from "@/data/types";
import prisma from "@/lib/data/db";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getGoalKey,
  getPaginatedGoalsKeys,
  invalidateKeysByPrefix,
  mapRedisHashToGoal,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import { createId } from "@paralleldrive/cuid2";
import connection from "@/lib/data/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createGoal = async (
  values: GoalSchemaType
): Promise<IValidatedResponse<Goal>> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = goalSchema.parse(values);
    const createGoalDto = {
      ...validatedData,
      id: createId(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createGoalResponse] = await connection.query<ResultSetHeader>(
      "INSERT INTO GOAL (id, name, goalAmount, currentAmount, progress,userId, createdAt, updatedAt) VALUES(:id , :name, :goalAmount, :currentAmount, :progress, :userId, :createdAt, :updatedAt)",
      createGoalDto
    );

    if (createGoalResponse.affectedRows === 0) {
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
      redis.hset(getGoalKey(createGoalDto.id), createGoalDto),
    ]);

    return {
      data: createGoalDto,
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
    const [goalResponse] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM GOAL WHERE id = :id",
      { id: goalId }
    );

    goalToBeUpdated = goalResponse[0] as Goal;
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

    const [updateGoalResult] = await connection.query<ResultSetHeader>(
      "UPDATE GOAL set name = :name, goalAmount = :goalAmount, currentAmount = :currentAmount, progress = :progress, updatedAt = :updatedAt WHERE id = :id",
      updatedGoalDto
    );

    if (updateGoalResult.affectedRows === 0)
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
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
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
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(CACHE_PREFIXES.PAGINATED_GOALS, user.id)
      ),
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
