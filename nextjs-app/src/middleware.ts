import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect routes that require authentication
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/jd-developer/:path*",
    "/2do/:path*",
    "/training-plan/:path*",
    "/api/protected/:path*",
  ],
};
