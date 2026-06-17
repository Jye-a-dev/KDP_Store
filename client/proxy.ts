import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth Guard Proxy (Next.js 16+)
 *
 * Protected routes:
 *  - /dashboard/admin/*  → requires kdp_role=admin cookie
 *  - /dashboard/customer/* → requires any valid token
 *
 * Auth state mirrors:
 *  - kdp_token  (JWT bearer)
 *  - kdp_role   (user role: "admin" | "customer")
 */

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((r) => pathname.startsWith(r));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("kdp_token")?.value;
  const role = request.cookies.get("kdp_role")?.value;

  // 1. Protected pages → require token
  if (isProtected(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Admin-only route accessed by non-admin
  if (pathname.startsWith("/dashboard/admin") && token && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // 3. Customer-only route accessed by non-customer
  if (pathname.startsWith("/dashboard/customer") && token && role !== "customer") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // 4. Base /dashboard route redirect
  if (pathname === "/dashboard" && token) {
    const dest = role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // 5. Already-logged-in user on auth pages → redirect to dashboard
  if (isAuthRoute(pathname) && token) {
    const dest = role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
