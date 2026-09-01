"use client";

import React from "react";
import Image from "next/image";
import { DollarSign, QrCode, MessageCircle, ArrowUpRight } from "lucide-react";
import { AdminOrder } from "@/types/admin";

interface PaymentsManagerProps {
  orders: AdminOrder[];
}

export default function PaymentsManager({ orders }: PaymentsManagerProps) {
  const completed = orders.filter((o) => o.status === "completed");
  const totalSuccessMoney = completed.reduce((sum, o) => sum + o.price, 0);
  const totalRobuxSold = completed.reduce((sum, o) => sum + o.robuxAmount, 0);

  const websiteCount = completed.filter((o) => o.paymentSource === "WEBSITE").length;
  const whatsappCount = completed.filter((o) => o.paymentSource === "WHATSAPP").length;

  const websiteMoney = completed
    .filter((o) => o.paymentSource === "WEBSITE")
    .reduce((sum, o) => sum + o.price, 0);

  const whatsappMoney = completed
    .filter((o) => o.paymentSource === "WHATSAPP")
    .reduce((sum, o) => sum + o.price, 0);

  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
          Riwayat Pembayaran & Keuangan
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Laporan pemasukan, total Robux terjual, dan distribusi metode bayar
        </p>
      </div>

      {/* 4 Metric Cards (2x2 on Mobile, 4 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* 1. Total Pemasukan Bersih */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/[0.08] shadow-xs hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(0,230,118,0.2)] transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 truncate">
              Pemasukan Bersih
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#00e676] flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.3)] shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-white font-sans truncate">
            {formatRupiah(totalSuccessMoney)}
          </div>
          <div className="text-[10px] sm:text-xs text-[#00e676] font-bold mt-1 sm:mt-2 truncate">
            {completed.length} order sukses
          </div>
        </div>

        {/* 2. Total Robux Terjual */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/[0.08] shadow-xs hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 truncate">
              Robux Terjual
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-1 sm:p-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)] shrink-0">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={20}
                height={20}
                className="object-contain drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]"
              />
            </div>
          </div>
          <div className="flex items-baseline gap-1 truncate">
            <span className="text-lg sm:text-2xl lg:text-3xl font-black text-white font-sans truncate">
              {totalRobuxSold.toLocaleString("id-ID")}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-400">
              R$
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-amber-400 font-bold mt-1 sm:mt-2 truncate">
            Sukses terkirim
          </div>
        </div>

        {/* 3. Website QRIS */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/[0.08] shadow-xs hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(255,27,122,0.2)] transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 truncate">
              QRIS Website
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shadow-[0_0_10px_rgba(255,27,122,0.3)] shrink-0">
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#ff1b7a] font-sans truncate">
            {formatRupiah(websiteMoney)}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 sm:mt-2 truncate">
            {websiteCount} via QRIS
          </div>
        </div>

        {/* 4. Manual WhatsApp */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/[0.08] shadow-xs hover:border-[#00e676]/50 hover:shadow-[0_0_20px_rgba(0,230,118,0.2)] transition-all">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 truncate">
              Manual WA
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#00e676] flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.3)] shrink-0">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#00e676] font-sans truncate">
            {formatRupiah(whatsappMoney)}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 sm:mt-2 truncate">
            {whatsappCount} via Admin WA
          </div>
        </div>
      </div>

      {/* Payment Records Container */}
      <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              Log Mutasi Pembayaran Terakhir
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Total {orders.length} data mutasi transaksi tercatat
            </p>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-400 font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            Realtime Log
          </span>
        </div>

        {/* 📱 MOBILE VIEW: Responsive Card List (Visible on mobile/tablet < md) */}
        <div className="block md:hidden divide-y divide-white/[0.06] p-3 space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-4 rounded-2xl bg-[#070918]/80 border border-white/[0.06] space-y-3 shadow-inner"
            >
              {/* Card Top: Invoice & Channel Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[#ff1b7a] font-['Orbitron',sans-serif]">
                  {o.orderNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    o.paymentSource === "WEBSITE"
                      ? "bg-pink-500/20 text-[#ff1b7a] border border-pink-500/40"
                      : "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                  }`}
                >
                  {o.paymentSource}
                </span>
              </div>

              {/* Card Mid: User, Product, Price */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                <div>
                  <div className="font-bold text-gray-200">
                    @{o.robloxUsername}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-extrabold mt-0.5">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={12}
                      height={12}
                      className="object-contain"
                    />
                    <span>{o.robuxAmount.toLocaleString("id-ID")} R$</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-white font-sans text-sm">
                    {formatRupiah(o.price)}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {o.createdAt}
                  </div>
                </div>
              </div>

              {/* Card Bottom: Status Pill */}
              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">
                  Status Bayar:
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    o.status === "completed"
                      ? "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                      : o.status === "processing"
                      ? "bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/40"
                      : o.status === "pending"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                >
                  {o.status === "completed"
                    ? "Lunas ✓"
                    : o.status === "processing"
                    ? "Sedang Diproses"
                    : o.status === "pending"
                    ? "Menunggu Bayar"
                    : "Dibatalkan"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP VIEW: Full Data Table (Visible on md+) */}
        <div className="hidden md:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#070918] border-b border-white/[0.05] text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 whitespace-nowrap">Invoice</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Pelanggan</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Produk</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Channel</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Nominal</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Status Bayar</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#ff1b7a] whitespace-nowrap font-['Orbitron',sans-serif]">
                    {o.orderNumber}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-200 whitespace-nowrap">
                    @{o.robloxUsername}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-200 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <span>{o.robuxAmount.toLocaleString("id-ID")} R$</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap ${
                        o.paymentSource === "WEBSITE"
                          ? "bg-pink-500/20 text-[#ff1b7a] border border-pink-500/40"
                          : "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40"
                      }`}
                    >
                      {o.paymentSource}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-white font-sans whitespace-nowrap">
                    {formatRupiah(o.price)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-black leading-none whitespace-nowrap ${
                        o.status === "completed"
                          ? "bg-emerald-500/20 text-[#00e676] border border-emerald-500/40 shadow-[0_0_8px_rgba(0,230,118,0.2)]"
                          : o.status === "processing"
                          ? "bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/40 shadow-[0_0_8px_rgba(0,210,255,0.2)]"
                          : o.status === "pending"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                      }`}
                    >
                      {o.status === "completed"
                        ? "Lunas"
                        : o.status === "processing"
                        ? "Verifikasi"
                        : o.status === "pending"
                        ? "Belum Bayar"
                        : "Batal"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-medium whitespace-nowrap">
                    {o.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
