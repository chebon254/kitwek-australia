"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Trophy, User, Vote, Calendar, Share2 } from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";
import { Toast } from "@/components/ui/toast";

interface VotingCandidate {
  id: string;
  name: string;
  description?: string;
  image?: string;
  position?: string;
  _count: { votes: number };
}

interface VotingCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  thumbnail?: string;
  candidates: VotingCandidate[];
  _count: { votes: number };
}

export default function VotingResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<VotingCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;
      try {
        const response = await fetch(
          `/api/voting/campaigns/${params.campaignId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaign(data);
        } else {
          setError("Campaign not found");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setError("Failed to load campaign results");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.campaignId]);

  const getSortedCandidates = () => {
    if (!campaign) return [];
    return [...campaign.candidates].sort(
      (a, b) => b._count.votes - a._count.votes
    );
  };

  const getVotePercentage = (votes: number) => {
    if (!campaign || campaign._count.votes === 0) return "0";
    return ((votes / campaign._count.votes) * 100).toFixed(1);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${campaign?.title} - Voting Results`,
          text: `Check out the results for ${campaign?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
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

  if (!campaign) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Campaign Not Found
            </h2>
            <p className="mt-4 text-gray-500">
              The voting campaign you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  const sortedCandidates = getSortedCandidates();
  const winner = sortedCandidates[0];

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {campaign.title} - Results
                  </h1>
                  <button
                    onClick={shareResults}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{campaign.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{campaign.candidates.length} candidates</span>
                  </div>
                  <div className="flex items-center">
                    <Vote className="h-4 w-4 mr-2" />
                    <span>{campaign._count.votes} total votes</span>
                  </div>
                </div>

                {campaign.status === "COMPLETED" &&
                  winner &&
                  campaign._count.votes > 0 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg mb-6">
                      <div className="flex items-center">
                        <Trophy className="h-6 w-6 mr-3" />
                        <div>
                          <h3 className="font-semibold">Winner</h3>
                          <p className="text-yellow-100">
                            {winner.name} with {winner._count.votes} votes (
                            {getVotePercentage(winner._count.votes)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Voting Results
            </h2>

            {campaign._count.votes === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Votes Yet
                </h3>
                <p className="text-gray-500">
                  Be the first to vote in this campaign!
                </p>
              </div>
            ) : (
              sortedCandidates.map((candidate, index) => {
                const percentage = parseFloat(
                  getVotePercentage(candidate._count.votes)
                );
                const isWinner = index === 0 && campaign.status === "COMPLETED";

                return (
                  <div
                    key={candidate.id}
                    className={`bg-white rounded-lg border p-6 ${
                      isWinner
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 relative">
                        {candidate.image ? (
                          <Image
                            src={candidate.image}
                            alt={candidate.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        {isWinner && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                            <Trophy className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full px-2 py-1 text-xs font-medium">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              {candidate.name}
                              {isWinner && (
                                <Trophy className="h-5 w-5 text-yellow-500 ml-2" />
                              )}
                            </h3>
                            {candidate.position && (
                              <p className="text-sm text-indigo-600 font-medium">
                                {candidate.position}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {candidate._count.votes}
                            </div>
                            <div className="text-sm text-gray-500">
                              {percentage}%
                            </div>
                          </div>
                        </div>

                        {candidate.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {candidate.description}
                          </p>
                        )}

                        {/* Vote Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isWinner
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Campaign Status Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Campaign Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "COMPLETED"
                      ? "bg-gray-100 text-gray-800"
                      : campaign.status === "UPCOMING"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600 capitalize">
                  {campaign.type}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(campaign.startDate).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">End Date:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(campaign.endDate).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <Toast
          message="Link copied to clipboard!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}
