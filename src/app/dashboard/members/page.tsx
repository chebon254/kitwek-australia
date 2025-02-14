"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface MemberUser extends User {
  membershipStatus: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Members Directory
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={`/dashboard/members/${member.id}`}>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={member.profileImage || undefined}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {member.profession || "Member"}
                      </p>
                    </div>
                  </div>
                  {member.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
