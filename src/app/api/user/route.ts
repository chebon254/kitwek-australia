import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = (await cookies()).get("session");

    if (!session) {
      return NextResponse.json({ error: "Session Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      session.value,
      true
    );
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        proffession: true,
        phone: true,
        profileImage: true,
        membershipStatus: true,
        subscription: true,
        memberNumber: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate account age and update membership status if needed
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (ageInDays >= 365 && user.subscription === "Free") {
      // Update user to INACTIVE if they're on free plan and account is over a year old
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipStatus: "INACTIVE" },
      });
      user.membershipStatus = "INACTIVE";
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}