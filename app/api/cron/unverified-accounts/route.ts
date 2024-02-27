import { ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS } from "@/lib/constants";
import prisma from "@/lib/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  if (token !== process.env.CRON_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.deleteMany({
      where: {
        email_verified: false,
        createdAt: {
          lte: new Date(
            new Date().getTime() -
              ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS * 24 * 60 * 60 * 1000
          ),
        },
      },
    });

    return NextResponse.json({ message: "Cron job ran successfully!" });
  } catch (error) {
    console.error("Error running cron job");

    return NextResponse.json(
      { message: "Error running cron job" },
      { status: 500 }
    );
  }
}
