"use server";
import prisma from "@/lib/database/db";
import { getUser } from "@/lib/auth/session";
import { EditReminderSchema } from "@/schemas";
import { MONTHS_OF_THE_YEAR, PAGE_ROUTES } from "@/lib/constants";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import CreateReminderSchema, {
  CreateReminderSchemaType,
} from "@/schemas/CreateReminderSchema";
import { redirect } from "next/navigation";

export const fetchMonthlyTransactionsData = async () => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const aggregateByType = async (isIncome: boolean) => {
    const amountQuery = isIncome ? { gt: 0 } : { lt: 0 };
    const transactions = await prisma.transaction.groupBy({
      by: ["createdAt"],
      where: {
        userId: user.id,
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
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const aggregateTransaction = async (isIncome: boolean) => {
    const amountQuery = isIncome ? { gt: 0 } : { lt: 0 };
    const result = await prisma.transaction.aggregate({
      where: {
        userId: user.id,
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
    const { user } = await getUser();

    if (!user) {
      redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
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
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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

  const createdReminder = await prisma.reminder.create({
    data: {
      description: data.description,
      reminderDate: data.reminderDate,
      title: data.title,
      userId: user.id,
    },
  });

  if (!createdReminder) {
    return { error: "Error creating reminder." };
  }

  return {
    reminder: createdReminder,
  };
};
