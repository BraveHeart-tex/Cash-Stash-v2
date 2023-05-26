import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, img: image } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        error:
          'Missing name, email or password. Please fill all the required fields',
      },
      { status: 400 }
    );
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return NextResponse.json(
      { error: `User already exists with the given email: ${email}` },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      image,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
