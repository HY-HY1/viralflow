import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Temporarily disabled for development
  return NextResponse.next();

  // const token = request.cookies.get("token")?.value;
  // const { pathname } = request.nextUrl;

  // // Public paths that don't require authentication
  // const publicPaths = ["/", "/login", "/register", "/onboarding"];
  
  // // Protected routes that require authentication
  // const isProtectedRoute = pathname.startsWith("/dashboard");
  // const isPublicPath = publicPaths.includes(pathname);

  // if (isProtectedRoute && !token) {
  //   // Redirect to signin if trying to access protected route without auth
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (isPublicPath && token) {
  //   // Redirect to dashboard if trying to access public route while authenticated
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 