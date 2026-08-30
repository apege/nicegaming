import React from "react";
import Image from "next/image";
import { ADMIN_PHONE } from "@/constants";

export default function FloatingWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Speech Bubble */}
      <div className="hidden sm:flex items-center bg-[#0d0f28]/95 backdrop-blur-md border border-pink-500/40 rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(255,27,122,0.3)] animate-float">
        <div className="text-left">
          <p className="text-[10px] font-bold text-[#ff1b7a] uppercase tracking-wider">Butuh Bantuan?</p>
          <p className="text-xs font-semibold text-white">Chat admin sekarang!</p>
        </div>
      </div>

      {/* Mascot Avatar Button */}
      <a
        href={`https://wa.me/${ADMIN_PHONE}?text=Halo%20Admin%20NiceGaming,%20saya%20butuh%20bantuan.`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff1b7a] to-[#00d2ff] p-0.5 shadow-[0_0_25px_rgba(255,27,122,0.6)] hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer"
        aria-label="Chat WhatsApp Admin"
      >
        <div className="w-full h-full rounded-full bg-[#070714] flex items-center justify-center overflow-hidden p-1">
          <Image
            src="/logo.png"
            alt="CS Admin"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        {/* Active Status Ping */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00e676] border-2 border-[#070714]"></span>
      </a>
    </div>
  );
}
