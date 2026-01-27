import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { campaignId } = await params;
    const { candidateId } = await request.json();

    if (!candidateId) {
      return NextResponse.json({
        error: 'Candidate ID is required',
      }, { status: 400 });
    }

    // Check if user is active welfare member
    const welfareRegistration = await prisma.welfareRegistration.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        paymentStatus: 'PAID',
      },
    });

    if (!welfareRegistration) {
      return NextResponse.json({
        error: 'Only active welfare members can vote',
      }, { status: 403 });
    }

    // Check if campaign exists and is active
    const campaign = await prisma.welfareVotingCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({
        error: 'Campaign not found',
      }, { status: 404 });
    }

    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json({
        error: `Voting is not available. Campaign status: ${campaign.status}`,
      }, { status: 400 });
    }

    // Check if campaign is within date range
    const now = new Date();
    if (now < campaign.startDate || now > campaign.endDate) {
      return NextResponse.json({
        error: 'Voting period has ended or not yet started',
      }, { status: 400 });
    }

    // Check if candidate exists and belongs to this campaign
    const candidate = await prisma.welfareVotingCandidate.findFirst({
      where: {
        id: candidateId,
        campaignId,
      },
    });

    if (!candidate) {
      return NextResponse.json({
        error: 'Invalid candidate for this campaign',
      }, { status: 400 });
    }

    // Check if user has already voted
    const existingVote = await prisma.welfareVote.findUnique({
      where: {
        userId_campaignId: {
          userId: user.id,
          campaignId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json({
        error: 'You have already voted in this campaign',
      }, { status: 400 });
    }

    // Create the vote
    const vote = await prisma.welfareVote.create({
      data: {
        userId: user.id,
        campaignId,
        candidateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      vote: {
        id: vote.id,
        campaignId: vote.campaignId,
        candidateId: vote.candidateId,
        createdAt: vote.createdAt,
      },
    });
  } catch (error) {
    console.error('[WELFARE_VOTE]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
