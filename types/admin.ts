export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentSource = 'WEBSITE' | 'WHATSAPP';

export interface AdminOrder {
  id: string;
  orderNumber: string; // e.g. #BLX25027218
  robloxUsername: string;
  robloxUserId?: string;
  robloxAvatarUrl?: string;
  robuxAmount: number;
  price: number;
  status: OrderStatus;
  statusLabel: string;
  paymentSource: PaymentSource;
  createdAt: string;
  hasProofPhoto: boolean;
  proofPhotoUrl?: string;
  whatsappNumber: string;
  gamepassName?: string;
  gamepassPrice?: number;
  gamepassLink?: string;
  notes?: string;
}

export interface AdminPricelistItem {
  id: number;
  robux: number;
  price: number;
  isActive: boolean;
  badge?: 'PROMO' | 'SULTAN' | 'BEST SELLER' | 'POPULAR' | null;
}

export interface AdminCustomer {
  id: string;
  username: string;
  robloxId: string;
  whatsapp: string;
  totalOrders: number;
  totalSpent: number;
  isBlacklisted: boolean;
  blacklistReason?: string;
  lastOrderAt: string;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  avatarGradient: string;
  comment: string;
  rating: number;
  robuxBought: number;
  date: string;
  isActive: boolean;
  adminReply?: string;
  adminReplyDate?: string;
}

export interface AdminStoreSettings {
  storeName: string;
  storeStatus: 'open' | 'closed' | 'maintenance';
  adminWhatsapp: string;
  minTopup: number;
  maxTopup: number;
  ratePer1k: number;
  noticeBanner: string;
  qrisActive: boolean;
  whatsappOrderActive: boolean;
}
