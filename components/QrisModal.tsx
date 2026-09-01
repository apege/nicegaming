"use client";

import React, { useState, useRef } from "react";
import {
  X,
  QrCode,
  CheckCircle2,
  UploadCloud,
  ImageIcon,
  Trash2,
  AlertCircle,
  Loader2,
  FileCheck,
} from "lucide-react";
import { RobuxPackage, RobloxUser } from "@/types";
import { ADMIN_PHONE } from "@/constants";

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  userId: string;
  whatsapp: string;
  selectedPackage: RobuxPackage;
  robloxUser: RobloxUser | null;
  onConfirmPaid: () => void;
  adminWhatsapp?: string;
  storeName?: string;
  qrisImage?: string;
}

async function compressImageToWebp(
  file: File,
  maxWidth = 900,
  quality = 0.75
): Promise<{ webpBase64: string; sizeKb: string }> {
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
          webpData = canvas.toDataURL("image/jpeg", quality);
        }

        const base64Length = webpData.length - (webpData.indexOf(",") + 1);
        const bytes = (base64Length * 3) / 4;
        const sizeKb = (bytes / 1024).toFixed(1) + " KB";

        resolve({ webpBase64: webpData, sizeKb });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function QrisModal({
  isOpen,
  onClose,
  invoiceId,
  userId,
  whatsapp,
  selectedPackage,
  robloxUser,
  onConfirmPaid,
  adminWhatsapp,
  storeName = "NiceGaming",
  qrisImage,
}: QrisModalProps) {
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan!");
      return;
    }

    // Validate size (max 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Ukuran foto maksimal 8 MB!");
      return;
    }

    setUploadError(null);
    setIsCompressing(true);

    try {
      // Automatically compress to lightweight WebP (~30KB - 70KB)
      const { webpBase64, sizeKb } = await compressImageToWebp(file, 900, 0.75);
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      setFileName(`${originalName}.webp`);
      setFileSize(`${sizeKb} (WebP Terkompres)`);
      setProofImage(webpBase64);
    } catch (err) {
      console.error("Compression error:", err);
      setUploadError("Gagal mengompres gambar. Silakan coba file lain.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveProof = () => {
    setProofImage(null);
    setFileName(null);
    setFileSize(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = async () => {
    // ⚠️ WAJIB UPLOAD BUKTI PEMBAYARAN
    if (!proofImage) {
      setUploadError("Wajib upload foto bukti transfer pembayaran sebelum konfirmasi!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create real order in Neon DB with verified payment proof
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_code: invoiceId,
          roblox_username: userId.trim(),
          customer_phone: whatsapp.trim(),
          robux: selectedPackage.robux,
          price: selectedPackage.price,
          payment_method: "Website",
          roblox_user_id: robloxUser?.id ? String(robloxUser.id) : undefined,
          customer_notes: robloxUser ? `Display Name: ${robloxUser.displayName}` : undefined,
          payment_proof_path: proofImage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setUploadError(data.error || "Gagal menyimpan pesanan. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }
    } catch (e) {
      console.error("Error saving proof to order:", e);
      setUploadError("Terjadi kesalahan jaringan saat menyimpan pesanan.");
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }

    const displayNameTxt = robloxUser ? ` (${robloxUser.displayName})` : "";
    const message =
      `Halo Admin ${storeName}, saya sudah transfer via QRIS Website:%0A%0A` +
      `🧾 Invoice: ${invoiceId}%0A` +
      `👤 Username Roblox: @${userId}${displayNameTxt}%0A` +
      `💎 Paket: ${selectedPackage.robux} Robux%0A` +
      `💰 Nominal: ${selectedPackage.priceFormatted}%0A` +
      `📱 No WA: ${whatsapp}%0A%0A` +
      `Foto bukti transfer sudah saya upload di sistem website & terlampir disini. Mohon segera diproses ya kak! 🙏✨`;

    const targetPhone = (adminWhatsapp || ADMIN_PHONE).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${targetPhone}?text=${message}`, "_blank");
    onConfirmPaid();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-card-pink rounded-3xl max-w-md w-full p-5 sm:p-6 border-2 border-pink-500/50 shadow-[0_0_45px_rgba(255,27,122,0.4)] text-center space-y-4 animate-in fade-in zoom-in duration-300 relative max-h-[92vh] overflow-y-auto my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-1.5">
            <QrCode size={12} />
            <span>Pembayaran QRIS Website</span>
          </div>
          <h4 className="text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            SCAN QRIS UNTUK BAYAR
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Invoice:{" "}
            <span className="text-[#00d2ff] font-mono font-bold">
              {invoiceId}
            </span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3.5 rounded-2xl max-w-[210px] mx-auto shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          {qrisImage ? (
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrisImage}
                alt="Barcode QRIS Toko"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative aspect-square w-full bg-gray-900 rounded-xl p-2.5 flex flex-col items-center justify-between border border-gray-200">
              <div className="flex justify-between w-full">
                <div className="w-7 h-7 border-4 border-white rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white"></div>
                </div>
                <div className="w-7 h-7 border-4 border-white rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white"></div>
                </div>
              </div>

              <div className="my-auto flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-[#ff1b7a] flex items-center justify-center text-white font-black text-[11px] shadow-lg">
                  NG
                </div>
                <span className="text-[7px] font-extrabold text-white mt-1 uppercase tracking-widest">
                  QRIS RESMI
                </span>
              </div>

              <div className="flex justify-between w-full">
                <div className="w-7 h-7 border-4 border-white rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white"></div>
                </div>
                <div className="w-7 h-7 border-4 border-white rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order & Payment Summary */}
        <div className="bg-[#0a0c20] rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5 text-left">
          <div className="flex items-center justify-between text-gray-300">
            <span>Akun Roblox:</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              {robloxUser?.avatarUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={robloxUser.avatarUrl}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full border border-cyan-400 object-cover"
                />
              )}
              <span>{robloxUser ? robloxUser.displayName : userId}</span>
            </div>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Paket Item:</span>
            <span className="font-bold text-white">
              {selectedPackage.robux} Robux
            </span>
          </div>
          <div className="flex justify-between text-gray-300 border-t border-white/10 pt-1.5">
            <span className="font-bold text-white">Total Bayar:</span>
            <span className="font-black text-[#ff1b7a] text-sm font-sans">
              {selectedPackage.priceFormatted}
            </span>
          </div>
        </div>

        {/* 📸 Upload Bukti Pembayaran (WAJIB) */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-200">
              Upload Bukti Transfer <span className="text-[#ff1b7a]">*Wajib</span>
            </label>
            {proofImage && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00e676]">
                <FileCheck size={12} />
                <span>Foto Terpilih</span>
              </span>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {!proofImage ? (
            <div
              onClick={() => !isCompressing && fileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                uploadError
                  ? "border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-shake"
                  : "border-pink-500/40 bg-[#0a0c20]/90 hover:border-[#ff1b7a] hover:bg-[#101334]"
              }`}
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-8 h-8 text-[#00d2ff] animate-spin mb-1.5" />
                  <p className="text-xs font-bold text-[#00d2ff]">
                    Mengompres foto ke WebP...
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Menghemat memori database
                  </p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(255,27,122,0.3)]">
                    <UploadCloud size={20} />
                  </div>
                  <p className="text-xs font-bold text-white">
                    Klik untuk upload bukti transfer
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Otomatis dikompres ke format WebP ringan
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-[#090c24] border border-emerald-500/50 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,230,118,0.2)] animate-fadeIn">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofImage}
                    alt="Bukti Transfer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-white truncate">
                    {fileName || "Bukti_Transfer.jpg"}
                  </p>
                  <p className="text-[10px] text-[#00e676] font-semibold">
                    {fileSize} • Siap dikirim
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleRemoveProof}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-fadeIn">
              <AlertCircle size={14} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 leading-snug">
          Buka aplikasi m-Banking / E-Wallet, scan QRIS lalu lampirkan screenshot bukti transfer di atas.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-[#00e676] hover:bg-[#00c853] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.5)] hover:shadow-[0_0_30px_rgba(0,230,118,0.8)] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses Bukti...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Konfirmasi Sudah Bayar</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Batalkan / Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
