export interface PunchCard {
  id: string;
  userId: string;
  stamps: Stamp[];
  monthYear: string; // Format: "2026-02"
  rewardsUnlocked: PunchReward[];
  consecutiveMonths: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stamp {
  id: string;
  orderId: string;
  amount: number; // Amount spent
  earnedAt: Date;
  animated?: boolean; // For UI animation
}

export interface PunchReward {
  id: string;
  milestone: 5 | 10 | 20;
  reward: string;
  value: number;
  claimed: boolean;
  unlockedAt: Date;
  claimedAt?: Date;
}

export const PUNCH_REWARDS: { milestone: 5 | 10 | 20; reward: string; value: number }[] = [
  { milestone: 5, reward: '$10 OFF', value: 10 },
  { milestone: 10, reward: '$25 OFF', value: 25 },
  { milestone: 20, reward: 'FREE ITEM', value: 0 }
];

export const STAMP_VALUE = 25; // $25 per stamp
export const MAX_STAMPS = 20;
