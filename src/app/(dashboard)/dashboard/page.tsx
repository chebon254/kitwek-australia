"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCircle,
  CreditCard,
  Calendar,
  MessageSquare,
  Settings,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface DashboardData {
  user: {
    username: string;
    email: string;
    membershipStatus: string;
    subscription: string;
    profileImage?: string;
    createdAt: string;
  };
  stats: {
    totalMembers: number;
    upcomingEvents: number;
    unreadMessages: number;
    donations: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountAge, setAccountAge] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user");
        const userData = await userResponse.json();

        // Calculate account age in days
        const createdAt = new Date(userData.createdAt);
        const now = new Date();
        const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        setAccountAge(ageInDays);

        // For demo purposes, using static stats
        // In production, these would come from their respective API endpoints
        const statsData = {
          totalMembers: 256,
          upcomingEvents: 3,
          unreadMessages: 5,
          donations: 1250,
        };

        setData({
          user: userData,
          stats: statsData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (!data) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Error loading dashboard data</p>
          </div>
        </div>
      </main>
    );
  }

  const getSubscriptionButtonText = () => {
    if (data.user.subscription === "Free") {
      return accountAge >= 365 ? "Renew Subscription" : "Manage Subscription";
    }
    return null;
  };

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
              <div className="flex items-center">
                {data.user.profileImage ? (
                  <Image
                    src={data.user.profileImage}
                    alt={data.user.username}
                    className="h-20 w-20 rounded-full border-4 border-white"
                    height={80}
                    width={80}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                    <UserCircle className="h-12 w-12 text-white" />
                  </div>
                )}
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {data.user.username}!
                  </h1>
                  <p className="text-indigo-100 mt-2">
                    {data.user.membershipStatus === "ACTIVE"
                      ? "Active Member"
                      : "Complete your membership to unlock all features"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-8 py-6 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                >
                  <Settings className="h-6 w-6 text-gray-500" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Edit Profile
                  </span>
                </Link>
                <Link
                  href="/dashboard/subscription"
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                >
                  <CreditCard className="h-6 w-6 text-gray-500" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Manage Membership
                  </span>
                </Link>
                <Link
                  href="/events"
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-gray-500" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    View Events
                  </span>
                </Link>
                <Link
                  href="/dashboard/forums"
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                >
                  <MessageSquare className="h-6 w-6 text-gray-500" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Forums
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Membership Status */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Membership Status
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Plan
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Annual
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p
                    className={`mt-1 text-lg font-semibold ${
                      data.user.membershipStatus === "ACTIVE"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {data.user.membershipStatus}
                  </p>
                </div>
                <div>
                  {data.user.membershipStatus === "INACTIVE" && accountAge <= 365 && (
                    <Link
                      href="/dashboard/membership"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Activate Membership
                    </Link>
                  )}
                  {data.user.subscription === "Free" &&
                    data.user.membershipStatus === "ACTIVE" && accountAge <= 365 &&(
                      <Link
                        href="/dashboard/subscription"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Manage Subscription
                      </Link>
                    )}
                  {data.user.subscription === "Free" &&
                    data.user.membershipStatus === "INACTIVE" && accountAge >= 365 &&(
                      <Link
                        href="/dashboard/subscription"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Renew Subscription
                      </Link>
                    )}
                  {data.user.subscription === "Premium" &&
                    data.user.membershipStatus === "ACTIVE" && accountAge >= 365 &&(
                      <Link
                        href="/dashboard/subscription"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Manage Subscription
                      </Link>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}