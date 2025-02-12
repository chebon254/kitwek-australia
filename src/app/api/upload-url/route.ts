import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/spaces';

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();
    const { uploadUrl, publicUrl } = await generateUploadUrl(fileName, contentType);
    
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}