import createUserAccount from "@/app/actions/createUserAccount";
import getUserAccounts from "@/app/actions/getUserAccounts";
import { NextResponse } from "next/server";
import CreateUserAccountOptions from "@/app/utils/CreateUserAccountOptions";
import { UserAccountCategory } from "@prisma/client";
import { getCurrentUserAction } from "@/actions";

// get current bank accounts for user
export async function GET() {
  const currentUserAccounts = await getUserAccounts();

  if (currentUserAccounts?.length === 0 || !currentUserAccounts) {
    return NextResponse.json(
      {
        error: "No accounts found for current user.",
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
  const { user: currentUser } = await getCurrentUserAction();

  const { balance, category, name } = await request.json();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: "Unauthorized",
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
        error: "Invalid category",
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
