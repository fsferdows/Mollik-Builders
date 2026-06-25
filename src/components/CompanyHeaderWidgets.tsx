import React, { useState, useEffect } from "react";
import { CloudSun, Sparkles, Award, UserCheck, ShieldAlert, Thermometer, Wind, RefreshCw } from "lucide-react";
import { Language } from "../types";

interface WidgetProps {
  language: Language;
}

// -------------------------------------------------------------
// DHAKA LIVE WEATHER WIDGET: Real open forecasting API fetch
// -------------------------------------------------------------
export function DhakaWeatherWidget({ language }: WidgetProps) {
  const [temp, setTemp] = useState<number | null>(null);
  const [conditionCode, setConditionCode] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Dhaka coordinates: Lat 23.8103, Lon 90.4125
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true");
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      if (data && data.current_weather) {
        setTemp(Math.round(data.current_weather.temperature));
        setConditionCode(data.current_weather.weathercode);
        setWindSpeed(data.current_weather.windspeed);
        setFailed(false);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      // Fallback: Dhaka ambient temp calculations based on current local hour
      const hrs = new Date().getHours();
      const baseTemp = (hrs > 8 && hrs < 17) ? 33 : 28; // standard tropical averages
      setTemp(baseTemp);
      setConditionCode(0); // clear sky fallback
      setWindSpeed(10.5);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const getConditionText = (code: number | null): { en: string; bn: string } => {
    if (code === null) return { en: "Pleasant", bn: "মনোরম" };
    if (code === 0) return { en: "Clear Abode", bn: "নির্মল আকাশ" };
    if (code >= 1 && code <= 3) return { en: "Partly Cloudy", bn: "আংশিক মেঘলা" };
    if (code >= 45 && code <= 48) return { en: "Misty Horizon", bn: "কুয়াশাময়" };
    if (code >= 51 && code <= 67) return { en: "Luxe Drizzle", bn: "হালকা গুঁড়ি বৃষ্টি" };
    if (code >= 71 && code <= 86) return { en: "Premium Airs", bn: "শীতল বাতাস" };
    if (code >= 95) return { en: "Thunderstorm Monsoon", bn: "বজ্রঝড় বর্ষা" };
    return { en: "Humid Breeze", bn: "উষ্ণ হাওয়া" };
  };

  const condition = getConditionText(conditionCode);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950/80 border border-neutral-900 rounded-lg hover:border-[#C8A165]/30 transition-all shadow-[inset_0_1px_8px_rgba(200,161,101,0.05)]">
      <div className="relative">
        <CloudSun className="w-3.5 h-3.5 text-[#C8A165] animate-pulse" />
        <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      </div>
      <div className="text-left font-mono">
        <span className="text-[7.5px] text-neutral-450 block uppercase tracking-widest leading-none font-bold">
          {language === "en" ? "Dhaka Metropolitan" : "ঢাকা মেট্রোপলিটন"}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-white text-[10px] font-black leading-none">
            {loading ? "..." : `${temp}°C`}
          </span>
          <span className="text-neutral-500 text-[8px] leading-none font-sans font-bold">
            {loading ? "updating" : (language === "en" ? condition.en : condition.bn)}
          </span>
        </div>
      </div>
      <button 
        onClick={fetchWeather} 
        disabled={loading}
        className="ml-1 p-0.5 text-neutral-600 hover:text-[#C8A165] rounded transition-colors"
        title="Force Weather Refresh"
      >
        <RefreshCw className={`w-2.5 h-2.5 ${loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// MOLLIK PRESTIGE LOYALTY BADGE
// -------------------------------------------------------------
export function MollikPrestigeBadge({ language }: WidgetProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLoyaltyTier = (sec: number) => {
    if (sec < 20) {
      return {
        level: "Bronze Tier",
        levelBn: "ব্রোঞ্জ টায়ার",
        status: "Elite Guest",
        statusBn: "এলিট গেস্ট",
        color: "text-amber-600 border-amber-600/35 bg-amber-600/5",
        progress: (sec / 20) * 100
      };
    } else if (sec < 60) {
      return {
        level: "Silver Patron",
        levelBn: "সিলভার প্যাট্রন",
        status: "Premium VIP",
        statusBn: "প্রিমিয়াম ভিআইপি",
        color: "text-zinc-300 border-zinc-600/35 bg-zinc-650/5",
        progress: ((sec - 20) / 40) * 100
      };
    } else if (sec < 120) {
      return {
        level: "Gold Heritage",
        levelBn: "গোল্ড হেরিটেজ",
        status: "Grand Ambassador",
        statusBn: "গ্র্যান্ড অ্যাম্বাসেডর",
        color: "text-gold-450 border-[#C8A165]/35 bg-[#C8A165]/5",
        progress: ((sec - 60) / 60) * 100
      };
    } else {
      return {
        level: "Platinum Prestige",
        levelBn: "প্লাটিনাম প্রেস্টিজ",
        status: "Royal Legacy Partner",
        statusBn: "রয়্যাল লিগ্যাসি পার্টনার",
        color: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10 animate-pulse",
        progress: 100
      };
    }
  };

  const tier = getLoyaltyTier(seconds);

  return (
    <div className={`relative px-2.5 py-1 sm:py-1.5 border rounded-lg transition-all duration-500 flex items-center gap-2 max-w-[170px] sm:max-w-xs font-sans ${tier.color}`}>
      
      {/* Absolute micro loader line tracking engagement */}
      <div className="absolute bottom-0 left-0 h-[1.5px] bg-[#C8A165]/40 transition-[width] duration-1000 rounded-b" style={{ width: `${tier.progress}%` }} />

      <div className="p-1 rounded bg-black/60">
        <Sparkles className="w-3 h-3 text-[#C8A165]" />
      </div>

      <div className="text-left leading-none font-mono">
        <div className="flex items-center gap-1">
          <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
            {language === "en" ? tier.level : tier.levelBn}
          </span>
          <span className="text-[7.5px] text-neutral-500 font-bold">
            ({seconds}s)
          </span>
        </div>
        <span className="block text-[8.5px] font-sans font-black text-white uppercase tracking-wider mt-0.5">
          {language === "en" ? tier.status : tier.statusBn}
        </span>
      </div>
    </div>
  );
}
