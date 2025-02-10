import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path === "/dashboard") {
      // Get the latest user status from database
      const user = await prisma.user.findUnique({
        where: {
          email: token?.email as string
        },
        select: {
          membershipStatus: true
        }
      });

      if (user?.membershipStatus !== "ACTIVE") {
        return NextResponse.redirect(new URL("/dashboard/membership", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*"]
};