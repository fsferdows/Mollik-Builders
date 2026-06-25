import React, { useState } from "react";
import { motion } from "motion/react";

interface LuxuryLogoProps {
  variant?: "light" | "dark" | "gold";
  showText?: boolean;
  language?: "en" | "bn";
}

export default function LuxuryLogo({ variant = "gold", showText = true, language = "en" }: LuxuryLogoProps) {
  const [hasError, setHasError] = useState(false);
  
  // Custom logo detection setting
  let isCustom = false;
  
  // Fallback to customizer settings if provided
  let activeSrc = "/logo.JPG";
  try {
    const stored = localStorage.getItem("mollik_ux_customizer_v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (language === "bn" && parsed.logoSrcBn) {
        activeSrc = parsed.logoSrcBn;
        isCustom = true;
      } else if (language === "en" && parsed.logoSrcEn) {
        activeSrc = parsed.logoSrcEn;
        isCustom = true;
      }
    }
  } catch (_) {}

  const logoAlt = language === "bn" ? "মল্লিক বিল্ডার্স ব্র্যান্ড লোগো" : "Mollik Builders Brand Logo";

  const handleImageError = () => {
    setHasError(true);
  };

  // If image fails, trigger fallback to inline vector
  const useVectorFallback = hasError || !activeSrc;

  if (useVectorFallback) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 xs:gap-3 select-none py-1 focus:outline-none min-w-0"
      >
        {/* Official circular brand badge with green and gold gradients */}
        <div className="relative w-7 h-7 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 flex items-center justify-center rounded-full overflow-hidden shadow-md">
          <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-emblem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2D091" />
                <stop offset="30%" stopColor="#C8A165" />
                <stop offset="70%" stopColor="#9A7432" />
                <stop offset="100%" stopColor="#C8A165" />
              </linearGradient>
              <radialGradient id="logo-green-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1B4D3E" />
                <stop offset="100%" stopColor="#0E2E24" />
              </radialGradient>
            </defs>
            {/* Background Circle with gold border */}
            <circle cx="256" cy="256" r="240" fill="url(#logo-green-bg)" stroke="url(#logo-emblem-gold)" strokeWidth="12" />
            
            {/* Monogram structural elements forming premium architectural M B */}
            <g transform="translate(116, 126)">
              <rect x="30" y="30" width="22" height="200" rx="4" fill="url(#logo-emblem-gold)" />
              <path d="M 52,50 L 110,130 L 110,230" fill="none" stroke="url(#logo-emblem-gold)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 110,130 L 168,50 L 190,50 L 190,230" fill="none" stroke="url(#logo-emblem-gold)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 190,50 C 235,50 255,85 255,115 C 255,140 235,145 190,145" fill="none" stroke="url(#logo-emblem-gold)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 190,145 C 240,145 260,180 260,210 C 260,235 235,240 190,240" fill="none" stroke="url(#logo-emblem-gold)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="10" y1="240" x2="270" y2="240" stroke="url(#logo-emblem-gold)" strokeWidth="8" strokeLinecap="round" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
        
        {showText && (
          <div className="flex flex-col min-w-0">
            <div className="font-serif font-extrabold tracking-wider leading-none text-white uppercase flex items-center gap-1.5">
              {language === "bn" ? (
                <span className="text-xs xs:text-sm sm:text-base md:text-lg text-[#C8A165] font-sans tracking-normal font-black whitespace-nowrap">মল্লিক বিল্ডার্স</span>
              ) : (
                <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-[0.12em] xs:tracking-[0.16em] bg-clip-text text-transparent bg-gradient-to-r from-white via-[#EAD1A8] to-[#C8A165] whitespace-nowrap">
                  MOLLIK BUILDERS LTD
                </span>
              )}
            </div>
            <div className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[8.5px] font-mono tracking-[0.18em] xs:tracking-[0.25em] text-[#C8A165] uppercase leading-none mt-1 opacity-90 whitespace-nowrap">
              {language === "bn" ? "সুরক্ষা ও শতভাগ সততা" : "SAFETY & INTEGRITY"}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center select-none group focus:outline-none min-w-0"
    >
      <div className="relative overflow-hidden rounded-full border border-[#C8A165]/50 group-hover:border-[#C8A165] p-0.5 transition-all duration-300 bg-[#0E2E24] shadow-md flex items-center justify-center">
        {/* Ambient subtle background glow on hover */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />
        
        {/* Dynamic Logo Image */}
        <img
          id="brand-logo-img"
          src={activeSrc || ""}
          alt={logoAlt}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="eager"
          className="h-8 w-8 xs:h-10 xs:w-10 sm:h-11 sm:w-11 md:h-13 md:w-13 lg:h-15 lg:w-15 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </motion.div>
  );
}
