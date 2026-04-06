"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "About us", href: "/about", hasDropdown: true },
  { label: "Doctors", href: "/doctors", hasDropdown: true },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Gallery", href: "/gallery", hasDropdown: true },
  {
    label: "Blog",
    href: "/blog",
    hasDropdown: true,
  },
  { label: "Contact", href: "/contact", hasDropdown: false },
];

/** Translucent green-tinted glass (inner pages + sticky bar on scroll) */
const navGlassSolid =
  "bg-[#84ad3b]/28 backdrop-blur-lg backdrop-saturate-125 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-white/25";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [contactPhoneLoading, setContactPhoneLoading] = useState(true);
  const pathname = usePathname();
  const isWhiteNavPage =
    pathname?.startsWith("/blog") ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname?.startsWith("/doctors") ||
    pathname === "/services" ||
    pathname?.startsWith("/services/item") ||
    pathname === "/gallery" ||
    pathname?.startsWith("/diagnostic-services");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await apiFetch("/api/site-settings");
        if (!response.ok) return;
        const data = await response.json();
        setEmergencyPhone(data?.secondaryPhone || "");
      } catch (error) {
        console.error("Failed to fetch contact settings for navbar:", error);
      } finally {
        setContactPhoneLoading(false);
      }
    };

    fetchContactSettings();
  }, []);

  return (
    <>
      {/* Sticky navbar - slides down when scrolled past 40px */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-200 ease-out ${navGlassSolid} ${
          isSticky
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16 py-4 lg:py-5">
          <div className="flex items-center gap-3 lg:gap-0">
            <button
              type="button"
              className="lg:hidden shrink-0 rounded p-2 text-gray-900 hover:bg-white/25"
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
              className="flex min-w-0 items-center gap-2 sm:gap-3 lg:-ml-8 lg:gap-3 xl:-ml-10 text-gray-900 font-bold text-xl tracking-wide"
            >
              <Image
                src="/Ayushman_Bharat_logo.png"
                alt="Ayushman Bharat"
                width={168}
                height={48}
                className="h-9 w-auto object-contain sm:h-10"
              />
              <Image
                src="/nabh-remove.png"
                alt="NABH accredited"
                width={56}
                height={56}
                className="h-9 w-auto object-contain sm:h-10"
              />
              <Image
                src="/logo.png"
                alt="KGH logo"
                width={200}
                height={56}
                className="h-10 w-auto object-contain sm:h-12"
                priority
              />
            </Link>
          </div>

          <ul className="hidden lg:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center text-gray-900 text-sm font-medium capitalize hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center gap-3 text-gray-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/35">
                <i
                  className="fa-solid fa-headset text-secondary text-xl"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-xs text-gray-800/90">Contact Us</p>
                <a
                  href={
                    emergencyPhone
                      ? `tel:${emergencyPhone.replace(/[^\d+]/g, "")}`
                      : "#"
                  }
                  className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                  aria-busy={contactPhoneLoading}
                >
                  {contactPhoneLoading
                    ? "Loading.."
                    : emergencyPhone || "N/A"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-[#84ad3b]/35 backdrop-blur-lg backdrop-saturate-125">
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-2 text-gray-900 hover:text-primary transition-colors"
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

      {/* Inner pages: green glass. Home at top of page: transparent over hero (sticky bar adds glass after scroll). */}
      <nav
        className={`relative z-20 w-full py-4 lg:py-5 ${
          isWhiteNavPage ? navGlassSolid : "lg:border-b lg:border-white/20"
        }`}
        style={
          isWhiteNavPage ? undefined : { background: "transparent", boxShadow: "none" }
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-3 lg:gap-0">
            <button
              type="button"
              className={`lg:hidden shrink-0 rounded p-2 ${
                isWhiteNavPage
                  ? "text-gray-900 hover:bg-white/25"
                  : "text-white hover:bg-white/15"
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
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 sm:gap-3 lg:-ml-8 lg:gap-3 xl:-ml-10"
            >
              <Image
                src="/Ayushman_Bharat_logo.png"
                alt="Ayushman Bharat"
                width={168}
                height={48}
                className="h-9 w-auto object-contain sm:h-10"
              />
              <Image
                src="/nabh-remove.png"
                alt="NABH accredited"
                width={56}
                height={56}
                className="h-9 w-auto object-contain sm:h-10"
              />
              <Image
                src="/logo.png"
                alt="KGH logo"
                width={200}
                height={56}
                className="h-10 w-auto object-contain sm:h-12"
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
                    isWhiteNavPage ? "text-gray-900" : "text-white"
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
                isWhiteNavPage ? "text-gray-900" : "text-white"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isWhiteNavPage ? "bg-white/35" : "bg-white/20"
                }`}
              >
                <i
                  className="fa-solid fa-headset text-secondary text-2xl"
                  aria-hidden
                />
              </div>
              <div>
                <p
                  className={`text-xs ${
                    isWhiteNavPage ? "text-gray-800/90" : "text-white/80"
                  }`}
                >
                  Contact Us
                </p>
                <a
                  href={
                    emergencyPhone
                      ? `tel:${emergencyPhone.replace(/[^\d+]/g, "")}`
                      : "#"
                  }
                  className={`text-sm font-semibold hover:text-primary transition-colors ${
                    isWhiteNavPage ? "text-gray-900" : "text-white"
                  }`}
                  aria-busy={contactPhoneLoading}
                >
                  {contactPhoneLoading
                    ? "Loading.."
                    : emergencyPhone || "N/A"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${
              isWhiteNavPage
                ? "border-white/20 bg-[#84ad3b]/35 backdrop-blur-lg backdrop-saturate-125"
                : "border-white/20 bg-black/30 backdrop-blur-sm"
            }`}
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block py-2 hover:text-primary transition-colors ${
                      isWhiteNavPage ? "text-gray-900" : "text-white"
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

