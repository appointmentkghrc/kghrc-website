"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "Pages", href: "/about", hasDropdown: true },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Gallery", href: "/gallery", hasDropdown: true },
  {
    label: "Blog",
    href: "/blog",
    hasDropdown: true,
  },
  { label: "Contact", href: "/contact", hasDropdown: false },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();
  const isWhiteNavPage =
    pathname?.startsWith("/blog") ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname === "/services" ||
    pathname === "/gallery";

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky navbar - slides down when scrolled past 40px */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-transform duration-200 ease-out ${
          isSticky
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16 py-4 lg:py-5">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden rounded p-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-800 font-bold text-xl tracking-wide"
            >
              <Image
                src="/logo.png"
                alt="KGH logo"
                width={200}
                height={56}
                priority
              />
            </Link>
          </div>

          <ul className="hidden lg:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center text-gray-800 text-sm font-medium capitalize hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center gap-3 text-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <i
                  className="fa-solid fa-headset text-secondary text-xl"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-xs text-gray-600">EMERGENCY CASE</p>
                <a
                  href="tel:06512450844"
                  className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors"
                >
                  No. 06512450844
                </a>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-2 text-gray-800 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Transparent navbar over hero */}
      <nav
        className={`relative z-20 w-full py-4 lg:py-5 ${
          isWhiteNavPage
            ? "bg-white shadow-md border-b border-gray-100"
            : "lg:border-b lg:border-white/20"
        }`}
        style={
          isWhiteNavPage ? undefined : { background: "transparent", boxShadow: "none" }
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center">
            <button
              type="button"
              className={`lg:hidden rounded p-2 ${
                isWhiteNavPage
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="KGH logo"
                width={200}
                height={56}
                priority
              />
            </Link>
          </div>

          <ul className="hidden lg:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`flex items-center text-sm font-medium capitalize hover:text-primary transition-colors ${
                    isWhiteNavPage ? "text-gray-800" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <div
              className={`hidden lg:flex items-center gap-3 ${
                isWhiteNavPage ? "text-gray-800" : "text-white"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <i
                  className="fa-solid fa-headset text-secondary text-2xl"
                  aria-hidden
                />
              </div>
              <div>
                <p
                  className={`text-xs ${
                    isWhiteNavPage ? "text-gray-600" : "text-white/80"
                  }`}
                >
                  EMERGENCY CASE
                </p>
                <a
                  href="tel:06512450844"
                  className={`text-sm font-semibold hover:text-primary transition-colors ${
                    isWhiteNavPage ? "text-gray-800" : "text-white"
                  }`}
                >
                  No. 06512450844
                </a>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${
              isWhiteNavPage
                ? "border-gray-200 bg-white"
                : "border-white/20 bg-black/30 backdrop-blur-sm"
            }`}
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block py-2 hover:text-primary transition-colors ${
                      isWhiteNavPage ? "text-gray-800" : "text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

