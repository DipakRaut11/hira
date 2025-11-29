'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin status on client side
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Fetching admin status...');
        const response = await fetch('/api/auth/check');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Admin status data:', data);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Error fetching admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/our-projects', label: 'Our Projects' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/news-event', label: 'News & Events' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  if (isLoading) {
    return (
      <>
        <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md text-gray-800 py-4 px-6 md:py-6 md:px-8 flex justify-between items-center shadow-md z-50 border-b border-[#C3A68A]">
          <h1 className="text-2xl font-bold tracking-wide text-[#8B5E3C]">HIRA</h1>
          <div className="text-sm text-gray-500">Loading...</div>
        </nav>
        <div className="h-16 md:h-24" />
      </>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md text-gray-800 py-4 px-6 md:py-6 md:px-8 flex justify-between items-center shadow-md z-50 border-b border-[#C3A68A]">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-[#8B5E3C] hover:scale-105 transition-transform">
          HIRA
        </Link>

        {/* Hamburger button for mobile */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-all hover:text-[#8B5E3C] hover:font-semibold py-2 px-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
{isOpen && (
  <div className="md:hidden fixed top-16 left-0 w-full bg-white/50 backdrop-blur-md shadow-lg z-40 flex flex-col space-y-0 py-4">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="text-gray-800 font-medium py-3 px-6 transition-all hover:bg-[#8B5E3C]/80 hover:text-white border-b border-gray-100"
        onClick={() => setIsOpen(false)}
      >
        {link.label}
      </Link>
    ))}
  </div>
)}

    
      {/* Spacer to match navbar height */}
      <div className="h-16 md:h-19" />
    </>
  );
}