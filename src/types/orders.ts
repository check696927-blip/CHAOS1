export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type CarrierType = 'usps' | 'fedex' | 'dhl' | 'ups';

export interface TrackingInfo {
  carrier: CarrierType;
  trackingNumber: string;
  trackingUrl: string;
  status: OrderStatus;
  estimatedDelivery: Date;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  timestamp: Date;
  location: string;
  status: string;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string;
    size?: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  tracking?: TrackingInfo;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'google_pay';
    last4?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  pointsAwarded?: number;
  pointsEarned?: boolean;
}

export const CARRIER_URLS: Record<CarrierType, (trackingNumber: string) => string> = {
  usps: (num) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`,
  fedex: (num) => `https://www.fedex.com/fedextrack/?trknbr=${num}`,
  dhl: (num) => `https://www.dhl.com/en/express/tracking.html?AWB=${num}`,
  ups: (num) => `https://www.ups.com/track?tracknum=${num}`
};
