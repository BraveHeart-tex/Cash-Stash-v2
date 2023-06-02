import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

// get the list of top transactions by category
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: 'You must be logged in to do that',
      },
      {
        status: 401,
      }
    );
  }

  const categories = await prisma.transaction.groupBy({
    by: ['category', 'accountId', 'createdAt'],
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  const data = categories.map((category) => ({
    category: category.category,
    totalAmount: category._sum.amount || 0,
    accountId: category.accountId,
    createdAt: category.createdAt,
  }));

  return NextResponse.json(
    {
      topTransactionsByCategory: data,
    },
    {
      status: 200,
    }
  );
}
