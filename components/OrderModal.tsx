import React from "react";
import { CheckCircle2 } from "lucide-react";
import { RobuxPackage } from "@/types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  userId: string;
  selectedPackage: RobuxPackage;
}

export default function OrderModal({
  isOpen,
  onClose,
  invoiceId,
  userId,
  selectedPackage,
}: OrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card-pink rounded-3xl max-w-md w-full p-6 border-2 border-pink-500/40 shadow-[0_0_40px_rgba(255,27,122,0.4)] text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center mx-auto text-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.4)]">
          <CheckCircle2 size={32} />
        </div>
        <h4 className="text-xl font-black uppercase tracking-wider text-white font-['Orbitron',sans-serif]">
          Pesanan Tercatat!
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Pesanan untuk <span className="text-white font-bold">{selectedPackage.robux} Robux</span> (User ID: <span className="text-[#00d2ff] font-bold">{userId}</span>) telah dibuat dengan Invoice <span className="text-[#ff1b7a] font-mono font-bold">{invoiceId}</span>.
        </p>
        <p className="text-[11px] text-gray-400">
          Admin NiceGaming akan segera memproses Robux masuk ke akun Anda dalam hitungan menit.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#ff1b7a] hover:bg-[#ff3388] transition-all shadow-[0_0_15px_rgba(255,27,122,0.4)] cursor-pointer"
          >
            Selesai &amp; Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
