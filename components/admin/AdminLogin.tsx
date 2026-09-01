"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  storeName?: string;
}

export default function AdminLogin({
  onLoginSuccess,
  storeName = "NiceGaming",
}: AdminLoginProps) {
  const [username, setUsername] = useState("admin_nicegaming");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Masukkan password admin!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      if (json.success) {
        onLoginSuccess();
      } else {
        setError(json.error || "Password admin tidak sesuai!");
      }
    } catch (err) {
      setError("Gagal terhubung ke server autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070914] text-white selection:bg-[#ff1b7a] selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-25 z-0" />
      <div className="fixed -top-40 left-1/4 w-[500px] h-[500px] bg-[#ff1b7a]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-10 w-[500px] h-[500px] bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0b0e24]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.1] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fadeIn">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="relative w-20 h-20 rounded-2xl bg-[#0e122b] border-2 border-[#ff1b7a] p-2 flex items-center justify-center shadow-[0_0_25px_rgba(255,27,122,0.45)]">
            <Image
              src="/logo.png"
              alt="NiceGaming Logo"
              width={64}
              height={64}
              className="object-contain"
            />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#ff1b7a] text-white flex items-center justify-center border-2 border-[#0b0e24]">
              <Lock size={13} />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-black text-[#ff1b7a] uppercase tracking-wider mb-1.5">
              <ShieldCheck size={12} />
              <span>Admin Authentication Gate</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
              {storeName} PANEL
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Masukkan kredensial untuk membuka akses kontrol toko
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
              Username Admin
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_nicegaming"
                className="w-full pl-11 pr-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
              Password Admin
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_25px_rgba(255,27,122,0.7)] hover:scale-[1.01] active:scale-[0.99] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akses...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Masuk ke Control Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Storefront Link */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#00d2ff] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Halaman Web Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
