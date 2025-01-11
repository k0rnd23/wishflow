import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Define public routes that don't require authentication
  const isPublicRoute = 
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/discover") ||
    request.nextUrl.pathname.startsWith("/shared") ||
    request.nextUrl.pathname === "/"
  
  // Allow access to public routes
  if (isPublicRoute) {
    if (token && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register"))) {
      return NextResponse.redirect(new URL("/wishlists", request.url))
    }
    return null
  }

  // Require authentication for all other routes
  if (!token) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    "/wishlists/:path*",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/discover/:path*",
    "/shared/:path*",
  ]
}