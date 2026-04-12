import { PunchCard, Stamp, PunchReward, PUNCH_REWARDS, STAMP_VALUE as STAMP_VALUE_CONST, MAX_STAMPS as MAX_STAMPS_CONST } from "@/types/punchcard";

// Re-export constants
export const STAMP_VALUE = STAMP_VALUE_CONST;
export const MAX_STAMPS = MAX_STAMPS_CONST;

const PUNCHCARD_KEY = 'chaos_punchcards';

export const getCurrentMonthYear = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getPunchCard = (userId: string): PunchCard => {
  const cards = getAllPunchCards();
  const currentMonth = getCurrentMonthYear();
  
  let card = cards.find(c => c.userId === userId && c.monthYear === currentMonth);
  
  if (!card) {
    card = createPunchCard(userId);
  }
  
  return {
    ...card,
    createdAt: new Date(card.createdAt),
    updatedAt: new Date(card.updatedAt),
    stamps: card.stamps.map(s => ({
      ...s,
      earnedAt: new Date(s.earnedAt)
    })),
    rewardsUnlocked: card.rewardsUnlocked.map(r => ({
      ...r,
      unlockedAt: new Date(r.unlockedAt),
      claimedAt: r.claimedAt ? new Date(r.claimedAt) : undefined
    }))
  };
};

export const createPunchCard = (userId: string): PunchCard => {
  const cards = getAllPunchCards();
  const previousCard = cards
    .filter(c => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  
  const consecutiveMonths = checkConsecutiveMonths(previousCard) 
    ? (previousCard?.consecutiveMonths || 0) + 1 
    : 1;

  const card: PunchCard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    stamps: [],
    monthYear: getCurrentMonthYear(),
    rewardsUnlocked: [],
    consecutiveMonths,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  cards.push(card);
  localStorage.setItem(PUNCHCARD_KEY, JSON.stringify(cards));
  
  return card;
};

export const getAllPunchCards = (): PunchCard[] => {
  const stored = localStorage.getItem(PUNCHCARD_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addStamp = (userId: string, orderId: string, amount: number): PunchCard => {
  const cards = getAllPunchCards();
  const card = getPunchCard(userId);
  
  const stampsToAdd = Math.floor(amount / STAMP_VALUE);
  
  for (let i = 0; i < stampsToAdd && card.stamps.length < MAX_STAMPS; i++) {
    const stamp: Stamp = {
      id: `stamp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      amount: STAMP_VALUE,
      earnedAt: new Date(),
      animated: true
    };
    card.stamps.push(stamp);
  }

  // Check for milestone rewards
  PUNCH_REWARDS.forEach(reward => {
    if (card.stamps.length >= reward.milestone) {
      const alreadyUnlocked = card.rewardsUnlocked.some(r => r.milestone === reward.milestone);
      if (!alreadyUnlocked) {
        const punchReward: PunchReward = {
          id: `reward-${Date.now()}-${reward.milestone}`,
          milestone: reward.milestone,
          reward: reward.reward,
          value: reward.value,
          claimed: false,
          unlockedAt: new Date()
        };
        card.rewardsUnlocked.push(punchReward);
      }
    }
  });

  card.updatedAt = new Date();
  
  // Update in storage
  const cardIndex = cards.findIndex(c => c.id === card.id);
  if (cardIndex >= 0) {
    cards[cardIndex] = card;
  } else {
    cards.push(card);
  }
  
  localStorage.setItem(PUNCHCARD_KEY, JSON.stringify(cards));
  
  return card;
};

export const claimReward = (userId: string, rewardId: string): void => {
  const cards = getAllPunchCards();
  const card = getPunchCard(userId);
  
  const reward = card.rewardsUnlocked.find(r => r.id === rewardId);
  if (reward) {
    reward.claimed = true;
    reward.claimedAt = new Date();
    
    const cardIndex = cards.findIndex(c => c.id === card.id);
    if (cardIndex >= 0) {
      cards[cardIndex] = card;
      localStorage.setItem(PUNCHCARD_KEY, JSON.stringify(cards));
    }
  }
};

const checkConsecutiveMonths = (previousCard?: PunchCard): boolean => {
  if (!previousCard) return false;
  
  const current = new Date();
  const lastMonth = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  const expectedMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  return previousCard.monthYear === expectedMonth;
};

export const getConsecutiveBonus = (consecutiveMonths: number): number => {
  if (consecutiveMonths >= 6) return 500; // 6+ months: 500 bonus points
  if (consecutiveMonths >= 3) return 200; // 3-5 months: 200 bonus points
  return 0;
};
