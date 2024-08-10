"use server";
import { authenticatedActionWithNoParams } from "@/lib/auth/authUtils";
import { MONTHS_OF_THE_YEAR } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { transactions } from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import { and, eq, gt, lt, sql } from "drizzle-orm";

export const fetchMonthlyTransactionsData = authenticatedActionWithNoParams(
  async (user) => {
    const aggregateByType = async (isIncome: boolean) => {
      const amountQuery = isIncome
        ? gt(transactions.amount, 0)
        : lt(transactions.amount, 0);

      const transactionsSum = await db
        .select({
          createdAt: transactions.createdAt,
          sumAmount: sql<number>`SUM(amount)`.as("sum_amount"),
        })
        .from(transactions)
        .where(and(eq(transactions.userId, user.id), amountQuery))
        .groupBy(transactions.createdAt);

      return transactionsSum.map((transaction) => ({
        month: MONTHS_OF_THE_YEAR[new Date(transaction.createdAt).getMonth()],
        amount: transaction.sumAmount || 0,
      }));
    };

    const incomes = await aggregateByType(true);
    const expenses = await aggregateByType(false);

    return { incomes, expenses };
  },
);

export const fetchInsightsDataAction = authenticatedActionWithNoParams(
  async (user) => {
    const aggregateTransaction = async (isIncome: boolean) => {
      const amountQuery = isIncome
        ? gt(transactions.amount, 0)
        : lt(transactions.amount, 0);

      const [result] = await db
        .select({
          sumAmount: sql<number>`SUM(amount)`.as("sum_amount"),
        })
        .from(transactions)
        .where(and(eq(transactions.userId, user.id), amountQuery));

      return Math.abs(result.sumAmount);
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
  },
);

export const getChartData = authenticatedActionWithNoParams(async (user) => {
  try {
    const transactionsResult = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id));

    const dataMap = transactionsResult.reduce((map, transaction) => {
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
    logger.error("Error fetching chart data", error);
    return { error: "An error occurred." };
  }
});
