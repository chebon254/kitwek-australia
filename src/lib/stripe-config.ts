// Centralized Stripe configuration for consistent branding
export const STRIPE_CONFIG = {
  businessName: 'Kitwek Victoria',
  currency: 'aud',
  
  products: {
    membership: {
      name: 'Kitwek Victoria Membership',
      description: 'Annual membership activation'
    },
    welfare: {
      name: 'Kitwek Victoria Welfare Registration',
      description: 'One-time welfare fund registration fee'
    },
    donation: {
      getName: (campaignName: string) => `Donation to ${campaignName}`,
      description: 'One-time donation'
    },
    event: {
      getName: (eventName: string) => `${eventName} - Kitwek Victoria Event`,
      getDescription: (quantity: number) => `${quantity} ticket${quantity > 1 ? 's' : ''}`
    },
    subscription: {
      premium: {
        name: 'Kitwek Victoria Premium Membership',
        description: 'Premium membership subscription'
      },
      vip: {
        name: 'Kitwek Victoria VIP Membership',
        description: 'VIP membership subscription'
      }
    }
  }
};