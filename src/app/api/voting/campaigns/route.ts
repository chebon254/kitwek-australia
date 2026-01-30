import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 120; // Revalidate every 2 minutes

export async function GET() {
  try {
    const campaigns = await prisma.votingCampaign.findMany({
      include: {
        candidates: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}