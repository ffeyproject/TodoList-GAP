// src/app/layout.js
"use client";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from "react-hot-toast";


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
      <body className="bg-extra-dark">
        {!hideLayout && <Header />}
        <main className={!hideLayout ? "bg-extra-dark text-light" : "bg-extra-dark text-light"}>{children}</main>
        <ToastContainer position="top-center" autoClose={1000} style={{marginTop: "2.6rem"}} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{ marginTop: "5rem" }}
          toastOptions={{
            // Default untuk semua toast
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px 16px",
            },

            // Opsi khusus untuk tipe tertentu
            success: {
              duration: 2000,
              style: {
                background: "#16a34a",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#16a34a",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#dc2626",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#dc2626",
              },
            },
          }}
        />
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
