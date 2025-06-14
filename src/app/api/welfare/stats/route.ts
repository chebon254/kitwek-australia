import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get or create welfare fund record
    let welfareStats = await prisma.welfareFund.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!welfareStats) {
      // Create initial welfare fund record
      welfareStats = await prisma.welfareFund.create({
        data: {
          totalAmount: 0,
          totalMembers: 0,
          activeMembers: 0,
          isOperational: false,
        },
      });
    }

    // Get current counts
    const totalRegistrations = await prisma.welfareRegistration.count();
    const activeRegistrations = await prisma.welfareRegistration.count({
      where: {
        status: "ACTIVE",
        paymentStatus: "PAID",
      },
    });

    // Calculate total fund amount (initial registration fees)
    const totalAmount = activeRegistrations * 200;

    // Check if fund should be operational (100+ active members)
    const isOperational = activeRegistrations >= 1;

    // Update welfare fund record
    const updatedStats = await prisma.welfareFund.update({
      where: { id: welfareStats.id },
      data: {
        totalMembers: totalRegistrations,
        activeMembers: activeRegistrations,
        totalAmount: totalAmount,
        isOperational: isOperational,
        lastUpdated: new Date(),
        // Set launch date when first becoming operational
        launchDate:
          !welfareStats.launchDate && isOperational
            ? new Date()
            : welfareStats.launchDate,
        // Set waiting period end (2 months after launch)
        // waitingPeriodEnd: !welfareStats.waitingPeriodEnd && isOperational ?
        //   new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) : // 60 days
        //   welfareStats.waitingPeriodEnd
        waitingPeriodEnd:
          !welfareStats.waitingPeriodEnd && isOperational
            ? new Date() // Set to current time (no waiting)
            : welfareStats.waitingPeriodEnd,
      },
    });

    return NextResponse.json({
      totalMembers: updatedStats.totalMembers,
      activeMembers: updatedStats.activeMembers,
      totalAmount: updatedStats.totalAmount,
      isOperational: updatedStats.isOperational,
      launchDate: updatedStats.launchDate,
      waitingPeriodEnd: updatedStats.waitingPeriodEnd,
    });
  } catch (error) {
    console.error("Error fetching welfare stats:", error);
    return NextResponse.json(
      { error: "Error fetching welfare statistics" },
      { status: 500 }
    );
  }
}
