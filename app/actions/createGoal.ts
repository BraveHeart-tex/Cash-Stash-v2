import prisma from '@/app/libs/prismadb';

const createGoal = async (
  goalName: string,
  goalAmount: string,
  currentAmount: string,
  userId: string
) => {
  const existingGoal = await prisma.goal.findFirst({
    where: {
      name: goalName,
    },
  });

  if (existingGoal) {
    return {
      error: 'Goal already exists with this name.',
    };
  }

  const createdGoal = await prisma.goal.create({
    data: {
      name: goalName,
      goalAmount: parseFloat(goalAmount),
      currentAmount: parseFloat(currentAmount),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return createdGoal;
};

export default createGoal;
