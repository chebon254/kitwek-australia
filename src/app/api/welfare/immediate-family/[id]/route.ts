import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

// Type definition for update data
interface UpdateFamilyData {
  fullName?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  idNumber?: string;
}

// PATCH - Update immediate family member
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Check if family member exists and belongs to user
    const existingMember = await prisma.immediateFamily.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!existingMember) {
      return NextResponse.json({
        error: 'Family member not found or does not belong to you'
      }, { status: 404 });
    }

    const data: UpdateFamilyData = await request.json();
    const { fullName, relationship, phone, email, idNumber } = data;

    // Validate email format if provided
    if (email && email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({
          error: 'Invalid email format'
        }, { status: 400 });
      }
    }

    // Update the family member
    const updatedMember = await prisma.immediateFamily.update({
      where: { id: id },
      data: {
        ...(fullName && { fullName }),
        ...(relationship && { relationship }),
        ...(phone && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(idNumber !== undefined && { idNumber: idNumber || null }),
      }
    });

    return NextResponse.json({
      success: true,
      familyMember: {
        id: updatedMember.id,
        fullName: updatedMember.fullName,
        relationship: updatedMember.relationship,
        phone: updatedMember.phone,
        email: updatedMember.email,
        idNumber: updatedMember.idNumber,
        createdAt: updatedMember.createdAt,
        updatedAt: updatedMember.updatedAt,
      },
      message: 'Family member updated successfully'
    });
  } catch (error) {
    console.error('Error updating immediate family member:', error);
    return NextResponse.json(
      { error: 'Error updating family member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove immediate family member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Check if family member exists and belongs to user
    const existingMember = await prisma.immediateFamily.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!existingMember) {
      return NextResponse.json({
        error: 'Family member not found or does not belong to you'
      }, { status: 404 });
    }

    // Check if user has paid registration - if yes, they must keep at least 1 family member
    const registration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    if (registration && registration.paymentStatus === 'PAID') {
      // Count total family members
      const familyCount = await prisma.immediateFamily.count({
        where: { userId: user.id }
      });

      if (familyCount <= 1) {
        return NextResponse.json({
          error: 'You must have at least one family member as a registered welfare member'
        }, { status: 400 });
      }
    }

    // Delete the family member
    await prisma.immediateFamily.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Family member removed successfully'
    });
  } catch (error) {
    console.error('Error deleting immediate family member:', error);
    return NextResponse.json(
      { error: 'Error deleting family member' },
      { status: 500 }
    );
  }
}
