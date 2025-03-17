import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ slug: string }>
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    // Convert slug back to title format
    const title = slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    const blog = await prisma.blog.findFirst({
      where: {
        title: {
          contains: title,
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Error fetching blog' },
      { status: 500 }
    );
  }
}