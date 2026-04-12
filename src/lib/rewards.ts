import { 
  RewardsAccount, 
  PointsTransaction, 
  MembershipTier,
  TIER_THRESHOLDS,
  TIER_BENEFITS,
  POINTS_EARNING_RATES
} from "@/types/rewards";
import { getCurrentUser } from "./auth";

const REWARDS_STORAGE_KEY = 'chaos_rewards';
const TRANSACTIONS_STORAGE_KEY = 'chaos_points_transactions';

export const getRewardsAccount = (userId: string): RewardsAccount | null => {
  const stored = localStorage.getItem(`${REWARDS_STORAGE_KEY}_${userId}`);
  if (!stored) return null;
  
  try {
    const account = JSON.parse(stored);
    return {
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt)
    };
  } catch {
    return null;
  }
};

export const createRewardsAccount = (userId: string): RewardsAccount => {
  const account: RewardsAccount = {
    userId,
    points: 0,
    tier: 'Bronze',
    lifetimePoints: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  saveRewardsAccount(account);
  return account;
};

export const saveRewardsAccount = (account: RewardsAccount): void => {
  localStorage.setItem(
    `${REWARDS_STORAGE_KEY}_${account.userId}`,
    JSON.stringify(account)
  );
};

export const calculateTier = (lifetimePoints: number): MembershipTier => {
  if (lifetimePoints >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (lifetimePoints >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
};

export const addPoints = (
  userId: string,
  amount: number,
  source: PointsTransaction['source'],
  description: string,
  orderId?: string,
  referralCode?: string
): RewardsAccount => {
  let account = getRewardsAccount(userId);
  if (!account) {
    account = createRewardsAccount(userId);
  }

  // Apply tier multiplier
  const benefits = TIER_BENEFITS[account.tier];
  const earnedPoints = Math.floor(amount * benefits.pointsMultiplier);

  // Update account
  account.points += earnedPoints;
  account.lifetimePoints += earnedPoints;
  account.tier = calculateTier(account.lifetimePoints);
  account.updatedAt = new Date();

  // Save transaction
  const transaction: PointsTransaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    amount: earnedPoints,
    type: 'earn',
    source,
    description,
    createdAt: new Date(),
    orderId,
    referralCode
  };
  
  saveTransaction(transaction);
  saveRewardsAccount(account);
  
  return account;
};

export const redeemPoints = (
  userId: string,
  pointsCost: number,
  description: string
): RewardsAccount | null => {
  const account = getRewardsAccount(userId);
  if (!account || account.points < pointsCost) {
    return null;
  }

  // Deduct points
  account.points -= pointsCost;
  account.updatedAt = new Date();

  // Save transaction
  const transaction: PointsTransaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    amount: -pointsCost,
    type: 'redeem',
    source: 'redemption',
    description,
    createdAt: new Date()
  };
  
  saveTransaction(transaction);
  saveRewardsAccount(account);
  
  return account;
};

export const saveTransaction = (transaction: PointsTransaction): void => {
  const transactions = getTransactions(transaction.userId);
  transactions.unshift(transaction);
  localStorage.setItem(
    `${TRANSACTIONS_STORAGE_KEY}_${transaction.userId}`,
    JSON.stringify(transactions)
  );
};

export const getTransactions = (userId: string): PointsTransaction[] => {
  const stored = localStorage.getItem(`${TRANSACTIONS_STORAGE_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const transactions = JSON.parse(stored);
    return transactions.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt)
    }));
  } catch {
    return [];
  }
};

export const calculatePointsForPurchase = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINTS_EARNING_RATES.purchase);
};

export const checkBirthdayReward = (userId: string): void => {
  const user = getCurrentUser();
  if (!user || !user.birthday) return;

  const today = new Date();
  const birthday = new Date(user.birthday);
  
  const isBirthday = today.getMonth() === birthday.getMonth() && 
                     today.getDate() === birthday.getDate();

  if (isBirthday) {
    const lastBirthdayReward = localStorage.getItem(`birthday_reward_${userId}_${today.getFullYear()}`);
    
    if (!lastBirthdayReward) {
      addPoints(userId, POINTS_EARNING_RATES.birthdayBonus, 'bonus', '🎂 Happy Birthday! Bonus points');
      localStorage.setItem(`birthday_reward_${userId}_${today.getFullYear()}`, 'claimed');
    }
  }
};

export const getNextTierProgress = (account: RewardsAccount): {
  current: MembershipTier;
  next: MembershipTier | null;
  pointsNeeded: number;
  progress: number;
} => {
  const { lifetimePoints, tier } = account;
  
  if (tier === 'Gold') {
    return {
      current: 'Gold',
      next: null,
      pointsNeeded: 0,
      progress: 100
    };
  }
  
  const nextTier = tier === 'Bronze' ? 'Silver' : 'Gold';
  const nextThreshold = TIER_THRESHOLDS[nextTier];
  const currentThreshold = TIER_THRESHOLDS[tier];
  const pointsNeeded = nextThreshold - lifetimePoints;
  const progress = ((lifetimePoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
  return {
    current: tier,
    next: nextTier,
    pointsNeeded,
    progress: Math.max(0, Math.min(100, progress))
  };
};
