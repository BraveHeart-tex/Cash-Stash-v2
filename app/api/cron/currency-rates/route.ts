import cronService from "@/lib/services/cronService";
import logger from "@/lib/utils/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cronJobStatus = await cronService.updateCurrencyRates();

    if (!cronJobStatus) {
      return NextResponse.json(
        { message: "Error running cron job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Cron job ran successfully!" });
  } catch (error) {
    logger.error("Error running cron job");

    return NextResponse.json(
      { message: "Error running cron job" },
      { status: 500 }
    );
  }
}
