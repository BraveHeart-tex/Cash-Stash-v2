import { NextRequest, NextResponse } from "next/server";
import { verifyJWTToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const token = cookies.get("token")?.value;
  const isLoginPage = nextUrl.pathname.startsWith("/login");
  const isRegisterPage = nextUrl.pathname.startsWith("/signup");
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  const hasVerifiedToken =
    token && (await verifyJWTToken(token).catch((error) => console.log(error)));

  if ((isLoginPage || isRegisterPage) && !hasVerifiedToken)
    return NextResponse.next();

  if ((isLoginPage || isRegisterPage) && hasVerifiedToken) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (isApiRoute && !hasVerifiedToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  if (!hasVerifiedToken) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/server|favicon.ico|m.svg|manifest.json).*)",
  ],
};
