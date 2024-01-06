"use server";
import db from "@/app/libs/prismadb";
import { getCurrentUser, signToken } from "@/lib/session";
import { EditReminderSchema, LoginSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { MONTHS_OF_THE_YEAR, processDate } from "@/lib/utils";
import CreateUserAccountSchema, {
  CreateUserAccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import CreateUserAccountOptions, {
  getKeyByValue,
} from "@/lib/CreateUserAccountOptions";
import {
  NotificationCategory,
  Prisma,
  UserAccountCategory,
} from "@prisma/client";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import EditBudgetSchema, {
  EditBudgetSchemaType,
} from "@/schemas/EditBudgetSchema";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import CreateBudgetSchema, {
  CreateBudgetSchemaType,
} from "@/schemas/CreateBudgetSchema";
import CreateTransactionSchema, {
  CreateTransactionSchemaType,
} from "@/schemas/CreateTransactionSchema";
import CreateReminderSchema, {
  CreateReminderSchemaType,
} from "@/schemas/CreateReminderSchema";
import { redirect } from "next/navigation";

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

export const registerAction = async ({
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

export const logoutAction = async () => {
  cookies().delete("token");
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

export const fetchMonthlyTransactionsDataAction = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) return { error: "No user found." };

  const aggregateByType = async (isIncome: boolean) => {
    const transactions = await db.transaction.groupBy({
      by: ["createdAt"],
      where: {
        userId: currentUser.id,
        isIncome,
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
    const result = await db.transaction.aggregate({
      where: {
        userId: currentUser.id,
        isIncome,
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

export const updateAccountByIdAction = async ({
  accountId,
  balance,
  category,
  name,
}: CreateUserAccountSchemaType & { accountId: string | null }) => {
  if (!accountId) {
    return { error: "Account ID not found." };
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

  const mappedCategory = getKeyByValue(
    CreateUserAccountOptions,
    categoryResult
  );

  const updatedAccount = await db.userAccount.update({
    where: {
      id: accountId,
    },
    data: {
      balance: balanceResult,
      category: mappedCategory as UserAccountCategory,
      name: nameResult,
    },
  });

  if (!updatedAccount) {
    return { error: "Error updating account." };
  }

  return {
    account: updatedAccount,
  };
};

export const createBudgetAction = async ({
  budgetAmount,
  spentAmount,
  category,
}: CreateBudgetSchemaType) => {
  let result = CreateBudgetSchema.safeParse({
    budgetAmount,
    spentAmount,
    category,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const {
    budgetAmount: budgetAmountResult,
    spentAmount: spentAmountResult,
    category: categoryResult,
  } = result.data;

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === categoryResult
  )?.[0];

  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "You are not authorized to perform this action." };
  }

  const createdBudget = await db.budget.create({
    data: {
      budgetAmount: budgetAmountResult,
      spentAmount: spentAmountResult,
      category: mappedCategory as NotificationCategory,
      userId: currentUser.id,
    },
  });

  if (!createdBudget) {
    return { error: "Error creating budget." };
  }

  return {
    budget: createdBudget,
  };
};

export const updateBudgetByIdAction = async ({
  budgetId,
  budgetAmount,
  spentAmount,
  category,
}: EditBudgetSchemaType & { budgetId: string }) => {
  if (!budgetId) return { error: "Budget ID not found." };

  const budgetToBeUpdated = await db.budget.findUnique({
    where: { id: budgetId },
  });

  if (!budgetToBeUpdated)
    return { error: `Budget not found with the given id ${budgetId}` };

  const result = EditBudgetSchema.safeParse({
    budgetAmount,
    spentAmount,
    category,
  });

  if (!result.success) return { error: "Unprocessable entity." };

  const { data } = result;

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([, value]) => value === data.category
  )?.[0];

  const updatedBudget = await db.budget.update({
    where: { id: budgetId },
    data: {
      budgetAmount: data.budgetAmount,
      spentAmount: data.spentAmount,
      category: mappedCategory as NotificationCategory,
    },
  });

  if (!updatedBudget) return { error: "Error updating budget." };

  return { budget: updatedBudget };
};

export const updateReminderAction = async ({
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

  const reminderToBeUpdated = await db.reminder.findUnique({
    where: { id: reminderId },
  });

  if (!reminderToBeUpdated)
    return { error: "No reminder with the given reminder id was found." };

  const updatedReminder = await db.reminder.update({
    data: {
      ...result.data,
      isRead: result.data.isRead === "isRead",
      isIncome: result.data.isIncome === "income",
    },
    where: { id: reminderId },
  });

  if (!updatedReminder) return { error: "Error updating reminder." };

  return { reminder: updatedReminder };
};

export const createTransactionAction = async ({
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

  const usersAccount = await db.userAccount.findFirst({
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

  const transaction = await db.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      category: mappedCategory as NotificationCategory,
      accountId: data.accountId,
      isIncome: data.isIncome,
      userId: currentUser?.id,
    },
  });

  if (!transaction) {
    return {
      error: "Error creating transaction",
    };
  }

  const updatedAccount = await db.userAccount.update({
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

export const deleteTransactionByIdAction = async (transactionId: string) => {
  try {
    if (!transactionId) {
      throw new Error("Transaction ID not found.");
    }

    const deletedTransaction = await db.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    if (!deletedTransaction) {
      throw new Error("Error deleting transaction.");
    }

    const updateBalance = deletedTransaction.isIncome
      ? { decrement: deletedTransaction.amount }
      : { increment: deletedTransaction.amount };

    await db.userAccount.update({
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
export const getChartDataAction = async () => {
  try {
    const currentUser = await getCurrentUser(cookies().get("token")?.value!);

    if (!currentUser) {
      return { error: "No user found." };
    }

    const transactions = await db.transaction.findMany({
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

      if (transaction.isIncome) {
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

export const createReminderAction = async ({
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

  const createdReminder = await db.reminder.create({
    data: {
      amount: data.amount,
      description: data.description,
      isIncome: data.isIncome === "income",
      reminderDate: data.reminderDate,
      title: data.title,
      userId: currentUser.id,
      isRead: data.isRead === "isRead",
    },
  });

  if (!createdReminder) {
    return { error: "Error creating reminder." };
  }

  return {
    reminder: createdReminder,
  };
};

export const searchTransactions = async ({
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
      whereCondition.isIncome = true;
    }

    if (transactionType === "expense") {
      whereCondition.isIncome = false;
    }

    if (accountId) {
      whereCondition.accountId = accountId;
    }

    const result = await db.transaction.findMany({
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
      transactions: result.map((transaction) => ({
        ...transaction,
        createdAt: processDate(transaction.createdAt),
        updatedAt: processDate(transaction.updatedAt),
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred." };
  }
};
