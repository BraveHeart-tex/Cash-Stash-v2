import prisma from '@/app/libs/prismadb';
import { UserAccountCategory } from '@prisma/client';

const createUserAccount = async (
  id: string,
  balance: number,
  category: UserAccountCategory,
  name: string
) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid id');
  }

  const newAccount = await prisma.userAccount.create({
    data: {
      userId: id,
      name,
      balance,
      category,
    },
  });

  return newAccount;
};

export default createUserAccount;
