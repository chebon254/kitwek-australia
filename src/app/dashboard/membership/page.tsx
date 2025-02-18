"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { stripe } from '@/lib/stripe';

export default function Membership() {
  const router = useRouter();
  const [membershipStatus, setMembershipStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const response = await fetch('/api/user/membership');
      const data = await response.json();
      setMembershipStatus(data.membershipStatus);
      setLoading(false);
    };

    fetchMembershipStatus();
  }, []);

  const handleActivateMembership = async () => {
    try {
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'membership' }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error('Error activating membership:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (membershipStatus === 'ACTIVE') {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome, Member!
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Your membership is active. You now have full access to all features.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Activate Your Membership
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Complete your membership activation to access all features.
        </p>
        <div className="mt-8">
          <button
            onClick={handleActivateMembership}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Pay $30 to Activate
          </button>
        </div>
      </div>
    </div>
  );
}