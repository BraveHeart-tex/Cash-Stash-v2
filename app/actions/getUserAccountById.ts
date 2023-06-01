import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/app/libs/prismadb';

export async function getSession() {
  return await getServerSession(authOptions);
}

const getUserAccountById = async (accountId: string) => {
  const session = await getSession();
  if (!session?.user?.email) {
    return null;
  }

  const userAccount = await prisma.userAccount.findUnique({
    where: {
      id: parseInt(accountId),
    },
  });

  if (!userAccount) {
    return null;
  }

  return userAccount;
};

export default getUserAccountById;
