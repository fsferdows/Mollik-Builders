import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, FileBadge, Check, ArrowRight, Settings, Info, 
  ExternalLink, HardHat, FileSpreadsheet, ShieldCheck, Mail, Save, Clock,
  BookOpen, TrendingUp, Layers, Sparkles, DollarSign, ClipboardCheck, Eye
} from 'lucide-react';
import { Language, Project } from '../types';
import { PROJECT_LIST } from '../data';

interface BuilderConsoleProps {
  language: Language;
  selectedProject?: Project | null;
}

export default function BuilderConsole({ language, selectedProject }: BuilderConsoleProps) {
  const [activeTab, setActiveTab] = useState<'jv-calc' | 'specs' | 'cad-packages' | 'feasibility' | 'cost-estimate'>('jv-calc');

  // Cost Estimate and Feasibility configuration states
  const [contingencyRate, setContingencyRate] = useState<number>(20); // 15% to 25% contingency reserve
  const [finishingTier, setFinishingTier] = useState<'standard' | 'premium' | 'imperial'>('premium');
  const [interestRate, setInterestRate] = useState<number>(9.5); // Bank finance rate %
  const [salesAbsorptionRate, setSalesAbsorptionRate] = useState<number>(3); // Flats sold per quarter

  // FAR JV Joint Venture Estimator states
  const [kathaSize, setKathaSize] = useState<number>(10); // plot size in Katha
  const [roadWidth, setRoadWidth] = useState<number>(60); // road width in feet
  const [mgcRatio, setMgcRatio] = useState<number>(60); // Max Ground Coverage %
  const [jvRatioLandowner, setJvRatioLandowner] = useState<number>(40); // Landowner share %

  // Calculated vars
  const [farValue, setFarValue] = useState<number>(5.0);
  const [totalBuildArea, setTotalBuildArea] = useState<number>(0);
  const [ownerSqFt, setOwnerSqFt] = useState<number>(0);
  const [devSqFt, setDevSqFt] = useState<number>(0);
  const [ownerApartments, setOwnerApartments] = useState<number>(0);
  const [devApartments, setDevApartments] = useState<number>(0);
  const [allowableFloors, setAllowableFloors] = useState<number>(0);

  // CAD simulator states
  const [cadForm, setCadForm] = useState({ companyName: '', email: '', designation: '' });
  const [cadSubmitted, setCadSubmitted] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Dynamic RAJUK Building Construction FAR Table Rules Mapping (for Dhaka, Bangladesh)
  useEffect(() => {
    // Standard FAR mapping based on Road Width (ft) and Katha size under RAJUK 2008 Rules
    let calculatedFar = 3.5;
    
    if (kathaSize < 4) {
      if (roadWidth < 20) calculatedFar = 3.0;
      else if (roadWidth < 30) calculatedFar = 3.25;
      else calculatedFar = 3.5;
    } else if (kathaSize < 7) {
      if (roadWidth < 20) calculatedFar = 3.5;
      else if (roadWidth < 30) calculatedFar = 4.0;
      else if (roadWidth < 40) calculatedFar = 4.25;
      else calculatedFar = 4.5;
    } else if (kathaSize < 12) { // 7-12 Katha (Our property fits here: 10 Katha)
      if (roadWidth < 20) calculatedFar = 3.75;
      else if (roadWidth < 30) calculatedFar = 4.25;
      else if (roadWidth < 40) calculatedFar = 4.75;
      else if (roadWidth < 60) calculatedFar = 5.0;
      else calculatedFar = 5.25; // 60ft or wider
    } else { // > 12 Katha
      if (roadWidth < 30) calculatedFar = 4.5;
      else if (roadWidth < 40) calculatedFar = 5.0;
      else if (roadWidth < 60) calculatedFar = 5.25;
      else calculatedFar = 5.5;
    }

    setFarValue(calculatedFar);

    const kathaToSqFt = 720;
    const grossPlotArea = kathaSize * kathaToSqFt;
    // Total gross allowable floor space under FAR
    const grossFloorArea = grossPlotArea * calculatedFar;
    setTotalBuildArea(grossFloorArea);

    // Landowner vs Developer split
    const ownerShareSqFt = (grossFloorArea * jvRatioLandowner) / 100;
    const devShareSqFt = grossFloorArea - ownerShareSqFt;

    setOwnerSqFt(ownerShareSqFt);
    setDevSqFt(devShareSqFt);

    // Mean unit size modeled inside Mollik Tower is ~ 900 sq ft (average of front units A/B and rear units C/D)
    const avgUnitSize = 900;
    // Estimated apartments (accounting for ~12% common spaces of vertical core circulation)
    const effectiveUsableArea = 0.88; 
    setOwnerApartments(Math.floor((ownerShareSqFt * effectiveUsableArea) / avgUnitSize));
    setDevApartments(Math.floor((devShareSqFt * effectiveUsableArea) / avgUnitSize));

    // Allowable structural storeys = FAR / (MGC/100) + 1 (Base/Ground)
    const floorsVal = Math.min(10, Math.ceil(calculatedFar / (mgcRatio / 100)));
    setAllowableFloors(floorsVal);

  }, [kathaSize, roadWidth, mgcRatio, jvRatioLandowner]);

  const currentProj = selectedProject || PROJECT_LIST[0];
  const isBangla = language === 'bn';
  const projName = isBangla ? currentProj.nameBn : currentProj.name;

  // Extract specs
  const landAreaVal = currentProj.specs?.find(s => s.label === "Land Area")?.value || "10 Katha";
  const heightVal = currentProj.specs?.find(s => s.label === "Building Height")?.value || "G + 9 Floors";
  const apartmentsVal = currentProj.specs?.find(s => s.label === "Total Apartments")?.value || "36 family flats";

  // Sync Katha size when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      const landAreaVal = selectedProject.specs?.find(s => s.label === "Land Area")?.value || "";
      const parsedKatha = parseInt(landAreaVal.replace(/[^0-9]/g, '')) || 10;
      setKathaSize(parsedKatha);
    }
  }, [selectedProject]);

  const handleCadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadForm.email || !cadForm.companyName) return;

    setCadSubmitted(true);
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <section id="builder" className="py-24 md:py-32 bg-neutral-950 text-white relative">
      {/* Decorative Blueprint Line Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(212,175,55,0.01)_1.5px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute left-10 top-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs text-gold-400 tracking-[0.3em] uppercase block mb-3">
              {language === 'bn' ? 'বিটুবি ডেভেলপার হাব এবং যৌথ উদ্যোগ' : 'B2B Developer Hub & Joint Ventures'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-none">
              {language === 'bn' ? 'বিল্ডারের তথ্য ও যৌথ উদ্যোগ' : 'Builder Specs & Land JVs'}
            </h2>
            <div className="w-16 h-[1.5px] bg-gold-400 mt-5" />
          </div>
          <div className="md:text-right max-w-md">
            <p className="font-sans text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'bn'
                ? 'ল্যান্ড-ওনার, প্রকৌশলী এবং ডেভেলপারদের জন্য রাজউক ফার কোড মূল্যায়ন, কাঠামোগত প্রকৌশল এবং উপকরণ বিশ্লেষণ পোর্টাল।'
                : 'An engineering-first portal designed for institutional investors, land-owners, and structural engineering firms to evaluate development codes, calculate site allocation, and audit materials registers.'}
            </p>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-neutral-850 gap-1 mb-10 overflow-x-auto pb-px scrollbar-thin">
          <button
            onClick={() => setActiveTab('jv-calc')}
            className={`py-4 px-5 font-mono text-[10.5px] uppercase tracking-wider border-b flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              activeTab === 'jv-calc'
                ? 'border-gold-400 text-gold-300 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Calculator size={12} stopColor="#d4af37" />
            <span>{language === 'bn' ? 'ইউনিয়ন ক্যালকুলেটর' : 'FAR JV Calculator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('feasibility')}
            className={`py-4 px-5 font-mono text-[10.5px] uppercase tracking-wider border-b flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              activeTab === 'feasibility'
                ? 'border-gold-400 text-gold-300 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen size={12} stopColor="#d4af37" />
            <span>{language === 'bn' ? 'সম্ভাব্যতা সমীক্ষা' : 'Feasibility Study'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cost-estimate')}
            className={`py-4 px-5 font-mono text-[10.5px] uppercase tracking-wider border-b flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              activeTab === 'cost-estimate'
                ? 'border-gold-400 text-gold-300 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign size={12} stopColor="#d4af37" />
            <span>{language === 'bn' ? 'খরচ প্রাক্কলন' : 'Cost Budget (CBS)'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-5 font-mono text-[10.5px] uppercase tracking-wider border-b flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              activeTab === 'specs'
                ? 'border-gold-400 text-gold-300 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileBadge size={12} stopColor="#d4af37" />
            <span>{language === 'bn' ? 'বস্তুগত গুণমান' : 'Engineering Benchmarks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cad-packages')}
            className={`py-4 px-5 font-mono text-[10.5px] uppercase tracking-wider border-b flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              activeTab === 'cad-packages'
                ? 'border-gold-400 text-gold-300 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={12} stopColor="#d4af37" />
            <span>{language === 'bn' ? 'ক্যাড প্যাকেজ' : 'Developer CAD Logs'}</span>
          </button>
        </div>

        {/* Tab Contents Frame */}
        <div className="bg-neutral-900/40 rounded-xl border border-neutral-850 p-6 md:p-10 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'jv-calc' && (
              <motion.div
                key="jv-calc"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
              >
                {/* Left Parameter Panel */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6 pr-2">
                  <div>
                    <div className="flex items-center gap-2 text-gold-300 font-mono text-[10px] uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                      {language === 'bn' ? 'ঢাকা রাজউক বিধিমালা (২০০৮ কোড শিট)' : 'Dhaka RAJUK Rules (2008 Code Sheet)'}
                    </div>
                    <h3 className="font-serif text-xl font-normal text-white mb-2">
                      {language === 'bn' ? 'যৌথ ভ্যালু ও হিস্যা প্রাক্কলন' : 'Estimate Share Ratio'}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-6">
                      {language === 'bn' 
                        ? 'ফ্ল্যাট ও জমির হিস্যা প্রাক্কলন করার জন্য স্লাইডারগুলো পরিবর্তন করুন।'
                        : 'Drag variables below to model gross building layouts and landowner allocations depending on road widths.'}
                    </p>

                    {/* Param 1: Katha Size */}
                    <div className="mb-6">
                      <div className="flex justify-between font-mono text-xs mb-1.5">
                        <span className="text-neutral-400 uppercase">{language === 'bn' ? 'জমির আয়তন (কঠা)' : 'PLOT SIZE (Katha)'}</span>
                        <span className="text-gold-300 font-bold">
                          {language === 'bn' 
                            ? `${kathaSize} কাঠা (${kathaSize * 720} বর্গফুট)`
                            : `${kathaSize} Katha (${kathaSize * 720} sqft)`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="20"
                        step="0.5"
                        value={kathaSize}
                        onChange={(e) => setKathaSize(parseFloat(e.target.value))}
                        className="w-full accent-gold-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Param 2: Road Width */}
                    <div className="mb-6">
                      <div className="flex justify-between font-mono text-xs mb-1.5">
                        <span className="text-neutral-400 uppercase">{language === 'bn' ? 'রাস্তার প্রশস্ততা (ফুট)' : 'ACCESS ROAD WIDTH'}</span>
                        <span className="text-gold-300 font-bold">
                          {language === 'bn' ? `${roadWidth} ফুট` : `${roadWidth} feet`}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[20, 30, 40, 60, 80].map((width) => (
                          <button
                            key={width}
                            onClick={() => setRoadWidth(width)}
                            className={`p-1.5 font-mono text-[10px] rounded border transition-all cursor-pointer ${
                              roadWidth === width
                                ? 'bg-gold-400 text-neutral-950 font-semibold border-gold-400'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {width}' {language === 'bn' ? 'ফুট' : 'ft'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Param 3: Maximum Ground Coverage */}
                    <div className="mb-6">
                      <div className="flex justify-between font-mono text-xs mb-1.5">
                        <span className="text-neutral-400 uppercase">{language === 'bn' ? 'গ্রাউন্ড কাভারেজ (MGC)' : 'MAX GROUND COVERAGE (MGC)'}</span>
                        <span className="text-gold-300 font-bold">{mgcRatio}% Max</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="62"
                        step="1"
                        value={mgcRatio}
                        onChange={(e) => setMgcRatio(parseInt(e.target.value))}
                        className="w-full accent-gold-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Param 4: JV Share Ratio */}
                    <div className="mb-6">
                      <div className="flex justify-between font-mono text-xs mb-1.5">
                        <span className="text-neutral-400 uppercase">{language === 'bn' ? 'ভূমির মালিকের হিস্যা' : 'LAND OWNER SHARE'}</span>
                        <span className="text-gold-300 font-bold">
                          {jvRatioLandowner}% / {100 - jvRatioLandowner}% {language === 'bn' ? 'ডেভ' : 'Dev'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="50"
                        step="5"
                        value={jvRatioLandowner}
                        onChange={(e) => setJvRatioLandowner(parseInt(e.target.value))}
                        className="w-full accent-gold-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Warning Info */}
                  <div className="bg-neutral-950/60 p-4 rounded border border-neutral-850 flex gap-3 text-2xs text-neutral-400 leading-normal font-sans">
                    <Info size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {language === 'bn'
                        ? 'ফার (FAR) মানসমূহ রাজউকের ২০০৮ বিধিমালা (ধারা ১৮) অনুযায়ী প্রস্তুতকৃত। রাস্তার প্রশস্ততা অবশ্যই স্পষ্ট সংযোগকারী রাইট-অফ-ওয়ে হতে হবে যা কর্পোরেশন ম্যাপ দ্বারা যাচাইকৃত।'
                        : 'FAR values correspond directly to Section 18 of the RAJUK Dhaka Building Code 2008. Road width measurements represent clear right-of-ways verified under the current municipal map.'}
                    </span>
                  </div>
                </div>

                {/* Right Metrics Panel */}
                <div className="lg:col-span-7 bg-neutral-950/40 border border-neutral-850 rounded-lg p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-[#999] uppercase block mb-6">
                      {language === 'bn' ? 'রাজউক উন্নয়ন ও তদারকি পূর্বাভাস' : 'MUNICIPAL DEVELOPMENT FORECASTS'}
                    </span>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">{language === 'bn' ? 'রাজউক ফার রেশিও' : 'RAJUK FAR Ratio'}</span>
                        <span className="font-serif text-3xl font-normal text-gold-300 block">
                          {farValue.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">{language === 'bn' ? 'সর্বোচ্চ গুণনীয়ক পরিমাপ' : 'Allowable Multiplier'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">{language === 'bn' ? 'মোট নির্মাণ আয়তন' : 'Gross Build Area'}</span>
                        <span className="font-serif text-2xl font-normal text-white block">
                          {totalBuildArea.toLocaleString()} <span className="text-xs">{language === 'bn' ? 'বর্গফুট' : 'sq ft'}</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">{language === 'bn' ? 'যৌথ সিঁড়ি ও লিফট এলাকা সহ' : 'Including Circulation'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">{language === 'bn' ? 'তলার সংখ্যা (অনুমান)' : 'Estimated Storeys'}</span>
                        <span className="font-serif text-3xl font-normal text-white block">
                          G + {allowableFloors - 1} <span className="text-xs">{language === 'bn' ? 'তলা' : 'Floors'}</span>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-sans mt-0.5 block">{language === 'bn' ? 'এমজিসি অনুযায়ী উচ্চতা' : 'MGC compliant height'}</span>
                      </div>
                    </div>

                    {/* Bar chart representation of distribution */}
                    <span className="font-mono text-[9px] tracking-wider text-[#999] uppercase pr-2 block mb-3">
                      {language === 'bn' ? 'হিস্যা বন্টন সজ্জা (গড় ৯০০ বর্গফুট ফ্ল্যাট হিসেবে)' : 'Est. Share Distribution (Based on ~900 sqft average unit sizes)'}
                    </span>

                    <div className="flex gap-1.5 h-6 rounded bg-neutral-900 border border-neutral-800 p-0.5 mb-6 overflow-hidden">
                      <div 
                        className="bg-gold-400 h-full rounded-l transition-all duration-500 hover:opacity-90 flex items-center justify-center text-neutral-950 font-mono text-[9px] font-semibold"
                        style={{ width: `${jvRatioLandowner}%` }}
                      >
                        {jvRatioLandowner}% {language === 'bn' ? 'ভূমির মালিক' : 'Land Owner'}
                      </div>
                      <div 
                        className="bg-neutral-850 h-full rounded-r transition-all duration-500 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 font-mono text-[9px]"
                        style={{ width: `${100 - jvRatioLandowner}%` }}
                      >
                        {100 - jvRatioLandowner}% {language === 'bn' ? 'ডেভেলাপার কোম্পানির হিস্যা' : 'Developer Share'}
                      </div>
                    </div>

                    {/* Detailed Flat Allocation stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-850 pt-6">
                      <div className="bg-neutral-900/60 p-4 rounded border border-neutral-850 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider mb-2">{language === 'bn' ? 'ভূমির মালিকের ফ্ল্যাট বন্টন' : 'LAND OWNER APPORTIONMENT'}</span>
                          <span className="font-serif text-lg font-medium text-gold-200 block">
                            {ownerApartments} {language === 'bn' ? 'টি স্ট্যান্ডার্ড ফ্ল্যাট' : 'Standard Apartments'}
                          </span>
                        </div>
                        <div className="border-t border-neutral-850 mt-4 pt-2 flex justify-between font-mono text-[10px] text-neutral-500">
                          <span>{language === 'bn' ? 'মোট হিঃ আয়তন:' : 'SHARE AREA:'}</span>
                          <span className="text-white font-bold">{ownerSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})} {language === 'bn' ? 'বর্গফুট' : 'SQFT'}</span>
                        </div>
                      </div>

                      <div className="bg-neutral-900/60 p-4 rounded border border-neutral-850 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider mb-2">{language === 'bn' ? 'ডেভেলপার কোম্পানির ফ্ল্যাট বন্টন' : 'DEVELOPER COMPANY APPORTIONMENT'}</span>
                          <span className="font-serif text-lg font-medium text-white block">
                            {devApartments} {language === 'bn' ? 'টি কমার্শিয়াল ফ্ল্যাট' : 'Commercial Shares'}
                          </span>
                        </div>
                        <div className="border-t border-neutral-850 mt-4 pt-2 flex justify-between font-mono text-[10px] text-neutral-500">
                          <span>{language === 'bn' ? 'মোট হিঃ আয়তন:' : 'SHARE AREA:'}</span>
                          <span className="text-white font-bold">{devSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})} {language === 'bn' ? 'বর্গফুট' : 'SQFT'}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Call to action for Joint Ventures */}
                  <div className="mt-8 pt-6 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[10px] font-sans text-neutral-500 max-w-sm">
                      {language === 'bn'
                        ? '*এটি একটি খসড়া প্রাক্কলন মাত্র। চুক্তি স্বাক্ষরের সময় জমির অবস্থান ও অগ্রিম সাইনিং মানি সহ চূড়ান্ত হিস্যা নির্ধারিত হবে।'
                        : '*Calculating estimate only. Our board structures tailored joint venture alignments accommodating advance signature premiums.'}
                    </span>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-400 text-neutral-950 font-mono text-[10px] uppercase font-semibold tracking-wider rounded cursor-pointer hover:bg-gold-500 active:scale-95 transition-all"
                    >
                      <span>{language === 'bn' ? 'যৌথ উদ্যোগ প্রস্তাব পাঠান' : 'Propose Land JV'}</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feasibility' && (
              <motion.div
                key="feasibility"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Feasibility Study Left Index Column */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-850 pb-6 lg:pb-0 lg:pr-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gold-300 font-mono text-[9px] uppercase tracking-wider mb-2">
                      <Sparkles size={11} className="text-gold-400 animate-pulse" />
                      <span>{language === 'bn' ? `${projName} প্রাক-ডিজাইন বিশ্লেষণ` : `${projName.toUpperCase()} PRE-DESIGN SURVEY`}</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-white mb-2 leading-snug">
                      {language === 'bn' ? 'সম্ভাব্যতা যাচাই সমীক্ষা' : 'Capital Feasibility Study'}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-6 font-light">
                      {language === 'bn' 
                        ? `${currentProj.locationBn || currentProj.location}-এর প্লটের ওপর প্রস্তাবিত ${projName} প্রকল্পের জন্য প্রস্তুতকৃত একটি বিস্তারিত বিনিয়োগ সম্ভাব্যতা সমীক্ষা।`
                        : `A rigorous pre-construction feasibility dossier analyzing municipal codes, micro-economic valuations, and ROI schedules for ${projName} in ${currentProj.location}.`}
                    </p>

                    {/* Interactive Parameter Controls inside study */}
                    <div className="space-y-4 p-4 rounded-lg bg-neutral-950 border border-neutral-850/60 mb-6">
                      <span className="font-mono text-[9px] text-[#888] tracking-widest block uppercase">
                        {language === 'bn' ? 'চলমান উন্নয়ন ভেরিয়েবল' : 'LIVE FEASIBILITY PARAMS'}
                      </span>
                      
                      <div>
                        <div className="flex justify-between font-mono text-[10px] mb-1">
                          <span className="text-neutral-500 uppercase">{language === 'bn' ? 'সেলস সুদের হার' : 'FINANCE DEBT RATE'}</span>
                          <span className="text-gold-300 font-bold">{interestRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="7"
                          max="14"
                          step="0.5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                          className="w-full accent-gold-400 h-1 bg-neutral-900 rounded appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-mono text-[10px] mb-1">
                          <span className="text-neutral-500 uppercase">{language === 'bn' ? 'বিক্রয় গতি (প্রতি কোয়ার্টার)' : 'SALES ABSORPTION RATE'}</span>
                          <span className="text-gold-300 font-bold">{salesAbsorptionRate} {language === 'bn' ? 'টি ফ্ল্যাট' : 'Sft/Units'}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="6"
                          value={salesAbsorptionRate}
                          onChange={(e) => setSalesAbsorptionRate(parseInt(e.target.value))}
                          className="w-full accent-gold-400 h-1 bg-neutral-900 rounded appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-950/60 p-4 rounded-lg border border-neutral-850 text-2xs text-neutral-400 leading-normal font-sans">
                    <div className="flex items-center gap-1.5 text-gold-400 font-mono text-[10px] font-semibold mb-2">
                      <ClipboardCheck size={11} className="text-gold-400" />
                      <span>{language === 'bn' ? 'সংক্ষিপ্ত বিনিয়োগ সারসংক্ষেপ' : 'FEASIBILITY OVERVIEW'}</span>
                    </div>
                    <span>
                      {language === 'bn'
                        ? 'এটি রাজউক ঢাকা মহানগর ইমারত নির্মাণ বিধিমালা ২০০৮ বিধি মোতাবেক ১০ কাঠার জমির উপযোগিতা বিবেচনা করে প্রণীত পেশাদার হাউজিং সমীক্ষা।'
                        : 'Designed to represent professional valuation structures. All financial benchmarks dynamically react to Katha size and structural parameters.'}
                    </span>
                  </div>
                </div>

                {/* Feasibility Study Document Paper Layout */}
                <div className="lg:col-span-8 bg-neutral-900/60 rounded-xl border border-neutral-850 p-6 md:p-8 overflow-y-auto max-h-[580px] scrollbar-thin">
                  <div className="border-b border-neutral-850 pb-6 mb-8 text-center">
                    <span className="font-mono text-[9px] tracking-widest text-gold-300 uppercase block mb-1">BOARD VALUATION DOSSIER</span>
                    <h4 className="font-serif text-2xl font-light text-white tracking-wide">
                      {language === 'bn' ? `প্রকল্প সম্ভাব্যতা যাচাই সমীক্ষা: ${projName}` : `Project Feasibility Study: ${projName}`}
                    </h4>
                    <span className="font-mono text-[9px] text-[#666] block mt-1 uppercase">{currentProj.location} // {heightVal} // {apartmentsVal} // {landAreaVal}</span>
                  </div>

                  <div className="space-y-8 font-sans text-xs text-neutral-300 font-light leading-relaxed">
                    {/* Section 1 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        1. Background / Introduction
                      </h5>
                      <p className="pl-3 border-l border-neutral-800">
                        {language === 'bn'
                          ? `${projName} ঢাকা শহরের ${currentProj.locationBn || currentProj.location}-এর অভিজাত residential এলাকায় একটি আধুনিক, নান্দনিক ল্যান্ডমার্ক প্রতিষ্ঠার লক্ষ্যে গৃহীত হয়েছে। এটি টেকসই স্থাপত্য এবং আধুনিক স্ট্রাকচারাল রিইনফোর্সমেন্টের সংমিশ্রণে তৈরি একক মাস্টারপিস।`
                          : `${projName} represents a signature luxury residential initiative situated in ${currentProj.location}, Dhaka. Designed as a landmark building footprint, this project is geared for high-net-worth individuals and returning NRB buyers seeking privacy, maximum daylight, and unparalleled core engineering standards.`}
                      </p>
                    </div>

                    {/* Section 2 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        2. Overview of the Project
                      </h5>
                      <div className="pl-3 border-l border-neutral-800 space-y-2">
                        <p>
                          {language === 'bn'
                            ? `প্রকল্পটি একটি ${heightVal} বিশিষ্ট প্রিমিয়াম রেসিডেনশিয়াল টাওয়ার। এতে থাকছে মোট ${apartmentsVal}। নিচতলায় গাড়ি পার্কিংয়ের বিকল্পে থাকছে আকর্ষণীয় লাক্সারি রিসেপশন লবি ও সর্বোচ্চ নিরাপত্তা ব্যবস্থা।`
                            : `The project comprises a ${heightVal} premium residential tower spanning exactly ${apartmentsVal} to ensure three-way natural ventilation. Sited on a ${landAreaVal} plot, the structure completely eliminates surface-level asphalt in favor of a landscaped internal sanctuary.`}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[9px] text-[#aaa] mt-3">
                          <div className="p-2 bg-neutral-950 rounded">
                            <span className="text-[8px] text-neutral-500 block">HEIGHT</span>
                            <span className="text-white font-bold block">{heightVal}</span>
                          </div>
                          <div className="p-2 bg-neutral-950 rounded">
                            <span className="text-[8px] text-neutral-500 block">TOTAL APARTMENTS</span>
                            <span className="text-white font-bold block">{apartmentsVal}</span>
                          </div>
                          <div className="p-2 bg-neutral-950 rounded">
                            <span className="text-[8px] text-neutral-500 block">PLOT SIZE</span>
                            <span className="text-white font-bold block">{landAreaVal}</span>
                          </div>
                          <div className="p-2 bg-neutral-950 rounded">
                            <span className="text-[8px] text-neutral-500 block">LOBBY SPECS</span>
                            <span className="text-white font-bold block">Double-Volume Zen</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        3. Economic Overview of the Area
                      </h5>
                      <p className="pl-3 border-l border-neutral-800">
                        {language === 'bn'
                          ? 'আজকের ঢাকা শহরের উত্তরা সেগমেন্ট মেট্রোরেল সংযোজন এবং হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর সন্নিকটে থাকায় দেশের অন্যতম প্রভাবশালী অর্থনৈতিক ও আবাসিক জোন হিসেবে রূপান্তরিত হয়েছে। উত্তরার প্রপার্টি মূল্য সাধারণ বাজারের চেয়ে বহুগুণ ঊর্ধ্বমুখী এবং প্রতি বর্গফুট ১১,০০০ থেকে ১৬,০০০ টাকার রেকর্ড সীমায় পৌঁছেছে যা নিশ্চিত মূলধন বৃদ্ধি নির্দেশ করে।'
                          : 'Uttara, Dhaka has transformed into a critical economic powerhouse, catalyzed by the rapid deployment of the MRT Line 6 (Metro Rail) and proximity to the expanded International Airport. Typical land valuations in Uttara have scaled by 14.5% annually over the trailing 5 years, with premium residential developments currently clearing at unprecedented ranges of BDT 11,000 to 16,500/sqft.'}
                      </p>
                    </div>

                    {/* Section 4 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        4. Site and Location Analysis
                      </h5>
                      <div className="pl-3 border-l border-neutral-800 space-y-2">
                        <p>
                          {language === 'bn'
                            ? 'প্রকল্পের নির্মাণ প্লটটি ঢাকার উত্তরায় একটি আকর্ষণীয় ১০-কাঠা আয়তনের জমির ওপর অবস্থিত, যার সাথে ৬০ ফুট চওড়া প্রশস্ত রাস্তা সংযোগ রয়েছে। প্লটটির চারিদিকে কোনো উচ্চ আবদ্ধ ভবন না থাকায় সব ঋতুতেই মনোরম বাতাস ও প্রাকৃতিক আলোর পূর্ণ সুবিধা মিলবে।'
                            : 'The subject property spans a prime 10-Katha plot situated in a quiet sector of Uttara, Dhaka, directly attached to a 60ft municipal arterial road. This secures excellent emergency vehicle egress and easily achieves the highest permissible RAJUK 2008 FAR classification.'}
                        </p>
                        <div className="p-3.5 bg-neutral-950/80 rounded border border-neutral-800/80 text-[10px] font-mono leading-relaxed space-y-1">
                          <div className="flex justify-between border-b border-neutral-900 pb-1">
                            <span className="text-neutral-500">Plot Footprint:</span>
                            <span className="text-white">10 Katha (7,200 sq ft)</span>
                          </div>
                          <div className="flex justify-between border-b border-neutral-900 pb-1 pt-1">
                            <span className="text-neutral-500">Access Arterial:</span>
                            <span className="text-white">60 ft Wide Roadway</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-neutral-500">Geotechnical Index:</span>
                            <span className="text-white">Silt-Clay Matrix, 110ft Piling Depth</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        5. Market Assessment (Product Positioning)
                      </h5>
                      <p className="pl-3 border-l border-neutral-800">
                        {language === 'bn'
                          ? `বাজারে বিদ্যমান অধিকাংশ ভবনেই অন্ধকার ও অপ্রশস্ত রুমের জটিলতা থাকে। ${projName}-এর কর্নার নকশা নিশ্চিত করে যে কোনো ফ্ল্যাটেই কোলাহলপূর্ণ বা অন্ধকার ঘরের সমস্যা থাকবে না। প্রকল্পটি অভিজাত প্রবাসী বাংলাদেশী (NRB), ব্যবসায়ী এবং উচ্চ পদস্থ কর্মকর্তাদের টার্গেট করে প্রিমিয়াম আন্ডারটোন দিয়ে বাজারে পজিশন করা হয়েছে।`
                          : `Standard multi-family layouts in Dhaka typically suffer from generic dark core rooms. ${projName} resolves this structural defect by deploying a strict 100% Corner Residence template with three-way exterior exposure. Positioning targets long-term corporate executives, returning NRBs, and professional practitioners seeking quiet elegance and top-tier security profiles.`}
                      </p>
                    </div>

                    {/* Section 6 */}
                    <div className="p-4 bg-neutral-950/30 rounded border border-neutral-850 hover:border-gold-400/20 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-gold-400 rounded-sm" />
                        6. Operations
                      </h5>
                      <div className="pl-3 border-l border-neutral-800 space-y-2">
                        <p>
                          {language === 'bn'
                            ? 'প্রকল্পটি ৩৬ মাসের কঠোর নির্মাণ চক্রে বুয়েটের অভিজ্ঞ সিভিল ও স্ট্রাকচারাল বিশেষজ্ঞদের সরাসরি তত্ত্বাবধানে নির্মিত হবে। রাজউক অনুমোদন ইতিমধ্যে বাস্তবায়িত হয়েছে এবং পরিবেশগত সম্পূর্ণ ছাড়পত্র ফাইলভুক্ত রয়েছে।'
                            : 'Executed over a highly coordinated 36-month construction cycle. All operations represent deep structural supervision from certified BUET consultants, adhering strictly to Bangladesh National Building Code (BNBC) parameters.'}
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-neutral-400 mt-2 text-[10.5px]">
                          <li>{language === 'bn' ? 'মাইলস্টোন ১: সয়েল টেস্টিং এবং পাইল ঢালাই সমাপ্তি (৫ম মাস)' : 'Milestone 1: Geotechnical boring & cast pile extraction (Month 5)'}</li>
                          <li>{language === 'bn' ? 'মাইলস্টোন ২: রিইনফোর্সড কংক্রিট কোর এবং স্লাব সমাপ্তি (১৮তম মাস)' : 'Milestone 2: Reinforced concrete core framing & lintels completion (Month 18)'}</li>
                          <li>{language === 'bn' ? 'মাইলস্টোন ৩: ডাবল-গ্লেজ গ্লাস ও মেটাল লুভার স্থাপন (২৪তম মাস)' : 'Milestone 3: Low-E double-glazed envelope and louver framing (Month 24)'}</li>
                          <li>{language === 'bn' ? 'মাইলস্টোন ৪: অভ্যন্তর প্রিমিয়াম মার্বেল ফিনিশিং ও ইন্টেরিয়র হ্যান্ডওভার (৩৬তম মাস)' : 'Milestone 4: Greek marble blocks laying & handovers (Month 36)'}</li>
                        </ul>
                      </div>
                    </div>

                    {/* Section 7 */}
                    <div className="p-4 bg-neutral-950 rounded border border-gold-400/20 hover:border-gold-400/45 transition-all">
                      <h5 className="font-mono text-[10px] text-gold-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-3.5 bg-gold-400 rounded-sm animate-pulse" />
                        7. Financial Analysis (Dynamic Model)
                      </h5>
                      <div className="pl-3 border-l border-gold-400/20 space-y-3">
                        <p className="text-neutral-300 leading-normal">
                          {language === 'bn'
                            ? `১০ কাঠার এই প্রজেক্টের জন্য বর্তমান ডেভেলপমেন্ট ভেরিয়েবল অনুযায়ী প্রাক্কলিত আর্থিক অনুপাতসমূহ হিসাব করা হয়েছে নিচে। এই অনুপাতগুলো উপরে প্রদত্ত কাস্টম স্লাইডার পরিবর্তন করার মাধ্যমে স্বয়ংক্রিয়ভাবে রিক্যালকুলেট হয়:`
                            : `The dynamic pro-forma analysis details developer and land-owner financial outcomes, factoring in plot size, road access FAR limits, selected finishes, and custom interest rates:`}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                          <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850">
                            <span className="text-[8.5px] font-mono text-neutral-500 uppercase block">REQUIRED CAPITAL INVESTMENT</span>
                            <span className="font-serif text-lg font-normal text-white block mt-1">
                              ৳ {((totalBuildArea > 0 ? totalBuildArea : kathaSize * 720 * farValue) * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) / 10000000).toFixed(2)} Cr
                            </span>
                            <span className="text-[9px] text-[#666] font-mono block">Estimated construction cost</span>
                          </div>

                          <div className="p-3 bg-neutral-950/80 rounded border border-neutral-850">
                            <span className="text-[8.5px] font-mono text-neutral-500 uppercase block">ESTIMATED REVENUE (DEV)</span>
                            <span className="font-serif text-lg font-normal text-gold-300 block mt-1">
                              ৳ {((devSqFt > 0 ? devSqFt : (totalBuildArea * 0.6)) * (finishingTier === 'standard' ? 11500 : finishingTier === 'premium' ? 13500 : 16000) / 10000000).toFixed(2)} Cr
                            </span>
                            <span className="text-[9px] text-[#666] font-mono block">Developer share salables</span>
                          </div>

                          <div className="p-3 bg-neutral-950/80 rounded border border-gold-400/10">
                            <span className="text-[8.5px] font-mono text-neutral-500 uppercase block">ESTIMATED ROI / IRR</span>
                            <span className="font-mono text-lg font-semibold text-emerald-400 block mt-1">
                              {((((devSqFt * (finishingTier === 'standard' ? 11500 : finishingTier === 'premium' ? 13500 : 16000)) - (totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200))) / (totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200))) * 100).toFixed(1)}% ROI
                            </span>
                            <span className="text-[9px] text-emerald-500/75 font-mono block">{(18.2 + (interestRate * 0.2) + (salesAbsorptionRate * 0.5)).toFixed(1)}% Project IRR</span>
                          </div>
                        </div>

                        <div className="p-3 bg-gold-400/5 rounded border border-gold-400/15 text-[10px] text-gold-300 font-mono leading-relaxed">
                          <p>
                            <strong>Financial Appraisal Note:</strong> At a {interestRate}% banking debt cost, the sales absorption of {salesAbsorptionRate} units per quarter yields a net positive cashflow starting at Quarter 5. Project breaks even at Month 16.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'cost-estimate' && (
              <motion.div
                key="cost"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Cost Dashboard Left Settings Panel */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-850 pb-6 lg:pb-0 lg:pr-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gold-300 font-mono text-[9px] uppercase tracking-wider mb-2">
                      <DollarSign size={11} className="text-gold-400" />
                      <span>{language === 'bn' ? 'ব্যয় নিয়ন্ত্রণ সিমুলেশন' : 'PRE-CONSTRUCTION COST ESTIMATOR'}</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-white mb-2 leading-tight">
                      {language === 'bn' ? 'ব্যয় ব্রেকডাউন স্ট্রাকচার' : 'Cost Breakdown Structure (CBS)'}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-6 font-light">
                      {language === 'bn' 
                        ? `${projName} এর জন্য স্ট্যান্ডার্ড উপাদান ভিত্তিক ইন্টারেক্টিভ খরচ অনুমান সিমুলেটর।`
                        : `Adjust finishes and design reserves to scale dynamic structural budgets for the ${projName} development.`}
                    </p>

                    {/* Finish Tier Dropdown selector with quiet-luxury styling */}
                    <div className="mb-6">
                      <label className="font-mono text-[8.5px] text-[#999] tracking-widest block uppercase mb-2">
                        {language === 'bn' ? 'ফিনিশিং গুদাম বিন্যাস' : 'MATERIAL FINISHING GRADE'}
                      </label>
                      <select
                        value={finishingTier}
                        onChange={(e) => setFinishingTier(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-xs font-mono text-gold-300 focus:outline-none focus:border-gold-400 rounded cursor-pointer"
                      >
                        <option value="standard">{language === 'bn' ? 'স্ট্যান্ডার্ড লাক্সারি (৳৩,৬০০/বর্গফুট)' : 'Standard Luxury (৳3,600/sqft)'}</option>
                        <option value="premium">{language === 'bn' ? 'সিগনেচার প্রিমিয়াম (৳৪,৮০০/বর্গফুট)' : 'Signature Premium (৳4,800/sqft)'}</option>
                        <option value="imperial">{language === 'bn' ? 'ইম্পেরিয়াল এলিটিজম (৳৬,২০০/বর্গফুট)' : 'Imperial Elite (৳6,200/sqft)'}</option>
                      </select>
                    </div>

                    {/* Contingency rates selector */}
                    <div className="mb-6">
                      <div className="flex justify-between font-mono text-[10px] mb-2">
                        <span className="text-[#888] uppercase">{language === 'bn' ? 'ডিজাইন কন্টিনজেন্সি রিজার্ভ' : 'DESIGN CONTINGENCY RATE'}</span>
                        <span className="text-gold-300 font-bold">{contingencyRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="25"
                        step="1"
                        value={contingencyRate}
                        onChange={(e) => setContingencyRate(parseInt(e.target.value))}
                        className="w-full h-1 accent-gold-400 bg-neutral-800 roundedappearance-none cursor-pointer"
                      />
                      <span className="text-[9px] text-[#555] font-sans block mt-1 leading-normal">
                        {language === 'bn' 
                          ? '* প্রারম্ভিক ডিজাইন ধাপে অপ্রত্যাশিত সাইট ও মাটির অবস্থার ঝুকি মোকাবেলায় ১৫-২৫% রিজার্ভ বাঞ্ছনীয়।'
                          : '* Recommended 15-25% contingency reserve in early pre-construction phase to insulate against unknown geotechnical variance.'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-850 mt-6 lg:mt-0 font-mono text-[9px] text-[#666] leading-normal space-y-1">
                    <span>REGULATED UNDER RAJUK BUILDING CONSTRUCTION CODES</span>
                    <span className="block">ESTIMATION BASE YEAR: 2026 // DHAKA DX-TIER EXCISE INCLUDED</span>
                  </div>
                </div>

                {/* CBS Budget Table */}
                <div className="lg:col-span-8 bg-neutral-950/40 border border-neutral-850 rounded-xl p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-neutral-850 pb-4 mb-6">
                      <span className="font-mono text-[9px] tracking-widest text-[#999] uppercase block">
                        COST BREAKDOWN ESTIMATES ({totalBuildArea > 0 ? totalBuildArea.toLocaleString() : (kathaSize * 720 * farValue).toLocaleString()} SQ FT BUILD ENVELOPE)
                      </span>
                      <span className="text-[10px] font-mono text-gold-400 font-bold bg-gold-400/5 border border-gold-400/25 px-2.5 py-0.5 rounded">
                        {finishingTier.toUpperCase()} GRADE
                      </span>
                    </div>

                    {/* Estimator Table */}
                    <div className="space-y-4">
                      {/* Direct Labor (15%) */}
                      <div className="flex items-center justify-between border-b border-neutral-850/40 pb-3">
                        <div>
                          <span className="font-serif text-sm text-white block">1. Direct Labor Allocations</span>
                          <span className="text-[9.5px] text-neutral-500 font-mono block">Masons, concrete crews, boring technicians & structural foremen</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-white">৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) * 0.15) / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[9px] text-[#555] block">15.00% Share</span>
                        </div>
                      </div>

                      {/* Consultants (8%) */}
                      <div className="flex items-center justify-between border-b border-neutral-850/40 pb-3">
                        <div>
                          <span className="font-serif text-sm text-white block">2. Engineering & Design Consultants</span>
                          <span className="text-[9.5px] text-neutral-500 font-mono block">BUET Structural engineers, MEP planners, and Principal Architects</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-white">৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) * 0.08) / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[9px] text-[#555] block">8.00% Share</span>
                        </div>
                      </div>

                      {/* Materials (55%) */}
                      <div className="flex items-center justify-between border-b border-neutral-850/40 pb-3">
                        <div>
                          <span className="font-serif text-sm text-white block">3. Materials & Reimbursables</span>
                          <span className="text-[9.5px] text-neutral-500 font-mono block">72.5 Grade Rebar, 4000 PSI Ready Mix concrete, Double glazed envelopes, marble</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-white">৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) * 0.55) / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[9px] text-[#555] block">55.00% Share</span>
                        </div>
                      </div>

                      {/* Permits & Agency Fees (7%) */}
                      <div className="flex items-center justify-between border-b border-neutral-850/40 pb-3">
                        <div>
                          <span className="font-serif text-sm text-white block">4. Permits & Municipal Agency Fees</span>
                          <span className="text-[9.5px] text-neutral-500 font-mono block">RAJUK layout validations, Civil aviation & Fire NOC clearances, WASA grid allotment</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-white">৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) * 0.07) / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[9px] text-[#555] block">7.00% Share</span>
                        </div>
                      </div>

                      {/* Overhead (15%) */}
                      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                        <div>
                          <span className="font-serif text-sm text-white block">5. Overhead Allocations</span>
                          <span className="text-[9.5px] text-neutral-500 font-mono block">Site admin office operations, insurance premium escrow, security, marketing</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-white">৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200) * 0.15) / 10000000).toFixed(2)} Cr</span>
                          <span className="text-[9px] text-[#555] block">15.00% Share</span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">SUBTOTAL DIRECT CONSTRUCTION</span>
                        <span className="font-mono text-xs text-neutral-300 font-semibold">
                          ৳ {((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200)) / 10000000).toFixed(2)} Cr
                        </span>
                      </div>

                      {/* Contingency Rate calculation */}
                      <div className="flex items-center justify-between text-neutral-400 pl-4 border-l border-neutral-800">
                        <span className="text-2xs font-mono uppercase tracking-widest flex items-center gap-1">
                          ↳ DESIGN CONTINGENCY RESERVE ({contingencyRate}%)
                        </span>
                        <span className="font-mono text-xs font-semibold text-gold-300">
                          + ৳ {(((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200)) * (contingencyRate / 100)) / 10000000).toFixed(2)} Cr
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grand total project allocation */}
                  <div className="mt-8 border-t border-gold-400/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block">GRAND TOTAL ESCROWED BUDGET REGISTER</span>
                      <span className="font-serif text-2xl sm:text-3xl text-gold-300 font-normal mt-0.5 block">
                        ৳ {(((totalBuildArea * (finishingTier === 'standard' ? 3600 : finishingTier === 'premium' ? 4800 : 6200)) * (1 + contingencyRate / 100)) / 10000000).toFixed(2)} Crore BDT
                      </span>
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 px-5 py-3 bg-neutral-900 border border-neutral-800 hover:border-gold-400/50 text-neutral-300 hover:text-gold-300 font-mono text-[10px] uppercase font-semibold tracking-wider rounded cursor-pointer transition-all active:scale-95"
                    >
                      <Save size={12} className="text-gold-400" />
                      <span>{language === 'bn' ? 'বাজেট শীট সেভ করুন' : 'Lock Base Budget'}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}


            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-serif text-xl text-white">
                      {language === 'bn' ? 'প্রকৌশল ও নির্মাণ গুণগত মানদণ্ড' : 'Engineering Quality Matrix'}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans mt-1">
                      {language === 'bn' 
                        ? 'রাজউকের সাধারণ নিয়মরক্ষার বিপরীতে মল্লিক-২ এর চমৎকার নির্মাণ গুণমান পরীক্ষা।'
                        : "Comparing municipal minimum benchmarks to Mollik's signature build levels."}
                    </p>
                  </div>
                  <span className="text-2xs font-mono bg-neutral-950 px-3 py-1 rounded border border-neutral-800 text-gold-400">
                    {language === 'bn' ? 'যাচাইকৃত ল্যাব টেস্ট রিপোর্ট' : 'QA/QC CERTIFIED LOGS'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-neutral-950/80 border-b border-neutral-800 font-mono text-[10px] text-neutral-400">
                        <th className="p-4 w-[180px]">{language === 'bn' ? 'কাঠামোগত খাত' : 'STRUCTURAL SECTOR'}</th>
                        <th className="p-4 border-r border-neutral-850">{language === 'bn' ? 'ঢাকার সাধারণ নিয়ম (রাজউক)' : 'STANDARD DHAKA MINIMUM'}</th>
                        <th className="p-4 text-gold-300 bg-gold-400/5">{language === 'bn' ? 'মল্লিক টাওয়ার-২ এর অনন্য মানদণ্ড' : 'MOLLIK TOWER-2 EXCELLENCE TIER'}</th>
                        <th className="p-4 text-right">{language === 'bn' ? 'সরকারি তফাৎ মাত্রা' : 'MUNICIPAL MARGIN'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      <tr>
                        <td className="p-4 font-mono font-bold text-neutral-300">{language === 'bn' ? 'রিইনফোর্সমেন্ট রবার/রড' : 'Reinforcement Rebar'}</td>
                        <td className="p-4 text-neutral-400 border-r border-neutral-850">
                          {language === 'bn' ? 'গ্রেড ৪০/৬০ সাধারণ মাইল্ড স্টিল রড টেস্টিং' : 'Grade 40/60 Mild Steel Rebar testing'}
                        </td>
                        <td className="p-4 font-semibold text-white bg-gold-400/5 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-400" />
                          {language === 'bn' ? 'BSRM/GPH এক্সট্রিম ৭২.৫ গ্রেড উন্নত রড' : 'BSRM/GPH Extreme 72.5 Grade High Yield'}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-mono font-bold">
                          {language === 'bn' ? '+২০% ভূকম্পন সহনশীলতা' : '+20% Seismic Hold'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono font-bold text-neutral-300">{language === 'bn' ? 'কংক্রিট ঢালাই শক্তি' : 'Concrete Casting Strength'}</td>
                        <td className="p-4 text-neutral-400 border-r border-neutral-850">
                          {language === 'bn' ? '৩০০০ পিএসআই হ্যান্ড মিক্সড ঢালাই' : '3000 PSI Hand / Core aggregated mixes'}
                        </td>
                        <td className="p-4 font-semibold text-white bg-gold-400/5 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-400" />
                          {language === 'bn' ? '৪০০০ পিএসআই রেডি-মিক্স বুয়েট প্রশংসিত ঢালাই' : '4000 PSI Certified High-Performance Cast'}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-mono font-bold">
                          {language === 'bn' ? '+৩৩% বেশি গভীরতা ও স্থায়িত্ব' : '+33% Pile Durability'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono font-bold text-neutral-300">{language === 'bn' ? 'বিদ্যুৎ ও ব্যাকআপ জেনারেটর' : 'Power & Backup Generator'}</td>
                        <td className="p-4 text-neutral-400 border-r border-neutral-850">
                          {language === 'bn' ? '৮০ কেভিএ লিমিটেড ক্ষমতা সম্পন্ন সাধারণ জেনারেটর' : 'Single 80KVA local generator for common bays'}
                        </td>
                        <td className="p-4 font-semibold text-white bg-gold-400/5 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-400" />
                          {language === 'bn' ? 'দ্বৈত ১৫০ কেভিএ সাউন্ডপ্রুফ কামিন্স ডিজেল সেট (১০০% লোড)' : 'Dual 150KVA Soundproof Cummins Diesel Set (100% Load)'}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-mono font-bold">
                          {language === 'bn' ? '১০০% নিরবচ্ছিন্ন ব্যাকআপ সুবিধা' : '100% Blackout Autarchy'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono font-bold text-neutral-300">{language === 'bn' ? 'লবি ও আধুনিক লিফট' : 'Lobbies & Core Lift'}</td>
                        <td className="p-4 text-neutral-400 border-r border-neutral-850">
                          {language === 'bn' ? 'কম গতির সাধারণ দরজা সহ লোকাল লিফট ক্যাবিন' : 'Low-speed generic passenger cabins'}
                        </td>
                        <td className="p-4 font-semibold text-white bg-gold-400/5 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-400" />
                          {language === 'bn' ? 'হুন্ডাই/সিগমা উচ্চ গতির ভিভিভিএফ গিয়ার লিফট' : 'Hyundai/Sigma High-Speed VVVF Gear with ARD Safety'}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-mono font-bold">
                          {language === 'bn' ? 'স্বয়ংক্রিয় রেসকিউ (ARD) সুবিধা' : 'Emergency Auto Rescues'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono font-bold text-neutral-300">{language === 'bn' ? 'পানি সরবরাহ ও সংরক্ষণ ব্যবস্থা' : 'Water Preservation System'}</td>
                        <td className="p-4 text-neutral-400 border-r border-neutral-850">
                          {language === 'bn' ? 'একটিমাত্র ভূগর্ভস্থ পাম্প মোটর' : 'Singular underground municipal connection pump'}
                        </td>
                        <td className="p-4 font-semibold text-white bg-gold-400/5 flex items-center gap-2">
                          <ShieldCheck size={14} className="text-gold-400" />
                          {language === 'bn' ? 'ডবল রিজার্ভার ট্যাংক (২৪,০০০ গ্যালন) এবং বুস্টার পাম্প' : 'Double Reserver Tank (24k Gallons) + Dual Pneumatic Boosters'}
                        </td>
                        <td className="p-4 text-right text-emerald-400 font-mono font-bold">
                          {language === 'bn' ? 'কোনো পানি ঘাটতিহীন সংযোগ' : 'Zero Water Outages'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'cad-packages' && (
              <motion.div
                key="cad-packages"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
              >
                {/* Left Form Column */}
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-neutral-850 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-white mb-2">
                      {language === 'bn' ? 'ডিএক্সএফ ও পিডিএফ ক্যাড ফাইল দাবি করুন' : 'Request DXF / PDF Blueprints'}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-6">
                      {language === 'bn' 
                        ? 'স্থপতি, প্রকৌশলী এবং পৌর পরিকল্পনাবিদরা স্ট্রাকচারাল ফ্লোর লেআউট, পাইল লগ এবং প্রত্যয়িত রাজউক লেআউটের তাত্ক্ষণিক নিষ্কাশনের জন্য অনুরোধ করতে পারেন।'
                        : 'Architects, developers, and municipal planners can request instant extraction of structural floor layouts, piling logs, and certified RAJUK layouts.'}
                    </p>

                    {!cadSubmitted ? (
                      <form onSubmit={handleCadSubmit} className="space-y-4">
                        <div>
                          <label className="font-mono text-[9px] text-[#999] uppercase block mb-1.5 leading-none">
                            {language === 'bn' ? 'কোম্পানি বা প্রতিষ্ঠানের নাম' : 'COMPANY / DEVELOPER FIRM'}
                          </label>
                          <input
                            type="text"
                            required
                            value={cadForm.companyName}
                            onChange={(e) => setCadForm({...cadForm, companyName: e.target.value})}
                            placeholder={language === 'bn' ? 'যেমন: ঢাকা বিল্ডার্স গ্রুপ' : 'e.g. Dhaka Builders Group'}
                            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[9px] text-[#999] uppercase block mb-1.5 leading-none">
                            {language === 'bn' ? 'প্রাতিষ্ঠানিক ইমেইল ঠিকানা' : 'CORPORATE EMAIL ADDRESS'}
                          </label>
                          <input
                            type="email"
                            required
                            value={cadForm.email}
                            onChange={(e) => setCadForm({...cadForm, email: e.target.value})}
                            placeholder="e.g. partner@firm.com"
                            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[9px] text-[#999] uppercase block mb-1.5 leading-none">
                            {language === 'bn' ? 'পদবী বা প্রতিনিধিত্ব' : 'DESIGNATION / REPRESENTATION'}
                          </label>
                          <input
                            type="text"
                            value={cadForm.designation}
                            onChange={(e) => setCadForm({...cadForm, designation: e.target.value})}
                            placeholder={language === 'bn' ? 'যেমন: সিনিয়র পার্টনার / স্থপতি' : 'e.g. Senior Partner / Architect'}
                            className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-400"
                          />
                        </div>

                        <button
                           type="submit"
                           className="w-full py-3 rounded bg-gold-400 hover:bg-gold-500 text-neutral-950 font-mono text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Mail size={12} />
                          <span>{language === 'bn' ? 'ক্যাড ফাইল প্যাকেজ তৈরি করুন' : 'Generate CAD Package'}</span>
                        </button>
                      </form>
                    ) : (
                      <div className="bg-neutral-950/60 p-5 rounded border border-gold-400/20 text-center flex flex-col items-center justify-center min-h-[220px]">
                        {isDownloading ? (
                          <div className="w-full">
                            <Clock size={28} className="text-gold-300 animate-spin mx-auto mb-4" />
                            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">
                              {language === 'bn' ? 'ক্যাড মেটাডেটা সংগ্রহ করা হচ্ছে...' : 'EXTRACTING METADATA CAD DRAWINGS'}
                            </span>
                            <div className="w-full max-w-[200px] h-1.5 bg-neutral-900 rounded-full mx-auto overflow-hidden border border-neutral-800">
                              <div className="bg-gold-400 h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                            </div>
                            <span className="font-mono text-xs text-gold-300 block mt-2">{downloadProgress}%</span>
                          </div>
                        ) : (
                          <div>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                              <Check size={16} />
                            </div>
                            <span className="font-serif text-sm font-semibold text-white block mb-1">
                              {language === 'bn' ? 'ডিজিটাল ক্যাড ভল্ট পুনরুদ্ধার সফল!' : 'Vault Extraction Completed!'}
                            </span>
                            <p className="text-[10px] text-neutral-400 font-sans max-w-xs mx-auto mb-4">
                              {language === 'bn' 
                                ? `নিরাপদ DXF DWG এবং ভূতাত্ত্বিক পরীক্ষার রিপোর্ট সফলভাবে ${cadForm.companyName} এর জন্য এক্সট্র্যাক্ট করা হয়েছে এবং ${cadForm.email} ঠিকানায় পাঠানো হয়েছে।`
                                : `The secure DXF DWG and geotechnical logs have been extracted for ${cadForm.companyName} and forwarded safely to ${cadForm.email}.`}
                            </p>
                            <button
                              onClick={() => { setCadSubmitted(false); setCadForm({ companyName: '', email: '', designation: '' }); }}
                              className="px-3 py-1.5 bg-neutral-900 text-neutral-300 font-mono text-[9px] uppercase tracking-wider rounded border border-neutral-800 hover:text-white"
                            >
                              {language === 'bn' ? 'নতুন ক্যাড দাবি করুন' : 'New Extraction'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Package Logs Column */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <span className="font-mono text-[9px] tracking-widest text-[#999] uppercase block mb-4">
                    {language === 'bn' ? 'চলতি ডেটাসেট তালিকা' : 'CURRENT DATASET INDEX'}
                  </span>

                  <div className="space-y-3">
                    <div className="bg-neutral-950/60 p-4 rounded border border-neutral-850 flex items-center justify-between hover:bg-neutral-950/90 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-neutral-900 text-gold-300 font-mono text-[10px] font-bold">DXF</div>
                        <div>
                          <span className="text-xs font-serif text-white block">
                            {language === 'bn' ? 'কাঠামোগত নকশা শীট (ক্যাড ফ্লোরপ্ল্যান)' : 'Structural Layout Sheets (CAD Floorplans)'}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono block">V.2026.04 // 42.4 MB DWG Vector Data</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 text-neutral-400 text-[8.5px] font-mono border border-neutral-850">
                        <span>{language === 'bn' ? 'প্রস্তুত' : 'Ready'}</span>
                      </span>
                    </div>

                    <div className="bg-neutral-950/60 p-4 rounded border border-neutral-850 flex items-center justify-between hover:bg-neutral-950/90 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-neutral-900 text-gold-300 font-mono text-[10px] font-bold">PDF</div>
                        <div>
                          <span className="text-xs font-serif text-white block">
                            {language === 'bn' ? 'অফিসিয়াল সয়েল ও জিওটেকনিক্যাল বোরিং রিপোর্ট' : 'Official Soil Geotechnical Test & Boring Log'}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono block">6 Boreholes depth: 110 ft // Hydrodynamic analysis</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 text-neutral-400 text-[8.5px] font-mono border border-neutral-850">
                        <span>{language === 'bn' ? 'প্রস্তুত' : 'Ready'}</span>
                      </span>
                    </div>

                    <div className="bg-neutral-950/60 p-4 rounded border border-neutral-850 flex items-center justify-between hover:bg-neutral-950/90 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-neutral-900 text-gold-300 font-mono text-[10px] font-bold">DWG</div>
                        <div>
                          <span className="text-xs font-serif text-white block">
                            {language === 'bn' ? 'পাইল লেআউট ও কংক্রিট ফ্রেমওয়ার্ক নকশা' : 'Piling Coordinates & Concrete Raft Framing'}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono block">Approved RAJUK civil blueprint sheets</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 text-neutral-400 text-[8.5px] font-mono border border-neutral-850">
                        <span>{language === 'bn' ? 'প্রস্তুত' : 'Ready'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded bg-neutral-900 border border-neutral-850 flex items-center gap-3 text-2xs text-gold-300 leading-normal font-sans">
                    <HardHat size={16} className="text-gold-400 flex-shrink-0" />
                    <span>
                      {language === 'bn' 
                        ? 'অফিসিয়াল ফাইল অ্যাক্সেস করার জন্য প্রাতিষ্ঠানিক পরিচয় বা নিবন্ধন প্রয়োজন। তাৎক্ষণিক স্ট্রাকচারাল জিজ্ঞাসার জন্য সরাসরি মোহাম্মদ আব্দুল মোমেন-এর সাথে যোগাযোগ করুন।'
                        : 'Accessing standard records requires corporate registration. For immediate structural queries, please contact Mohammed Abdul Momen directly.'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
