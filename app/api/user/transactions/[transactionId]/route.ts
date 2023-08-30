import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { NotificationCategory } from "@prisma/client";
interface IParams {
  transactionId: string;
}

// get transaction by id
export async function GET(request: Request, { params }: { params: IParams }) {
  const { transactionId } = params;
  if (!transactionId) {
    return NextResponse.json(
      {
        message: "No transaction id provided",
      },
      {
        status: 400,
      }
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: Number(transactionId),
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        message: "Transaction not found",
      },
      {
        status: 404,
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

// delete transaction by id
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { transactionId } = params;
  if (!transactionId) {
    return NextResponse.json(
      {
        message: "No transaction id provided",
      },
      {
        status: 400,
      }
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: Number(transactionId),
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        message: "Transaction not found",
      },
      {
        status: 404,
      }
    );
  }

  // check if the transaction type is income or transfer, if so,
  // delete the transaction and update the account balance

  if (transaction.isIncome) {
    await prisma.userAccount.update({
      where: {
        id: transaction.accountId,
      },
      data: {
        balance: {
          decrement: transaction.amount,
        },
      },
    });
  }

  if (!transaction.isIncome) {
    await prisma.userAccount.update({
      where: {
        id: transaction.accountId,
      },
      data: {
        balance: {
          increment: transaction.amount,
        },
      },
    });
  }

  await prisma.transaction.delete({
    where: {
      id: Number(transactionId),
    },
  });

  return NextResponse.json(
    {
      message: "Transaction deleted",
    },
    {
      status: 200,
    }
  );
}

// update transaction by id
export async function PUT(request: Request, { params }: { params: IParams }) {
  const { transactionId } = params;
  if (!transactionId) {
    return NextResponse.json(
      {
        message: "No transaction id provided",
      },
      {
        status: 400,
      }
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: Number(transactionId),
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        message: "Transaction not found",
      },
      {
        status: 404,
      }
    );
  }

  const { amount, description, category, accountId } = await request.json();

  if (!amount || !description || !category || !accountId) {
    return NextResponse.json(
      {
        message: "Missing required fields",
      },
      {
        status: 400,
      }
    );
  }

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === category
  )?.[0];

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: Number(transactionId),
    },
    data: {
      amount: Number(amount),
      description: String(description),
      category: mappedCategory as NotificationCategory,
      account: {
        connect: {
          id: Number(accountId),
        },
      },
    },
  });

  return NextResponse.json(
    {
      transaction: updatedTransaction,
    },
    {
      status: 200,
    }
  );
}
