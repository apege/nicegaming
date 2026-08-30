"use client";

import React, { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { AdminCustomer } from "@/types/admin";

interface AddBlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlacklist: (customer: Partial<AdminCustomer>) => void;
}

export default function AddBlacklistModal({
  isOpen,
  onClose,
  onAddBlacklist,
}: AddBlacklistModalProps) {
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [robloxId, setRobloxId] = useState("");
  const [reason, setReason] = useState("Indikasi penipuan atau penyalahgunaan");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Mohon masukkan Username Roblox.");
      return;
    }

    onAddBlacklist({
      username: username.trim().replace(/^@/, ""),
      whatsapp: whatsapp.trim() || "Belum terdata",
      robloxId: robloxId.trim() || "Belum terdata",
      blacklistReason: reason.trim() || "Indikasi penipuan atau penyalahgunaan",
      isBlacklisted: true,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderAt: "Baru saja",
    });

    setUsername("");
    setWhatsapp("");
    setRobloxId("");
    setReason("Indikasi penipuan atau penyalahgunaan");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/[0.1] overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Tambah Akun ke Blacklist
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username Roblox */}
          <div>
            <label className="block text-xs font-black text-gray-300 mb-1.5">
              Username Roblox
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: APG_Channel11"
              required
              className="w-full px-5 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 placeholder:text-gray-500"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-black text-gray-300 mb-1.5">
              Nomor WhatsApp (Opsional)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 087816959979 atau 628..."
              className="w-full px-5 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 placeholder:text-gray-500"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Nomor WhatsApp ini juga akan langsung diblokir saat checkout.
            </p>
          </div>

          {/* ID Roblox */}
          <div>
            <label className="block text-xs font-black text-gray-300 mb-1.5">
              ID Roblox (Opsional)
            </label>
            <input
              type="text"
              value={robloxId}
              onChange={(e) => setRobloxId(e.target.value)}
              placeholder="Contoh: 1350738735 (jika diketahui)"
              className="w-full px-5 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 placeholder:text-gray-500"
            />
          </div>

          {/* Alasan Pemblokiran */}
          <div>
            <label className="block text-xs font-black text-gray-300 mb-1.5">
              Alasan Pemblokiran
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Indikasi penipuan atau penyalahgunaan"
              required
              className="w-full px-5 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 placeholder:text-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#0e122b] border border-white/[0.08] text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:scale-[1.02] text-white text-xs font-black transition-all cursor-pointer"
            >
              Blokir Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
