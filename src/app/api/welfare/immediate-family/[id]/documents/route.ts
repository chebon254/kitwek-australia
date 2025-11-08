import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// GET - Fetch documents for a family member
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

    const { id } = await params;

    // Verify family member belongs to user
    const familyMember = await prisma.immediateFamily.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    });

    if (!familyMember) {
      return NextResponse.json({
        error: 'Family member not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      documents: familyMember.documents
    });
  } catch (error) {
    console.error('Error fetching family documents:', error);
    return NextResponse.json(
      { error: 'Error fetching documents' },
      { status: 500 }
    );
  }
}

// POST - Upload document for a family member
export async function POST(
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

    // Verify family member belongs to user
    const familyMember = await prisma.immediateFamily.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!familyMember) {
      return NextResponse.json({
        error: 'Family member not found'
      }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = (formData.get('fileType') as string) || 'other';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `family-documents/${user.id}/${id}/${timestamp}.${extension}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to DigitalOcean Spaces
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(uploadCommand);

    // Generate public URL
    const fileUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${filename}`;

    // Save to database
    const document = await prisma.familyDocument.create({
      data: {
        familyMemberId: id,
        fileName: file.name,
        fileUrl: fileUrl,
        fileType: fileType,
      }
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileType: document.fileType,
        uploadedAt: document.uploadedAt,
      },
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading family document:', error);
    return NextResponse.json(
      { error: 'Error uploading document' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific document
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Verify document belongs to user's family member
    const document = await prisma.familyDocument.findFirst({
      where: { id: documentId },
      include: {
        familyMember: true
      }
    });

    if (!document || document.familyMember.userId !== user.id) {
      return NextResponse.json({
        error: 'Document not found or access denied'
      }, { status: 404 });
    }

    // Delete from database
    await prisma.familyDocument.delete({
      where: { id: documentId }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting family document:', error);
    return NextResponse.json(
      { error: 'Error deleting document' },
      { status: 500 }
    );
  }
}
