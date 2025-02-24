import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await params)?.id) {
    return NextResponse.json({ error: 'Donation ID is required' }, { status: 400 });
  }

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: (await params).id },
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

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Transform the data to include the sum
    const transformedDonation = {
      ...donation,
      _sum: {
        donors: {
          amount: donation.donors.reduce((sum, donor) => sum + donor.amount, 0)
        }
      }
    };

    return NextResponse.json(transformedDonation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    return NextResponse.json(
      { error: 'Error fetching donation' },
      { status: 500 }
    );
  }
}
