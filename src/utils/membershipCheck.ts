import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const checkMembershipAndRedirect = async (router: AppRouterInstance) => {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      router.push('/sign-in');
      return false;
    }

    const userData = await response.json();
    
    // Allow access if user has ACTIVE membership
    if (userData.membershipStatus === 'ACTIVE') {
      return true;
    }

    // For INACTIVE users, redirect to subscription page
    // This allows both new users and expired users to pay
    if (userData.membershipStatus === 'INACTIVE') {
      router.push('/dashboard/subscription');
      return false;
    }


    // Default: allow access (shouldn't reach here normally)
    return true;
  } catch (error) {
    console.error('Error checking membership:', error);
    router.push('/dashboard/subscription');
    return false;
  }
};