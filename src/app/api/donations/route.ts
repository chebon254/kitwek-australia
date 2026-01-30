import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { donors: true }
        }
      }
    });

    // Fetch sum for each donation using aggregation
    const donationsWithSum = await Promise.all(
      donations.map(async (donation) => {
        const sum = await prisma.donor.aggregate({
          where: { donationId: donation.id },
          _sum: { amount: true }
        });

        return {
          ...donation,
          _sum: {
            donors: {
              amount: sum._sum.amount || 0
            }
          }
        };
      })
    );

    return NextResponse.json(donationsWithSum);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Error fetching donations' },
      { status: 500 }
    );
  }
}
