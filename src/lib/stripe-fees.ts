/**
 * Stripe Fee Calculation Utility
 *
 * Australian Stripe fees: 1.75% + $0.30 AUD per transaction
 * https://stripe.com/au/pricing
 */

export interface StripeFeeCalculation {
  grossAmount: number;
  stripeFee: number;
  netAmount: number;
}

/**
 * Calculate Stripe fees for a given amount in AUD
 *
 * @param amount - The gross amount in AUD
 * @returns Object containing gross, fee, and net amounts
 */
export function calculateStripeFee(amount: number): StripeFeeCalculation {
  const fee = (amount * 0.0175) + 0.30;

  return {
    grossAmount: amount,
    stripeFee: Number(fee.toFixed(2)),
    netAmount: Number((amount - fee).toFixed(2))
  };
}

/**
 * Pre-calculated Stripe fees for common welfare amounts
 */
export const STRIPE_FEES = {
  REGISTRATION: calculateStripeFee(100),   // $100 → Fee: $2.05 → Net: $97.95
  REIMBURSEMENT: calculateStripeFee(19),   // $19 → Fee: $0.63 → Net: $18.37
} as const;

/**
 * Calculate the amount needed to charge to receive a specific net amount
 * after Stripe fees
 *
 * @param netAmount - The desired net amount in AUD
 * @returns The gross amount to charge
 */
export function calculateGrossFromNet(netAmount: number): number {
  // Formula: gross = (net + 0.30) / (1 - 0.0175)
  const gross = (netAmount + 0.30) / 0.9825;
  return Number(gross.toFixed(2));
}
