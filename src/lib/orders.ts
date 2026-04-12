import { Order, OrderStatus, TrackingInfo, CARRIER_URLS, CarrierType } from "@/types/orders";
import { addPoints } from "./rewards";
import { calculatePointsForPurchase } from "./rewards";

const ORDERS_KEY = 'chaos_orders';

export const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>): Order => {
  const orderNumber = `CHAOS-${Date.now().toString(36).toUpperCase()}`;
  
  const order: Order = {
    ...orderData,
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderNumber,
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const orders = getOrders(orderData.userId);
  orders.unshift(order);
  localStorage.setItem(`${ORDERS_KEY}_${orderData.userId}`, JSON.stringify(orders));

  return order;
};

export const getOrders = (userId: string): Order[] => {
  const stored = localStorage.getItem(`${ORDERS_KEY}_${userId}`);
  if (!stored) return [];
  
  try {
    const orders = JSON.parse(stored);
    return orders.map((o: any) => ({
      ...o,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
      deliveredAt: o.deliveredAt ? new Date(o.deliveredAt) : undefined,
      tracking: o.tracking ? {
        ...o.tracking,
        estimatedDelivery: new Date(o.tracking.estimatedDelivery),
        updates: o.tracking.updates.map((u: any) => ({
          ...u,
          timestamp: new Date(u.timestamp)
        }))
      } : undefined
    }));
  } catch {
    return [];
  }
};

export const getOrder = (userId: string, orderId: string): Order | null => {
  const orders = getOrders(userId);
  return orders.find(o => o.id === orderId) || null;
};

export const updateOrderStatus = (userId: string, orderId: string, status: OrderStatus): void => {
  const orders = getOrders(userId);
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    order.status = status;
    order.updatedAt = new Date();

    // Award points when delivered
    if (status === 'delivered' && !order.pointsEarned) {
      const points = calculatePointsForPurchase(order.total);
      addPoints(userId, points, 'purchase', `Order ${order.orderNumber} delivered`, order.id);
      order.pointsAwarded = points;
      order.pointsEarned = true;
      order.deliveredAt = new Date();
    }

    localStorage.setItem(`${ORDERS_KEY}_${userId}`, JSON.stringify(orders));
  }
};

export const addTrackingInfo = (userId: string, orderId: string, tracking: TrackingInfo): void => {
  const orders = getOrders(userId);
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    order.tracking = tracking;
    order.status = 'shipped';
    order.updatedAt = new Date();
    localStorage.setItem(`${ORDERS_KEY}_${userId}`, JSON.stringify(orders));
  }
};

export const generateTrackingUrl = (carrier: CarrierType, trackingNumber: string): string => {
  return CARRIER_URLS[carrier](trackingNumber);
};

// Simulate order tracking updates
export const simulateOrderTracking = (userId: string, orderId: string): void => {
  const carriers: CarrierType[] = ['usps', 'fedex', 'dhl', 'ups'];
  const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
  const trackingNumber = `${randomCarrier.toUpperCase()}${Math.random().toString(36).substr(2, 12).toUpperCase()}`;

  const tracking: TrackingInfo = {
    carrier: randomCarrier,
    trackingNumber,
    trackingUrl: generateTrackingUrl(randomCarrier, trackingNumber),
    status: 'shipped',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    updates: [
      {
        timestamp: new Date(),
        location: 'Distribution Center, Los Angeles, CA',
        status: 'In Transit',
        description: 'Package has left the facility'
      },
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: 'Warehouse, Los Angeles, CA',
        status: 'Processed',
        description: 'Package has been processed at warehouse'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        location: 'Origin Facility',
        status: 'Picked Up',
        description: 'Package picked up by carrier'
      }
    ]
  };

  addTrackingInfo(userId, orderId, tracking);
};
