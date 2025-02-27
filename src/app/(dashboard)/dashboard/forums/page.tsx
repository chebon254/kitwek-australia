"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  MessageCircle,
  Search,
  ChevronRight,
  UserCircle,
} from "lucide-react";

interface Forum {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  admin: {
    name: string | null;
    profileImage: string | null;
  };
  _count: {
    comments: number;
  };
}

export default function Forums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'recent', 'popular'

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await fetch("/api/forums");
        if (!response.ok) throw new Error("Failed to fetch forums");
        const data = await response.json();
        setForums(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  const filteredForums = forums.filter((forum) => {
    const matchesSearch =
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(forum.createdAt) > oneWeekAgo;
    } else if (filter === "popular") {
      return matchesSearch && forum._count.comments > 5;
    }

    return matchesSearch;
  });

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
                Community Forums
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Join the discussion with other members
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search forums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Forums</option>
                  <option value="recent">Recent (Last 7 days)</option>
                  <option value="popular">Popular (5+ comments)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forums List */}
          <div className="mt-8 space-y-6">
            {filteredForums.map((forum) => (
              <Link
                key={forum.id}
                href={`/forums/${forum.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {forum.title}
                      </h2>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {forum.description}
                      </p>
                      <div className="mt-4 flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {forum._count.comments} comments
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(forum.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 flex items-center">
                    {forum.admin.profileImage ? (
                      <Image
                        src={forum.admin.profileImage}
                        alt={forum.admin.name || "Admin"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-6 w-6 text-gray-400" />
                    )}
                    <span className="ml-2 text-sm text-gray-500">
                      Posted by {forum.admin.name || "Admin"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredForums.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No forums found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for new discussions"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
