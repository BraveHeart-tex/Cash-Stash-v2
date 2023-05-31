import prisma from '@/app/libs/prismadb';
import { User } from '@prisma/client';

const getCurrentUserBudgets = async (user: User | null) => {
  if (!user) {
    return null;
  }

  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
    },
  });

  return budgets;
};

export default getCurrentUserBudgets;
