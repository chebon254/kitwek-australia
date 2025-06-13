import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

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

    // Check if user is eligible to apply
    const registration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    if (!registration || registration.status !== 'ACTIVE' || registration.paymentStatus !== 'PAID') {
      return NextResponse.json({ 
        error: 'You must be an active welfare member to apply' 
      }, { status: 403 });
    }

    // Check welfare fund status
    const welfareStats = await prisma.welfareFund.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!welfareStats?.isOperational) {
      return NextResponse.json({ 
        error: 'Welfare fund is not yet operational. Minimum 100 members required.' 
      }, { status: 403 });
    }

    // Check waiting period
    if (welfareStats.waitingPeriodEnd && new Date() < new Date(welfareStats.waitingPeriodEnd)) {
      return NextResponse.json({ 
        error: 'Welfare fund is still in waiting period. Please try again after the waiting period ends.' 
      }, { status: 403 });
    }

    const data = await request.json();
    const { 
      applicationType, 
      deceasedName, 
      relationToDeceased, 
      reasonForApplication, 
      beneficiaries, 
      documents 
    } = data;

    // Validate required fields
    if (!applicationType || !deceasedName || !reasonForApplication) {
      return NextResponse.json({ 
        error: 'Missing required application fields' 
      }, { status: 400 });
    }

    if (!beneficiaries || beneficiaries.length === 0) {
      return NextResponse.json({ 
        error: 'At least one beneficiary is required' 
      }, { status: 400 });
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ 
        error: 'Supporting documents are required' 
      }, { status: 400 });
    }

    // Determine claim amount based on application type
    const claimAmount = applicationType === 'MEMBER_DEATH' ? 8000 : 5000;

    // Create application in transaction
    const application = await prisma.$transaction(async (tx) => {
      // Create the main application
      const newApplication = await tx.welfareApplication.create({
        data: {
          userId: user.id,
          applicationType,
          deceasedName,
          relationToDeceased: relationToDeceased || null,
          reasonForApplication,
          claimAmount,
          status: 'PENDING',
        }
      });

      // Create beneficiaries
      await Promise.all(
        beneficiaries.map((beneficiary: any) =>
          tx.welfareBeneficiary.create({
            data: {
              applicationId: newApplication.id,
              fullName: beneficiary.fullName,
              relationship: beneficiary.relationship,
              phone: beneficiary.phone,
              email: beneficiary.email || null,
              idNumber: beneficiary.idNumber || null,
            }
          })
        )
      );

      // Create document records
      await Promise.all(
        documents.map((doc: any) =>
          tx.welfareDocument.create({
            data: {
              applicationId: newApplication.id,
              fileName: doc.name,
              fileUrl: doc.url,
              fileType: doc.type,
            }
          })
        )
      );

      return newApplication;
    });

    // TODO: Send notification email to admin about new application
    // You can implement this similar to other email notifications

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Your welfare application has been submitted successfully. You will be notified once it is reviewed.'
    });
  } catch (error) {
    console.error('Error submitting welfare application:', error);
    return NextResponse.json(
      { error: 'Error submitting welfare application' },
      { status: 500 }
    );
  }
}