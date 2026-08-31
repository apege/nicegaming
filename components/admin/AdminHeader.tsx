"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, LogOut } from "lucide-react";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileSidebar: () => void;
  onLogout?: () => void;
  storeName?: string;
}

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onLogout,
  storeName = "NiceGaming",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#070918]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-white/10 bg-[#0e122b] text-gray-300 hover:bg-pink-500/20 hover:text-white transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari order, username, ID..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#0e122b] border border-white/[0.08] rounded-full focus:outline-hidden focus:border-[#ff1b7a] focus:bg-[#131838] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-400 text-white"
          />
        </div>
      </div>

      {/* Right: Admin Profile & Logout */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-white/10">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#ff1b7a] shadow-[0_0_12px_rgba(255,27,122,0.5)] bg-[#0e122b]">
            <Image
              src="/logo.png"
              alt="Admin Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-black text-white leading-tight">
              Admin {storeName}
            </div>
            <div className="text-[11px] font-black text-[#00d2ff] tracking-wide">
              Super Admin
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Link
          href="/"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 text-[#ff1b7a] hover:bg-[#ff1b7a] hover:text-white text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Link>
      </div>
    </header>
  );
}
