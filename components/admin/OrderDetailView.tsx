"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Receipt,
  User,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  MessageSquareHeart,
} from "lucide-react";
import { AdminOrder, OrderStatus } from "@/types/admin";
import { AdminTab } from "./AdminSidebar";

interface OrderDetailViewProps {
  order: AdminOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  previousTabLabel?: string;
  storeName?: string;
}

export default function OrderDetailView({
  order,
  onBack,
  onUpdateStatus,
  previousTabLabel = "Order Masuk",
  storeName = "NiceGaming",
}: OrderDetailViewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(order.notes || "");
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickStatus = (status: OrderStatus) => {
    onUpdateStatus(order.id, status, adminNotes);
  };

  const handleSaveNotes = () => {
    onUpdateStatus(order.id, order.status, adminNotes);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2500);
  };

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            Menunggu Pembayaran
          </span>
        );
      case "processing":
        return (
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-cyan-500/15 border border-cyan-500/40 text-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.25)]">
            Sedang Diproses
          </span>
        );
      case "completed":
        return (
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/15 border border-emerald-500/40 text-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.25)]">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
            Dibatalkan
          </span>
        );
    }
  };

  const cleanPhone = order.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* 1. Back Navigation Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#ff1b7a]" />
        <span>Kembali ke {previousTabLabel}</span>
      </button>

      {/* 2. Order Header Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            ORDER <span className="text-[#ff1b7a]">{order.orderNumber}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
            {order.createdAt}
          </p>
        </div>

        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* 3. Quick Status Bar matching Screenshot 1 */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400 shrink-0">
          UBAH STATUS CEPAT:
        </span>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Proses Pesanan */}
          <button
            type="button"
            onClick={() => handleQuickStatus("processing")}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              order.status === "processing"
                ? "bg-[#00d2ff] text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.6)]"
                : "bg-cyan-500/15 border border-cyan-500/40 text-[#00d2ff] hover:bg-cyan-500/25"
            }`}
          >
            Proses Pesanan
          </button>

          {/* Selesaikan Order */}
          <button
            type="button"
            onClick={() => handleQuickStatus("completed")}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              order.status === "completed"
                ? "bg-[#00e676] text-slate-950 shadow-[0_0_15px_rgba(0,230,118,0.6)]"
                : "bg-emerald-500/15 border border-emerald-500/40 text-[#00e676] hover:bg-emerald-500/25"
            }`}
          >
            Selesaikan Order
          </button>

          {/* Batalkan */}
          <button
            type="button"
            onClick={() => handleQuickStatus("cancelled")}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              order.status === "cancelled"
                ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                : "bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25"
            }`}
          >
            Batalkan
          </button>

          {/* Kirim Link Review jika Order Selesai */}
          {order.status === "completed" && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Halo kak @${order.robloxUsername}! Pesanan Robux kamu dengan ID *${order.orderNumber}* (${order.robuxAmount.toLocaleString("id-ID")} Robux) telah selesai diproses ✅.\n\nBerikut link khusus untuk memberikan ulasan & rating bintang 5 kamu (1 token ulasan resmi):\n${typeof window !== "undefined" ? window.location.origin : ""}/review?token=${order.orderNumber.replace(/^#/, "")}\n\nTerima kasih banyak sudah mempercayakan top up di ${storeName}! 🙏✨`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[#00e676] hover:bg-[#00e676] hover:text-slate-950 font-black text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(0,230,118,0.3)]"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Kirim Link Review</span>
            </a>
          )}

          {/* Chat Pelanggan WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Halo @${order.robloxUsername}, pesanan Robux kamu dengan ID ${order.orderNumber} sedang kami tangani dari ${storeName}!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00e676]/15 border border-[#00e676]/40 text-[#00e676] hover:bg-[#00e676] hover:text-slate-950 font-black text-xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Pelanggan</span>
          </a>
        </div>
      </div>

      {/* 4. Detail Pesanan Card matching Screenshot 1 */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xs space-y-6">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wider">
            DETAIL PESANAN
          </h3>
        </div>

        {/* Product & Price Header */}
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
          <span>PRODUK</span>
          <span>HARGA</span>
        </div>

        {/* Product Row */}
        <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#141838] border border-amber-500/40 flex items-center justify-center shrink-0 p-2 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={32}
                height={32}
                className="object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
              />
            </div>
            <div>
              <div className="text-base font-black text-white">
                {order.robuxAmount.toLocaleString("id-ID")} Robux
              </div>
              <div className="text-xs text-gray-400 font-medium">
                Top Up Instan via Gamepass
              </div>
            </div>
          </div>

          <div className="text-base font-black text-white font-sans">
            {formatRupiah(order.price)}
          </div>
        </div>

        {/* Payment Method Row */}
        <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
          <span className="text-sm font-bold text-gray-300">
            Metode Pembayaran
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500/20 text-[#ff1b7a] border border-pink-500/40">
            {order.paymentSource}
          </span>
        </div>

        {/* Total Pembayaran */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-black uppercase tracking-wider text-[#ff1b7a]">
            TOTAL PEMBAYARAN
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#ff1b7a] font-sans">
            {formatRupiah(order.price)}
          </span>
        </div>

        {/* Bukti Pembayaran / Transfer Box */}
        {order.proofPhotoUrl ? (
          <div className="p-4 rounded-2xl bg-[#070918] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-[#00e676]">
                <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
                <span>Bukti Transfer Pembeli Terlampir</span>
              </div>
              <a
                href={order.proofPhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#00d2ff] hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Ukuran Penuh</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 max-w-xs mx-auto bg-black group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.proofPhotoUrl}
                alt="Bukti Transfer Pembeli"
                className="w-full h-48 object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={() => window.open(order.proofPhotoUrl, "_blank")}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#070918] border border-white/[0.06] text-center text-xs text-gray-400 italic">
            {order.hasProofPhoto
              ? "Foto bukti transfer telah terverifikasi oleh sistem."
              : "Foto bukti transfer belum diunggah atau transaksi via WhatsApp."}
          </div>
        )}
      </div>

      {/* 5. Informasi Pelanggan Card matching Screenshot 2 */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xs space-y-5">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wider">
            INFORMASI PELANGGAN
          </h3>
        </div>

        {/* Username */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <span className="text-sm font-bold text-gray-400">Username</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-[#ff1b7a]">
              @{order.robloxUsername}
            </span>
            <a
              href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(
                order.robloxUsername
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg text-gray-400 hover:text-[#00d2ff] hover:bg-white/5 transition-colors"
              title="Cek Profil Roblox"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => handleCopy(order.robloxUsername, "user")}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Salin Username"
            >
              {copiedField === "user" ? (
                <Check className="w-4 h-4 text-[#00e676]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* User ID Roblox */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <span className="text-sm font-bold text-gray-400">User ID Roblox</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white font-mono">
              {order.robloxUserId || "10507422380"}
            </span>
            <button
              type="button"
              onClick={() =>
                handleCopy(order.robloxUserId || "10507422380", "uid")
              }
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Salin User ID"
            >
              {copiedField === "uid" ? (
                <Check className="w-4 h-4 text-[#00e676]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* No. WhatsApp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <span className="text-sm font-bold text-gray-400">No. WhatsApp</span>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e676]/15 border border-[#00e676]/40 text-[#00e676] text-xs font-black hover:bg-[#00e676]/25 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>+{cleanPhone}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy(`+${cleanPhone}`, "wa")}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Salin No WhatsApp"
            >
              {copiedField === "wa" ? (
                <Check className="w-4 h-4 text-[#00e676]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Catatan Pelanggan */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-1">
          <span className="text-sm font-bold text-gray-400 shrink-0">
            Catatan Pelanggan
          </span>
          <span className="text-xs text-gray-300 font-medium text-left sm:text-right max-w-md">
            {order.notes ||
              `Smg cepat masuk robux nya aku sudah beli min username : ${order.robloxUsername}`}
          </span>
        </div>
      </div>

      {/* 6. Catatan Admin Card matching Screenshot 2 */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wider">
            CATATAN ADMIN
          </h3>
        </div>

        {/* Textarea */}
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          placeholder="Tulis catatan untuk order ini (hanya admin)..."
          className="w-full p-4 text-xs sm:text-sm bg-[#070918] border border-white/[0.08] rounded-2xl focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 text-white placeholder:text-gray-400"
        />

        {/* Submit Note Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveNotes}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_20px_rgba(255,27,122,0.6)] text-white font-black text-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Catatan</span>
          </button>

          {isSavedNotes && (
            <span className="text-xs font-bold text-[#00e676] animate-fadeIn">
              ✓ Catatan berhasil disimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
