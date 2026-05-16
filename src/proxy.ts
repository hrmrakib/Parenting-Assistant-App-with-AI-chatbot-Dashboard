import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./service/authService";

export async function proxy(request: NextRequest) {
  const token = await getCurrentUser();
  const { pathname } = request.nextUrl;

  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/content",
    "/users",
    "/setting",
    "/setting/privacy-policy",
    "/setting/terms-condition",
    "/setting/about",
    "/setting/personal-information",
    "/setting/change-password",
  ],
};
