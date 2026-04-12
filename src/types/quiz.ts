export interface QuizAnswer {
  question: string;
  answer: string | string[];
}

export interface StyleProfile {
  id: string;
  userId: string;
  answers: QuizAnswer[];
  preferences: {
    styles: string[];
    aesthetics: string[];
    bodyType: string;
    occasions: string[];
    priceRange: string;
  };
  discountCode?: string;
  completedAt: Date;
}

export interface ProductMatch {
  productId: string;
  matchPercentage: number;
  matchReasons: string[];
}

export const QUIZ_QUESTIONS = [
  {
    id: 'style',
    question: 'What\'s your go-to fashion style?',
    type: 'multiple' as const,
    options: [
      { value: 'streetwear', label: 'Streetwear', description: 'Urban, casual, bold graphics' },
      { value: 'dark-aesthetic', label: 'Dark Aesthetic', description: 'Gothic, edgy, mysterious' },
      { value: 'anime-inspired', label: 'Anime Inspired', description: 'Japanese culture, bold designs' },
      { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple, understated' }
    ]
  },
  {
    id: 'aesthetic',
    question: 'Which aesthetics resonate with you?',
    type: 'multiple' as const,
    options: [
      { value: 'cyber-punk', label: 'Cyber Punk', description: 'Neon, futuristic, tech-inspired' },
      { value: 'gothic', label: 'Gothic', description: 'Dark, dramatic, vintage' },
      { value: 'grunge', label: 'Grunge', description: 'Raw, distressed, rebellious' },
      { value: 'kawaii', label: 'Kawaii', description: 'Cute, colorful, playful' }
    ]
  },
  {
    id: 'body-type',
    question: 'What\'s your body type?',
    type: 'single' as const,
    options: [
      { value: 'athletic', label: 'Athletic', description: 'Muscular, defined build' },
      { value: 'slim', label: 'Slim', description: 'Lean, narrow frame' },
      { value: 'average', label: 'Average', description: 'Medium build' },
      { value: 'plus-size', label: 'Plus Size', description: 'Curvy, fuller build' }
    ]
  },
  {
    id: 'occasion',
    question: 'Where do you wear your outfits most?',
    type: 'multiple' as const,
    options: [
      { value: 'casual', label: 'Casual Daily', description: 'Everyday comfort' },
      { value: 'streetstyle', label: 'Street Style', description: 'Urban adventures' },
      { value: 'events', label: 'Events/Concerts', description: 'Performances, gatherings' },
      { value: 'loungewear', label: 'Loungewear', description: 'Home, relaxing' }
    ]
  },
  {
    id: 'price-range',
    question: 'What\'s your typical price range?',
    type: 'single' as const,
    options: [
      { value: 'budget', label: '$20-$50', description: 'Budget-friendly' },
      { value: 'mid', label: '$50-$100', description: 'Mid-range' },
      { value: 'premium', label: '$100-$200', description: 'Premium quality' },
      { value: 'luxury', label: '$200+', description: 'Luxury pieces' }
    ]
  }
];
