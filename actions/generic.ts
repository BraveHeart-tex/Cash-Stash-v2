"use server";

import {
  SelectCondition,
  TableMap,
  TableName,
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

export const getGeneric = async <T>(
  tableName: TableName,
  whereCondition?: WhereCondition,
  selectCondition?: SelectCondition
) => {
  try {
    const table = getTable(tableName);

    const queryOptions: {
      where?: WhereCondition;
      select?: SelectCondition;
    } = {};

    if (whereCondition) {
      queryOptions.where = whereCondition;
    }

    if (selectCondition) {
      queryOptions.select = selectCondition;
    }

    const result = await table.findFirst(queryOptions);

    if (!result) {
      return {
        error: "Not found",
      };
    }

    return {
      data: result as T,
    };
  } catch (error) {
    console.error(error instanceof Error ? error : error);
    return {
      error: error instanceof Error ? error.message : error,
    };
  }
};

export const getgenericList = async <T>(
  tableName: TableName,
  whereCondition?: WhereCondition,
  selectCondition?: SelectCondition
) => {
  try {
    const table = getTable(tableName);

    if (whereCondition) {
      const result = await table.findMany({
        where: whereCondition,
      });

      if (!result || result.length === 0) {
        return null;
      }

      return result as T[];
    } else if (selectCondition) {
      const result = await table.findMany({
        select: selectCondition,
      });

      if (!result || result.length === 0) {
        return null;
      }

      return result as T[];
    } else if (whereCondition && selectCondition) {
      const result = await table.findMany({
        where: whereCondition,
        select: selectCondition,
      });

      if (!result || result.length === 0) {
        return null;
      }

      return result as T[];
    } else {
      const result = await table.findMany();

      if (!result || result.length === 0) {
        return null;
      }

      return result as T[];
    }
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};

export const deleteGeneric = async <T>(
  tableName: TableName,
  isMany: boolean,
  whereCondition?: WhereCondition
) => {
  try {
    const table = getTable(tableName);

    if (whereCondition) {
      const result = await table.delete({
        // @ts-ignore
        where: whereCondition,
      });

      if (!result) {
        return null;
      }

      return result as T;
    } else if (isMany) {
      const result = await table.deleteMany();

      if (!result) {
        return null;
      }

      return result as T;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};

export const updateGeneric = async <T>(
  tableName: TableName,
  whereCondition: WhereCondition
) => {
  try {
    const table = getTable(tableName);

    const result = await table.update({
      // @ts-ignore
      where: whereCondition,
    });

    if (!result) {
      return null;
    }

    return result as T;
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};

export const createGeneric = async <T>(
  tableName: TableName,
  data: {
    [key in keyof Omit<T, "id" | "createdAt" | "updatedAt">]: T[key];
  },
  selectOptions?: SelectCondition
) => {
  try {
    const table = getTable(tableName);

    const result = await table.create({
      // @ts-ignore
      data,
      select: selectOptions,
    });

    if (!result) {
      return null;
    }

    return result as T;
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};
