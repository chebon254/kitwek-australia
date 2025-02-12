import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/lib/firebase-admin";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';

  // Verify the session cookie
  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    
    // Check if accessing dashboard and membership status
    if (request.nextUrl.pathname.startsWith('/dashboard') && 
        request.nextUrl.pathname !== '/dashboard/membership') {
      const user = decodedClaims as any;
      if (user.membershipStatus !== 'ACTIVE') {
        return NextResponse.redirect(new URL('/dashboard/membership', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};