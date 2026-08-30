import { RobuxPackage, PaymentMethod, TestimonialItem, FaqItem } from "@/types";

export const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: 1, robux: 80, price: 35000, priceFormatted: "Rp 35.000" },
  { id: 2, robux: 160, price: 65000, priceFormatted: "Rp 65.000" },
  { id: 3, robux: 240, price: 95000, priceFormatted: "Rp 95.000", isBestSeller: true },
  { id: 4, robux: 400, price: 145000, priceFormatted: "Rp 145.000" },
  { id: 5, robux: 800, price: 275000, priceFormatted: "Rp 275.000" },
  { id: 6, robux: 1700, price: 550000, priceFormatted: "Rp 550.000" },
  { id: 7, robux: 2000, price: 640000, priceFormatted: "Rp 640.000" },
  { id: 8, robux: 4500, price: 1420000, priceFormatted: "Rp 1.420.000" },
  { id: 9, robux: 10000, price: 3100000, priceFormatted: "Rp 3.100.000" },
];

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

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Dimas Aditya",
    role: "Order 800 Robux • Verified Buyer",
    avatarText: "DA",
    avatarGradient: "from-[#ff1b7a] to-[#00d2ff]",
    comment: "Awalnya ragu karena baru pertama kali beli di sini, eh ternyata baru 2 menit robux langsung masuk ke akun! Mantap banget NiceGaming!",
    rating: 5,
    adminReply: "Terima kasih banyak atas kepercayaannya kak Dimas! Selamat bermain dan enjoy Robux-nya ya! 🔥",
  },
  {
    name: "Rian Nugraha",
    role: "Order 1700 Robux • Verified Buyer",
    avatarText: "RN",
    avatarGradient: "from-[#00d2ff] to-[#00e676]",
    comment: "Harga termurah dibanding store lain, adminnya ramah pas ditanya cara setting di Roblox. Recommended buat yang cari robux legal!",
    rating: 5,
    adminReply: "Sama-sama kak Rian! Senang bisa bantu pandu sampai Robux-nya masuk sukses. Ditunggu orderan berikutnya! 🙏",
  },
  {
    name: "Kevin Sanjaya",
    role: "Order 240 Robux • Verified Buyer",
    avatarText: "KS",
    avatarGradient: "from-[#ff1b7a] to-[#9c27b0]",
    comment: "Udah langganan 5x di NiceGaming ga pernah ada kendala sama sekali. Bayar QRIS langsung otomatis beres. Top tier!",
    rating: 5,
    adminReply: "Terima kasih sudah jadi langganan setia NiceGaming kak Kevin! Pelayanan kilat dan aman selalu jadi prioritas kami 💎",
  },
];

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

export const ADMIN_PHONE = "6281234567890";
