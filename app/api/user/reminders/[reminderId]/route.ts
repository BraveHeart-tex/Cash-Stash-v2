import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

interface IParams {
  reminderId?: string;
}

// FIXME: TEST this
// update a reminder
export async function PUT(request: Request, params: IParams) {
  const { reminderId } = params;

  if (!reminderId || typeof reminderId !== 'string') {
    return NextResponse.json(
      {
        error: 'Bad request. No reminder id was found in params.',
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
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const reminderToBeUpdated = await prisma.reminder.findUnique({
    where: {
      id: parseInt(reminderId),
    },
  });

  if (!reminderToBeUpdated) {
    return NextResponse.json(
      {
        error: 'No reminder with the given reminder id was found.',
      },
      {
        status: 404,
      }
    );
  }

  const { title, description, amount, reminderDate, isRead } =
    await request.json();

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

  let mappedIsRead = isRead === 'IsRead' ? true : false;
  let mappedReminderDate = new Date(reminderDate);

  const updatedReminder = await prisma.reminder.update({
    data: {
      title,
      description,
      amount: parseInt(amount),
      reminderDate: mappedReminderDate,
      isRead: mappedIsRead,
    },
    where: {
      id: parseInt(reminderId),
    },
  });

  if (!updatedReminder) {
    return NextResponse.json(
      {
        error: 'An error occurred while trying to update the reminder.',
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      updatedReminder: updatedReminder,
    },
    {
      status: 200,
    }
  );
}

// FIXME: TEST this
// delete a reminder
export async function DELETE(request: Request, params: IParams) {
  const { reminderId } = params;

  if (!reminderId || typeof reminderId !== 'string') {
    return NextResponse.json(
      {
        error: 'Bad request. No reminder id was found in params.',
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
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const reminderToBeDeleted = await prisma.reminder.findUnique({
    where: {
      id: parseInt(reminderId),
    },
  });

  if (!reminderToBeDeleted) {
    return NextResponse.json(
      {
        error: 'Reminder with the given id was not found.',
      },
      {
        status: 404,
      }
    );
  }

  await prisma.reminder.delete({
    where: {
      id: parseInt(reminderId),
    },
  });

  return NextResponse.json(
    {
      message: 'Reminder deleted successfully',
    },
    {
      status: 200,
    }
  );
}

// FIXME: TEST this
// get a reminder by id

export async function GET(request: Request, params: IParams) {
  const { reminderId } = params;

  if (!reminderId || typeof reminderId !== 'string') {
    return NextResponse.json(
      {
        error: 'Bad request. No reminder id was found in params.',
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
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const reminder = await prisma.reminder.findUnique({
    where: {
      id: parseInt(reminderId),
    },
  });

  if (!reminder) {
    return NextResponse.json(
      {
        error: 'Reminder with the given id was not found.',
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      reminder: reminder,
    },
    {
      status: 200,
    }
  );
}
