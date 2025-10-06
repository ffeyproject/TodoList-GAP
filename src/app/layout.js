// src/app/layout.js
"use client";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // daftar halaman yang tidak butuh header/footer
  const noLayoutRoutes = ["/login", "/auth"];
  const hideLayout = noLayoutRoutes.includes(pathname);

  // pastikan Bootstrap JS dimuat di sisi client
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body>
        {!hideLayout && <Header />}
        <main className={!hideLayout ? "container my-4" : ""}>{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
