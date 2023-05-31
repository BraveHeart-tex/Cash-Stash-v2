import prisma from '@/app/libs/prismadb';
import { User } from '@prisma/client';

const getCurrentUserGoals = async (user: User | null) => {
  if (!user) {
    return null;
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId: user.id,
    },
  });

  return goals;
};

export default getCurrentUserGoals;
