import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = (await cookies()).get("session");
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const votes = await prisma.vote.findMany({
      where: { userId: user.id },
      include: {
        campaign: true,
        candidate: true
      }
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}