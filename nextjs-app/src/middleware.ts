import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of tools that are ready for production
const PRODUCTION_READY_TOOLS = [
  "/jd-developer",
  "/interview-questions",
  "/training-plan",
  "/competency-manager",
];

// List of all tool paths to check against
const ALL_TOOL_PATHS = [
  "/jd-developer",
  "/interview-questions",
  "/training-plan",
  "/2do",
  "/learning-content",
  "/knowledge-gpt",
  "/competency-manager",
  "/model-comparison",
  "/the-synth",
];

// Non-tool paths that should always be accessible
const ALWAYS_ACCESSIBLE_PATHS = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/get-started",
  "/auth",
  "/login",
  "/api",
  "/coming-soon",
];

// Middleware function to handle Coming Soon redirects
function handleComingSoonRedirects(
  req: NextRequest | { nextUrl: NextRequest["nextUrl"] }
) {
  const { pathname } = req.nextUrl;

  // Check if this is a development environment
  const isDev = process.env.NODE_ENV === "development";

  // Check if the URL has a dev query parameter
  const hasDevParam = req.nextUrl.searchParams.has("dev");

  // Always allow access in development mode or if dev parameter is present
  if (isDev || hasDevParam) {
    return null; // Continue to next middleware
  }

  // Check if the path is for a tool that's not production ready
  const isToolPath = ALL_TOOL_PATHS.some(
    (toolPath) => pathname === toolPath || pathname.startsWith(`${toolPath}/`)
  );

  const isProductionReady = PRODUCTION_READY_TOOLS.some(
    (toolPath) => pathname === toolPath || pathname.startsWith(`${toolPath}/`)
  );

  const isAlwaysAccessible = ALWAYS_ACCESSIBLE_PATHS.some(
    (accessiblePath) =>
      pathname === accessiblePath || pathname.startsWith(`${accessiblePath}/`)
  );

  // If it's a tool path, not production ready, and not always accessible, redirect to coming soon
  if (isToolPath && !isProductionReady && !isAlwaysAccessible) {
    // Extract the tool name from the path
    const toolPath = ALL_TOOL_PATHS.find(
      (toolPath) => pathname === toolPath || pathname.startsWith(`${toolPath}/`)
    );

    // Get the tool name from the path
    const toolName = toolPath?.split("/").pop() || "";

    // Format the tool name for display (capitalize and replace hyphens with spaces)
    const formattedToolName = toolName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Create the redirect URL with query parameters
    const url = new URL(req.nextUrl.toString());
    url.pathname = "/coming-soon";
    url.searchParams.set("tool", formattedToolName);
    url.searchParams.set("path", pathname);

    return NextResponse.redirect(url);
  }

  return null; // Continue to next middleware
}

// Main middleware function
export default withAuth(
  function middleware(req) {
    // First, check if we need to redirect to Coming Soon
    const comingSoonRedirect = handleComingSoonRedirects(req);
    if (comingSoonRedirect) {
      return comingSoonRedirect;
    }

    const token = req.nextauth.token;

    // If no token exists and this is a protected route, redirect to login
    if (!token && isProtectedRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow Coming Soon redirects to happen without requiring auth
        if (isComingSoonRoute(req.nextUrl.pathname)) {
          return true;
        }
        // For protected routes, require a token
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// Helper function to check if a route requires authentication
function isProtectedRoute(pathname: string) {
  const protectedRoutes = ["/api/protected"];

  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Helper function to check if a route should redirect to Coming Soon
function isComingSoonRoute(pathname: string) {
  const comingSoonRoutes = [
    "/2do",
    "/learning-content",
    "/knowledge-gpt",
    "/model-comparison",
    "/the-synth",
    "/blog",
  ];

  return comingSoonRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Configure which routes to protect
export const config = {
  matcher: [
    // Authentication protected routes (only API routes)
    "/api/protected/:path*",

    // Coming Soon routes
    "/2do/:path*",
    "/learning-content/:path*",
    "/knowledge-gpt/:path*",
    "/model-comparison/:path*",
    "/the-synth/:path*",
    "/blog/:path*",

    // Root paths for Coming Soon
    "/2do",
    "/learning-content",
    "/knowledge-gpt",
    "/model-comparison",
    "/the-synth",
    "/blog",
  ],
};
