import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/lib/firebase-admin";
import { prisma } from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';
  console.log('Session:', session); // Add log for debugging

  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
      select: { membershipStatus: true }
    });

    if (request.nextUrl.pathname.startsWith('/dashboard') && 
        request.nextUrl.pathname !== '/dashboard/membership') {
      if (!user || user.membershipStatus !== 'ACTIVE') {
        return NextResponse.redirect(new URL('/dashboard/membership', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // Adjust if you need broader protection
};
