"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Member {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profileImage: string;
  subscription: string;
}

export default function MemberDetail() {
  const params = useParams();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      const response = await fetch(`/api/members/${params.id}`);
      const data = await response.json();
      setMember(data);
    };

    fetchMember();
  }, [params.id]);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full"
                  src={member.profileImage || 'https://via.placeholder.com/64'}
                  alt=""
                />
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">@{member.username}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{member.bio}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {member.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                  <dd className="mt-1 text-sm text-gray-900">{member.subscription}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
