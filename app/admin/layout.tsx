"use client";

import { useState, ReactNode } from "react";
import { AdminSidebar } from "../../components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <AdminSidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <main
        className={`mt-24 p-6 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
