import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    const applicationId = (await params).id;

    // Get the specific welfare application with all related data
    const application = await prisma.welfareApplication.findFirst({
      where: { 
        id: applicationId,
        userId: user.id // Ensure user can only access their own applications
      },
      include: {
        beneficiaries: {
          orderBy: { createdAt: 'asc' }
        },
        documents: {
          orderBy: { uploadedAt: 'asc' }
        },
        reimbursements: {
          orderBy: { dueDate: 'asc' }
        },
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Format the application data
    const formattedApplication = {
      id: application.id,
      applicationType: application.applicationType,
      deceasedName: application.deceasedName,
      relationToDeceased: application.relationToDeceased,
      reasonForApplication: application.reasonForApplication,
      status: application.status,
      claimAmount: application.claimAmount,
      createdAt: application.createdAt,
      approvedAt: application.approvedAt,
      rejectedAt: application.rejectedAt,
      rejectionReason: application.rejectionReason,
      payoutDate: application.payoutDate,
      reimbursementDue: application.reimbursementDue,
      beneficiaries: application.beneficiaries.map(ben => ({
        id: ben.id,
        fullName: ben.fullName,
        relationship: ben.relationship,
        phone: ben.phone,
        email: ben.email,
        idNumber: ben.idNumber,
        createdAt: ben.createdAt,
      })),
      documents: application.documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileType: doc.fileType,
        uploadedAt: doc.uploadedAt,
      })),
      reimbursements: application.reimbursements.map(reimb => ({
        id: reimb.id,
        amountDue: reimb.amountDue,
        amountPaid: reimb.amountPaid,
        dueDate: reimb.dueDate,
        status: reimb.status,
        paidAt: reimb.paidAt,
        createdAt: reimb.createdAt,
      })),
    };

    return NextResponse.json(formattedApplication);
  } catch (error) {
    console.error('Error fetching welfare application detail:', error);
    return NextResponse.json(
      { error: 'Error fetching welfare application detail' },
      { status: 500 }
    );
  }
}