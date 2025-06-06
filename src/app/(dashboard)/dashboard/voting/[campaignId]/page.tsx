"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Vote,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface VotingCandidate {
  id: string;
  name: string;
  description?: string;
  image?: string;
  position?: string;
  manifesto?: string;
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

export default function VotingCampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<VotingCampaign | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [campaignId, setCampaignId] = useState<string>("");

  useEffect(() => {
    const initAndFetch = async () => {
      const resolvedParams = await params;
      setCampaignId(resolvedParams.campaignId);

      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch(
          `/api/voting/campaigns/${resolvedParams.campaignId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaign(data);
        } else {
          setError("Campaign not found");
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setError("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    initAndFetch();
  }, [params]);

  const isVotingActive = () => {
    if (!campaign) return false;
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    return campaign.status === "ACTIVE" && now >= startDate && now <= endDate;
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/voting/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaignId,
          candidateId: selectedCandidate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/voting/${campaignId}/results`);
        }, 2000);
      } else {
        setError(data.error || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      setError("Failed to submit vote");
    } finally {
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

  if (success) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Vote className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vote Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for participating in the voting process. Your vote has
              been recorded.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to results page...
            </p>
          </div>
        </div>
      </main>
    );
  }

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
                <div className="h-64 w-full relative">
                  <Image
                    src={campaign.thumbnail}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

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
                    <span>{campaign._count.votes} total votes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isVotingActive() && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Voting Not Available
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    {campaign.status === "UPCOMING"
                      ? "Voting has not started yet."
                      : "Voting has ended for this campaign."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Candidates */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select Your Candidate
            </h2>

            {campaign.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  selectedCandidate === candidate.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!isVotingActive() ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  isVotingActive() && setSelectedCandidate(candidate.id)
                }
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
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
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.name}
                      </h3>
                      {selectedCandidate === candidate.id && (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {candidate.position && (
                      <p className="text-sm text-indigo-600 font-medium">
                        {candidate.position}
                      </p>
                    )}

                    {candidate.description && (
                      <p className="text-gray-600 mt-2">
                        {candidate.description}
                      </p>
                    )}

                    {candidate.manifesto && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Manifesto:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {candidate.manifesto}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vote Button */}
          {isVotingActive() && (
            <div className="mt-8 text-center">
              <button
                onClick={handleVote}
                disabled={!selectedCandidate || submitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting Vote..." : "Submit Vote"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
