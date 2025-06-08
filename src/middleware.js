import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/register", "/login"];
const userRoutes = ["/house/list"];

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Handle root path "/"
  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/house/list", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (accessToken) {
    try {
      // If logged in and accessing a public route, redirect to /house/list
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/house/list", request.url));
      }

      // Allow access to private routes
      return NextResponse.next();
    } catch (e) {
      console.error("Token verification failed", e);

      const refreshResponse = await fetch("http://localhost:3001/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        response.cookies.set(
          "accessToken",
          refreshResponse.headers.get("Set-Cookie") || ""
        );
        return response;
      } else {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  // If not authenticated and trying to access a protected route (not public)
  if (!publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
