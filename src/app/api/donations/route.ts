import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { donors: true }
        },
        donors: {
          select: {
            amount: true
          }
        }
      }
    });

    // Transform the data to include the sum
    const transformedDonations = donations.map(donation => ({
      ...donation,
      _sum: {
        donors: {
          amount: donation.donors.reduce((sum, donor) => sum + donor.amount, 0)
        }
      }
    }));

    return NextResponse.json(transformedDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Error fetching donations' },
      { status: 500 }
    );
  }
}
