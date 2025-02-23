"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Membership() {
  const router = useRouter();
  const [membershipStatus, setMembershipStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const response = await fetch("/api/user/membership");
      const data = await response.json();
      setMembershipStatus(data.membershipStatus);
      setLoading(false);
    };

    fetchMembershipStatus();
  }, []);

  const handleActivateMembership = async () => {
    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "membership" }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error("Error activating membership:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (membershipStatus === "ACTIVE") {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Welcome, Member!
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Your membership is active. You now have full access to all
                features.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Edit Profile
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
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Activate Your Membership
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Complete your membership activation to access all features.
            </p>
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
                <div className="px-6 py-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        One-time Membership Fee
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Lifetime access to member features
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-indigo-600">
                      $30
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">
                        Access to member directory
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">
                        Participate in forums
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">
                        Access to events and activities
                      </span>
                    </li>
                  </ul>
                  <button
                    onClick={handleActivateMembership}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Pay $30 to Activate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
