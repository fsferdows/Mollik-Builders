import React, { useState, useRef, useEffect } from "react";
import { X, Compass, Info, RotateCcw, Maximize, Play, Pause, ChevronRight } from "lucide-react";
import { Project, Language } from "../types";
import { motion } from "motion/react";

interface VirtualTourModalProps {
  project: Project;
  language: Language;
  onClose: () => void;
}

interface TourRoom {
  id: string;
  name: string;
  nameBn: string;
  image: string;
  hotspots: {
    x: number; // percentage from left
    y: number; // percentage from top
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
  }[];
}

export default function VirtualTourModal({ project, language, onClose }: VirtualTourModalProps) {
  const getDynamicRoomsForProject = (projId: string): TourRoom[] => {
    const isMollikTower = projId === "mollik-tower";
    const isMollikHeights = projId === "mollik-heights";
    const isMollikGarden = projId === "mollik-garden";
    
    if (isMollikTower) {
      return [
        {
          id: "lobby",
          name: "Imperial Base Entrance Lobby",
          nameBn: "মল্লিক টাওয়ার রাজকীয় লবি",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2600",
          hotspots: [
            {
              x: 20, y: 55,
              title: "RAJUK Grade Column Bracing",
              titleBn: "রাজউক কাঠামোগত পিলার",
              description: "Designed for high seismic shear resistance complying with BNBC standards in Dakshinkhan.",
              descriptionBn: "দক্ষিণখানের মাটি বিবেচনায় রেখে শক্তিশালী বিএনবিসি ও রাজউক অনুমোদিত ক্যাস্ট-ইন-সিটু আর্থমুভিং রড পাইলিং।"
            },
            {
              x: 70, y: 40,
              title: "Secure Access Turnstiles",
              titleBn: "স্মার্ট আরএফআইডি সিকিউরিটি",
              description: "Provides RFID-authenticated gates integrated directly to tower guardhouse.",
              descriptionBn: "নিরাপত্তার স্বার্থে টাওয়ার গার্ডহাউসের সাথে সরাসরি সংযুক্ত আরএফআইডি সিকিউরিটি ও লবি।"
            }
          ]
        },
        {
          id: "living-room",
          name: "Mollik Landmark Living Space",
          nameBn: "বিলাসবহুল ড্রইং এবং লিভিং",
          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2600",
          hotspots: [
            {
              x: 30, y: 50,
              title: "Double-Glazed Low-E Glass",
              titleBn: "শব্দনিরোধক ডাবল গ্লেজড উইন্ডো",
              description: "Reduces heat up to 40% with absolute noise-dampening capabilities against bustling suburbs.",
              descriptionBn: "বাইরের কোলাহল প্রতিরোধ করে ঘরের ভেতরের শান্ত মনোরম পরিবেশ বজায় রাখে।"
            },
            {
              x: 65, y: 75,
              title: "Smart HVAC Air Purification System",
              titleBn: "স্মার্ট এইচভিএসি এয়ার পিউরিফিকেশন",
              description: "Continuous PM2.5 monitoring keeping indoor air purely fresh in Dhaka.",
              descriptionBn: "ঢাকার অভ্যন্তরীণ দূষণ এড়াতে ঘরের সুপেয় ফ্রেস এয়ার ভেন্টিলেশন ও ফিল্টারিং ফিল্টার।"
            }
          ]
        },
        {
          id: "balcony-view",
          name: "Panoramic South Balcony (Dakshinkhan Skyline)",
          nameBn: "দক্ষিণমুখী খোলা ব্যালকনি (দক্ষিণখান ভিউ)",
          image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2600",
          hotspots: [
            {
              x: 50, y: 45,
              title: "Outside Dakshinkhan Miyabari Rooftops",
              titleBn: "দক্ষিণখান মিয়াবাড়ী মনোরম আকাশরেখা",
              description: "Direct unobstructed south breeze from the lush green suburbs of Dakshinkhan, Dhaka.",
              descriptionBn: "ঢাকা দক্ষিণখানের সবুজ নির্মল বাতাস ও মনোরম প্রাকৃতিক ভিউয়ের জন্য উন্মুক্ত বারান্দা।"
            }
          ]
        }
      ];
    } else if (isMollikHeights) {
      return [
        {
          id: "living-room",
          name: "Mollik Heights Grand Suite",
          nameBn: "মল্লিক হাইটস বিলাসবহুল লিভিং",
          image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2600",
          hotspots: [
            {
              x: 35, y: 40,
              title: "Imported Greek Pentelikon Marble",
              titleBn: "গ্রীক পেন্টেলিকন মার্বেল ফ্লোরিং",
              description: "Polished to an ultra-reflective high gloss mirror-finish layout.",
              descriptionBn: "অত্যন্ত দৃষ্টিনন্দন ঝকঝকে গ্রীক মার্বেল যা ঘরের আভিজাত্য বহুগুণ বাড়িয়ে তোলে।"
            }
          ]
        },
        {
          id: "kitchen-dining",
          name: "Enclosed Culinary Center",
          nameBn: "মডার্ন কুলিনারি কিচেন",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2600",
          hotspots: [
            {
              x: 45, y: 60,
              title: "Granites Counter Exhaust System",
              titleBn: "কুলিনারি চিমনি ও গ্রানাইট কাউন্টার",
              description: "Automated exhaust chimney safely eliminating luxury cooking heat.",
              descriptionBn: "হোয়াইট মার্বেল কাউন্টারটপ ও শক্তিশালী ধোঁয়ানিষ্কাশন অটো-চিমনি প্লেসমেন্ট।"
            }
          ]
        },
        {
          id: "terrace-garden",
          name: "Miyabari Residential Heights Terrace",
          nameBn: "মিয়াবাড়ী হাইটস অবজারভেটরি ডেক",
          image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?q=80&w=2600",
          hotspots: [
            {
              x: 60, y: 50,
              title: "Dakshinkhan Miyabari Buffer Zone",
              titleBn: "দক্ষিণখান মিয়াবাড়ী সবুজ বাফার",
              description: "Enjoy secure panoramic views overlooking Dakshinkhan Miyabari suburban greenery with cool morning air.",
              descriptionBn: "মিয়াবাড়ীর শান্ত পরিবেশ ও প্রাতঃকালীন সতেজ প্রাকৃতিক বাতাস উপভোগ করার ছাদবাগান।"
            }
          ]
        }
      ];
    } else {
      const isUttarkhan = (project.location && (project.location.toLowerCase().includes("uttarkhan") || project.location.toLowerCase().includes("uttorkhan"))) || 
                          (project.locationBn && project.locationBn.includes("উত্তরখান"));
      const locKey = isUttarkhan ? "Uttarkhan" : "Dakshinkhan";
      const locKeyBn = isUttarkhan ? "উত্তরখান" : "দক্ষিণখান";
      
      return [
        {
          id: "living-room",
          name: `${project.name} Premier Lounge`,
          nameBn: `${project.nameBn} বিলাসবহুল লাউঞ্জ`,
          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2600",
          hotspots: [
            {
              x: 40, y: 50,
              title: "Smart Thermostat Integration",
              titleBn: "স্মার্ট মোবাইল অটোমেশন কন্ট্রোল",
              description: "Control AC temp and smart acoustic window blinds right from your Android/iOS smartphone.",
              descriptionBn: "স্মার্টফোন থেকেই ঘরের লাইট ও এসি যেকোনো অবস্থায় নিয়ন্ত্রণ করতে সেলফ-প্যানেল।"
            }
          ]
        },
        {
          id: "bedroom",
          name: "Presidential Master Suite",
          nameBn: "মাস্টার বেডরুম সুইট",
          image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2600",
          hotspots: [
            {
              x: 30, y: 60,
              title: "Burmese Teak Door Panel",
              titleBn: "খাঁটি বার্মিজ সেগুন ডোর",
              description: "Pre-polished heavy doors certified for heavy acoustic sound insulation.",
              descriptionBn: "ঘরের অভ্যন্তরীণ গোপনীয়তা রক্ষায় প্রি-পলিশ করা সেগুন কাঠের ভারী দরজা।"
            }
          ]
        },
        {
          id: "deck",
          name: `${locKey} Suburban Sun Deck`,
          nameBn: `${locKeyBn} প্যানোরামিক ব্যালকনি জোন`,
          image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2600",
          hotspots: [
            {
              x: 50, y: 35,
              title: `Unobstructed Outside Horizon (${locKey} Dhaka)`,
              titleBn: `${locKeyBn} সায়াহ্ন আকাশ ও ভিউ`,
              description: `A pristine and safe viewing balcony looking towards the refreshing green residential sectors of ${locKey}, Dhaka.`,
              descriptionBn: `ঢাকা ${locKeyBn}-এর সতেজ এবং প্রাকৃতিক সবুজায়ন উপভোগ করতে চমৎকার উন্মুক্ত আউটডোর স্পেস।`
            }
          ]
        }
      ];
    }
  };

  const rooms = getDynamicRoomsForProject(project.id);

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [panning, setPanning] = useState(0); // value from 0 to 100 representing background translation
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startPanning, setStartPanning] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);
  const [isPlayingAutoPan, setIsPlayingAutoPan] = useState(true);

  const activeRoom = rooms[activeRoomIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-pan timer
  useEffect(() => {
    let timer: any;
    if (isPlayingAutoPan && !isDragging) {
      timer = setInterval(() => {
        setPanning((prev) => (prev + 0.08) % 100);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isPlayingAutoPan, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartPanning(panning);
    setIsPlayingAutoPan(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    // translate movement speed to panning offset
    const change = (dx / (containerRef.current?.offsetWidth || 800)) * 100;
    let nextPanning = (startPanning - change) % 100;
    if (nextPanning < 0) nextPanning += 100;
    setPanning(nextPanning);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch triggers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartPanning(panning);
    setIsPlayingAutoPan(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const change = (dx / (containerRef.current?.offsetWidth || 400)) * 100;
    let nextPanning = (startPanning - change) % 100;
    if (nextPanning < 0) nextPanning += 100;
    setPanning(nextPanning);
  };

  // Convert raw slider value or computed panning to compass angle
  const compassAngle = (panning / 100) * 360;

  return (
    <div 
      id="virtual-tour-modal" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-55 flex items-center justify-center p-2 sm:p-4 cursor-pointer"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-neutral-900 text-white w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col h-[90vh] md:h-[80vh] cursor-default"
      >
        
        {/* Header HUD */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950 bg-opacity-40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C8A165]/10 rounded-lg border border-[#C8A165]/20">
              <Compass 
                className="w-5 h-5 text-[#C8A165] transition-transform duration-100" 
                style={{ transform: `rotate(${compassAngle}deg)` }}
              />
            </div>
            <div>
              <span className="text-[9px] text-[#C8A165] uppercase font-black tracking-widest block font-mono">
                {language === "en" ? `${project.name} • VIRTUAL HANDOVER TOUR` : `${project.nameBn} • ইন্টারেক্টিভ ভার্চুয়াল ট্যুর`}
              </span>
              <h2 className="text-sm md:text-base font-serif font-bold text-neutral-100 flex items-center gap-1.5 leading-tight">
                <span>{language === "en" ? "Currently Inspecting:" : "বর্তমান পরিদর্শিত স্থান:"}</span>
                <span className="text-white font-extrabold">{language === "en" ? activeRoom.name : activeRoom.nameBn}</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-750 transition-colors text-slate-100 hover:text-white cursor-pointer border border-neutral-750"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic 360 Viewport Container */}
        <div className="flex-1 relative min-h-0 bg-neutral-950 select-none overflow-hidden flex flex-col md:flex-row">
          
          {/* Main 360 drag frame */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="flex-1 h-full relative cursor-grab active:cursor-grabbing overflow-hidden group touch-none"
          >
            {/* The infinite-horizontal wrapping background translation box */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all pointer-events-none duration-75"
              style={{
                backgroundImage: `url(${activeRoom.image})`,
                backgroundPosition: `${panning}% center`,
                scale: "1.1", // slight magnification for panoramic feel
              }}
            />

            {/* Subtle vignettes overlay for realistic depth & focal effects */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none mix-blend-multiply opacity-55" />

            {/* Static HUD: instruction card fades out */}
            <div className="absolute top-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-neutral-800 text-[10px] sm:text-xs text-neutral-300 font-medium">
              🖱️ {language === "en" ? "Click & Drag to Look Around 360°" : "৩৬০° ভিউ দেখতে ক্লিক করে মাউস টানুন"}
            </div>

            {/* Floating hot spots linked relative to panning coordinate translation */}
            {activeRoom.hotspots.map((spot) => {
              let rawX = spot.x - (panning - 50) * 1.5;
              if (rawX < 0) rawX += 100;
              const translatedX = rawX % 100;

              return (
                <div
                  key={`${spot.title}-${spot.x}-${spot.y}`}
                  className="absolute transition-all duration-75 ease-out transform -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer pointer-events-auto"
                  style={{
                    left: `${translatedX}%`,
                    top: `${spot.y}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(spot);
                  }}
                >
                  <div className="relative group/ping flex items-center justify-center">
                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#C8A165]/35 animate-ping opacity-75"></span>
                    <button className="relative flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 border border-[#C8A165] text-white hover:bg-[#C8A165] hover:text-neutral-950 transition-all shadow-[0_0_15px_rgba(200,161,101,0.5)]">
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* Mini tooltip popup on hover */}
                    <div className="absolute bottom-6 bg-neutral-900/95 border border-neutral-800 text-[10px] text-white px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover/ping:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {language === "en" ? spot.title : spot.titleBn}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Compass HUD Widget overlaid in a chic circular layout */}
            <div className="absolute bottom-4 right-4 bg-neutral-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-850 flex items-center gap-2 text-xs font-mono select-none">
              <Compass className="w-4 h-4 text-[#C8A165]" style={{ transform: `rotate(${compassAngle}deg)` }} />
              <div>
                <span className="block text-[8px] text-neutral-400 font-bold tracking-widest">BEARING</span>
                <span className="text-white font-bold">{Math.round(compassAngle)}° {compassAngle < 90 ? "NE" : compassAngle < 180 ? "SE" : compassAngle < 270 ? "SW" : "NW"}</span>
              </div>
            </div>

            {/* Auto-rotation control */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayingAutoPan(!isPlayingAutoPan);
                }}
                className="bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingAutoPan ? <Pause className="w-3 h-3 text-red-400" /> : <Play className="w-3 h-3 text-[#C8A165]" />}
                <span>{isPlayingAutoPan ? (language === "en" ? "Stop Auto-Rotation" : "স্বয়ংক্রিয় ঘূর্ণন বন্ধ") : (language === "en" ? "Auto-Rotate" : "স্বয়ংক্রিয় ঘূর্ণন")}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPanning(50);
                  setIsPlayingAutoPan(false);
                }}
                className="bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 text-white p-1.5 rounded-lg transition-all cursor-pointer"
                title={language === "en" ? "Recenter View" : "ভিউ রিসেট করুন"}
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Right Panel/Sidebar: Room Selector & Feature Info Detail */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-950 p-4 sm:p-5 flex flex-col justify-between shrink-0 h-[280px] md:h-full overflow-y-auto">
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#C8A165] tracking-widest font-mono">
                {language === "en" ? "EXPLORE SUITES" : "অন্যান্য কক্ষ ম্যাপ"}
              </h3>

              {/* Room Selection Buttons */}
              <div className="space-y-2">
                {rooms.map((room, index) => {
                  const isActive = activeRoomIndex === index;
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setActiveRoomIndex(index);
                        setSelectedHotspot(null);
                        setPanning(50); // Recenter on change
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        isActive
                           ? "bg-[#C8A165]/10 border-[#C8A165] text-white"
                           : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#C8A165]" : "bg-neutral-600"}`} />
                        <span className="text-xs font-bold font-sans">
                          {language === "en" ? room.name : room.nameBn}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>

              {/* Hotspot details panel */}
              <div className="pt-3 border-t border-neutral-850">
                <h4 className="text-[10px] font-black uppercase text-[#C8A165] tracking-widest font-mono mb-2">
                  {language === "en" ? "SENSORY HIGHLIGHT" : "স্মার্ট বৈশিষ্ট্যের বিবরণ"}
                </h4>

                {selectedHotspot ? (
                  <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-850 space-y-1.5 animate-fadeIn">
                    <h5 className="text-[11px] font-extrabold text-white flex items-center gap-1">
                      <span className="w-1 h-3 bg-[#C8A165] rounded-full inline-block" />
                      {language === "en" ? selectedHotspot.title : selectedHotspot.titleBn}
                    </h5>
                    <p className="text-[10px] text-neutral-400 font-light leading-normal">
                      {language === "en" ? selectedHotspot.description : selectedHotspot.descriptionBn}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-neutral-900/40 rounded-lg border border-dashed border-neutral-850 text-center text-[10px] font-sans text-neutral-500 py-6">
                    {language === "en" ? "Click a glowing hotspot button in the 360° panning frame to view architectural engineering specs." : "স্থাপত্য প্রকৌশলগত বিবরণ দেখতে ৩৬০° ভিউপোর্টের যেকোনো গোল্ডেন হটস্পটে ক্লিক করুন।"}
                  </div>
                )}
              </div>
            </div>

            {/* Direct consultation call block */}
            <div className="pt-3 border-t border-neutral-850 mt-4">
              <div className="p-2.5 bg-[#1B4D3E]/30 rounded-lg border border-[#1B4D3E]/45">
                <p className="text-[9px] text-[#C8A165] font-extrabold uppercase tracking-widest mb-1">
                  {language === "en" ? "Handover Guarantee" : "হ্যান্ডওভার গ্যারান্টি"}
                </p>
                <p className="text-[10px] text-neutral-300 font-light leading-relaxed">
                  {language === "en" 
                    ? "Verify custom layout mutations directly with our principal architects." 
                    : "আপনার নিজস্ব কাস্টমাইজেশন প্ল্যান নিয়ে কথা বলুন আমাদের প্রধান আর্কিটেক্টদের সাথে।"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
