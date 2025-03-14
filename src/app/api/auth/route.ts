import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/nodemailer";
import { generateMemberNumber } from "@/lib/memberNumber";

export async function POST(request: Request) {
  try {
    const { idToken, username } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 400 });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decodedToken.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const email = decodedToken.email;
    const uid = decodedToken.uid;

    try {
      // Check if user is revoked
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { revokeStatus: true, revokeReason: true, memberNumber: true },
      });

      if (existingUser?.revokeStatus) {
        return NextResponse.json(
          {
            error: "Account revoked",
            reason: existingUser.revokeReason,
          },
          { status: 403 }
        );
      }

      // Generate member number for new users
      let memberNumber = existingUser?.memberNumber;
      if (!existingUser) {
        memberNumber = await generateMemberNumber();
      }

      // Create or update user in database
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          username: username || undefined,
        },
        create: {
          id: uid,
          email,
          username: username || email.split("@")[0],
          memberNumber,
          membershipStatus: "INACTIVE",
          subscription: "Free",
        },
      });

      // Create session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      // Set cookie
      (await
        // Set cookie
        cookies()).set("session", sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // Send welcome email for new users
      if (!existingUser) {
        try {
          await sendWelcomeEmail(
            email,
            user.username || email,
            user.memberNumber || undefined
          );
        } catch (error) {
          console.error("Error sending welcome email:", error);
        }
      }

      return NextResponse.json({ status: "success", user });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // If database operation fails, delete the Firebase user
      try {
        await adminAuth.deleteUser(uid);
      } catch (deleteError) {
        console.error("Error deleting Firebase user:", deleteError);
      }
      return NextResponse.json(
        { error: "Failed to create user in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    (await cookies()).delete("session");
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}