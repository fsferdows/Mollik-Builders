import React, { useState, useEffect } from "react";
import { Project, Language } from "../types";
import { X, CheckCircle2, MapPin, Award, Layers, Download, Sparkles, AlertCircle, Calculator, Coins, Percent, ShieldCheck, Eye, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface ProjectDetailModalProps {
  project: Project;
  language: Language;
  onClose: () => void;
  onNewBookingSimulated: () => void;
}

interface Unit {
  floor: number;
  unit: string;
  size: number;
  price: string;
  status: "Available" | "Booked" | "Reserved";
  bedrooms: number;
}

const toBengaliNumber = (numStr: string | number): string => {
  const englishToBengaliMaps: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
  };
  return (numStr ?? "").toString().split("").map(char => englishToBengaliMaps[char] ?? char).join("");
};

export default function ProjectDetailModal({ project, language, onClose, onNewBookingSimulated }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "units" | "calculator" | "design" | "timeline">("specs");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showInlinePdf, setShowInlinePdf] = useState(false);
  
  // Construction Timeline milestones setup
  const isOngoing = project.status === "Ongoing" || project.statusBn === "চলমান প্রকল্প" || project.id === "mollik-serenade" || project.id === "mollik-heritage";
  const [completedMilestones, setCompletedMilestones] = useState<number[]>(
    isOngoing ? (project.id === "mollik-serenade" ? [0, 1, 2, 3, 4] : [0, 1, 2]) : [0, 1, 2, 3, 4, 5, 6, 7]
  );

  const milestones = [
    {
      id: 0,
      title: "Land Acquisition & Digital Survey",
      titleBn: "ভূমি অধিগ্রহণ ও ডিজিটাল জরিপ",
      desc: "Complete demographic profiling, digital topographic soil testing, and boundary high-wall reinforcement.",
      descBn: "উন্নত ডিজিটাল সয়েল টেস্টিং, সীমানা প্রাচীর সুদৃঢ়করণ এবং লেআউট সম্পন্ন।"
    },
    {
      id: 1,
      title: "RAJUK Building Clearance Approval",
      titleBn: "রাজুক নকশা অনুমোদন ও ছাড়পত্র",
      desc: "Architectural drawings alignment, BNBC structural safety certification, and RAJUK project registration clearance.",
      descBn: "নিরাপদ নকশার জন্য বিএনবিসি স্ট্যান্ডার্ড অনুযায়ী রাজুক থেকে নকশা অনুমোদন।"
    },
    {
      id: 2,
      title: "Deep Piling Work & Foundation Casting",
      titleBn: "ডিপ পাইলিং কাজ ও ফাউন্ডেশন ঢালাই",
      desc: "Excavation and heavy sub-base concrete piling arrays laid to resist grade 8+ Richter scale earthquakes.",
      descBn: "৮+ রিখটার স্কেল ভূমিকম্প সহনশীল প্রযুক্তিতে পাইলিং ও মাটির নিচের ফাউন্ডেশন।"
    },
    {
      id: 3,
      title: "Basement & Ground RCC Base Frame",
      titleBn: "বেসমেন্ট ও নিচতলা কংক্রিট বেস ফ্রেম",
      desc: "Subterranean multi-car parking space fabrication and secure drainage system base structural casting.",
      descBn: "ভূগর্ভস্থ কার-পার্কিং বেসমেন্ট ঢালাই ও সুসজ্জিত রিইনфোর্সড ড্রেনেজ।"
    },
    {
      id: 4,
      title: "Superstructure Roof Castings (Slab Frame)",
      titleBn: "ছাদ ও থামের কংক্রিট সুনির্দিষ্ট কাঠামো",
      desc: "Laying vertical strength columns and framing premium grade concrete slabs up to the top floor.",
      descBn: "সবুজ ক্যানোপি ও ছাদ সহ ভবনের মূল স্ট্রাকচারাল রিইনফোর্সড কংক্রিট কলাম ফ্রেম।"
    },
    {
      id: 5,
      title: "Internal Masonry Brick Work & Plaster",
      titleBn: "ইটের গাঁথুনি ও অভ্যন্তরীণ প্লাস্টার",
      desc: "Erecting interior fireproof gas-autoclaved clay bricks and precise wall surface plaster treatment.",
      descBn: "ঘরগুলোর কক্ষ বিভাজক দেওয়ালের ইটের গাঁথুনি ও মসৃণ প্লাস্টার আর্দ্রতারোধী কোট।"
    },
    {
      id: 6,
      title: "Premium Plumbing, Gas & Electrical conduit",
      titleBn: "সেন্ট্রাল গ্যাস, প্লাম্বিং ও বৈদ্যুতিক লাইন্স",
      desc: "Central gas pipe distribution and laying high-grade thermal & acoustic-insulated cable arrays.",
      descBn: "সেন্ট্রাল ফায়ার ভালভ যুক্ত গ্যাস লাইন্স, হেভি ডিউটি তার এবং নিরাপদ প্লাম্বিং কনসিল।"
    },
    {
      id: 7,
      title: "Luxe Furnishings, Marbles & Keys Handover",
      titleBn: "টাইলস-মার্বেল ফিনিশিং ও চাবি হস্তান্তর",
      desc: "Imported Carrara marbles, acoustics-glazed windows, landscaping, and premium key transition to buyers.",
      descBn: "লাক্সারি কারারা মার্বেল ফিনিশিং, সাজসজ্জা এবং রাজকীয় চাবি ক্রেতাদের হাতে হস্তান্তর।"
    }
  ];
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  
  // Real-time interest tracking simulated toasts
  const [toasts, setToasts] = useState<{ id: number; message: string; submessage?: string }[]>([]);

  // Design state (Mood board selection)
  const [selectedDesignMood, setSelectedDesignMood] = useState<"Warm Sand" | "Arctic Slate" | "Emerald Brass">("Warm Sand");

  // Mortgage & Installments Calculator States
  const [useUnitVal, setUseUnitVal] = useState(false);
  const [customPrice, setCustomPrice] = useState(10000000); // Default BDT 1 Crore
  const [deposit, setDeposit] = useState(2000000); // Default BDT 20 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
  const [loanTerm, setLoanTerm] = useState(15); // Default 15 Years
  const [calcMode, setCalcMode] = useState<"mortgage" | "installment">("mortgage");
  const [installmentMonths, setInstallmentMonths] = useState(24); // Default 24 Months for interest-free

  // Helper to parse text prices like "৳85 Lac onwards" or "৳1.2 Crore onwards" into raw numbers
  const parsePriceToNumber = (priceStr: string): number => {
    let numeric = 10000000; // Default 1 Crore
    try {
      const cleaned = priceStr.replace(/৳/g, "").replace(/,/g, "").replace(/\+/g, "").trim();
      const match = cleaned.match(/([\d.]+)/);
      if (match) {
        const val = parseFloat(match[1]);
        if (cleaned.toLowerCase().includes("crore") || cleaned.toLowerCase().includes("কোটি") || cleaned.toLowerCase().includes("cr")) {
          numeric = val * 10000000;
        } else if (cleaned.toLowerCase().includes("lac") || cleaned.toLowerCase().includes("lakh") || cleaned.toLowerCase().includes("লক্ষ") || cleaned.toLowerCase().includes("লাখ")) {
          numeric = val * 100000;
        } else if (val < 1000) {
          // If it's something like "85" but lacks suffix, default to Lac
          numeric = val * 100000;
        } else {
          numeric = val;
        }
      }
    } catch (e) {
      console.error("Oops! Flipped value parse failed:", e);
    }
    return numeric;
  };

  const formatBDT = (val: number) => {
    return "৳ " + Math.round(val).toLocaleString("en-US");
  };

  // Sync calculator price with project on loading
  useEffect(() => {
    if (project) {
      const baseNum = parsePriceToNumber(project.price);
      setCustomPrice(baseNum);
      setDeposit(Math.round(baseNum * 0.20)); // Pre-fill 20% Downpayment
    }
  }, [project.id]);

  // Sync calculator price with selected unit if option matches
  useEffect(() => {
    if (useUnitVal && selectedUnit) {
      const unitNum = parsePriceToNumber(selectedUnit.price);
      setCustomPrice(unitNum);
      setDeposit(Math.round(unitNum * 0.20));
    }
  }, [useUnitVal, selectedUnit?.unit]);

  const handleEnquireUnit = (unit: Unit) => {
    // Generate organic sounding count of concurrent buyers and agencies for the matching unit
    const concurrentViewers = Math.floor(Math.random() * 3) + 2; 
    const randomMins = Math.floor(Math.random() * 12) + 4;
    
    const msgEn = `Real-Time Interest Sparked: Unit ${unit.unit}`;
    const subEn = `We tracked ${concurrentViewers} other potential clients reviewing this exact unit in the last ${randomMins} minutes. Our concierge will contact you immediately.`;
    
    const msgBn = `রিয়েল-টাইম আগ্রহ ট্র্যাকিং: ইউনিট ${unit.unit}`;
    const subBn = `গত ${randomMins} মিনিটে আরও ${concurrentViewers} জন আগ্রহী ক্রেতা এই প্রিমিয়াম ইউনিটটি নিয়ে অনুসন্ধান করেছেন। আপনার জন্য প্রতিনিধি দ্রুত যোগাযোগ করবেন।`;

    const newToast = {
      id: Date.now() + Math.random(),
      message: language === "en" ? msgEn : msgBn,
      submessage: language === "en" ? subEn : subBn,
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 6500);
  };

  const fetchUnitsList = async () => {
    setLoadingUnits(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/units`);
      const data = await res.json();
      if (data.success) {
        setUnits(data.units);
        // Automatically select first available unit
        const firstAvail = data.units.find((u: Unit) => u.status === "Available");
        if (firstAvail) {
          setSelectedUnit(firstAvail);
        } else {
          setSelectedUnit(data.units[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching units:", err);
    } finally {
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    fetchUnitsList();
  }, [project.id]);

  const handleSimulatedReserve = async () => {
    if (!selectedUnit) return;
    setBookingLoading(true);
    setBookingSuccess(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/book-unit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: selectedUnit.unit })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingSuccess(language === "en" ? `Reservation simulation recorded! Unit ${selectedUnit.unit} is now locked.` : `সংরক্ষণ সফল হয়েছে! ইউনিট ${selectedUnit.unit} এখন বুকড হয়েছে।`);
        // Refresh unit list
        fetchUnitsList();
        // Invoke parent lead update to instantly notify admin console!
        onNewBookingSimulated();
      } else {
        alert(data.error || "Reservation failed.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  const downloadPrintBrochure = () => {
    // Generate beautiful virtual luxury print brochure window
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Mollik Builders — Premium Specification Brochure</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Poppins', sans-serif; }
          </style>
        </head>
        <body class="bg-neutral-50 flex flex-col justify-between h-screen p-12">
          <!-- Page Border -->
          <div class="border-2 border-dashed border-[#C8A165] p-10 bg-white flex flex-col justify-between flex-1">
            <header class="flex justify-between items-start border-b border-neutral-200 pb-6">
              <div>
                <h1 class="text-3xl font-bold text-[#1B4D3E] tracking-tight">MOLLIK BUILDERS</h1>
                <p class="text-[#C8A165] text-xs uppercase tracking-widest font-medium mt-1">Premium Estates & High-Rise Artistry</p>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 bg-emerald-50 text-[#1B4D3E] border border-emerald-100 rounded text-[10px] font-bold uppercase">RAJUK Legal Verified</span>
                <p class="text-xs text-neutral-400 mt-2">Dossier: ${project.id.toUpperCase()}-2026</p>
              </div>
            </header>

            <main class="my-8 flex-1 grid grid-cols-2 gap-10 items-center">
              <div>
                <h2 class="text-2xl font-semibold text-neutral-800">${project.name}</h2>
                <p class="text-[#C8A165] font-semibold text-sm mt-1">${project.location}</p>
                <p class="text-neutral-600 text-xs mt-3 leading-relaxed">${project.description}</p>
                
                <div class="mt-6">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] mb-2">Technical Specifications</h3>
                  <ul class="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
                    <li>Bangladesh National Building Code (BNBC) compliant</li>
                    <li>Earthquake structural capacity up to 7.5 Richter magnitude</li>
                    <li>72.5 grade high-performance steel and premium stones</li>
                    <li>Smart fiber optic connections pre-installed</li>
                  </ul>
                </div>
              </div>
              <div class="space-y-6">
                <div class="aspect-video overflow-hidden rounded border border-neutral-250">
                  <img src="${project.image}" alt="Property Exterior" class="w-full h-full object-cover"/>
                </div>
                
                <div class="bg-neutral-50 p-4 border border-neutral-150 rounded">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Included Premium Amenities</h3>
                  <div class="grid grid-cols-2 gap-1 text-[10px] text-neutral-600 font-medium">
                    ${(project.amenities || []).map(a => `<div>• ${a}</div>`).join("")}
                  </div>
                </div>
              </div>
            </main>

            <footer class="border-t border-neutral-200 pt-6 flex justify-between items-center text-[10px] text-neutral-400">
              <span class="font-semibold text-neutral-500">Mollik Builders HQ • House #32, Road #11, Gulshan-2, Dhaka</span>
              <span>Spec Validation Stamp © 2026. All Handover Rights Guaranteed.</span>
            </footer>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0E100F] z-[100] flex flex-col cursor-default font-sans overflow-x-hidden overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen w-full flex flex-col md:flex-row relative bg-[#111312]"
      >
        {/* Elegant Floating Close/Back button */}
        <button 
          onClick={onClose}
          className="fixed top-4 right-4 z-[110] inline-flex items-center gap-1.5 p-3 sm:px-4.5 sm:py-3 rounded-full sm:rounded-xl bg-[#141615]/95 backdrop-blur-md text-white hover:text-neutral-950 hover:bg-[#C8A165] border border-[#C8A165]/35 hover:border-transparent shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
          title={language === "en" ? "Back to Projects Portal" : "প্রজেক্ট পোর্টালে ফিরে যান"}
        >
          <X className="w-4 h-4 text-[#C8A165] group-hover:rotate-90 group-hover:text-neutral-950 transition-all duration-300" />
          <span className="hidden sm:inline text-xs font-mono tracking-widest font-black uppercase">
            {language === "en" ? "Back to Portal" : "পোর্টালে ফিরে যান"}
          </span>
        </button>
        
        {/* Left Side: Images & Quick Detail */}
        <div className="w-full md:w-[42%] lg:w-[38%] h-[380px] md:h-screen shrink-0 relative bg-neutral-950 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C8A165]/15 md:sticky md:top-0">
          <div className="absolute inset-0 z-0">
            <img 
              src={project.image} 
              alt={project.name} 
              className="w-full h-full object-cover opacity-50 transition-transform duration-1000 hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111312] via-[#111312]/60 to-[#111312]/75" />
          </div>

          {/* Top header icons inside layout bubble */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <span className="bg-[#C8A165] text-neutral-900 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded shadow-lg">
              {language === "en" ? project.type : project.typeBn}
            </span>
            
            <div className="flex gap-1.5">
              {project.rajukApproved && (
                <span className="bg-[#1B4D3E]/90 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded border border-[#C8A165]/25 flex items-center gap-1 backdrop-blur-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A165]" />
                  RAJUK APPROVED
                </span>
              )}
            </div>
          </div>

          {/* Bottom overview text of design */}
          <div className="relative z-10 p-6 md:p-10 space-y-3.5 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#C8A165] font-extrabold tracking-wider">
              <MapPin className="w-4 h-4 shrink-0 text-[#C8A165]" />
              <span>{language === "en" ? project.location : project.locationBn}</span>
            </div>
            
            <h2 className="text-xl md:text-3.5xl font-serif font-black tracking-tight text-white leading-tight">
              {language === "en" ? project.name : project.nameBn}
            </h2>

            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              {language === "en" ? project.description : project.descriptionBn}
            </p>

            <div className="pt-4 flex flex-wrap gap-2 text-[10px] text-neutral-400 font-bold border-t border-white/[0.08]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#C8A165] rounded-full animate-pulse" />
                {language === "en" ? "BNBC Earthquake Compliant" : "বিএনবিসি অনুযায়ী ভূমিকম্প সহনশীল"}
              </span>
              <span className="text-neutral-700">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {language === "en" ? "Acoustic Insulation" : "শব্দ নিরোধক ব্যারিয়ার"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Specs & Simulated floorplan units */}
        <div className="w-full md:w-[58%] lg:w-[62%] flex flex-col min-h-0 flex-1 bg-[#141615] text-[#FAFAFA] relative">

          {/* Tab navigation with optional PHP dynamic server engine bridge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] bg-neutral-950/70 backdrop-blur-md px-6 pt-5 gap-3 pb-3 sm:pb-0 pr-24 md:pr-24 sticky top-0 z-30">
            <div className="flex overflow-x-auto space-x-1 scrollbar-none">
              {[
                { id: "specs", label: "Specifications", labelBn: "বৈশিষ্ট্যসমূহ" },
                { id: "units", label: "Interactive Units", labelBn: "ইউনিট ম্যাপ" },
                { id: "calculator", label: "Calculator", labelBn: "ক্যালকুলেটর" },
                { id: "design", label: "Interior Moods", labelBn: "রুম ইন্টেরিয়র" },
                { id: "timeline", label: "Timeline", labelBn: "অগ্রগতি" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#C8A165] text-[#C8A165] font-black scale-102"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  {language === "en" ? tab.label : tab.labelBn}
                </button>
              ))}
            </div>
            
            <a 
              href={`/project-details.php?id=${project.id}&lang=${language}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-start sm:self-center bg-neutral-900 hover:bg-[#C8A165] text-[#C8A165] hover:text-neutral-900 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-md border border-[#C8A165]/20 cursor-pointer"
              title="Explore the server-side fully evaluated PHP dynamic engine layout for this property."
            >
              <span>{language === "en" ? "PHP Portal 📄" : "পিএইচপি পোর্টাল 📄"}</span>
            </a>
          </div>

          {/* Tab content area container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {activeTab === "specs" && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A165]">
                  {language === "en" ? "Detailed Project Metrics" : "প্রজেক্টের বিস্তারিত তথ্য"}
                </h4>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {project.specs.map((s, i) => (
                    <div key={`spec-item-${i}`} className="bg-neutral-900/60 p-4 rounded-xl border border-white/[0.08] hover:border-[#C8A165]/30 hover:bg-neutral-900 transition-all">
                      <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        {language === "en" ? s.label : s.labelBn}
                      </span>
                      <span className="block text-sm font-extrabold text-white mt-1">
                        {language === "en" ? s.value : s.valueBn}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A165] mb-2">
                    {language === "en" ? "Curated Amenities Checklist" : "নির্বাচিত সুযোগ-সুবিধা সমূহ"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 text-sm text-neutral-200">
                    {((language === "en" ? project.amenities : project.amenitiesBn) || []).map((amenity, i) => (
                      <div key={`amenity-item-${i}`} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C8A165] shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architectural & Structural Assets */}
                {(project.dwgUrl || project.pdfUrl) && (
                  <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A165] mb-1">
                      {language === "en" ? "Technical Drawings & Floor Plans" : "কারিগরি নকশা ও ফ্লোর প্ল্যান"}
                    </h4>
                    
                    <div className="flex flex-col gap-3.5">
                      {project.pdfUrl && (
                        <div className="flex flex-col gap-3 p-4 bg-[#181A19] rounded-xl border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-rose-950/80 text-rose-400 flex items-center justify-center font-bold font-sans text-xs shrink-0 border border-rose-900/40">
                              PDF
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-extrabold text-[#FAFAFA] leading-tight text-xs sm:text-sm">
                                {language === "en" ? "Interactive Project Brochure" : "অনুমোদিত প্রজেক্ট ব্রোশিওর ও ফ্লোর প্ল্যান"}
                              </span>
                              <span className="block text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                                {project.pdfFilename || "BISMILLAH TOWER - 02.pdf"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 pt-1.5">
                            {/* Option 1: Direct Download */}
                            <a
                              href={project.pdfUrl}
                              download={project.pdfFilename || "brochure.pdf"}
                              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-white/[0.08] hover:border-[#C8A165]/50 transition-all text-neutral-200 text-[10px] font-bold text-center group cursor-pointer"
                            >
                              <Download className="w-4 h-4 text-[#C8A165] group-hover:scale-110 transition-transform duration-200" />
                              <span>{language === "en" ? "Download PDF" : "ডাউনলোড করুন"}</span>
                            </a>

                            {/* Option 2: Open in a New Tab */}
                            <a
                              href={project.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-white/[0.08] hover:border-[#C8A165]/50 transition-all text-neutral-200 text-[10px] font-bold text-center group cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform duration-200" />
                              <span>{language === "en" ? "Open Full Tab" : "নতুন ট্যাবে"}</span>
                            </a>

                            {/* Option 3: View Option Toggle */}
                            <button
                              type="button"
                              onClick={() => setShowInlinePdf(!showInlinePdf)}
                              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all text-[10px] font-bold text-center cursor-pointer group ${
                                showInlinePdf 
                                  ? "bg-amber-950/80 text-amber-300 border-[#C8A165]/60" 
                                  : "bg-neutral-900 hover:bg-neutral-850 border-white/[0.08] hover:border-[#C8A165]/50 text-neutral-200"
                              }`}
                            >
                              <Eye className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                              <span>{showInlinePdf ? (language === "en" ? "Hide Preview" : "হাইড প্রিভিউ") : (language === "en" ? "View Inline" : "ইনলাইন প্রিভিউ")}</span>
                            </button>
                          </div>

                          {showInlinePdf && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 440 }}
                              className="w-full mt-3 rounded-xl border border-white/[0.08] overflow-hidden bg-neutral-950 flex flex-col h-[400px]"
                            >
                              <iframe
                                src={`${project.pdfUrl}#toolbar=0`}
                                className="w-full h-full border-none"
                                title="Project Brochure"
                              />
                            </motion.div>
                          )}
                        </div>
                      )}

                      {project.dwgUrl && (
                        <a
                          href={project.dwgUrl}
                          download={project.dwgFilename || "structural.dwg"}
                          className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] hover:border-[#C8A165]/50 bg-neutral-900 hover:bg-neutral-850 transition-colors text-white text-xs font-semibold group cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded bg-[#1A333E] text-cyan-400 flex items-center justify-center font-bold font-sans text-xs shrink-0 border border-cyan-900/40 font-mono">
                            CAD
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-extrabold text-[#FAFAFA] leading-tight">
                              {language === "en" ? "Approved DWG Structural Blueprint" : "অনুমোদিত ক্যাড ড্রয়িং ব্লুপ্রিন্ট"}
                            </span>
                            <span className="block text-[9px] text-neutral-400 font-mono truncate leading-none mt-1">
                              {project.dwgFilename || "download.dwg"}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-[#C8A165] group-hover:translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={downloadPrintBrochure}
                  className="w-full mt-4 py-2.5 bg-neutral-900 border border-white/[0.08] hover:bg-[#C8A165] hover:text-neutral-900 hover:border-transparent text-[#C8A165] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 cursor-pointer" />
                  {language === "en" ? "Download Specifications Sheet" : "ডাউনলোড করুন স্পেসিফিকেশন শিট"}
                </button>
              </div>
            )}

            {activeTab === "units" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between font-serif">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A165]">
                    {language === "en" ? "Real-Time Unit Availability" : "রিয়েল-টাইম ফ্ল্যাট প্রাপ্যতা তালিকা"}
                  </h4>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A165]" />
                    {language === "en" ? "Click to inspect unit" : "ইউনিটে ক্লিক করুন"}
                  </span>
                </div>

                {loadingUnits ? (
                  <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                    {language === "en" ? "Loading unit availability stats..." : "ইউনিট প্রাপ্যতা লোড হচ্ছে..."}
                  </div>
                ) : (
                  <>
                    {/* Live Availability Status Indicators for each Unit Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#181A19] p-4 rounded-xl border border-white/[0.08]">
                      {Array.from(new Set(units.map(u => u.bedrooms))).sort().map(beds => {
                        const filtered = units.filter(u => u.bedrooms === beds);
                        const availableCount = filtered.filter(u => u.status === "Available").length;
                        const reservedCount = filtered.filter(u => u.status === "Reserved").length;
                        const soldCount = filtered.filter(u => u.status === "Booked").length;
                        
                        const typeTitleEn = beds === 4 ? "4 BHK Penthouse Suite" : `${beds} BHK Premium Residence`;
                        const typeTitleBn = beds === 4 ? "৪ বেডরুম পেন্টহাউস সুইট" : `${beds} বেডরুম প্রিমিয়াম অ্যাপার্টমেন্ট`;

                        return (
                          <div key={`beds-indicator-${beds}`} className="space-y-1.5" id={`beds-indicator-${beds}`}>
                            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-sans">
                              {language === "en" ? typeTitleEn : typeTitleBn}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-sans">
                              <span className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded border border-white/[0.08] shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span className="text-emerald-400 font-extrabold">{availableCount}</span>
                                <span className="text-neutral-400">{language === "en" ? "Available" : "খালি"}</span>
                              </span>
                              <span className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded border border-white/[0.08] shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="text-amber-400 font-extrabold">{reservedCount}</span>
                                <span className="text-neutral-400">{language === "en" ? "Reserved" : "সংরক্ষিত"}</span>
                              </span>
                              <span className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded border border-white/[0.08] shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />
                                <span className="text-neutral-300 font-extrabold">{soldCount}</span>
                                <span className="text-neutral-400">{language === "en" ? "Sold" : "বিক্রিত"}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SVG Interactive Floorplan Map */}
                    <div className="bg-neutral-900/45 p-4 rounded-xl border border-white/[0.08] space-y-4">
                      {/* Color-Coded Legend */}
                      <div className="flex flex-wrap justify-center items-center gap-5 pb-3 border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-neutral-400 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-950" />
                          <span>{language === "en" ? "Available (Green)" : "খালি আছে (সবুজ)"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span>{language === "en" ? "Reserved (Yellow)" : "সংরক্ষিত (হলুদ)"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>{language === "en" ? "Sold (Red)" : "বিক্রিত (লাল)"}</span>
                        </div>
                      </div>

                      <div className="text-center text-[10px] font-mono text-neutral-400 mb-1 tracking-widest uppercase">
                        {language === "en" ? "Live Unit Status Map (2D Floor Grid)" : "লাইভ ইউনিট স্ট্যাটাস ম্যাপ (২ডি ফ্লোর গ্রিড)"}
                      </div>
                      
                      {/* Flex render of Units */}
                      <div className="grid grid-cols-3 gap-2">
                        {units.map((u) => {
                          const isSel = selectedUnit?.unit === u.unit && selectedUnit?.floor === u.floor;
                          const showStatus = u.status === "Booked" ? "Sold" : u.status;
                          const showStatusBn = u.status === "Booked" ? "বিক্রিত" : u.status === "Reserved" ? "সংরক্ষিত" : "খালি";
                          return (
                            <button
                              key={`${u.floor}-${u.unit}`}
                              type="button"
                              onClick={() => {
                                setSelectedUnit(u); 
                                setBookingSuccess(null);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-20 cursor-pointer ${
                                isSel ? "bg-[#1B4D3E] text-white border-[#C8A165] ring-1 ring-[#C8A165]/35 shadow-lg" : 
                                u.status === "Booked" ? "bg-rose-950/20 text-rose-300 border-rose-900/30 hover:bg-rose-950/40" :
                                u.status === "Reserved" ? "bg-amber-950/20 text-amber-300 border-amber-900/30 hover:bg-amber-950/40" :
                                "bg-emerald-950/20 text-emerald-300 border-emerald-900/30 hover:bg-emerald-950/40"
                              }`}
                            >
                              <div className="flex justify-between items-start w-full font-sans">
                                <span className={`font-extrabold text-xs ${isSel ? "text-white" : u.status === "Booked" ? "text-rose-455" : u.status === "Reserved" ? "text-amber-455" : "text-emerald-455"}`}>{u.unit}</span>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase ${
                                  isSel ? "bg-[#C8A165] text-neutral-900 border border-[#C8A165]" :
                                  u.status === "Booked" ? "bg-rose-950 text-rose-300" :
                                  u.status === "Reserved" ? "bg-amber-950 text-amber-300 animate-pulse" :
                                  "bg-emerald-950 text-emerald-300 animate-pulse"
                                }`}>
                                  {isSel ? (language === "en" ? "Selected" : "নির্বাচিত") : (language === "en" ? showStatus : showStatusBn)}
                                </span>
                              </div>
                              <div className={`text-[10px] font-mono leading-none ${isSel ? "text-[#C8A165]" : "text-neutral-400"}`}>
                                {u.size} sqft
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed info card of selected Unit */}
                    {selectedUnit && (
                      <div className="bg-[#181A19] text-white rounded-xl p-5 space-y-3.5 border border-[#C8A165]/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#C8A165] block tracking-wider">
                              {language === "en" ? `Floor ${selectedUnit.floor} Detail` : `ফ্লোর ${selectedUnit.floor} এর বিবরণ`}
                            </span>
                            <span className="text-lg font-serif font-bold">
                              {language === "en" ? `Unit ${selectedUnit.unit}` : `ইউনিট ${selectedUnit.unit}`}
                            </span>
                          </div>
                          <div className="text-right font-sans">
                            <span className="text-[10px] text-neutral-400 block uppercase tracking-widest font-black">{language === "en" ? "Value Estimate" : "মূল্য হিসাব"}</span>
                            <span className="font-mono font-bold text-[#C8A165] text-base">{selectedUnit.price}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300 border-t border-b border-white/[0.08] py-3 font-sans">
                          <div>
                            <span className="text-neutral-500 block uppercase text-[9px] font-bold tracking-wider">{language === "en" ? "Area Size" : "আয়তন"}:</span>
                            <span className="font-black text-sm text-white">{selectedUnit.size} sqft</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 block uppercase text-[9px] font-bold tracking-wider">{language === "en" ? "Bedrooms" : "বেডরুম"}:</span>
                            <span className="font-black text-sm text-white">{selectedUnit.bedrooms} {language === "en" ? "Beds (En-suite)" : "বেড (সংযুক্ত বাথরুম)"}</span>
                          </div>
                        </div>

                        {bookingSuccess ? (
                          <div className="p-3 bg-emerald-950/80 border border-emerald-900 text-emerald-300 rounded-lg text-center text-xs flex items-center justify-center gap-1.5 flex-row">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{bookingSuccess}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedUnit.status === "Available" ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={handleSimulatedReserve}
                                  disabled={bookingLoading}
                                  className="py-2.5 bg-[#C8A165] hover:bg-[#b5915a] text-neutral-900 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  {bookingLoading ? (
                                    <span>{language === "en" ? "Booking..." : "বুকিং হচ্ছে..."}</span>
                                  ) : (
                                    <span>{language === "en" ? "Simulate Booking" : "বুকিং টেস্ট করুন"}</span>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEnquireUnit(selectedUnit)}
                                  className="py-2.5 bg-neutral-800 hover:bg-neutral-750 text-[#C8A165] border border-[#C8A165]/35 rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center"
                                >
                                  {language === "en" ? "Enquire Now" : "অনুসন্ধান পাঠান"}
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 bg-neutral-950 text-neutral-400 text-xs text-center border border-white/[0.05] rounded-lg flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{language === "en" ? "This unit is already booked or reserved by another client." : "এই ইউনিটটি অন্য ক্লায়েন্ট দ্বারা রিজার্ভড করা আছে।"}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-[10px] text-neutral-500 text-center uppercase tracking-wide">
                          {language === "en" ? "Reservations are held for 72 hours under premium review." : "রিজার্ভেশনটি পরবর্তী ৭২ ঘণ্টা সুরক্ষিত রাখবে অ্যাডমিন।" }
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "calculator" && (() => {
              const isLandShare = !!project.isLandShare;
              const isReadyPlot = !!project.isReadyPlot;
              const isReadyFlat = !!project.isReadyFlat;

              const sharePrice = project.sharePrice || 0;
              const installmentDue = project.installmentDue || 0;
              const constructionCost = project.constructionCost || 0;

              // Override calculator parameters for Land Share
              const finalPrice = isLandShare ? (sharePrice + installmentDue) : customPrice;
              const finalDeposit = isLandShare ? (sharePrice + installmentDue) : deposit;
              const finalPrincipal = isLandShare ? constructionCost : Math.max(0, finalPrice - finalDeposit);
              
              const totalMonths = calcMode === "mortgage" && !isLandShare ? loanTerm * 12 : installmentMonths;
              
              let computedMonthly = 0;
              let computedTotalPayback = 0;
              let computedInterest = 0;

              if (calcMode === "mortgage" && !isLandShare) {
                const r = interestRate / 12 / 100;
                if (r === 0) {
                  computedMonthly = finalPrincipal / totalMonths;
                } else {
                  computedMonthly = (finalPrincipal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
                }
                computedTotalPayback = computedMonthly * totalMonths;
                computedInterest = Math.max(0, computedTotalPayback - finalPrincipal);
              } else {
                // 0%-interest direct developer installments plan
                computedMonthly = finalPrincipal / installmentMonths;
                computedTotalPayback = finalPrincipal;
                computedInterest = 0;
              }

              // Visual proportions for the breakdown bar
              const totalSum = finalPrice + computedInterest + (isLandShare ? constructionCost : 0);
              const depPct = (finalDeposit / totalSum) * 100;
              const loanPct = (finalPrincipal / totalSum) * 100;
              const intPct = (computedInterest / totalSum) * 100;

              return (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-3 gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]">
                        {language === "en" ? "Interactive Installment & Mortgage Calculator" : "ইন্টারেক্টিভ কিস্তি ও ব্যাংক লোন হিসাবকারী"}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {language === "en"
                          ? "Estimate monthly repayments under premium developer direct installments or bank loans."
                          : "গ্র্যান্ড ওনারশিপের সুবিধার্থে সরাসরি মল্লিক কিস্তি প্ল্যান অথবা ব্যাংক লোনের হিসাব মিলিয়ে নিন।"}
                      </p>
                    </div>

                    {/* Mode Selector Pill */}
                    <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                      <button
                        onClick={() => setCalcMode("mortgage")}
                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded transition-colors ${
                          calcMode === "mortgage"
                            ? "bg-[#1B4D3E] text-[#C8A165] shadow-xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        {language === "en" ? "Bank Loan" : "ব্যাংক লোন"}
                      </button>
                      <button
                        onClick={() => setCalcMode("installment")}
                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded transition-colors ${
                          calcMode === "installment"
                            ? "bg-[#1B4D3E] text-[#C8A165] shadow-xs"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        {language === "en" ? "Mollik 0% Installment" : "০% ইন্টারেস্টে কিস্তি"}
                      </button>
                    </div>
                  </div>

                  {/* Calculator Split View Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Controls Column */}
                    <div className="md:col-span-7 space-y-4 font-sans text-xs">
                      
                      {/* Active Project/Unit sync header */}
                      {selectedUnit && !isLandShare && (
                        <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/60 mb-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={useUnitVal}
                              onChange={(e) => setUseUnitVal(e.target.checked)}
                              className="accent-[#1B4D3E] h-4 w-4 rounded"
                            />
                            <span className="font-bold text-neutral-700">
                              {language === "en"
                                ? `Sync Price with Unit ${selectedUnit.unit} (${selectedUnit.price})`
                                : `ইউনিট ${selectedUnit.unit} মূল্যের সাথে সিঙ্ক করুন (${selectedUnit.price})`}
                            </span>
                          </label>
                        </div>
                      )}

                      {/* Property Value control */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#1B4D3E] uppercase text-[10px] tracking-wider font-sans">
                            {isLandShare
                              ? (language === "en" ? "Land Share & Upfront Cost" : "ভূমির শেয়ার ও প্রারম্ভিক কিস্তি")
                              : (language === "en" ? "Property Value (BDT)" : "প্রপার্টির মোট মূল্য (টাকা)")
                            }
                          </span>
                          <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-xs">
                            {formatBDT(finalPrice)}
                          </span>
                        </div>
                        <input
                          type="range"
                          disabled={useUnitVal || isLandShare}
                          min={parsePriceToNumber(project.price) * 0.6 || 3000000}
                          max={parsePriceToNumber(project.price) * 2.5 || 50000000}
                          step={250000}
                          value={isLandShare ? finalPrice : customPrice}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCustomPrice(val);
                            // Keep down payment proportional
                            setDeposit(Math.round(val * 0.20));
                          }}
                          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#1B4D3E] disabled:opacity-50"
                        />
                      </div>

                      {/* Down Payment control */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#1B4D3E] uppercase text-[10px] tracking-wider font-sans">
                            {isLandShare
                              ? (language === "en" ? "Upfront Booking & Share Due (Fixed)" : "১০০% নির্ধারিত শেয়ার ও বুকিং মূল্য")
                              : (language === "en"
                                ? `Down Payment / Deposit (${Math.round((deposit / customPrice) * 100)}%)`
                                : `এককালীন জমা / বুকিং ডিপোজিট (${Math.round((deposit / customPrice) * 100)}%)`)
                            }
                          </span>
                          <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-xs">
                            {formatBDT(finalDeposit)}
                          </span>
                        </div>
                        <input
                          type="range"
                          disabled={isLandShare}
                          min={Math.round(customPrice * 0.10)}
                          max={Math.round(customPrice * 0.75)}
                          step={100000}
                          value={isLandShare ? finalDeposit : deposit}
                          onChange={(e) => setDeposit(parseInt(e.target.value))}
                          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#C8A165] disabled:opacity-50"
                        />
                        {!isLandShare && (
                          <div className="flex gap-2">
                            {[0.10, 0.20, 0.30, 0.40].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setDeposit(Math.round(customPrice * p))}
                                className="text-[9px] font-bold px-2 py-0.5 bg-neutral-50 hover:bg-neutral-150 border border-neutral-200 hover:border-neutral-350 rounded text-neutral-600 transition-colors"
                              >
                                {p * 100}%
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Mode specific parameters */}
                      {calcMode === "mortgage" ? (
                        <>
                          {/* Interest Rate Controls */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-[#1B4D3E] uppercase text-[10px] tracking-wider">
                                {language === "en" ? "Annual Bank Interest Rate (%)" : "বার্ষিক ব্যাংক সুদের হার (%)"}
                              </span>
                              <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-xs">
                                {interestRate.toFixed(1)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="14"
                              step="0.1"
                              value={interestRate}
                              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                              className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
                            />
                            <div className="flex gap-2">
                              {[7.5, 8.0, 8.5, 9.0].map((rate) => (
                                <button
                                  key={rate}
                                  type="button"
                                  onClick={() => setInterestRate(rate)}
                                  className="text-[9px] font-bold px-2 py-0.5 bg-neutral-50 hover:bg-neutral-150 border border-neutral-200 hover:border-neutral-350 rounded text-neutral-600 transition-colors"
                                >
                                  {rate}%
                                </button>
                              ))}
                            </div>
                          </div>

                           {/* Loan Duration Slider */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-extrabold text-[#1B4D3E] uppercase tracking-wider block">
                                {language === "en" ? "Loan Duration" : "লোন পরিশোধের মেয়াদকাল"}
                              </span>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#1B4D3E]/10 text-[#1B4D3E] border border-[#1B4D3E]/20">
                                <span>{loanTerm} {language === "en" ? "Years" : "বছর"}</span>
                                <span className="text-neutral-350">|</span>
                                <span className="text-neutral-600 font-sans font-extrabold">{toBengaliNumber(loanTerm)} বছর</span>
                              </div>
                            </div>
                            
                            <input
                              type="range"
                              min="5"
                              max="25"
                              step="1"
                              value={loanTerm}
                              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                              className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
                            />
                            
                            <div className="flex justify-between text-[9px] font-bold text-neutral-400 font-mono">
                              <span>5 Yrs (৫ বছর)</span>
                              <span>15 Yrs (১৫ বছর)</span>
                              <span>25 Yrs (২৫ বছর)</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Direct Installments mode */
                        <div className="space-y-1.5">
                          <span className="font-extrabold text-[#1B4D3E] uppercase text-[10px] tracking-wider block">
                            {language === "en" ? "Installment Duration (0% Interest)" : "কিস্তি পরিশোধের সময়কাল (০% সুদ)"}
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {[12, 24, 36, 48].map((months) => (
                              <button
                                key={months}
                                type="button"
                                onClick={() => setInstallmentMonths(months)}
                                className={`py-2 border text-center rounded font-bold text-xs transition-all cursor-pointer ${
                                  installmentMonths === months
                                    ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm font-extrabold"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                  }`}
                              >
                                {months} {language === "en" ? "Mos" : "মাস"}
                              </button>
                            ))}
                          </div>
                          <span className="block text-[10px] text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded border border-emerald-150 font-sans mt-2">
                            ✨ {language === "en"
                              ? "No banking files required. This interest-free installment timeline is supported directly by Mollik Builders Treasury."
                              : "কোনো ব্যাংক ফাইলিং বা কাগজপত্র ছাড়াই সরাসরি মল্লিক বিল্ডার্স ট্রেজারি দ্বারা সুদমুক্ত সহজ কিস্তি লাভ করুন।"}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Results Box Column */}
                    <div className="md:col-span-5 bg-neutral-900 text-white rounded-xl p-5 border border-neutral-850 space-y-4 self-stretch flex flex-col justify-between">
                      <div className="space-y-4.5">
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-bold text-[#C8A165] font-mono tracking-widest block mb-1">
                            {language === "en" ? "ESTIMATED MONTHLY SERVICE" : "আনুমানিক মাসিক কিস্তি বিবরণ"}
                          </span>
                          
                          {/* English repayment estimate */}
                          <div className="bg-neutral-950/60 p-2.5 rounded border border-neutral-800 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-450 tracking-wider">ENGLISH</span>
                            <div className="text-right">
                              <span className="text-lg font-bold text-white font-serif">{formatBDT(computedMonthly)}</span>
                              <span className="text-neutral-500 font-mono text-[9px] uppercase ml-1">/ Mo</span>
                            </div>
                          </div>

                          {/* Bengali repayment estimate */}
                          <div className="bg-neutral-950/60 p-2.5 rounded border border-neutral-800 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-[#C8A165]/80 tracking-wider">বাংলা হিসাব</span>
                            <div className="text-right">
                              <span className="text-lg font-bold text-[#C8A165] font-serif">{toBengaliNumber(formatBDT(computedMonthly))}</span>
                              <span className="text-[#C8A165]/60 text-[9px] ml-1">/ প্রতি মাস</span>
                            </div>
                          </div>
                        </div>

                        {/* Cost breakdown summary lines */}
                        <div className="space-y-2 border-t border-b border-neutral-800 py-3 font-mono text-[11px] text-neutral-300">
                          <div className="flex justify-between">
                            <span className="text-neutral-500 font-sans">
                              {isLandShare 
                                ? (language === "en" ? "Estimated Construction Cost" : "সম্ভাব্য নির্মাণ খরচ")
                                : (language === "en" ? "Principal Loan Amount" : "মূল ঋণ / বকেয়া")
                              }:
                            </span>
                            <span className="font-bold">{formatBDT(finalPrincipal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500 font-sans">{language === "en" ? "Estimated Interest" : "মোট সম্ভাব্য সুদ"}:</span>
                            <span className="font-bold text-amber-400">
                              {calcMode === "mortgage" && !isLandShare ? formatBDT(computedInterest) : (language === "en" ? "0% (Interest-Free)" : "০% (সুদমুক্ত)")}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-neutral-800/60 pt-2 font-sans font-bold text-white text-xs">
                            <span className="text-neutral-400">
                              {isLandShare 
                                ? (language === "en" ? "Total Property Estimate" : "Total Term Repayment")
                                : (language === "en" ? "Total Term Repayment" : "মোট পরিশোধযোগ্য পরিমাণ")
                              }:
                            </span>
                            <span>{formatBDT(computedTotalPayback + finalDeposit)}</span>
                          </div>
                        </div>

                        {/* Amortization proportion bar metric */}
                        <div className="space-y-2 pt-1 font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                          <span className="block font-sans">{language === "en" ? "Capital structure breakdown" : "মূলধন কাঠামোর অনুপাত"}</span>
                          <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden flex">
                            <div style={{ width: `${depPct}%` }} className="h-full bg-[#C8A165]" title="Deposit" />
                            <div style={{ width: `${loanPct}%` }} className="h-full bg-neutral-400" title="Principal Loan" />
                            {calcMode === "mortgage" && !isLandShare && (
                              <div style={{ width: `${intPct}%` }} className="h-full bg-rose-600" title="Interest" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 invisible md:visible text-[8.5px] lowercase font-sans">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#C8A165]" /> {isLandShare ? (language === "en" ? "Upfront" : "প্রারম্ভিক") : (language === "en" ? "Deposit" : "বুকিং")} ({Math.round(depPct)}%)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-neutral-400" /> {isLandShare ? (language === "en" ? "Construction" : "লোন") : (language === "en" ? "Loan" : "লোন")} ({Math.round(loanPct)}%)</span>
                            {calcMode === "mortgage" && !isLandShare && (
                              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-600" /> {language === "en" ? "Interest" : "সুদ"} ({Math.round(intPct)}%)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lead triggers conversion block */}
                      <button
                        onClick={() => {
                          const queryText = calcMode === "mortgage"
                            ? `Hello! I would like to enquire about structural scheduling and bank loan approvals for ${project.name}. Value: ${formatBDT(customPrice)}, Down payment: ${formatBDT(deposit)}, tenure: ${loanTerm} years.`
                            : `Hello! I would like to schedule a direct consult on the interest-free ${installmentMonths}-month direct installment schedule for ${project.name}.`;
                          
                          // Triggers inquiry/message
                          window.open(`https://wa.me/8801715120802?text=${encodeURIComponent(queryText)}`, "_blank");
                        }}
                        className="py-2.5 bg-[#C8A165] hover:bg-[#b5915a] text-neutral-900 rounded text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 w-full text-center"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === "en" ? "Register & Request Allocation" : "অনুরোধ ও লোন বুকিং নিশ্চিত করুন"}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })()}

            {activeTab === "design" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]">
                  {language === "en" ? "Select Luxury Interior Customization Theme" : "লাক্সারি ইন্টেরিয়র কাস্টমাইজেশন থিম নির্বাচন"}
                </h4>
                
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {language === "en" 
                    ? "In collaboration with international designers, Mollik Builders provides pre-engineered interior style kits before handover. Toggle options below to view mood palettes." 
                    : "আন্তর্জাতিক স্থপতিদের সহযোগিতায়, মল্লিক বিল্ডার্স হ্যান্ডওভারের পূর্বেই প্রাক-পরিকল্পিত ইন্টেরিয়র কিট অফার করে। থিম বাছাই করুন:"}
                </p>

                <div className="flex gap-2">
                  {(["Warm Sand", "Arctic Slate", "Emerald Brass"] as const).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedDesignMood(mood)}
                      className={`flex-1 py-1.5 px-3 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                        selectedDesignMood === mood
                          ? "bg-[#1B4D3E] text-white border-[#1B4D3E]"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200/50 space-y-3">
                  <div className="aspect-video relative overflow-hidden rounded bg-neutral-200 border border-neutral-300">
                    {selectedDesignMood === "Warm Sand" && (
                      <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600" 
                        alt="Warm Sand Theme" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {selectedDesignMood === "Arctic Slate" && (
                      <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600" 
                        alt="Arctic Slate Theme" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {selectedDesignMood === "Emerald Brass" && (
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600" 
                        alt="Emerald Brass Theme" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
                      {selectedDesignMood} Theme Preview
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-neutral-700">
                    <div>
                      <span className="font-bold">{language === "en" ? "Cabinetry" : "ক্যাবিনেট সামগ্রী"}:</span>{" "}
                      {selectedDesignMood === "Warm Sand" ? "Handcrafted Oak wood veneers" : selectedDesignMood === "Arctic Slate" ? "Super-matte metallic grey panels" : "Vibrant emerald green lacquered doors with solid brass handle inserts"}
                    </div>
                    <div>
                      <span className="font-bold">{language === "en" ? "Flooring" : "ফ্লোরিং ডিজাইন"}:</span>{" "}
                      {selectedDesignMood === "Warm Sand" ? "Polished Italian white travertine" : selectedDesignMood === "Arctic Slate" ? "Belgian dark grey natural slate planks" : "Premium solid Burmese Teak herringbone pattern parquet"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1.5 font-serif">
                      <Layers className="w-4 h-4 text-[#C8A165]" />
                      {language === "en" ? "Construction Progress Timeline" : "নির্মাণ কাজের অগ্রগতি বা টাইমলাইন"}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">
                      {language === "en" ? "Official Technical Milestones Tracking" : "অফিসিয়াল টেকনিক্যাল কাজের সময়রেখা"}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isOngoing 
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}>
                    {isOngoing 
                      ? (language === "en" ? "Ongoing Structure" : "চলমান প্রকল্প") 
                      : (language === "en" ? "Structure Completed" : "সম্পূর্ণ প্রকল্প")}
                  </span>
                </div>

                {/* Overall completion banner */}
                <div className="bg-neutral-900 text-white rounded-xl p-4 border border-neutral-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A165] font-mono">
                      {language === "en" ? "ESTIMATED TOTAL COMPLETION" : "সর্বমোট কাজের সমাপ্তি অনুপাত"}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {Math.round((completedMilestones.length / milestones.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div 
                      className="bg-[#C8A165] h-full duration-500 ease-in-out transition-all"
                      style={{ width: `${(completedMilestones.length / milestones.length) * 100}%` }}
                    />
                  </div>
                  <span className="block text-[9px] text-neutral-400 font-medium leading-normal italic font-sans">
                    {isOngoing 
                      ? (language === "en" ? "💡 Interactive Client Console: Toggle checkboxes to simulate scheduled task sequencing or monitor critical dates." : "💡 ইন্টারেক্টিভ কনসোল: আপনি চলমান কাজের অগ্রগতির চেক বক্সটি টিক দিয়ে ট্র্যাকিং করতে পারেন।")
                      : (language === "en" ? "🏆 Handover Phase: All architectural milestones have been fully validated, approved, and handed over." : "🏆 হ্যান্ডওভার সম্পন্ন: এই প্রজেক্টের সকল নির্মাণ কাজ ও রাজুক ছাড়পত্র যথানিয়মে সম্পন্ন হয়েছে।")}
                  </span>
                </div>

                {/* Milestones Vertical List */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-neutral-200">
                  {milestones.map((milestone, idx) => {
                    const isCompleted = completedMilestones.includes(milestone.id);
                    return (
                      <div 
                        key={milestone.id} 
                        onClick={() => {
                          if (isOngoing) {
                            setCompletedMilestones(prev => 
                              prev.includes(milestone.id) 
                                ? prev.filter(mid => mid !== milestone.id) 
                                : [...prev, milestone.id]
                            );
                          }
                        }}
                        className={`relative group transition-all duration-300 ${isOngoing ? "cursor-pointer" : "select-none"}`}
                      >
                        {/* Timeline Bullet Node with integrated Checkbox */}
                        <div className="absolute -left-[24.5px] top-1.5 z-10 flex items-center justify-center">
                          <div 
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              isCompleted 
                                ? "bg-[#1B4D3E] border-[#1B4D3E] text-[#C8A165]" 
                                : "bg-white border-neutral-300 group-hover:border-neutral-450"
                            }`}
                          >
                            {isCompleted && (
                              <svg className="w-2.5 h-2.5 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Text and Description */}
                        <div className="space-y-1.5 p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 bg-white hover:bg-neutral-50/50 transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">
                              {language === "en" ? `Stage 0${idx + 1}` : `ধাপ ০${toBengaliNumber(idx + 1)}`}
                            </span>
                            <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            }`}>
                              {isCompleted 
                                ? (language === "en" ? "Done" : "সম্পন্ন")
                                : (language === "en" ? "In Progress" : "প্রক্রিয়াধীন")}
                            </span>
                          </div>
                          <h5 className="font-serif font-black text-xs text-neutral-850">
                            {language === "en" ? milestone.title : milestone.titleBn}
                          </h5>
                          <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
                            {language === "en" ? milestone.desc : milestone.descBn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Footer sticky info */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[10px] text-neutral-400 text-center">
            {language === "en" ? "Consult on these features with Mollik AI in the sidebar chat instantly." : "এই সকল বৈশিষ্ট্য নিয়ে সাইডবারে সরাসরি মল্লিক এআই উপদেষ্টার সাথে কথা বলুন।" }
          </div>

        </div>
      </motion.div>

      {/* Floating Real-Time Interest Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-neutral-900/95 text-white border border-[#C8A165]/50 rounded-lg p-4 shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 transform translate-x-0"
            style={{
              boxShadow: "0 10px 30px -10px rgba(200, 161, 101, 0.15), 0 1px 3px rgba(0,0,0,0.3)"
            }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mt-1.5 shrink-0" />
            <div className="space-y-1">
              <h5 className="font-serif font-black text-xs text-[#C8A165] tracking-wide uppercase">{toast.message}</h5>
              {toast.submessage && (
                <p className="text-[10px] text-neutral-300 font-sans font-light leading-relaxed">{toast.submessage}</p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
