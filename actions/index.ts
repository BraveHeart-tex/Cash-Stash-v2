"use server";

import db from "@/app/libs/prismadb";
import { getCurrentUser, signToken } from "@/lib/session";
import { EditReminderSchema, LoginSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { MONTHS_OF_THE_YEAR } from "@/lib/utils";
import CreateUserAccountSchema, {
  CreateUserAccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import CreateUserAccountOptions, {
  getKeyByValue,
} from "@/lib/CreateUserAccountOptions";
import { NotificationCategory, UserAccountCategory } from "@prisma/client";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import EditBudgetSchema, {
  EditBudgetSchemaType,
} from "@/schemas/EditBudgetSchema";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import CreateBudgetSchema, {
  CreateBudgetSchemaType,
} from "@/schemas/CreateBudgetSchema";
import EditGoalSchema, { EditGoalSchemaType } from "@/schemas/EditGoalSchema";
import CreateGoalSchema, {
  CreateGoalSchemaType,
} from "@/schemas/CreateGoalSchema";
import CreateTransactionSchema, {
  CreateTransactionSchemaType,
} from "@/schemas/CreateTransactionSchema";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";

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

export const updateGoalByIdAction = async ({
  goalId,
  goalAmount,
  currentAmount,
  goalName,
}: EditGoalSchemaType & {
  goalId: number;
}) => {
  const result = EditGoalSchema.safeParse({
    goalAmount,
    currentAmount,
    goalName,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const {
    goalAmount: goalAmountResult,
    currentAmount: currentAmountResult,
    goalName: goalNameResult,
  } = result.data;

  const goalToBeUpdated = await db.goal.findUnique({
    where: {
      id: goalId,
    },
  });

  if (!goalToBeUpdated) {
    return { error: `Goal not found with the given id ${goalId}` };
  }

  const updatedGoal = await db.goal.update({
    where: {
      id: goalId,
    },
    data: {
      goalAmount: goalAmountResult,
      currentAmount: currentAmountResult,
      name: goalNameResult,
    },
  });

  if (!updatedGoal) {
    return { error: "Error updating goal." };
  }

  return {
    goal: updatedGoal,
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

export const getAccountByIdAction = async (accountId: number) => {
  if (!accountId) {
    return { error: "Account ID not found." };
  }

  const currentAccount = await db.userAccount.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!currentAccount) {
    return { error: "Account not found." };
  }

  return {
    account: currentAccount,
  };
};

export const updateAccountByIdAction = async ({
  accountId,
  balance,
  category,
  name,
}: CreateUserAccountSchemaType & { accountId: number | null }) => {
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

export const deleteAccountByIdAction = async (accountId: number) => {
  if (!accountId) {
    return { error: "Account ID not found." };
  }

  const deletedAccount = await db.userAccount.delete({
    where: {
      id: accountId,
    },
  });

  if (!deletedAccount) {
    return { error: "Error deleting account." };
  }

  return {
    account: deletedAccount,
  };
};

export const getBudgetByIdAction = async (budgetId: number) => {
  if (!budgetId) {
    return { error: "Budget ID not found." };
  }

  const currentBudget = await db.budget.findUnique({
    where: {
      id: budgetId,
    },
  });

  if (!currentBudget) {
    return { error: "Budget not found." };
  }

  return {
    budget: currentBudget,
  };
};

export const deleteBudgetByIdAction = async (budgetId: number) => {
  if (!budgetId) {
    return { error: "Budget ID not found." };
  }

  const deletedBudget = await db.budget.delete({
    where: {
      id: budgetId,
    },
  });

  if (!deletedBudget) {
    return { error: "Error deleting budget." };
  }

  return {
    budget: deletedBudget,
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
}: EditBudgetSchemaType & {
  budgetId: number;
}) => {
  if (!budgetId) {
    return { error: "Budget ID not found." };
  }

  const budgetToBeUpdated = await db.budget.findUnique({
    where: {
      id: budgetId,
    },
  });

  if (!budgetToBeUpdated) {
    return { error: `Budget not found with the given id ${budgetId}` };
  }

  let result = EditBudgetSchema.safeParse({
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

  const updatedBudget = await db.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      budgetAmount: budgetAmountResult,
      spentAmount: spentAmountResult,
      category: mappedCategory as NotificationCategory,
    },
  });

  if (!updatedBudget) {
    return { error: "Error updating budget." };
  }

  return {
    budget: updatedBudget,
  };
};

export const updateReminderAction = async ({
  reminderId,
  title,
  description,
  amount,
  reminderDate,
  isRead,
  isIncome,
}: EditReminderSchemaType & { reminderId: number }) => {
  if (!reminderId) {
    return {
      error: "Reminder ID not found.",
    };
  }

  let result = EditReminderSchema.safeParse({
    title,
    description,
    amount,
    reminderDate,
    isRead,
    isIncome,
  });

  if (!result.success) {
    return {
      error: "Unprocessable entity.",
    };
  }

  const reminderToBeUpdated = await db.reminder.findUnique({
    where: {
      id: reminderId,
    },
  });

  if (!reminderToBeUpdated) {
    return {
      error: "No reminder with the given reminder id was found.",
    };
  }

  let mappedIsRead = isRead === "isRead" ? true : false;
  let mappedIsIncome = isIncome === "income" ? true : false;
  let mappedReminderDate = new Date(reminderDate);

  const updatedReminder = await db.reminder.update({
    data: {
      title,
      description,
      amount: amount,
      reminderDate: mappedReminderDate,
      isRead: mappedIsRead,
      isIncome: mappedIsIncome,
    },
    where: {
      id: reminderId,
    },
  });

  if (!updatedReminder) {
    return {
      error: "Error updating reminder.",
    };
  }

  return {
    reminder: updatedReminder,
  };
};

export const deleteGoalByIdAction = async (goalId: number) => {
  if (!goalId) {
    return { error: "Goal ID not found." };
  }

  const deletedGoal = await db.goal.delete({
    where: {
      id: goalId,
    },
  });

  if (!deletedGoal) {
    return { error: "Error deleting goal." };
  }

  return {
    goal: deletedGoal,
  };
};

export const createGoalAction = async ({
  goalAmount,
  goalName,
  currentAmount,
}: CreateGoalSchemaType) => {
  let result = CreateGoalSchema.safeParse({
    goalAmount,
    goalName,
    currentAmount,
  });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const {
    goalAmount: goalAmountResult,
    goalName: goalNameResult,
    currentAmount: currentAmountResult,
  } = result.data;

  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return { error: "You are not authorized to perform this action." };
  }

  const createdGoal = await db.goal.create({
    data: {
      goalAmount: goalAmountResult,
      name: goalNameResult,
      currentAmount: currentAmountResult,
      userId: currentUser.id,
    },
  });

  if (!createdGoal) {
    return { error: "Error creating goal." };
  }

  return {
    goal: createdGoal,
  };
};

export const createTransactionAction = async ({
  amount,
  description,
  category,
  accountId,
  isIncome,
}: CreateTransactionSchemaType) => {
  let result = CreateTransactionSchema.safeParse({
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

  // check if the user's balance is enough for the transaction
  const usersAccount = await db.userAccount.findFirst({
    where: {
      id: accountId,
    },
  });

  if (!usersAccount) {
    return {
      message: "Bank account not found",
    };
  }

  const usersBalance = usersAccount.balance;

  if (!isIncome && usersBalance < amount) {
    return {
      message: "Insufficient balance",
    };
  }

  const updatedBalance = !isIncome
    ? usersBalance - amount
    : usersBalance + amount;

  const {
    amount: amountResult,
    description: descriptionResult,
    category: categoryResult,
    accountId: accountIdResult,
    isIncome: isIncomeResult,
  } = result.data;

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === categoryResult
  )?.[0];

  const transaction = await db.transaction.create({
    data: {
      amount: amountResult,
      description: descriptionResult,
      category: mappedCategory as NotificationCategory,
      accountId: accountIdResult,
      isIncome: isIncomeResult,
      userId: currentUser?.id,
    },
  });

  if (!transaction) {
    return {
      message: "Error creating transaction",
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
      message: "Failed to update balance",
    };
  }

  return {
    transaction,
  };
};

export const deleteTransactionByIdAction = async (transactionId: number) => {
  if (!transactionId) {
    return { error: "Transaction ID not found." };
  }

  const deletedTransaction = await db.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  if (!deletedTransaction) {
    return { error: "Error deleting transaction." };
  }

  if (deletedTransaction.isIncome) {
    await db.userAccount.update({
      where: {
        id: deletedTransaction.accountId,
      },
      data: {
        balance: {
          decrement: deletedTransaction.amount,
        },
      },
    });
  } else {
    await db.userAccount.update({
      where: {
        id: deletedTransaction.accountId,
      },
      data: {
        balance: {
          increment: deletedTransaction.amount,
        },
      },
    });
  }

  return {
    transaction: deletedTransaction,
  };
};

// export interface MonthlyData {
//   monthlyTransactionsData: {
//     date: string;
//     income: number;
//     expense: number;
//   }[];
// }

export const getChartDataAction = async () => {
  try {
    const currentUserPromise = getCurrentUser(cookies().get("token")?.value!);
    const transactionsPromise = db.transaction.findMany({
      where: {
        userId: (await currentUserPromise).id, // Wait for currentUserPromise to resolve
      },
    });

    const [currentUser, transactions] = await Promise.all([
      currentUserPromise,
      transactionsPromise,
    ]);

    if (!currentUser) {
      return { error: "No user found." };
    }

    const monthlyTransactionsData = transactions.map((transaction) => {
      return {
        date: transaction.createdAt.toISOString(),
        income: transaction.isIncome ? transaction.amount : 0,
        expense: !transaction.isIncome ? transaction.amount : 0,
      };
    });

    const dataMap = new Map();

    monthlyTransactionsData.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      const key = `${MONTHS_OF_THE_YEAR[month]} ${year}`;

      if (!dataMap.has(key)) {
        dataMap.set(key, { date: key, income: 0, expense: 0 });
      }

      const entry = dataMap.get(key);
      entry.income += transaction.income;
      entry.expense += transaction.expense;
    });

    // Convert the Map to an array of objects
    const data = Array.from(dataMap.values());
    console.log("mapped data", data);
    return {
      data,
    };
  } catch (error) {
    return { error: "An error occurred." };
  }
};
