'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function AdminSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/heroimages', label: 'Hero Images' },
    { href: '/admin/companyInfo', label: 'Company Info' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/usersmessages', label: 'Contact Messages' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/news-event', label: 'News & Events' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-24 z-50 bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition
          ${isOpen ? 'left-64 md:left-64' : 'left-4 md:left-64'}`}
      >
        {isOpen ? '✖' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-24 left-0 z-40 bg-gray-800 text-white h-[calc(100vh-6rem)] p-4 md:p-6
          transition-all duration-300 shadow-lg
          w-64 md:w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} transform`}
      >
        {/* Sidebar content */}
        <h2 className="text-xl font-bold mb-6 hidden md:block">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-gray-700 p-2 rounded text-sm md:text-base transition"
              onClick={toggleSidebar} // always close on mobile
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
