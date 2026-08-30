"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ShieldCheck, Zap, CreditCard, Sparkles } from "lucide-react";
import { RobuxPackage } from "@/types";
import { ROBUX_PACKAGES } from "@/constants";

interface RobuxCatalogProps {
  selectedPackage: RobuxPackage;
  onSelectPackage: (pkg: RobuxPackage) => void;
}

export default function RobuxCatalog({
  selectedPackage,
  onSelectPackage,
}: RobuxCatalogProps) {
  const [showAllPackages, setShowAllPackages] = useState(false);
  const displayedPackages = showAllPackages ? ROBUX_PACKAGES : ROBUX_PACKAGES.slice(0, 6);

  const handleSelectPackage = (pkg: RobuxPackage) => {
    onSelectPackage(pkg);
    // Smooth scroll to form-order on mobile screens (<1024px)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const formEl = document.getElementById("form-order");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#ff1b7a] bg-pink-500/30"></div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            TOP UP ROBUX
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Pilih paket Robux favoritmu
          </p>
        </div>
      </div>

      {/* Package Grid - 6 Cards in 1 Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 lg:gap-3">
        {displayedPackages.map((pkg) => {
          const isSelected = selectedPackage.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className={`relative group cursor-pointer rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-between text-center transition-all duration-300 min-h-[190px] sm:min-h-[220px] lg:min-h-[235px] ${
                isSelected
                  ? "bg-[#111333] border-2 border-[#ff1b7a] shadow-[0_0_25px_rgba(255,27,122,0.55)] scale-[1.02] z-10"
                  : "bg-[#090b20]/95 border border-pink-500/20 hover:border-pink-500/60 hover:bg-[#0f1130] hover:shadow-[0_0_15px_rgba(255,27,122,0.25)]"
              }`}
            >
              {/* BEST SELLER Badge */}
              {pkg.isBestSeller && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff1b7a] via-[#e91e63] to-[#d81159] text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-white shadow-[0_0_12px_rgba(255,27,122,0.85)] z-20 whitespace-nowrap">
                  BEST SELLER
                </div>
              )}

              {/* Package Header */}
              <div className="space-y-0.5 pt-0.5 w-full">
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-gray-400 uppercase font-sans">
                  ROBUX
                </span>
                <div className="text-xl sm:text-2xl lg:text-[24px] font-black italic tracking-wide text-white font-['Orbitron',sans-serif] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {pkg.robux.toLocaleString()}
                </div>
              </div>

              {/* Robux Coin Icon with Neon Glow */}
              <div className="my-1.5 sm:my-2 relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#00e676]/25 rounded-full blur-lg animate-pulse-slow"></div>
                <Image
                  src="/robux.webp"
                  alt={`${pkg.robux} Robux`}
                  width={65}
                  height={65}
                  className="object-contain relative z-10 drop-shadow-[0_0_12px_rgba(0,230,118,0.85)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Price Pill Tag */}
              <div
                className={`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black tracking-tight transition-all duration-300 whitespace-nowrap ${
                  isSelected
                    ? "bg-[#ff1b7a] text-white shadow-[0_0_15px_rgba(255,27,122,0.7)]"
                    : "bg-[#ff1b7a] text-white group-hover:bg-[#ff2e93] group-hover:shadow-[0_0_10px_rgba(255,27,122,0.5)]"
                }`}
              >
                {pkg.priceFormatted}
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Packages Toggle Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setShowAllPackages(!showAllPackages)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#090b22] border border-white/15 hover:border-pink-500/60 text-xs font-bold tracking-wider uppercase text-gray-200 hover:text-white hover:shadow-[0_0_15px_rgba(255,27,122,0.3)] transition-all cursor-pointer"
        >
          <span>{showAllPackages ? "TAMPILKAN LEBIH SEDIKIT" : "LIHAT SEMUA PAKET"}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              showAllPackages ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Mini Section: Kenapa Pilih NiceGaming */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#ff1b7a] bg-pink-500/30"></div>
          <h4 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            KENAPA PILIH NICEGAMING?
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
            <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
              <ShieldCheck size={18} className="text-[#ff1b7a]" />
            </div>
            <p className="text-xs font-bold text-white">Garansi 100%</p>
            <p className="text-[10px] text-gray-400">Legal &amp; Anti Banned</p>
          </div>

          <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
            <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
              <Zap size={18} className="text-[#ff1b7a]" />
            </div>
            <p className="text-xs font-bold text-white">Proses Instan</p>
            <p className="text-[10px] text-gray-400">Otomatis 1-5 Menit</p>
          </div>

          <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
            <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
              <CreditCard size={18} className="text-[#ff1b7a]" />
            </div>
            <p className="text-xs font-bold text-white">Banyak Pilihan</p>
            <p className="text-[10px] text-gray-400">QRIS, VA &amp; E-Wallet</p>
          </div>

          <div className="glass-card rounded-xl p-3.5 text-center border border-pink-500/20 hover:border-pink-500/40">
            <div className="w-9 h-9 mx-auto rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-2">
              <Sparkles size={18} className="text-[#ff1b7a]" />
            </div>
            <p className="text-xs font-bold text-white">Bonus &amp; Promo</p>
            <p className="text-[10px] text-gray-400">Paling Bersaing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
