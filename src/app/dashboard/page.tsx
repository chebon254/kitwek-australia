"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  username: string;
  membershipStatus: string;
  subscription: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.username}!
              </h1>
              
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Membership Status</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {user.membershipStatus}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Subscription Plan</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {user.subscription}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/dashboard/members"
                  className="relative block rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="text-base font-semibold text-gray-900">Browse Members</span>
                  <p className="mt-2 text-sm text-gray-500">Connect with other members in the community</p>
                </Link>
                
                <Link
                  href="/dashboard/profile"
                  className="relative block rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="text-base font-semibold text-gray-900">Your Profile</span>
                  <p className="mt-2 text-sm text-gray-500">View and edit your profile information</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}