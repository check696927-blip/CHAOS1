export interface ProductVariant {
  id: string;
  name: string; // e.g., "Black", "Gray", "Style 1"
  images: string[]; // Must match variant 1:1, no mixed products
  price?: number; // Optional variant-specific pricing
  inStock: boolean;
  stockCount: number; // Individual variant stock (required)
  disabled?: boolean; // Auto-disabled when stockCount === 0
}

export interface Product {
  id: string;
  name: string;
  productType: 'hoodie' | 'pants' | 'tee' | 'beanie' | 'cap' | 'ring' | 'chain' | 'pendant'; // ENFORCE 1 TYPE PER LISTING
  price: number; // Base price (can be overridden by variants)
  category: string;
  image: string; // Main display image
  images: string[]; // Parent images (only shown if no variant selected)
  variants?: ProductVariant[]; // Color/style variants (MUST BE SAME PRODUCT TYPE)
  badge?: string;
  inStock: boolean; // Calculated from variants if present
  stockCount?: number; // Parent stock (not used if variants exist)
  description?: string;
  features?: string[];
  sizes?: string[];
  sizeGuide?: SizeGuide;
  // Admin-only supply chain fields
  supplyChain?: {
    source: 'aliexpress' | 'ebay' | 'other';
    sourceUrl: string;
    supplierCost: number;
    profitMargin: number;
    inventoryCount: number;
    reorderLevel: number;
    shippingTime: string;
  };
}

export interface SizeGuide {
  type: 'clothing' | 'jewelry';
  measurements: {
    size: string;
    bust?: string;
    waist?: string;
    hips?: string;
    length?: string;
    diameter?: string;
    circumference?: string;
  }[];
  fitRecommendation?: string;
  modelStats?: {
    height: string;
    weight: string;
    size: string;
  };
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: string[]; // Product IDs
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image: string;
  active: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  quantity: number;
  selectedVariant?: string; // Variant ID
  selectedSize?: string;
  price?: number; // Cached price for calculations
  name?: string; // Cached name for display
  image?: string; // Cached image for display
  isBundle?: boolean;
  bundleId?: string;
}

export interface CartState {
  items: CartItem[];
  discountApplied: boolean;
  subtotal: number;
  discount: number;
  total: number;
}

export interface InteractionEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface EffectSettings {
  intensity: number; // 0-100
  scrollEffects: boolean;
  clickEffects: boolean;
  audioVisualization: boolean;
}

export interface ImageCropData {
  id: string;
  originalUrl: string;
  croppedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  cropArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'email';
  addresses: Address[];
  birthday?: Date;
  createdAt: Date;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'google_pay' | 'apple_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Conversion rate from USD
}
