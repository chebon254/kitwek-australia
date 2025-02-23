"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react';

interface Ticket {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  purchaseDate: string;
  event: {
    id: string;
    title: string;
    thumbnail: string;
    date: string;
    location: string;
  };
  attendees: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }>;
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (searchEmail?: string) => {
    try {
      const url = searchEmail ? `/api/tickets?email=${searchEmail}` : '/api/tickets';
      const response = await fetch(url);
      
      if (response.status === 401) {
        setIsLoggedIn(false);
        return;
      }

      const data = await response.json();
      setTickets(data);
      setError('');
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    fetchTickets(email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="mt-2 text-lg text-gray-500">
            View and manage your event tickets
          </p>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="mb-8">
          <form onSubmit={handleEmailSearch} className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Find tickets by email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="relative w-full md:w-64 h-48 md:h-auto">
                <Image
                  src={ticket.event.thumbnail}
                  alt={ticket.event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {ticket.event.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'USED'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(ticket.event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-5 w-5 mr-2" />
                      {new Date(ticket.event.date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-5 w-5 mr-2" />
                      {ticket.event.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Attendees:</h3>
                    <ul className="space-y-1">
                      {ticket.attendees.map((attendee, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {attendee.firstName} {attendee.lastName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/events/${ticket.event.id}`}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isLoggedIn
                ? "You haven't purchased any tickets yet."
                : 'No tickets found for this email address.'}
            </p>
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}