import type { NextRequest } from "next/server";

/**
 * Handle redirects for the modular architecture.
 *
 * This function checks if the request path matches any of the old paths that
 * need to be redirected to new module-specific paths.
 */
export function handleRedirects(request: NextRequest): Response | undefined {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Admin redirects
  if (pathname.startsWith("/admin")) {
    // Keep the URL the same - Next.js route groups are transparent in the URL structure
    // The (admin) route group will handle these URLs without needing a redirect
    return undefined;
  }

  // Future redirects for other modules can be added here

  // No redirect needed
  return undefined;
}
