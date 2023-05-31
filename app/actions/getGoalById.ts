import prisma from '@/app/libs/prismadb';

const getGoalById = async (goalId: string | null) => {
  if (!goalId) {
    return null;
  }

  const goal = await prisma.goal.findUnique({
    where: {
      id: goalId,
    },
  });

  if (!goalId) {
    return null;
  }

  return goal;
};

export default getGoalById;
