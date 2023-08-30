import prisma from "@/app/libs/prismadb";

const getUserAccountById = async (accountId: string) => {
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
