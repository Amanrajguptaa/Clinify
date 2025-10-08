import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const clinifyAccessToken = request.cookies.get("clinifyAccessToken")?.value;
  const clinifyRefreshToken = request.cookies.get("clinifyRefreshToken")?.value;
  const isLoggedIn = !!clinifyAccessToken || !!clinifyRefreshToken;

  const currentPath = request.nextUrl.pathname;

  if (!isLoggedIn) {
    if (currentPath === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoggedIn) {
    if (currentPath === "/") {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|_next/data).*)"
  ],
};
