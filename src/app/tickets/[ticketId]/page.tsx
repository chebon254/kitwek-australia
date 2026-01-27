"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Loader2, Ticket as TicketIcon, Download, AlertCircle } from "lucide-react";

interface TicketData {
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

export default function PublicTicketView() {
  const params = useParams();
  const ticketId = params.ticketId as string;
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Ticket not found");
        } else {
          setError("Failed to load ticket");
        }
        return;
      }

      const data = await response.json();
      setTicket(data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
              <p className="text-gray-600 mb-6">
                The ticket you're looking for could not be found or is no longer valid.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24 print:mt-0">
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 print:hidden">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Event Ticket</h1>
                <p className="mt-2 text-lg text-gray-500">
                  Present this ticket at the event entrance
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Download className="h-4 w-4" />
                Print Ticket
              </button>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-200">
            {/* Event Banner */}
            <div className="relative w-full h-64">
              <Image
                src={ticket.event.thumbnail}
                alt={ticket.event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold">{ticket.event.title}</h2>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    ticket.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : ticket.status === "USED"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <TicketIcon className="h-4 w-4 mr-2" />
                  {ticket.status}
                </span>
              </div>

              {/* Event Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
                      <span>{new Date(ticket.event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-900">
                      <Clock className="h-5 w-5 mr-3 text-indigo-600" />
                      <span>{new Date(ticket.event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                    <div className="flex items-start text-gray-900">
                      <MapPin className="h-5 w-5 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{ticket.event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-900">
                      <Users className="h-5 w-5 mr-3 text-indigo-600" />
                      <span>{ticket.quantity} {ticket.quantity === 1 ? 'Ticket' : 'Tickets'}</span>
                    </div>
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Attendee{ticket.attendees.length > 1 ? 's' : ''}</h3>
                  <div className="space-y-3">
                    {ticket.attendees.map((attendee, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900">
                          {attendee.firstName} {attendee.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{attendee.email}</div>
                        {attendee.phone && (
                          <div className="text-sm text-gray-600">{attendee.phone}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="border-t border-gray-200 pt-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Ticket QR Code</h3>
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.id}`}
                      alt="Ticket QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Ticket ID: <span className="font-mono font-medium">{ticket.id}</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 print:bg-white print:border-0">
                <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Present this ticket (printed or on your mobile device) at the event entrance</li>
                  <li>Arrive early to allow time for check-in</li>
                  <li>The QR code will be scanned for verification</li>
                  <li>Keep this ticket safe and do not share the QR code</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center print:hidden">
            <Link
              href="/events"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Browse More Events
            </Link>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
