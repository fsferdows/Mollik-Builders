import React, { useRef, useState } from "react";
import { MapPin, ArrowRight, Compass, TrendingUp, Download, Maximize2, Layers } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Project, Language } from "../types";

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  language: Language;
  onSelect: (project: Project) => void;
  onBookVisit: (projectName: string, projectType: string) => void;
  onView3D: (project: Project) => void;
  onTriggerVirtualTour: (project: Project) => void;
  onToggleCompare: (project: Project) => void;
  isCompared: boolean;
  index?: number;
  onViewGallery?: (project: Project) => void;
}

interface ExtraProjectInfo {
  landmarkEn: string;
  landmarkBn: string;
  totalUnits: number;
  totalUnitsBn: string;
  availableUnits: number;
  availableUnitsBn: string;
  isSellingFast: boolean;
  pricePerSqftEn: string;
  pricePerSqftBn: string;
}

const EXTRA_INFO_MAP: Record<string, ExtraProjectInfo> = {
  "mollik-tower": {
    landmarkEn: "2 mins from Gulshan-2 Circle",
    landmarkBn: "গুলশান-২ সার্কেল থেকে ২ মিনিট",
    totalUnits: 28,
    totalUnitsBn: "২৮",
    availableUnits: 6,
    availableUnitsBn: "৬",
    isSellingFast: true,
    pricePerSqftEn: "৳5,860/sqft avg",
    pricePerSqftBn: "৳৫,৮৬০/বর্গফুট",
  },
  "mollik-heights": {
    landmarkEn: "3 mins to Diplomatic Zone",
    landmarkBn: "ডিপ্লোম্যাটিক জোন থেকে ৩ মিনিট",
    totalUnits: 24,
    totalUnitsBn: "২৪",
    availableUnits: 4,
    availableUnitsBn: "৪",
    isSellingFast: true,
    pricePerSqftEn: "৳8,500/sqft avg",
    pricePerSqftBn: "৳৮,৫০০/বর্গফুট",
  },
  "mollik-garden": {
    landmarkEn: "5 mins from Uttara Metro",
    landmarkBn: "উত্তরা মেট্রো থেকে ৫ মিনিট",
    totalUnits: 32,
    totalUnitsBn: "৩২",
    availableUnits: 11,
    availableUnitsBn: "১১",
    isSellingFast: false,
    pricePerSqftEn: "৳4,500/sqft avg",
    pricePerSqftBn: "৳৪,৫০০/বর্গফুট",
  },
  "mollik-serenade": {
    landmarkEn: "Dhanmondi Lake view",
    landmarkBn: "ধানমন্ডি লেক ভিউ",
    totalUnits: 20,
    totalUnitsBn: "২০",
    availableUnits: 5,
    availableUnitsBn: "৫",
    isSellingFast: true,
    pricePerSqftEn: "৳11,250/sqft avg",
    pricePerSqftBn: "৳১১,২৫০/বর্গফুট",
  },
  "mollik-grandeur": {
    landmarkEn: "4 mins to US Embassy",
    landmarkBn: "ইউএস এম্বাসি থেকে ৪ মিনিট",
    totalUnits: 16,
    totalUnitsBn: "১৬",
    availableUnits: 3,
    availableUnitsBn: "৩",
    isSellingFast: true,
    pricePerSqftEn: "৳11,360/sqft avg",
    pricePerSqftBn: "৳১১,৩৬০/বর্গফুট",
  },
  "mollik-splendour": {
    landmarkEn: "5 mins to Evercare Hospital",
    landmarkBn: "এভারকেয়ার হাসপাতাল থেকে ৫ মিনিট",
    totalUnits: 40,
    totalUnitsBn: "৪০",
    availableUnits: 14,
    availableUnitsBn: "১৪",
    isSellingFast: false,
    pricePerSqftEn: "৳9,330/sqft avg",
    pricePerSqftBn: "৳৯,৩৩০/বর্গফুট",
  },
  "mollik-heritage": {
    landmarkEn: "2 mins walk from Lalbagh Fort",
    landmarkBn: "লালবাগ কেল্লা থেকে ২ মিনিট হাঁটা",
    totalUnits: 24,
    totalUnitsBn: "২৪",
    availableUnits: 8,
    availableUnitsBn: "৮",
    isSellingFast: false,
    pricePerSqftEn: "৳9,000/sqft avg",
    pricePerSqftBn: "৳৯,০০০/বর্গফুট",
  },
  "mollik-vista": {
    landmarkEn: "3 mins to National Stadium",
    landmarkBn: "স্টেডিয়াম থেকে ৩ মিনিট",
    totalUnits: 30,
    totalUnitsBn: "৩০",
    availableUnits: 9,
    availableUnitsBn: "৯",
    isSellingFast: false,
    pricePerSqftEn: "৳7,140/sqft avg",
    pricePerSqftBn: "৳৭,১৪০/বর্গফুট",
  },
  "mollik-transmitter-a": {
    landmarkEn: "10 mins east of Abdullapur Bus Stand",
    landmarkBn: "আব্দুল্লাহপুর বাসস্ট্যান্ড থেকে ১০ মিনিট পূর্বে",
    totalUnits: 27,
    totalUnitsBn: "২৭",
    availableUnits: 1,
    availableUnitsBn: "১",
    isSellingFast: true,
    pricePerSqftEn: "৳1,157/sqft (Share rate)",
    pricePerSqftBn: "৳১,১৫৭/বর্গফুট (শেয়ার রেট)",
  },
  "mollik-transmitter-b": {
    landmarkEn: "Police Outpost Market, Faydabad",
    landmarkBn: "ফায়দাবাদ পুলিশ ফাঁড়ি বাজার",
    totalUnits: 36,
    totalUnitsBn: "৩৬",
    availableUnits: 1,
    availableUnitsBn: "১",
    isSellingFast: true,
    pricePerSqftEn: "৳3,833/sqft (Fully Ready)",
    pricePerSqftBn: "৳৩,৮৩৩/বর্গফুট (সম্পূর্ণ রেডি)",
  },
  "mollik-city-azampur": {
    landmarkEn: "8-10 mins from Azampur Bus Stand",
    landmarkBn: "আজমপুর বাসস্ট্যান্ড থেকে ৮-১০ মিনিট",
    totalUnits: 45,
    totalUnitsBn: "৪৫",
    availableUnits: 3,
    availableUnitsBn: "৩",
    isSellingFast: true,
    pricePerSqftEn: "৳12.1 Lac Eid Promo",
    pricePerSqftBn: "৳১২.১ লক্ষ ঈদ প্রমোশন",
  },
  "mollik-transmitter-d": {
    landmarkEn: "10 mins east of Abdullapur Bus Stand",
    landmarkBn: "আব্দুল্লাহপুর বাসস্ট্যান্ড থেকে ১০ মিনিট পূর্বে",
    totalUnits: 54,
    totalUnitsBn: "৫৪",
    availableUnits: 1,
    availableUnitsBn: "১",
    isSellingFast: true,
    pricePerSqftEn: "৳1,222/sqft (Share rate)",
    pricePerSqftBn: "৳১,২২২/বর্গফুট (শেয়ার রেট)",
  },
  "mollik-city-plots": {
    landmarkEn: "Next to Uttarkhan Primary School",
    landmarkBn: "উত্তরখান প্রাইমারি স্কুল সংলগ্ন",
    totalUnits: 2,
    totalUnitsBn: "২",
    availableUnits: 2,
    availableUnitsBn: "২",
    isSellingFast: true,
    pricePerSqftEn: "৳85 Lac / Katha",
    pricePerSqftBn: "৳৮৫ লক্ষ / কাঠা",
  }
};

const getExtraInfo = (projId: string): ExtraProjectInfo => {
  const matched = EXTRA_INFO_MAP[projId];
  if (matched) return matched;
  
  // Deterministic fallback based on ID hash
  let hash = 0;
  for (let i = 0; i < projId.length; i++) {
    hash = projId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  const total = 10 + (hash % 15);
  const avail = 2 + (hash % (total - 3));
  const isFast = (hash % 2) === 0;
  
  return {
    landmarkEn: "Adjacent to Central Avenue",
    landmarkBn: "সেন্ট্রাল এভিনিউ সংলগ্ন",
    totalUnits: total,
    totalUnitsBn: total.toString(),
    availableUnits: avail,
    availableUnitsBn: avail.toString(),
    isSellingFast: isFast,
    pricePerSqftEn: `৳${4000 + (hash % 6000)}/sqft avg`,
    pricePerSqftBn: `৳${4000 + (hash % 6000)}/বর্গফুট`,
  };
};

export default function ProjectCard({ 
  project, 
  language, 
  onSelect, 
  onBookVisit, 
  onView3D,
  onTriggerVirtualTour,
  onToggleCompare,
  isCompared,
  index,
  onViewGallery
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPricePerSqft, setShowPricePerSqft] = useState(false);
  
  const info = getExtraInfo(project.id);
  
  // Subtle parallax scroll effect targeting our card container
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to subtle Y movement of the image (ranging from -12% to 12%)
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ 
        duration: 0.65, 
        delay: index ? Math.min(index * 0.1, 0.6) : 0, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
         y: -8, 
         scale: 1.025,
         transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
      }}
      onClick={() => onSelect(project)}
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group cursor-pointer focus-within:ring-2 focus-within:ring-[#C8A165] border ${
        info.isSellingFast 
          ? "border-[#C8A165]/55 shadow-[0_0_18px_-3px_rgba(200,161,101,0.06)]" 
          : "border-neutral-200"
      }`}
    >
      <div>
        {/* Parallax Image Frame */}
        <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 w-full">
          <motion.img 
            style={{ y }}
            animate={{ scale: isHovered ? 1.25 : 1.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            src={project.image} 
            alt={project.name} 
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-[120%] object-cover"
          />
          {/* Subtle vignette/gradients for premium depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 via-transparent to-neutral-950/10 pointer-events-none" />
          
          {/* Diagonal laser flare swipe on hover */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[250%] transition-transform duration-[1200ms] ease-out pointer-events-none" />

          {/* Luxe Gallery overlay button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewGallery) onViewGallery(project);
              }}
              className="px-4 py-2 bg-neutral-950/90 text-[#C8A165] hover:bg-[#C8A165] hover:text-neutral-950 border border-[#C8A165] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shadow-2xl scale-90 group-hover:scale-100 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Luxe Gallery" : "লাক্সারি গ্যালারি"}</span>
            </button>
          </div>

          {/* Status Label Overlay with interactive scale */}
          <div className="absolute top-3 left-3 bg-[#181A19]/85 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase text-[#C8A165] tracking-widest rounded shadow-md">
            {language === "en" ? project.status : project.statusBn}
          </div>

          {/* Golden Selling Fast visual overlay indicator */}
          {info.isSellingFast && (
            <div className="absolute top-12 left-3 bg-rose-600/95 text-white px-2.5 py-1 text-[8px] font-bold rounded shadow-md tracking-wider flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 animate-bounce" />
              <span>{language === "en" ? "SELLING FAST" : "দ্রুত বিক্রি হচ্ছে"}</span>
            </div>
          )}

          {/* RAJUK Approval Pill */}
          {project.rajukApproved && (
            <div className="absolute top-3 right-3 bg-[#1B4D3E] text-white px-2.5 py-1 text-[8px] font-bold rounded shadow-md tracking-wider">
              {language === "en" ? "RAJUK APPROVED" : "রাজুক অনুমোদিত"}
            </div>
          )}

          {/* Quick PDF Brochure Download Pill */}
          {project.pdfUrl && (
            <a
              href={project.pdfUrl}
              download={project.pdfFilename || "brochure.pdf"}
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening detail modal
              }}
              className="absolute top-12 right-3 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-[8px] font-bold rounded shadow-md tracking-wider flex items-center gap-1.2 transition-all hover:scale-105 active:scale-95"
              title={language === "en" ? "Quick Download PDF Brochure" : "পিডিএফ ব্রোশিওর ডাউনলোড করুন"}
            >
              <Download className="w-2.5 h-2.5 text-white" />
              <span>{language === "en" ? "BROCHURE" : "ব্রোশিওর"}</span>
            </a>
          )}

          {/* Compare Checkbox Pill (Bottom-Left corner) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(project);
            }}
            className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md px-3.5 py-2.5 min-h-[44px] rounded-lg border border-neutral-800 flex items-center gap-2 shadow-lg cursor-pointer hover:border-[#C8A165]/50 group"
          >
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
              isCompared ? "bg-[#C8A165] border-[#C8A165] text-neutral-950" : "border-neutral-500 group-hover:border-neutral-300"
            }`}>
              {isCompared && (
                <svg className="w-2.5 h-2.5 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-[9.5px] font-bold text-neutral-200 tracking-wider uppercase font-sans">
              {language === "en" ? "Compare" : "তুলনা করুন"}
            </span>
          </div>

          {/* Construction Progress Circular Indicator (Bottom-Right corner) */}
          {(project.status === "Ongoing" || project.statusBn === "চলমান প্রকল্প" || project.id === "mollik-serenade" || project.id === "mollik-heritage") && (
            <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#C8A165]/35 flex items-center gap-2 shadow-lg select-none">
              <span className="text-[9.5px] font-sans font-bold text-neutral-200 uppercase tracking-wider">
                {language === "en" ? "Progress" : "অগ্রগতি"}
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-neutral-700 fill-none"
                    strokeWidth="1.5"
                  />
                  {/* Foreground Progress Circle */}
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-[#C8A165] fill-none"
                    strokeWidth="2"
                    strokeDasharray={2 * Math.PI * 9}
                    strokeDashoffset={2 * Math.PI * 9 * (1 - (project.id === "mollik-serenade" ? 0.78 : 0.42))}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[7.5px] font-mono font-extrabold text-[#C8A165]">
                  {project.id === "mollik-serenade" ? "78%" : "42%"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Panel */}
        <div className="p-4 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5 min-h-[42px] content-center">
            <div className="flex items-center gap-1.2 text-[9.5px] text-neutral-400 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#C8A165]" />
              <span>{language === "en" ? project.location : project.locationBn}</span>
            </div>
            
            {/* Proximity / Landmark Tag component dynamically customized */}
            <span className="inline-flex items-center gap-1 bg-[#C8A165]/5 text-[#C8A165] text-[9px] font-bold px-2 py-0.5 rounded border border-[#C8A165]/15 transition-all">
              <Compass className="w-3 h-3 text-[#C8A165]" />
              <span>{language === "en" ? info.landmarkEn : info.landmarkBn}</span>
            </span>
          </div>

          <h3 className="font-serif font-black text-base text-neutral-850 group-hover:text-[#1B4D3E] transition-colors duration-300 leading-tight line-clamp-2 h-[42px] flex items-center">
            {language === "en" ? project.name : project.nameBn}
          </h3>

          {/* Specification layout grid with Interactive Price per SQFT conversion */}
          <div className="grid grid-cols-2 gap-3 py-2 bg-neutral-50 px-3 rounded-lg border border-neutral-150 transition-colors duration-300">
            <div>
              <span className="text-neutral-400 text-[10px] block font-bold uppercase tracking-wider">{language === "en" ? "App Size" : "আয়তন"}:</span>
              <span className="font-extrabold text-neutral-700 text-xs">{language === "en" ? project.size : project.sizeBn}</span>
            </div>
            
            {/* Price display with beautiful clickable conversion trigger */}
            <div 
              onClick={(e) => {
                e.stopPropagation(); // Stop opening modal twice
                setShowPricePerSqft(!showPricePerSqft);
              }}
              className="flex flex-col justify-between cursor-pointer group/price -m-1 p-1 rounded-md hover:bg-neutral-200/30 transition-colors duration-200"
              title={language === "en" ? "Toggle Total/Sqft Price" : "টোটাল/বর্গফুট প্রাইস দেখতে ক্লিক করুন"}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-neutral-400 text-[10px] block font-bold uppercase tracking-wider">
                  {showPricePerSqft 
                    ? (language === "en" ? "Price / Sqft" : "প্রতি বর্গফুট")
                    : (language === "en" ? "Price Range" : "মূল্য সীমা")}:
                </span>
                <span className="text-[8px] font-mono select-none px-1 py-0.2 bg-neutral-200 text-neutral-600 rounded font-bold uppercase tracking-tighter opacity-0 group-hover/price:opacity-100 transition-opacity">
                  {language === "en" ? "Flip" : "পরিবর্তন"}
                </span>
              </div>
              <span className="font-extrabold text-[#1B4D3E] text-xs transition-transform duration-300 scale-100 group-hover/price:scale-102 flex items-center gap-1">
                {showPricePerSqft 
                  ? (language === "en" ? info.pricePerSqftEn : info.pricePerSqftBn)
                  : (language === "en" ? project.price : project.priceBn)}
              </span>
            </div>
          </div>

          {/* Unit Availability Visual Density Tracker Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-400 uppercase tracking-widest">{language === "en" ? "Density" : "উপলব্ধতা"}</span>
              <span className="font-extrabold text-[#1B4D3E]">
                {language === "en" 
                  ? `${info.availableUnits}/${info.totalUnits} Units` 
                  : `${info.availableUnitsBn}/${info.totalUnitsBn} ইউনিট খালি`}
              </span>
            </div>
            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`bg-[#C8A165] h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${(info.availableUnits / info.totalUnits) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Bar */}
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          {/* Main Specs & Units Button */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Stop opening modal twice
              onSelect(project);
            }}
            className="flex-1 min-h-[38px] py-2 bg-[#1B4D3E] hover:bg-[#143d31] text-[#C8A165] hover:text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer text-center flex items-center justify-center border-none shadow-md"
          >
            {language === "en" ? "Specs & Units" : "ডিটেইলস অ্যান্ড ইউনিট"}
          </button>

          {/* Explore 3D */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView3D(project);
            }}
            className="w-[38px] h-[38px] bg-neutral-900 hover:bg-[#1B4D3E]/20 text-[#C8A165] border border-neutral-800 rounded transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
            title={language === "en" ? "Explore 3D" : "থ্রিডি ভিউ"}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* 360 Tour */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerVirtualTour(project);
            }}
            className="w-[38px] h-[38px] bg-neutral-900 hover:bg-neutral-850 text-[#C8A165] border border-neutral-800 rounded transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
            title={language === "en" ? "360° Tour" : "৩৬০° ট্যুর"}
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Book Visit */}
          <a 
            href="#book-visit"
            onClick={(e) => {
              e.stopPropagation();
              onBookVisit(project.name, project.type);
            }}
            className="w-[38px] h-[38px] bg-[#C8A165] hover:bg-[#b28b55] text-neutral-950 rounded transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
            title={language === "en" ? "Book Visit" : "বুক সাইট"}
          >
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
