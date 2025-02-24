"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  MessageCircle,
  ArrowLeft,
  Award,
} from "lucide-react";

interface Member {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profileImage: string;
  location?: string;
  profession?: string;
  joinedDate: string;
  subscription: string;
  membershipStatus: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  interests?: string[];
  stats?: {
    posts: number;
    connections: number;
    events: number;
  };
}

export default function MemberDetail() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${params.id}`);
        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [params.id]);

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

  if (!member) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Member not found
              </h2>
              <p className="mt-2 text-gray-600">
                The member you&apos;re looking for doesn&apos;t exist.
              </p>
              <button
                onClick={() => router.back()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Members
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Members
          </button>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />

            {/* Profile Section */}
            <div className="relative px-6 py-8">
              <div className="flex items-end absolute -top-16 left-6">
                <div className="relative">
                  <Image
                    src={member.profileImage || "/ui-assets/avatar.webp"}
                    alt={`${member.firstName} ${member.lastName}`}
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  {member.membershipStatus === "ACTIVE" && (
                    <span className="absolute bottom-2 right-2 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white" />
                  )}
                </div>
              </div>

              <div className="mt-16">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h1>
                    <p className="text-gray-500">@{member.username}</p>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Message
                  </button>
                </div>

                {member.profession && (
                  <div className="mt-4 flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {member.profession}
                  </div>
                )}

                {member.location && (
                  <div className="mt-2 flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    {member.location}
                  </div>
                )}

                <div className="mt-2 flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  Joined {new Date(member.joinedDate).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-5 border-t border-b border-gray-200 py-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {member.stats?.posts || 0}
                  </span>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {member.stats?.connections || 0}
                  </span>
                  <p className="text-sm text-gray-500">Connections</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {member.stats?.events || 0}
                  </span>
                  <p className="text-sm text-gray-500">Events</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">About</h2>
                <p className="mt-2 text-gray-600">
                  {member.bio || "No bio available"}
                </p>
              </div>

              {/* Interests */}
              {member.interests && member.interests.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Interests
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Membership Status */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Membership
                </h2>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <Award
                      className={`h-5 w-5 ${
                        member.membershipStatus === "ACTIVE"
                          ? "text-green-500"
                          : "text-gray-400"
                      } mr-2`}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {member.membershipStatus === "ACTIVE"
                        ? "Active Member"
                        : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {member.subscription} Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
                <div className="mt-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                  >
                    <Mail className="h-'5 w-5 mr-2" />
                    {member.email}
                  </a>
                </div>
              </div>

              {/* Social Links */}
              {member.socialLinks &&
                Object.keys(member.socialLinks).length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Social Links
                    </h2>
                    <div className="mt-2 flex space-x-4">
                      {Object.entries(member.socialLinks).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">{platform}</span>
                            <div className="h-6 w-6 capitalize">{platform}</div>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
