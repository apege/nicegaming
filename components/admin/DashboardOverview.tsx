"use client";

import React from "react";
import Image from "next/image";
import {
  TrendingUp,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Zap,
  ShoppingBag,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { AdminOrder } from "@/types/admin";
import { AdminTab } from "./AdminSidebar";
import RobloxActivationCard from "./RobloxActivationCard";

interface DashboardOverviewProps {
  orders: AdminOrder[];
  onSelectTab: (tab: AdminTab) => void;
  onSelectOrder: (order: AdminOrder) => void;
  storeName?: string;
}

export default function DashboardOverview({
  orders,
  onSelectTab,
  onSelectOrder,
  storeName = "NiceGaming",
}: DashboardOverviewProps) {
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);

  const recentOrders = orders.slice(0, 5);

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Welcome Banner Card - Clean Cyber Hero Panel */}
      <div className="bg-gradient-to-br from-[#101435] via-[#0d102b] to-[#07091a] rounded-3xl p-5 sm:p-7 lg:p-8 border border-pink-500/30 shadow-[0_0_35px_rgba(255,27,122,0.15)] relative overflow-hidden">
        {/* Ambient Glowing Highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff1b7a]/15 rounded-full blur-[110px] pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#00d2ff]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-[#ff1b7a] text-xs font-black mb-3.5 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{storeName} Admin Control</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight mb-1.5">
                Selamat Datang di Panel Admin!
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Pantau transaksi top up Robux, proses aktivasi pesanan secara
                instan, dan kelola katalog produk toko dengan mudah.
              </p>
            </div>

            <button
              onClick={() => onSelectTab("order_masuk")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(255,27,122,0.55)] hover:shadow-[0_0_35px_rgba(255,27,122,0.85)] hover:scale-[1.02] transition-all shrink-0 cursor-pointer"
            >
              <span>Kelola Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Stat Cards (2x2 Grid on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* TOTAL OMSET */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(255,27,122,0.2)] transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total Omset
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shadow-[0_0_10px_rgba(255,27,122,0.3)] shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-sans">
              <span className="text-xs sm:text-sm lg:text-base font-black text-pink-400">
                Rp
              </span>
              <span className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
                {totalRevenue.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-black text-[#00e676]">
              <span>↑ Transaksi sukses</span>
            </div>
          </div>
        </div>

        {/* ORDER MASUK */}
        <div
          onClick={() => onSelectTab("order_masuk")}
          className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order Masuk
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.3)] shrink-0">
              <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-sans">
              {pendingOrders.length}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-black text-amber-400 group-hover:underline">
              <span>Perlu diproses</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* SEDANG DIPROSES */}
        <div
          onClick={() => onSelectTab("order_diproses")}
          className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(0,210,255,0.2)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
              Sedang Diproses
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-[#00d2ff] flex items-center justify-center shadow-[0_0_10px_rgba(0,210,255,0.3)] shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-sans">
              {processingOrders.length}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-black text-[#00d2ff] group-hover:underline">
              <span>Dalam antrean</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* ORDER SELESAI */}
        <div
          onClick={() => onSelectTab("order_selesai")}
          className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(0,230,118,0.2)] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order Selesai
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#00e676] flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.3)] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight font-sans">
              {completedOrders.length}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-gray-400">
              <span>Dari {orders.length} order</span>
            </div>
          </div>
        </div>
      </div>

      {/* ⚠️ Card Aktivasi ID Roblox Belum Aktif (Requested by Client) */}
      <RobloxActivationCard
        orders={orders}
        initialUsername="saprii09"
        initialFee={97000}
        onProcessOrder={(order) => {
          onSelectOrder(order);
        }}
      />

      {/* 3. Pesanan Terbaru Card matching Image 2 */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Pesanan Terbaru
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              5 transaksi terakhir yang masuk ke sistem
            </p>
          </div>

          <button
            onClick={() => onSelectTab("order_masuk")}
            className="inline-flex items-center gap-1 text-xs font-black text-[#00d2ff] hover:text-white transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Official Gold Robux Coin with Neon Glow */}
                <div className="w-12 h-12 rounded-2xl bg-[#141838] border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)] p-2">
                  <Image
                    src="/robux.webp"
                    alt="Robux Logo"
                    width={32}
                    height={32}
                    className="object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                  />
                </div>

                <div>
                  <div className="text-sm font-black text-[#ff1b7a] font-['Orbitron',sans-serif]">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs text-gray-300 font-medium mt-0.5">
                    @{order.robloxUsername} • {order.robuxAmount.toLocaleString("id-ID")} Robux
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-white font-sans">
                  {formatRupiah(order.price)}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      order.paymentSource === "WEBSITE"
                        ? "bg-pink-500/20 text-[#ff1b7a] border border-pink-500/40"
                        : "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                    }`}
                  >
                    {order.paymentSource}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
