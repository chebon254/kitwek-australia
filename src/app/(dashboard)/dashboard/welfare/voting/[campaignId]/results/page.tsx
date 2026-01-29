"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Vote,
  User,
  Calendar,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface WelfareVotingCandidate {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  voteCount: number;
}

interface WelfareVotingCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  totalVotes: number;
  hasUserVoted: boolean;
  userVotedFor: string | null;
  candidates: WelfareVotingCandidate[];
}

export default function WelfareVotingResultsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<WelfareVotingCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    const initAndFetch = async () => {
      const resolvedParams = await params;

      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch("/api/welfare/voting/campaigns");

        if (response.status === 403) {
          setIsEligible(false);
          setError("Only active welfare members with PAID status can view welfare voting results");
          setLoading(false);
          return;
        }

        if (response.ok) {
          const campaigns = await response.json();
          const foundCampaign = campaigns.find(
            (c: WelfareVotingCampaign) => c.id === resolvedParams.campaignId
          );

          if (foundCampaign) {
            // Sort candidates by vote count
            const sortedCandidates = [...foundCampaign.candidates].sort(
              (a, b) => b.voteCount - a.voteCount
            );
            setCampaign({ ...foundCampaign, candidates: sortedCandidates });
          } else {
            setError("Campaign not found");
          }
        } else {
          setError("Failed to load campaign");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setError("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    initAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const getVotePercentage = (votes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
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

  if (!isEligible) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">
                    Not Eligible to View Results
                  </h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
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
              The welfare voting campaign you&apos;re looking for doesn&apos;t exist.
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

  const winner = campaign.candidates[0];
  const isCompleted = campaign.status === "COMPLETED";
  const totalVotes = campaign.totalVotes;

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
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>

                <p className="text-gray-600 mb-6">{campaign.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
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
                    <span>{totalVotes} total votes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winner Announcement (if completed) */}
          {isCompleted && totalVotes > 0 && winner && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 mr-2" />
                <h2 className="text-2xl font-bold">
                  {campaign.type === "ELECTION"
                    ? "Election Winner"
                    : campaign.type === "DECISION"
                    ? "Winning Option"
                    : "Top Choice"}
                </h2>
              </div>
              <div className="text-center">
                {winner.imageUrl && (
                  <div className="relative h-20 w-20 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src={winner.imageUrl}
                      alt={winner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-3xl font-bold mb-2">{winner.name}</h3>
                <p className="text-lg">
                  {winner.voteCount} votes ({getVotePercentage(winner.voteCount, totalVotes)}%)
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">
              {isCompleted ? "Final Results" : "Current Results"}
            </h3>

            <div className="space-y-4">
              {campaign.candidates.map((candidate, index) => {
                const voteCount = candidate.voteCount;
                const percentage = getVotePercentage(voteCount, totalVotes);
                const isWinner = isCompleted && index === 0 && voteCount > 0;
                const isUserVote = campaign.userVotedFor === candidate.id;

                return (
                  <div
                    key={candidate.id}
                    className={`border rounded-lg p-4 ${
                      isWinner
                        ? "border-yellow-400 bg-yellow-50"
                        : isUserVote
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {candidate.imageUrl && (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold">{candidate.name}</h4>
                            {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                            {index === 0 && !isCompleted && totalVotes > 0 && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Leading
                              </span>
                            )}
                            {isUserVote && (
                              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                Your Vote
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {voteCount} votes
                            </div>
                            {totalVotes > 0 && (
                              <div className="text-sm text-gray-600">{percentage}%</div>
                            )}
                          </div>
                        </div>

                        {candidate.description && (
                          <p className="text-gray-700 mb-2">{candidate.description}</p>
                        )}

                        {/* Vote Progress Bar */}
                        {totalVotes > 0 && (
                          <div className="mt-3">
                            <div className="bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-300 ${
                                  isWinner ? "bg-yellow-400" : "bg-blue-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalVotes === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Vote className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No votes have been cast yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
