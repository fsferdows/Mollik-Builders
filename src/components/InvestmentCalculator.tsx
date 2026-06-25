import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, Percent, Calendar, ShieldCheck, 
  Sparkles, ArrowRight, FileText, TrendingUp,
  DollarSign, Landmark, HelpCircle, CheckCircle2, Info
} from "lucide-react";
import { PROJECT_LIST } from "../data";
import { Project } from "../types";

interface InvestmentCalculatorProps {
  language: "en" | "bn";
  onOpenBooking: () => void;
}

export default function InvestmentCalculator({ language, onOpenBooking }: InvestmentCalculatorProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECT_LIST[0]?.id || "mollik-tower");
  const [customPrice, setCustomPrice] = useState<number>(5000000); // default 50 Lac BDT

  const selectedProject = useMemo(() => {
    if (selectedProjectId === "custom-property") {
      return {
        id: "custom-property",
        name: language === "en" ? "Custom Property" : "কাস্টম প্রপার্টি",
        nameBn: "কাস্টম প্রপার্টি",
        location: language === "en" ? "Custom Location" : "যেকোনো লোকেশন",
        locationBn: "যেকোনো লোকেশন",
        type: "Residential",
        typeBn: "আবাসিক",
        size: "1500 sqft",
        price: "Custom",
        status: "Available",
        statusBn: "উপলব্ধ",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
        description: "",
        descriptionBn: "",
      } as unknown as Project;
    }
    return PROJECT_LIST.find(p => p.id === selectedProjectId) || PROJECT_LIST[0];
  }, [selectedProjectId, language]);

  // Determine project classification
  const isLandShare = selectedProjectId !== "custom-property" && !!selectedProject.isLandShare;
  const isReadyPlot = selectedProjectId !== "custom-property" && !!selectedProject.isReadyPlot;
  const isReadyFlat = selectedProjectId !== "custom-property" && !!selectedProject.isReadyFlat;

  // Extract size boundaries
  const sizeRange = useMemo(() => {
    if (selectedProjectId === "custom-property") {
      return { min: 800, max: 5000, default: 1500 };
    }
    if (isReadyPlot) {
      return { min: 1, max: 9, default: 9 };
    }
    
    const numbers = selectedProject.size.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return {
        min: parseInt(numbers[0]),
        max: parseInt(numbers[1]),
        default: parseInt(numbers[0])
      };
    } else if (numbers && numbers.length === 1) {
      const val = parseInt(numbers[0]);
      return {
        min: Math.round(val * 0.8),
        max: Math.round(val * 1.5),
        default: val
      };
    }
    return { min: 1000, max: 4000, default: 1500 };
  }, [selectedProject, isReadyPlot, selectedProjectId]);

  const [apartmentSize, setApartmentSize] = useState<number>(sizeRange.default);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // %
  const [tenureYears, setTenureYears] = useState<number>(3); // 1 to 5 years
  const [pricingModel, setPricingModel] = useState<"conventional" | "shariah">("shariah");
  const [activeTab, setActiveTab] = useState<"installment" | "yield">("installment");

  // Reset size when project changes
  useEffect(() => {
    setApartmentSize(sizeRange.default);
  }, [selectedProjectId, sizeRange]);

  // Direct numeric pricing parameters
  const sharePrice = selectedProject.sharePrice || 0;
  const installmentDue = selectedProject.installmentDue || 0;
  const constructionCost = selectedProject.constructionCost || 0;
  const pricePerKatha = selectedProject.pricePerKatha || 0;
  const flatPriceReady = selectedProject.flatPriceReady || 0;

  // Parse raw price fallback
  const fallbackPriceVal = useMemo(() => {
    const priceStr = selectedProject.price;
    const match = priceStr.match(/(\d+(\.\d+)?)/);
    if (!match) return 5000000;
    const val = parseFloat(match[1]);
    if (priceStr.includes("Crore") || priceStr.includes("কোটি")) {
      return val * 10000000;
    }
    if (priceStr.includes("Lac") || priceStr.includes("লক্ষ")) {
      return val * 100000;
    }
    return val;
  }, [selectedProject.price]);

  // Core Property Value Computation
  const totalPropertyValue = useMemo(() => {
    if (selectedProjectId === "custom-property") {
      return customPrice * 1.10; // Apply 10% premium markup to custom given price
    }
    if (isLandShare) {
      // Land Share base cost is Share Price + Installment Due
      return sharePrice + installmentDue;
    }
    if (isReadyPlot) {
      return apartmentSize * pricePerKatha;
    }
    if (isReadyFlat) {
      return flatPriceReady;
    }
    // Standard flat
    const baseSize = sizeRange.default;
    const ratePerSft = fallbackPriceVal / baseSize;
    return apartmentSize * ratePerSft;
  }, [selectedProjectId, customPrice, isLandShare, isReadyPlot, isReadyFlat, sharePrice, installmentDue, apartmentSize, pricePerKatha, flatPriceReady, fallbackPriceVal, sizeRange.default]);

  // Adjust minimum down payment percentage based on project type
  // For land share, the down payment must cover the land share price + installment due (100% of upfront share cost)
  const minDownPaymentPct = isLandShare ? 100 : 20;

  useEffect(() => {
    if (isLandShare) {
      setDownPaymentPercent(100);
    } else {
      setDownPaymentPercent(prev => prev < 20 ? 30 : prev);
    }
  }, [isLandShare]);

  const downPaymentAmount = useMemo(() => {
    if (isLandShare) {
      return sharePrice + installmentDue;
    }
    return (totalPropertyValue * downPaymentPercent) / 100;
  }, [isLandShare, totalPropertyValue, downPaymentPercent, sharePrice, installmentDue]);

  // The remaining financed portion
  const principalToFinance = useMemo(() => {
    if (isLandShare) {
      // For land share, the remaining cost is the construction cost, paid in construction milestones
      return constructionCost;
    }
    return totalPropertyValue - downPaymentAmount;
  }, [isLandShare, totalPropertyValue, downPaymentAmount, constructionCost]);

  // Markup & Installment math
  const annualMarkupRate = useMemo(() => {
    if (isLandShare) {
      // Land share construction costs are paid as construction progresses with 0% interest markup
      return 0.0;
    }
    return pricingModel === "shariah" ? 0.065 : 0.082; // 6.5% vs 8.2%
  }, [isLandShare, pricingModel]);

  const totalFinanceMarkup = useMemo(() => {
    return principalToFinance * annualMarkupRate * tenureYears;
  }, [principalToFinance, annualMarkupRate, tenureYears]);

  const grossPayable = useMemo(() => {
    return principalToFinance + totalFinanceMarkup;
  }, [principalToFinance, totalFinanceMarkup]);

  const monthlyInstallment = useMemo(() => {
    return grossPayable / (tenureYears * 12);
  }, [grossPayable, tenureYears]);

  // Yield & ROI calculations
  const yieldMetrics = useMemo(() => {
    let estimatedMonthlyRent = 0;
    let annualCapitalAppreciationRate = 0.10; // 10% standard
    let completionMarketValue = totalPropertyValue;
    let ROI = 0;
    let totalInvested = totalPropertyValue;

    if (isLandShare) {
      // Share Price + Installments + Construction Cost
      totalInvested = sharePrice + installmentDue + constructionCost;
      
      // Typical apartment size is ~1615 sqft or ~1350 sqft
      const sqft = selectedProject.id === "mollik-transmitter-a" ? 1615 : 1350;
      
      // Expected market rate on completion in prime location: ৳5,200/sqft
      completionMarketValue = sqft * 5200; 
      
      // Estimated rent for 3-bedroom premium flat in Faydabad: ৳20,000/month
      estimatedMonthlyRent = 20000;
      annualCapitalAppreciationRate = 0.14; // 14% high appreciation due to development
      
      const capitalGain = completionMarketValue - totalInvested;
      ROI = (capitalGain / totalInvested) * 100;
    } else if (isReadyPlot) {
      totalInvested = totalPropertyValue;
      estimatedMonthlyRent = 0; // Plots don't have direct rent unless leased
      annualCapitalAppreciationRate = 0.18; // 18% appreciation for land plots in Uttara/Uttarkhan
      
      // Plots appreciate rapidly
      completionMarketValue = totalPropertyValue * Math.pow(1 + annualCapitalAppreciationRate, 3); // 3-year value
      const capitalGain = completionMarketValue - totalPropertyValue;
      ROI = (capitalGain / totalPropertyValue) * 100;
    } else if (isReadyFlat) {
      totalInvested = totalPropertyValue;
      estimatedMonthlyRent = 18000; // Ready 1320 sft apartment rent
      annualCapitalAppreciationRate = 0.09; // 9% appreciation
      
      completionMarketValue = totalPropertyValue * Math.pow(1 + annualCapitalAppreciationRate, 3);
      const capitalGain = (completionMarketValue - totalPropertyValue) + (estimatedMonthlyRent * 12 * 3);
      ROI = (capitalGain / totalPropertyValue) * 100;
    } else {
      // Standard residential project
      totalInvested = totalPropertyValue;
      estimatedMonthlyRent = (apartmentSize * 15); // e.g. ৳15/sqft rent
      annualCapitalAppreciationRate = 0.10;
      
      completionMarketValue = totalPropertyValue * Math.pow(1 + annualCapitalAppreciationRate, 3);
      const capitalGain = (completionMarketValue - totalPropertyValue) + (estimatedMonthlyRent * 12 * 3);
      ROI = (capitalGain / totalPropertyValue) * 100;
    }

    const annualRentIncome = estimatedMonthlyRent * 12;
    const rentalYield = totalInvested > 0 ? (annualRentIncome / totalInvested) * 100 : 0;

    return {
      totalInvested,
      estimatedMonthlyRent,
      annualRentIncome,
      rentalYield,
      annualCapitalAppreciationRate,
      completionMarketValue,
      ROI
    };
  }, [isLandShare, isReadyPlot, isReadyFlat, totalPropertyValue, sharePrice, installmentDue, constructionCost, selectedProject, apartmentSize]);

  // Formatting utility (displays BDT in Lac/Crore)
  const formatCurrency = (val: number) => {
    if (language === "bn") {
      if (val >= 10000000) {
        return `৳ ${(val / 10000000).toFixed(2)} কোটি`;
      }
      return `৳ ${(val / 100000).toFixed(2)} লক্ষ`;
    } else {
      if (val >= 10000000) {
        return `BDT ${(val / 10000000).toFixed(2)} Crore`;
      }
      return `BDT ${(val / 100000).toFixed(2)} Lac`;
    }
  };

  return (
    <section id="calculator" className="py-24 bg-neutral-950 text-white relative overflow-hidden border-t border-neutral-900">
      {/* High-end decorative lights background */}
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#C8A165]/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute -top-12 right-0 w-[500px] h-[500px] bg-[#1B4D3E]/10 rounded-full blur-[140px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-8 bg-[#C8A165]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] text-[#C8A165] uppercase font-bold">
                {language === "en" ? "Interactive Financial Planner" : "ইন্টারেক্টিভ ফাইন্যান্সিয়াল প্ল্যানার"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              {language === "en" 
                ? "Premium Property Investment & Yield Calculator" 
                : "প্রিমিয়াম প্রপার্টি ইনভেস্টমেন্ট ও কিস্তি ক্যালকুলেটর"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed font-sans">
              {language === "en"
                ? "Design your optimal capitalization plan. Toggle premium properties, fine-tune space distributions, and choose modern Shariah-compliant pathways to secure your luxury estate."
                : "আপনার কাঙ্ক্ষিত বাসস্থানের কিস্তি পরিকল্পনা প্রস্তুত করুন। আধুনিক শরীয়াহ্-সম্মত মডেলে নিরাপদ হিসাব করুন এবং আপনার বিনিয়োগের রিটার্ন প্রজেকশন পর্যবেক্ষণ করুন।"}
            </p>
          </div>

          {/* Calculator tab switcher */}
          <div className="flex bg-neutral-905 p-1 rounded-xl border border-neutral-800 text-xs font-semibold self-start md:self-auto shadow-md">
            <button
              onClick={() => setActiveTab("installment")}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "installment"
                  ? "bg-[#C8A165] text-neutral-950 font-extrabold shadow-lg"
                  : "text-neutral-450 hover:text-white"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{language === "en" ? "Installment Planner" : "কিস্তি পরিকল্পনাকারী"}</span>
            </button>
            <button
              onClick={() => setActiveTab("yield")}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "yield"
                  ? "bg-[#C8A165] text-neutral-950 font-extrabold shadow-lg"
                  : "text-neutral-450 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === "en" ? "Yield & ROI Projections" : "রিটার্ন ও লাভ প্রজেকশন"}</span>
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Inputs Slider) - Spans 7 */}
          <div className="lg:col-span-7 bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-neutral-805 p-6 sm:p-8 space-y-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
              <span className="text-xs uppercase font-mono text-[#C8A165] tracking-widest font-black flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#C8A165]" />
                {language === "en" ? "PROJECT PARAMETER CONSOLE" : "প্রজেক্ট প্যারামিটার কনসোল"}
              </span>
              
              {/* Shariah Switcher - Hidden for land shares (as they are always 0% markup milestone-based) */}
              {!isLandShare && (
                <div className="flex bg-neutral-955 p-1 rounded-lg border border-neutral-800 text-[10px] font-bold tracking-wide self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPricingModel("shariah")}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      pricingModel === "shariah"
                        ? "bg-[#C8A165] text-neutral-950 font-black shadow-md"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {language === "en" ? "Shariah Murabaha" : "শরীয়াহ্ মুরাবাহা (হালাল)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel("conventional")}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      pricingModel === "conventional"
                        ? "bg-neutral-850 text-neutral-100 shadow-md"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {language === "en" ? "Conventional" : "কনভেনশনাল লোন"}
                  </button>
                </div>
              )}

              {isLandShare && (
                <div className="px-3 py-1.5 bg-[#1B4D3E]/30 text-emerald-450 border border-emerald-500/20 rounded-lg text-[10px] font-mono font-bold tracking-wider">
                  {language === "en" ? "0% INTEREST MILESTONE PLAN" : "০% সুদহীন নির্মাণ কিস্তি সুবিধা"}
                </div>
              )}
            </div>

            {/* Grid 2x2 params */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Select Project Select box */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-neutral-350 uppercase tracking-widest block">
                  {language === "en" ? "1. Select Property / Project" : "১. প্রজেক্ট বা প্রপার্টি নির্বাচন"}
                </label>
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#C8A165] focus:outline-none focus:ring-1 focus:ring-[#C8A165] appearance-none cursor-pointer transition-all hover:border-neutral-700"
                  >
                    {PROJECT_LIST.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {language === "en" ? proj.name : proj.nameBn} ({language === "en" ? proj.location : proj.locationBn})
                      </option>
                    ))}
                    <option value="custom-property">
                      {language === "en" ? "Custom Property Valuation (BDT)" : "কাস্টম প্রপার্টি প্রাক্কলন (টাকা)"}
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#C8A165] text-[10px]">▼</div>
                </div>

                {selectedProjectId === "custom-property" && (
                  <div className="mt-4 animate-in fade-in duration-300">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                      {language === "en" ? "Enter Base Property Price (BDT)" : "বেস প্রপার্টি মূল্য লিখুন (টাকা)"}
                    </label>
                    <div className="relative rounded-xl bg-neutral-950 border border-neutral-800 focus-within:border-[#C8A165]">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">৳</span>
                      <input
                        type="number"
                        min="500000"
                        max="100000000"
                        step="100000"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                        className="w-full bg-transparent border-none pl-8 pr-4 py-3.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-[#C8A165] font-mono mt-1 px-1">
                      <span>{language === "en" ? "Base Price:" : "মূল দাম:"} {formatCurrency(customPrice)}</span>
                      <span>+10% Markup: {formatCurrency(customPrice * 0.10)}</span>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-neutral-500 font-medium block leading-relaxed">
                  {isReadyPlot 
                    ? (language === "en" ? `Premium Base rate: ${formatCurrency(pricePerKatha)} per Katha` : `প্রিমিয়াম বেস রেট: প্রতি কাঠায় ${formatCurrency(pricePerKatha)}`)
                    : (isLandShare 
                      ? (language === "en" ? `Share Price: ${formatCurrency(sharePrice)} | Construction: ${formatCurrency(constructionCost)}` : `শেয়ার মূল্য: ${formatCurrency(sharePrice)} | নির্মাণ খরচ: ${formatCurrency(constructionCost)}`)
                      : (isReadyFlat
                        ? (language === "en" ? `Fully Ready Price: ${formatCurrency(flatPriceReady)}` : `সম্পূর্ণ প্রস্তুত ফ্ল্যাটের মূল্য: ${formatCurrency(flatPriceReady)}`)
                        : (language === "en" ? `Estimated Rate: ${formatCurrency(Math.round(fallbackPriceVal / sizeRange.default))} per Sft` : `আনুমানিক রেট: প্রতি স্কয়ারফিটে ${formatCurrency(Math.round(fallbackPriceVal / sizeRange.default))}`)))
                  }
                </span>
              </div>

              {/* Apartment / Plot Size Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-[11px] font-bold text-neutral-350 uppercase tracking-widest">
                    {isReadyPlot 
                      ? (language === "en" ? "2. Select Plot Size" : "২. প্লটের সাইজ")
                      : (language === "en" ? "2. Apartment Size" : "২. প্রপার্টি সাইজ (বর্গফুট)")
                    }
                  </label>
                  <span className="font-mono text-sm text-[#C8A165] font-black">
                    {apartmentSize} {isReadyPlot ? (language === "en" ? "Katha" : "কাঠা") : "Sft"}
                  </span>
                </div>
                <input
                  type="range"
                  min={sizeRange.min}
                  max={sizeRange.max}
                  step={isReadyPlot ? 1 : 50}
                  value={apartmentSize}
                  onChange={(e) => setApartmentSize(Number(e.target.value))}
                  disabled={isLandShare || isReadyFlat}
                  className="w-full accent-[#C8A165] cursor-pointer bg-neutral-950 h-1.5 rounded-lg appearance-none disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>{sizeRange.min.toLocaleString()} {isReadyPlot ? (language === "en" ? "Katha" : "কাঠা") : "Sft"}</span>
                  <span>{sizeRange.max.toLocaleString()} {isReadyPlot ? (language === "en" ? "Katha" : "কাঠা") : "Sft"}</span>
                </div>
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-[11px] font-bold text-neutral-350 uppercase tracking-widest">
                    {isLandShare
                      ? (language === "en" ? "3. Initial Share Cost (Fixed)" : "৩. প্রারম্ভিক শেয়ার ও কিস্তি (স্থির)")
                      : (language === "en" ? "3. Down Payment" : "৩. এককালীন ডাউন পেমেন্ট")
                    }
                  </label>
                  <span className="font-mono text-sm text-[#C8A165] font-black">{downPaymentPercent}%</span>
                </div>
                <input
                  type="range"
                  min={minDownPaymentPct}
                  max="100"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  disabled={isLandShare}
                  className="w-full accent-[#C8A165] cursor-pointer bg-neutral-950 h-1.5 rounded-lg appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>
                    {isLandShare 
                      ? (language === "en" ? "100% Upfront share" : "১০০% নির্ধারিত শেয়ার")
                      : `20% (${formatCurrency(totalPropertyValue * 0.2)})`
                    }
                  </span>
                  <span>100% ({formatCurrency(totalPropertyValue)})</span>
                </div>
              </div>

              {/* Tenure Years Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-[11px] font-bold text-neutral-350 uppercase tracking-widest">
                    {language === "en" ? "4. Installment Term" : "৪. কিস্তি পরিশোধের সময়সীমা"}
                  </label>
                  <span className="font-mono text-sm text-[#C8A165] font-black">
                    {tenureYears} {language === "en" ? `${tenureYears === 1 ? "Year" : "Years"} (${tenureYears * 12} Months)` : `বছর (${tenureYears * 12} মাস)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#C8A165] cursor-pointer bg-neutral-950 h-1.5 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>12 {language === "en" ? "Months" : "মাস"}</span>
                  <span>60 {language === "en" ? "Months" : "মাস"}</span>
                </div>
              </div>

            </div>

            {/* Premium Dynamic Information Box */}
            <div className="p-5 bg-neutral-950/80 rounded-2xl border border-neutral-805 flex items-start gap-4 shadow-md">
              <div className="p-3 bg-[#C8A165]/10 rounded-xl text-[#C8A165] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h6 className="text-xs font-serif font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#C8A165]" />
                  {isLandShare 
                    ? (language === "en" ? "Cooperative Construction Transparency" : "যৌথ নির্মাণ তহবিলের স্বচ্ছতা")
                    : (pricingModel === "shariah"
                      ? (language === "en" ? "Shariah Murabaha Financing" : "শরীয়াহ্ মুরাবাহা ফাইনান্সিং")
                      : (language === "en" ? "Secured Conventional Mortgage" : "সিকিউরড কনভেনশনাল মর্টগেজ"))
                  }
                </h6>
                <p className="text-[11px] leading-relaxed text-neutral-450 font-light font-sans">
                  {isLandShare
                    ? (language === "en"
                      ? `As a Land Share owner, your upfront share cost is fixed. Remaining construction costs are interest-free and called incrementally based on concrete slabs, masonry, and plastering milestones.`
                      : `জমির শেয়ার মালিক হিসেবে আপনার জমির ক্রয়মূল্য সুনির্দিষ্ট। বাকি নির্মাণ খরচ কোনো প্রকার সুদ ছাড়াই কন্সট্রাকশন কাজের ধাপের ওপর ভিত্তি করে কিস্তিতে প্রদেয়।`)
                    : (pricingModel === "shariah"
                      ? (language === "en"
                        ? `Our Shariah Murabaha provides a flat constant markup of 6.5% annually. Zero compound interest. Strict buy-and-sale asset exchange backed by legal contract.`
                        : `আমাদের শরীয়াহ্ চুক্তির আওতায় বার্ষিক লভ্যাংশ ৬.৫% হারে নির্ধারিত। কোনো কম্পোজিট চক্রবৃদ্ধি সুদের ঝামেলা নেই এবং শতভাগ শরীয়াহ্ নীতি সম্মত।`)
                      : (language === "en"
                        ? `Conventional luxury mortgage structured with regular bank guarantees and dynamic amortization schedules standard to top commercial financial corporations.`
                        : `শীর্ষস্থানীয় বাণিজ্যিক ব্যাংক পার্টনারদের মাধ্যমে সহজ ও নিয়মিত হাউজিং লোন সুবিধা।`))
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Dynamic Pricing Yield Output Card) - Spans 5 */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Main Visualizer Board */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-[#C8A165]/35 p-6 space-y-6 relative overflow-hidden shadow-2xl">
              {/* Ambient premium glowing accent light */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#C8A165]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-1.5 border-b border-neutral-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#C8A165] font-bold">
                    {language === "en" ? selectedProject.location : selectedProject.locationBn}
                  </span>
                  <span className="text-[8px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded font-semibold uppercase tracking-wider">
                    {language === "en" ? selectedProject.type : selectedProject.typeBn}
                  </span>
                </div>
                <h4 className="font-serif font-black text-xl text-white">
                  {language === "en" ? selectedProject.name : selectedProject.nameBn}
                </h4>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "installment" ? (
                  <motion.div
                    key="installment"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Cost Breakdown Table */}
                    <div className="space-y-3.5 text-xs text-neutral-350">
                      
                      {/* Property/Share Value */}
                      <div className="flex justify-between items-center py-1">
                        <span className="flex items-center gap-1.5 font-sans">
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          {isLandShare 
                            ? (language === "en" ? "Land Share Cost" : "জমির শেয়ার মূল্য")
                            : (language === "en" ? "Total Property Value" : "মোট প্রপার্টি মূল্য")
                          }
                        </span>
                        <span className="font-semibold text-white font-mono">
                          {formatCurrency(totalPropertyValue)}
                        </span>
                      </div>

                      {selectedProjectId === "custom-property" && (
                        <div className="flex justify-between items-center py-1 border-b border-neutral-900 pb-2">
                          <span className="flex items-center gap-1.5 font-sans text-neutral-455 italic text-[10px]">
                            <Percent className="w-3.5 h-3.5 text-neutral-500" />
                            {language === "en" ? "* Includes 10% Premium Markup" : "* ১০% প্রিমিয়াম মার্কেট মার্কআপ সহ"}
                          </span>
                          <span className="font-mono text-[10px] text-[#C8A165]">
                            +{formatCurrency(customPrice * 0.10)}
                          </span>
                        </div>
                      )}

                      {/* Upfront / Down Payment Amount */}
                      <div className="flex justify-between items-center py-1">
                        <span className="flex items-center gap-1.5 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                          {isLandShare
                            ? (language === "en" ? "Upfront Booking & Share Due" : "প্রারম্ভিক বুকিং ও শেয়ার মূল্য")
                            : (language === "en" ? "Down Payment Amount" : "এককালীন ডাউন পেমেন্ট")
                          }
                        </span>
                        <span className="font-semibold text-[#C8A165] font-mono">
                          {formatCurrency(downPaymentAmount)}
                        </span>
                      </div>

                      {/* Milestone Due / Installment due (specific to transmitter square share) */}
                      {isLandShare && installmentDue > 0 && (
                        <div className="flex justify-between items-center py-1 border-t border-neutral-850/60 font-sans">
                          <span className="pl-5 text-neutral-450 italic text-[10.5px]">
                            {language === "en" ? "* Incl. Installments up to Masonry" : "* ৩য় তলা ছাদ ও গাঁথুনি কিস্তিসহ"}
                          </span>
                          <span className="text-neutral-300 font-mono text-[11px]">
                            {formatCurrency(installmentDue)}
                          </span>
                        </div>
                      )}

                      {/* Financed Base Principal / Construction cost */}
                      <div className="flex justify-between items-center py-1 border-t border-neutral-850/60">
                        <span className="flex items-center gap-1.5 font-sans">
                          <Landmark className="w-3.5 h-3.5 text-neutral-500" />
                          {isLandShare 
                            ? (language === "en" ? "Estimated Construction Cost" : "Financed Core Amount")
                            : (language === "en" ? "Financed Core Amount" : "অর্থায়িত মূল উপাদান")
                          }
                        </span>
                        <span className="font-mono text-neutral-300 font-semibold">
                          {formatCurrency(principalToFinance)}
                        </span>
                      </div>

                      {/* Profit Markup rate / Shariah markup */}
                      {!isLandShare && (
                        <div className="flex justify-between items-center py-1">
                          <span className="flex items-center gap-1.5 font-sans">
                            <Percent className="w-3.5 h-3.5 text-neutral-500" />
                            {language === "en" ? "Total Finance Markup" : "মোট মুনাফা বা প্রিমিয়াম"}
                          </span>
                          <span className="font-mono text-neutral-400">
                            {formatCurrency(totalFinanceMarkup)} ({ (annualMarkupRate * 100).toFixed(1) }% p.a.)
                          </span>
                        </div>
                      )}

                      {/* Total Project Estimate */}
                      {isLandShare && (
                        <div className="flex justify-between items-center py-1 border-t border-neutral-800">
                          <span className="flex items-center gap-1.5 font-bold text-white font-sans">
                            <Sparkles className="w-3.5 h-3.5 text-[#C8A165]" />
                            {language === "en" ? "Total Estimated Cost" : "মোট সম্ভাব্য খরচ"}
                          </span>
                          <span className="font-bold text-[#C8A165] font-mono">
                            {selectedProject.minTotalInvestment && selectedProject.maxTotalInvestment
                              ? (language === "en" 
                                ? `${(selectedProject.minTotalInvestment / 100000).toFixed(1)} - ${(selectedProject.maxTotalInvestment / 100000).toFixed(1)} Lac BDT`
                                : `${(selectedProject.minTotalInvestment / 100000).toFixed(1)} - ${(selectedProject.maxTotalInvestment / 100000).toFixed(1)} লক্ষ টাকা`)
                              : formatCurrency(sharePrice + installmentDue + constructionCost)
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Calculated monthly installment large HUD */}
                    <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-850 text-center space-y-1 shadow-inner relative">
                      <span className="text-[9px] font-mono tracking-widest text-[#C8A165] uppercase font-black block">
                        {isLandShare 
                          ? (language === "en" ? "ESTIMATED MONTHLY CONSTRUCTION CALL" : "মাসিক সম্ভাব্য নির্মাণ কিস্তি")
                          : (language === "en" ? "ESTIMATED MONTHLY PREMIUM" : "মাসিক কিস্তির আনুমানিক পরিমাণ")
                        }
                      </span>
                      <h3 className="font-serif font-black text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E5C185] to-[#C8A165] tracking-tight">
                        {formatCurrency(monthlyInstallment)}
                      </h3>
                      <p className="text-[9.5px] text-neutral-500 font-mono">
                        {language === "en" 
                          ? `Amortized over ${tenureYears * 12} equal consecutive installments` 
                          : `টানা ${tenureYears * 12} মাসের সমান কিস্তিতে পরিশোধযোগ্য`}
                      </p>
                    </div>

                    {/* Visual Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                        <span>{language === "en" ? "Upfront Commitment" : "প্রারম্ভিক ডাউনপেমেন্ট"} ({isLandShare ? "Land" : `${downPaymentPercent}%`})</span>
                        <span>{language === "en" ? "Remaining Block" : "বাকি কিস্তি ব্লক"} ({isLandShare ? "Construction" : `${100 - downPaymentPercent}%`})</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-neutral-955 overflow-hidden flex border border-neutral-850">
                        <div 
                          style={{ width: `${isLandShare ? ( (sharePrice + installmentDue) / (sharePrice + installmentDue + constructionCost) ) * 100 : downPaymentPercent}%` }} 
                          className="bg-[#C8A165] h-full transition-all duration-500" 
                        />
                        <div 
                          style={{ width: `${isLandShare ? ( constructionCost / (sharePrice + installmentDue + constructionCost) ) * 100 : 100 - downPaymentPercent}%` }} 
                          className="bg-[#1B4D3E] h-full transition-all duration-500" 
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="yield"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* ROI & Yield Parameters */}
                    <div className="space-y-3.5 text-xs text-neutral-350">
                      
                      {/* Total Outflow */}
                      <div className="flex justify-between items-center py-1">
                        <span className="flex items-center gap-1.5 font-sans">
                          <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                          {language === "en" ? "Total Estimated Capital" : "মোট প্রয়োজনীয় পুজি"}
                        </span>
                        <span className="font-semibold text-white font-mono">
                          {formatCurrency(yieldMetrics.totalInvested)}
                        </span>
                      </div>

                      {/* Expected Rent (if applicable) */}
                      {!isReadyPlot && (
                        <div className="flex justify-between items-center py-1">
                          <span className="flex items-center gap-1.5 font-sans">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            {language === "en" ? "Projected Monthly Rent" : "প্রত্যাশিত মাসিক ভাড়া"}
                          </span>
                          <span className="font-semibold text-white font-mono">
                            {formatCurrency(yieldMetrics.estimatedMonthlyRent)}
                          </span>
                        </div>
                      )}

                      {/* Rental Yield Percentage */}
                      {!isReadyPlot && (
                        <div className="flex justify-between items-center py-1 border-t border-neutral-850/60">
                          <span className="flex items-center gap-1.5 font-sans">
                            <Percent className="w-3.5 h-3.5 text-neutral-500" />
                            {language === "en" ? "Net Annual Rental Yield" : "বাৎসরিক ভাড়া থেকে লাভ (Yield)"}
                          </span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {yieldMetrics.rentalYield.toFixed(2)}% {language === "en" ? "p.a." : "বাৎসরিক"}
                          </span>
                        </div>
                      )}

                      {/* Capital Appreciation Rate */}
                      <div className="flex justify-between items-center py-1">
                        <span className="flex items-center gap-1.5 font-sans">
                          <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
                          {language === "en" ? "Annual Capital Appreciation" : "বাৎসরিক মূল্যবৃদ্ধি হার"}
                        </span>
                        <span className="font-mono text-emerald-450 font-semibold">
                          +{ (yieldMetrics.annualCapitalAppreciationRate * 100).toFixed(0) }% {language === "en" ? "avg" : "গড়ে"}
                        </span>
                      </div>

                      {/* 3-Year Appreciation Market Value */}
                      <div className="flex justify-between items-center py-1 border-t border-neutral-850/60 font-sans">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                          {isLandShare 
                            ? (language === "en" ? "Ready Market Value (On Completion)" : "প্রস্তুত ফ্লাটের বাজার মূল্য")
                            : (language === "en" ? "Projected Value (3 Years)" : "৩ বছর পর প্রপার্টির মূল্য")
                          }
                        </span>
                        <span className="font-semibold text-white font-mono">
                          {formatCurrency(yieldMetrics.completionMarketValue)}
                        </span>
                      </div>
                    </div>

                    {/* Yield/ROI HUD */}
                    <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-850 text-center space-y-1 shadow-inner">
                      <span className="text-[9px] font-mono tracking-widest text-emerald-450 uppercase font-black block">
                        {isLandShare
                          ? (language === "en" ? "INSTANT COMPLETED EQUITY GAIN" : "সম্পূর্ণতায় আনুমানিক লাভ (Equity ROI)")
                          : (language === "en" ? "PROJECTED 3-YEAR TOTAL ROI" : "৩ বছরের আনুমানিক মোট রিটার্ন (ROI)")
                        }
                      </span>
                      <h3 className="font-serif font-black text-2xl lg:text-3xl text-emerald-450 tracking-tight">
                        +{yieldMetrics.ROI.toFixed(1)}%
                      </h3>
                      <p className="text-[9.5px] text-neutral-500 font-mono">
                        {isLandShare 
                          ? (language === "en" ? "Buying lands via cooperative saves 40%+ over ready prices" : "সমবায় জমি ক্রয়ে তৈরি ফ্লাটের চেয়ে ৪০% বেশি সাশ্রয়")
                          : (language === "en" ? "Includes compounded rental yields + capital gains" : "ভাড়া বাবদ আয় এবং প্রপার্টির দাম বৃদ্ধির সমন্বিত লাভ")}
                      </p>
                    </div>

                    {/* Educational note */}
                    <div className="text-[10px] text-neutral-500 leading-relaxed font-light flex gap-1.5 items-start font-sans">
                      <Info className="w-3 h-3 text-[#C8A165] shrink-0 mt-0.5" />
                      <span>
                        {language === "en"
                          ? "Note: Yield calculations are realistic projections based on current inflation trends and real estate benchmark values in Uttara."
                          : "দ্রষ্টব্য: প্রজেকশন হিসাবগুলো উত্তরার বর্তমান আবাসন বাজারের অর্থনৈতিক প্রবৃদ্ধি ও মুদ্রাস্ফীতির ট্রেন্ডের ওপর ভিত্তি করে তৈরিকৃত বাস্তবসম্মত হিসাব।"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Booking Linkage */}
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-4 bg-[#C8A165] hover:bg-[#E5C185] text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border-none mt-2"
              >
                {language === "en" ? "Reserve This Plan" : "এই পরিকল্পনাটি সংরক্ষণ করুন"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
