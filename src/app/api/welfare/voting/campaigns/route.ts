import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
        error: 'Only active welfare members can participate in welfare voting',
      }, { status: 403 });
    }

    // Get all campaigns with vote counts and user's vote status
    const campaigns = await prisma.welfareVotingCampaign.findMany({
      include: {
        candidates: {
          include: {
            votes: true, // Include votes for counting
          },
        },
        votes: {
          where: {
            userId: user.id,
          },
          select: {
            candidateId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to include vote counts and user vote status
    const transformedCampaigns = campaigns.map(campaign => {
      const totalVotes = campaign.candidates.reduce(
        (sum, candidate) => sum + candidate.votes.length,
        0
      );

      const hasUserVoted = campaign.votes.length > 0;
      const userVotedFor = hasUserVoted ? campaign.votes[0].candidateId : null;

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        type: campaign.type,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status,
        createdAt: campaign.createdAt,
        totalVotes,
        hasUserVoted,
        userVotedFor,
        candidates: campaign.candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          description: candidate.description,
          imageUrl: candidate.imageUrl,
          voteCount: candidate.votes.length,
        })),
      };
    });

    return NextResponse.json(transformedCampaigns);
  } catch (error) {
    console.error('[WELFARE_VOTING_CAMPAIGNS]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
