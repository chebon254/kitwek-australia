"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  Heart,
  Calendar,
  ArrowLeft,
  TrendingUp,
  Loader2,
  Users,
} from "lucide-react";

interface Donation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  goal?: number;
  endDate?: string;
  createdAt: string;
  _count: {
    donors: number;
  };
  _sum: {
    donors: {
      amount: number;
    };
  };
}

interface DonorForm {
  name: string;
  email: string;
  amount: number;
  message?: string;
  anonymous: boolean;
}

export default function DonationDetail() {
  const params = useParams();
  const router = useRouter();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<DonorForm>({
    name: "",
    email: "",
    amount: 10,
    message: "",
    anonymous: false,
  });

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await fetch(`/api/donations/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch donation");
        const data = await response.json();
        setDonation(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load donation");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDonation();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount < 1) {
      setError("Minimum donation amount is $1");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "donation",
          donationId: donation?.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process donation");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process donation"
      );
      setSubmitting(false);
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

  if (!donation) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Donation not found
              </h2>
              <button
                onClick={() => router.back()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Donations
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalRaised = donation._sum.donors?.amount || 0;
  const percentageRaised = donation.goal
    ? (totalRaised / donation.goal) * 100
    : 0;

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Donations
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Details */}
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={donation.thumbnail}
                    alt={donation.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {donation.name}
                  </h1>
                  <p className="mt-4 text-gray-600 whitespace-pre-line">
                    {donation.description}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      {donation._count.donors} people have donated
                    </div>
                    {donation.endDate && (
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-5 w-5 mr-2" />
                        Campaign ends{" "}
                        {format(new Date(donation.endDate), "MMMM d, yyyy")}
                      </div>
                    )}
                  </div>

                  {donation.goal && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-indigo-600">
                          ${totalRaised.toLocaleString()} of $
                          {donation.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{
                              width: `${Math.min(percentageRaised, 100)}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 text-right">
                        {percentageRaised.toFixed(1)}% of goal raised
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Make a Donation
              </h2>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Donation Amount (USD)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      min="1"
                      step="1"
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseInt(e.target.value),
                        })
                      }
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) =>
                      setFormData({ ...formData, anonymous: e.target.checked })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="anonymous"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Make my donation anonymous
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    "Donate Now"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
