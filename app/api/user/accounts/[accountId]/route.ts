import getUserAccountById from '@/app/actions/getUserAccountById';
import prisma from '@/app/libs/prismadb';
import CreateUserAccountOptions, {
  getKeyByValue,
} from '@/app/utils/CreateUserAccountOptions';
import { UserAccountCategory } from '@prisma/client';
import { NextResponse } from 'next/server';

interface IParams {
  accountId?: string;
}

// get bank account by id
export async function GET(request: Request, { params }: { params: IParams }) {
  const { accountId } = params;

  if (!accountId) {
    return NextResponse.json(
      {
        error: 'Account ID not found',
      },
      {
        status: 404,
      }
    );
  }

  const currentAccount = await getUserAccountById(accountId);

  if (!currentAccount) {
    return NextResponse.json(
      {
        error: 'Account not found',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      account: currentAccount,
    },
    {
      status: 200,
    }
  );
}

// update bank account by id
export async function PUT(request: Request, { params }: { params: IParams }) {
  const { accountId } = params;

  if (!accountId) {
    return NextResponse.json(
      {
        error: 'Account ID not found',
      },
      {
        status: 404,
      }
    );
  }
  const currentAccount = await getUserAccountById(accountId);

  if (!currentAccount) {
    return NextResponse.json(
      {
        error: 'Account not found',
      },
      {
        status: 404,
      }
    );
  }

  const { balance, category, name } = await request.json();

  const mappedCategory = getKeyByValue(CreateUserAccountOptions, category);

  const updatedAccount = await prisma.userAccount.update({
    where: {
      id: currentAccount.id,
    },
    data: {
      balance: parseFloat(balance),
      category: mappedCategory as UserAccountCategory,
      name,
    },
  });

  return NextResponse.json(
    {
      account: updatedAccount,
    },
    {
      status: 200,
    }
  );
}

// delete bank account by id
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { accountId } = params;

  if (!accountId) {
    return NextResponse.json(
      {
        error: 'Account ID not found',
      },
      {
        status: 404,
      }
    );
  }

  const currentAccount = await getUserAccountById(accountId);

  if (!currentAccount) {
    return NextResponse.json(
      {
        error: 'Account not found',
      },
      {
        status: 404,
      }
    );
  }

  await prisma.userAccount.delete({
    where: {
      id: currentAccount.id,
    },
  });

  return NextResponse.json(
    {
      message: 'Account deleted',
    },
    {
      status: 200,
    }
  );
}
