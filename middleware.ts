import { verifyRequestOrigin } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const authorizationToken = request.headers.get("Authorization") || "";
  const isCronJob = request.url.includes("/api/cron");

  if (isCronJob && authorizationToken !== process.env.CRON_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "GET") {
    return NextResponse.next();
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}
