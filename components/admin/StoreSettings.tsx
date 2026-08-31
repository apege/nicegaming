"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Store,
  Flame,
  QrCode,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Save,
  CheckCircle2,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { AdminStoreSettings } from "@/types/admin";
import CustomDatePicker from "./CustomDatePicker";

interface StoreSettingsProps {
  settings: AdminStoreSettings;
  onSave: (settings: AdminStoreSettings) => void;
}

export default function StoreSettings({
  settings: initialSettings,
  onSave,
}: StoreSettingsProps) {
  const [formData, setFormData] = useState<AdminStoreSettings>({
    storeName: initialSettings.storeName || "NiceGaming",
    storeStatus: initialSettings.storeStatus || "open",
    adminWhatsapp: initialSettings.adminWhatsapp || "6282343927560",
    minTopup: initialSettings.minTopup || 80,
    maxTopup: initialSettings.maxTopup || 50000,
    ratePer1k: initialSettings.ratePer1k || 20000,
    noticeBanner:
      initialSettings.noticeBanner ||
      "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
    qrisActive: initialSettings.qrisActive ?? true,
    whatsappOrderActive: initialSettings.whatsappOrderActive ?? true,
  });

  // Accordion state
  const [openSections, setOpenSections] = useState<{
    identity: boolean;
    promo: boolean;
    qris: boolean;
  }>({
    identity: true,
    promo: true,
    qris: false,
  });

  // Promo Banner local fields
  const [promoRobux, setPromoRobux] = useState(
    initialSettings.promoRobux || "2.200"
  );
  const [promoPrice, setPromoPrice] = useState(
    initialSettings.promoPrice || "45.000"
  );
  const [promoNormalPrice, setPromoNormalPrice] = useState(
    initialSettings.promoNormalPrice || "55.000"
  );
  const [promoEndDate, setPromoEndDate] = useState(
    initialSettings.promoEndDate || "2026-09-05"
  );
  const [isPromoActive, setIsPromoActive] = useState(
    initialSettings.isPromoActive ?? true
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever props from parent update (e.g. after database fetch)
  useEffect(() => {
    if (initialSettings) {
      setFormData({
        storeName: initialSettings.storeName || "NiceGaming",
        storeStatus: initialSettings.storeStatus || "open",
        adminWhatsapp: initialSettings.adminWhatsapp || "6282343927560",
        minTopup: initialSettings.minTopup || 80,
        maxTopup: initialSettings.maxTopup || 50000,
        ratePer1k: initialSettings.ratePer1k || 20000,
        noticeBanner:
          initialSettings.noticeBanner ||
          "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
        qrisActive: initialSettings.qrisActive ?? true,
        whatsappOrderActive: initialSettings.whatsappOrderActive ?? true,
      });

      if (initialSettings.promoRobux) setPromoRobux(initialSettings.promoRobux);
      if (initialSettings.promoPrice) setPromoPrice(initialSettings.promoPrice);
      if (initialSettings.promoNormalPrice)
        setPromoNormalPrice(initialSettings.promoNormalPrice);
      if (initialSettings.promoEndDate)
        setPromoEndDate(initialSettings.promoEndDate);
      if (initialSettings.isPromoActive !== undefined)
        setIsPromoActive(initialSettings.isPromoActive);
    }
  }, [initialSettings]);

  const allOpen =
    openSections.identity && openSections.promo && openSections.qris;

  const toggleAllSections = () => {
    if (allOpen) {
      setOpenSections({ identity: false, promo: false, qris: false });
    } else {
      setOpenSections({ identity: true, promo: true, qris: true });
    }
  };

  const toggleSection = (key: "identity" | "promo" | "qris") => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: AdminStoreSettings = {
      ...formData,
      promoRobux,
      promoPrice,
      promoNormalPrice,
      promoEndDate,
      isPromoActive,
    };

    try {
      await onSave(payload);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl">
      {/* Header with Toggle All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAllSections}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0b0e24] border border-white/[0.1] text-xs font-bold text-gray-300 hover:text-white hover:border-[#ff1b7a] transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#ff1b7a]" />
          <span>{allOpen ? "Tutup Semua Section" : "Buka Semua Section"}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#00e676] text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-[0_0_15px_rgba(0,230,118,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
          <span>Pengaturan toko berhasil disimpan ke database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ========================================================================= */}
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("identity")}
            className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-3xl"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,27,122,0.3)]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  IDENTITAS TOKO & KONTAK
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              {openSections.identity ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.identity && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                {/* Field 1: Nama Toko */}
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-2">
                    Nama Toko (Navbar Pelanggan)
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    placeholder="NiceGaming"
                    className="w-full px-5 py-3.5 bg-[#070918] border border-white/[0.1] rounded-2xl text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    Tampil di navbar web utama (Nice berwarna putih, Gaming berwarna cyan/pink).
                  </p>
                </div>

                {/* Field 2: Nomor WhatsApp Admin CS */}
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-2">
                    Nomor WhatsApp Admin CS (Format 62...)
                  </label>
                  <input
                    type="text"
                    value={formData.adminWhatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminWhatsapp: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="6283863946967"
                    className="w-full px-5 py-3.5 bg-[#070918] border border-white/[0.1] rounded-2xl text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    Tujuan konfirmasi order dan tombol bantuan CS pelanggan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: PENGATURAN PROMO BANNER WEB PELANGGAN */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("promo")}
            className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-3xl"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  PENGATURAN PROMO BANNER WEB PELANGGAN
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Atur paket promo yang muncul pada banner hero bagian atas website toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                  isPromoActive
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    : "bg-white/5 text-gray-400 border-white/10"
                }`}
              >
                <span>
                  Promo {isPromoActive ? "Aktif" : "Nonaktif"} • {promoRobux} Robux (Rp {promoPrice})
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPromoActive(!isPromoActive);
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isPromoActive ? "bg-[#ff1b7a]" : "bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPromoActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                {openSections.promo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.promo && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-2">
                    Nominal Robux Promo
                  </label>
                  <input
                    type="text"
                    value={promoRobux}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setPromoRobux(
                        digits ? parseInt(digits, 10).toLocaleString("id-ID") : ""
                      );
                    }}
                    placeholder="2.200"
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-300 mb-2">
                    Harga Normal / Coret (Rp)
                  </label>
                  <input
                    type="text"
                    value={promoNormalPrice}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setPromoNormalPrice(
                        digits ? parseInt(digits, 10).toLocaleString("id-ID") : ""
                      );
                    }}
                    placeholder="55.000"
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-300 mb-2">
                    Harga Promo (Rp)
                  </label>
                  <input
                    type="text"
                    value={promoPrice}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setPromoPrice(
                        digits ? parseInt(digits, 10).toLocaleString("id-ID") : ""
                      );
                    }}
                    placeholder="45.000"
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-[#ff1b7a] focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                {/* Field Baru: Tanggal Berakhir Promo dengan Custom Date Picker */}
                <div>
                  <CustomDatePicker
                    value={promoEndDate}
                    onChange={setPromoEndDate}
                    label="Tanggal Berakhir Promo"
                  />
                </div>
              </div>

              {/* Teks Subtitle Banner Promo */}
              <div>
                <label className="block text-xs font-black text-gray-300 mb-2">
                  Teks Subtitle Banner Promo
                </label>
                <input
                  type="text"
                  value={formData.noticeBanner}
                  onChange={(e) =>
                    setFormData({ ...formData, noticeBanner: e.target.value })
                  }
                  placeholder="⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!"
                  className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: PEMBAYARAN QRIS & ASSET TOKO */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("qris")}
            className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-3xl"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-[#00d2ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.3)]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  PEMBAYARAN QRIS & ASSET TOKO
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Barcode QRIS pembayaran otomatis dan logo toko
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              {openSections.qris ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.qris && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                {/* QRIS Upload Box */}
                <div className="p-5 rounded-2xl bg-[#070918] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      Barcode QRIS Dinamis
                    </span>
                    <span className="text-[10px] font-bold text-[#00e676] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Aktif
                    </span>
                  </div>
                  <div className="border border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[#ff1b7a] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                    <span className="text-xs font-bold text-gray-300">
                      Klik untuk ganti Barcode QRIS
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Format PNG, JPG atau SVG (Maks. 2MB)
                    </span>
                  </div>
                </div>

                {/* Logo Store Upload / Preview Box */}
                <div className="p-5 rounded-2xl bg-[#070918] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      Logo Storefront (NiceGaming)
                    </span>
                    <span className="text-[10px] font-bold text-[#ff1b7a] bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/40">
                      Terpasang
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-[#0b0e24] border border-pink-500/40 p-2 shrink-0 shadow-[0_0_15px_rgba(255,27,122,0.3)]">
                      <Image
                        src="/logo.png"
                        alt="NiceGaming Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="border border-dashed border-white/20 rounded-xl p-3 text-center hover:border-[#00d2ff] transition-colors cursor-pointer flex-1 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-gray-300">
                        Ganti File Logo
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Rekomendasi PNG Transparan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating/Bottom Save Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_25px_rgba(255,27,122,0.6)] hover:scale-[1.02] text-white font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
