"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Member {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data);
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Community Members</h1>
            <p className="mt-2 text-sm text-gray-700">
              Connect with other members of our community.
            </p>
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={`/dashboard/members/${member.id}`}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={member.profileImage || 'https://via.placeholder.com/40'}
                    alt=""
                    height={40}
                    width={40}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
