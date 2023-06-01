import getCurrentUser from '@/app/actions/getCurrentUser';
import getCurrentUserTransactions from '@/app/actions/getCurrentUserTransactions';
import { NextResponse } from 'next/server';

// TODO: get all transactions
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

  const transactions = await getCurrentUserTransactions(currentUser);

  if (!transactions || transactions.length === 0) {
    return NextResponse.json(
      {
        message: 'No transactions found',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      transactions: transactions,
    },
    {
      status: 200,
    }
  );
}

// TODO: create transaction
