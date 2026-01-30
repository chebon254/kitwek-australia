import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export const revalidate = 180; // Revalidate every 3 minutes

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

    // Get all welfare applications for the user with related data
    const applications = await prisma.welfareApplication.findMany({
      where: { userId: user.id },
      include: {
        beneficiaries: true,
        documents: true,
        reimbursements: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get all reimbursements for the user
    const reimbursements = await prisma.welfareReimbursement.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: 'asc' }
    });

    // Format applications data
    const formattedApplications = applications.map(app => ({
      id: app.id,
      applicationType: app.applicationType,
      deceasedName: app.deceasedName,
      relationToDeceased: app.relationToDeceased,
      reasonForApplication: app.reasonForApplication,
      status: app.status,
      claimAmount: app.claimAmount,
      createdAt: app.createdAt,
      approvedAt: app.approvedAt,
      rejectedAt: app.rejectedAt,
      rejectionReason: app.rejectionReason,
      payoutDate: app.payoutDate,
      reimbursementDue: app.reimbursementDue,
      beneficiaries: app.beneficiaries.map(ben => ({
        id: ben.id,
        fullName: ben.fullName,
        relationship: ben.relationship,
        phone: ben.phone,
        email: ben.email,
        idNumber: ben.idNumber,
      })),
      documents: app.documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadedAt: doc.uploadedAt,
      })),
    }));

    // Format reimbursements data
    const formattedReimbursements = reimbursements.map(reimb => ({
      id: reimb.id,
      applicationId: reimb.applicationId,
      amountDue: reimb.amountDue,
      amountPaid: reimb.amountPaid,
      dueDate: reimb.dueDate,
      status: reimb.status,
      paidAt: reimb.paidAt,
      createdAt: reimb.createdAt,
    }));

    return NextResponse.json({
      applications: formattedApplications,
      reimbursements: formattedReimbursements,
    });
  } catch (error) {
    console.error('Error fetching welfare applications:', error);
    return NextResponse.json(
      { error: 'Error fetching welfare applications' },
      { status: 500 }
    );
  }
}