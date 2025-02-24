"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, CheckCircle, XCircle } from "lucide-react";

export default function ThankYou() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    if (!searchParams.has("success")) {
      router.push("/donations");
    }
  }, [router, searchParams]);

  if (success) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Thank You for Your Donation!
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Your generous contribution will help make a difference. We've
                sent you a confirmation email with the details.
              </p>
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => router.push("/donations")}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  View More Causes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Donation Canceled
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Your donation was not completed. You can try again or choose
              another cause to support.
            </p>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/donations")}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View Other Causes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
