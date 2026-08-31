import { RobuxPackage, PaymentMethod, TestimonialItem, FaqItem } from "@/types";

export const ROBUX_PACKAGES: RobuxPackage[] = [];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "website_qris",
    name: "Via Website (QRIS)",
    desc: "Otomatis • BCA, DANA, GoPay, OVO",
    badge: "Instant",
  },
  {
    id: "whatsapp",
    name: "Via WhatsApp",
    desc: "Bayar & proses lewat chat WA admin",
    badge: "Chat Admin",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Berapa lama waktu yang dibutuhkan untuk proses top up?",
    a: "Proses pengiriman Robux rata-rata hanya memakan waktu 1 hingga 5 menit setelah pembayaran Anda terverifikasi oleh sistem secara otomatis.",
  },
  {
    q: "Apakah top up Robux di NiceGaming aman dan legal?",
    a: "100% aman dan legal! Semua transaksi menggunakan metode resmi sehingga akun Roblox Anda dijamin aman dari risiko banned atau suspended.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima pembayaran melalui QRIS (bisa dari BCA, Mandiri, BRI, BNI, CIMB, GoPay, OVO, DANA, ShopeePay, LinkAja) serta Virtual Account.",
  },
  {
    q: "Apakah perlu memberikan password akun Roblox?",
    a: "TIDAK. Kami HANYA membutuhkan Username / User ID Roblox Anda. Kami tidak akan pernah meminta password demi menjaga privasi & keamanan akun Anda.",
  },
  {
    q: "Bagaimana jika ada kendala saat pemesanan?",
    a: "Tim Customer Service NiceGaming siap membantu Anda 24/7. Anda dapat langsung menekan tombol chat WhatsApp admin di pojok kanan bawah.",
  },
];

export const ADMIN_PHONE = "6282343927560";
