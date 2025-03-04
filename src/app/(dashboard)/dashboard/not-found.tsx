"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardNotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Get previous path from history or localStorage if available
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the previous path from localStorage
    const storedPath = localStorage.getItem("lastVisitedPath");
    if (storedPath && storedPath !== window.location.pathname) {
      setPreviousPath(storedPath);
    }

    // Store current path before navigation
    const handleBeforeUnload = () => {
      localStorage.setItem("lastVisitedPath", window.location.pathname);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  const goBack = () => {
    if (previousPath) {
      router.push(previousPath);
    } else {
      router.back();
    }
  };

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center">
            {/* 404 Image */}
            <div className="relative w-full h-64 mb-8">
              <Image
                src="/ui-assets/404.png"
                alt="404 Not Found"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            {/* Error Message */}
            <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              The dashboard page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={goBack}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Go Back
              </button>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </Link>
            </div>

            {/* Countdown */}
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}