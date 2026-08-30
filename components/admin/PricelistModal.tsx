"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AdminPricelistItem } from "@/types/admin";

interface PricelistModalProps {
  item: AdminPricelistItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminPricelistItem>) => void;
}

export default function PricelistModal({
  item,
  isOpen,
  onClose,
  onSave,
}: PricelistModalProps) {
  const [robux, setRobux] = useState(item ? item.robux.toString() : "");
  const [price, setPrice] = useState(item ? item.price.toString() : "");
  const [isActive, setIsActive] = useState(item ? item.isActive : true);

  React.useEffect(() => {
    if (item) {
      setRobux(item.robux.toString());
      setPrice(item.price.toString());
      setIsActive(item.isActive);
    } else {
      setRobux("");
      setPrice("");
      setIsActive(true);
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseInt(robux.replace(/\D/g, ""), 10);
    const p = parseInt(price.replace(/\D/g, ""), 10);
    if (isNaN(r) || isNaN(p) || r <= 0 || p <= 0) {
      alert("Mohon masukkan nominal Robux dan Harga yang valid.");
      return;
    }

    onSave({
      id: item ? item.id : Date.now(),
      robux: r,
      price: p,
      isActive,
      badge: item?.badge,
    });
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
      <div className="relative w-full max-w-md bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/[0.1] overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.08]">
          <h3 className="text-base sm:text-lg font-black text-white">
            {item ? "Edit Nominal Robux" : "Tambah Nominal Robux"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Field 1: Nominal Robux */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black text-gray-300 mb-2">
              <span>Nominal Robux</span>
              <Image
                src="/robux.webp"
                alt="Robux"
                width={16}
                height={16}
                className="object-contain inline-block drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]"
              />
            </label>
            <div className="relative">
              <input
                type="text"
                value={robux}
                onChange={(e) => setRobux(e.target.value)}
                placeholder="1.000"
                required
                className="w-full px-5 py-3 bg-[#070918] border border-white/[0.1] rounded-full text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 placeholder:text-gray-500 pr-12"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
                R$
              </span>
            </div>
          </div>

          {/* Field 2: Harga Jual (Rp) */}
          <div>
            <label className="block text-xs font-black text-gray-300 mb-2">
              Harga Jual (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-black text-[#ff1b7a]">
                Rp
              </span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="20.000"
                required
                className="w-full pl-12 pr-5 py-3 bg-[#070918] border border-white/[0.1] rounded-full text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Field 3: Checkbox Aktif */}
          <div className="pt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff1b7a] bg-[#070918] border-white/20 focus:ring-[#ff1b7a] focus:ring-offset-0 cursor-pointer accent-[#ff1b7a]"
              />
              <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                Nominal Aktif & Ditampilkan di Web
              </span>
            </label>
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
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_20px_rgba(255,27,122,0.6)] hover:scale-[1.02] text-white text-xs font-black transition-all cursor-pointer"
            >
              Simpan Nominal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
