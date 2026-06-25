import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Layers, 
  BookOpen, 
  X, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Eye, 
  Sliders,
  Settings
} from "lucide-react";
import { PROJECT_LIST } from "../data";

interface UXCustomizerProps {
  language: "en" | "bn";
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSave: (newSettings: any) => void;
}

export default function UXCustomizer({ language, isOpen, onClose, settings, onSave }: UXCustomizerProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "branding" | "projects" | "dictionary">("colors");
  const [localSettings, setLocalSettings] = useState(settings);
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECT_LIST[0]?.id || "");
  const [newSearchWord, setNewSearchWord] = useState("");
  const [newReplaceWord, setNewReplaceWord] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectFieldChange = (field: string, value: any) => {
    setLocalSettings((prev: any) => {
      const overrides = { ...(prev?.projectOverrides || {}) };
      if (!overrides[selectedProjectId]) {
        overrides[selectedProjectId] = {};
      }
      overrides[selectedProjectId][field] = value;
      return {
        ...prev,
        projectOverrides: overrides
      };
    });
  };

  const addDictionaryItem = () => {
    if (!newSearchWord.trim()) return;
    setLocalSettings((prev: any) => {
      const dict = [...(prev.dictionary || [])];
      dict.push({
        id: Math.random().toString(36).substring(2, 9),
        search: newSearchWord.trim(),
        replace: newReplaceWord
      });
      return {
        ...prev,
        dictionary: dict
      };
    });
    setNewSearchWord("");
    setNewReplaceWord("");
  };

  const removeDictionaryItem = (id: string) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      dictionary: (prev.dictionary || []).filter((item: any) => item.id !== id)
    }));
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const resetToDefault = () => {
    if (window.confirm(language === "en" ? "Are you sure you want to reset all live customization parameters?" : "আপনি কি নিশ্চিত যে সমস্ত কাস্টমাইজেশন রিসেট করতে চান?")) {
      const defaults = {
        primaryColor: "#1B4D3E",
        accentColor: "#C8A165",
        darkBgColor: "#141615",
        lightBgColor: "#FAFAFA",
        customFont: "Inter",
        heroTitleEn: "EXCEL IN APARTMENT DESIGN",
        heroTitleBn: "নির্ভুল ও নিরাপদ আবাসন",
        heroSubEn: "Modern structural engineering safety paired with transparent corporate governance.",
        heroSubBn: "ভূমিকম্প সহনশীল আধুনিক কাঠামো এবং শতভাগ আইনি স্বচ্ছতার নিশ্চয়তা।",
        logoSrcEn: "",
        logoSrcBn: "",
        heroBgUrl: "",
        chairmanNameEn: "Md. Saheb Ali Mollik",
        chairmanNameBn: "মোঃ সাহেব আলী মল্লিক",
        projectOverrides: {},
        dictionary: []
      };
      setLocalSettings(defaults);
      onSave(defaults);
    }
  };

  // Get current state of selected project
  const currentProjOverride = localSettings?.projectOverrides?.[selectedProjectId] || {};
  const currentProjBase = PROJECT_LIST.find(p => p.id === selectedProjectId) || {
    name: "",
    nameBn: "",
    location: "",
    locationBn: "",
    size: "",
    type: "",
    typeBn: "",
    image: "",
    price: 0
  };

  const mockProjectName = currentProjOverride.name || currentProjBase.name;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-xl bg-[#141615] text-white h-screen flex flex-col shadow-2xl border-l border-[#C8A165]/20"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C8A165]/10 border border-[#C8A165]/35 flex items-center justify-center text-[#C8A165]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base tracking-wide text-white">
                    {language === "en" ? "UI/UX Creative Customizer" : "ইউআই/ইউএক্স কাস্টমাইজেশন প্যানেল"}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-wider">
                    {language === "en" ? "LIVE BRAND ENGINE & THEME CANVAS" : "ব্র্যান্ড থিম এবং কপি কাস্টমাইজেশন"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefault}
                  title={language === "en" ? "Reset Customizations" : "ডিফল্ট রিসেট"}
                  className="p-1.5 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Tab Menu */}
            <div className="flex border-b border-white/5 bg-black/10 overflow-x-auto shrink-0 font-bold select-none text-[10.5px]">
              {[
                { id: "colors", label: "COLORS", labelBn: "রংসমূহ", icon: Palette },
                { id: "typography", label: "TYPOGRAPHY", labelBn: "লিখা ও স্নোগান", icon: Type },
                { id: "branding", label: "BRAND LOGOS", labelBn: "লোগো ও ব্যানার", icon: ImageIcon },
                { id: "projects", label: "PROJECTS", labelBn: "প্রজেক্ট তথ্য", icon: Layers },
                { id: "dictionary", label: "DICTIONARY", labelBn: "শব্দ পরিবর্তন", icon: BookOpen },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-3 uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                      activeTab === tab.id
                        ? "text-[#C8A165] border-[#C8A165] bg-white/5 font-black"
                        : "text-neutral-400 border-transparent hover:text-neutral-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{language === "en" ? tab.label : tab.labelBn}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Workspace */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SAVED FLOATING SUCCESS NOTIFICATION */}
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/85 text-emerald-400 border border-emerald-500/30 p-3.5 rounded-lg flex items-center gap-2.5 text-xs font-bold"
                >
                  <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>
                    {language === "en" 
                      ? "UI/UX elements synchronized and applied instantly!" 
                      : "ইউআই/ইউএক্স পরিবর্তনসমূহ স্বয়ংক্রিয়ভাবে সঙ্ক্রিয় করা হয়েছে!"}
                  </span>
                </motion.div>
              )}

              {/* COLORS PANEL */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8A165] mb-2 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>{language === "en" ? "Dynamic CSS Color Injector" : "রঙের কাস্টমাইজেশন"}</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                      {language === "en" 
                        ? "Adjust these parameters up-front. They will live-inject override properties onto the entire real estate portal's background grid and luxury card boundaries."
                        : "নিচের রঙগুলো পরিবর্তন করুন। এই সিলেক্টরগুলো সাইটের প্রধান ও অ্যাকসেন্ট কালার ডেকোরেশন সাথে সাথেই লাইভ আপডেট করে দেবে।"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900/35 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        {language === "en" ? "Primary Brand Green" : "প্রধান ব্র্যান্ড সবুজ"}
                      </label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={localSettings.primaryColor}
                          onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
                          className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={localSettings.primaryColor}
                          onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 px-2 py-1 text-xs rounded text-neutral-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-neutral-900/35 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        {language === "en" ? "Accent Metallic Gold" : "অ্যাকসেন্ট মেটালিক গোল্ড"}
                      </label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={localSettings.accentColor}
                          onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                          className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={localSettings.accentColor}
                          onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 px-2 py-1 text-xs rounded text-neutral-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-neutral-900/35 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        {language === "en" ? "Dark Theme Charcoal" : "ডার্ক চারকোল ব্যাকগ্রাউন্ড"}
                      </label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={localSettings.darkBgColor}
                          onChange={(e) => handleFieldChange("darkBgColor", e.target.value)}
                          className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={localSettings.darkBgColor}
                          onChange={(e) => handleFieldChange("darkBgColor", e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 px-2 py-1 text-xs rounded text-neutral-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-neutral-900/35 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        {language === "en" ? "Light Theme Canvas" : "লাইট ব্যাকগ্রাউন্ড"}
                      </label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={localSettings.lightBgColor}
                          onChange={(e) => handleFieldChange("lightBgColor", e.target.value)}
                          className="w-10 h-10 border border-white/10 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={localSettings.lightBgColor}
                          onChange={(e) => handleFieldChange("lightBgColor", e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 px-2 py-1 text-xs rounded text-neutral-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPOGRAPHY PANEL */}
              {activeTab === "typography" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-[10.5px] font-bold text-neutral-300 uppercase tracking-widest">
                      {language === "en" ? "Global Font Face Override" : "ফন্ট ওভাররাইড লিখুন"}
                    </label>
                    <select
                      value={localSettings.customFont}
                      onChange={(e) => handleFieldChange("customFont", e.target.value)}
                      className="w-full bg-neutral-900 px-3.5 py-2.5 border border-white/10 rounded-lg text-xs leading-tight font-medium text-white focus:border-[#C8A165] focus:outline-none"
                    >
                      <option value="Inter">Inter (Premium Swiss Modern)</option>
                      <option value="Space Grotesk">Space Grotesk (Tech Editorial)</option>
                      <option value="Playfair Display">Playfair Display (Prestige Serif)</option>
                      <option value="Outfit">Outfit (Crisp Geometric Sans)</option>
                      <option value="Fira Code">Fira Code (Modern Tech Mono)</option>
                    </select>
                  </div>

                  <hr className="border-white/5" />

                  {/* Slogan details */}
                  <div className="space-y-3">
                    <h5 className="text-[10.5px] font-bold text-neutral-300 uppercase tracking-widest">{language === "en" ? "Hero Slogan & Title Text" : "প্রধান টাইটেল টেক্সট সমূহ"}</h5>
                    
                    <div>
                      <label className="block text-[10px] text-neutral-450 mb-1 font-mono uppercase">Hero Slogan Title (English)</label>
                      <input
                        type="text"
                        value={localSettings.heroTitleEn}
                        onChange={(e) => handleFieldChange("heroTitleEn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-450 mb-1 font-mono uppercase">Hero Slogan Title (Bangla)</label>
                      <input
                        type="text"
                        value={localSettings.heroTitleBn}
                        onChange={(e) => handleFieldChange("heroTitleBn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-450 mb-1 font-mono uppercase">Hero Sub-text Description (English)</label>
                      <textarea
                        rows={2}
                        value={localSettings.heroSubEn}
                        onChange={(e) => handleFieldChange("heroSubEn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-450 mb-1 font-mono uppercase">Hero Sub-text Description (Bangla)</label>
                      <textarea
                        rows={2}
                        value={localSettings.heroSubBn}
                        onChange={(e) => handleFieldChange("heroSubBn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BRANDING LOGO & ASSETS */}
              {activeTab === "branding" && (
                <div className="space-y-4">
                  <div className="bg-amber-50/5 text-amber-300 border border-amber-500/20 p-4 rounded-xl leading-relaxed text-[11px] font-light">
                    <Sparkles className="w-4 h-4 text-[#C8A165] mb-1.5" />
                    <span>
                      {language === "en" 
                        ? "Paste custom URL links for brand image uploads. Leaving fields blank uses standard local uploads automatically."
                        : "যেকোনো ছবির কাস্টম অনলাইন লিঙ্ক এখানে পেস্ট করতে পারেন। ফাঁকা রাখলে সাইটে সংযুক্ত অফিশিয়াল ছবি দেখতে পাবেন।"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1 font-mono uppercase">English Brand Logo URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /logo english.JPG or https://custom-link.com/logo.jpg"
                        value={localSettings.logoSrcEn}
                        onChange={(e) => handleFieldChange("logoSrcEn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none font-mono text-neutral-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1 font-mono uppercase">Bangla Brand Logo URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /logo bangla.JPG or https://custom-link.com/logo-bn.jpg"
                        value={localSettings.logoSrcBn}
                        onChange={(e) => handleFieldChange("logoSrcBn", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none font-mono text-neutral-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1 font-mono uppercase">Hero Banner Background Image URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://images.unsplash.com/your-custom-luxury-architecture.jpg"
                        value={localSettings.heroBgUrl}
                        onChange={(e) => handleFieldChange("heroBgUrl", e.target.value)}
                        className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none font-mono text-neutral-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS SELECTIVE OVERRIDE */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest">{language === "en" ? "Select Project to Override" : "প্রজেক্ট নির্বাচন করুন"}</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-neutral-900 px-3 py-2 border border-white/10 rounded-lg text-xs font-semibold text-white focus:border-[#C8A165] focus:outline-none"
                    >
                      {PROJECT_LIST.map(p => (
                        <option key={p.id} value={p.id}>{p.id.toUpperCase()} — {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
                    <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase border-b border-white/5 pb-2">
                       Editing: <span className="text-[#C8A165] font-bold">{mockProjectName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Project Name (EN)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.name}
                          value={currentProjOverride.name || ""}
                          onChange={(e) => handleProjectFieldChange("name", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Project Name (BN)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.nameBn}
                          value={currentProjOverride.nameBn || ""}
                          onChange={(e) => handleProjectFieldChange("nameBn", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Location En (e.g. South Khan)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.location}
                          value={currentProjOverride.location || ""}
                          onChange={(e) => handleProjectFieldChange("location", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Location Bn (e.g. দক্ষিণখান)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.locationBn}
                          value={currentProjOverride.locationBn || ""}
                          onChange={(e) => handleProjectFieldChange("locationBn", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Type (En) (e.g. Residential)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.type}
                          value={currentProjOverride.type || ""}
                          onChange={(e) => handleProjectFieldChange("type", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Type (Bn)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.typeBn}
                          value={currentProjOverride.typeBn || ""}
                          onChange={(e) => handleProjectFieldChange("typeBn", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Size (e.g. 1500 sqft)</label>
                        <input
                          type="text"
                          placeholder={currentProjBase.size}
                          value={currentProjOverride.size || ""}
                          onChange={(e) => handleProjectFieldChange("size", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Price in BDT (Numeric)</label>
                        <input
                          type="number"
                          placeholder={String(currentProjBase.price || 0)}
                          value={currentProjOverride.price || ""}
                          onChange={(e) => handleProjectFieldChange("price", e.target.value)}
                          className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1 font-medium">Project Card Thumbnail Image URL</label>
                      <input
                        type="text"
                        placeholder={currentProjBase.image}
                        value={currentProjOverride.image || ""}
                        onChange={(e) => handleProjectFieldChange("image", e.target.value)}
                        className="w-full bg-black/40 px-2.5 py-1.5 border border-white/5 rounded text-xs focus:border-[#C8A165] focus:outline-none font-mono text-neutral-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GENERAL DICTIONARY WORD REPLACER */}
              {activeTab === "dictionary" && (
                <div className="space-y-4">
                  <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8A165] mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{language === "en" ? "Universal Copy & Word Translator" : "শব্দ ও প্রতিশব্দ ডিকশনারি"}</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                      {language === "en" 
                        ? "Configure any custom search-replace map. This executes search loops across all headlines on the main screens, swapping custom words dynamically."
                        : "যেকোনো ইংরেজি বা বাংলা শব্দ সরাসরি পরিবর্তন করতে এখানে ডিকশনারি তৈরি করুন। এটি ওয়েবসাইট টেক্সটে উক্ত শব্দ খুজে তা আপনার পছন্দ মতো প্রতিশব্দ দিয়ে প্রতিস্থাপন করে দেবে।"}
                    </p>
                  </div>

                  {/* Add Row form */}
                  <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-mono uppercase">{language === "en" ? "Search text" : "খুঁজুন"}</label>
                        <input
                          type="text"
                          placeholder={language === "en" ? "e.g. Uttara" : "যেমনঃ উত্তরা"}
                          value={newSearchWord}
                          onChange={(e) => setNewSearchWord(e.target.value)}
                          className="w-full bg-black/50 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1 font-mono uppercase">{language === "en" ? "Replace with" : "পরিবর্তন শব্দ"}</label>
                        <input
                          type="text"
                          placeholder={language === "en" ? "e.g. North Dhaka" : "যেমনঃ উত্তর ঢাকা"}
                          value={newReplaceWord}
                          onChange={(e) => setNewReplaceWord(e.target.value)}
                          className="w-full bg-black/50 px-3 py-2 border border-white/10 rounded-lg text-xs focus:border-[#C8A165] focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addDictionaryItem}
                      className="w-full py-2 bg-[#1B4D3E] hover:bg-[#12362b] text-[#C8A165] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C8A165]" />
                      <span>{language === "en" ? "ADD REPLACEMENT RULE" : "নতুন নিয়ম যোগ করুন"}</span>
                    </button>
                  </div>

                  {/* Rules list */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{language === "en" ? "Active Dictionary Maps" : "সক্রিয় নিয়ম তালিকা"}</label>
                    
                    {(!localSettings.dictionary || localSettings.dictionary.length === 0) ? (
                      <p className="text-[10.5px] text-neutral-500 italic text-center py-4">
                        {language === "en" ? "No custom word rules declared yet" : "কোনো কাস্টম শব্দের নিয়ম এখনো সাজানো হয়নি"}
                      </p>
                    ) : (
                      <div className="bg-black/35 rounded-xl border border-white/5 divide-y divide-white/5 max-h-48 overflow-y-auto">
                        {localSettings.dictionary.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 text-xs">
                            <div className="flex items-center gap-2 font-medium">
                              <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold line-clamp-1 max-w-[140px]">{item.search}</span>
                              <span className="text-neutral-400">→</span>
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold line-clamp-1 max-w-[140px]">{item.replace || "EMPTY"}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeDictionaryItem(item.id)}
                              className="text-neutral-400 hover:text-rose-400 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </form>

            {/* Sticky Actions Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-4">
              <span className="text-[10px] text-neutral-400">
                {language === "en" ? "✓ Changes apply dynamically to live DOM" : "✓ পরিবর্তনসমূহ সরাসরি প্রতিফলিত হবে"}
              </span>

              <button
                type="button"
                onClick={handleSaveSubmit}
                className="px-6 py-2.5 bg-[#C8A165] hover:bg-[#b08c50] text-[#141615] hover:shadow-lg transition-all rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#141615]" />
                <span>{language === "en" ? "Save & Inject UI/UX" : "সংরক্ষণ ও প্রয়োগ করুন"}</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
