"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // "YYYY-MM-DD" format
  onChange: (dateStr: string) => void;
  label?: string;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function CustomDatePicker({
  value,
  onChange,
  label = "Tanggal Berakhir Promo",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial or fallback date
  const parsedDate = value ? new Date(value) : new Date();
  const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const [viewYear, setViewYear] = useState(validDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(validDate.getMonth());

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const formatted = `${viewYear}-${m}-${d}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Quick preset helpers
  const handleQuickPreset = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    const d = String(target.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  // Format date display for trigger button
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Pilih Tanggal";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const mIndex = parseInt(m, 10) - 1;
    return `${d} ${MONTH_NAMES[mIndex] || m} ${y}`;
  };

  // Calculate calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  // Selected date components
  const selectedParts = value ? value.split("-") : [];
  const isSelected = (day: number) => {
    if (selectedParts.length !== 3) return false;
    return (
      parseInt(selectedParts[0], 10) === viewYear &&
      parseInt(selectedParts[1], 10) === viewMonth + 1 &&
      parseInt(selectedParts[2], 10) === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Label */}
      <label className="flex items-center gap-1.5 text-xs font-black text-gray-300 mb-2">
        <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
        <span>{label}</span>
      </label>

      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-3 bg-[#070918] border rounded-2xl text-xs sm:text-sm font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? "border-[#ff1b7a] ring-2 ring-[#ff1b7a]/30 text-white bg-[#0c0e24] shadow-[0_0_15px_rgba(255,27,122,0.2)]"
            : "border-white/[0.1] text-gray-200 hover:border-white/30 hover:text-white"
        }`}
      >
        <span className="font-semibold">{formatDisplayDate(value)}</span>
        <div className="w-7 h-7 rounded-xl bg-pink-500/15 border border-pink-500/30 text-[#ff1b7a] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,27,122,0.3)]">
          <CalendarIcon className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Custom Cyber Dark Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 w-76 sm:w-80 bg-[#0c0e28] text-white rounded-3xl p-4 sm:p-5 border border-pink-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-scaleUp">
          {/* Calendar Navigation Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl bg-[#141838] border border-white/10 text-gray-300 hover:text-white hover:border-[#ff1b7a] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-xs sm:text-sm font-black text-white font-['Orbitron',sans-serif] tracking-wider">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl bg-[#141838] border border-white/10 text-gray-300 hover:text-white hover:border-[#ff1b7a] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Shortcuts */}
          <div className="grid grid-cols-3 gap-1.5 py-3 border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() => handleQuickPreset(0)}
              className="py-1 px-2 rounded-lg bg-[#141838] border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 text-[10px] font-bold text-gray-300 hover:text-[#ff1b7a] transition-all cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(3)}
              className="py-1 px-2 rounded-lg bg-[#141838] border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[10px] font-bold text-gray-300 hover:text-[#00d2ff] transition-all cursor-pointer"
            >
              +3 Hari
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(7)}
              className="py-1 px-2 rounded-lg bg-[#141838] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-[10px] font-bold text-gray-300 hover:text-[#00e676] transition-all cursor-pointer"
            >
              +7 Hari
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {DAY_NAMES.map((d, i) => (
              <span key={i} className={i === 0 ? "text-rose-400" : ""}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    selected
                      ? "bg-gradient-to-r from-[#ff1b7a] to-[#ff2e93] text-white shadow-[0_0_12px_rgba(255,27,122,0.8)] font-black scale-105"
                      : today
                      ? "bg-white/10 text-[#00d2ff] border border-[#00d2ff]/40"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-3 mt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
              <Sparkles className="w-3 h-3" />
              Auto-sync ke website buyer
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
