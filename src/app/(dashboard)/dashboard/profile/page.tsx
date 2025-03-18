"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";

interface UserProfile {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  proffession?: string;
  phone?: string;
  profileImage?: string;
  subscription: string;
  membershipStatus: string;
  memberNumber?: string;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountAge, setAccountAge] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();

        // Calculate account age in days
        const createdAt = new Date(data.createdAt);
        const now = new Date();
        const ageInDays = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        setAccountAge(ageInDays);
        
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  if (!profile) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Error Loading Profile
              </h2>
              <p className="mt-4 text-gray-500">
                Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-indigo-600">
              <div className="absolute -bottom-12 left-8">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.username}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 px-8 pb-8">
              <div className="flex justify-between flex-wrap items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName && profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.username}
                  </h1>
                  <p className="text-gray-500">{profile.email}</p>
                  {profile.proffession && (
                    <p className="text-indigo-600 mt-1">
                      {profile.proffession}
                    </p>
                  )}
                  {profile.memberNumber && (
                    <p className="text-gray-700 mt-1 font-medium">
                      Member #: {profile.memberNumber}
                    </p>
                  )}
                </div>
                <Link
                  href="/dashboard/profile/edit-profile"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Membership & Subscription */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Membership Status
                    </h2>
                    <p className="text-gray-500">
                      {profile.membershipStatus === "ACTIVE"
                        ? "Active Member"
                        : "Inactive"}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Current Plan
                    </h2>
                    <p className="text-gray-500">Annual</p>
                  </div>
                </div>
                <div>
                  {profile.membershipStatus === "INACTIVE" &&
                    accountAge <= 365 && (
                      <Link
                        href="/dashboard/membership"
                        className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Activate Membership
                      </Link>
                    )}
                  {profile.subscription === "Free" &&
                    profile.membershipStatus === "ACTIVE" &&
                    accountAge <= 365 && (
                      <Link
                        href="/dashboard/subscription"
                        className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Manage Subscription
                      </Link>
                    )}
                  {profile.subscription === "Free" &&
                    profile.membershipStatus === "INACTIVE" &&
                    accountAge >= 365 && (
                      <Link
                        href="/dashboard/subscription"
                        className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Renew Subscription
                      </Link>
                    )}
                  {profile.subscription === "Premium" &&
                    profile.membershipStatus === "ACTIVE" &&
                    accountAge >= 365 && (
                      <Link
                        href="/dashboard/subscription"
                        className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Manage Subscription
                      </Link>
                    )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {profile.bio && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      About
                    </h2>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                    {profile.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{profile.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
