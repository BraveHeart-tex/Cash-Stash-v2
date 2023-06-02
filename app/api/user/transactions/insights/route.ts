import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

// get insights for user transactions
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  // get total amount of income of the user
  const totalIncome = await prisma.transaction.aggregate({
    where: {
      userId: currentUser.id,
      isIncome: true,
    },
    _sum: {
      amount: true,
    },
  });

  //  get total expenses of the user
  const totalExpense = await prisma.transaction.aggregate({
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
  });

  // calculate net income
  if (!totalIncome._sum.amount || !totalExpense._sum.amount) {
    return NextResponse.json(
      {
        message: 'Error calculating net income',
      },
      {
        status: 500,
      }
    );
  }

  const netIncome = totalIncome._sum.amount - totalExpense._sum.amount;

  //  calculate savings are percentage of net income in a readable format
  const savingsRate = ((netIncome / totalIncome._sum.amount) * 100).toFixed(0);

  return NextResponse.json(
    {
      totalIncome: totalIncome._sum.amount,
      totalExpense: totalExpense._sum.amount,
      netIncome,
      savingsRate,
    },
    {
      status: 200,
    }
  );
}
