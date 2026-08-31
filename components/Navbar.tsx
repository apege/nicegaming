"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  storeName?: string;
}

export function formatStoreNameParts(name: string) {
  if (!name) return { prefix: "NICE", suffix: "GAMING" };
  const trimmed = name.trim();
  if (trimmed.includes(" ")) {
    const parts = trimmed.split(" ");
    return {
      prefix: parts[0].toUpperCase(),
      suffix: parts.slice(1).join(" ").toUpperCase(),
    };
  }
  const match = trimmed.match(/^([A-Z]?[a-z]+)([A-Z].*)$/);
  if (match) {
    return {
      prefix: match[1].toUpperCase(),
      suffix: match[2].toUpperCase(),
    };
  }
  if (trimmed.length > 4) {
    const mid = Math.ceil(trimmed.length / 2);
    return {
      prefix: trimmed.substring(0, mid).toUpperCase(),
      suffix: trimmed.substring(mid).toUpperCase(),
    };
  }
  return {
    prefix: trimmed.toUpperCase(),
    suffix: "",
  };
}

export default function Navbar({ storeName = "NiceGaming" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { prefix, suffix } = formatStoreNameParts(storeName);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070714]/90 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt={`${storeName} Logo`}
              width={44}
              height={44}
              className="object-contain drop-shadow-[0_0_12px_rgba(255,27,122,0.6)] group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ff1b7a] font-['Orbitron',sans-serif]">
              {prefix}
              {suffix && <span className="text-[#00d2ff]"> {suffix}</span>}
            </span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 tracking-widest font-semibold uppercase -mt-0.5 sm:-mt-1">
              Top Up Game Store
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="relative text-sm font-bold tracking-wider text-[#ff1b7a] transition-colors py-1 group"
          >
            BERANDA
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff1b7a] to-[#00d2ff] shadow-[0_0_8px_#ff1b7a]"></span>
          </a>
          <a
            href="#topup"
            className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#00d2ff]"
          >
            TOP UP
          </a>
          <a
            href="#cara-order"
            className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#ff1b7a]"
          >
            CARA ORDER
          </a>
          <a
            href="#testimoni"
            className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#00d2ff]"
          >
            TESTIMONI
          </a>
          <a
            href="#faq"
            className="text-sm font-semibold tracking-wider text-gray-300 hover:text-white transition-colors py-1 hover:text-[#ff1b7a]"
          >
            FAQ
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c20]/95 backdrop-blur-2xl border-b border-pink-500/20 px-6 py-5 space-y-4 animate-fadeIn">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-[#ff1b7a]"
          >
            BERANDA
          </a>
          <a
            href="#topup"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-300 hover:text-[#00d2ff]"
          >
            TOP UP
          </a>
          <a
            href="#cara-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-300 hover:text-[#ff1b7a]"
          >
            CARA ORDER
          </a>
          <a
            href="#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-300 hover:text-[#00d2ff]"
          >
            TESTIMONI
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-gray-300 hover:text-[#ff1b7a]"
          >
            FAQ
          </a>
        </div>
      )}
    </header>
  );
}
