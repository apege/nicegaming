"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Sparkles } from "lucide-react";
import { TestimonialItem } from "@/types";

interface TestimonialsProps {
  storeName?: string;
}

export default function Testimonials({ storeName = "NiceGaming" }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: TestimonialItem[] = json.data.map((row: any) => {
            let adminReplyText: string | undefined = undefined;
            if (row.admin_reply) {
              if (typeof row.admin_reply === "object") {
                adminReplyText = row.admin_reply.message;
              } else if (typeof row.admin_reply === "string") {
                adminReplyText = row.admin_reply;
              }
            }

            return {
              name: row.name,
              role: row.order_code ? `Order ${row.order_code} • Verified Buyer` : "Verified Buyer",
              avatarText: (row.name || "UG").substring(0, 2).toUpperCase(),
              avatarGradient: "from-[#ff1b7a] to-[#00d2ff]",
              comment: row.message,
              rating: Number(row.rating) || 5,
              adminReply: adminReplyText,
            };
          });
          setTestimonials(mapped);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  // If there are no reviews yet in the database, don't show mock data
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimoni"
      className="relative z-10 pt-20 pb-28 lg:pt-24 lg:pb-36 scroll-mt-20 bg-[#090b24]/60 border-y border-white/5 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ulasan Pelanggan Terverifikasi</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            APA KATA <span className="text-[#00d2ff]">MEREKA?</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Ribuan gamers sudah mempercayakan kebutuhan top up Roblox mereka di {storeName}. Semua ulasan berasal dari transaksi pembeli terverifikasi 100%.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-4">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-3xl p-6 sm:p-7 border border-pink-500/20 flex flex-col justify-between space-y-5 hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(255,27,122,0.15)] transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;{item.comment}&rdquo;
                </p>

                {/* Verified Admin Reply Card */}
                {item.adminReply && (
                  <div className="p-3.5 rounded-2xl bg-[#070918]/90 border border-cyan-500/30 text-xs space-y-1.5 shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#00d2ff]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span>Balasan Admin {storeName}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatarGradient} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-[0_0_12px_rgba(255,27,122,0.3)]`}
                >
                  {item.avatarText}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                  <p className="text-[10px] text-gray-400 truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
