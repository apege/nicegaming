"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Gamepad2,
  UserCheck,
  UserX,
  Loader2,
  Search,
  ArrowRight,
  QrCode,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types";
import { PAYMENT_METHODS, ADMIN_PHONE } from "@/constants";

interface OrderFormProps {
  selectedPackage: RobuxPackage;
  onOpenQrisModal: (invId: string, user: string, wa: string, rUser: RobloxUser | null) => void;
  onOpenSuccessModal: (invId: string, user: string, wa: string, rUser: RobloxUser | null) => void;
  adminWhatsapp?: string;
}

export default function OrderForm({
  selectedPackage,
  onOpenQrisModal,
  onOpenSuccessModal,
  adminWhatsapp,
}: OrderFormProps) {
  const [userId, setUserId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("website_qris");
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blacklistAlert, setBlacklistAlert] = useState<string | null>(null);

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
    setBlacklistAlert(null);

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

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlacklistAlert(null);

    if (!userId.trim()) {
      alert("Mohon masukkan User ID / Username Roblox Anda.");
      return;
    }
    if (!whatsapp.trim()) {
      alert("Mohon masukkan Nomor WhatsApp Anda untuk konfirmasi.");
      return;
    }

    if (paymentMethod === "website_qris") {
      // 1. For QRIS: Open QRIS modal first with generated invoice, order only saves to DB when customer clicks "Konfirmasi Sudah Bayar" & uploads proof!
      const orderCode = `#BLX${Math.floor(10000000 + Math.random() * 90000000)}`;
      onOpenQrisModal(orderCode, userId.trim(), whatsapp.trim(), robloxUser);
      setIsSubmitting(false);
      return;
    }

    // 2. For WhatsApp: Submit order directly
    setIsSubmitting(true);

    try {
      const orderCode = `#BLX${Math.floor(10000000 + Math.random() * 90000000)}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_code: orderCode,
          roblox_username: userId.trim(),
          customer_phone: whatsapp.trim(),
          robux: selectedPackage.robux,
          price: selectedPackage.price,
          payment_method: "WhatsApp",
          roblox_user_id: robloxUser?.id ? String(robloxUser.id) : undefined,
          customer_notes: robloxUser ? `Display Name: ${robloxUser.displayName}` : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isBlacklisted) {
          setBlacklistAlert(data.error || "Akun atau nomor WhatsApp Anda telah diblokir.");
        } else {
          alert(data.error || "Gagal membuat pesanan. Silakan coba lagi.");
        }
        setIsSubmitting(false);
        return;
      }

      // Reset form fields
      const submittedUserId = userId.trim();
      const submittedWhatsapp = whatsapp.trim();
      const submittedRobloxUser = robloxUser;

      setUserId("");
      setWhatsapp("");
      setRobloxUser(null);

      const displayNameTxt = submittedRobloxUser ? ` (${submittedRobloxUser.displayName})` : "";
      const message =
        `Halo Admin NiceGaming, saya ingin order Robux via WhatsApp:%0A%0A` +
        `🧾 Invoice: ${orderCode}%0A` +
        `🎮 Game: Roblox%0A` +
        `👤 Username / User ID: ${submittedUserId}${displayNameTxt}%0A` +
        `💎 Paket: ${selectedPackage.robux.toLocaleString("id-ID")} Robux%0A` +
        `💰 Total: ${selectedPackage.priceFormatted}%0A` +
        `📱 Nomor WA: ${submittedWhatsapp}%0A%0A` +
        `Mohon instruksi pembayarannya ya admin, terima kasih!`;

      const targetPhone = (adminWhatsapp || ADMIN_PHONE).replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;
      window.open(whatsappUrl, "_blank");
      onOpenSuccessModal(orderCode, submittedUserId, submittedWhatsapp, submittedRobloxUser);
    } catch (err) {
      console.error("Order submit error:", err);
      alert("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="form-order" className="glass-card-pink rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,27,122,0.25)] border-2 border-pink-500/40 scroll-mt-20">
      {/* Form Header with Angled Cyber Texture */}
      <div className="relative px-5 py-3 bg-gradient-to-r from-[#17193b] via-[#1b1e46] to-[#12142d] border-b border-pink-500/30 cyber-stripes flex items-center justify-between">
        <div className="flex items-center gap-2 z-10">
          <Gamepad2 size={18} className="text-[#00d2ff]" />
          <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            FORM ORDER
          </h3>
        </div>
        <span className="text-[9px] font-bold text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 z-10">
          INSTANT
        </span>
      </div>

      {/* Form Body */}
      <form onSubmit={handleOrderSubmit} className="p-4 sm:p-5 space-y-3">
        {/* Blacklist Warning Banner if blocked */}
        {blacklistAlert && (
          <div className="bg-rose-500/20 border border-rose-500/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-300 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black text-rose-400 uppercase tracking-wider text-[10px]">
                Akses Ditolak / Akun Terblokir
              </strong>
              <span>{blacklistAlert}</span>
            </div>
          </div>
        )}

        {/* Step 1: User ID / Username Roblox with API Check */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300">
              1. USERNAME ROBLOX
            </label>
            {robloxUser && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#00e676]">
                <UserCheck size={11} />
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
                if (blacklistAlert) setBlacklistAlert(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCheckRobloxUser();
                }
              }}
              placeholder="Masukkan Username Roblox"
              className="w-full bg-[#0a0c20] border border-pink-500/30 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-inner"
            />
            <button
              type="button"
              disabled={isCheckingUser || !userId.trim()}
              onClick={() => handleCheckRobloxUser()}
              className="absolute right-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff1b7a] to-[#d81159] text-[10px] font-bold uppercase tracking-wider text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-[0_0_8px_rgba(255,27,122,0.4)] cursor-pointer"
            >
              {isCheckingUser ? (
                <>
                  <Loader2 size={11} className="animate-spin" />
                  <span>Cek...</span>
                </>
              ) : (
                <>
                  <Search size={11} />
                  <span>Cek ID</span>
                </>
              )}
            </button>
          </div>

          {/* Roblox User Avatar Preview Card (Compact) */}
          {robloxUser && (
            <div className="bg-[#121535] border border-cyan-500/40 rounded-xl p-2 flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,210,255,0.2)] animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative w-8 h-8 rounded-full bg-[#090b1e] border border-[#00d2ff] shrink-0 overflow-hidden">
                {robloxUser.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={robloxUser.avatarUrl}
                    alt={robloxUser.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCheck size={16} className="m-auto text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {robloxUser.displayName}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  @{robloxUser.name} • <span className="text-cyan-400 font-mono">ID: {robloxUser.id}</span>
                </p>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#00e676]/15 text-[8px] font-extrabold text-[#00e676] uppercase tracking-wider">
                Valid
              </span>
            </div>
          )}

          {/* Error Alert */}
          {userError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-center gap-1.5 text-[10px] text-red-400 animate-in fade-in">
              <UserX size={13} className="shrink-0 text-red-400" />
              <span>{userError}</span>
            </div>
          )}
        </div>

        {/* Step 2: Nominal Robux (Compact Sync Display) */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300">
            2. NOMINAL ROBUX (TERPILIH)
          </label>
          <div className="w-full bg-[#0a0c20] border border-pink-500/30 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                <Image
                  src="/robux.webp"
                  alt="Robux"
                  width={22}
                  height={22}
                  className="object-contain drop-shadow-[0_0_6px_#00e676]"
                />
              </div>
              <span className="text-xs font-black text-white">
                {selectedPackage.robux.toLocaleString("id-ID")} Robux
              </span>
              {selectedPackage.isBestSeller && (
                <span className="px-1.5 py-0.2 rounded bg-[#ff1b7a] text-[8px] font-black uppercase text-white">
                  BEST
                </span>
              )}
            </div>
            <span className="text-xs font-black text-[#ff1b7a]">
              {selectedPackage.priceFormatted}
            </span>
          </div>
        </div>

        {/* Step 3: WhatsApp Number */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300">
            3. NOMOR WHATSAPP (KONFIRMASI)
          </label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full bg-[#0a0c20] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
        </div>

        {/* Step 4: Metode Pembayaran (Compact 2-Col Selector) */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300">
            4. METODE PEMBAYARAN
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isChosen = paymentMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`cursor-pointer rounded-xl p-2.5 border transition-all flex items-center gap-2 ${
                    isChosen
                      ? "bg-[#181a3d] border-[#ff1b7a] shadow-[0_0_12px_rgba(255,27,122,0.3)]"
                      : "bg-[#0a0c20] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isChosen
                        ? "bg-[#ff1b7a] text-white shadow-[0_0_8px_rgba(255,27,122,0.5)]"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {method.id === "website_qris" ? (
                      <QrCode size={15} className="shrink-0" />
                    ) : (
                      <MessageCircle size={15} className="shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white leading-tight truncate">
                      {method.name}
                    </p>
                    <p className="text-[9px] text-gray-400 leading-tight">
                      {method.badge}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary & Submit Button Combined */}
        <div className="pt-1.5 space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-gray-400 text-[11px]">Total Bayar:</span>
            <span className="font-black text-sm text-[#ff1b7a]">{selectedPackage.priceFormatted}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white neon-btn-pink flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,27,122,0.5)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Order...</span>
              </>
            ) : (
              <>
                <span>
                  {paymentMethod === "website_qris" ? "BAYAR SEKARANG (QRIS)" : "ORDER VIA WHATSAPP"}
                </span>
                <ArrowRight size={15} className="stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
