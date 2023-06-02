import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

// get insights for user transactions
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
}
