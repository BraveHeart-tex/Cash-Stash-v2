"use server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { EditReminderSchema } from "@/schemas";
import { cookies } from "next/headers";
import { MONTHS_OF_THE_YEAR } from "@/lib/utils";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import CreateReminderSchema, {
  CreateReminderSchemaType,
} from "@/schemas/CreateReminderSchema";

export const fetchMonthlyTransactionsData = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) return { error: "No user found." };

  const aggregateByType = async (isIncome: boolean) => {
    const amountQuery = isIncome ? { gt: 0 } : { lt: 0 };
    const transactions = await prisma.transaction.groupBy({
      by: ["createdAt"],
      where: {
        userId: currentUser.id,
        amount: amountQuery,
      },
      _sum: {
        amount: true,
      },
    });

    return transactions.map((transaction) => ({
      month: MONTHS_OF_THE_YEAR[new Date(transaction.createdAt).getMonth()],
      amount: transaction._sum.amount || 0,
    }));
  };

  const incomes = await aggregateByType(true);
  const expenses = await aggregateByType(false);

  return { incomes, expenses };
};

export const fetchInsightsDataAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) return { error: "No user found." };

  const aggregateTransaction = async (isIncome: boolean) => {
    const amountQuery = isIncome ? { gt: 0 } : { lt: 0 };
    const result = await prisma.transaction.aggregate({
      where: {
        userId: currentUser.id,
        amount: amountQuery,
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  };

  const totalIncome = await aggregateTransaction(true);
  const totalExpense = await aggregateTransaction(false);

  if (!totalIncome || !totalExpense)
    return { error: "Error calculating net income" };

  const netIncome = totalIncome - totalExpense;
  const savingsRate = ((netIncome / totalIncome) * 100).toFixed(0);

  return {
    totalIncome,
    totalExpense,
    netIncome,
    savingsRate,
  };
};

export const updateReminder = async ({
  reminderId,
  title,
  description,
  amount,
  reminderDate,
  isRead,
  isIncome,
}: EditReminderSchemaType & { reminderId: string }) => {
  if (!reminderId) return { error: "Reminder ID not found." };

  const result = EditReminderSchema.safeParse({
    title,
    description,
    amount,
    reminderDate,
    isRead,
    isIncome,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const reminderToBeUpdated = await prisma.reminder.findUnique({
    where: { id: reminderId },
  });

  if (!reminderToBeUpdated)
    return { error: "No reminder with the given reminder id was found." };

  // TODO: Mark as read functionality to a different action
  const updatedReminder = await prisma.reminder.update({
    data: result.data,
    where: { id: reminderId },
  });

  if (!updatedReminder) return { error: "Error updating reminder." };

  return { reminder: updatedReminder };
};

export const getChartData = async () => {
  try {
    const currentUser = await getCurrentUser(cookies().get("token")?.value!);

    if (!currentUser) {
      return { error: "No user found." };
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    const dataMap = transactions.reduce((map, transaction) => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${MONTHS_OF_THE_YEAR[month]} ${year}`;
      const entry = map.get(key) || { date: key, income: 0, expense: 0 };
      const isIncome = transaction.amount > 0;

      if (isIncome) {
        entry.income += transaction.amount;
      } else {
        entry.expense += transaction.amount;
      }

      map.set(key, entry);
      return map;
    }, new Map());

    const data = Array.from(dataMap.values());

    return {
      data,
    };
  } catch (error) {
    return { error: "An error occurred." };
  }
};

export const createReminder = async ({
  amount,
  description,
  isIncome,
  reminderDate,
  title,
  isRead,
}: CreateReminderSchemaType) => {
  const result = CreateReminderSchema.safeParse({
    amount,
    description,
    isIncome,
    reminderDate,
    title,
    isRead,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const { data } = result;
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "You are not authorized to perform this action." };
  }

  const createdReminder = await prisma.reminder.create({
    data: {
      description: data.description,
      reminderDate: data.reminderDate,
      title: data.title,
      userId: currentUser.id,
    },
  });

  if (!createdReminder) {
    return { error: "Error creating reminder." };
  }

  return {
    reminder: createdReminder,
  };
};
