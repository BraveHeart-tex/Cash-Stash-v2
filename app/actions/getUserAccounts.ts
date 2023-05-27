import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/app/libs/prismadb';

export async function getSession() {
  return await getServerSession(authOptions);
}

const getUserAccounts = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return null;
  } else {
    return prisma.userAccount.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });
  }
};

export default getUserAccounts;
