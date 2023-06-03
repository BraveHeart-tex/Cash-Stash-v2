import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

// get all reminders
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  const reminders = await prisma?.reminder.findMany({
    where: {
      userId: currentUser.id,
      isRead: false,
    },
  });

  if (!reminders || reminders.length === 0) {
    return NextResponse.json(
      {
        error: 'No reminders were found for the current user.',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      reminders: reminders,
    },
    {
      status: 200,
    }
  );
}

// create a reminder
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  const { title, description, amount, reminderDate } = await request.json();

  if (!title || !description || !amount || !reminderDate) {
    return NextResponse.json(
      {
        error: 'Bad Request. Please provide all the required fields.',
      },
      {
        status: 400,
      }
    );
  }

  let mappedReminderDate = new Date(reminderDate);

  const reminder = await prisma.reminder.create({
    data: {
      userId: currentUser.id,
      title,
      description,
      amount: parseInt(amount),
      reminderDate: mappedReminderDate,
    },
  });

  if (!reminder) {
    return NextResponse.json(
      {
        error: 'An error occurred while trying to create a reminder.',
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      reminder: reminder,
    },
    {
      status: 201,
    }
  );
}
