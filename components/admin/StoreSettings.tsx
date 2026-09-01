"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Trash2,
  FileCheck,
  ImageIcon,
} from "lucide-react";
import { AdminStoreSettings } from "@/types/admin";
import CustomDatePicker from "./CustomDatePicker";

interface StoreSettingsProps {
  settings: AdminStoreSettings;
  onSave: (settings: AdminStoreSettings) => void;
}

// Client-side WebP Compressor
async function compressImageToWebp(
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Canvas context is null"));
        }

        ctx.drawImage(img, 0, 0, width, height);

        let webpData = canvas.toDataURL("image/webp", quality);
        if (!webpData.startsWith("data:image/webp")) {
          webpData = canvas.toDataURL("image/png");
        }

        resolve(webpData);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
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
    qrisImagePath: initialSettings.qrisImagePath,
    logoImagePath: initialSettings.logoImagePath,
  });

  // Accordion state
  const [openSections, setOpenSections] = useState<{
    identity: boolean;
    promo: boolean;
    qris: boolean;
  }>({
    identity: true,
    promo: true,
    qris: true,
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

  // QRIS & Logo Assets State
  const [qrisPreview, setQrisPreview] = useState<string | null>(
    initialSettings.qrisImagePath || null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialSettings.logoImagePath || null
  );
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const qrisInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state whenever props from parent update
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
        qrisImagePath: initialSettings.qrisImagePath,
        logoImagePath: initialSettings.logoImagePath,
      });

      if (initialSettings.promoRobux) setPromoRobux(initialSettings.promoRobux);
      if (initialSettings.promoPrice) setPromoPrice(initialSettings.promoPrice);
      if (initialSettings.promoNormalPrice)
        setPromoNormalPrice(initialSettings.promoNormalPrice);
      if (initialSettings.promoEndDate)
        setPromoEndDate(initialSettings.promoEndDate);
      if (initialSettings.isPromoActive !== undefined)
        setIsPromoActive(initialSettings.isPromoActive);

      if (initialSettings.qrisImagePath !== undefined)
        setQrisPreview(initialSettings.qrisImagePath || null);
      if (initialSettings.logoImagePath !== undefined)
        setLogoPreview(initialSettings.logoImagePath || null);
    }
  }, [initialSettings]);

  const handleQrisFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (PNG, JPG, WEBP) yang diperbolehkan!");
      return;
    }

    setIsUploadingQris(true);
    try {
      const webpData = await compressImageToWebp(file, 800, 0.85);
      setQrisPreview(webpData);
      setFormData((prev) => ({ ...prev, qrisImagePath: webpData }));
    } catch (err) {
      console.error("QRIS compression error:", err);
      alert("Gagal memproses gambar QRIS.");
    } finally {
      setIsUploadingQris(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (PNG, JPG, WEBP) yang diperbolehkan!");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const webpData = await compressImageToWebp(file, 500, 0.9);
      setLogoPreview(webpData);
      setFormData((prev) => ({ ...prev, logoImagePath: webpData }));
    } catch (err) {
      console.error("Logo compression error:", err);
      alert("Gagal memproses gambar logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveQris = () => {
    setQrisPreview(null);
    setFormData((prev) => ({ ...prev, qrisImagePath: undefined }));
    if (qrisInputRef.current) qrisInputRef.current.value = "";
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logoImagePath: undefined }));
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

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
      qrisImagePath: qrisPreview || undefined,
      logoImagePath: logoPreview || undefined,
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
    <div className="space-y-5 sm:space-y-8 animate-fadeIn max-w-5xl">
      {/* Header with Toggle All Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 leading-relaxed">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAllSections}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#0b0e24] border border-white/[0.1] text-xs font-bold text-gray-300 hover:text-white hover:border-[#ff1b7a] transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#ff1b7a]" />
          <span>{allOpen ? "Tutup Semua Section" : "Buka Semua Section"}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#00e676] text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-[0_0_15px_rgba(0,230,118,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
          <span>Pengaturan toko berhasil disimpan ke database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* ========================================================================= */}
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all overflow-hidden">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("identity")}
            className="p-4 sm:p-6 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,27,122,0.3)]">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wider truncate">
                  IDENTITAS TOKO & KONTAK
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate sm:whitespace-normal">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
              {openSections.identity ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.identity && (
            <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-2">
                {/* Field 1: Nama Toko */}
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
                    Nama Toko (Navbar Pelanggan)
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    placeholder="NiceGaming"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
                  />
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    Tampil di navbar web utama (Nice berwarna putih, Gaming berwarna cyan/pink).
                  </p>
                </div>

                {/* Field 2: Nomor WhatsApp Admin CS */}
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
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
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a] focus:ring-2 focus:ring-[#ff1b7a]/30 transition-all placeholder:text-gray-500"
                  />
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5 leading-relaxed">
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
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all overflow-hidden">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("promo")}
            className="p-4 sm:p-6 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wider">
                    PROMO BANNER
                  </h3>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isPromoActive
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : "bg-white/5 text-gray-400 border-white/10"
                    }`}
                  >
                    {isPromoActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate sm:whitespace-normal">
                  Atur paket promo banner hero website
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Promo Info Badge on Desktop */}
              <div
                className={`hidden lg:inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                  isPromoActive
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    : "bg-white/5 text-gray-400 border-white/10"
                }`}
              >
                <span>
                  {promoRobux} Robux (Rp {promoPrice})
                </span>
              </div>

              {/* Toggle Switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPromoActive(!isPromoActive);
                }}
                className={`w-10 sm:w-11 h-5 sm:h-6 flex items-center rounded-full p-0.5 sm:p-1 cursor-pointer transition-colors ${
                  isPromoActive ? "bg-[#ff1b7a]" : "bg-white/20"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isPromoActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                {openSections.promo ? (
                  <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.promo && (
            <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-2">
                <div>
                  <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
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
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
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
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
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
                    className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-[#ff1b7a] focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                  />
                </div>

                {/* Tanggal Berakhir Promo */}
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
                <label className="block text-xs font-black text-gray-300 mb-1.5 sm:mb-2">
                  Teks Subtitle Banner Promo
                </label>
                <input
                  type="text"
                  value={formData.noticeBanner}
                  onChange={(e) =>
                    setFormData({ ...formData, noticeBanner: e.target.value })
                  }
                  placeholder="⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!"
                  className="w-full px-4 py-3 bg-[#070918] border border-white/[0.1] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: PEMBAYARAN QRIS & ASSET TOKO */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e24]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/[0.08] shadow-xs relative z-10 transition-all overflow-hidden">
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection("qris")}
            className="p-4 sm:p-6 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-[#00d2ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.3)]">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-wider truncate">
                  PEMBAYARAN QRIS & ASSET TOKO
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate sm:whitespace-normal">
                  Barcode QRIS pembayaran otomatis dan logo toko
                </p>
              </div>
            </div>

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
              {openSections.qris ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </div>
          </div>

          {/* Accordion Content */}
          {openSections.qris && (
            <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-white/[0.05] animate-fadeIn">
              {/* Hidden File Inputs */}
              <input
                type="file"
                ref={qrisInputRef}
                onChange={handleQrisFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-2">
                {/* 1. QRIS Upload & Preview Box */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#070918] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      Barcode QRIS Toko
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        qrisPreview
                          ? "text-[#00e676] bg-emerald-500/20 border-emerald-500/40"
                          : "text-amber-400 bg-amber-500/20 border-amber-500/40"
                      }`}
                    >
                      {qrisPreview ? "Custom QRIS Terpasang" : "QRIS Default"}
                    </span>
                  </div>

                  {!qrisPreview ? (
                    <div
                      onClick={() => !isUploadingQris && qrisInputRef.current?.click()}
                      className="border border-dashed border-white/20 rounded-xl p-5 text-center hover:border-[#ff1b7a] hover:bg-[#0c0e24] transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      {isUploadingQris ? (
                        <>
                          <Loader2 className="w-7 h-7 text-[#ff1b7a] animate-spin" />
                          <span className="text-xs font-bold text-[#ff1b7a]">
                            Mengompres & Mengunggah...
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                          <span className="text-xs font-bold text-gray-300">
                            Klik untuk upload Barcode QRIS
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Format PNG, JPG atau WEBP (Otomatis Terkompres)
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#0b0e24] border border-emerald-500/40 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,230,118,0.15)] animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-emerald-500/50 bg-white p-1 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={qrisPreview}
                            alt="QRIS Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">
                            Barcode QRIS Toko
                          </p>
                          <p className="text-[10px] text-[#00e676] font-semibold mt-0.5">
                            Siap digunakan di modal pembayaran
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => qrisInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Ganti
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveQris}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
                          title="Hapus QRIS Custom"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Logo Store Upload & Preview Box */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#070918] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      Logo Toko ({formData.storeName})
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        logoPreview
                          ? "text-[#ff1b7a] bg-pink-500/20 border-pink-500/40"
                          : "text-cyan-400 bg-cyan-500/20 border-cyan-500/40"
                      }`}
                    >
                      {logoPreview ? "Logo Custom" : "Logo Default"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0b0e24] border border-pink-500/40 p-2 shrink-0 shadow-[0_0_15px_rgba(255,27,122,0.3)] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview || "/logo.png"}
                        alt="Store Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div
                      onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                      className="border border-dashed border-white/20 rounded-xl p-3 text-center hover:border-[#00d2ff] hover:bg-[#0c0e24] transition-all cursor-pointer flex-1 flex flex-col items-center justify-center gap-1"
                    >
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="w-5 h-5 text-[#00d2ff] animate-spin" />
                          <span className="text-xs font-bold text-[#00d2ff]">
                            Memproses Logo...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-gray-300">
                            {logoPreview ? "Ganti File Logo" : "Upload Logo Baru"}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Rekomendasi PNG Transparan / WEBP
                          </span>
                        </>
                      )}
                    </div>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer shrink-0"
                        title="Reset Logo Default"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating/Bottom Save Button */}
        <div className="flex justify-end pt-2 sm:pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_25px_rgba(255,27,122,0.6)] hover:scale-[1.02] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
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
