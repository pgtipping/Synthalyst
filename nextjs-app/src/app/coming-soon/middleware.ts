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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a development environment
  const isDev = process.env.NODE_ENV === "development";

  // Check if the URL has a dev query parameter
  const hasDevParam = request.nextUrl.searchParams.has("dev");

  // Always allow access in development mode or if dev parameter is present
  if (isDev || hasDevParam) {
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all tool paths
    "/2do/:path*",
    "/learning-content/:path*",
    "/knowledge-gpt/:path*",
    "/competency-manager/:path*",
    "/model-comparison/:path*",
    "/the-synth/:path*",
    // Also match the root paths
    "/2do",
    "/learning-content",
    "/knowledge-gpt",
    "/competency-manager",
    "/model-comparison",
    "/the-synth",
  ],
};
