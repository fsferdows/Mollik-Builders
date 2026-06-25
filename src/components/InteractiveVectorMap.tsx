import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, School, Hospital, Navigation, Clock, Activity, Info, 
  Map as MapIcon, Compass, Sparkles, AlertCircle, ArrowRight
} from "lucide-react";

interface InteractiveVectorMapProps {
  language: "en" | "bn";
}

interface InfrastructureNode {
  id: string;
  name: string;
  nameBn: string;
  type: "school" | "hospital" | "transit";
  x: number;
  y: number;
  details: string;
  detailsBn: string;
}

interface RoutePreset {
  name: string;
  nameBn: string;
  x: number;
  y: number;
  pathD: string;
  distance: string;
  driveTimeMin: number;
  traffic: "Smooth" | "Moderate" | "Heavy";
  trafficColor: string;
}

export default function InteractiveVectorMap({ language }: InteractiveVectorMapProps) {
  const [viewMode, setViewMode] = useState<"blueprint" | "heatmap">("blueprint");
  const [hoveredNode, setHoveredNode] = useState<InfrastructureNode | null>(null);
  const [isHqHovered, setIsHqHovered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [routeResult, setRouteResult] = useState<RoutePreset | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Address Details
  const hqAddress = "House #42, Road #11, Sector-4, Gulshan-2, Dhaka-1212";
  const hqAddressBn = "হাউজ #৪২, রোড #১১, সেক্টর-৪, গুলশান-২, ঢাকা-১২১২";

  // Infrastructure nodes
  const nodes: InfrastructureNode[] = [
    { 
      id: "sch-1", 
      name: "Scholastica School", 
      nameBn: "স্কলাস্টিকা স্কুল", 
      type: "school", 
      x: 140, 
      y: 90, 
      details: "Top-tier English Medium Grammar school within 4 minutes drive.",
      detailsBn: "৪ মিনিট গাড়ি চালানোর দূরত্বে ঢাকা শীর্ষ ইংরেজি মাধ্যম স্কুল।"
    },
    { 
      id: "sch-2", 
      name: "American International School (AISD)", 
      nameBn: "আমেরিকান ইন্টারন্যাশনাল স্কুল (AISD)", 
      type: "school", 
      x: 480, 
      y: 110, 
      details: "Elite diplomatic academy located nearby Baridhara.",
      detailsBn: "বারিধারা কূটনৈতিক জোনে অবস্থিত বিশ্বখ্যাত স্কুল।"
    },
    { 
      id: "hosp-1", 
      name: "United Hospital Gulshan", 
      nameBn: "ইউনাইটেড হাসপাতাল গুলশান", 
      type: "hospital", 
      x: 180, 
      y: 310, 
      details: "Multispecialty 24/7 world-class diagnostic medical centre.",
      detailsBn: "১.৮ কিমি দূরত্বে অবস্থিত ২৪/৭ জরুরি চিকিৎসাসেবা।"
    },
    { 
      id: "hosp-2", 
      name: "Cure Medical Healthcare", 
      nameBn: "কিউর মেডিকেল হেলথকেয়ার", 
      type: "hospital", 
      x: 510, 
      y: 280, 
      details: "Premium private specialized clinic & children center.",
      detailsBn: "অভিজাত বিশেষায়িত প্রাইভেট ক্লিনিক ও ডায়াগনস্টিক।"
    },
    { 
      id: "trans-1", 
      name: "Gulshan Avenue Metro-Station", 
      nameBn: "গুলশান এভিনিউ এক্সপ্রেসওয়ে স্টেশন", 
      type: "transit", 
      x: 350, 
      y: 80, 
      details: "Upcoming Mass Transit bypass terminal block.",
      detailsBn: "ভবিষ্যত মাস ট্রানজিট বাইপাস টার্মিনাল ব্লক।"
    }
  ];

  // Route presets supporting beautiful animated path-drawing from premium locations
  const routePresets: { [key: string]: RoutePreset } = {
    banani: {
      name: "Banani",
      nameBn: "বনানী",
      x: 70,
      y: 200,
      pathD: "M 70 200 C 180 200, 240 200, 350 200",
      distance: "1.4 km",
      driveTimeMin: 5,
      traffic: "Smooth",
      trafficColor: "text-emerald-500 bg-emerald-50 border-emerald-100"
    },
    baridhara: {
      name: "Baridhara",
      nameBn: "বারিধারা",
      x: 530,
      y: 200,
      pathD: "M 530 200 C 450 200, 400 200, 350 200",
      distance: "1.8 km",
      driveTimeMin: 6,
      traffic: "Moderate",
      trafficColor: "text-amber-500 bg-amber-50 border-amber-100"
    },
    uttara: {
      name: "Uttara Sector 3",
      nameBn: "উত্তরা ৩ নং সেক্টর",
      x: 350,
      y: 30,
      pathD: "M 350 30 C 350 80, 350 140, 350 200",
      distance: "8.5 km",
      driveTimeMin: 22,
      traffic: "Heavy",
      trafficColor: "text-rose-500 bg-rose-50 border-rose-100"
    },
    dhanmondi: {
      name: "Dhanmondi Satmasjid Road",
      nameBn: "ধানমন্ডি সাতমসজিদ রোড",
      x: 90,
      y: 350,
      pathD: "M 90 350 C 150 300, 240 250, 350 200",
      distance: "9.2 km",
      driveTimeMin: 28,
      traffic: "Moderate",
      trafficColor: "text-amber-500 bg-amber-50 border-amber-100"
    },
    motijheel: {
      name: "Motijheel C/A",
      nameBn: "মতিঝিল",
      x: 350,
      y: 370,
      pathD: "M 350 370 C 350 300, 350 250, 350 200",
      distance: "11.0 km",
      driveTimeMin: 35,
      traffic: "Heavy",
      trafficColor: "text-rose-500 bg-rose-50 border-rose-100"
    }
  };

  // Triggers path drawing and updates driving directions state
  const handleCalculateRoute = (presetKey: string) => {
    setIsRouting(true);
    setRouteResult(null);
    const target = routePresets[presetKey];
    setCurrentLocation(language === "en" ? target.name : target.nameBn);
    
    // Simulate navigation plotting latency for premium look
    setTimeout(() => {
      setRouteResult(target);
      setIsRouting(false);
    }, 600);
  };

  // Handles custom location text query
  const handleCustomRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation.trim()) return;

    setIsRouting(true);
    setRouteResult(null);

    setTimeout(() => {
      // Find a matching key or generate an organic estimated value
      const queryLower = currentLocation.toLowerCase();
      let key = "banani"; // Default fallback fallback
      if (queryLower.includes("uttara")) key = "uttara";
      else if (queryLower.includes("baridhara")) key = "baridhara";
      else if (queryLower.includes("dhanmondi") || queryLower.includes("mirpur")) key = "dhanmondi";
      else if (queryLower.includes("motijheel") || queryLower.includes("badda")) key = "motijheel";

      const matchedPreset = routePresets[key];
      setRouteResult({
        ...matchedPreset,
        name: currentLocation,
        nameBn: currentLocation,
        distance: `${(Math.random() * 4 + 2).toFixed(1)} km`,
        driveTimeMin: Math.floor(Math.random() * 15 + 8)
      });
      setIsRouting(false);
    }, 700);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xl flex flex-col h-full">
      {/* Top dashboard controls panel */}
      <div className="px-5 py-4 bg-neutral-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h5 className="font-serif font-black text-[13px] tracking-wide text-[#C8A165]">
              {language === "en" ? "VECTOR BLUEPRINT CONSOLE" : "ভেক্টর ম্যাপ ব্লু-প্রিন্ট কনসোল"}
            </h5>
          </div>
          <p className="text-[10px] text-neutral-400">
            {language === "en" ? "Mollik Elite GIS Network System" : "মোল্লিক এলিট জিআইএস নেটওয়ার্ক সিস্টেম"}
          </p>
        </div>

        {/* Dynamic Map Layers Switcher */}
        <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("blueprint")}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all ${
              viewMode === "blueprint"
                ? "bg-[#C8A165] text-neutral-950 font-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {language === "en" ? "Blueprint" : "ব্লু-প্রিন্ট"}
          </button>
          
          <button
            onClick={() => setViewMode("heatmap")}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all ${
              viewMode === "heatmap"
                ? "bg-[#C8A165] text-neutral-950 font-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {language === "en" ? "Heatmap" : "ইনফ্রাস্ট্রাকচার ম্যাপ"}
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-neutral-950 min-h-[300px] overflow-hidden flex flex-col justify-end">
        {/* Dynamic Map Grid Render (SVG viewport) */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full object-cover transition-colors duration-500 bg-neutral-950"
          >
            {/* Coordinates Grid System */}
            <defs>
              <pattern id="lux-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(200, 161, 101, 0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lux-grid)" />

            {/* Glowing concentric heat circle representing premium radius */}
            <circle 
              cx="350" 
              cy="200" 
              r="120" 
              fill="none" 
              stroke="rgba(200,161,101,0.06)" 
              strokeWidth="2" 
              className="animate-[pulse_4s_infinite_ease-in-out]" 
            />
            <circle 
              cx="350" 
              cy="200" 
              r="220" 
              fill="none" 
              stroke="rgba(200,161,101,0.03)" 
              strokeWidth="1" 
              strokeDasharray="5,5" 
            />

            {/* Simulated Road networks with futuristic neon paths */}
            {/* Horizontal Road (Gulshan Road 11) */}
            <path 
              d="M 10 200 H 590" 
              stroke="rgba(230,230,230,0.12)" 
              strokeWidth="10" 
              strokeLinecap="round" 
            />
            <path 
              d="M 10 200 H 590" 
              stroke="#C8A165" 
              strokeWidth="1.5" 
              strokeDasharray="6,4" 
              className="opacity-40" 
            />

            {/* Vertical Road (Gulshan Avenue) */}
            <path 
              d="M 350 10 V 390" 
              stroke="rgba(230,230,230,0.12)" 
              strokeWidth="14" 
              strokeLinecap="round" 
            />
            <path 
              d="M 350 10 V 390" 
              stroke="#C8A165" 
              strokeWidth="1.5" 
              strokeDasharray="6,4" 
              className="opacity-40" 
            />

            {/* Madani Avenue Link */}
            <path 
              d="M 350 200 L 590 320" 
              stroke="rgba(230,230,230,0.08)" 
              strokeWidth="10" 
              strokeLinecap="round" 
            />

            {/* Landmark text labeling */}
            <text x="365" y="40" fill="#9e9e9e" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.6">GULSHAN AVE</text>
            <text x="30" y="190" fill="#9e9e9e" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.6">ROAD 11 (BANANI LINK)</text>
            <text x="460" y="270" fill="#9e9e9e" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.4" transform="rotate(22 460 270)">MADANI AVE</text>

            {/* Highlighted Heatmap Zones showing Schools and Hospitals */}
            {viewMode === "heatmap" && (
              <g className="animate-[fadeIn_0.5s_ease-out]">
                {/* School radii gradients */}
                <circle cx="140" cy="90" r="45" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="480" cy="110" r="50" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                {/* Hospital radii gradients */}
                <circle cx="180" cy="310" r="55" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="510" cy="280" r="45" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                {/* Transit Center */}
                <circle cx="350" cy="80" r="30" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="3,3" />
              </g>
            )}

            {/* Glow overlays/connections when hover or selected state occurs */}
            <AnimatePresence>
              {routeResult && (
                <motion.path
                  d={routeResult.pathD}
                  stroke="#C8A165"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.8 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="drop-shadow-[0_0_8px_rgba(200,161,101,0.8)]"
                />
              )}
            </AnimatePresence>

            {/* Neighborhood Infrastructure Markers */}
            {viewMode === "heatmap" && (
              <g>
                {nodes.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Interactive Target Circle */}
                      <circle cx={node.x} cy={node.y} r="16" fill="transparent" />
                      
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isHovered ? "10" : "7"} 
                        fill={node.type === "school" ? "#0EA5E9" : node.type === "hospital" ? "#10B981" : "#F59E0B"} 
                        className="transition-all duration-300 opacity-90"
                      />
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isHovered ? "16" : "12"} 
                        fill="none" 
                        stroke={node.type === "school" ? "rgba(14,165,233,0.4)" : node.type === "hospital" ? "rgba(16,185,201,0.4)" : "rgba(245,158,11,0.4)"} 
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Origin Marker for Planned Route */}
            {routeResult && (
              <g className="animate-bounce">
                <circle cx={routeResult.x} cy={routeResult.y} r="18" fill="rgba(255,255,255,0.15)" />
                <circle cx={routeResult.x} cy={routeResult.y} r="7" fill="#ffffff" />
                <circle cx={routeResult.x} cy={routeResult.y} r="3" fill="#111111" />
              </g>
            )}

            {/* MOLLIK SITE HQ PRIMARY MARKER (ALWAYS DISPLAYED) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setIsHqHovered(true)}
              onMouseLeave={() => setIsHqHovered(false)}
            >
              {/* Massive Outer luxury aura pulse ring representing status & target */}
              <circle
                cx="350"
                cy="200"
                r="38"
                fill="none"
                stroke="url(#luxGoldGradient)"
                strokeWidth="1"
                strokeDasharray="4,4"
                className="animate-[spin_40s_linear_infinite] opacity-60"
              />
              <circle
                cx="350"
                cy="200"
                r={isHqHovered ? "28" : "20"}
                fill="none"
                stroke="#C8A165"
                strokeWidth="1.5"
                className="animate-[ping_3s_infinite_ease-out] opacity-70"
              />
              <circle
                cx="350"
                cy="200"
                r={isHqHovered ? "18" : "11"}
                fill="rgba(200, 161, 101, 0.25)"
                className="transition-all duration-300"
                stroke="#C8A165"
                strokeWidth="1"
              />
              
              {/* Inner core solid gold pin point */}
              <circle
                cx="350"
                cy="200"
                r="5"
                fill="#C8A165"
                className="drop-shadow-[0_0_10px_#C29B5F]"
              />

              {/* Dynamic SVG Defs for gorgeous glow gradients */}
              <defs>
                <linearGradient id="luxGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C8A165" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </g>
          </svg>
        </div>

        {/* Floating marker HUD card showing exact address on HQ Hover */}
        <AnimatePresence>
          {isHqHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-xs p-3.5 bg-neutral-900/95 backdrop-blur-md rounded-xl border border-[#C8A165]/30 shadow-2xl text-center"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1 text-[#C8A165]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-black">
                  {language === "en" ? "MOLLIK BUILDERS HEADQUARTERS" : "মোল্লিক বিল্ডার্স সদর দফতর"}
                </span>
              </div>
              <p className="text-[11px] text-white font-medium leading-relaxed">
                {language === "en" ? hqAddress : hqAddressBn}
              </p>
              <div className="mt-1.5 text-[9px] text-neutral-400 font-mono">
                {language === "en" ? "Latitude: 23.7925° N | Longitude: 90.4184° E" : "অক্ষাংশ: ২৩.৭৯২৫° উত্তর | দ্রাঘিমাংশ: ৯০.৪১৮৪° পূর্ব"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating tooltip/specs showing details when nodes hovered */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-4 right-4 bottom-4 z-30 p-3 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${
                hoveredNode.type === "school" 
                  ? "bg-sky-500/10 text-sky-400" 
                  : hoveredNode.type === "hospital" 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {hoveredNode.type === "school" ? (
                  <School className="w-5 h-5" />
                ) : hoveredNode.type === "hospital" ? (
                  <Hospital className="w-5 h-5" />
                ) : (
                  <MapIcon className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                  {hoveredNode.type === "school" && (language === "en" ? "Premium Education Institution" : "প্রিমিয়াম শিক্ষাপ্রতিষ্ঠান")}
                  {hoveredNode.type === "hospital" && (language === "en" ? "Advanced Healthcare Diagnostic" : "উন্নত চিকিৎসাকেন্দ্র")}
                  {hoveredNode.type === "transit" && (language === "en" ? "High-speed Public Transit Hub" : "পাবলিক ট্রান্সপোর্ট হাব")}
                </span>
                <h6 className="font-serif font-black text-xs text-white">
                  {language === "en" ? hoveredNode.name : hoveredNode.nameBn}
                </h6>
                <p className="text-[10px] text-neutral-300 font-light">
                  {language === "en" ? hoveredNode.details : hoveredNode.detailsBn}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Route Planner Interface Area */}
      <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col gap-3">
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
          {language === "en" ? "INSTANT ROUTE PLANNING & DRIVE-TIME ESTIMATION" : "ইনস্ট্যান্ট রুট প্ল্যানিং ও ড্রাইভ-টাইম এস্টিমেশন"}
        </span>

        {/* Origin Quick Preselected Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(routePresets).map((presetKey) => {
            const preset = routePresets[presetKey];
            return (
              <button
                key={presetKey}
                onClick={() => handleCalculateRoute(presetKey)}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border cursor-pointer ${
                  currentLocation === preset.name || currentLocation === preset.nameBn
                    ? "bg-[#C8A165] border-[#C8A165] text-neutral-950 font-black"
                    : "bg-white border-neutral-250 text-neutral-600 hover:border-[#C8A165] hover:text-[#C8A165]"
                }`}
              >
                {language === "en" ? preset.name : preset.nameBn}
              </button>
            );
          })}
        </div>

        {/* Input Form representation */}
        <form onSubmit={handleCustomRouteSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder={language === "en" ? "Type Location (e.g. Banani, Dhanmondi, Uttara)..." : "আপনার বর্তমান স্থান লিখুন..."}
              className="w-full bg-white border border-neutral-250 pl-8 pr-3 py-2 rounded-lg text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-[#C8A165]"
            />
            <Navigation className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          
          <button
            type="submit"
            disabled={isRouting}
            className="px-4 py-2 bg-neutral-900 hover:bg-[#C8A165] text-white hover:text-neutral-950 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isRouting ? (
              <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            {language === "en" ? "Plot" : "পথ নির্ধারণ"}
          </button>
        </form>

        {/* Dynamic Route Info Deck Card */}
        <AnimatePresence mode="wait">
          {routeResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-neutral-900 text-white rounded-xl border border-[#C8A165]/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C8A165]/10 rounded-lg text-[#C8A165]">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono block">
                    {language === "en" ? "Estimated Drive Duration" : "আনুমানিক ড্রাইভ টাইম"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-black text-lg text-[#C8A165]">{routeResult.driveTimeMin}</span>
                    <span className="text-xs text-neutral-300 font-bold">{language === "en" ? "mins" : "মিনিট"}</span>
                    <span className="text-xs text-neutral-400 px-1">•</span>
                    <span className="text-xs text-neutral-300 font-medium">{routeResult.distance}</span>
                  </div>
                </div>
              </div>

              {/* Traffic feedback and native dynamic lookup action */}
              <div className="flex flex-col items-end gap-1.5 text-right font-mono">
                <div className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${routeResult.trafficColor}`}>
                  {language === "en" ? `Traffic: ${routeResult.traffic}` : `জ্যাম: ${routeResult.traffic === "Smooth" ? "স্বাভাবিক" : routeResult.traffic === "Moderate" ? "মাঝারি" : "তীব্র"}`}
                </div>
                <a
                  href={`https://maps.google.com/?saddr=${encodeURIComponent(currentLocation)}+Dhaka&daddr=${encodeURIComponent(hqAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold text-[#C8A165] hover:underline flex items-center gap-1"
                >
                  {language === "en" ? "Launch Active GPS" : "জিপিএস চালু করুন"} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
