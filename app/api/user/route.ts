import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: 'You are not logged in',
      },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: currentUser }, { status: 200 });
}
