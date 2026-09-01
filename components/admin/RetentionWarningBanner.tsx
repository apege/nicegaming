"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  DownloadCloud,
  ShieldAlert,
  Loader2,
  FileArchive,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function RetentionWarningBanner() {
  const [data, setData] = useState<{
    totalActiveProofs: number;
    expiringCount: number;
    purgedCount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function checkRetention() {
      try {
        const res = await fetch(`/api/retention?_t=${Date.now()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error("Error checking retention:", e);
      } finally {
        setIsLoading(false);
      }
    }
    checkRetention();
  }, []);

  const handleDownloadZip = async (scope: "expiring" | "all" = "expiring") => {
    setIsDownloading(true);
    try {
      const url = `/api/retention/export-zip?scope=${scope}&_t=${Date.now()}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Arsip_Bukti_Transfer_${scope}_${new Date().toISOString().split("T")[0]}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Gagal mengunduh file ZIP arsip bukti transfer.");
    } finally {
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  if (isLoading || !data) return null;

  const hasExpiring = data.expiringCount > 0;

  return (
    <div className="space-y-3">
      {/* ⚠️ 7-Day Expiring Warning Banner (Visible when Day 83-90 proofs exist) */}
      {hasExpiring && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-[#0b0e24] border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.4)] mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider font-['Orbitron',sans-serif]">
                    PERINGATAN RETENSI 90 HARI: {data.expiringCount} BUKTI AKAN DIHAPUS DALAM 7 HARI!
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Hari ke-83 s/d 90
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                  Untuk menjaga kapasitas database tetap hemat dan di bawah 1GB, foto bukti transfer otomatis dibersihkan setelah 90 hari. Data nomor invoice & riwayat transaksi tetap tersimpan permanen.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center w-full sm:w-auto">
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => handleDownloadZip("expiring")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyiapkan ZIP...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Download Backup ZIP ({data.expiringCount} Foto)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ General Storage Retention Policy Info & Manual Backup Button */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070918]/80 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#00d2ff] shrink-0" />
          <span>
            <strong className="text-white">Kebijakan Retensi 90 Hari Aktif:</strong> Foto bukti transfer otomatis dibersihkan pada hari ke-90 • Testimoni & ulasan toko tersimpan permanen.
          </span>
        </div>

        {data.totalActiveProofs > 0 && (
          <button
            type="button"
            disabled={isDownloading}
            onClick={() => handleDownloadZip("all")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d2ff] hover:text-white hover:underline cursor-pointer shrink-0 self-end sm:self-center"
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span>Unduh Semua Bukti Aktif ({data.totalActiveProofs} Foto .ZIP)</span>
          </button>
        )}
      </div>
    </div>
  );
}
