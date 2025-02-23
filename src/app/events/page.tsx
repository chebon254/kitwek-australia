"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  location: string;
  capacity: number;
  remainingSlots: number;
  isPaid: boolean;
  price?: number;
  status: string;
  _count: {
    tickets: number;
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Upcoming Events
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Join our community events and activities
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {event.status !== "UPCOMING" && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {event.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-5 w-5 mr-2" />
                      {new Date(event.date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-5 w-5 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      {event.remainingSlots} slots remaining
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      {event.isPaid ? (
                        <span className="text-2xl font-bold text-gray-900">
                          ${event.price}
                        </span>
                      ) : (
                        <span className="text-lg font-medium text-green-600">
                          Free
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-indigo-600 group-hover:text-indigo-500">
                      View Details
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No events
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for upcoming events.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
