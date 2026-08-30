"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  User,
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Save,
} from "lucide-react";
import { AdminOrder, OrderStatus } from "@/types/admin";

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || "pending"
  );
  const [notes, setNotes] = useState(order?.notes || "");

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setNotes(order.notes || "");
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    onUpdateStatus(order.id, selectedStatus, notes);
    onClose();
  };

  const grossGamepassPrice = Math.round(order.robuxAmount / 0.7);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0b0d24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-pink-500/30 overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-pink-500/20 bg-[#0e102d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141838] border border-amber-500/40 flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={28}
                height={28}
                className="object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  Detail Pesanan {order.orderNumber}
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Dibuat pada: {order.createdAt} • Via {order.paymentSource}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Changer Bar */}
          <div className="p-4 rounded-2xl bg-[#070818] border border-pink-500/20">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
              Ubah Status Transaksi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus("pending")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  selectedStatus === "pending"
                    ? "bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    : "bg-[#0c0e24] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Menunggu</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("processing")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  selectedStatus === "processing"
                    ? "bg-cyan-500/25 border-[#00d2ff] text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                    : "bg-[#0c0e24] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Diproses</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("completed")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  selectedStatus === "completed"
                    ? "bg-emerald-500/25 border-[#00e676] text-[#00e676] shadow-[0_0_10px_rgba(0,230,118,0.3)]"
                    : "bg-[#0c0e24] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selesai</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("cancelled")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  selectedStatus === "cancelled"
                    ? "bg-rose-500/25 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                    : "bg-[#0c0e24] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

          {/* Customer & Roblox Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roblox Target */}
            <div className="p-4 rounded-2xl bg-[#070818] border border-pink-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Target Akun Roblox
                </span>
                <a
                  href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(
                    order.robloxUsername
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#00d2ff] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Cek Profil</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-black text-white">
                    @{order.robloxUsername}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {order.robloxUserId || "Terkonfirmasi otomatis"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(order.robloxUsername, "username")}
                className="w-full py-1.5 px-3 rounded-xl bg-[#0e102d] border border-pink-500/30 text-xs font-bold text-gray-200 hover:text-white hover:bg-pink-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedField === "username" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00e676]" />
                    <span>Username Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Username</span>
                  </>
                )}
              </button>
            </div>

            {/* Buyer Contact */}
            <div className="p-4 rounded-2xl bg-[#070818] border border-pink-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Kontak Pembeli
                </span>
                <span className="text-xs font-bold text-[#00e676]">
                  Aktif
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#00e676] font-bold">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-black text-white">
                    +{order.whatsappNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    Channel: {order.paymentSource}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Halo @${order.robloxUsername}, pesanan Robux kamu dengan ID ${order.orderNumber} sedang kami tangani dari NiceGaming Store!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 rounded-xl bg-[#00e676] text-slate-950 text-xs font-black hover:bg-[#00c862] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WhatsApp Pembeli</span>
              </a>
            </div>
          </div>

          {/* Gamepass Setting & Price Calculation */}
          <div className="p-4 rounded-2xl bg-[#070818] border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Kalkulasi Gamepass (Pajak Roblox 30% Tercover)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0e102d] p-3 rounded-xl border border-pink-500/20">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">
                  Robux Bersih (Buyer)
                </span>
                <span className="text-base font-black text-[#ff1b7a]">
                  {order.robuxAmount.toLocaleString("id-ID")} R$
                </span>
              </div>

              <div className="bg-[#0e102d] p-3 rounded-xl border border-pink-500/20">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">
                  Harga Gamepass Disetting
                </span>
                <span className="text-base font-black text-amber-400">
                  {grossGamepassPrice.toLocaleString("id-ID")} R$
                </span>
              </div>

              <div className="bg-[#0e102d] p-3 rounded-xl border border-pink-500/20">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">
                  Total Bayar (Rupiah)
                </span>
                <span className="text-base font-black text-white">
                  {formatRupiah(order.price)}
                </span>
              </div>
            </div>

            {order.gamepassLink && (
              <a
                href={order.gamepassLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-pink-500/15 border border-pink-500/30 text-xs font-bold text-[#ff1b7a] hover:bg-pink-500/25 flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Link Gamepass Roblox Pembeli</span>
              </a>
            )}
          </div>

          {/* Admin Internal Notes */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
              Catatan Admin (Internal)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sudah dikirim via gamepass oleh admin, proses verifikasi selesai..."
              rows={3}
              className="w-full p-3.5 text-xs bg-[#070818] border border-pink-500/20 rounded-2xl focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-pink-500/20 bg-[#0e102d] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1b7a] to-[#d81159] hover:shadow-[0_0_15px_rgba(255,27,122,0.6)] text-white text-xs font-black transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
