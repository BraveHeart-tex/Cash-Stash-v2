"use server";
import prisma from "@/lib/prismadb";
import { getCurrentUser, signToken } from "@/lib/session";
import { EditReminderSchema, LoginSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { MONTHS_OF_THE_YEAR, processZodError } from "@/lib/utils";
import accountSchema, {
  AccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import ACCOUNT_OPTIONS from "@/lib/CreateUserAccountOptions";
import {
  TransactionCategory,
  Prisma,
  BudgetCategory,
  Account,
  Budget,
} from "@prisma/client";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import EditBudgetSchema, {
  EditBudgetSchemaType,
} from "@/schemas/EditBudgetSchema";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { CreateBudgetSchemaType } from "@/schemas/CreateBudgetSchema";
import CreateTransactionSchema, {
  CreateTransactionSchemaType,
} from "@/schemas/CreateTransactionSchema";
import CreateReminderSchema, {
  CreateReminderSchemaType,
} from "@/schemas/CreateReminderSchema";
import { redirect } from "next/navigation";
import {
  IGetPaginatedAccountsParams,
  IGetPaginatedAccountsResponse,
  IGetPaginatedBudgetsParams,
  IGetPaginatedBudgetsResponse,
  IGetPaginatedGoalsParams,
  IGetPaginatedGoalsResponse,
  IValidatedResponse,
  UpdateBudgetResponse,
} from "./types";
import { ZodError } from "zod";
import budgetSchema, { BudgetSchemaType } from "@/schemas/budget-schema";

export const login = async ({ email, password }: LoginSchemaType) => {
  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const { email: emailResult, password: passwordResult } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: emailResult,
    },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(
    passwordResult,
    user.hashedPassword!
  );

  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return { user };
};

export const register = async ({
  name,
  email,
  password,
}: RegisterSchemaType) => {
  const result = RegisterSchema.safeParse({ name, email, password });

  if (!result.success) {
    return { error: "Unprocessable entitiy." };
  }

  const {
    name: nameResult,
    email: emailResult,
    password: passwordResult,
  } = result.data;

  const userExists = await prisma.user.findUnique({
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

  const user = await prisma.user.create({
    data: {
      name: nameResult,
      email: emailResult,
      hashedPassword,
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

export const logout = async () => {
  cookies().delete("token");
  redirect("/login");
};

export const getUserSession = async () => {
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

export const getPaginatedAccounts = async ({
  pageNumber,
  query,
  category,
  sortBy,
  sortDirection,
}: IGetPaginatedAccountsParams): Promise<IGetPaginatedAccountsResponse> => {
  const result = await getUserSession();
  if (result.error) {
    redirect("/login");
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  if (category && !ACCOUNT_OPTIONS.hasOwnProperty(category)) {
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  let orderByCondition;
  if (sortBy && sortDirection) {
    orderByCondition = {
      orderBy: {
        [sortBy]: sortDirection,
      },
    };
  }

  const categoryQuery = category ? { category } : {};

  const [accounts, totalCount] = await Promise.all([
    prisma.account.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryQuery,
      },
      ...orderByCondition,
    }),
    prisma.account.count({
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryQuery,
      },
    }),
  ]);

  if (accounts.length === 0) {
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  return {
    accounts,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};

export const getPaginatedBudgets = async ({
  pageNumber,
  query,
  category,
  sortBy,
  sortDirection,
}: IGetPaginatedBudgetsParams): Promise<IGetPaginatedBudgetsResponse> => {
  const result = await getUserSession();
  if (result.error) {
    redirect("/login");
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  if (category && !CreateBudgetOptions.hasOwnProperty(category)) {
    return {
      budgets: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  const categoryCondition = category ? { category } : {};
  const sortByCondition = sortBy
    ? { orderBy: { [sortBy]: sortDirection || "asc" } }
    : {};

  const [budgets, totalCount] = await Promise.all([
    prisma.budget.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryCondition,
      },
      orderBy: sortByCondition?.orderBy,
    }),
    prisma.budget.count({
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryCondition,
      },
    }),
  ]);

  if (budgets.length === 0) {
    return {
      budgets: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  return {
    budgets,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
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

export const registerBankAccount = async ({
  balance,
  category,
  name,
}: AccountSchemaType): Promise<IValidatedResponse<Account>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return {
      error: "You are not authorized to perform this action.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = accountSchema.parse({ balance, category, name });

    const createdAccount = await prisma.account.create({
      data: {
        ...validatedData,
        userId: currentUser.id,
      },
    });

    if (!createdAccount) {
      return { error: "Error creating account.", fieldErrors: [] };
    }

    return {
      data: createdAccount,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "An error occurred while registering your bank account. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const updateBankAccount = async ({
  accountId,
  ...rest
}: AccountSchemaType & { accountId: string }): Promise<
  IValidatedResponse<Account>
> => {
  if (!accountId) {
    return {
      error: "Invalid request. Please provide an account ID.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = accountSchema.parse(rest);

    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: validatedData,
    });

    if (!updatedAccount) {
      return {
        error:
          "An error occurred while updating your bank account. Please try again later.",
        fieldErrors: [],
      };
    }

    return {
      data: updatedAccount,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "An error occurred while updating your bank account. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const createBudget = async (
  data: CreateBudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return {
      error: "You are not authorized to perform this action.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = budgetSchema.parse(data);

    const createdBudget = await prisma.budget.create({
      data: {
        ...validatedData,
        userId: currentUser.id,
      },
    });

    if (!createdBudget) {
      return {
        error:
          "There was a problem while creating your budget. Please try again later.",
        fieldErrors: [],
      };
    }

    return {
      data: createdBudget,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return { error: "An error occurred.", fieldErrors: [] };
  }
};

export const updateBudget = async (
  budgetId: string,
  values: BudgetSchemaType
): Promise<IValidatedResponse<Budget>> => {
  const budgetToBeUpdated = await prisma.budget.findUnique({
    where: { id: budgetId },
  });

  if (!budgetToBeUpdated)
    return { error: `Budget to be updated cannot be found.`, fieldErrors: [] };

  try {
    const validatedData = budgetSchema.parse(values);

    const updatedBudget = await prisma.budget.update({
      where: { id: budgetId, userId: budgetToBeUpdated.userId },
      data: validatedData,
    });

    if (!updatedBudget)
      return {
        error:
          "There was a problem while trying to update your budget. Please try again later.",
        fieldErrors: [],
      };

    return { data: updatedBudget, fieldErrors: [] };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    console.error(error);
    return {
      error:
        "There was a problem while updating your budget. Please try again later.",
      fieldErrors: [],
    };
  }
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

export const createTransaction = async ({
  amount,
  description,
  category,
  accountId,
  isIncome,
}: CreateTransactionSchemaType) => {
  const result = CreateTransactionSchema.safeParse({
    amount,
    description,
    category,
    accountId,
    isIncome,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "You are not authorized to perform this action." };
  }

  const usersAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
    },
  });

  if (!usersAccount) {
    return {
      error: "Bank account not found",
    };
  }

  const usersBalance = usersAccount.balance;

  if (!isIncome && usersBalance < amount) {
    return {
      error: "Insufficient balance",
    };
  }

  const updatedBalance = isIncome
    ? usersBalance + amount
    : usersBalance - amount;

  const { data } = result;

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([, value]) => value === data.category
  )?.[0];

  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      category: mappedCategory as TransactionCategory,
      accountId: data.accountId,
      userId: currentUser?.id,
    },
  });

  if (!transaction) {
    return {
      error: "Error creating transaction",
    };
  }

  const updatedAccount = await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      balance: updatedBalance,
    },
  });

  if (!updatedAccount) {
    return {
      error: "Failed to update balance",
    };
  }

  return {
    transaction,
  };
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
