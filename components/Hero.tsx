"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Zap, ShieldCheck, Flame } from "lucide-react";

interface HeroProps {
  isPromoActive?: boolean;
  promoRobux?: string;
  promoPrice?: string;
  promoNormalPrice?: string;
  promoEndDate?: string;
}

export default function Hero({
  isPromoActive = true,
  promoRobux = "2.200",
  promoPrice = "45.000",
  promoNormalPrice = "55.000",
  promoEndDate = "05 September 2026",
}: HeroProps) {
  return (
    <section className="relative z-10 pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (Hero Text & CTA) */}
          <div className="lg:col-span-7 space-y-6 text-left relative">
            
            {/* Mobile Ambient Watermark Logo */}
            <div className="lg:hidden absolute -right-4 -top-6 w-48 h-48 sm:w-60 sm:h-60 pointer-events-none opacity-25 filter drop-shadow-[0_0_25px_rgba(255,27,122,0.6)] z-0">
              <Image
                src="/logo.png"
                alt="NiceGaming Background Watermark"
                width={240}
                height={240}
                className="object-contain w-full h-full"
                priority
              />
            </div>

            {/* Main Headline */}
            <div className="space-y-1 relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-wide uppercase font-['Orbitron',sans-serif]">
                <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  TOP UP GAME
                </span>
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-wide uppercase leading-tight">
                <span className="text-[#ff1b7a] drop-shadow-[0_0_20px_rgba(255,27,122,0.8)]">
                  AMAN,{" "}
                </span>
                <span className="text-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.8)]">
                  CEPAT{" "}
                </span>
                <span className="text-white">&amp; TERPERCAYA</span>
              </h2>
            </div>

            {/* Dynamic Description & Promo Headline */}
            <div className="relative z-10">
              {isPromoActive ? (
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/35 text-[11px] font-black uppercase text-[#ff1b7a] shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                    <Flame className="w-3.5 h-3.5 text-[#ff1b7a]" />
                    <span>Promo Spesial Hari Ini</span>
                  </div>
                  <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                    ⚡ Dapatkan promo spesial <span className="text-white font-extrabold">{promoRobux} Robux</span> cuma{" "}
                    <span className="text-[#00e676] font-black">Rp {promoPrice}</span>{" "}
                    <span className="line-through text-gray-400 text-xs sm:text-sm">Rp {promoNormalPrice}</span>. Berlaku hingga{" "}
                    <span className="text-amber-300 font-bold">{promoEndDate}</span> hanya di{" "}
                    <span className="text-white font-bold">NiceGaming</span>.
                  </p>
                </div>
              ) : (
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  Top up game favoritmu dengan harga terbaik, proses cepat, dan aman 100% di{" "}
                  <span className="text-white font-bold">NiceGaming</span>.
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 relative z-10">
              <a
                href="#topup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase text-white neon-btn-pink w-full sm:w-auto cursor-pointer"
              >
                <span>TOP UP SEKARANG</span>
                <ArrowRight size={16} className="stroke-[3]" />
              </a>
              <a
                href="#topup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-200 bg-[#12142d]/80 border border-white/15 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all duration-300 w-full sm:w-auto cursor-pointer"
              >
                <span>LIHAT HARGA</span>
                <ChevronDown size={16} />
              </a>
            </div>

            {/* Green Trust Features */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs sm:text-sm font-semibold text-gray-300 relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                <span className="text-[11px] sm:text-xs">Online 24 Jam</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                <span className="text-[11px] sm:text-xs">Proses Otomatis</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                <span className="text-[11px] sm:text-xs">Legal &amp; Aman</span>
              </div>
            </div>
          </div>

          {/* Right Column (Hero 3D Mascot & Logo Visual - Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Cybernetic Outer Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 animate-pulse-slow"></div>
              <div className="absolute inset-4 rounded-full border border-cyan-500/30"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/10 to-cyan-500/20 blur-xl"></div>
              
              {/* Glowing Aura */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#ff1b7a]/40 to-[#00d2ff]/40 blur-3xl"></div>

              {/* Main Logo Image */}
              <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center animate-float">
                <Image
                  src="/logo.png"
                  alt="NiceGaming Mascot & Logo"
                  width={400}
                  height={400}
                  className="object-contain drop-shadow-[0_0_35px_rgba(255,27,122,0.85)] filter"
                  priority
                />
              </div>

              {/* Decorative Cyber Badges around hero image */}
              <div className="absolute -bottom-3 left-4 bg-[#0d0f28]/90 backdrop-blur-md border border-cyan-500/40 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                <Zap size={18} className="text-[#00d2ff]" />
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Kecepatan</p>
                  <p className="text-xs font-bold text-white">1-5 Menit Masuk</p>
                </div>
              </div>

              <div className="absolute top-4 -right-2 bg-[#0d0f28]/90 backdrop-blur-md border border-pink-500/40 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,27,122,0.3)]">
                <ShieldCheck size={18} className="text-[#ff1b7a]" />
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Keamanan</p>
                  <p className="text-xs font-bold text-white">100% Legal &amp; Anti Banned</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
