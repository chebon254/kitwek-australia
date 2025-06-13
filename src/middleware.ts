import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/about-us', '/blogs', '/contact-us', '/donations', '/sign-in', '/sign-up', '/reset-password', '/events', '/tickets', '/welfare'];
const PUBLIC_PATH_PREFIXES = ['/ui-assets/', '/favicon/']; // Paths that should be public including all their subpaths
const AUTH_PATHS = ['/sign-in', '/sign-up', '/reset-password']; // Added this back

// Paths that should include all their subpaths as public
const PUBLIC_PATH_PREFIXES_DYNAMIC = ['/events', '/tickets', '/donations', '/blogs'];

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const pathname = request.nextUrl.pathname;

    // Check if the path starts with any of our public prefixes
    const isPublicAssetPath = PUBLIC_PATH_PREFIXES.some(prefix =>
        pathname.startsWith(prefix)
    );
                                                                                            
    // Check if the path is explicitly public or starts with a public dynamic prefix
    const isPublicDynamicPath = PUBLIC_PATH_PREFIXES_DYNAMIC.some(prefix =>
        pathname.startsWith(prefix)
    );
    
    if (PUBLIC_PATHS.includes(pathname) || isPublicAssetPath || isPublicDynamicPath) {
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

    // Skip storing paths that are API routes, static files, or the 404 page itself
    if (!pathname.startsWith('/api/') &&
        !pathname.includes('.') &&
        pathname !== '/not-found' &&
        pathname !== '/404') {
        const response = NextResponse.next();
        response.cookies.set('lastVisitedPath', pathname, {
            path: '/',
            maxAge: 60 * 60, // 1 hour
            httpOnly: true,
            sameSite: 'strict'
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
