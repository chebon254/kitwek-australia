import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, Vote, CheckCircle, Clock } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  thumbnail?: string;
  candidates: Array<{ id: string; name: string; _count: { votes: number } }>;
  _count: { votes: number };
}

interface CampaignCardProps {
  campaign: Campaign;
  hasUserVoted: boolean;
}

export default function CampaignCard({
  campaign,
  hasUserVoted,
}: CampaignCardProps) {
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

  const isVotingActive = () => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    return campaign.status === "ACTIVE" && now >= startDate && now <= endDate;
  };

  const timeUntilStart = () => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const diff = startDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Starts in ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? "s" : ""}`;
    return "Starting soon";
  };

  const timeUntilEnd = () => {
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Ending soon";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Timing Information */}
        {campaign.status === "UPCOMING" && timeUntilStart() && (
          <div className="flex items-center text-blue-600 text-sm mb-3">
            <Clock className="h-4 w-4 mr-2" />
            <span>{timeUntilStart()}</span>
          </div>
        )}

        {campaign.status === "ACTIVE" && isVotingActive() && timeUntilEnd() && (
          <div className="flex items-center text-orange-600 text-sm mb-3">
            <Clock className="h-4 w-4 mr-2" />
            <span>{timeUntilEnd()}</span>
          </div>
        )}

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
          {hasUserVoted ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Voted</span>
            </div>
          ) : isVotingActive() ? (
            <Link
              href={`/voting/${campaign.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <Vote className="h-4 w-4 mr-2" />
              Vote Now
            </Link>
          ) : (
            <span className="text-gray-400 text-sm">
              {campaign.status === "UPCOMING" ? "Not Started" : "Voting Closed"}
            </span>
          )}

          <Link
            href={`/voting/${campaign.id}/results`}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
          >
            View Results
          </Link>
        </div>
      </div>
    </div>
  );
}
