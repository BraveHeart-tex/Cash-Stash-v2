"use server";

import { getCurrentUser } from "@/lib/session";
import { processZodError } from "@/lib/utils";
import goalSchema, { GoalSchemaType } from "@/schemas/goal-schema";
import { Goal } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { getUserSession } from "./auth";
import {
  IValidatedResponse,
  IGetPaginatedGoalsParams,
  IGetPaginatedGoalsResponse,
} from "./types";
import prisma from "@/lib/prismadb";

export const createGoal = async (
  values: GoalSchemaType
): Promise<IValidatedResponse<Goal>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return {
      error: "You are not authorized to perform this action.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = goalSchema.parse(values);

    const createdGoal = await prisma.goal.create({
      data: {
        ...validatedData,
        userId: currentUser.id,
      },
    });

    if (!createdGoal) {
      return {
        error:
          "There was a problem while creating your goal. Please try again later.",
        fieldErrors: [],
      };
    }

    return {
      data: createdGoal,
      fieldErrors: [],
    };
  } catch (error) {
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
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);
  if (!currentUser) {
    return {
      error: "You are not authorized to perform this action.",
      fieldErrors: [],
    };
  }

  const goalToBeUpdated = await prisma.goal.findUnique({
    where: { id: goalId },
  });

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
  const result = await getUserSession();
  if (result.error) {
    redirect("/login");
  }

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

  const [goals, totalCount] = await Promise.all([
    prisma.goal.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
      },
      orderBy: orderByCondition?.orderBy,
    }),
    prisma.goal.count({
      where: {
        userId: result.user?.id,
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

  return {
    goals,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};
