import prisma from '@/app/libs/prismadb';
import { NotificationCategory } from '@prisma/client';

const createBudget = async (
  budgetAmount: string,
  spentAmount: string,
  category: NotificationCategory,
  userId: number
) => {
  const existingBudget = await prisma.budget.findFirst({
    where: {
      user: {
        id: userId,
      },
      category,
    },
  });

  if (existingBudget) {
    return {
      error: 'Budget already exists for this category.',
    };
  }

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
