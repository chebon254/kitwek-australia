'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user.name}!
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Membership Status
              </h2>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium text-green-600">Active</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link href={"/dashboard/account"} className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  View Profile Settings
                </Link>
                <br />
                <Link href={"/dashboard/membership"} className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  Billing History
                </Link>
                <br />
                <Link href={"/dashboard/members"} className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  Members
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}