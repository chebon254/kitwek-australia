import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearWelfareTestData() {
  console.log('Starting to clear welfare test data...\n');

  try {
    // Clear WelfareRegistration table
    const registrationResult = await prisma.welfareRegistration.deleteMany({});
    console.log(`✅ Cleared ${registrationResult.count} records from WelfareRegistration table`);

    // Reset WelfareFund table (delete all and recreate with default values)
    const fundResult = await prisma.welfareFund.deleteMany({});
    console.log(`✅ Cleared ${fundResult.count} records from WelfareFund table`);

    // Create a fresh WelfareFund entry with default values
    const newFund = await prisma.welfareFund.create({
      data: {
        totalAmount: 0,
        totalMembers: 0,
        activeMembers: 0,
        isOperational: false,
        launchDate: null,
        waitingPeriodEnd: null,
      }
    });
    console.log('✅ Created fresh WelfareFund entry with default values');
    console.log('   Fund ID:', newFund.id);
    console.log('   Total Amount:', newFund.totalAmount);
    console.log('   Total Members:', newFund.totalMembers);
    console.log('   Active Members:', newFund.activeMembers);
    console.log('   Is Operational:', newFund.isOperational);

    console.log('\n✨ Successfully cleared all welfare test data!');
    console.log('The welfare system is now reset and ready for production.');
  } catch (error) {
    console.error('❌ Error clearing welfare test data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearWelfareTestData();