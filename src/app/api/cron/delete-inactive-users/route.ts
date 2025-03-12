// app/api/cron/delete-inactive-users/route.ts
import { NextResponse } from "next/server";
import { deleteInactiveUsers } from "@/lib/cron/delete-inactive-users";

// This runs once per day at midnight
export const config = {
  runtime: 'edge',
  schedule: '0 0 * * *' // cron syntax: at 00:00 every day
};

export async function GET() {
  const result = await deleteInactiveUsers();
  
  return NextResponse.json(result);
}