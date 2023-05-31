import prisma from '@/app/libs/prismadb';
import { NotificationCategory } from '@prisma/client';

const createBudget = async (
  budgetAmount: number,
  spentAmount: number,
  category: NotificationCategory,
  userId: string
) => {
  const createdBudget = await prisma.budget.create({
    data: {
      budgetAmount,
      spentAmount,
      category,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return createdBudget;
};

export default createBudget;
