export type MembershipTier = 'Bronze' | 'Silver' | 'Gold';

export interface RewardsAccount {
  userId: string;
  points: number;
  tier: MembershipTier;
  lifetimePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'redeem';
  source: 'purchase' | 'referral' | 'review' | 'redemption' | 'bonus';
  description: string;
  createdAt: Date;
  orderId?: string;
  referralCode?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_shipping' | 'early_access' | 'exclusive_product';
  value: number; // Dollar value or percentage
  available: boolean;
  tier?: MembershipTier; // Required tier
  image?: string;
}

export const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 1000,
  Gold: 5000
};

export const TIER_BENEFITS = {
  Bronze: {
    pointsMultiplier: 1,
    earlyAccess: false,
    exclusiveDiscounts: 0,
    freeShippingThreshold: 50
  },
  Silver: {
    pointsMultiplier: 1.25,
    earlyAccess: true,
    exclusiveDiscounts: 5, // 5% extra discount
    freeShippingThreshold: 35
  },
  Gold: {
    pointsMultiplier: 1.5,
    earlyAccess: true,
    exclusiveDiscounts: 10, // 10% extra discount
    freeShippingThreshold: 0 // Always free shipping
  }
};

export const POINTS_EARNING_RATES = {
  purchase: 10, // 10 points per $1 spent
  referral: 500, // 500 points for successful referral
  review: 50, // 50 points for writing a review
  reviewWithPhoto: 100, // 100 points for review with photo
  birthdayBonus: 200 // 200 points on birthday
};
