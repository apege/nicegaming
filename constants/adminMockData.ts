import {
  AdminOrder,
  AdminPricelistItem,
  AdminCustomer,
  AdminTestimonial,
  AdminStoreSettings,
} from "@/types/admin";

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [];

export const INITIAL_ADMIN_PRICELIST: AdminPricelistItem[] = [];

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [];

export const INITIAL_ADMIN_TESTIMONIALS: AdminTestimonial[] = [];

export const INITIAL_ADMIN_SETTINGS: AdminStoreSettings = {
  storeName: "NiceGaming",
  storeStatus: "open",
  adminWhatsapp: "6282343927560",
  minTopup: 80,
  maxTopup: 50000,
  ratePer1k: 20000,
  noticeBanner: "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
  qrisActive: true,
  whatsappOrderActive: true,
};
