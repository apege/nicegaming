"use client";

import React, { useState } from "react";
import {
  Search,
  RotateCw,
  User,
  ShieldBan,
  MessageCircle,
  Plus,
} from "lucide-react";
import { AdminCustomer } from "@/types/admin";
import AddBlacklistModal from "./AddBlacklistModal";

interface CustomersManagerProps {
  customers: AdminCustomer[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleBlacklist: (customerId: string) => void;
  onAddBlacklist?: (customer: Partial<AdminCustomer>) => void;
  onRefresh: () => void;
  isBlacklistView?: boolean;
}

export default function CustomersManager({
  customers,
  searchQuery,
  onSearchChange,
  onToggleBlacklist,
  onAddBlacklist,
  onRefresh,
  isBlacklistView = false,
}: CustomersManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = customers.filter((cust) => {
    if (isBlacklistView && !cust.isBlacklisted) return false;
    if (!isBlacklistView && cust.isBlacklisted) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchUser = cust.username.toLowerCase().includes(q);
      const matchId = cust.robloxId.toLowerCase().includes(q);
      const matchWa = cust.whatsapp.toLowerCase().includes(q);
      if (!matchUser && !matchId && !matchWa) return false;
    }
    return true;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header with Add Blacklist & Refresh Buttons matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isBlacklistView ? "Daftar Blacklist" : "Daftar Pelanggan"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {isBlacklistView
              ? "Daftar akun pelanggan yang diblokir karena indikasi penipuan atau penyalahgunaan"
              : "Kelola seluruh data akun pelanggan aktif dan riwayat belanja Robux"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isBlacklistView && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:shadow-[0_0_20px_rgba(244,63,94,0.6)] text-white text-xs font-black transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Blacklist</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0e1028] border border-pink-500/30 text-xs font-bold text-gray-200 hover:text-white hover:border-[#ff1b7a] hover:bg-pink-500/10 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Search Input Container matching Image 1 */}
      <div className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-5 border border-pink-500/20 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isBlacklistView
                  ? "Cari akun blacklist..."
                  : "Cari username atau kontak pelanggan..."
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#080a1c] border border-pink-500/20 rounded-full focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="text-xs font-bold text-gray-400">
            Menampilkan {filteredCustomers.length} {isBlacklistView ? "akun blacklist" : "pelanggan"}
          </div>
        </div>
      </div>

      {/* Customer List matching Image 1 */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-pink-500/20 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] mx-auto flex items-center justify-center mb-3">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isBlacklistView
              ? "Tidak ada akun di daftar blacklist"
              : "Tidak ada pelanggan ditemukan"}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {isBlacklistView
              ? "Belum ada akun Roblox atau nomor WA yang masuk daftar blacklist."
              : "Tidak ada data pelanggan yang cocok dengan pencarian."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-5 border border-pink-500/20 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(255,27,122,0.15)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#ff1b7a]">
                    @{cust.username}
                  </span>
                  {cust.isBlacklisted && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      BLACKLISTED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 flex-wrap">
                  <span>
                    ID:{" "}
                    <span className="font-semibold text-gray-200">
                      {cust.robloxId}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    WA:{" "}
                    {cust.whatsapp !== "Belum terdata" ? (
                      <a
                        href={`https://wa.me/${cust.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#00e676] hover:underline inline-flex items-center gap-1"
                      >
                        {cust.whatsapp}
                      </a>
                    ) : (
                      <span className="italic text-gray-400">
                        Belum terdata
                      </span>
                    )}
                  </span>
                </div>

                {cust.blacklistReason && (
                  <p className="text-xs text-rose-400 font-medium">
                    Alasan: {cust.blacklistReason}
                  </p>
                )}
              </div>

              {/* Right Side: Total Orders, Total Spent, Blacklist Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-gray-200">
                    {cust.totalOrders} Pesanan
                  </div>
                  <div className="text-sm font-black text-[#ff1b7a]">
                    Total: {formatRupiah(cust.totalSpent)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleBlacklist(cust.id)}
                  className={`px-5 py-2 rounded-full font-bold text-xs border transition-all cursor-pointer ${
                    cust.isBlacklisted
                      ? "bg-emerald-500/20 text-[#00e676] border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25"
                  }`}
                >
                  {cust.isBlacklisted ? "Buka Blokir" : "Blacklist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Blacklist Modal */}
      {isBlacklistView && onAddBlacklist && (
        <AddBlacklistModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddBlacklist={onAddBlacklist}
        />
      )}
    </div>
  );
}
