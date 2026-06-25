import React, { useState, useEffect, TouchEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Compass, Layers, Sparkles } from "lucide-react";
import { Project, Language } from "../types";

interface ProjectGalleryProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface GalleryImage {
  url: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export default function ProjectGallery({ project, isOpen, onClose, language }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Generate high-resolution architectural gallery images dynamically depending on project type/details
  const getGalleryImages = (proj: Project | null): GalleryImage[] => {
    if (!proj) return [];
    
    // Main image from upload/database
    const mainImg = {
      url: proj.image,
      titleEn: "Architectural Exterior Elevation",
      titleBn: "স্থাপত্য বহিরাঙ্গন দৃশ্য",
      descriptionEn: `Premium exterior design highlighting structural harmony and local green integration in ${proj.location}.`,
      descriptionBn: `${proj.location}-এ সবুজায়ন সমৃদ্ধ প্রিমিয়াম ডিজাইনের চমৎকার স্থাপত্য বহিরাঙ্গন কাঠামো।`
    };

    const isResidential = proj.type !== "Commercial";

    // Set of professional luxury real estate captures
    const subImages: GalleryImage[] = [
      {
        url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=90",
        titleEn: "Double Height Entrance Atrium Lobby",
        titleBn: "ডাবল হাইট প্রবেশদ্বার অভ্যর্থনা লবি",
        descriptionEn: "Splendid Italian marble flooring, ambient warm architectural lights, and hand-crafted metal panels.",
        descriptionBn: "চিত্তাকর্ষক ইতালীয় মার্বেল ফ্লোরিং, চমৎকার আলোকসজ্জা এবং হাতে খোদাই করা মেটাল প্যানেল সমৃদ্ধ লবি।"
      },
      {
        url: isResidential 
          ? "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90" // Living room
          : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=90", // Corporate office open space
        titleEn: isResidential ? "Stately Double-Glazed Formal Lounge" : "Premium Open-Format High-Tech Workspace",
        titleBn: isResidential ? "ডাবল-গ্লেজড গ্লাস বিশিষ্ট প্রধান ড্রয়িং হল" : "উচ্চ প্রযুক্তির হাই-টেক কর্পোরেট ওয়ার্কস্পেস",
        descriptionEn: isResidential 
          ? "Expansive panoramic window layouts allowing seamless natural light penetration with acoustic isolation."
          : "Flexible fluid operational floor outlines customized for premium enterprise high-density teams.",
        descriptionBn: isResidential 
          ? "শব্দ রোধী সুবিশাল গ্লাস উইন্ডো যা চমৎকার প্রাকৃতিক আলো চলাচলের নিশ্চয়তা দেয়।"
          : "উচ্চ ক্ষমতাসম্পন্ন আধুনিক ম্যানেজমেন্ট ও কর্মীদের কাজের জন্য উপযোগী উন্মুক্ত ফ্লোর নকশা।"
      },
      {
        url: isResidential
          ? "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=90" // Master Suite
          : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=90", // Conference Room
        titleEn: isResidential ? "Royal Penthouse Master Suite" : "Grand Executive Executive Boardroom",
        titleBn: isResidential ? "রয়্যাল পেন্টহাউস মাস্টার বেডরুম" : "অভিজাত এক্সিকিউটিভ বোর্ডরুম",
        descriptionEn: isResidential
          ? "Sophisticated oak finishes, concealed warm ceiling climate ducts, and dynamic smart-home visual hub."
          : "Advanced digital whiteboards, motorized laser projection, and micro-perforated acoustic woodwork panels.",
        descriptionBn: isResidential
          ? "পরিপাটি ওডি ফিনিশিং, চমৎকার হিডেন সিলিং এবং আধুনিক স্মার্ট-হোম নিয়ন্ত্রণ প্যানেল।"
          : "ডিজিটাল ইন্টারেক্টিভ হোয়াইটবোর্ড, আধুনিক লেজার প্রজেকশন এবং সাউন্ড ট্র্যাপ অ্যাকোস্টিক উডেন প্যানেল।"
      },
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=90",
        titleEn: "Celestial Horizon Rooftop Infinity Pool",
        titleBn: "ছাদভিত্তিক ইনফিনিটি সুইমিং পুল",
        descriptionEn: "Eco-tempered warm water loop overlooking the stunning panoramic skyline of metropolitan Dhaka.",
        descriptionBn: "রাজধানীর মনোরম স্কাইলাইন উপভোগের ব্যবস্থা সহ পরিবেশবান্ধব হিটেড ওয়াটার সমৃদ্ধ ইনফিনিটি পুল।"
      }
    ];

    return [mainImg, ...subImages];
  };

  const images = getGalleryImages(project);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setIsZoomed(false);
      setZoomScale(1);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNext = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch Swipe Handling for Swipeable Lightbox
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext(); // swipe left -> next
    } else if (diff < -50) {
      handlePrev(); // swipe right -> prev
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images]);

  const toggleZoom = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1);
    } else {
      setIsZoomed(true);
      setZoomScale(1.8);
    }
  };

  if (!isOpen || !project || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-neutral-950/98 backdrop-blur-2xl selection:bg-[#C8A165]/30">
        
        {/* TOP PANEL: Brand & Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A165] animate-pulse" />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C8A165] uppercase block font-bold">
                {language === "en" ? "Mollik Elite Portfolio" : "মল্লিক এলিট পোর্টফোলিও"}
              </span>
              <h3 className="text-white text-xs font-black tracking-wider uppercase leading-none mt-1">
                {language === "en" ? project.name : project.nameBn} // GALLERY
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Button */}
            <button
              onClick={toggleZoom}
              className="p-2 bg-neutral-900 hover:bg-neutral-850 hover:text-[#C8A165] border border-neutral-800 text-neutral-400 rounded-lg transition-all flex items-center gap-1.5 text-[9.5px] uppercase font-mono tracking-wider cursor-pointer"
              title={language === "en" ? "Toggle Premium Lens View" : "লেন্স ভিউ পরিবর্তন করুন"}
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5 text-[#C8A165]" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isZoomed ? "Zoom Out" : "Zoom Luxe"}</span>
            </button>

            {/* Counter */}
            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-450 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
              {activeIndex + 1} / {images.length}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-[#C8A165] hover:bg-white text-neutral-950 rounded-lg transition-all cursor-pointer shadow-lg hover:rotate-90 flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4 font-black" />
            </button>
          </div>
        </div>

        {/* MIDDLE PANEL: Main Image with Swiper */}
        <div 
          className="relative flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-12 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background blurred ambiance */}
          <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
            <img 
              src={images[activeIndex].url} 
              alt="Blurred backdrop" 
              className="w-full h-full object-cover filter blur-3xl scale-125"
            />
          </div>

          {/* Navigation - Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-6 z-10 p-3 bg-neutral-950/80 hover:bg-[#C8A165] backdrop-blur-md text-white hover:text-neutral-950 border border-neutral-850 hover:border-[#C8A165] rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* View Container with Luxury Zoom Transition */}
          <div className="relative max-w-5xl max-h-[64vh] sm:max-h-[68vh] aspect-video w-full z-10 flex items-center justify-center overflow-hidden rounded-xl border border-neutral-900/60 bg-neutral-950 shadow-2xl group">
            
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex].url}
                alt={language === "en" ? images[activeIndex].titleEn : images[activeIndex].titleBn}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ 
                  opacity: 1, 
                  scale: zoomScale,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }}
                exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.35 } }}
                className={`max-w-full max-h-full object-contain select-none transition-transform pointer-events-auto ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={toggleZoom}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Corner Badge */}
            <div className="absolute bottom-4 left-4 bg-neutral-950/85 backdrop-blur-md border border-[#C8A165]/35 p-2 px-3 rounded-md text-[8.5px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-1.5 shadow-2xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-3 h-3 text-[#C8A165] animate-pulse" />
              <span>{language === "en" ? "Premium Architectural Rendering" : "প্রিমিয়াম থ্রিডি রেন্ডারিং"}</span>
            </div>
          </div>

          {/* Navigation - Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-6 z-10 p-3 bg-neutral-950/80 hover:bg-[#C8A165] backdrop-blur-md text-white hover:text-neutral-950 border border-neutral-850 hover:border-[#C8A165] rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* BOTTOM PANEL: Info Card Display (Museum Description) */}
        <div className="bg-neutral-950 border-t border-neutral-900 p-6 sm:p-8 z-10">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Meta Descriptions */}
            <div className="space-y-2 flex-1">
              <span className="text-[9px] font-mono text-[#C8A165] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Compass className="w-3 h-3" />
                {language === "en" ? "VIEWPOINT PERSPECTIVE" : "ভিউ পয়েন্ট পার্সপেক্টিভ"}
              </span>
              <h4 className="text-white text-base sm:text-lg font-black tracking-wide font-serif">
                {language === "en" ? images[activeIndex].titleEn : images[activeIndex].titleBn}
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl">
                {language === "en" ? images[activeIndex].descriptionEn : images[activeIndex].descriptionBn}
              </p>
            </div>

            {/* Mini Specs badge to anchor B2B trust */}
            <div className="border border-neutral-850 bg-neutral-900/40 p-4 rounded-xl flex flex-row md:flex-col gap-4 justify-between md:justify-center items-center md:items-start min-w-[200px] shadow-inner font-sans">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C8A165]" />
                <div>
                  <span className="text-[7.5px] font-mono uppercase text-neutral-450 block tracking-widest">
                    {language === "en" ? "BUILD SPECIFICATION" : "নির্মাণ স্পেসিফিকেশন"}
                  </span>
                  <span className="text-white font-extrabold text-[11px] uppercase tracking-wide">
                    {language === "en" ? project.type : project.typeBn}
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-neutral-450">
                <strong className="text-white font-bold">{language === "en" ? "Pricing: " : "মূল্য: "}</strong>
                <span className="text-[#C8A165] font-black font-serif text-[11px]">{language === "en" ? project.price : project.priceBn}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AnimatePresence>
  );
}
