import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./service/authService";

export async function proxy(request: NextRequest) {
  const token = await getCurrentUser();
  const { pathname } = request.nextUrl;

  // 1. Allow the request to pass through if a token exists
  if (token) {
    // Optional: If authenticated users try to access /login, redirect them to dashboard/home
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. If there's no token, redirect everything else to the login page
  return NextResponse.redirect(new URL("/login", request.url));
}

// 3. Define the matcher rules to block everything EXCEPT auth routes and public assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (your login page path)
     * - api (your auth API routes if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    // "/((?!login|api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
