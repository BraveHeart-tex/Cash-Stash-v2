import createGoal from '@/app/actions/createGoal';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getCurrentUserGoals from '@/app/actions/getCurrentUserGoals';
import { NextResponse } from 'next/server';

// get all goals
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: 'Unauthorized. You must be logged in to do that',
      },
      {
        status: 401,
      }
    );
  }

  const goals = await getCurrentUserGoals(currentUser);

  if (!goals || goals.length === 0) {
    return NextResponse.json(
      {
        error: 'No goals found',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      goals: goals,
    },
    {
      status: 200,
    }
  );
}

// create a goal
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: 'Unauthorized. You must be logged in to do that',
      },
      {
        status: 401,
      }
    );
  }

  const { goalName, goalAmount, currentAmount } = await request.json();

  if (!goalName || !goalAmount || !currentAmount) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
      },
      {
        status: 400,
      }
    );
  }

  const createdGoal = await createGoal(
    goalName,
    goalAmount,
    currentAmount,
    currentUser.id
  );

  if (typeof createdGoal !== 'object' || 'error' in createdGoal) {
    // The createdBudget is not of type Budget or it contains an error property
    return NextResponse.json(
      {
        error: createdGoal.error,
      },
      {
        status: 400,
      }
    );
  }

  if (!createdGoal) {
    return NextResponse.json(
      { error: 'Could not create budget for current user.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ goal: createdGoal }, { status: 200 });
}
