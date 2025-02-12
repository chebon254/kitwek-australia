'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
} from 'lucide-react';

export default function MemberDetailPage() {
  const params = useParams();
  const [member, setMember] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/members/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setMember(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching member:', error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!member) return <div>Member not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.profileImage || "/ui-assets/avatar.webp"} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
                {member.profession && (
                  <p className="text-gray-500">{member.profession}</p>
                )}
              </div>
            </div>

            {member.bio && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">About</h2>
                <p className="mt-2 text-gray-600">{member.bio}</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
              <div className="mt-2 flex space-x-4">
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {member.youtube && (
                  <a
                    href={member.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-700"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}