import prisma from '@/app/libs/prismadb';
import CreateBudgetOptions from '../utils/CreateBudgetOptions';
import { NotificationCategory } from '@prisma/client';

const createTransaction = async (
  amount: number,
  description: string,
  category: string,
  accountId: number,
  userId: number
) => {
  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === category
  )?.[0];

  const createdTransaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      category: mappedCategory as NotificationCategory,
      accountId,
      userId,
    },
  });

  return createdTransaction;
};

export default createTransaction;
