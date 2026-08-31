"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ADMIN_PHONE } from "@/constants";
import { formatStoreNameParts } from "./Navbar";

interface FooterProps {
  adminWhatsapp?: string;
  storeName?: string;
}

// Clean Instagram Icon Component
const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer({ adminWhatsapp, storeName = "NiceGaming" }: FooterProps) {
  const targetPhone = (adminWhatsapp || ADMIN_PHONE).replace(/[^0-9]/g, "");

  const { prefix, suffix } = formatStoreNameParts(storeName);

  return (
    <footer id="kontak" className="relative z-10 bg-[#04050d] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Information */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`${storeName} Logo`}
                width={44}
                height={44}
                className="object-contain"
              />
              <span className="font-extrabold text-xl tracking-wider text-white font-['Orbitron',sans-serif]">
                {prefix}
                {suffix && <span className="text-[#00d2ff]"> {suffix}</span>}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Platform top up game tercepat, termurah, dan 100% terpercaya di Indonesia. Dapatkan pengalaman transaksi instan dengan garansi legal.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-[#ff1b7a] transition-all"
                aria-label="Instagram NiceGaming"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={`https://wa.me/${targetPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#00e676]/50 hover:bg-[#00e676]/10 hover:text-[#00e676] transition-all"
                aria-label="WhatsApp NiceGaming"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              NAVIGASI
            </h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-[#ff1b7a] transition-colors">Beranda</a></li>
              <li><a href="#topup" className="hover:text-[#ff1b7a] transition-colors">Top Up Robux</a></li>
              <li><a href="#cara-order" className="hover:text-[#ff1b7a] transition-colors">Cara Order</a></li>
              <li><a href="#testimoni" className="hover:text-[#ff1b7a] transition-colors">Testimoni Pelanggan</a></li>
              <li><a href="#faq" className="hover:text-[#ff1b7a] transition-colors">FAQ / Bantuan</a></li>
              <li><a href="/admin" className="hover:text-[#00d2ff] transition-colors font-medium">Panel Admin</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              HUBUNGI KAMI
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              Layanan Customer Support kami beroperasi 24 Jam nonstop setiap hari untuk membantu seluruh transaksi dan pertanyaan Anda.
            </p>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <p>&copy; {new Date().getFullYear()} {storeName}. All Rights Reserved.</p>
          <p className="text-gray-400">
            Roblox is a registered trademark of Roblox Corporation. {storeName} is an independent service.
          </p>
        </div>
      </div>
    </footer>
  );
}
