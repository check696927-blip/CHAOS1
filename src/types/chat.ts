export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
  orderReference?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  status: 'active' | 'closed';
  agentId?: string;
  agentName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutoResponse {
  keywords: string[];
  response: string;
  category: 'shipping' | 'returns' | 'sizing' | 'payment' | 'tracking';
}

export const AUTO_RESPONSES: AutoResponse[] = [
  {
    keywords: ['shipping', 'delivery', 'how long'],
    response: "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days. You can track your order anytime from the Orders page.",
    category: 'shipping'
  },
  {
    keywords: ['return', 'refund', 'exchange'],
    response: "We accept returns within 30 days of delivery. Items must be unworn with original tags. Start your return from your Orders page or contact us for assistance.",
    category: 'returns'
  },
  {
    keywords: ['size', 'sizing', 'fit', 'measurement'],
    response: "Check our Size Guide on each product page for detailed measurements. We recommend measuring yourself and comparing with our charts. Still unsure? Our team can help!",
    category: 'sizing'
  },
  {
    keywords: ['payment', 'card', 'paypal', 'pay'],
    response: "We accept all major credit cards, PayPal, and Google Pay. All transactions are secured with SSL encryption for your safety.",
    category: 'payment'
  },
  {
    keywords: ['track', 'tracking', 'where is my order'],
    response: "You can track your order in real-time! Visit the Orders page and click 'Track Package' to see live updates from USPS, FedEx, or DHL.",
    category: 'tracking'
  }
];
