import prisma from "@/app/libs/prismadb";
import CreateBudgetOptions from "../../lib/CreateBudgetOptions";
import { NotificationCategory } from "@prisma/client";

const createTransaction = async (
  amount: number,
  description: string,
  category: string,
  accountId: number,
  isIncome: boolean,
  userId: number
) => {
  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === category
  )?.[0];

  // check if the user's balance is enough for the transaction
  const usersAccount = await prisma.userAccount.findFirst({
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

  // update the user's balance
  const updatedBalance = !isIncome
    ? usersBalance - amount
    : usersBalance + amount;

  const updatedAccount = await prisma.userAccount.update({
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

  // create the transaction
  const createdTransaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      category: mappedCategory as NotificationCategory,
      accountId,
      userId,
      isIncome,
    },
  });

  if (!createdTransaction) {
    return {
      message: "Failed to create transaction",
    };
  }

  return createdTransaction;
};

export default createTransaction;
