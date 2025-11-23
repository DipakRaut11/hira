'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/our-projects', label: 'Our Projects' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/news-event', label: 'News & Events' },
    { href: '/admin/heroimages', label: 'Admin' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md text-gray-800 py-4 px-6 md:py-6 md:px-8 flex justify-between items-center shadow-md z-50 border-b border-[#C3A68A]">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-[#8B5E3C]">HIRA</h1>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links - hidden on mobile */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-all hover:text-[#8B5E3C] hover:font-bold hover:text-xl"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-md z-40 flex flex-col space-y-4 py-4 px-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 font-medium transition-all hover:text-[#8B5E3C] hover:font-bold"
              onClick={() => setIsOpen(false)} // close menu when clicked
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Spacer to match navbar height */}
      <div className="h-16 md:h-24" />
    </>
  );
}
