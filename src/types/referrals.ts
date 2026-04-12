export interface ReferralCode {
  id: string;
  userId: string;
  code: string; // Unique referral code
  uses: number;
  successfulReferrals: number;
  totalRevenue: number;
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string; // User who referred
  referredId?: string; // User who signed up (null until they sign up)
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  purchaseValue?: number;
  pointsEarned: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface ReferralMilestone {
  count: number;
  reward: string;
  pointsBonus: number;
  unlocked: boolean;
}

export const REFERRAL_MILESTONES: ReferralMilestone[] = [
  { count: 5, reward: 'Bronze Ambassador Badge + $25 Gift Card', pointsBonus: 1000, unlocked: false },
  { count: 10, reward: 'Silver Ambassador Badge + $50 Gift Card', pointsBonus: 2500, unlocked: false },
  { count: 25, reward: 'Gold Ambassador Badge + $100 Gift Card + Lifetime 15% Discount', pointsBonus: 5000, unlocked: false }
];

export const POINTS_PER_REFERRAL = 500;
