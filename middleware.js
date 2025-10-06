import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("laravel_session"); // cookie sanctum (default)

  // Jika user belum login dan akses root `/`, redirect ke /login
  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Tentukan path yang diproteksi
export const config = {
  matcher: ["/"], // hanya untuk halaman utama
};
