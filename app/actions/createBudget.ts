import prisma from '@/app/libs/prismadb';
import { NotificationCategory } from '@prisma/client';

const createBudget = async (
  budgetAmount: string,
  spentAmount: string,
  category: NotificationCategory,
  userId: string
) => {
  const createdBudget = await prisma.budget.create({
    data: {
      budgetAmount: parseFloat(budgetAmount),
      spentAmount: parseFloat(spentAmount),
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
