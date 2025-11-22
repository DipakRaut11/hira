"use client";

import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      
      <nav className="flex flex-col space-y-2">
        <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>

        <Link href="/admin/heroimages" className="hover:bg-gray-700 p-2 rounded">
          Hero Images
        </Link>

        <Link href="/admin/companyInfo" className="hover:bg-gray-700 p-2 rounded">
          Company Info
        </Link>

        <Link href="/admin/services" className="hover:bg-gray-700 p-2 rounded">
          Services
        </Link>

        <Link href="/admin/usersmessages" className="hover:bg-gray-700 p-2 rounded">
          Contact Messages
        </Link>

        <Link href="/admin/projects" className="hover:bg-gray-700 p-2 rounded">
          Projects
        </Link>

        <Link href="/admin/news-event" className="hover:bg-gray-700 p-2 rounded">
          News & Events
        </Link>
      </nav>
    </aside>
  );
}
