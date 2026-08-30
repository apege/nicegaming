import React from "react";
import { ShoppingBag, Gamepad2, CreditCard, CheckCircle2 } from "lucide-react";

export default function HowToOrder() {
  return (
    <section id="cara-order" className="relative z-10 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-400 uppercase tracking-wider">
            Panduan Pembelian
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
            CARA ORDER DI <span className="text-[#ff1b7a]">NICEGAMING</span>
          </h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Hanya butuh 4 langkah mudah untuk mendapatkan Robux impianmu dalam hitungan menit!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-3.5 sm:p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-xl sm:text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
              01
            </div>
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] mb-3">
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h4 className="text-xs sm:text-base font-bold text-white mb-1">1. Pilih Nominal</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                Tentukan jumlah Robux dari katalog paket.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-3.5 sm:p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-xl sm:text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
              02
            </div>
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d2ff] mb-3">
                <Gamepad2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h4 className="text-xs sm:text-base font-bold text-white mb-1">2. Masukkan ID</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                Isi username Roblox kamu dengan benar.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-3.5 sm:p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-xl sm:text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
              03
            </div>
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#ff1b7a] mb-3">
                <CreditCard size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h4 className="text-xs sm:text-base font-bold text-white mb-1">3. Bayar</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                Selesaikan pembayaran via QRIS atau WA.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-2xl p-3.5 sm:p-6 border border-pink-500/20 relative group hover:border-pink-500/50 transition-all flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-xl sm:text-3xl font-black text-white/10 group-hover:text-pink-500/20 font-['Orbitron',sans-serif]">
              04
            </div>
            <div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center text-[#00e676] mb-3">
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h4 className="text-xs sm:text-base font-bold text-white mb-1">4. Selesai!</h4>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                Robux otomatis masuk dalam 1-5 menit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
