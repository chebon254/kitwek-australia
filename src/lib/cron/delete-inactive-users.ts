// lib/cron/delete-inactive-users.ts
import { prisma } from "@/lib/prisma";

export async function deleteInactiveUsers() {
  try {
    // Calculate the date 365 days ago
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    
    // Find and delete inactive users older than 365 days
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        membershipStatus: "INACTIVE",
        createdAt: {
          lt: oneYearAgo // Less than (older than) one year ago
        }
      }
    });
    
    console.log(`Successfully deleted ${deletedUsers.count} inactive users`);
    return { 
      success: true, 
      count: deletedUsers.count 
    };
    
  } catch (error) {
    console.error("Error deleting inactive users:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}