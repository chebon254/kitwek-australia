"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAndUpdateSession = async () => {
      if (sessionId) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for webhook processing
        await update();
        router.replace("/dashboard");
      }
    };

    checkAndUpdateSession();
  }, [sessionId, update, router]);

  return null; // No UI needed
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.membershipStatus || session.user.membershipStatus !== "ACTIVE") {
      console.log("Redirecting to membership page");
      router.push("/dashboard/membership");
    }
  }, [session, router]);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler />
      </Suspense>
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
