import getBudgetById from '@/app/actions/getBudgetById';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import CreateBudgetOptions from '@/app/utils/CreateBudgetOptions';
import { NotificationCategory } from '@prisma/client';
import { NextResponse } from 'next/server';

interface IParams {
  budgetId?: string;
}

// get budget by id
export async function GET(request: Request, { params }: { params: IParams }) {
  const { budgetId } = params;
  if (!budgetId || typeof budgetId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid budgetId',
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
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const budget = await getBudgetById(budgetId);

  if (!budget) {
    return NextResponse.json(
      {
        message: 'Budget not found',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({ budget: budget }, { status: 200 });
}

// update budget by id
export async function PUT(request: Request, { params }: { params: IParams }) {
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

  const { budgetId } = params;
  if (!budgetId || typeof budgetId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid budgetId',
      },
      {
        status: 400,
      }
    );
  }

  const budget = await getBudgetById(budgetId);

  if (!budget) {
    return NextResponse.json(
      {
        message: 'Budget not found',
      },
      {
        status: 404,
      }
    );
  }

  const { budgetAmount, spentAmount, category } = await request.json();

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === category
  )?.[0];

  const updatedBudget = await prisma.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      budgetAmount: parseFloat(budgetAmount),
      spentAmount: parseFloat(spentAmount),
      category: mappedCategory as NotificationCategory,
    },
  });

  return NextResponse.json({ budget: updatedBudget }, { status: 200 });
}

// delete budget by id
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
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

  const { budgetId } = params;
  if (!budgetId || typeof budgetId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid budgetId',
      },
      {
        status: 400,
      }
    );
  }

  const budget = await getBudgetById(budgetId);

  if (!budget) {
    return NextResponse.json(
      {
        message: 'Budget not found',
      },
      {
        status: 404,
      }
    );
  }

  await prisma.budget.delete({
    where: {
      id: budgetId,
    },
  });

  return NextResponse.json({ message: 'Budget deleted' }, { status: 200 });
}
