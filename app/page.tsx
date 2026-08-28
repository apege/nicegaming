"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Award,
  Headphones,
  Gamepad2,
  CheckCircle2,
  ChevronDown,
  Star,
  MessageCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  QrCode,
  Wallet,
  ShoppingBag,
  ExternalLink,
  Loader2,
  UserCheck,
  UserX,
  Search,
} from "lucide-react";

// Clean Instagram Icon Component
const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface RobuxPackage {
  id: number;
  robux: number;
  price: number;
  priceFormatted: string;
  isBestSeller?: boolean;
}

interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string;
}

const ROBUX_PACKAGES: RobuxPackage[] = [
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

const PAYMENT_METHODS = [
  {
    id: "website_qris",
    name: "Via Website (QRIS)",
    desc: "Otomatis • BCA, DANA, GoPay, OVO",
    icon: QrCode,
    badge: "Instant",
  },
  {
    id: "whatsapp",
    name: "Via WhatsApp",
    desc: "Bayar & proses lewat chat WA admin",
    icon: MessageCircle,
    badge: "Chat Admin",
  },
];

export default function LandingPage() {
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(ROBUX_PACKAGES[2]); // Default 240 Robux (Best Seller)
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [userId, setUserId] = useState("");
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const [whatsapp, setWhatsapp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("website_qris");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

  const displayedPackages = showAllPackages ? ROBUX_PACKAGES : ROBUX_PACKAGES.slice(0, 6);

  // Check Roblox Username and Avatar via API
  const handleCheckRobloxUser = async (customName?: string) => {
    const target = (customName || userId).trim();
    if (!target) {
      setUserError("Masukkan username Roblox terlebih dahulu.");
      setRobloxUser(null);
      return;
    }

    setIsCheckingUser(true);
    setUserError(null);

    try {
      const res = await fetch(`/api/roblox-user?username=${encodeURIComponent(target)}`);
      const data = await res.json();

      if (data.success && data.user) {
        setRobloxUser(data.user);
        setUserError(null);
      } else {
        setRobloxUser(null);
        setUserError(data.message || "Username Roblox tidak ditemukan.");
      }
    } catch (err) {
      console.error("Fetch Roblox error:", err);
      setUserError("Gagal memeriksa akun. Silakan coba lagi.");
      setRobloxUser(null);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      alert("Mohon masukkan User ID / Username Roblox Anda.");
      return;
    }
    if (!whatsapp.trim()) {
      alert("Mohon masukkan Nomor WhatsApp Anda untuk konfirmasi.");
      return;
    }

    const generatedInv = `NG-${Math.floor(100000 + Math.random() * 900000)}`;
    setInvoiceId(generatedInv);

    if (paymentMethod === "website_qris") {
      setIsQrisModalOpen(true);
    } else {
      // Format WhatsApp message
      const adminPhone = "6281234567890"; // WhatsApp admin store
      const displayNameTxt = robloxUser ? ` (${robloxUser.displayName})` : "";
      const message = `Halo Admin NiceGaming, saya ingin order Robux via WhatsApp:%0A%0A` +
        `🧾 Invoice: ${generatedInv}%0A` +
        `🎮 Game: Roblox%0A` +
        `👤 Username / User ID: ${userId}${displayNameTxt}%0A` +
        `💎 Paket: ${selectedPackage.robux} Robux%0A` +
        `💰 Total: ${selectedPackage.priceFormatted}%0A` +
        `📱 Nomor WA: ${whatsapp}%0A%0A` +
        `Mohon nomor rekening / instruksi pembayarannya ya admin, terima kasih!`;

      const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
      window.open(whatsappUrl, "_blank");
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070714] text-white selection:bg-[#ff1b7a] selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows & Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0"></div>
      
      {/* Radial Glow Top Left (Pink) */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[#ff1b7a]/20 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      {/* Radial Glow Top Right (Cyan) */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-[#00d2ff]/15 rounded-full blur-[160px] pointer-events-none z-0"></div>
      
      {/* Radial Glow Mid (Purple/Pink) */}
      <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ff1b7a]/10 rounded-full blur-[180px] pointer-events-none z-0"></div>

      {/* ===================== NAVBAR ===================== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070714]/85 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="NiceGaming Logo"
                width={48}
                height={48}
                className="object-contain drop-shadow-[0_0_12px_rgba(255,27,122,0.6)] group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ff1b7a] font-['Orbitron',sans-serif]">
                NICE<span className="text-[#00d2ff]">GAMING</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest font-semibold uppercase -mt-1">
                Top Up Game Store
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="relative text-sm font-bold tracking-wider text-[#ff1b7a] transition-colors py-1 group"
            >
              BERANDA
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff1b7a] to-[#00d2ff] shadow-[0_0_8px_#ff1b7a]"></span>
            </a>
            <a
              href="#topup"
              className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white hover:text-shadow transition-colors py-1 hover:text-[#00d2ff]"
            >
              TOP UP
            </a>
            <a
              href="#cara-order"
              className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#ff1b7a]"
            >
              CARA ORDER
            </a>
            <a
              href="#testimoni"
              className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#00d2ff]"
            >
              TESTIMONI
            </a>
            <a
              href="#faq"
              className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#ff1b7a]"
            >
              FAQ
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0c20]/95 backdrop-blur-2xl border-b border-pink-500/20 px-6 py-5 space-y-4">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold text-[#ff1b7a]"
            >
              BERANDA
            </a>
            <a
              href="#topup"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-300 hover:text-[#00d2ff]"
            >
              TOP UP
            </a>
            <a
              href="#cara-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-300 hover:text-[#ff1b7a]"
            >
              CARA ORDER
            </a>
            <a
              href="#testimoni"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-300 hover:text-[#00d2ff]"
            >
              TESTIMONI
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-300 hover:text-[#ff1b7a]"
            >
              FAQ
            </a>
          </div>
        )}
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative z-10 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Hero Text & CTA) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-wide uppercase font-['Orbitron',sans-serif]">
                  <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    TOP UP GAME
                  </span>
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-wide uppercase">
                  <span className="text-[#ff1b7a] drop-shadow-[0_0_20px_rgba(255,27,122,0.8)]">
                    AMAN,{" "}
                  </span>
                  <span className="text-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.8)]">
                    CEPAT{" "}
                  </span>
                  <span className="text-white">&amp; TERPERCAYA</span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Top up game favoritmu dengan harga terbaik, proses cepat, dan aman 100% di{" "}
                <span className="text-white font-bold">NiceGaming</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#topup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase text-white neon-btn-pink"
                >
                  <span>TOP UP SEKARANG</span>
                  <ArrowRight size={16} className="stroke-[3]" />
                </a>
                <a
                  href="#topup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase text-gray-200 bg-[#12142d]/80 border border-white/15 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all duration-300"
                >
                  <span>LIHAT HARGA</span>
                  <ChevronDown size={16} />
                </a>
              </div>

              {/* Green Trust Features */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm font-semibold text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                  <span>Online 24 Jam</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                  <span>Proses Otomatis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                  <span>Legal &amp; Aman</span>
                </div>
              </div>
            </div>

            {/* Right Column (Hero 3D Mascot & Logo Visual) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                
                {/* Cybernetic Outer Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 animate-pulse-slow"></div>
                <div className="absolute inset-4 rounded-full border border-cyan-500/30"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/10 to-cyan-500/20 blur-xl"></div>
                
                {/* Glowing Aura */}
                <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#ff1b7a]/40 to-[#00d2ff]/40 blur-3xl"></div>

                {/* Main Logo Image */}
                <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center animate-float">
                  <Image
                    src="/logo.png"
                    alt="NiceGaming Mascot & Logo"
                    width={400}
                    height={400}
                    className="object-contain drop-shadow-[0_0_35px_rgba(255,27,122,0.85)] filter"
                    priority
                  />
                </div>

                {/* Decorative Cyber Badges around hero image */}
                <div className="absolute -bottom-3 left-4 bg-[#0d0f28]/90 backdrop-blur-md border border-cyan-500/40 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                  <Zap size={18} className="text-[#00d2ff]" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Kecepatan</p>
                    <p className="text-xs font-bold text-white">1-5 Menit Masuk</p>
                  </div>
                </div>

                <div className="absolute top-4 -right-2 bg-[#0d0f28]/90 backdrop-blur-md border border-pink-500/40 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,27,122,0.3)]">
                  <ShieldCheck size={18} className="text-[#ff1b7a]" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Keamanan</p>
                    <p className="text-xs font-bold text-white">100% Legal &amp; Anti Banned</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== UNIFIED FEATURE HIGHLIGHTS BAR ===================== */}
      <section className="relative z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b0d25]/85 backdrop-blur-xl border border-pink-500/25 rounded-2xl p-4 sm:p-6 shadow-[0_0_25px_rgba(255,27,122,0.12)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 lg:divide-x lg:divide-white/10">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-4 lg:px-4 first:pl-0">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                  <ShieldCheck size={22} className="text-[#ff1b7a]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    100% AMAN
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Transaksi aman &amp; terjamin
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4 lg:px-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                  <Zap size={22} className="text-[#ff1b7a]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    PROSES CEPAT
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Top up instan dalam hitungan menit
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4 lg:px-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                  <Award size={22} className="text-[#ff1b7a]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    HARGA TERBAIK
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Harga termurah &amp; bersaing
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4 lg:px-4 last:pr-0">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                  <Headphones size={22} className="text-[#ff1b7a]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    LAYANAN 24/7
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Admin siap bantu kapan saja
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN ORDER & SHOWCASE SECTION ===================== */}
      <section id="topup" className="relative z-10 py-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: TOP UP ROBUX CATALOG */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Section Title */}
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#ff1b7a] bg-pink-500/30"></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                    TOP UP ROBUX
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    Pilih paket Robux favoritmu
                  </p>
                </div>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {displayedPackages.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative group cursor-pointer rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center transition-all duration-300 ${
                        isSelected
                          ? "bg-[#141638] border-2 border-[#ff1b7a] shadow-[0_0_25px_rgba(255,27,122,0.45)] scale-[1.02]"
                          : "bg-[#0d0f28]/90 border border-pink-500/20 hover:border-pink-500/60 hover:bg-[#121434] hover:shadow-[0_0_15px_rgba(255,27,122,0.2)]"
                      }`}
                    >
                      {/* BEST SELLER Badge */}
                      {pkg.isBestSeller && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff1b7a] to-[#d81159] text-[10px] font-black tracking-wider uppercase text-white shadow-[0_0_12px_rgba(255,27,122,0.7)] z-10 whitespace-nowrap">
                          BEST SELLER
                        </div>
                      )}

                      {/* Package Header */}
                      <div className="space-y-0.5 pt-1">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          ROBUX
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {pkg.robux.toLocaleString()}
                        </div>
                      </div>

                      {/* Robux Coin Icon with Neon Glow */}
                      <div className="my-3 relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#00e676]/20 rounded-full blur-md"></div>
                        <Image
                          src="/robux.webp"
                          alt={`${pkg.robux} Robux`}
                          width={60}
                          height={60}
                          className="object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,230,118,0.7)] group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Price Pill Tag */}
                      <div
                        className={`w-full py-1.5 px-3 rounded-lg text-xs sm:text-sm font-extrabold tracking-wide transition-all ${
                          isSelected
                            ? "bg-[#ff1b7a] text-white shadow-[0_0_12px_rgba(255,27,122,0.6)]"
                            : "bg-[#ff1b7a]/85 text-white group-hover:bg-[#ff1b7a] group-hover:shadow-[0_0_10px_rgba(255,27,122,0.4)]"
                        }`}
                      >
                        {pkg.priceFormatted}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Packages Toggle Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllPackages(!showAllPackages)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#10122e] border border-white/10 hover:border-pink-500/50 text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-white transition-all shadow-md"
                >
                  <span>{showAllPackages ? "TAMPILKAN LEBIH SEDIKIT" : "LIHAT SEMUA PAKET"}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      showAllPackages ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Mini Section: Kenapa Pilih NiceGaming */}
              <div className="pt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#ff1b7a] bg-pink-500/30"></div>
                  <h4 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                    KENAPA PILIH NICEGAMING?
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
                      <ShieldCheck size={18} className="text-[#ff1b7a]" />
                    </div>
                    <p className="text-xs font-bold text-white">Garansi 100%</p>
                    <p className="text-[10px] text-gray-400">Legal &amp; Anti Banned</p>
                  </div>

                  <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
                      <Zap size={18} className="text-[#ff1b7a]" />
                    </div>
                    <p className="text-xs font-bold text-white">Proses Instan</p>
                    <p className="text-[10px] text-gray-400">Otomatis 1-5 Menit</p>
                  </div>

                  <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
                      <CreditCard size={18} className="text-[#ff1b7a]" />
                    </div>
                    <p className="text-xs font-bold text-white">Banyak Pilihan</p>
                    <p className="text-[10px] text-gray-400">QRIS, VA &amp; E-Wallet</p>
                  </div>

                  <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
                      <Sparkles size={18} className="text-[#ff1b7a]" />
                    </div>
                    <p className="text-xs font-bold text-white">Bonus &amp; Promo</p>
                    <p className="text-[10px] text-gray-400">Paling Bersaing</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FORM ORDER & TRUSTED BY PLAYERS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* FORM ORDER CARD */}
              <div className="glass-card-pink rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,27,122,0.25)] border-2 border-pink-500/40">
                {/* Form Header with Angled Cyber Texture */}
                <div className="relative px-6 py-4 bg-gradient-to-r from-[#17193b] via-[#1b1e46] to-[#12142d] border-b border-pink-500/30 cyber-stripes flex items-center justify-between">
                  <div className="flex items-center gap-2.5 z-10">
                    <Gamepad2 size={20} className="text-[#00d2ff]" />
                    <h3 className="text-base font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                      FORM ORDER
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 z-10">
                    INSTANT
                  </span>
                </div>

                {/* Form Body */}
                <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                  {/* Step 1: User ID / Username Roblox with API Check */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                        1. USERNAME / USER ID ROBLOX
                      </label>
                      {robloxUser && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00e676]">
                          <UserCheck size={12} />
                          <span>Terverifikasi</span>
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={userId}
                        onChange={(e) => {
                          setUserId(e.target.value);
                          if (robloxUser) setRobloxUser(null);
                          if (userError) setUserError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCheckRobloxUser();
                          }
                        }}
                        placeholder="Masukkan Username Roblox"
                        className="w-full bg-[#0a0c20] border border-pink-500/30 rounded-xl pl-4 pr-24 py-3 text-sm text-white placeholder-gray-500 font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-inner"
                      />
                      <button
                        type="button"
                        disabled={isCheckingUser || !userId.trim()}
                        onClick={() => handleCheckRobloxUser()}
                        className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff1b7a] to-[#d81159] text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,27,122,0.4)] cursor-pointer"
                      >
                        {isCheckingUser ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Cek...</span>
                          </>
                        ) : (
                          <>
                            <Search size={13} />
                            <span>Cek ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Roblox User Avatar Preview Card */}
                    {robloxUser && (
                      <div className="bg-[#121535] border border-cyan-500/40 rounded-xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(0,210,255,0.2)] animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Avatar 3D Headshot */}
                        <div className="relative w-12 h-12 rounded-full bg-[#090b1e] border-2 border-[#00d2ff] p-0.5 shrink-0 shadow-[0_0_12px_rgba(0,210,255,0.5)] overflow-hidden">
                          {robloxUser.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={robloxUser.avatarUrl}
                              alt={robloxUser.displayName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                              <UserCheck size={20} />
                            </div>
                          )}
                        </div>

                        {/* Player Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs sm:text-sm font-black text-white truncate">
                              {robloxUser.displayName}
                            </h5>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shrink-0"></span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate">
                            @{robloxUser.name} • <span className="text-cyan-400 font-mono text-[10px]">ID: {robloxUser.id}</span>
                          </p>
                        </div>

                        {/* Verified Pill */}
                        <div className="shrink-0">
                          <span className="px-2 py-1 rounded-md bg-[#00e676]/15 border border-[#00e676]/30 text-[9px] font-extrabold text-[#00e676] uppercase tracking-wider">
                            Akun Valid
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error Alert */}
                    {userError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
                        <UserX size={15} className="shrink-0 text-red-400" />
                        <span className="text-[11px]">{userError}</span>
                      </div>
                    )}

                    {!robloxUser && !userError && (
                      <p className="text-[10px] text-gray-400">
                        *Ketik username Roblox lalu klik <span className="text-pink-400 font-semibold">&quot;Cek ID&quot;</span> untuk memverifikasi avatar.
                      </p>
                    )}
                  </div>

                  {/* Step 2: Nominal Robux (Live Synced Display - No dropdown) */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                      2. NOMINAL ROBUX (TERPILIH)
                    </label>
                    <div className="w-full bg-[#0a0c20] border border-pink-500/40 rounded-xl p-3.5 flex items-center justify-between shadow-[0_0_15px_rgba(255,27,122,0.15)]">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center shrink-0">
                          <Image
                            src="/robux.webp"
                            alt="Robux"
                            width={26}
                            height={26}
                            className="object-contain drop-shadow-[0_0_6px_#00e676]"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">
                              {selectedPackage.robux} Robux
                            </span>
                            {selectedPackage.isBestSeller && (
                              <span className="px-2 py-0.5 rounded-full bg-[#ff1b7a] text-[9px] font-black uppercase text-white">
                                BEST SELLER
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#00d2ff]">
                            {selectedPackage.priceFormatted}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      *Pilih nominal lain dengan mengklik paket di katalog sebelah kiri.
                    </p>
                  </div>

                  {/* Step 3: WhatsApp Number */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                      3. NOMOR WHATSAPP (KONFIRMASI)
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full bg-[#0a0c20] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                    />
                  </div>

                  {/* Step 4: Metode Pembayaran (Website QRIS vs WhatsApp) */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                      4. METODE PEMBAYARAN
                    </label>
                    <div className="space-y-2.5">
                      {PAYMENT_METHODS.map((method) => {
                        const isChosen = paymentMethod === method.id;
                        const Icon = method.icon;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`cursor-pointer rounded-xl p-3.5 border transition-all flex items-center justify-between ${
                              isChosen
                                ? "bg-[#181a3d] border-[#ff1b7a] shadow-[0_0_15px_rgba(255,27,122,0.3)]"
                                : "bg-[#0a0c20] border-white/10 hover:border-white/20 hover:bg-[#0e1026]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                  isChosen
                                    ? "bg-[#ff1b7a] text-white shadow-[0_0_10px_rgba(255,27,122,0.5)]"
                                    : "bg-white/5 text-gray-400"
                                }`}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">
                                  {method.name}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {method.desc}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded whitespace-nowrap shrink-0 tracking-wide ${
                                isChosen
                                  ? "bg-[#ff1b7a]/20 text-pink-300 border border-pink-500/50 shadow-[0_0_8px_rgba(255,27,122,0.3)]"
                                  : "bg-white/5 text-gray-400 border border-white/5"
                              }`}
                            >
                              {method.badge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="pt-2">
                    <div className="bg-[#0a0c20] rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Pembayaran</p>
                        <p className="text-lg font-black text-[#ff1b7a]">{selectedPackage.priceFormatted}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Paket</p>
                        <p className="text-xs font-bold text-white">{selectedPackage.robux} Robux</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-black text-sm tracking-wider uppercase text-white neon-btn-pink flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,27,122,0.6)] cursor-pointer"
                  >
                    <span>
                      {paymentMethod === "website_qris" ? "BAYAR SEKARANG (QRIS)" : "ORDER VIA WHATSAPP"}
                    </span>
                    <ArrowRight size={18} className="stroke-[3]" />
                  </button>
                </form>
              </div>

              {/* TRUSTED BY PLAYERS CARD */}
              <div className="glass-card rounded-2xl p-5 border border-pink-500/30 flex items-center justify-between shadow-[0_0_20px_rgba(255,27,122,0.15)]">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 font-['Orbitron',sans-serif]">
                    TRUSTED BY PLAYERS
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-sm font-black text-white ml-1">4.9/5</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Dari <span className="text-white font-semibold">10.000+</span> transaksi berhasil
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-[#00d2ff]" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===================== CARA ORDER SECTION ===================== */}
      <section id="cara-order" className="relative z-10 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Panduan Pembelian
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              CARA ORDER DI <span className="text-[#ff1b7a]">NICEGAMING</span>
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Hanya butuh 4 langkah mudah untuk mendapatkan Robux impianmu dalam hitungan menit!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all">
              <div className="absolute top-4 right-4 text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] mb-4">
                <ShoppingBag size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">1. Pilih Nominal</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tentukan jumlah Robux yang ingin kamu beli dari katalog paket yang tersedia.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all">
              <div className="absolute top-4 right-4 text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d2ff] mb-4">
                <Gamepad2 size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">2. Masukkan ID</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Isi username / ID Roblox kamu dengan benar pada form pemesanan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all">
              <div className="absolute top-4 right-4 text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] mb-4">
                <CreditCard size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">3. Bayar</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Selesaikan pembayaran via QRIS, E-Wallet, atau Transfer Bank favoritmu.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all">
              <div className="absolute top-4 right-4 text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
                04
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center text-[#00e676] mb-4">
                <CheckCircle2 size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">4. Selesai!</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Robux akan otomatis masuk ke akun Roblox kamu dalam waktu 1-5 menit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONI SECTION ===================== */}
      <section id="testimoni" className="relative z-10 py-16 scroll-mt-24 bg-[#090b24]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Ulasan Pelanggan
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              APA KATA <span className="text-[#00d2ff]">MEREKA?</span>
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Ribuan gamers sudah mempercayakan kebutuhan top up Roblox mereka di NiceGaming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;Awalnya ragu karena baru pertama kali beli di sini, eh ternyata baru 2 menit robux langsung masuk ke akun! Mantap banget NiceGaming!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff1b7a] to-[#00d2ff] flex items-center justify-center font-bold text-sm text-white">
                  DA
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Dimas Aditya</h5>
                  <p className="text-[10px] text-gray-400">Order 800 Robux • Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;Harga termurah dibanding store lain, adminnya ramah pas ditanya cara setting di Roblox. Recommended buat yang cari robux legal!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#00e676] flex items-center justify-center font-bold text-sm text-white">
                  RN
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Rian Nugraha</h5>
                  <p className="text-[10px] text-gray-400">Order 1700 Robux • Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card rounded-2xl p-6 border border-pink-500/20 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;Udah langganan 5x di NiceGaming ga pernah ada kendala sama sekali. Bayar QRIS langsung otomatis beres. Top tier!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff1b7a] to-[#9c27b0] flex items-center justify-center font-bold text-sm text-white">
                  KS
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Kevin Sanjaya</h5>
                  <p className="text-[10px] text-gray-400">Order 240 Robux • Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ SECTION ===================== */}
      <section id="faq" className="relative z-10 py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Bantuan &amp; Tanya Jawab
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              FREQUENTLY ASKED <span className="text-[#ff1b7a]">QUESTIONS</span>
            </h3>
            <p className="text-sm text-gray-400">
              Pertanyaan yang sering diajukan seputar layanan NiceGaming.
            </p>
          </div>

          <div className="space-y-4">
            {[
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
            ].map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-[#0f1233] border-pink-500/50 shadow-[0_0_15px_rgba(255,27,122,0.15)]"
                      : "glass-card border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#ff1b7a] transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER SECTION ===================== */}
      <footer id="kontak" className="relative z-10 bg-[#04050d] border-t border-white/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            
            {/* Brand Information */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="NiceGaming Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
                <span className="font-extrabold text-xl tracking-wider text-white font-['Orbitron',sans-serif]">
                  NICE<span className="text-[#00d2ff]">GAMING</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Platform top up game tercepat, termurah, dan 100% terpercaya di Indonesia. Dapatkan pengalaman transaksi instan dengan garansi legal.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-[#ff1b7a] transition-all"
                  aria-label="Instagram NiceGaming"
                >
                  <InstagramIcon size={18} />
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#00e676]/50 hover:bg-[#00e676]/10 hover:text-[#00e676] transition-all"
                  aria-label="WhatsApp NiceGaming"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                NAVIGASI
              </h5>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#" className="hover:text-[#ff1b7a] transition-colors">Beranda</a></li>
                <li><a href="#topup" className="hover:text-[#ff1b7a] transition-colors">Top Up Robux</a></li>
                <li><a href="#cara-order" className="hover:text-[#ff1b7a] transition-colors">Cara Order</a></li>
                <li><a href="#testimoni" className="hover:text-[#ff1b7a] transition-colors">Testimoni Pelanggan</a></li>
                <li><a href="#faq" className="hover:text-[#ff1b7a] transition-colors">FAQ / Bantuan</a></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                HUBUNGI KAMI
              </h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Layanan Customer Support kami beroperasi 24 Jam nonstop setiap hari untuk membantu seluruh transaksi dan pertanyaan Anda.
              </p>
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
            <p>&copy; {new Date().getFullYear()} NiceGaming. All Rights Reserved.</p>
            <p className="text-gray-400">
              Roblox is a registered trademark of Roblox Corporation. NiceGaming is an independent service.
            </p>
          </div>
        </div>
      </footer>

      {/* ===================== FLOATING CS / WHATSAPP WIDGET ===================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Speech Bubble */}
        <div className="hidden sm:flex items-center bg-[#0d0f28]/95 backdrop-blur-md border border-pink-500/40 rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(255,27,122,0.3)] animate-float">
          <div className="text-left">
            <p className="text-[10px] font-bold text-[#ff1b7a] uppercase tracking-wider">Butuh Bantuan?</p>
            <p className="text-xs font-semibold text-white">Chat admin sekarang!</p>
          </div>
        </div>

        {/* Mascot Avatar Button */}
        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20NiceGaming,%20saya%20butuh%20bantuan."
          target="_blank"
          rel="noopener noreferrer"
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff1b7a] to-[#00d2ff] p-0.5 shadow-[0_0_25px_rgba(255,27,122,0.6)] hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer"
          aria-label="Chat WhatsApp Admin"
        >
          <div className="w-full h-full rounded-full bg-[#070714] flex items-center justify-center overflow-hidden p-1">
            <Image
              src="/logo.png"
              alt="CS Admin"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          {/* Active Status Ping */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00e676] border-2 border-[#070714]"></span>
        </a>
      </div>

      {/* ===================== QRIS WEBSITE PAYMENT MODAL ===================== */}
      {isQrisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card-pink rounded-3xl max-w-md w-full p-6 border-2 border-pink-500/50 shadow-[0_0_45px_rgba(255,27,122,0.4)] text-center space-y-4 animate-in fade-in zoom-in duration-300 relative">
            {/* Close button */}
            <button
              onClick={() => setIsQrisModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-2">
                <QrCode size={12} />
                <span>Pembayaran QRIS Website</span>
              </div>
              <h4 className="text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                SCAN QRIS UNTUK BAYAR
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Invoice: <span className="text-[#00d2ff] font-mono font-bold">{invoiceId}</span>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl max-w-[220px] mx-auto shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              {/* Simulated QR Code graphic with clean SVG */}
              <div className="relative aspect-square w-full bg-gray-900 rounded-xl p-3 flex flex-col items-center justify-between border border-gray-200">
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white"></div>
                  </div>
                  <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white"></div>
                  </div>
                </div>

                <div className="my-auto flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-lg bg-[#ff1b7a] flex items-center justify-center text-white font-black text-xs shadow-lg">
                    NG
                  </div>
                  <span className="text-[8px] font-extrabold text-white mt-1 uppercase tracking-widest">
                    QRIS RESMI
                  </span>
                </div>

                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white"></div>
                  </div>
                  <div className="w-8 h-8 border-4 border-white rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order & Payment Summary */}
            <div className="bg-[#0a0c20] rounded-xl p-3.5 border border-white/10 text-xs space-y-2 text-left">
              <div className="flex items-center justify-between text-gray-300">
                <span>Akun Roblox:</span>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  {robloxUser?.avatarUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={robloxUser.avatarUrl}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full border border-cyan-400 object-cover"
                    />
                  )}
                  <span>{robloxUser ? robloxUser.displayName : userId}</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Paket Item:</span>
                <span className="font-bold text-white">{selectedPackage.robux} Robux</span>
              </div>
              <div className="flex justify-between text-gray-300 border-t border-white/10 pt-1.5">
                <span className="font-bold text-white">Total Bayar:</span>
                <span className="font-black text-[#ff1b7a] text-sm">{selectedPackage.priceFormatted}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-snug">
              Buka aplikasi BCA, Mandiri, DANA, GoPay, OVO, atau ShopeePay lalu scan QRIS di atas.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const adminPhone = "6281234567890";
                  const message = `Halo Admin NiceGaming, saya sudah transfer via QRIS Website:%0A%0A` +
                    `🧾 Invoice: ${invoiceId}%0A` +
                    `👤 Username Roblox: ${userId}%0A` +
                    `💎 Paket: ${selectedPackage.robux} Robux%0A` +
                    `💰 Nominal: ${selectedPackage.priceFormatted}%0A` +
                    `📱 No WA: ${whatsapp}%0A%0A` +
                    `Berikut saya sertakan bukti transfernya, mohon diproses ya!`;
                  window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");
                  setIsQrisModalOpen(false);
                  setIsSuccessModalOpen(true);
                }}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#00e676] hover:bg-[#00c853] text-gray-900 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.4)] cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Konfirmasi Sudah Bayar</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQrisModalOpen(false)}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-gray-400 hover:text-white transition-colors"
              >
                Batalkan / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== WHATSAPP ORDER CONFIRMATION MODAL ===================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-pink rounded-3xl max-w-md w-full p-6 border-2 border-pink-500/40 shadow-[0_0_40px_rgba(255,27,122,0.4)] text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center mx-auto text-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.4)]">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              Pesanan Tercatat!
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Pesanan untuk <span className="text-white font-bold">{selectedPackage.robux} Robux</span> (User ID: <span className="text-[#00d2ff] font-bold">{userId}</span>) telah dibuat dengan Invoice <span className="text-[#ff1b7a] font-mono font-bold">{invoiceId}</span>.
            </p>
            <p className="text-[11px] text-gray-400">
              Admin NiceGaming akan segera memproses Robux masuk ke akun Anda dalam hitungan menit.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#ff1b7a] hover:bg-[#ff3388] transition-all shadow-[0_0_15px_rgba(255,27,122,0.4)] cursor-pointer"
              >
                Selesai &amp; Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
