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
    name: "Free",
    yearlyPrice: 0,
    features: [
      "Basic member features",
      "Access to member directory",
      "Participate in forums",
      "View public events",
    ],
  },
  {
    name: "Premium",
    yearlyPrice: 30,
    features: [
      "All Free features",
      "Priority forum access",
      "Early event registration",
      "Exclusive content access",
      "Premium badge",
    ],
    highlight: true,
  },
  {
    name: "VIP",
    yearlyPrice: 50,
    features: [
      "All Premium features",
      "VIP support",
      "Event discounts",
      "Featured member listing",
      "Custom profile badge",
      "Exclusive VIP events",
    ],
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
  const [planToSwitch, setPlanToSwitch] = useState("");

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/membership");
      const data = await response.json();
      setCurrentPlan(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();

    // Handle success/cancel messages
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      // Show success message and refresh subscription data
      console.log("Subscription successful!");
      fetchSubscription();
    } else if (canceled === "true") {
      // Show canceled message
      console.log("Subscription canceled.");
    }
  }, [searchParams]);

  const handleSubscribe = async (planName: string) => {
    if (planName === currentPlan) {
      return;
    }

    // If user already has a subscription, show cancel confirmation
    if (currentPlan !== "Free" && currentPlan !== "") {
      setPlanToSwitch(planName);
      setShowCancelModal(true);
      return;
    }

    // Otherwise proceed with subscription
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
        // If we're switching plans, proceed with new subscription
        if (planToSwitch) {
          await proceedWithSubscription(planToSwitch);
        } else {
          // Otherwise just update the UI to show Free plan
          setCurrentPlan("Free");
        }
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
              Choose Your Plan
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg shadow-lg relative divide-y divide-gray-200 ${
                  plan.highlight
                    ? "border-2 border-indigo-500 relative"
                    : "border border-gray-200"
                }`}
              >
                {/* Current Plan Tag */}
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
                    {plan.yearlyPrice > 0 && (
                      <span className="text-gray-500">/year</span>
                    )}
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

                  {plan.name === "Free" ? (
                    // Free plan button - only show outline if it's the current plan
                    currentPlan === "Free" ? (
                      <div className="mt-8 w-full px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed text-center">
                        Current Plan
                      </div>
                    ) : null
                  ) : plan.name === currentPlan ? (
                    // Cancel subscription button for current paid plan
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
                    // Subscribe button for other plans
                    <button
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={processingPlan === plan.name}
                      className={`mt-8 w-full px-4 py-2 rounded-md text-sm font-medium ${
                        plan.highlight
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                      }`}
                    >
                      {processingPlan === plan.name
                        ? "Processing..."
                        : "Subscribe"}
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
            <h3 className="text-xl font-bold mb-4">Cancel Current Subscription</h3>
            <p className="mb-6">
              {planToSwitch 
                ? `Are you sure you want to switch from ${currentPlan} to ${planToSwitch}? You will not receive a refund for the current billing period.` 
                : `Are you sure you want to cancel your ${currentPlan} subscription? You will not receive a refund for the current billing period.`}
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
    </main>
  );
}