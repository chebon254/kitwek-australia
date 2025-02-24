import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/about-us', '/contact-us', '/donations', '/sign-in', '/sign-up', '/reset-password', '/events', '/tickets'];
const PUBLIC_PATH_PREFIXES = ['/ui-assets/', '/favicon/']; // Paths that should be public including all their subpaths
const AUTH_PATHS = ['/sign-in', '/sign-up', '/reset-password']; // Added this back

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Check if the path starts with any of our public prefixes
  const isPublicAssetPath = PUBLIC_PATH_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );

  // Allow public paths and asset paths without session
  if (PUBLIC_PATHS.includes(pathname) || isPublicAssetPath) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Require authentication for protected routes
  if (!session) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};