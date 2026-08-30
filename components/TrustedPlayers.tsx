import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

export default function TrustedPlayers() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-pink-500/30 flex items-center justify-between shadow-[0_0_20px_rgba(255,27,122,0.15)]">
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 font-['Orbitron',sans-serif]">
          TRUSTED BY PLAYERS
        </h4>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="currentColor" />
            ))}
          </div>
          <span className="text-sm font-black text-white ml-1">4.9/5</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Dari <span className="text-white font-semibold">10.000+</span> transaksi berhasil
        </p>
      </div>

      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
        <CheckCircle2 size={24} className="text-[#00d2ff]" />
      </div>
    </div>
  );
}
