"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, MapPin } from 'lucide-react';

interface Member {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
  location?: string;
  profession?: string;
  joinedDate: string;
  membershipStatus: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'new'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'active') {
      return matchesSearch && member.membershipStatus === 'ACTIVE';
    } else if (filter === 'new') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(member.joinedDate) > oneMonthAgo;
    }

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Community Members</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect and collaborate with {members.length} amazing members
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
                placeholder="Search by name, profession, or location..."
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
              <option value="all">All Members</option>
              <option value="active">Active Members</option>
              <option value="new">New Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Link
            key={member.id}
            href={`/dashboard/members/${member.id}`}
            className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:border-indigo-500 transition-colors duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={member.profileImage || '/ui-assets/avatar.webp'}
                  alt={`${member.firstName} ${member.lastName}`}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
                {member.membershipStatus === 'ACTIVE' && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                {member.profession && (
                  <p className="mt-1 text-sm text-indigo-600 truncate">{member.profession}</p>
                )}
              </div>
            </div>

            {member.location && (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {member.location}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500 line-clamp-2">
              {member.bio || 'No bio available'}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Joined {new Date(member.joinedDate).toLocaleDateString()}
              </span>
              <span className="text-indigo-600 group-hover:text-indigo-500">View Profile →</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="mt-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}