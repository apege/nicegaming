"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  RotateCw,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { AdminOrder, OrderStatus } from "@/types/admin";
import { AdminTab } from "./AdminSidebar";

interface OrdersManagerProps {
  currentTab: AdminTab;
  orders: AdminOrder[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectOrder: (order: AdminOrder) => void;
  onQuickUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onRefresh: () => void;
}

export default function OrdersManager({
  currentTab,
  orders,
  searchQuery,
  onSearchChange,
  onSelectOrder,
  onQuickUpdateStatus,
  onRefresh,
}: OrdersManagerProps) {
  const getTargetStatus = (): OrderStatus | "ALL" => {
    switch (currentTab) {
      case "order_masuk":
        return "pending";
      case "order_diproses":
        return "processing";
      case "order_selesai":
        return "completed";
      case "order_dibatalkan":
        return "cancelled";
      default:
        return "ALL";
    }
  };

  const targetStatus = getTargetStatus();

  const filteredOrders = orders.filter((order) => {
    if (targetStatus !== "ALL" && order.status !== targetStatus) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchUser = order.robloxUsername.toLowerCase().includes(q);
      const matchWa = order.whatsappNumber.includes(q);
      if (!matchNumber && !matchUser && !matchWa) return false;
    }
    return true;
  });

  const getPageTitle = () => {
    switch (currentTab) {
      case "order_masuk":
        return {
          title: "Order Masuk",
          subtitle: "Kelola dan proses seluruh pesanan Robux baru yang masuk ke NiceGaming",
        };
      case "order_diproses":
        return {
          title: "Order Diproses",
          subtitle: "Daftar pesanan yang sedang dalam antrean pembelian gamepass Robux",
        };
      case "order_selesai":
        return {
          title: "Order Selesai",
          subtitle: "Riwayat pesanan Robux yang telah berhasil dikirimkan ke pelanggan",
        };
      case "order_dibatalkan":
        return {
          title: "Order Dibatalkan",
          subtitle: "Daftar transaksi yang dibatalkan karena tidak bayar atau kendala data",
        };
      default:
        return {
          title: "Semua Pesanan",
          subtitle: "Kelola seluruh data transaksi top up Robux",
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            Menunggu Bayar
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 border border-cyan-500/30 text-[#00d2ff]">
            Sedang Diproses
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-[#00e676]">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header with Refresh Button matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0e1028] border border-pink-500/30 text-xs font-bold text-gray-200 hover:text-white hover:border-[#ff1b7a] hover:bg-pink-500/10 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar Container matching Image 3 */}
      <div className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-5 border border-pink-500/20 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter order atau username..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#080a1c] border border-pink-500/20 rounded-full focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="text-xs font-bold text-gray-400 shrink-0">
            Menampilkan {filteredOrders.length} pesanan
          </div>
        </div>
      </div>

      {/* Orders List matching Image 3 */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-pink-500/20 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] mx-auto flex items-center justify-center mb-3">
            <Filter className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            Tidak ada pesanan ditemukan
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Tidak ada transaksi yang cocok dengan filter atau kata kunci yang dicari.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0d0f28]/90 backdrop-blur-xl rounded-3xl p-5 border border-pink-500/20 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(255,27,122,0.15)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Side: Order Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-black text-[#ff1b7a]">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 flex-wrap">
                  <span className="font-bold text-white">
                    @{order.robloxUsername}
                  </span>
                  <span>•</span>
                  <span>{order.createdAt}</span>
                  <span>•</span>
                  <span
                    className={`font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                      order.paymentSource === "WEBSITE"
                        ? "bg-pink-500/20 text-[#ff1b7a] border border-pink-500/30"
                        : "bg-emerald-500/20 text-[#00e676] border border-emerald-500/30"
                    }`}
                  >
                    {order.paymentSource}
                  </span>
                  <span>
                    {order.hasProofPhoto ? "(Ada Bukti Foto)" : "(Tanpa foto)"}
                  </span>
                </div>
              </div>

              {/* Middle & Right: Robux Amount & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                {/* Robux & Price */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#141838] border border-amber-500/30 flex items-center justify-center shrink-0 p-1.5 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={28}
                      height={28}
                      className="object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300">
                      {order.robuxAmount.toLocaleString("id-ID")} Robux
                    </div>
                    <div className="text-sm font-black text-white">
                      {formatRupiah(order.price)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {order.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onQuickUpdateStatus(order.id, "processing")}
                      className="px-4 py-2 rounded-full bg-cyan-500/15 text-[#00d2ff] hover:bg-cyan-500/25 font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer"
                    >
                      Proses
                    </button>
                  )}

                  {order.status === "processing" && (
                    <button
                      type="button"
                      onClick={() => onQuickUpdateStatus(order.id, "completed")}
                      className="px-4 py-2 rounded-full bg-emerald-500/15 text-[#00e676] hover:bg-emerald-500/25 font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer"
                    >
                      Selesaikan
                    </button>
                  )}



                  {/* Detail Button matching Image 3 */}
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff1b7a] to-[#d81159] hover:shadow-[0_0_15px_rgba(255,27,122,0.6)] text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
