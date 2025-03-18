"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { UserCircle, LogOut } from "lucide-react";

interface NavbarProps {
  className?: string;
}

interface User {
  email: string;
  profileImage?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const getNavStyles = () => {
    switch (pathname) {
      case '/':
        return 'bg-[#2c2c2cbc] text-white hover:text-grey-500';
      case '/about-us':
        return 'bg-[#FFFFFF] text-black hover:text-grey-400 shadow-sm';
      default:
        return 'bg-[#2C2C2C] text-white';
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "News & Blogs", href: "/blogs" },
    { name: "Events", href: "/events" },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch('/api/user');
          const userData = await response.json();
          setUser({
            email: firebaseUser.email!,
            profileImage: userData.profileImage,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({ email: firebaseUser.email! });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isLightBackground = pathname === '/about-us';

  return (
    <nav className={`w-full z-20 fixed top-0 ${getNavStyles()} ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center font-bold text-2xl">
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
                  className={`text-base md:px-5 lg:px-10 font-[family-name:var(--font-ubuntu-sans)] font-semibold tracking-wider transition-colors ${
                    isLightBackground ? 'hover:text-gray-600' : 'hover:text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {!loading && (
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                      >
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage || '/ui-assets/avatar.webp'}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-white"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <UserCircle className={`h-6 w-6 ${isLightBackground ? 'text-black' : 'text-white'}`} />
                          </div>
                        )}
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            <Link
                              href="/dashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <UserCircle className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                handleSignOut();
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/sign-up"
                        className={`rounded-lg px-6 py-2 font-semibold transition-colors ${
                          isLightBackground 
                            ? 'bg-black text-white hover:bg-gray-800' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                      >
                        Membership
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={isLightBackground ? 'text-black' : 'text-white'}
              >
                <Image
                  src="/ui-assets/bx-menu-alt-right.svg"
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
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <Link
                            href="/dashboard/profile"
                            className="text-center text-3xl font-semibold text-black hover:bg-gray-100 py-4"
                            onClick={() => setIsOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              handleSignOut();
                            }}
                            className="text-center text-3xl font-semibold text-red-600 hover:bg-gray-100 py-4 w-full"
                          >
                            Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/sign-up"
                            className="bg-black rounded-lg h-14 px-10 flex items-center justify-center mx-auto w-60 text-xl text-white text-center font-bold hover:bg-gray-900"
                            onClick={() => setIsOpen(false)}
                          >
                            Membership
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
