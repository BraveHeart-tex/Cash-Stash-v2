
import prisma from '@/app/libs/prismadb';


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
