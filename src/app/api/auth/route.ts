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

    // Primary lookup by email (authoritative from Firebase JWT)
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Fallback: check by Firebase UID (handles accounts created before email-first flow)
    if (!user) {
      const userByUid = await prisma.user.findUnique({
        where: { id: uid },
      });
      // Only use UID result if the email matches - prevents returning wrong user
      // when Firebase UIDs were incorrectly assigned during member number transfers
      if (userByUid && userByUid.email === email) {
        user = userByUid;
      }
    }

    // If user exists but DB id doesn't match Firebase UID, sync it
    if (user && user.id !== uid) {
      const oldId = user.id;
      try {
        user = await prisma.user.update({
          where: { id: oldId },
          data: { id: uid },
        });
      } catch (idUpdateError) {
        // Another record already has this UID (leftover from a transfer)
        // Remove the stale UID from the other record first, then retry
        console.warn("UID conflict detected, resolving:", idUpdateError);
        await prisma.user.updateMany({
          where: { id: uid, NOT: { email } },
          data: { id: `legacy_${uid}_${Date.now()}` },
        });
        user = await prisma.user.update({
          where: { id: oldId },
          data: { id: uid },
        });
      }

      // Also update all FK references so related tables stay consistent
      await Promise.all([
        prisma.$executeRaw`UPDATE WelfareRegistration SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE WelfareReimbursement SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE WelfareApplication SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE ImmediateFamily SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE Ticket SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE Vote SET userId = ${uid} WHERE userId = ${oldId}`,
        prisma.$executeRaw`UPDATE WelfareVote SET userId = ${uid} WHERE userId = ${oldId}`,
      ]);
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