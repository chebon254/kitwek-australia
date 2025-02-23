"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";

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
}

interface AttendeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function EventDetails() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState<AttendeeForm[]>([
    { firstName: "", lastName: "", email: "", phone: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEvent(data);
        setAttendees(
          Array(1).fill({ firstName: "", lastName: "", email: "", phone: "" })
        );
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || (event && newQuantity > event.remainingSlots))
      return;
    setQuantity(newQuantity);
    setAttendees((prev) => {
      const newAttendees = [...prev];
      if (newQuantity > prev.length) {
        // Add new attendees
        for (let i = prev.length; i < newQuantity; i++) {
          newAttendees.push({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          });
        }
      } else {
        // Remove excess attendees
        newAttendees.splice(newQuantity);
      }
      return newAttendees;
    });
  };

  const handleAttendeeChange = (
    index: number,
    field: keyof AttendeeForm,
    value: string
  ) => {
    setAttendees((prev) => {
      const newAttendees = [...prev];
      newAttendees[index] = { ...newAttendees[index], [field]: value };
      return newAttendees;
    });
  };

  const validateForm = () => {
    for (const attendee of attendees) {
      if (
        !attendee.firstName.trim() ||
        !attendee.lastName.trim() ||
        !attendee.email.trim()
      ) {
        setError("Please fill in all required fields for each attendee");
        return false;
      }
      if (!attendee.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Please enter valid email addresses");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (!validateForm()) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${event.id}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          attendees,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to purchase tickets");
      }

      const data = await response.json();

      // If it's a paid event, redirect to Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        // For free events, redirect to tickets page
        router.push("/tickets");
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      setError(
        error instanceof Error ? error.message : "Failed to purchase tickets"
      );
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

  if (!event) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Event not found
              </h2>
              <button
                onClick={() => router.back()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative h-96">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                className="object-cover w-full h-full"
              />
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="prose max-w-none">
                    <p>{event.description}</p>
                  </div>

                  <div className="mt-6 space-y-4">
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
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Get Your Tickets
                  </h2>

                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Number of Tickets
                      </label>
                      <div className="mt-1 flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="px-3 py-2 border rounded-md hover:bg-gray-100"
                          disabled={quantity <= 1 || submitting}
                        >
                          -
                        </button>
                        <span className="text-lg font-medium">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="px-3 py-2 border rounded-md hover:bg-gray-100"
                          disabled={
                            quantity >= event.remainingSlots || submitting
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {attendees.map((attendee, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Attendee {index + 1}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              First Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={attendee.firstName}
                              onChange={(e) =>
                                handleAttendeeChange(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              disabled={submitting}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={attendee.lastName}
                              onChange={(e) =>
                                handleAttendeeChange(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              disabled={submitting}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={attendee.email}
                              onChange={(e) =>
                                handleAttendeeChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              disabled={submitting}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Phone (optional)
                            </label>
                            <input
                              type="tel"
                              value={attendee.phone}
                              onChange={(e) =>
                                handleAttendeeChange(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              disabled={submitting}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Price per ticket</span>
                        <span className="text-lg font-medium">
                          {event.isPaid ? `$${event.price}` : "Free"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>
                          {event.isPaid
                            ? `$${(event.price! * quantity).toFixed(2)}`
                            : "Free"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || event.remainingSlots === 0}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        "Get Tickets"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
