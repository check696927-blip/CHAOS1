import { StyleProfile, QuizAnswer, ProductMatch, QUIZ_QUESTIONS } from "@/types/quiz";
import { PRODUCTS } from "@/constants/products";

const STYLE_PROFILE_KEY = 'chaos_style_profile';

export const saveStyleProfile = (userId: string, answers: QuizAnswer[]): StyleProfile => {
  const profile: StyleProfile = {
    id: `profile-${Date.now()}`,
    userId,
    answers,
    preferences: extractPreferences(answers),
    discountCode: generateQuizDiscount(),
    completedAt: new Date()
  };

  localStorage.setItem(`${STYLE_PROFILE_KEY}_${userId}`, JSON.stringify(profile));
  return profile;
};

export const getStyleProfile = (userId: string): StyleProfile | null => {
  const stored = localStorage.getItem(`${STYLE_PROFILE_KEY}_${userId}`);
  if (!stored) return null;
  
  try {
    const profile = JSON.parse(stored);
    return {
      ...profile,
      completedAt: new Date(profile.completedAt)
    };
  } catch {
    return null;
  }
};

const extractPreferences = (answers: QuizAnswer[]) => {
  const prefs: StyleProfile['preferences'] = {
    styles: [],
    aesthetics: [],
    bodyType: '',
    occasions: [],
    priceRange: ''
  };

  answers.forEach(answer => {
    const value = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
    
    if (answer.question.includes('style')) {
      prefs.styles = value;
    } else if (answer.question.includes('aesthetic')) {
      prefs.aesthetics = value;
    } else if (answer.question.includes('body type')) {
      prefs.bodyType = value[0];
    } else if (answer.question.includes('occasion')) {
      prefs.occasions = value;
    } else if (answer.question.includes('price range')) {
      prefs.priceRange = value[0];
    }
  });

  return prefs;
};

export const generateQuizDiscount = (): string => {
  return `STYLE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export const calculateProductMatch = (productId: string, profile: StyleProfile): ProductMatch => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    return { productId, matchPercentage: 0, matchReasons: [] };
  }

  let matchScore = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Category matching (30 points)
  if (product.category === 'NEW DROPS') {
    matchScore += 15;
    reasons.push('Latest collection');
  }
  if (product.category === 'ACCESSORIES') {
    matchScore += 15;
    reasons.push('Perfect accessory match');
  }

  // Style matching (30 points)
  const productTags = product.name.toLowerCase();
  if (profile.preferences.styles.some(s => productTags.includes(s.toLowerCase()))) {
    matchScore += 30;
    reasons.push('Matches your style');
  }

  // Aesthetic matching (20 points)
  if (profile.preferences.aesthetics.some(a => 
    productTags.includes(a.toLowerCase()) || 
    productTags.includes('gothic') || 
    productTags.includes('skull') ||
    productTags.includes('demon')
  )) {
    matchScore += 20;
    reasons.push('Your aesthetic vibe');
  }

  // Price range matching (20 points)
  const price = product.price * 0.8; // Discounted price
  const priceMatch = {
    'budget': price <= 50,
    'mid': price > 50 && price <= 100,
    'premium': price > 100 && price <= 200,
    'luxury': price > 200
  };
  
  if (priceMatch[profile.preferences.priceRange as keyof typeof priceMatch]) {
    matchScore += 20;
    reasons.push('Perfect price range');
  }

  const matchPercentage = Math.min(matchScore, maxScore);

  return {
    productId,
    matchPercentage,
    matchReasons: reasons
  };
};

export const getRecommendedProducts = (profile: StyleProfile, limit: number = 12): ProductMatch[] => {
  const matches = PRODUCTS.map(p => calculateProductMatch(p.id, profile));
  return matches
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, limit);
};
