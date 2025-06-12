"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SubscriptionPlan {
  name: string;
  yearlyPrice: number;
  features: string[];
  highlight?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    name: "Premium",
    yearlyPrice: 30,
    features: [
      "Access to member directory",
      "Participate in forums",
      "Access to events and activities",
    ],
    highlight: true,
  },
];

export default function Subui() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Subscription />
    </Suspense>
  );
}

function Subscription() {
  const searchParams = useSearchParams();
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [accountAge, setAccountAge] = useState(0); // in days
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const fetchSubscription = async () => {
    try {
      const [membershipResponse, userResponse] = await Promise.all([
        fetch("/api/user/membership"),
        fetch("/api/user"),
      ]);

      const membershipData = await membershipResponse.json();
      const userData = await userResponse.json();

      setCurrentPlan(membershipData.subscription);

      // Calculate account age in days
      const createdAt = new Date(userData.createdAt);
      const now = new Date();
      const ageInDays = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      setAccountAge(ageInDays);

      // Show renewal modal if:
      // 1. Account is at least 1 year old
      // 2. User is not currently on Premium plan
      // 3. User's current plan is Free (meaning they either never subscribed or cancelled)
      if (ageInDays >= 365 && membershipData.subscription === "Free") {
        setShowRenewalModal(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();

    const success = searchParams.get("success");

    if (success === "true") {
      fetchSubscription();
    }
  }, [searchParams]);

  const handleSubscribe = async (planName: string) => {
    if (accountAge < 365) {
      alert(
        "Your account must be at least 1 year old to subscribe to Premium. Please try again after your account reaches 1 year."
      );
      return;
    }

    if (planName === currentPlan) {
      return;
    }

    if (currentPlan !== "Free" && currentPlan !== "") {
      setShowCancelModal(true);
      return;
    }

    proceedWithSubscription(planName);
  };

  const proceedWithSubscription = async (planName: string) => {
    setProcessingPlan(planName);
    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscription",
          planName,
          billingCycle: "annual", // Only annual billing now
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    } finally {
      setProcessingPlan("");
    }
  };

  const handleCancelSubscription = async () => {
    setProcessingPlan(currentPlan);
    try {
      const response = await fetch("/api/user/cancel-subscription", {
        method: "POST",
      });

      if (response.ok) {
        // Update UI to show Free plan
        setCurrentPlan("Free");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setProcessingPlan("");
      setShowCancelModal(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Pay $30 to Become a Member
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Take control of your subscription
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-lg shadow-lg relative divide-y divide-gray-200 border-2 border-indigo-500"
              >
                {plan.name === currentPlan && (
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h2>
                  <p className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.yearlyPrice}
                    </span>
                    <span className="text-gray-500">/year</span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {currentPlan !== "Free" ? (
                    // User has an active subscription - show cancel button
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={processingPlan === currentPlan}
                      className="mt-8 w-full px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    >
                      {processingPlan === currentPlan
                        ? "Processing..."
                        : "Cancel Subscription"}
                    </button>
                  ) : (
                    // User is on Free plan - show subscribe button
                    <button
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={
                        processingPlan === plan.name || accountAge < 365
                      }
                      className={`mt-8 w-full px-4 py-2 rounded-md text-sm font-medium ${
                        accountAge < 365
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white`}
                    >
                      {processingPlan === plan.name
                        ? "Processing..."
                        : accountAge < 365
                        ? "Available after 1 year"
                        : "Subscribe Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Cancel Current Subscription
            </h3>
            <p className="mb-6">
              Are you sure you want to cancel your {currentPlan} subscription?
              You will not receive a refund for the current billing period.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {processingPlan ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Time to Renew!</h3>
            <p className="mb-6">
              Your account is now one year old! You can now renew your
              subscription.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRenewalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowRenewalModal(false);
                  handleSubscribe("Membership");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Renew Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
