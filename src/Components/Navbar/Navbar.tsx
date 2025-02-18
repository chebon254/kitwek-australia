"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "about-us" },
    { name: "Events", href: "events" },
    { name: "Contact Us", href: "contact-us" },
  ];

  return (
    <nav className={`w-full bg-[#00000077] z-20 fixed top-0 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center font-bold text-[#ffffff] text-2xl">
              KITWEK VICTORIA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base md:px-5 lg:px-10 font-[family-name:var(--font-ubuntu-sans)] font-semibold tracking-wider text-white transition-colors hover:text-gray-300"
                >
                  {item.name}
                </Link>
              ))}
              <Link href={"/sign-in"} className="bg-white rounded-lg h-14 px-10 py-4 mx-2 w-40 outline-none text-xl text-black leading-6 font-bold">
                Sign In
              </Link>
              <Link href={"/sign-up"} className="bg-white rounded-lg h-14 px-10 py-4 mx-2 w-60 outline-none text-xl text-black leading-6 font-bold">
                Join us today
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white"
              >
                <Image
                  src={"/ui-assets/bx-menu-alt-right.svg"}
                  alt="Open menu"
                  width={50}
                  height={50}
                />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
            {isOpen && (
              <div className="fixed inset-0 z-50 bg-white w-full">
                <div className="absolute top-6 right-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-black flex items-center justify-center h-[60px] w-[60px] rounded-full hover:bg-gray-100 transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>
                <div className="flex flex-col justify-center h-full w-full mx-auto space-y-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-center text-3xl font-[family-name:var(--font-ubuntu-sans)] font-semibold text-black hover:bg-gray-100 py-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}