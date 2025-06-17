import {  NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/house/list"];

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Root path redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(accessToken ? "/house/list" : "/login", request.url)
    );
  }

  // Authenticated user visiting login/register → redirect to /house/list
  if (accessToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/house/list", request.url));
  }

  // Not authenticated trying to access protected routes → redirect to login
  if (!accessToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
