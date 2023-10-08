"use server";

import {
  CreateGenericInput,
  IGenericParams,
  TableMap,
  TableName,
  UpdateGenericInput,
  WhereCondition,
} from "@/lib/utils";

import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const TABLE_MAP: TableMap = {
  userAccount: prisma.userAccount,
  transaction: prisma.transaction,
  budget: prisma.budget,
  goal: prisma.goal,
  reminder: prisma.reminder,
};

const getTable = (tableName: TableName) => {
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
    const table = getTable(tableName);

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
    const table = getTable(tableName);

    const queryOptions = {
      where: whereCondition,
      select: selectCondition,
    };

    const result = await table.findMany(queryOptions);

    return result ? (result as T[]) : null;
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : error };
  }
};

export const deleteGeneric = async <T>(
  tableName: TableName,
  isMany: boolean,
  whereCondition?: WhereCondition<T>
) => {
  try {
    const table = getTable(tableName);
    const result = whereCondition
      ? // @ts-ignore
        await table.delete({ where: whereCondition })
      : isMany
      ? await table.deleteMany()
      : null;

    return result || null;
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
    const table = getTable(tableName);

    const result = await table.update({
      data,
      // @ts-ignore
      where: whereCondition,
    });

    return result || null;
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
    const table = getTable(tableName);

    const result = await table.create({
      // @ts-ignore
      data,
      select: selectCondition,
    });

    return result || null;
  } catch (error) {
    console.log(error);
    return { error };
  }
};
