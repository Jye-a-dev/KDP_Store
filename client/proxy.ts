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

  const isValidRole = role === "admin" || role === "customer";

  // 1. Protected pages -> require token and valid role
  if (isProtected(pathname) && (!token || !isValidRole)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token || role) {
      response.cookies.set("kdp_token", "", { maxAge: 0 });
      response.cookies.set("kdp_role", "", { maxAge: 0 });
    }
    return response;
  }

  // 2. Admin-only route accessed by non-admin
  if (pathname.startsWith("/dashboard/admin") && token && role !== "admin") {
    if (role === "customer") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("kdp_token", "", { maxAge: 0 });
    response.cookies.set("kdp_role", "", { maxAge: 0 });
    return response;
  }

  // 3. Customer-only route accessed by non-customer
  if (pathname.startsWith("/dashboard/customer") && token && role !== "customer") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("kdp_token", "", { maxAge: 0 });
    response.cookies.set("kdp_role", "", { maxAge: 0 });
    return response;
  }

  // 4. Base /dashboard route redirect
  if (pathname === "/dashboard" && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else if (role === "customer") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    } else {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("kdp_token", "", { maxAge: 0 });
      response.cookies.set("kdp_role", "", { maxAge: 0 });
      return response;
    }
  }

  // 5. Already-logged-in user on auth pages -> redirect to dashboard
  if (isAuthRoute(pathname) && token && isValidRole) {
    const dest = role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
