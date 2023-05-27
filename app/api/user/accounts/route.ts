import createUserAccount from '@/app/actions/createUserAccount';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getUserAccounts from '@/app/actions/getUserAccounts';
import { NextResponse } from 'next/server';
import CreateUserAccountOptions from '@/app/utils/CreateUserAccountOptions';
import { UserAccountCategory } from '@prisma/client';

// get current bank accounts for user
export async function GET(request: Request) {
  const currentUserAccounts = await getUserAccounts();

  if (currentUserAccounts?.length === 0 || !currentUserAccounts) {
    return NextResponse.json(
      {
        error: 'No accounts found for current user.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { currentAccounts: currentUserAccounts },
    { status: 200 }
  );
}

// create bank accounts for user
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  const { balance, category, name } = await request.json();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  const mappedCategory = Object.entries(CreateUserAccountOptions).find(
    ([key, value]) => value === category
  )?.[0];

  if (!mappedCategory) {
    return NextResponse.json(
      {
        error: 'Invalid category',
      },
      { status: 400 }
    );
  }

  const createdAccount = await createUserAccount(
    currentUser.id,
    parseFloat(balance),
    mappedCategory as UserAccountCategory,
    name
  );

  return NextResponse.json(
    {
      account: createdAccount,
    },
    {
      status: 201,
    }
  );
}
