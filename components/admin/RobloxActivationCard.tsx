"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Lock,
  Lightbulb,
  Zap,
  Pencil,
  CheckCircle2,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { AdminOrder } from "@/types/admin";

interface RobloxActivationCardProps {
  orders?: AdminOrder[];
  initialUsername?: string;
  initialFee?: number;
  onActivateSuccess?: (username: string, fee: number, orderId?: string) => void;
  onProcessOrder?: (order: AdminOrder) => void;
}

export default function RobloxActivationCard({
  orders = [],
  initialUsername = "saprii09",
  initialFee = 97000,
  onActivateSuccess,
  onProcessOrder,
}: RobloxActivationCardProps) {
  // Pending orders
  const pendingOrders = orders.filter((o) => o.status === "pending");

  // Track activated usernames
  const [activatedUsernames, setActivatedUsernames] = useState<Set<string>>(
    new Set()
  );

  // Selected target username & fee
  const [username, setUsername] = useState(initialUsername);
  const [fee, setFee] = useState(initialFee);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();

  // Modals state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [tempUsername, setTempUsername] = useState(username);
  const [tempFee, setTempFee] = useState(fee.toLocaleString("id-ID"));

  // 1. [Card Mendeteksi Username Roblox Otomatis dari Pesanan Customer Masuk]
  useEffect(() => {
    if (pendingOrders.length > 0) {
      // Find the first pending order not yet activated
      const pendingUnactivated = pendingOrders.find(
        (o) => !activatedUsernames.has(o.robloxUsername.toLowerCase())
      );
      if (pendingUnactivated) {
        setUsername(pendingUnactivated.robloxUsername);
        setSelectedOrderId(pendingUnactivated.id);
        setTempUsername(pendingUnactivated.robloxUsername);
      } else {
        setUsername(pendingOrders[0].robloxUsername);
        setSelectedOrderId(pendingOrders[0].id);
        setTempUsername(pendingOrders[0].robloxUsername);
      }
    }
  }, [orders, activatedUsernames]);

  const currentOrder = orders.find(
    (o) =>
      o.id === selectedOrderId ||
      o.robloxUsername.toLowerCase() === username.toLowerCase()
  );

  const isActivated = activatedUsernames.has(username.toLowerCase());

  // 3. [Admin Klik "Aktifkan ID @username Sekarang"] -> Buka Modal Konfirmasi
  const handleOpenConfirm = () => {
    setIsConfirmModalOpen(true);
  };

  // 5. [Admin Klik "Konfirmasi Aktivasi"] -> Status Berubah Menjadi Hijau "AKTIF ✓"
  const handleConfirmActivation = () => {
    setActivatedUsernames((prev) => {
      const next = new Set(prev);
      next.add(username.toLowerCase());
      return next;
    });
    setIsConfirmModalOpen(false);

    if (onActivateSuccess) {
      onActivateSuccess(username, fee, selectedOrderId);
    }
  };

  const handleOpenEdit = () => {
    setTempUsername(username);
    setTempFee(fee.toLocaleString("id-ID"));
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = tempUsername.replace(/^@/, "").trim() || "saprii09";
    const cleanFee = parseInt(tempFee.replace(/\D/g, ""), 10) || 97000;
    setUsername(cleanUser);
    setFee(cleanFee);
    setEditModalOpen(false);
  };

  const handleSelectPendingOrder = (order: AdminOrder) => {
    setUsername(order.robloxUsername);
    setSelectedOrderId(order.id);
    setTempUsername(order.robloxUsername);
    setEditModalOpen(false);
  };

  return (
    <>
      <div
        className={`backdrop-blur-xl rounded-3xl p-6 sm:p-7 border shadow-xl relative overflow-hidden transition-all duration-500 ${
          isActivated
            ? "bg-[#081b16]/95 border-emerald-500/50 shadow-[0_0_35px_rgba(0,230,118,0.2)]"
            : "bg-[#0a0d24]/95 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.15)]"
        }`}
      >
        {/* Ambient Glow Background */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full blur-[90px] pointer-events-none transition-colors duration-500 ${
            isActivated ? "bg-emerald-500/20" : "bg-rose-600/15"
          }`}
        />

        <div className="relative z-10 space-y-4 sm:space-y-5">
          {/* Header Status Warning / Success */}
          <div className="text-center space-y-1">
            {isActivated ? (
              <div className="inline-flex items-center justify-center gap-2 text-[#00e676] text-xs sm:text-sm font-black uppercase tracking-wider animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
                <span>ID ROBLOX TERVERIFIKASI &amp; AKTIF</span>
                <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center gap-2 text-rose-500 text-xs sm:text-sm font-black uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>PERINGATAN!</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
            )}

            <h2
              className={`text-xl sm:text-2xl font-black uppercase tracking-wide font-['Orbitron',sans-serif] ${
                isActivated ? "text-[#00e676]" : "text-white"
              }`}
            >
              {isActivated ? "ID ROBLOX AKTIF ✓" : "ID ROBLOX BELUM AKTIF"}
            </h2>
          </div>

          {/* Target User Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070918] border border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                TARGET USER:
              </span>
              <span
                className={`font-black text-sm sm:text-base ${
                  isActivated ? "text-[#00e676]" : "text-rose-500"
                }`}
              >
                @{username}
              </span>
              {currentOrder && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500/20 text-[#ff1b7a] border border-pink-500/30">
                  {currentOrder.orderNumber} ({currentOrder.robuxAmount.toLocaleString("id-ID")} Robux)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${
                  isActivated
                    ? "bg-emerald-500/20 text-[#00e676] border-emerald-500/50 shadow-[0_0_10px_rgba(0,230,118,0.3)]"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                }`}
              >
                {isActivated ? "AKTIF ✓" : "BELUM AKTIF"}
              </span>

              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff1b7a]/50 hover:bg-pink-500/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#ff1b7a]" />
                <span>Pilih User</span>
              </button>
            </div>
          </div>

          {/* 2 Column Box (Aktivasi Diperlukan & Biaya Pengaktifan ID) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Box */}
            <div
              className={`md:col-span-7 p-4 sm:p-5 rounded-2xl border space-y-2.5 transition-all ${
                isActivated
                  ? "bg-[#06241a] border-emerald-500/40 shadow-[0_0_15px_rgba(0,230,118,0.1)]"
                  : "bg-[#0c0e28] border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.08)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${
                    isActivated
                      ? "bg-emerald-500/20 border-emerald-500/40 text-[#00e676]"
                      : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  }`}
                >
                  {isActivated ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {isActivated ? "STATUS AKTIVASI: SIAP PROSES" : "AKTIVASI DIPERLUKAN"}
                </h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isActivated ? (
                  <>
                    ID Roblox akun <span className="text-[#00e676] font-black">@{username}</span> telah berhasil diaktifkan. Pesanan Robux dapat langsung diproses ke akun Roblox pelanggan sekarang.
                  </>
                ) : (
                  <>
                    ID Roblox pada order akun{" "}
                    <span className="text-rose-400 font-black">@{username}</span>{" "}
                    belum aktif. Silakan aktifkan ID terlebih dahulu untuk melanjutkan proses pengiriman Robux.
                  </>
                )}
              </p>
            </div>

            {/* Right Box: Biaya Pengaktifan ID */}
            <div
              className={`md:col-span-5 p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-1.5 transition-all ${
                isActivated
                  ? "bg-[#06241a] border-emerald-500/40 shadow-[0_0_15px_rgba(0,230,118,0.1)]"
                  : "bg-[#0c0e28] border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.08)]"
              }`}
            >
              <span
                className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                  isActivated ? "text-[#00e676]" : "text-rose-400"
                }`}
              >
                BIAYA PENGAKTIFAN ID
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black font-sans ${
                  isActivated
                    ? "text-[#00e676] drop-shadow-[0_0_15px_rgba(0,230,118,0.8)]"
                    : "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                }`}
              >
                Rp {fee.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          {/* Catatan Admin Note */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0c0e28] border border-white/[0.08] flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white font-black">Catatan Admin:</strong>{" "}
              {isActivated ? (
                <span>
                  Aktivasi selesai untuk @{username}. Anda dapat langsung memproses transaksi gamepass Robux pelanggan ini.
                </span>
              ) : (
                <span>
                  Setelah ID @{username} diaktifkan, order dapat langsung diproses seperti biasa.
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          {isActivated ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#00e676] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.3)] animate-fadeIn w-full">
                <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
                <span>ID @{username} AKTIF &amp; SIAP DIPROSES ✓</span>
              </div>

              {currentOrder && onProcessOrder && (
                <button
                  type="button"
                  onClick={() => onProcessOrder(currentOrder)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-[0_0_25px_rgba(0,230,118,0.6)] text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 uppercase tracking-wider"
                >
                  <span>Proses Order Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenConfirm}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(225,29,72,0.6)] hover:shadow-[0_0_35px_rgba(225,29,72,0.9)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Aktifkan ID @{username} Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. [Popup Modal Konfirmasi Aktivasi Muncul] */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsConfirmModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_60px_rgba(244,63,94,0.3)] border border-rose-500/50 overflow-hidden z-10 animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-rose-500/20 bg-gradient-to-r from-[#170e20] to-[#0e102d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                  <Zap className="w-4 h-4 fill-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Konfirmasi Aktivasi ID Roblox
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Verifikasi pengaktifan akun pelanggan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#070918] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold">Username Roblox:</span>
                  <span className="font-black text-[#ff1b7a] text-sm">
                    @{username}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold">Biaya Pengaktifan:</span>
                  <span className="font-black text-rose-400 text-sm font-sans">
                    Rp {fee.toLocaleString("id-ID")}
                  </span>
                </div>

                {currentOrder && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                    <span className="text-gray-400 font-bold">Pesanan Terkait:</span>
                    <span className="font-mono font-bold text-[#00d2ff]">
                      {currentOrder.orderNumber} ({currentOrder.robuxAmount.toLocaleString("id-ID")} Robux)
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Penting</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-300">
                  Pastikan pembayaran biaya aktivasi ID @{username} telah terverifikasi. Setelah dikonfirmasi, status akan berubah menjadi <strong className="text-[#00e676]">AKTIF ✓</strong>.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmActivation}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:shadow-[0_0_25px_rgba(225,29,72,0.7)] text-white font-black text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Konfirmasi Aktivasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilih / Ganti Target User */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-pink-500/40 overflow-hidden z-10 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/[0.08] bg-[#0e102d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-[#ff1b7a]">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Pilih Target User Aktivasi
                  </h3>
                  <p className="text-xs text-gray-400">
                    Pilih dari pesanan pending atau masukkan manual
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Pending Orders if available */}
            {pendingOrders.length > 0 && (
              <div className="p-6 pb-2 space-y-2 border-b border-white/[0.06]">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                  Daftar Pesanan Masuk (Pending):
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingOrders.map((ord) => {
                    const isOrdActivated = activatedUsernames.has(
                      ord.robloxUsername.toLowerCase()
                    );
                    const isCurrent =
                      ord.robloxUsername.toLowerCase() === username.toLowerCase();
                    return (
                      <div
                        key={ord.id}
                        onClick={() => handleSelectPendingOrder(ord)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-pink-500/15 border-pink-500/50 shadow-[0_0_12px_rgba(255,27,122,0.2)]"
                            : "bg-[#070918] border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">
                              @{ord.robloxUsername}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {ord.orderNumber}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {ord.robuxAmount.toLocaleString("id-ID")} Robux • Rp {ord.price.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            isOrdActivated
                              ? "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          }`}
                        >
                          {isOrdActivated ? "AKTIF ✓" : "PENDING"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Manual Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-300 mb-1.5 uppercase tracking-wider">
                  Target Username Roblox (Manual)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff1b7a] font-black text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="saprii09"
                    required
                    className="w-full pl-8 pr-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-300 mb-1.5 uppercase tracking-wider">
                  Biaya Pengaktifan ID (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={tempFee}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setTempFee(
                        digits ? parseInt(digits, 10).toLocaleString("id-ID") : ""
                      );
                    }}
                    placeholder="97.000"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1b7a] to-[#d81159] hover:shadow-[0_0_20px_rgba(255,27,122,0.6)] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
