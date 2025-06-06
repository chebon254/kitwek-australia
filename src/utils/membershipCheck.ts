import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const checkMembershipAndRedirect = async (router: AppRouterInstance) => {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) {
      router.push('/sign-in');
      return false;
    }

    const userData = await response.json();
    if (userData.membershipStatus === 'INACTIVE') {
      router.push('/dashboard/subscription');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking membership:', error);
    router.push('/dashboard/subscription');
    return false;
  }
};