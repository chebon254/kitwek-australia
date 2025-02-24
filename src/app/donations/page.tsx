"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, Calendar, Search } from "lucide-react";

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

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/donations");
        if (!response.ok) throw new Error("Failed to fetch donations");
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(
    (donation) =>
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Support Our Causes
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Make a difference by contributing to our community initiatives
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8">
            <div className="max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Donations Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.map((donation) => {
              const totalRaised = donation._sum.donors?.amount || 0;
              const percentageRaised = donation.goal
                ? (totalRaised / donation.goal) * 100
                : 0;

              return (
                <Link
                  key={donation.id}
                  href={`/donations/${donation.id}`}
                  className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="relative h-48">
                    <Image
                      src={donation.thumbnail}
                      alt={donation.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                      {donation.name}
                    </h2>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {donation.description}
                    </p>

                    {donation.goal && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-indigo-600">
                            ${totalRaised.toLocaleString()} of $
                            {donation.goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 relative">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{
                                width: `${Math.min(percentageRaised, 100)}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {donation._count.donors} donors
                      </div>
                      {donation.endDate && (
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(donation.endDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No donations found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new donation opportunities"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
