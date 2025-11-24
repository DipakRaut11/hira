import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedIPs = ["192.168.18.83", "127.0.0.1", "::1"]; // Added localhost IPs for development

export function middleware(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") ?? "";
  
  console.log('Middleware - Detected IP:', ip); // Add logging
  
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Handle API auth check
  if (isApiAuthRoute) {
    const isAdmin = allowedIPs.includes(ip);
    console.log('Middleware - API Auth Check - Is Admin:', isAdmin); // Add logging
    return NextResponse.json({ isAdmin });
  }

  // Protect admin routes
  if (isAdminRoute && !allowedIPs.includes(ip)) {
    console.log('Middleware - Blocked admin access from IP:', ip); // Add logging
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};