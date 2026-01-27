"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Vote, CheckCircle } from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";
import { useRouter } from "next/navigation";

interface VotingCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  thumbnail?: string;
  candidates: Array<{
    id: string;
    name: string;
    _count: { votes: number };
  }>;
  _count: { votes: number };
}

interface UserVote {
  campaignId: string;
  candidateId: string;
}

export default function VotingPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<VotingCampaign[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;
      try {
        const [campaignsRes, votesRes] = await Promise.all([
          fetch("/api/voting/campaigns"),
          fetch("/api/voting/user-votes"),
        ]);

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setCampaigns(campaignsData);
        }

        if (votesRes.ok) {
          const votesData = await votesRes.json();
          setUserVotes(votesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load voting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "UPCOMING":
        return "text-blue-600 bg-blue-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const hasUserVoted = (campaignId: string) => {
    return userVotes.some((vote) => vote.campaignId === campaignId);
  };

  const isVotingActive = (campaign: VotingCampaign) => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    return campaign.status === "ACTIVE" && now >= startDate && now <= endDate;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Voting Campaigns
            </h1>
            <p className="text-gray-600">
              Participate in community decisions and elections. Your voice
              matters!
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Campaigns Grid */}
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Voting Campaigns
              </h3>
              <p className="text-gray-500">
                There are no active voting campaigns at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {campaign.thumbnail && (
                    <div className="h-48 w-full relative">
                      <Image
                        src={campaign.thumbnail}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {campaign.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {campaign.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{campaign.candidates.length} candidates</span>
                      </div>
                      <div className="flex items-center">
                        <Vote className="h-4 w-4 mr-2" />
                        <span>{campaign._count.votes} total votes</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {hasUserVoted(campaign.id) ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">Voted</span>
                        </div>
                      ) : isVotingActive(campaign) ? (
                        <Link
                          href={`/dashboard/voting/${campaign.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Vote Now
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {campaign.status === "UPCOMING"
                            ? "Not Started"
                            : "Voting Closed"}
                        </span>
                      )}

                      <Link
                        href={`/dashboard/voting/${campaign.id}/results`}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                      >
                        View Results
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
