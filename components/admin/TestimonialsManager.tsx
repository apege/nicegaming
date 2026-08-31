"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  MessageSquareHeart,
  MessageCircle,
  X,
  ShieldCheck,
  Reply,
  Sparkles,
} from "lucide-react";
import { AdminTestimonial } from "@/types/admin";

interface TestimonialsManagerProps {
  testimonials: AdminTestimonial[];
  onAddTestimonial: (t: Omit<AdminTestimonial, "id">) => void;
  onDeleteTestimonial: (id: string) => void;
  onToggleActive: (id: string) => void;
  onReplyTestimonial?: (id: string, replyText: string) => void;
}

const QUICK_REPLIES = [
  "Terima kasih atas kepercayaannya kak! Ditunggu orderan berikutnya 🙏",
  "Mantap! Selamat bermain dan enjoy Robux-nya ya kak! 🔥",
  "Senang bisa membantu proses top up kilat. Happy gaming! ⚡",
  "Terima kasih atas review bintang 5 nya kak, sukses selalu! 💎",
];

export default function TestimonialsManager({
  testimonials,
  onAddTestimonial,
  onDeleteTestimonial,
  onToggleActive,
  onReplyTestimonial,
}: TestimonialsManagerProps) {
  // Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Verified Buyer");
  const [robuxBought, setRobuxBought] = useState("1800");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Reply modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyingItem, setReplyingItem] = useState<AdminTestimonial | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleOpenReply = (item: AdminTestimonial) => {
    setReplyingItem(item);
    setReplyText(item.adminReply || "");
    setReplyModalOpen(true);
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingItem) return;
    if (onReplyTestimonial) {
      onReplyTestimonial(replyingItem.id, replyText);
    } else {
      replyingItem.adminReply = replyText;
      replyingItem.adminReplyDate = "Baru saja";
    }
    setReplyModalOpen(false);
    setReplyingItem(null);
  };

  const handleDeleteReply = () => {
    if (!replyingItem) return;
    if (onReplyTestimonial) {
      onReplyTestimonial(replyingItem.id, "");
    }
    setReplyModalOpen(false);
    setReplyingItem(null);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    onAddTestimonial({
      name,
      role: `Order ${robuxBought} Robux • ${role}`,
      avatarText: initials || "UG",
      avatarGradient: "from-[#ff1b7a] to-[#00d2ff]",
      comment,
      rating,
      robuxBought: parseInt(robuxBought, 10) || 800,
      date: "Hari ini",
      isActive: true,
    });

    setName("");
    setComment("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Testimoni
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Ulasan, rating, dan balasan admin yang ditampilkan di halaman utama
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff1b7a] via-[#ff2e93] to-[#d81159] hover:shadow-[0_0_20px_rgba(255,27,122,0.6)] text-white font-black text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`bg-[#0b0e24]/90 backdrop-blur-xl rounded-3xl p-6 border transition-all flex flex-col justify-between overflow-hidden ${
              t.isActive
                ? "border-white/[0.08] shadow-xs hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(255,27,122,0.2)]"
                : "border-white/5 opacity-50 bg-[#070818]"
            }`}
          >
            <div className="space-y-4">
              {/* Customer Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avatarGradient} flex items-center justify-center text-white font-black text-xs shadow-[0_0_12px_rgba(255,27,122,0.4)] shrink-0`}
                  >
                    {t.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Customer Comment */}
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Admin Reply Card (If exists) */}
              {t.adminReply && (
                <div className="p-3.5 rounded-2xl bg-[#070918] border border-cyan-500/30 text-xs shadow-[0_0_15px_rgba(0,210,255,0.1)] space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#00d2ff]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span>Balasan Admin NiceGaming</span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {t.adminReplyDate || "29 Agu"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {t.adminReply}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onToggleActive(t.id)}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {t.isActive ? "Sembunyikan" : "Tampilkan"}
              </button>

              <div className="flex items-center gap-2">
                {/* Reply Button */}
                <button
                  type="button"
                  onClick={() => handleOpenReply(t)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    t.adminReply
                      ? "bg-cyan-500/15 border border-cyan-500/40 text-[#00d2ff] hover:bg-cyan-500/25 shadow-[0_0_10px_rgba(0,210,255,0.2)]"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-pink-500/40 hover:bg-pink-500/10"
                  }`}
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>{t.adminReply ? "Edit Balasan" : "Balas"}</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onDeleteTestimonial(t.id)}
                  title="Hapus Testimoni"
                  className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 💬 BALAS ULASAN MODAL */}
      {/* ========================================================================= */}
      {replyModalOpen && replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setReplyModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-pink-500/30 overflow-hidden z-10 animate-scaleUp">
            <div className="px-6 py-5 border-b border-pink-500/20 bg-[#0e102d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#00d2ff]">
                  <Reply className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Balas Ulasan Pelanggan
                  </h3>
                  <p className="text-xs text-gray-400">
                    Balasan akan muncul di bawah testimoni pelanggan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="p-6 space-y-4">
              {/* Customer Review Preview */}
              <div className="p-4 rounded-2xl bg-[#070918] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${replyingItem.avatarGradient} flex items-center justify-center text-white font-bold text-[10px]`}
                    >
                      {replyingItem.avatarText}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {replyingItem.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {replyingItem.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: replyingItem.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed pt-1">
                  &ldquo;{replyingItem.comment}&rdquo;
                </p>
              </div>

              {/* Quick Preset Replies */}
              <div>
                <label className="flex items-center gap-1 text-[11px] font-black uppercase text-gray-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Template Balasan Cepat</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_REPLIES.map((qr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(qr)}
                      className="p-2.5 rounded-xl bg-[#070918] border border-white/10 hover:border-cyan-400 hover:bg-cyan-500/10 text-left text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer leading-snug"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Input */}
              <div>
                <label className="block text-xs font-black text-gray-300 mb-1.5">
                  Isi Balasan Admin (NiceGaming)
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tulis balasan ucapan terima kasih atau konfirmasi..."
                  required
                  className="w-full p-4 bg-[#070918] border border-white/[0.1] rounded-2xl text-xs font-medium text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/30 transition-all placeholder:text-gray-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                {replyingItem.adminReply ? (
                  <button
                    type="button"
                    onClick={handleDeleteReply}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
                  >
                    Hapus Balasan
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setReplyModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0090ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    Kirim Balasan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ➕ TAMBAH TESTIMONI BARU MODAL */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0b0e24] text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-pink-500/30 overflow-hidden z-10 animate-scaleUp">
            <div className="px-6 py-5 border-b border-pink-500/20 bg-[#0e102d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#ff1b7a]" />
                <h3 className="text-base font-black text-white">
                  Tambah Ulasan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="w-full px-4 py-2.5 bg-[#070818] border border-white/[0.1] rounded-xl text-xs font-semibold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Jumlah Robux Yang Dibeli
                </label>
                <input
                  type="text"
                  value={robuxBought}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setRobuxBought(digits ? parseInt(digits, 10).toLocaleString("id-ID") : "");
                  }}
                  placeholder="Contoh: 1.800"
                  required
                  className="w-full px-4 py-2.5 bg-[#070918] border border-white/[0.1] rounded-xl text-xs font-semibold text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Rating Bintang
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                        rating === star
                          ? "bg-amber-500/30 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-[#070818] border-white/10 text-gray-400"
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Isi Testimoni / Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan kepuasan transaksi..."
                  required
                  className="w-full p-3.5 bg-[#070818] border border-white/[0.1] rounded-xl text-xs font-medium text-white focus:bg-[#0c0e24] focus:outline-hidden focus:border-[#ff1b7a]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff1b7a] to-[#d81159] hover:shadow-[0_0_15px_rgba(255,27,122,0.6)] text-white text-xs font-black cursor-pointer"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
