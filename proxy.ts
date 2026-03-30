import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Halaman-halaman yang butuh login
const PROTECTED_ROUTES = ["/dashboard", "/harian", "/mingguan", "/bulanan", "/tahunan", "/habit"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !req.auth) {
    // Belum login, redirect ke halaman home
    const url = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/harian/:path*", "/mingguan/:path*", "/bulanan/:path*", "/tahunan/:path*", "/habit/:path*"],
};
