import { NextResponse } from "next/server";
import { API_ROUTES } from "./utils/api";

const publicRoutes = ["/register", "/login"];
const userRoutes = ["/house/list"];
const baseUrl = API_ROUTES.AUTH;

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // // Handle root path "/"


  const token = request.cookies.get('accessToken')?.value;

  const isAuthRoute = publicRoutes.includes(pathname)

  console.log("🔍 Middleware token:", token || "(none)");
  console.log("🔍 Pathname:", pathname);

 

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/house/list", request.url));

  }

  if (!token && !isAuthRoute ) {
    console.log("⛔ No token, redirecting to /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthRoute) {
    console.log("✅ Token exists, redirecting to /house/list");
    return NextResponse.redirect(new URL('/house/list', request.url)); // or wherever
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};