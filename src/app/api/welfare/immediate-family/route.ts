import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

// Type definition for immediate family data
interface ImmediateFamilyData {
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  idNumber?: string;
}

// GET - Fetch user's immediate family members
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

    // Fetch all immediate family members for this user
    const familyMembers = await prisma.immediateFamily.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      familyMembers: familyMembers.map(member => ({
        id: member.id,
        fullName: member.fullName,
        relationship: member.relationship,
        phone: member.phone,
        email: member.email,
        idNumber: member.idNumber,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
      count: familyMembers.length
    });
  } catch (error) {
    console.error('Error fetching immediate family:', error);
    return NextResponse.json(
      { error: 'Error fetching immediate family members' },
      { status: 500 }
    );
  }
}

// POST - Add new immediate family member
export async function POST(request: Request) {
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

    const data: ImmediateFamilyData = await request.json();
    const { fullName, relationship, phone, email, idNumber } = data;

    // Validate required fields
    if (!fullName || !relationship || !phone) {
      return NextResponse.json({
        error: 'Full name, relationship, and phone are required'
      }, { status: 400 });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({
          error: 'Invalid email format'
        }, { status: 400 });
      }
    }

    // Create the immediate family member
    const familyMember = await prisma.immediateFamily.create({
      data: {
        userId: user.id,
        fullName,
        relationship,
        phone,
        email: email || null,
        idNumber: idNumber || null,
      }
    });

    return NextResponse.json({
      success: true,
      familyMember: {
        id: familyMember.id,
        fullName: familyMember.fullName,
        relationship: familyMember.relationship,
        phone: familyMember.phone,
        email: familyMember.email,
        idNumber: familyMember.idNumber,
        createdAt: familyMember.createdAt,
        updatedAt: familyMember.updatedAt,
      },
      message: 'Family member added successfully'
    });
  } catch (error) {
    console.error('Error adding immediate family member:', error);
    return NextResponse.json(
      { error: 'Error adding family member' },
      { status: 500 }
    );
  }
}
