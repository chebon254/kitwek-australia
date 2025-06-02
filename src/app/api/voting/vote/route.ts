import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = (await cookies()).get("session");
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const { campaignId, candidateId } = await request.json();

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is an active member
    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Only active members can vote" },
        { status: 403 }
      );
    }

    // Check if campaign exists and is active
    const campaign = await prisma.votingCampaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (campaign.status !== "ACTIVE" || now < campaign.startDate || now > campaign.endDate) {
      return NextResponse.json(
        { error: "Voting is not currently active for this campaign" },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_campaignId: {
          userId: user.id,
          campaignId: campaignId
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this campaign" },
        { status: 400 }
      );
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        campaignId: campaignId,
        candidateId: candidateId
      }
    });

    return NextResponse.json({ success: true, vote });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}