import React, { useState, useEffect } from "react";
import { X, ExternalLink, RefreshCw, Layers } from "lucide-react";
import { Project, Language } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface PhpDetailModalProps {
  project: Project;
  language: Language;
  onClose: () => void;
}

export default function PhpDetailModal({ project, language, onClose }: PhpDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const iframeUrl = `/project-details.php?id=${project.id}&lang=${language}`;

  useEffect(() => {
    // Esc key close helper
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      id="php-detail-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="bg-[#faf9f6] w-full h-full sm:h-[92vh] max-w-7xl sm:rounded-2xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden relative cursor-default"
      >
        {/* Floating Top Control Bar */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between z-10 text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider font-bold text-neutral-300 uppercase">
              {language === "en" ? "Mollik PHP live Evaluation Engine" : "মল্লিক পিএইচপি ডাইনামিক ইঞ্জিন"}
            </span>
            <div className="hidden md:inline-flex items-center gap-1 bg-[#1B4D3E]/80 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
              <Layers className="w-3 h-3" />
              <span>{project.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open in Separate Tab for genuine testing */}
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all text-[11px] font-mono font-bold uppercase tracking-wider"
              title="Open full page PHP for external benchmarks"
            >
              <span>{language === "en" ? "Independent Portal" : "স্বতন্ত্র পোর্টাল"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              id="php-modal-close-btn"
              className="p-1.5 rounded-lg bg-[#C8A165] hover:bg-amber-500 text-neutral-950 transition-all font-bold"
              aria-label="Close PHP Drawer"
            >
              <X className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Dynamic IFrame Section */}
        <div className="flex-1 w-full h-full relative bg-[#faf9f6]">
          {loading && (
            <div className="absolute inset-0 bg-[#faf9f6] z-20 flex flex-col items-center justify-center gap-4">
              <div className="relative flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-[#1B4D3E] animate-spin" />
                <div className="absolute font-serif text-[10px] text-[#C8A165] font-bold">PHP</div>
              </div>
              <div className="text-center">
                <span className="block font-serif text-lg font-black text-neutral-900 tracking-tight">
                  {language === "en" ? "Mollik Builders" : "মল্লিক বিল্ডার্স"}
                </span>
                <span className="block text-[9px] font-mono text-neutral-400 uppercase tracking-[0.25em] mt-1">
                  {language === "en" ? "Rendering dynamic server layout..." : "ডাইনামিক লেআউট প্রস্তুত হচ্ছে..."}
                </span>
              </div>
            </div>
          )}

          <iframe
            src={iframeUrl}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-0 bg-[#faf9f6]"
            title="PHP Project Details Evaluation View"
            allow="fullscreen; clipboard-read; clipboard-write; ambient-light-sensor; microphone; camera; geolocation"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
