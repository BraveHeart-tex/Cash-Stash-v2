import createTransaction from '@/app/actions/createTransaction';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getCurrentUserTransactions from '@/app/actions/getCurrentUserTransactions';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// get all transactions
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

// create transaction
export async function POST(request: Request) {
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

  const { amount, description, category, accountId, isIncome } =
    await request.json();

  let IsIncomeParsed = isIncome === 'expense' ? false : true;

  if (!amount || !description || !category || !accountId || !isIncome) {
    return NextResponse.json(
      {
        message: 'Invalid request',
      },
      {
        status: 400,
      }
    );
  }

  const transaction = await createTransaction(
    parseInt(amount),
    description,
    category,
    parseInt(accountId),
    IsIncomeParsed,
    currentUser.id
  );

  // check if the transaction contains a an object with a property called message
  // if it does, it means that the transaction failed
  // { message: 'Insufficient balance' }

  if (typeof transaction !== 'object' || 'message' in transaction) {
    return NextResponse.json(
      {
        message: transaction.message,
      },
      {
        status: 400,
      }
    );
  }

  if (!transaction) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      transaction: transaction,
    },
    {
      status: 200,
    }
  );
}
