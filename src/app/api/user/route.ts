import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = (await cookies()).get("session");

    if (!session?.value) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    } catch (error) {
      console.error("Session verification error:", error || "Unknown session error");
      // Clear invalid session cookie
      (await cookies()).delete("session");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!decodedClaims.email) {
      return NextResponse.json({ error: "No email in session" }, { status: 400 });
    }

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
      (await cookies()).delete("session");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check membership status
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (ageInDays >= 365 && user.subscription === "Free" && user.membershipStatus !== "INACTIVE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipStatus: "INACTIVE" },
      });
      user.membershipStatus = "INACTIVE";
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User fetch error:", error || "Unknown user fetch error");
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}