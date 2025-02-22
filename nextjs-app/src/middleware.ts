import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect routes that require authentication
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Only run middleware on protected routes
export const config = {
  matcher: [
    "/jd-developer/:path*",
    "/2do/:path*",
    "/training-plan/:path*",
    "/blog/new",
    "/blog/edit/:path*",
  ],
};
