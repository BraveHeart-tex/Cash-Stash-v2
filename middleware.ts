import { LOCALES } from "@/lib/constants";
import { verifyRequestOrigin } from "lucia";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export async function middleware(request: NextRequest) {
  const authorizationToken = request.headers.get("Authorization") || "";
  const isCronJob = request.url.includes("/api/cron");

  if (isCronJob && authorizationToken !== env.CRON_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isCronJob && authorizationToken === env.CRON_API_KEY) {
    return NextResponse.next();
  }

  if (request.method !== "GET") {
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
  }

  const [, locale, ...segments] = request.nextUrl.pathname.split("/");

  if (locale != null && segments.join("/") === "profile") {
    const usesNewProfile =
      (request.cookies.get("NEW_PROFILE")?.value || "false") === "true";

    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }
  }

  const handleI18nRouting = createIntlMiddleware({
    locales: LOCALES,
    defaultLocale: "en",
  });

  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  matcher: ["/", "/(en|tr)/:path*", "/api/cron/:path*"],
};
