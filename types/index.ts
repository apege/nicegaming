export interface RobuxPackage {
  id: number;
  robux: number;
  price: number;
  priceFormatted: string;
  isBestSeller?: boolean;
}

export interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
  badge: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  avatarText: string;
  avatarGradient: string;
  comment: string;
  rating: number;
  adminReply?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
