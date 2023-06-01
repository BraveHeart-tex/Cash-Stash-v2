import prisma from '@/app/libs/prismadb';
import { User } from '@prisma/client';

const getCurrentUserTransactions = async (user: User | null) => {
  if (!user) {
    return null;
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
  });

  return transactions;
};

export default getCurrentUserTransactions;
