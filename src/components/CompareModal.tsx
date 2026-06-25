import React from "react";
import { X, Check, CheckCircle2, AlertTriangle, Building2, MapPin } from "lucide-react";
import { Project, Language } from "../types";
import { motion } from "motion/react";

interface CompareModalProps {
  selectedProjects: Project[];
  language: Language;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export default function CompareModal({ selectedProjects, language, onClose, onSelectProject }: CompareModalProps) {
  
  if (selectedProjects.length === 0) {
    return (
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-55 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white text-neutral-800 p-8 rounded-xl max-w-sm w-full text-center space-y-4 border border-neutral-100"
        >
          <AlertTriangle className="w-12 h-12 text-[#C8A165] mx-auto" />
          <h3 className="font-serif font-black text-lg">
            {language === "en" ? "No Properties Selected" : "কোনো প্রজেক্ট নির্বাচিত করা হয়নি"}
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {language === "en" 
              ? "Please check the 'Compare' option on up to 3 properties in our projects grid to compare side-by-side."
              : "সাইড-বাই-সাইড তুলনা দেখতে প্রজেক্ট কার্ডে 'Compare' এ ক্লিক করুন (সর্বোচ্চ ৩টি)।"}
          </p>
          <button 
            onClick={onClose}
            className="w-full py-2 bg-[#1B4D3E] text-white hover:bg-neutral-900 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {language === "en" ? "Go Back" : "ফিরে যান"}
          </button>
        </motion.div>
      </div>
    );
  }

  // Get project spec helpers from list
  const getSpecValue = (project: Project, labelEn: string): string => {
    const matched = project.specs.find(s => s.label.toLowerCase() === labelEn.toLowerCase());
    return matched ? (language === "en" ? matched.value : matched.valueBn) : "N/A";
  };

  // Collect all unique amenities across chosen items to benchmark them side-by-side
  const allUniqueAmenities = Array.from(
    new Set(selectedProjects.flatMap(p => p.amenities || []))
  ).filter(Boolean);

  return (
    <div 
      id="compare-matrix-modal" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm z-55 flex items-center justify-center p-2 sm:p-4 cursor-pointer"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-white text-neutral-800 w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-150 shadow-2xl flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Header Drawer */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase text-[#C8A165] tracking-widest block font-mono">
              {language === "en" ? "PROP-X MATCHMAKER" : "প্রজেক্ট তুলনা কর্নার"}
            </span>
            <h2 className="text-base sm:text-lg font-serif font-black text-[#1B4D3E] flex items-center gap-1.5 leading-tight mt-0.5">
              <span>{language === "en" ? "Property Benchmarking Dashboard" : "সাইড-বাই-সাইড প্রজেক্ট তুলনা ছক"}</span>
              <span className="text-neutral-400 font-sans text-xs font-normal">
                ({selectedProjects.length} / 3 {language === "en" ? "selected" : "নির্বাচিত"})
              </span>
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-150 hover:bg-neutral-200 transition-colors text-neutral-500 hover:text-neutral-800 cursor-pointer border border-neutral-250"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Comparison Sheet Container (Scrollable) */}
        <div className="flex-1 overflow-auto p-5 sm:p-6">
          {/* Scroll hint on mobile viewports */}
          <div className="block sm:hidden bg-[#1B4D3E]/10 text-[#1B4D3E] text-[8.5px] font-mono uppercase text-center py-2 px-3 border border-[#1B4D3E]/20 mb-4 tracking-widest rounded-lg">
            ↔ Swipe left/right to view all specs / ডানে-বামে স্ক্রোল করুন
          </div>
          <div className="min-w-[650px] space-y-6">
            
            {/* Table Matrix Header Row - Project Images & Titles */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-neutral-100 items-stretch">
              <div className="flex flex-col justify-end pr-4">
                <div className="pb-2">
                  <span className="text-xs font-bold text-[#1B4D3E] uppercase tracking-wider block">
                    {language === "en" ? "Technical Specifications" : "প্রযুক্তিগত বৈশিষ্ট্যসমূহ"}
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-1 leading-normal font-sans">
                    {language === "en" 
                      ? "Benchmarked side-by-side for materials compliance and value estimation."
                      : "নির্মাণ সামগ্রীর গুণমান ও সঠিক চুক্তি যাচাইয়ের তুলনা ছক।"}
                  </p>
                </div>
              </div>

              {selectedProjects.map((p) => (
                <div key={p.id} className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/50 flex flex-col justify-between hover:shadow-md transition-shadow group relative">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-200 border border-neutral-200">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      loading="lazy" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="mt-3.5 space-y-1">
                    <span className="inline-block bg-[#1B4D3E]/10 text-[#1B4D3E] font-bold text-[8.5px] uppercase tracking-widest px-2 py-0.5 rounded">
                      {language === "en" ? p.type : p.typeBn}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-neutral-850 truncate">
                      {language === "en" ? p.name : p.nameBn}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#C8A165]" />
                      <span className="truncate">{language === "en" ? p.location : p.locationBn}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-200/60 flex gap-1">
                    <button
                      onClick={() => onSelectProject(p)}
                      className="w-full py-1.5 bg-neutral-900 border border-neutral-800 hover:bg-[#1B4D3E] text-white hover:text-[#C8A165] rounded text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      {language === "en" ? "Specs & Floorplans" : "ডিটেইলস ও ম্যাপ"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty placeholder cells if less than 3 selected */}
              {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center p-6 text-center text-neutral-300">
                  <Building2 className="w-8 h-8 text-neutral-200 mb-1.5" />
                  <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-neutral-400">
                    {language === "en" ? "Slot empty" : "খালি স্লট"}
                  </span>
                  <span className="text-[9px] block text-neutral-450 mt-1 leading-relaxed">
                    {language === "en" ? "Select another property to benchmark" : "তুলনা করতে প্রজেক্ট কার্ডে ক্লিক করুন"}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial row block */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 py-2 border-b border-neutral-100 font-medium text-xs items-center">
                <span className="font-extrabold text-[#1B4D3E] uppercase text-[9.5px] tracking-widest bg-neutral-50 p-1 px-2 rounded col-span-4 shadow-3xs">{language === "en" ? "Financial Valuation" : "আর্থিক মূল্যায়ন"}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Estimated Price" : "আনুমানিক মূল্য সীমা"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-bold text-neutral-800 text-sm text-[#1B4D3E]">{language === "en" ? p.price : p.priceBn}</span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-price-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
            </div>

            {/* Architecture specs list */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 py-2 border-b border-neutral-100 font-medium text-xs items-center">
                <span className="font-extrabold text-[#1B4D3E] uppercase text-[9.5px] tracking-widest bg-neutral-50 p-1 px-2 rounded col-span-4 shadow-3xs">{language === "en" ? "Sizing & Construction Specs" : "আকার এবং কাঠামোগত তথ্য"}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Apartment Sizes" : "অ্যাপার্টমেন্টের আকার"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-bold text-neutral-800">{language === "en" ? p.size : p.sizeBn}</span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-size-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Building Height" : "বিল্ডিং এর উচ্চতা"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-bold text-neutral-800">{getSpecValue(p, "building height")}</span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-height-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Total Apartments" : "মোট ফ্ল্যাট সংখ্যা"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-bold text-neutral-800">{getSpecValue(p, "total apartments")}</span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-apts-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Land Allotment" : "জমির পরিমাণ"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-bold text-neutral-800">{getSpecValue(p, "land area")}</span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-land-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
            </div>

            {/* Legal and Compliance */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 py-2 border-b border-neutral-100 font-medium text-xs items-center">
                <span className="font-extrabold text-[#1B4D3E] uppercase text-[9.5px] tracking-widest bg-neutral-50 p-1 px-2 rounded col-span-4 shadow-3xs">{language === "en" ? "Legal & structural Safety" : "আইনি এবং নিরাপত্তা যাচাই"}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "RAJUK Approved Status" : "রাজুক অনুমোদিত স্থিতি"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-extrabold text-[#1B4D3E] flex items-center gap-1 text-[11px]">
                    {p.rajukApproved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                        <span>{language === "en" ? "Verified Legal" : "অনুমোদিত"}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{language === "en" ? "Pending Approval" : "প্রক্রিয়াধীন"}</span>
                      </>
                    )}
                  </span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-rajuk-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/50">
                <span className="font-bold text-neutral-500 pl-2">{language === "en" ? "Earthquake Resilience" : "ভূমিকম্প নিরোধক ক্ষমতা"}</span>
                {selectedProjects.map((p) => (
                  <span key={p.id} className="font-extrabold flex items-center gap-1 text-[11px]">
                    {p.earthquakeResistant ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                        <span className="text-emerald-700">{language === "en" ? "BNBC Resistant" : "বিএনবিসি প্রতিরোধী"}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{language === "en" ? "Standard" : "মানক"}</span>
                      </>
                    )}
                  </span>
                ))}
                {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                  <span key={`empty-quake-${idx}`} className="text-neutral-300 font-mono">-</span>
                ))}
              </div>
            </div>

            {/* Unique Amenities Cross-matrix */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 py-2 border-b border-neutral-100 font-medium text-xs items-center">
                <span className="font-extrabold text-[#1B4D3E] uppercase text-[9.5px] tracking-widest bg-neutral-50 p-1 px-2 rounded col-span-4 shadow-3xs">{language === "en" ? "Premium Amenities Cross-Check" : "সুযোগ-সুবিধা তালিকা ছক"}</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {allUniqueAmenities.slice(0, 10).map((amenity, index) => (
                  <div key={`amenity-row-${index}-${amenity}`} className="grid grid-cols-4 gap-4 py-2 hover:bg-neutral-50/40 transition-colors text-xs items-center font-sans border-b border-neutral-100/30">
                    <span className="font-medium text-neutral-500 pl-2 text-[11px] truncate" title={amenity}>{amenity}</span>
                    {selectedProjects.map((p) => {
                      const contains = p.amenities.includes(amenity);
                      return (
                        <div key={`amenity-item-${amenity}-${p.id}`} className="flex items-center">
                          {contains ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <span className="text-neutral-300 font-mono text-center block w-5">-</span>
                          )}
                        </div>
                      );
                    })}
                    {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                      <span key={`empty-amenity-${index}-${idx}`} className="text-neutral-300 font-mono">-</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Footer sticky info container */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[10px] text-neutral-400 text-center flex flex-col sm:flex-row justify-between items-center px-6 gap-2">
          <span>{language === "en" ? "Verify custom floor mutation structures with structural designers before layout signing." : "যেকোনো প্রকার অভ্যন্তরীণ ফ্লোর পরিবর্তন করার পূর্বে আমাদের প্রকৌশল দলের সাথে যোগাযোগ করুণ।" }</span>
          <button 
            onClick={onClose}
            className="px-6 py-1.5 bg-[#1B4D3E] hover:bg-neutral-900 border border-[#1B4D3E] text-white hover:text-[#C8A165] rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {language === "en" ? "Close Benchmarking" : "তুলনা বন্ধ করুন"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
