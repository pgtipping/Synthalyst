import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of tools that are ready for production
const PRODUCTION_READY_TOOLS = [
  "/jd-developer",
  "/interview-questions",
  "/training-plan",
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
  "/blog",
  "/get-started",
  "/auth",
  "/login",
  "/api",
  "/coming-soon",
];

// Middleware function to handle Coming Soon redirects
function handleComingSoonRedirects(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a development environment
  const isDev = process.env.NODE_ENV === "development";

  // Check if the URL has a dev query parameter
  const hasDevParam = request.nextUrl.searchParams.has("dev");

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
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.searchParams.set("tool", formattedToolName);
    url.searchParams.set("path", pathname);

    return NextResponse.redirect(url);
  }

  return null; // Continue to next middleware
}

// Main middleware function
export function middleware(request: NextRequest) {
  // First, check if we need to redirect to Coming Soon
  const comingSoonRedirect = handleComingSoonRedirects(request);
  if (comingSoonRedirect) {
    return comingSoonRedirect;
  }

  // Continue with normal processing
  return NextResponse.next();
}

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
