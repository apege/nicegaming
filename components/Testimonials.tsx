import React from "react";
import { Star, ShieldCheck } from "lucide-react";
import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
  return (
    <section id="testimoni" className="relative z-10 py-16 scroll-mt-24 bg-[#090b24]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Ulasan Pelanggan
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            APA KATA <span className="text-[#00d2ff]">MEREKA?</span>
          </h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Ribuan gamers sudah mempercayakan kebutuhan top up Roblox mereka di NiceGaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl p-5 sm:p-6 border border-pink-500/20 flex flex-col justify-between space-y-4 hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(255,27,122,0.15)] transition-all"
            >
              <div className="space-y-3.5">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;{item.comment}&rdquo;
                </p>

                {/* Verified Admin Reply Card */}
                {item.adminReply && (
                  <div className="p-3.5 rounded-2xl bg-[#070918]/90 border border-cyan-500/30 text-xs space-y-1.5 shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#00d2ff]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span>Balasan Admin NiceGaming</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatarGradient} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.3)]`}
                >
                  {item.avatarText}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{item.name}</h5>
                  <p className="text-[10px] text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
