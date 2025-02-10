"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.membershipStatus !== "ACTIVE") {
      router.push("/dashboard/membership");
    }
  }, [session, router]);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {session.user.name}!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for being an active member.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}