import createTransaction from '@/app/actions/createTransaction';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getCurrentUserTransactions from '@/app/actions/getCurrentUserTransactions';
import { NextResponse } from 'next/server';

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

  const { amount, description, category, accountId } = await request.json();

  if (!amount || !description || !category || !accountId) {
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
    currentUser.id
  );

  if (!transaction) {
    return NextResponse.json(
      {
        message: 'Error creating transaction',
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
