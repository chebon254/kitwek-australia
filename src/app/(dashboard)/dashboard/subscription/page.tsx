"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SubscriptionPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlight?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
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
    monthlyPrice: 2.5,
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
    monthlyPrice: 4,
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
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [processingPlan, setProcessingPlan] = useState("");

  useEffect(() => {
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

    fetchSubscription();

    // Handle success/cancel messages
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      // Show success message
      console.log("Subscription successful!");
    } else if (canceled === "true") {
      // Show canceled message
      console.log("Subscription canceled.");
    }
  }, [searchParams]);

  const handleSubscribe = async (planName: string) => {
    if (planName === currentPlan) {
      return;
    }

    setProcessingPlan(planName);
    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscription",
          planName,
          billingCycle: yearlyBilling ? "annual" : "monthly",
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

            {/* Billing Toggle */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span
                className={`text-sm ${
                  !yearlyBilling ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setYearlyBilling(!yearlyBilling)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  yearlyBilling ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    yearlyBilling ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  yearlyBilling ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Yearly <span className="text-green-500">(Save up to 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                  plan.highlight
                    ? "border-2 border-indigo-500 relative"
                    : "border border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h2>
                  <p className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-500">
                        /{yearlyBilling ? "year" : "month"}
                      </span>
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

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={
                      plan.name === currentPlan || processingPlan === plan.name
                    }
                    className={`mt-8 w-full px-4 py-2 rounded-md text-sm font-medium ${
                      plan.name === currentPlan
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : plan.highlight
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    {processingPlan === plan.name
                      ? "Processing..."
                      : plan.name === currentPlan
                      ? "Current Plan"
                      : "Subscribe"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
