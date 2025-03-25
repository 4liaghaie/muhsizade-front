"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({ categories = [] }) {
  const [logoUrl, setLogoUrl] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch(
          "http://muhsinzade.com:1337/api/logo?populate=*"
        );
        const data = await res.json();
        const logo =
          data?.data?.img?.formats?.medium?.url || data?.data?.img?.url;
        const baseUrl = "http://muhsinzade.com:1337";
        setLogoUrl(logo ? baseUrl + logo : "");
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }
    fetchLogo();
  }, []);

  // Consolidated navigation links used in both desktop and mobile menus.
  const navLinks = (
    <>
      <li>
        <Link
          href="/"
          className="text-black hover:text-gray-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
      </li>
      {categories.length > 0 ? (
        categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/${cat.Title}`}
              className="text-black hover:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {cat.Title}
            </Link>
          </li>
        ))
      ) : (
        <li className="text-gray-400">No categories available</li>
      )}
      <li>
        <Link
          href="/references"
          className="text-black hover:text-gray-300"
          onClick={() => setIsMenuOpen(false)}
        >
          References
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className="text-black hover:text-gray-300"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          className="text-black hover:text-gray-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
      </li>
    </>
  );

  // Social Icons JSX for both desktop and mobile.
  const socialIcons = (
    <>
      <Link
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Updated Instagram icon */}
        <svg
          className="h-6 w-6 text-black hover:text-gray-500"
          fill="currentColor"
          viewBox="0 0 448 512"
        >
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.3 0-74.7-33.4-74.7-74.7 0-41.3 33.4-74.7 74.7-74.7 41.3 0 74.7 33.4 74.7 74.7 0 41.3-33.4 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9h-26.9c-14.9 0-26.9-12-26.9-26.9v-26.9c0-14.9 12-26.9 26.9-26.9h26.9c14.9 0 26.9 12 26.9 26.9v26.9zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.5 11.7-99.5 9-132.3 9s-102.7 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.5-9-99.5-9-132.3s-2.6-102.7 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5 29.5-11.7 99.5-9 132.3-9s102.7-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.5 9 99.5 9 132.3s2.7 102.7-9 132.3z" />
        </svg>
      </Link>
      <Link
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="h-6 w-6 text-black hover:text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22 12.07c0-5.52-4.48-10-10-10S2 6.55 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.24c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07z" />
        </svg>
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="h-6 w-6 text-black hover:text-gray-500"
          fill="currentColor"
          viewBox="0 0 448 512"
        >
          <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.81 0 54.11a53.79 53.79 0 1 1 107.58 0c0 29.7-24.09 54-53.79 54zm394.21 339.9h-92.68V302.4c0-34.7-12.45-58.4-43.6-58.4-23.78 0-37.88 16-44.2 31.4-2.3 5.5-2.9 13.2-2.9 20.9V448H171.4V148.9h92.88v40.8h1.3c12.4-23.4 42.5-47.9 87.4-47.9 62.3 0 108.9 40.7 108.9 128.1z" />
        </svg>
      </Link>
      <Link
        href="https://behance.net"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Provided Behance icon with fill="currentColor" */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black hover:text-gray-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
        </svg>
      </Link>
    </>
  );

  return (
    <nav className="p-4 relative">
      {/* Desktop Top Bar using a 3-column grid for proper centering */}
      <div className="hidden md:grid grid-cols-3 items-center">
        {/* Left Column: Logo */}
        <div className="flex justify-start">
          {logoUrl ? (
            <Link href="/">
              <img src={logoUrl} alt="Saeed Mosallat" className="h-12 w-auto" />
            </Link>
          ) : (
            <div className="h-10 w-10 bg-gray-300" />
          )}
        </div>
        {/* Center Column: Site Name */}
        <div className="flex justify-center">
          <h1 className="text-4xl">Saeed Mosallat</h1>
        </div>
        {/* Right Column: Social Icons */}
        <div className="flex justify-end">
          <div className="flex space-x-4">{socialIcons}</div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between relative">
        {/* Toggle Button on the Left */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Center: Site Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl md:text-4xl">Saeed Mosallat</h1>
        </div>
        {/* Right: Logo */}
        <div className="flex items-center">
          {logoUrl ? (
            <Link href="/">
              <img src={logoUrl} alt="Saeed Mosallat" className="h-12 w-auto" />
            </Link>
          ) : (
            <div className="h-10 w-10 bg-gray-300" />
          )}
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex justify-center mt-4 space-x-4">
        {navLinks}
      </ul>

      {/* Mobile Full-Screen Menu with Transition */}
      <div
        className={`md:hidden fixed inset-0 bg-white bg-opacity-90 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-black"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col items-center justify-center h-full">
          <ul className="space-y-8">{navLinks}</ul>
          {/* Social Icons inside Mobile Menu */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            {socialIcons}
          </div>
        </div>
      </div>
    </nav>
  );
}
