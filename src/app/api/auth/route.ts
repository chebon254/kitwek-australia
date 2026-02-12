import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/nodemailer";
import { generateMemberNumber } from "@/lib/memberNumber";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body"},
        { status: 400 },
      );
    }

    const { idToken, username } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (!decodedToken.email) {
      throw new Error("Email is required");
    }

    const email = decodedToken.email;
    const uid = decodedToken.uid;

    // First, check if user exists by Firebase UID
    let user = await prisma.user.findUnique({
      where: { id: uid },
    });

    // If no user found by UID, check by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    // If user exists but IDs don't match, update the ID
    if (user && user.id !== uid) {
      user = await prisma.user.update({
        where: { email },
        data: { id: uid },
      });
    }

    // If user exists and is revoked, return error
    if (user?.revokeStatus) {
      return NextResponse.json(
        {
          error: "Account revoked",
          reason: user.revokeReason,
        },
        { status: 403 }
      );
    }

    // If no user exists, create new user
    if (!user) {
      const memberNumber = await generateMemberNumber();

      try {
        user = await prisma.user.create({
          data: {
            id: uid,
            email,
            username: username || email.split("@")[0],
            memberNumber,
            membershipStatus: "INACTIVE",
            subscription: "Free",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to create user account" },
          { status: 500 }
        );
      }

      // Send welcome email (user is not yet a member)
      sendWelcomeEmail(email, user.username || email).catch(
        (error) => console.error("Welcome email error:", error)
      );
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    (await cookies()).set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: 'lax', // Allow cookie to work with OAuth redirects
    });

    return NextResponse.json({ status: "success", user });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  (await cookies()).delete("session");
  return NextResponse.json({ status: "success" });
}