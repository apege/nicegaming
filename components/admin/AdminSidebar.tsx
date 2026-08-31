"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  Users,
  ShieldBan,
  MessageSquareHeart,
  CreditCard,
  Settings,
  ExternalLink,
  LogOut,
  X,
  MessageCircle,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "order_masuk"
  | "order_diproses"
  | "order_selesai"
  | "order_dibatalkan"
  | "pricelist"
  | "pelanggan"
  | "blacklist"
  | "testimoni"
  | "keuangan"
  | "pengaturan";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  orderCounts: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  storeName?: string;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  orderCounts,
  storeName = "NiceGaming",
}: AdminSidebarProps) {
  const parts = storeName.trim().split(" ");
  const prefix = parts[0]?.toUpperCase() || "NICE";
  const suffix =
    parts.slice(1).join(" ")?.toUpperCase() ||
    (storeName.length > 4 ? storeName.substring(4).toUpperCase() : "");

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#080a1c] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "z-50 translate-x-0" : "z-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header / Brand Logo */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#060817]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,27,122,0.4)] border border-pink-500/40 bg-[#070714] p-1 shrink-0">
              <Image
                src="/logo.png"
                alt={`${storeName} Logo`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-base tracking-wider text-white font-['Orbitron',sans-serif] block">
                {prefix}
                {suffix && <span className="text-[#00d2ff]"> {suffix}</span>}
              </span>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide mt-0.5">
                Robux Control Panel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Main Dashboard */}
          <div>
            <button
              onClick={() => handleTabClick("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeTab === "dashboard" ? "text-[#ff1b7a]" : "text-gray-400"
                }`}
              />
              <span>Dashboard</span>
            </button>
          </div>

          {/* ORDER MANAGEMENT */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order Management
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick("order_masuk")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "order_masuk"
                    ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox
                    className={`w-4 h-4 ${
                      activeTab === "order_masuk" ? "text-[#ff1b7a]" : "text-gray-400"
                    }`}
                  />
                  <span>Order Masuk</span>
                </div>
                {orderCounts.pending > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-[#ff1b7a] text-white shadow-[0_0_10px_rgba(255,27,122,0.6)]">
                    {orderCounts.pending}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick("order_diproses")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "order_diproses"
                    ? "bg-gradient-to-r from-cyan-500/20 to-transparent text-white border-l-2 border-[#00d2ff] shadow-[inset_10px_0_20px_-10px_rgba(0,210,255,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock
                    className={`w-4 h-4 ${
                      activeTab === "order_diproses" ? "text-[#00d2ff]" : "text-gray-400"
                    }`}
                  />
                  <span>Order Diproses</span>
                </div>
                {orderCounts.processing > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-[#00d2ff] text-slate-950 shadow-[0_0_10px_rgba(0,210,255,0.6)]">
                    {orderCounts.processing}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick("order_selesai")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "order_selesai"
                    ? "bg-gradient-to-r from-emerald-500/20 to-transparent text-white border-l-2 border-[#00e676] shadow-[inset_10px_0_20px_-10px_rgba(0,230,118,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      activeTab === "order_selesai" ? "text-[#00e676]" : "text-gray-400"
                    }`}
                  />
                  <span>Order Selesai</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick("order_dibatalkan")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "order_dibatalkan"
                    ? "bg-gradient-to-r from-rose-500/20 to-transparent text-white border-l-2 border-rose-500 shadow-[inset_10px_0_20px_-10px_rgba(244,63,94,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <XCircle
                    className={`w-4 h-4 ${
                      activeTab === "order_dibatalkan" ? "text-rose-400" : "text-gray-400"
                    }`}
                  />
                  <span>Order Dibatalkan</span>
                </div>
              </button>
            </div>
          </div>

          {/* PRICELIST */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Pricelist
            </div>
            <button
              onClick={() => handleTabClick("pricelist")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "pricelist"
                  ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Tag
                className={`w-4 h-4 ${
                  activeTab === "pricelist" ? "text-[#ff1b7a]" : "text-gray-400"
                }`}
              />
              <span>Pricelist Robux</span>
            </button>
          </div>

          {/* PELANGGAN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Pelanggan
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick("pelanggan")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "pelanggan"
                    ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Users
                  className={`w-4 h-4 ${
                    activeTab === "pelanggan" ? "text-[#ff1b7a]" : "text-gray-400"
                  }`}
                />
                <span>Daftar Pelanggan</span>
              </button>

              <button
                onClick={() => handleTabClick("blacklist")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "blacklist"
                    ? "bg-gradient-to-r from-rose-500/20 to-transparent text-white border-l-2 border-rose-500 shadow-[inset_10px_0_20px_-10px_rgba(244,63,94,0.4)]"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <ShieldBan
                  className={`w-4 h-4 ${
                    activeTab === "blacklist" ? "text-rose-400" : "text-gray-400"
                  }`}
                />
                <span>Blacklist</span>
              </button>
            </div>
          </div>

          {/* KONTEN & ULASAN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Konten & Ulasan
            </div>
            <button
              onClick={() => handleTabClick("testimoni")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "testimoni"
                  ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <MessageSquareHeart
                className={`w-4 h-4 ${
                  activeTab === "testimoni" ? "text-[#ff1b7a]" : "text-gray-400"
                }`}
              />
              <span>Kelola Testimoni</span>
            </button>
          </div>

          {/* KEUANGAN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Keuangan
            </div>
            <button
              onClick={() => handleTabClick("keuangan")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "keuangan"
                  ? "bg-gradient-to-r from-cyan-500/20 to-transparent text-white border-l-2 border-[#00d2ff] shadow-[inset_10px_0_20px_-10px_rgba(0,210,255,0.4)]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <CreditCard
                className={`w-4 h-4 ${
                  activeTab === "keuangan" ? "text-[#00d2ff]" : "text-gray-400"
                }`}
              />
              <span>Riwayat Pembayaran</span>
            </button>
          </div>

          {/* PENGATURAN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Pengaturan
            </div>
            <button
              onClick={() => handleTabClick("pengaturan")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "pengaturan"
                  ? "bg-gradient-to-r from-pink-500/20 to-transparent text-white border-l-2 border-[#ff1b7a] shadow-[inset_10px_0_20px_-10px_rgba(255,27,122,0.4)]"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Settings
                className={`w-4 h-4 ${
                  activeTab === "pengaturan" ? "text-[#ff1b7a]" : "text-gray-400"
                }`}
              />
              <span>Pengaturan Toko</span>
            </button>
          </div>
        </div>

        {/* Bottom Card & Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-[#060817]">
          {/* Help Box */}
          <div className="p-3.5 rounded-2xl bg-[#0c0f26] border border-pink-500/20 text-center shadow-[0_0_15px_rgba(255,27,122,0.1)]">
            <h4 className="text-xs font-black text-[#ff1b7a] mb-0.5">
              Butuh Bantuan?
            </h4>
            <p className="text-[11px] text-gray-400 mb-2.5">
              Tim NiceGaming siap membantu kamu!
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#ff1b7a] to-[#d81159] text-white text-xs font-black hover:shadow-[0_0_15px_rgba(255,27,122,0.5)] transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Admin</span>
            </a>
          </div>

          {/* Bottom Action Links */}
          <div className="flex items-center justify-between text-xs font-bold px-1 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-gray-400 hover:text-[#00d2ff] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Toko</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1 text-[#ff1b7a] hover:text-pink-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
