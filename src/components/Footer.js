"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-extra-dark text-light text-center py-3 mt-5">
      <p className="mb-0">
        &copy; {year} GAP TODOLIST APP. All rights reserved.
      </p>
    </footer>
  );
}
