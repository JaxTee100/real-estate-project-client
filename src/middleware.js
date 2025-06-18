// import { NextRequest, NextResponse } from "next/server";
// import { API_ROUTES } from "./utils/api";

// const publicRoutes = ["/register", "/login"];
// const userRoutes = ["/house/list"];
// const baseUrl = API_ROUTES.AUTH;

// export async function middleware(request) {
//   const accessToken = request.cookies.get("accessToken")?.value;
//   const { pathname } = request.nextUrl;

//   // Handle root path "/"
//   if (pathname === "/") {
//     if (accessToken) {
//       return NextResponse.redirect(new URL("/house/list", request.url));
//     } else {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   if (accessToken) {
//     try {
//       // If logged in and accessing a public route, redirect to /house/list
//       if (publicRoutes.includes(pathname)) {
//         return NextResponse.redirect(new URL("/house/list", request.url));
//       }

//       // Allow access to private routes
//       return NextResponse.next();
//     } catch (e) {
//       console.error("Token verification failed", e);

//       const refreshResponse = await fetch(`${baseUrl}/refresh-token`, {
//         method: "POST",
//         credentials: "include",
//       });

//       if (refreshResponse.ok) {
//         const response = NextResponse.next();
//         response.cookies.set(
//           "accessToken",
//           refreshResponse.headers.get("Set-Cookie") || ""
//         );
//         return response;
//       } else {
//         const response = NextResponse.redirect(new URL("/login", request.url));
//         response.cookies.delete("accessToken");
//         response.cookies.delete("refreshToken");
//         return response;
//       }
//     }
//   }

//   // If not authenticated and trying to access a protected route (not public)
//   if (!publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextRequest, NextResponse } from "next/server";

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
