import React from "react";
import { ShieldCheck, Zap, Award, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% AMAN",
    desc: "Transaksi aman & terjamin",
    mobileDesc: "Transaksi terjamin",
  },
  {
    icon: Zap,
    title: "PROSES CEPAT",
    desc: "Top up instan dalam hitungan menit",
    mobileDesc: "Instan 1-5 menit",
  },
  {
    icon: Award,
    title: "HARGA TERBAIK",
    desc: "Harga termurah & bersaing",
    mobileDesc: "Termurah & bersaing",
  },
  {
    icon: Headphones,
    title: "LAYANAN 24/7",
    desc: "Admin siap bantu kapan saja",
    mobileDesc: "Admin siap bantu",
  },
];

export default function FeatureBar() {
  return (
    <section className="relative z-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= DESKTOP VIEW (Static 4-Column Divided Bar) ================= */}
        <div className="hidden lg:block bg-[#0b0d25]/85 backdrop-blur-xl border border-pink-500/25 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,27,122,0.12)]">
          <div className="grid grid-cols-4 gap-4 divide-x divide-white/10">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 px-4 ${idx === 0 ? "pl-0" : ""} ${idx === FEATURES.length - 1 ? "pr-0" : ""}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.25)]">
                    <Icon size={22} className="text-[#ff1b7a]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE VIEW (Smooth Auto-Scrolling Horizontal Marquee Slider) ================= */}
        <div className="lg:hidden bg-[#0b0d25]/90 backdrop-blur-xl border border-pink-500/25 rounded-2xl py-3 px-1 overflow-hidden shadow-[0_0_25px_rgba(255,27,122,0.15)] relative">
          {/* Subtle edge fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#0b0d25] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0b0d25] to-transparent z-10 pointer-events-none"></div>

          {/* Continuous Sliding Track */}
          <div className="animate-marquee flex items-center gap-4">
            {/* First Set */}
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`feat-1-${idx}`}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-pink-500/15 shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#ff1b7a]" />
                  </div>
                  <div className="whitespace-nowrap">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white">
                      {item.title}
                    </h4>
                    <p className="text-[9px] text-gray-400">
                      {item.mobileDesc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Duplicate Set for Seamless Infinite Loop */}
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`feat-2-${idx}`}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-pink-500/15 shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#ff1b7a]" />
                  </div>
                  <div className="whitespace-nowrap">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white">
                      {item.title}
                    </h4>
                    <p className="text-[9px] text-gray-400">
                      {item.mobileDesc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
