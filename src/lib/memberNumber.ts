import { prisma } from './prisma';

/**
 * Generates a unique member number in the format KTWV001, KTWV999, KTWV1000, etc.
 * @returns Promise<string> The generated member number
 */
export async function generateMemberNumber(): Promise<string> {
  // Get the count of existing users
  const userCount = await prisma.user.count();
  
  // Calculate the next number (userCount + 1)
  const nextNumber = userCount + 1;
  
  // Format the number with leading zeros based on its length
  let formattedNumber: string;
  
  if (nextNumber < 10) {
    formattedNumber = `00${nextNumber}`;
  } else if (nextNumber < 100) {
    formattedNumber = `0${nextNumber}`;
  } else if (nextNumber < 1000) {
    formattedNumber = `${nextNumber}`;
  } else {
    formattedNumber = `${nextNumber}`;
  }
  
  // Create the member number with the KTWV prefix
  const memberNumber = `KTWV${formattedNumber}`;
  
  // Check if this member number already exists (just to be safe)
  const existingUser = await prisma.user.findUnique({
    where: { memberNumber },
  });
  
  // If it exists (very unlikely but possible if data was manually modified), recursively try again
  if (existingUser) {
    return generateMemberNumber();
  }
  
  return memberNumber;
}