"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    features: [
      'Basic member features',
      'Community access',
      'Member directory',
    ],
  },
  {
    name: 'Premium',
    price: { monthly: 4.99, annual: 49.99 },
    features: [
      'All Free features',
      'Advanced networking',
      'Priority support',
      'Exclusive content',
    ],
  },
  {
    name: 'VIP',
    price: { monthly: 9.99, annual: 99.99 },
    features: [
      'All Premium features',
      'One-on-one mentoring',
      'Custom profile badge',
      'Early access to new features',
    ],
  },
];

export default function Subscription() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async (planName: string) => {
    if (planName === 'Free') {
      router.push('/dashboard');
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          billingCycle,
        }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="relative bg-white rounded-lg p-0.5 flex">
              <button
                type="button"
                className={`relative py-2 px-6 text-sm font-medium rounded-md focus:outline-none ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`relative py-2 px-6 text-sm font-medium rounded-md focus:outline-none ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    className="mt-8 block w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {plan.name === 'Free' ? 'Current Plan' : 'Subscribe'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}