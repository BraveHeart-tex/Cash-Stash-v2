import getCurrentUser from '@/app/actions/getCurrentUser';
import getGoalById from '@/app/actions/getGoalById';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
interface IParams {
  goalId: string;
}

// get goal by id
export async function GET(request: Request, { params }: { params: IParams }) {
  const { goalId } = params;
  if (!goalId || typeof goalId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid goalId',
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

  const goal = await getGoalById(goalId);

  if (!goal) {
    return NextResponse.json(
      {
        message: 'Goal not found',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({ goal: goal }, { status: 200 });
}

// update goal by id
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

  const { goalId } = params;
  if (!goalId || typeof goalId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid goalId',
      },
      {
        status: 400,
      }
    );
  }

  const goal = await getGoalById(goalId);

  if (!goal) {
    return NextResponse.json(
      {
        message: 'Goal not found',
      },
      {
        status: 404,
      }
    );
  }

  const { goalAmount, currentAmount, goalName } = await request.json();

  if (!goalAmount || !currentAmount || !goalName) {
    return NextResponse.json(
      {
        message: 'Missing required fields.',
      },
      {
        status: 400,
      }
    );
  }

  const updatedGoal = await prisma.goal.update({
    where: {
      id: goalId,
    },
    data: {
      goalAmount: parseFloat(goalAmount),
      currentAmount: parseFloat(currentAmount),
      name: goalName,
    },
  });

  return NextResponse.json({ goal: updatedGoal }, { status: 200 });
}

// delete goal by id
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

  const { goalId } = params;
  if (!goalId || typeof goalId !== 'string') {
    return NextResponse.json(
      {
        message: 'Invalid goalId',
      },
      {
        status: 400,
      }
    );
  }

  const goal = await getGoalById(goalId);

  if (!goal) {
    return NextResponse.json(
      {
        message: 'Goal not found',
      },
      {
        status: 404,
      }
    );
  }

  const deletedGoal = await prisma.goal.delete({
    where: {
      id: goalId,
    },
  });

  return NextResponse.json({ goal: deletedGoal }, { status: 200 });
}
