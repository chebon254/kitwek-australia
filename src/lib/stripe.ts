import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
  timeout: 20000, // 20 seconds timeout instead of default 80 seconds
  maxNetworkRetries: 2, // Retry failed requests up to 2 times
});