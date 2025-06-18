import {  NextResponse } from "next/server";
import { API_ROUTES } from "./utils/api";

const publicRoutes = ["/register", "/login"];
const userRoutes = ["/house/list"];
const baseUrl = API_ROUTES.AUTH;

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
      // Verify token with backend
      const verifyResponse = await fetch(`${baseUrl}/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!verifyResponse.ok) {
        throw new Error("Token verification failed");
      }

      // If logged in and accessing a public route, redirect to /house/list
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/house/list", request.url));
      }

      // Allow access to private routes
      return NextResponse.next();
    } catch (e) {
      console.error("Token verification failed", e);

      // Attempt to refresh token
      const refreshResponse = await fetch(`${baseUrl}/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: request.cookies.toString()
        }
      });

      if (refreshResponse.ok) {
        // Get new tokens from response
        const data = await refreshResponse.json();
        const newAccessToken = data.accessToken;
        
        // Clone the response so we can modify it
        const response = NextResponse.next();
        
        // Set the new access token
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/"
        });

        // If we were trying to access a public route, redirect to /house/list
        if (publicRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL("/house/list", request.url));
        }

        return response;
      } else {
        // Only redirect to login if refresh completely fails
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  // If not authenticated and trying to access a protected route (not public)
  if (!publicRoutes.includes(pathname)) {
    // Store the original requested URL to redirect back after login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("redirect_url", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5 // 5 minutes
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};