"use server";

import db from "@/app/libs/prismadb";
import { getCurrentUser, signToken } from "@/lib/session";
import { LoginSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { MONTHS_OF_THE_YEAR } from "@/lib/utils";
import CreateUserAccountSchema, {
  CreateUserAccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { UserAccountCategory } from "@prisma/client";

export const loginAction = async ({ email, password }: LoginSchemaType) => {
  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const { email: emailResult, password: passwordResult } = result.data;

  const user = await db.user.findUnique({
    where: {
      email: emailResult,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hashedPassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { error: `User not found with the given email: ${emailResult}` };
  }

  const hashedPassword = user.hashedPassword;

  const isPasswordValid = await bcrypt.compare(passwordResult, hashedPassword!);

  if (!isPasswordValid) {
    return { error: "Password is not valid." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return {
    user,
  };
};

export const registerAction = async ({
  name,
  email,
  password,
  img: image,
}: RegisterSchemaType) => {
  const result = RegisterSchema.safeParse({ name, email, password, image });

  if (!result.success) {
    return { error: "Unprocessable entitiy." };
  }

  const {
    name: nameResult,
    email: emailResult,
    password: passwordResult,
  } = result.data;

  const userExists = await db.user.findUnique({
    where: {
      email: emailResult,
    },
  });

  if (userExists) {
    return {
      error: `User already exists with the given email: ${emailResult}`,
    };
  }

  const hashedPassword = await bcrypt.hash(passwordResult, 12);

  const user = await db.user.create({
    data: {
      name: nameResult,
      email: emailResult,
      hashedPassword: hashedPassword,
      image: image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hashedPassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { error: "There was an error while creating a user." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return {
    user,
  };
};

export const logoutAction = async () => {
  cookies().set("token", "");

  redirect("/login");
};

export const getCurrentUserAction = async () => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return { error: "No token found." };
  }

  const user = await getCurrentUser(cookies().get("token")?.value!);

  if (!user) {
    return { error: "No user found." };
  }

  return {
    user,
  };
};

export const getAccountsByCurrentUserAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const accounts = await db.userAccount.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  console.log(accounts);

  if (!accounts) {
    return { error: "No accounts found." };
  }

  return {
    accounts,
  };
};

export const getBudgetsByCurrentUserAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const budgets = await db.budget.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  console.log(budgets);

  if (!budgets) {
    return { error: "No budgets found." };
  }

  return {
    budgets,
  };
};

export const getGoalsByCurrentUserAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const goals = await db.goal.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  console.log(goals);

  if (!goals) {
    return { error: "No goals found." };
  }

  return {
    goals,
  };
};

export const getTransactionsByCurrentUserAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  console.log(transactions);

  if (!transactions) {
    return { error: "No transactions found." };
  }

  return {
    transactions,
  };
};

export const getTopTransactionsByCategoryAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const categories = await db.transaction.groupBy({
    by: ["category", "accountId", "createdAt"],
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const data = categories.map((category) => ({
    category: category.category,
    totalAmount: category._sum.amount || 0,
    accountId: category.accountId,
    createdAt: category.createdAt,
  }));

  return {
    topTransactionsByCategory: data,
  };
};

export const fetchMonthlyTransactionsDataAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  const incomes = await db.transaction.groupBy({
    by: ["createdAt"],
    where: {
      userId: currentUser.id,
      isIncome: true,
    },
    _sum: {
      amount: true,
    },
  });

  const expenses = await db.transaction.groupBy({
    by: ["createdAt"],
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
  });

  const formattedIncomes = incomes.map((income) => {
    return {
      month: MONTHS_OF_THE_YEAR[new Date(income.createdAt).getMonth()],
      amount: income._sum.amount ?? 0,
    };
  });

  const formattedExpenses = expenses.map((expense) => {
    return {
      month: MONTHS_OF_THE_YEAR[new Date(expense.createdAt).getMonth()],
      amount: expense._sum.amount ?? 0,
    };
  });

  return {
    incomes: formattedIncomes,
    expenses: formattedExpenses,
  };
};

export const fetchInsightsDataAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "No user found." };
  }

  // get total amount of income of the user
  const totalIncome = await db.transaction.aggregate({
    where: {
      userId: currentUser.id,
      isIncome: true,
    },
    _sum: {
      amount: true,
    },
  });

  //  get total expenses of the user
  const totalExpense = await db.transaction.aggregate({
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
  });

  // calculate net income
  if (!totalIncome._sum.amount || !totalExpense._sum.amount) {
    return {
      error: "Error calculating net income",
    };
  }

  const netIncome = totalIncome._sum.amount - totalExpense._sum.amount;

  //  calculate savings are percentage of net income in a readable format
  const savingsRate = ((netIncome / totalIncome._sum.amount) * 100).toFixed(0);

  return {
    totalIncome: totalIncome._sum.amount ?? 0,
    totalExpense: totalExpense._sum.amount ?? 0,
    netIncome,
    savingsRate,
  };
};

export const registerBankAccountAction = async ({
  balance,
  category,
  name,
}: CreateUserAccountSchemaType) => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "You are not authorized to perform this action." };
  }

  let result = CreateUserAccountSchema.safeParse({ balance, category, name });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const {
    balance: balanceResult,
    category: categoryResult,
    name: nameResult,
  } = result.data;

  const mappedCategory = Object.entries(CreateUserAccountOptions).find(
    ([key, value]) => value === categoryResult
  )?.[0];

  if (!mappedCategory) {
    return { error: "Invalid category." };
  }

  const createdAccount = await db.userAccount.create({
    data: {
      balance: balanceResult,
      category: mappedCategory as UserAccountCategory,
      name: nameResult,
      userId: currentUser.id,
    },
  });

  if (!createdAccount) {
    return { error: "Error creating account." };
  }

  return {
    account: createdAccount,
  };
};
