"use server";

import {
  CreateGenericInput,
  CreateGenericWithCurrentUserInput,
  IGenericParams,
  TableMap,
  TableName,
  UpdateGenericInput,
} from "@/lib/utils";

import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { getCurrentUserAction } from ".";

const TABLE_MAP: TableMap = {
  userAccount: prisma.userAccount,
  transaction: prisma.transaction,
  budget: prisma.budget,
  goal: prisma.goal,
  reminder: prisma.reminder,
};

export const getTable = async (tableName: TableName) => {
  const table = TABLE_MAP[tableName];

  if (!table) {
    throw new Error("Table not found");
  }

  return table as Prisma.GoalDelegate<DefaultArgs> &
    Prisma.BudgetDelegate<DefaultArgs> &
    Prisma.UserAccountDelegate<DefaultArgs> &
    Prisma.ReminderDelegate<DefaultArgs> &
    Prisma.TransactionDelegate<DefaultArgs>;
};

export const getGeneric = async <T>({
  tableName,
  whereCondition,
  selectCondition,
}: IGenericParams<T>) => {
  try {
    const table = await getTable(tableName);

    const queryOptions = {
      where: whereCondition,
      select: selectCondition,
    };

    const result = await table.findFirst(queryOptions);

    return result ? { data: result as T } : { error: "Not found" };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const getGenericList = async <T>({
  tableName,
  whereCondition,
  selectCondition,
}: IGenericParams<T>) => {
  try {
    const table = await getTable(tableName);

    const queryOptions = {
      where: whereCondition,
      select: selectCondition,
    };

    const result = await table.findMany(queryOptions);

    return result ? { data: result as T[] } : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const deleteGeneric = async <T>({
  tableName,
  isMany,
  whereCondition,
}: IGenericParams<T> & {
  isMany?: boolean;
}) => {
  try {
    const table = await getTable(tableName);
    const result = whereCondition
      ? // @ts-ignore
        await table.delete({ where: whereCondition })
      : isMany
      ? await table.deleteMany()
      : null;

    return result ? { data: result as T } : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const createGenericWithCurrentUser = async <T>({
  tableName,
  data,
}: IGenericParams<T> & { data: CreateGenericWithCurrentUserInput<T> }) => {
  try {
    const table = await getTable(tableName);
    const currentUser = await getCurrentUserAction();

    if (currentUser.error || !currentUser.user) {
      throw new Error("User not found");
    }

    const result = await table.create({
      // @ts-ignore
      data: {
        ...data,
        userId: currentUser.user.id,
      },
    });

    return result ? { data: result as T } : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const updateGeneric = async <T>({
  tableName,
  whereCondition,
  data,
}: IGenericParams<T> & {
  data: UpdateGenericInput<T>;
}) => {
  try {
    const table = await getTable(tableName);

    const result = await table.update({
      data,
      // @ts-ignore
      where: whereCondition,
    });

    return result ? { data: result as T } : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const createGeneric = async <T>({
  tableName,
  data,
  selectCondition,
}: IGenericParams<T> & {
  data: CreateGenericInput<T>;
}) => {
  try {
    const table = await getTable(tableName);

    const result = await table.create({
      // @ts-ignore
      data,
      select: selectCondition,
    });

    return result ? { data: result as T } : null;
  } catch (error) {
    return { error: error instanceof Error ? error.message : error };
  }
};

export const getGenericListByCurrentUser = async <T>({
  tableName,
  whereCondition,
  selectCondition,
  serialize = false,
}: IGenericParams<T> & {
  serialize?: boolean;
}) => {
  try {
    const table = await getTable(tableName);
    const currentUserResult = await getCurrentUserAction();

    if (currentUserResult.error || !currentUserResult.user) {
      throw new Error("User not found");
    }

    const queryOptions = {
      where: {
        ...whereCondition,
        userId: currentUserResult.user.id,
      },
      select: selectCondition,
    };

    const result = await table.findMany(queryOptions);

    if (serialize) {
      return result.length
        ? {
            data: result.map((item) => ({
              ...item,
              createdAt: item.createdAt.toLocaleDateString(),
              updatedAt: item.updatedAt.toLocaleDateString(),
            })) as T[],
          }
        : null;
    }

    return result.length
      ? {
          data: result as T[],
        }
      : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};
