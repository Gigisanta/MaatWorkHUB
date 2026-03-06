import { requireFounder } from "@maatwork/auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if path is dynamic app route
  const appSlugMatch = pathname.match(/^\/([^\/]+)/);

  if (appSlugMatch) {
    const potentialAppSlug = appSlugMatch[1];
    // Skip non-app routes
    const studioRoutes = [
      "apps",
      "analytics",
      "audit",
      "billing",
      "clients",
      "health",
      "pipeline",
      "templates",
    ];
    if (studioRoutes.includes(potentialAppSlug)) {
      // Studio routes - require founder
      return await requireFounder(req);
    }
    // It's an appSlug route - will be validated by the page component
    return NextResponse.next();
  }

  // Studio root routes
  return await requireFounder(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
