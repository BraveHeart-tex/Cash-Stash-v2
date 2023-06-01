import prisma from '@/app/libs/prismadb';
import { UserAccountCategory } from '@prisma/client';

const createUserAccount = async (
  id: number,
  balance: number,
  category: UserAccountCategory,
  name: string
) => {
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
