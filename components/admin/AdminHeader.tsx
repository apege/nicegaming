"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  LogOut,
  X,
  Package,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  ArrowRight,
} from "lucide-react";
import { AdminOrder } from "@/types/admin";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileSidebar: () => void;
  onLogout?: () => void;
  storeName?: string;
  orders?: AdminOrder[];
  onSelectOrder?: (order: AdminOrder) => void;
  onSelectTab?: (tab: any) => void;
}

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onLogout,
  storeName = "NiceGaming",
  orders = [],
  onSelectOrder,
  onSelectTab,
}: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching orders for autocomplete
  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchingOrders = cleanQuery
    ? orders
        .filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(cleanQuery) ||
            o.robloxUsername.toLowerCase().includes(cleanQuery) ||
            (o.robloxUserId && o.robloxUserId.toLowerCase().includes(cleanQuery)) ||
            (o.whatsappNumber && o.whatsappNumber.includes(cleanQuery)) ||
            `${o.robuxAmount}`.includes(cleanQuery)
        )
        .slice(0, 6)
    : [];

  const handleSelectOrder = (order: AdminOrder) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    }
    onSearchChange("");
    setIsOpen(false);
  };

  const handleQuickNav = (tab: string) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    onSearchChange("");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070918]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Autocomplete Search Bar */}
      <div
        ref={containerRef}
        className="flex items-center gap-3 flex-1 max-w-2xl relative"
      >
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-[#0e122b] text-gray-300 hover:bg-pink-500/20 hover:text-white transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Cari order, username, ID, no WA..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-[#0e122b] border border-white/[0.08] rounded-full focus:outline-hidden focus:border-[#ff1b7a] focus:bg-[#131838] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-400 text-white"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                setIsOpen(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 🌟 AUTOCOMPLETE DROPDOWN */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#090b24] border border-pink-500/30 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden z-50 animate-fadeIn divide-y divide-white/[0.06]">
              {/* If user typed something */}
              {cleanQuery ? (
                <>
                  <div className="px-4 py-2 bg-[#070918] text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                    <span>Hasil Pencarian ({matchingOrders.length})</span>
                    <span className="text-gray-500 font-normal">Klik untuk buka detail</span>
                  </div>

                  {matchingOrders.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                      {matchingOrders.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => handleSelectOrder(order)}
                          className="px-4 py-3 hover:bg-pink-500/10 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-[#ff1b7a] font-['Orbitron',sans-serif]">
                                  {order.orderNumber}
                                </span>
                                <span className="text-xs font-bold text-white truncate">
                                  @{order.robloxUsername}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                                {order.robuxAmount.toLocaleString("id-ID")} Robux • Rp{" "}
                                {order.price.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                order.status === "completed"
                                  ? "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                                  : order.status === "processing"
                                  ? "bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/40"
                                  : order.status === "pending"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              }`}
                            >
                              {order.statusLabel}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#ff1b7a] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-gray-400 text-xs space-y-1">
                      <AlertCircle className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                      <p className="font-bold text-gray-300">
                        Tidak ada pesanan yang cocok dengan &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Coba cari berdasarkan username, nomor invoice, atau nomor WA
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Quick Shortcuts when search is empty */
                <div className="p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Akses Cepat Admin
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickNav("order_masuk")}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Lihat Order Masuk (Pending)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {orders.filter((o) => o.status === "pending").length} antrean
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNav("order_diproses")}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span>Lihat Order Sedang Diproses</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {orders.filter((o) => o.status === "processing").length} order
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNav("order_selesai")}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Lihat Order Selesai</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {orders.filter((o) => o.status === "completed").length} selesai
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNav("pengaturan")}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#ff1b7a]" />
                    <span>Buka Pengaturan Toko & Banner</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Admin Profile & Logout */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-white/10">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#ff1b7a] shadow-[0_0_12px_rgba(255,27,122,0.5)] bg-[#0e122b]">
            <Image
              src="/logo.png"
              alt="Admin Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-black text-white leading-tight">
              Admin {storeName}
            </div>
            <div className="text-[11px] font-black text-[#00d2ff] tracking-wide">
              Super Admin
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Link
          href="/"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 text-[#ff1b7a] hover:bg-[#ff1b7a] hover:text-white text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Link>
      </div>
    </header>
  );
}
