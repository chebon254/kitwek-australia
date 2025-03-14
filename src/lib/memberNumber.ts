import { prisma } from './prisma';

export async function generateMemberNumber(): Promise<string> {
  // Get the latest member number
  const latestUser = await prisma.user.findFirst({
    orderBy: { memberNumber: 'desc' },
    select: { memberNumber: true }
  });

  let nextNumber = 1;
  
  if (latestUser?.memberNumber) {
    // Extract the number from KTWVXXX format
    const currentNumber = parseInt(latestUser.memberNumber.replace('KTWV', ''), 10);
    nextNumber = currentNumber + 1;
  }

  // Format the number with leading zeros
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  return `KTWV${formattedNumber}`;
}
