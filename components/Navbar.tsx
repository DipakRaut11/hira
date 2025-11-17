'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md text-gray-800 py-6 px-8 flex justify-between items-center shadow-md z-50 border-b border-[#C3A68A]">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-[#8B5E3C]">
          HIRA
        </h1>

        {/* Links */}
        <div className="space-x-8 text-lg font-medium">
          <Link
            href="/"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            Home
          </Link>
          <Link
            href="/about-us"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            About Us
          </Link>
          <Link
            href="/our-projects"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            Our Projects
          </Link>
          <Link
            href="/contact-us"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            Contact Us
          </Link>
          <Link
            href="/news-event"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            News & Events
          </Link>
          <Link
            href="/admin/heroimages"
            className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
          >
            Admin
          </Link>
        </div>
      </nav>

      {/* Spacer to match navbar height */}
      <div className="h-24" />

      {/* Optional subtle blue overlay */}
      <div className="fixed top-0 left-0 w-full h-24 pointer-events-none bg-gradient-to-r from-white/0 via-blue-50/20 to-white/0 z-0" />
    </>
  );
}
