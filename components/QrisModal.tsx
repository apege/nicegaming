"use client";

import React from "react";
import { X, QrCode, CheckCircle2 } from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types";
import { ADMIN_PHONE } from "@/constants";

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  userId: string;
  whatsapp: string;
  selectedPackage: RobuxPackage;
  robloxUser: RobloxUser | null;
  onConfirmPaid: () => void;
}

export default function QrisModal({
  isOpen,
  onClose,
  invoiceId,
  userId,
  whatsapp,
  selectedPackage,
  robloxUser,
  onConfirmPaid,
}: QrisModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    const displayNameTxt = robloxUser ? ` (${robloxUser.displayName})` : "";
    const message = `Halo Admin NiceGaming, saya sudah transfer via QRIS Website:%0A%0A` +
      `🧾 Invoice: ${invoiceId}%0A` +
      `👤 Username Roblox: ${userId}${displayNameTxt}%0A` +
      `💎 Paket: ${selectedPackage.robux} Robux%0A` +
      `💰 Nominal: ${selectedPackage.priceFormatted}%0A` +
      `📱 No WA: ${whatsapp}%0A%0A` +
      `Berikut saya sertakan bukti transfernya, mohon diproses ya!`;

    window.open(`https://wa.me/${ADMIN_PHONE}?text=${message}`, "_blank");
    onConfirmPaid();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-card-pink rounded-3xl max-w-md w-full p-6 border-2 border-pink-500/50 shadow-[0_0_45px_rgba(255,27,122,0.4)] text-center space-y-4 animate-in fade-in zoom-in duration-300 relative">
        {/* Close button */}
        <button
          onClick={onClose}
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
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#00e676] hover:bg-[#00c853] text-gray-900 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.4)] cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Konfirmasi Sudah Bayar</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-gray-400 hover:text-white transition-colors"
          >
            Batalkan / Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
