import prisma from '@/app/libs/prismadb';

const getBudgetById = async (budgetId: string | null) => {
  if (!budgetId) {
    return null;
  }

  const budget = await prisma.budget.findUnique({
    where: {
      id: budgetId,
    },
  });

  if (!budget) {
    return null;
  }

  return budget;
};

export default getBudgetById;
