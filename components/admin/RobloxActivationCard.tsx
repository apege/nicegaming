"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Lock,
  Lightbulb,
  Zap,
  Pencil,
  CheckCircle2,
  X,
} from "lucide-react";

interface RobloxActivationCardProps {
  initialUsername?: string;
  initialFee?: number;
  onActivateSuccess?: (username: string, fee: number) => void;
}

export default function RobloxActivationCard({
  initialUsername = "saprii09",
  initialFee = 97000,
  onActivateSuccess,
}: RobloxActivationCardProps) {
  const [username, setUsername] = useState(initialUsername);
  const [fee, setFee] = useState(initialFee);
  const [isActivated, setIsActivated] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [tempUsername, setTempUsername] = useState(username);
  const [tempFee, setTempFee] = useState(fee.toString());

  const handleOpenEdit = () => {
    setTempUsername(username);
    setTempFee(fee.toString());
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = tempUsername.replace(/^@/, "").trim() || "saprii09";
    const cleanFee = parseInt(tempFee.replace(/\D/g, ""), 10) || 97000;
    setUsername(cleanUser);
    setFee(cleanFee);
    setIsActivated(false);
    setEditModalOpen(false);
  };

  const handleActivate = () => {
    setIsActivated(true);
    if (onActivateSuccess) {
      onActivateSuccess(username, fee);
    }
  };

  return (
    <>
      <div className="bg-[#0a0d24]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.15)] relative overflow-hidden transition-all">
        {/* Ambient Red Glow Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-rose-600/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-4 sm:space-y-5">
          {/* Header Warning Title matching Image 1 */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center gap-2 text-rose-500 text-xs sm:text-sm font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>PERINGATAN!</span>
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide font-['Orbitron',sans-serif]">
              ID ROBLOX BELUM AKTIF
            </h2>
          </div>

          {/* Target User Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070918] border border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                TARGET USER:
              </span>
              <span className="text-rose-500 font-black text-sm sm:text-base">
                @{username}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-rose-400" />
              <span>Ganti</span>
            </button>
          </div>

          {/* 2 Column Box (Aktivasi Diperlukan & Biaya Pengaktifan ID) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Box: Aktivasi Diperlukan */}
            <div className="md:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#0c0e28] border border-rose-500/30 space-y-2.5 shadow-[0_0_15px_rgba(244,63,94,0.08)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  AKTIVASI DIPERLUKAN
                </h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                ID Roblox pada order akun{" "}
                <span className="text-rose-400 font-black">@{username}</span>{" "}
                belum aktif. Silakan aktifkan ID terlebih dahulu untuk melanjutkan
                prosesnya.
              </p>
            </div>

            {/* Right Box: Biaya Pengaktifan ID */}
            <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#0c0e28] border border-rose-500/30 flex flex-col items-center justify-center text-center space-y-1.5 shadow-[0_0_15px_rgba(244,63,94,0.08)]">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-400">
                BIAYA PENGAKTIFAN ID
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] font-sans">
                Rp {fee.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          {/* Catatan Admin Note */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0c0e28] border border-white/[0.08] flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white font-black">Catatan Admin:</strong>{" "}
              Setelah ID @{username} diaktifkan, order dapat langsung diproses
              seperti biasa.
            </p>
          </div>

          {/* Bottom Action Button */}
          {isActivated ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#00e676] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.3)] animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
              <span>ID @{username} Berhasil Diaktifkan & Siap Diproses!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleActivate}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(225,29,72,0.6)] hover:shadow-[0_0_35px_rgba(225,29,72,0.9)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Aktifkan ID @{username} Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* Ganti Target User & Biaya Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-rose-500/40 overflow-hidden z-10 animate-scaleUp">
            <div className="px-6 py-5 border-b border-rose-500/20 bg-[#0e102d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Ubah Data Aktivasi ID
                  </h3>
                  <p className="text-xs text-gray-400">
                    Sesuaikan target username Roblox dan nominal biaya
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-300 mb-1.5 uppercase tracking-wider">
                  Target Username Roblox
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-black text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="saprii09"
                    required
                    className="w-full pl-8 pr-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-300 mb-1.5 uppercase tracking-wider">
                  Biaya Pengaktifan ID (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={tempFee}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setTempFee(digits ? parseInt(digits, 10).toLocaleString("id-ID") : "");
                    }}
                    placeholder="97.000"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-[0_0_20px_rgba(225,29,72,0.6)] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
