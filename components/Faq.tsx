"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/constants";

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 py-16 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-400 uppercase tracking-wider">
            Bantuan &amp; Tanya Jawab
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            FREQUENTLY ASKED <span className="text-[#ff1b7a]">QUESTIONS</span>
          </h3>
          <p className="text-sm text-gray-400">
            Pertanyaan yang sering diajukan seputar layanan NiceGaming.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#0f1233] border-pink-500/50 shadow-[0_0_15px_rgba(255,27,122,0.15)]"
                    : "glass-card border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-bold text-xs sm:text-base text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#ff1b7a] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
