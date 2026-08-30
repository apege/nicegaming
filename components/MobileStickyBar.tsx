"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RobuxPackage } from "@/types";

interface MobileStickyBarProps {
  selectedPackage: RobuxPackage;
}

export default function MobileStickyBar({ selectedPackage }: MobileStickyBarProps) {
  const handleScrollToForm = () => {
    const formEl = document.getElementById("form-order");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#07091c]/95 backdrop-blur-2xl border-t border-pink-500/30 shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Package Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#00e676]/15 border border-[#00e676]/30 flex items-center justify-center shrink-0">
            <Image
              src="/robux.webp"
              alt="Robux"
              width={22}
              height={22}
              className="object-contain drop-shadow-[0_0_6px_#00e676]"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                {selectedPackage.robux} Robux
              </span>
              {selectedPackage.isBestSeller && (
                <span className="px-1.5 py-0.2 rounded bg-[#ff1b7a] text-[8px] font-black uppercase text-white shrink-0">
                  BEST
                </span>
              )}
            </div>
            <p className="text-xs font-extrabold text-[#ff1b7a] leading-tight">
              {selectedPackage.priceFormatted}
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <button
          type="button"
          onClick={handleScrollToForm}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1b7a] via-[#e91e63] to-[#d81159] text-xs font-black uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,27,122,0.6)] flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-transform"
        >
          <span>ORDER SEKARANG</span>
          <ArrowRight size={14} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
