"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Zap } from "lucide-react";
import { AdminPricelistItem } from "@/types/admin";
import PricelistModal from "./PricelistModal";

interface PricelistManagerProps {
  pricelist: AdminPricelistItem[];
  onSaveItem: (item: Partial<AdminPricelistItem>) => void;
  onDeleteItem: (id: number) => void;
  onToggleActive: (id: number) => void;
}

export default function PricelistManager({
  pricelist,
  onSaveItem,
  onDeleteItem,
  onToggleActive,
}: PricelistManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminPricelistItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AdminPricelistItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id: number, robux: number) => {
    if (confirm(`Yakin ingin menghapus paket ${robux} Robux?`)) {
      onDeleteItem(id);
    }
  };

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_20px_rgba(255,27,122,0.6)] text-white font-black text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Nominal Baru</span>
        </button>
      </div>

      {/* Grid of Pricelist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pricelist.map((item) => (
          <div
            key={item.id}
            className={`bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between overflow-hidden ${
              item.isActive
                ? "border-white/[0.08] shadow-xs hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(255,27,122,0.2)]"
                : "border-white/5 opacity-50 bg-[#070918]"
            }`}
          >
            {/* Top row with Coin, Amount, Price and Badges */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Official Gold Robux Coin */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#141838] border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)] p-2">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={38}
                      height={38}
                      className="object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-black text-white truncate">
                      {item.robux.toLocaleString("id-ID")} Robux
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {item.badge && (
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            item.badge === "PROMO"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(255,27,122,0.3)]"
                              : item.badge === "SULTAN"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                              : "bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/40 shadow-[0_0_8px_rgba(0,210,255,0.3)]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="text-sm font-black text-[#ff1b7a] whitespace-nowrap font-sans">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full shrink-0 whitespace-nowrap leading-none ${
                    item.isActive
                      ? "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40 shadow-[0_0_8px_rgba(0,230,118,0.2)]"
                      : "bg-white/10 text-gray-400 border border-white/10"
                  }`}
                >
                  {item.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onToggleActive(item.id)}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {item.isActive ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  title="Edit Paket"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#00d2ff] hover:bg-cyan-500/10 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.robux)}
                  title="Hapus Paket"
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PricelistModal
        item={editingItem}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveItem}
      />
    </div>
  );
}
