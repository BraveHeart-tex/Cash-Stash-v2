import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

const MONTHS_OF_THE_YEAR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// get transaction data by grouping them by month
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

  // group user's transaction data by month and return its sum
  const incomes = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      userId: currentUser.id,
      isIncome: true,
    },
    _sum: {
      amount: true,
    },
  });

  const expenses = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      userId: currentUser.id,
      isIncome: false,
    },
    _sum: {
      amount: true,
    },
  });

  const formattedIncomes = incomes.map((income) => {
    return {
      month: MONTHS_OF_THE_YEAR[new Date(income.createdAt).getMonth()],
      amount: income._sum.amount,
    };
  });

  const formattedExpenses = expenses.map((expense) => {
    return {
      month: MONTHS_OF_THE_YEAR[new Date(expense.createdAt).getMonth()],
      amount: expense._sum.amount,
    };
  });

  return NextResponse.json(
    {
      incomes: formattedIncomes,
      expenses: formattedExpenses,
    },
    {
      status: 200,
    }
  );
}
