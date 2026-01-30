import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";

export const revalidate = 180; // Revalidate every 3 minutes

interface Event {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: Date;
  location: string;
  capacity: number;
  remainingSlots: number;
  isPaid: boolean;
  price: number | null;
  status: string;
  visibility: string;
  _count: {
    tickets: number;
  };
}

async function getEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: { status: "UPCOMING" },
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function Events() {
  const events = await getEvents();

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <EventsClient events={events} />
      </div>
    </main>
  );
}
