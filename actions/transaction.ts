"use server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/lib/session";
import { processZodError } from "@/lib/utils";

import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { Prisma, Transaction } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { IValidatedResponse } from "./types";

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    redirect("/login");
  }

  try {
    const validatedData = transactionSchema.parse(values);
    const account = await prisma.account.findUnique({
      where: {
        id: validatedData.accountId,
      },
    });

    if (!account) {
      return {
        error: "Account not found",
        fieldErrors: [],
      };
    }

    const balance = account.balance + validatedData.amount;

    const newTransaction = prisma.transaction.create({
      data: {
        ...validatedData,
        userId: currentUser.id,
      },
    });

    const updatedAccount = prisma.account.update({
      where: {
        id: validatedData.accountId,
      },
      data: {
        balance,
      },
    });

    // eslint-disable-next-line no-unused-vars
    const [_, transaction] = await prisma.$transaction([
      updatedAccount,
      newTransaction,
    ]);

    return {
      data: transaction,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "A problem occurred while creating the transaction. Please try again later.",
      fieldErrors: [],
    };
  }
};

// TODO: Handle the case when we need to update the account balance if the user edits the accountId
export const updateTransaction = async (
  transactionId: string,
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);
  if (!currentUser) {
    redirect("/login");
  }

  try {
    const validatedData = transactionSchema.parse(values);

    const updatedTransaction = prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        ...validatedData,
      },
    });

    const updatedAccount = prisma.account.update({
      where: {
        id: validatedData.accountId,
      },
      data: {
        balance: {
          increment: validatedData.amount,
        },
      },
    });

    // eslint-disable-next-line no-unused-vars
    const [_, transaction] = await prisma.$transaction([
      updatedAccount,
      updatedTransaction,
    ]);

    return {
      data: transaction,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "A problem occurred while updating the transaction. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const deleteTransactionById = async (transactionId: string) => {
  try {
    if (!transactionId) {
      throw new Error("Transaction ID not found.");
    }

    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    if (!deletedTransaction) {
      throw new Error("Error deleting transaction.");
    }

    const wasIncome = deletedTransaction.amount > 0;
    const updateBalance = wasIncome
      ? { decrement: deletedTransaction.amount }
      : { increment: deletedTransaction.amount };

    await prisma.account.update({
      where: {
        id: deletedTransaction.accountId,
      },
      data: {
        balance: updateBalance,
      },
    });

    return {
      transaction: deletedTransaction,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : error };
  }
};

// TODO: Change this to the new system
export const getPaginatedTransactions = async ({
  transactionType,
  accountId,
  sortBy,
  sortDirection,
}: {
  transactionType: "income" | "expense" | "all";
  accountId?: string | null;
  sortBy: "amount" | "createdAt";
  sortDirection: "asc" | "desc";
}) => {
  try {
    const currentUser = await getCurrentUser(cookies().get("token")?.value!);
    if (!currentUser) {
      return { error: "You are not authorized to perform this action." };
    }

    const whereCondition: Prisma.TransactionWhereInput = {
      userId: currentUser.id,
    };

    if (transactionType === "income") {
      whereCondition.amount = {
        gt: 0,
      };
    }

    if (transactionType === "expense") {
      whereCondition.amount = {
        lt: 0,
      };
    }

    if (accountId) {
      whereCondition.accountId = accountId;
    }

    const result = await prisma.transaction.findMany({
      where: whereCondition,
      orderBy: {
        [sortBy]: sortDirection,
      },
      include: {
        account: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      transactions: result,
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred." };
  }
};
