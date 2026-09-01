"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";

interface OrderData {
  order_code: string;
  roblox_username: string;
  robux: number;
  price: number;
  already_reviewed: boolean;
  review?: {
    id: string;
    name: string;
    message: string;
    rating: number;
    created_at: string;
  };
}

const QUICK_TAGS = [
  "⚡ Pengiriman Kilat (1-5 Menit)",
  "💯 100% Aman & Legal",
  "💎 Harga Termurah",
  "👑 Admin Ramah & Fast Respon",
  "🌟 Sangat Terpercaya",
];

function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || searchParams.get("order") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [storeName, setStoreName] = useState("NiceGaming");

  useEffect(() => {
    async function loadStoreName() {
      try {
        const res = await fetch("/api/store-settings", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data?.store_name) {
          setStoreName(json.data.store_name);
        }
      } catch (e) {
        console.error("Error loading store settings:", e);
      }
    }
    loadStoreName();
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setErrorMsg(
        "Token atau kode pesanan tidak ditemukan di link ulasan. Silakan periksa kembali link yang dikirimkan oleh Admin."
      );
      return;
    }

    async function verifyToken() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(
          `/api/review?token=${encodeURIComponent(token)}&_t=${Date.now()}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!json.success) {
          setErrorMsg(json.error || "Token ulasan tidak valid atau pesanan belum selesai.");
        } else {
          setOrderData(json.data);
          if (json.data.already_reviewed) {
            setIsSuccess(true);
          }
        }
      } catch (err: any) {
        setErrorMsg("Gagal menghubungi server. Silakan muat ulang halaman.");
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token]);

  const handleAddTag = (tag: string) => {
    setMessage((prev) => {
      const clean = tag.replace(/^[^\w\s]+/, "").trim();
      if (prev.includes(clean)) return prev;
      return prev ? `${prev}, ${clean}` : clean;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          rating,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "Gagal mengirim ulasan.");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070714] text-white flex flex-col justify-between selection:bg-[#ff1b7a] selection:text-white relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed -top-40 -left-40 w-[550px] h-[550px] bg-[#ff1b7a]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-10 right-0 w-[600px] h-[600px] bg-[#00d2ff]/15 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-[#070714]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt={`${storeName} Logo`}
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_12px_rgba(255,27,122,0.6)] group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-wider text-white font-['Orbitron',sans-serif]">
              {storeName.toUpperCase()}
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Review Form Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          {/* Loading State */}
          {isLoading && (
            <div className="glass-card-pink rounded-3xl p-10 border border-pink-500/30 text-center space-y-4 shadow-[0_0_35px_rgba(255,27,122,0.2)]">
              <Loader2 className="w-10 h-10 text-[#ff1b7a] animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Memverifikasi Token Ulasan...
                </h3>
                <p className="text-xs text-gray-400">
                  Mohon tunggu sebentar selagi kami memeriksa status pesanan Anda.
                </p>
              </div>
            </div>
          )}

          {/* Error / Invalid Token State */}
          {!isLoading && errorMsg && (
            <div className="glass-card-pink rounded-3xl p-6 sm:p-8 border-2 border-rose-500/50 text-center space-y-5 shadow-[0_0_40px_rgba(244,63,94,0.25)] animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-rose-400 font-['Orbitron',sans-serif]">
                  Token Review Tidak Valid
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
                  {errorMsg}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Website Toko</span>
                </Link>
              </div>
            </div>
          )}

          {/* Success / Already Reviewed State */}
          {!isLoading && !errorMsg && isSuccess && (
            <div className="glass-card-pink rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 text-center space-y-5 shadow-[0_0_40px_rgba(0,230,118,0.25)] animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-[#00e676]/20 border border-[#00e676]/50 text-[#00e676] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,230,118,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[#00e676] text-[11px] font-black uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ulasan Resmi Terverifikasi</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
                  Terima Kasih Banyak!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
                  Ulasan dan penilaian bintang Anda untuk pesanan{" "}
                  <strong className="text-white">
                    {orderData?.order_code || token}
                  </strong>{" "}
                  telah berhasil tercatat dan tampil di halaman testimoni{" "}
                  <span className="text-[#00d2ff] font-bold">{storeName}</span>.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/#testimoni"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-[0_0_25px_rgba(0,230,118,0.5)] text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                >
                  <span>Lihat Ulasan di Website</span>
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Valid Form State */}
          {!isLoading && !errorMsg && !isSuccess && orderData && (
            <div className="glass-card-pink rounded-3xl p-6 sm:p-8 border border-pink-500/40 shadow-[0_0_40px_rgba(255,27,122,0.2)] space-y-6 animate-scaleUp">
              {/* Form Title */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-[#ff1b7a] text-[11px] font-black uppercase shadow-[0_0_10px_rgba(255,27,122,0.3)]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Verified Buyer Review</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-['Orbitron',sans-serif]">
                  Beri Ulasan Pesanan
                </h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Bagikan pengalaman belanja Robux kamu di {storeName} untuk membantu gamers lainnya!
                </p>
              </div>

              {/* Order Info Badge */}
              <div className="p-4 rounded-2xl bg-[#090c24] border border-pink-500/25 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>@{orderData.roblox_username}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        ({orderData.order_code})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#00d2ff] font-extrabold mt-0.5">
                      {orderData.robux.toLocaleString("id-ID")} Robux • Rp{" "}
                      {orderData.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#00e676] border border-emerald-500/40 uppercase">
                  Selesai ✓
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Star Rating Picker */}
                <div className="space-y-2 text-center">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                    1. Berikan Rating Bintang
                  </label>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                              active
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                                : "text-gray-600 hover:text-gray-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs font-black text-amber-300">
                    {rating === 5 && "⭐ Luar Biasa! Sangat Puas"}
                    {rating === 4 && "⭐ Puas & Cepat"}
                    {rating === 3 && "⭐ Cukup Baik"}
                    {rating === 2 && "⭐ Kurang Puas"}
                    {rating === 1 && "⭐ Sangat Kecewa"}
                  </p>
                </div>

                {/* 2. Quick Tags */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400">
                    Pilihan Cepat (Klik untuk menambahkan):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAGS.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-[10px] font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Review Message Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                    2. Ulasan Pengalaman Kamu
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contoh: Prosesnya cepet banget ga sampe 3 menit Robux udah masuk ke akun Roblox! Adminnya juga fast respon dan terpercaya banget. Bakal langganan disini 🔥"
                    className="w-full p-4 rounded-2xl bg-[#090c24] border border-white/15 focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-hidden transition-all shadow-inner resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_25px_rgba(255,27,122,0.65)] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Ulasan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Ulasan Terverifikasi</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-6 border-t border-white/10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {storeName} • 100% Verified Customer Reviews
      </footer>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070714] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 text-[#ff1b7a] animate-spin" />
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
