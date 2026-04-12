import { ReferralCode, Referral, ReferralMilestone, REFERRAL_MILESTONES, POINTS_PER_REFERRAL } from "@/types/referrals";
import { addPoints } from "./rewards";

const REFERRAL_CODES_KEY = 'chaos_referral_codes';
const REFERRALS_KEY = 'chaos_referrals';

export const generateReferralCode = (userId: string): ReferralCode => {
  // Check if user already has a code
  const existing = getReferralCode(userId);
  if (existing) return existing;

  const code = `CHAOS${userId.slice(0, 4).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const referralCode: ReferralCode = {
    id: `refcode-${Date.now()}`,
    userId,
    code,
    uses: 0,
    successfulReferrals: 0,
    totalRevenue: 0,
    createdAt: new Date()
  };

  localStorage.setItem(`${REFERRAL_CODES_KEY}_${userId}`, JSON.stringify(referralCode));
  return referralCode;
};

export const getReferralCode = (userId: string): ReferralCode | null => {
  const stored = localStorage.getItem(`${REFERRAL_CODES_KEY}_${userId}`);
  if (!stored) return null;
  
  try {
    const code = JSON.parse(stored);
    return {
      ...code,
      createdAt: new Date(code.createdAt)
    };
  } catch {
    return null;
  }
};

export const findReferralCodeByCode = (code: string): ReferralCode | null => {
  const allKeys = Object.keys(localStorage).filter(k => k.startsWith(REFERRAL_CODES_KEY));
  
  for (const key of allKeys) {
    try {
      const refCode = JSON.parse(localStorage.getItem(key) || '');
      if (refCode.code === code) {
        return {
          ...refCode,
          createdAt: new Date(refCode.createdAt)
        };
      }
    } catch {
      continue;
    }
  }
  
  return null;
};

export const recordReferralClick = (code: string): void => {
  const refCode = findReferralCodeByCode(code);
  if (refCode) {
    refCode.uses++;
    localStorage.setItem(`${REFERRAL_CODES_KEY}_${refCode.userId}`, JSON.stringify(refCode));
  }
};

export const recordReferralSignup = (code: string, newUserId: string): void => {
  const refCode = findReferralCodeByCode(code);
  if (!refCode) return;

  const referral: Referral = {
    id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    referrerId: refCode.userId,
    referredId: newUserId,
    referralCode: code,
    status: 'pending',
    pointsEarned: 0,
    createdAt: new Date()
  };

  const referrals = getReferrals(refCode.userId);
  referrals.push(referral);
  localStorage.setItem(`${REFERRALS_KEY}_${refCode.userId}`, JSON.stringify(referrals));
};

export const completeReferral = (code: string, referredUserId: string, purchaseValue: number): void => {
  const refCode = findReferralCodeByCode(code);
  if (!refCode) return;

  const referrals = getReferrals(refCode.userId);
  const referral = referrals.find(r => r.referredId === referredUserId && r.status === 'pending');
  
  if (referral) {
    referral.status = 'completed';
    referral.completedAt = new Date();
    referral.purchaseValue = purchaseValue;
    referral.pointsEarned = POINTS_PER_REFERRAL;

    // Update referral code stats
    refCode.successfulReferrals++;
    refCode.totalRevenue += purchaseValue;

    // Award points
    addPoints(
      refCode.userId,
      POINTS_PER_REFERRAL,
      'referral',
      `Referral completed: ${code}`,
      undefined,
      code
    );

    // Check for milestone rewards
    checkMilestones(refCode.userId, refCode.successfulReferrals);

    localStorage.setItem(`${REFERRALS_KEY}_${refCode.userId}`, JSON.stringify(referrals));
    localStorage.setItem(`${REFERRAL_CODES_KEY}_${refCode.userId}`, JSON.stringify(refCode));
  }
};

export const getReferrals = (userId: string): Referral[] => {
  const stored = localStorage.getItem(`${REFERRALS_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const referrals = JSON.parse(stored);
    return referrals.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      completedAt: r.completedAt ? new Date(r.completedAt) : undefined
    }));
  } catch {
    return [];
  }
};

export const getReferralStats = (userId: string) => {
  const code = getReferralCode(userId);
  const referrals = getReferrals(userId);

  const pending = referrals.filter(r => r.status === 'pending').length;
  const completed = referrals.filter(r => r.status === 'completed').length;
  const conversionRate = code && code.uses > 0 ? (completed / code.uses) * 100 : 0;

  return {
    code: code?.code || '',
    totalClicks: code?.uses || 0,
    pendingReferrals: pending,
    completedReferrals: completed,
    conversionRate,
    totalRevenue: code?.totalRevenue || 0,
    totalPointsEarned: completed * POINTS_PER_REFERRAL
  };
};

export const getMilestoneProgress = (userId: string): ReferralMilestone[] => {
  const code = getReferralCode(userId);
  const successfulReferrals = code?.successfulReferrals || 0;

  return REFERRAL_MILESTONES.map(milestone => ({
    ...milestone,
    unlocked: successfulReferrals >= milestone.count
  }));
};

const checkMilestones = (userId: string, successfulReferrals: number): void => {
  REFERRAL_MILESTONES.forEach(milestone => {
    if (successfulReferrals === milestone.count) {
      addPoints(
        userId,
        milestone.pointsBonus,
        'bonus',
        `Milestone Achieved: ${milestone.reward}`
      );
    }
  });
};
