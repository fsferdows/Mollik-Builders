import React, { useState, useEffect, lazy, Suspense } from "react";
import { PROJECT_LIST, TESTIMONIALS, ARTICLES, CAREERS_LIST, FAQS_LIST } from "./data";
import { Project, Language, FAQ } from "./types";
import { 
  Phone, Mail, Clock, Globe, Facebook, Youtube, Instagram, Linkedin, 
  Menu, X, Sparkles, Search, Award, CheckCircle2, Building, ShieldCheck, 
  Briefcase, LandPlot, MessageSquare, ChevronLeft, ChevronRight, HelpCircle, 
  Check, ArrowRight, User, DollarSign, Calendar, MapPin, Map, Lock, Play, Upload, ChevronUp, Settings
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import FloorPlan from "./components/FloorPlan";
import BuilderConsole from "./components/BuilderConsole";
import ProjectCard from "./components/ProjectCard";
import AnimatedHeading from "./components/AnimatedHeading";
import LuxuryLogo from "./components/LuxuryLogo";
import InteractiveVectorMap from "./components/InteractiveVectorMap";
import InvestmentCalculator from "./components/InvestmentCalculator";
import MediaCard from "./components/MediaCard";
import UXCustomizer from "./components/UXCustomizer";
import ProjectGallery from "./components/ProjectGallery";
import { DhakaWeatherWidget, MollikPrestigeBadge } from "./components/CompanyHeaderWidgets";
import AIVoiceConcierge from "./components/AIVoiceConcierge";


const chairmanImg = "/chairman.webp";

const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ProjectDetailModal = lazy(() => import("./components/ProjectDetailModal"));
const VirtualTourModal = lazy(() => import("./components/VirtualTourModal"));
const CompareModal = lazy(() => import("./components/CompareModal"));
const PhpDetailModal = lazy(() => import("./components/PhpDetailModal"));

const renderStoryText = (text: string, isBn: boolean) => {
  if (isBn) {
    if (text.includes("আধুনিক নকশা")) {
      return (
        <>
          স্থাপত্যের শ্রেষ্ঠত্ব ও <span className="font-serif italic text-[#C8A165]">আধুনিক নকশা</span>
        </>
      );
    }
    if (text.includes("নতুন সংজ্ঞা")) {
      return (
        <>
          শহুরে অভিজাত জীবনযাত্রার <span className="font-serif italic text-[#C8A165]">নতুন সংজ্ঞা</span>
        </>
      );
    }
    if (text.includes("সবুজ আবাসন")) {
      return (
        <>
          পরিবেশবান্ধব ও <span className="font-serif italic text-[#C8A165]">সবুজ আবাসন</span>
        </>
      );
    }
    if (text.includes("স্ট্রাকচারাল")) {
      return (
        <>
          অত্যাধুনিক <span className="font-serif italic text-[#C8A165]">স্ট্রাকচারাল ইঞ্জিনিয়ারিং</span>
        </>
      );
    }
    if (text.includes("ফ্লোর প্ল্যান")) {
      return (
        <>
          এক্সক্লুসিভ লেআউট ও <span className="font-serif italic text-[#C8A165]">ফ্লোর প্ল্যান</span>
        </>
      );
    }
    return text;
  } else {
    if (text.includes("& Modern Design")) {
      return (
        <>
          Architectural Excellence & <span className="font-serif italic font-normal text-[#C8A165]">Modern Design</span>
        </>
      );
    }
    if (text.includes("Luxurious Urban Living")) {
      return (
        <>
          The Art of <span className="font-serif italic font-normal text-[#C8A165]">Luxurious Urban Living</span>
        </>
      );
    }
    if (text.includes("Eco-Friendly High-Rises")) {
      return (
        <>
          Sustainable <span className="font-serif italic font-normal text-[#C8A165]">Eco-Friendly High-Rises</span>
        </>
      );
    }
    if (text.includes("Structural Engineering")) {
      return (
        <>
          State-of-the-Art <span className="font-serif italic font-normal text-[#C8A165]">Structural Engineering</span>
        </>
      );
    }
    if (text.includes("& Floor Plans")) {
      return (
        <>
          Exclusive Layouts & <span className="font-serif italic font-normal text-[#C8A165]">Floor Plans</span>
        </>
      );
    }
    return text;
  }
};

const MEDIA_NEWS = [
  {
    image: "/uploads/project 2(1).webp",
    outlet: "The Daily Star • Award 2026",
    title: "Recognized for Pioneering BNBC Earthquake Resistant Infrastructure in Uttara Hub",
    titleBn: "উত্তরা হাব-এ বিএনবিসি ভূমিকম্প সহনশীল অবকাঠামোয় অগ্রগামীদের স্বীকৃতি",
    summary: "Awarded for high density concrete micro-pile integrity and vertical landscaping architecture across modern towers.",
    summaryBn: "আধুনিক টাওয়ারে হাইডেন্সিটি কংক্রিট পাইলিং এবং খাড়া সবুজ ল্যান্ডস্কেপিং স্থাপত্যের জন্য পুরস্কৃত।"
  },
  {
    image: "/uploads/project 8 (1).webp",
    outlet: "Prothom Alo • Feature",
    title: "Transparency in Real Estate: Mollik Builders Introduces Secure Unit Tracking API",
    titleBn: "রিয়েল এস্টেটে স্বচ্ছতা: নিরাপদ ইউনিট ট্র্যাকিং এপিআই নিয়ে এলো মল্লিক বিল্ডার্স",
    summary: "Eliminating dual-booking issues with decentralized, real-time live reservation systems for clients.",
    summaryBn: "গ্রাহকদের দ্বৈত-বুকিং নির্মূলে সর্বাধুনিক রিয়েল-টাইম লাইভ ক্যাটালগ ট্র্যাক সিস্টেম।"
  },
  {
    image: "/uploads/project 3.webp",
    outlet: "The Business Standard • Profile",
    title: "Mollik Builders' Standard Setting Green Concrete Technology Proves Resilient",
    titleBn: "পরিবেশবান্ধব গ্রিন কনক্রিট প্রযুক্তি ও টেকসই নির্মাণে মল্লিক বিল্ডার্স",
    summary: "How eco-conscious construction is shaping Dhaka's luxury skyline with lower carbon footprint.",
    summaryBn: "পরিবেশবান্ধব উপাদান ব্যবহার করে কার্বন নির্গমন হ্রাস ও দীর্ঘস্থায়ী অবকাঠামো গঠনের অনন্য প্রয়াস।"
  },
  {
    image: "/uploads/project 9.webp",
    outlet: "Financial Express • Real Estate Dialogues",
    title: "Exclusive Interview: Building Homes Tailored for Generations with Zero-Loss Design",
    titleBn: "শতভাগ স্পেস ইউটিলিটি ডিজাইনে প্রজন্মের জন্য নিরাপদ আবাসন",
    summary: "Our managing director details building structures that achieve natural daylight optimization.",
    summaryBn: "ফ্ল্যাটের প্রতিটি কোণায় প্রাকৃতিক আলোর সর্বোত্তম ব্যবহার নিশ্চিত করার বিশেষ স্থাপত্যশৈলী।"
  }
];

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  // Premium Project Gallery Lightbox states
  const [selectedGalleryProject, setSelectedGalleryProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Lead count trigger to update Admin Panel instantly
  const [leadCounter, setLeadCounter] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [uxCustomizerOpen, setUxCustomizerOpen] = useState(false);

  // Load customizer settings with default parameters
  const [uxSettings, setUxSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("mollik_ux_customizer_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean and maintain defaults inside the parameters
        return {
          primaryColor: parsed.primaryColor || "#1B4D3E",
          accentColor: parsed.accentColor || "#C8A165",
          darkBgColor: parsed.darkBgColor || "#141615",
          lightBgColor: parsed.lightBgColor || "#FAFAFA",
          customFont: parsed.customFont || "Inter",
          heroTitleEn: parsed.heroTitleEn || "EXCEL IN APARTMENT DESIGN",
          heroTitleBn: parsed.heroTitleBn || "নির্ভুল ও নিরাপদ আবাসন",
          heroSubEn: parsed.heroSubEn || "Modern structural engineering safety paired with transparent corporate governance.",
          heroSubBn: parsed.heroSubBn || "ভূমিকম্প সহনশীল আধুনিক কাঠামো এবং শতভাগ আইনি স্বচ্ছতার নিশ্চয়তা।",
          logoSrcEn: parsed.logoSrcEn || "",
          logoSrcBn: parsed.logoSrcBn || "",
          heroBgUrl: parsed.heroBgUrl || "",
          chairmanNameEn: parsed.chairmanNameEn || "Md. Saheb Ali Mollik",
          chairmanNameBn: parsed.chairmanNameBn || "মোঃ সাহেব আলী মল্লিক",
          projectOverrides: parsed.projectOverrides || {},
          dictionary: parsed.dictionary || []
        };
      }
    } catch (_) {}
    return {
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
      dictionary: [] as Array<{ id: string; search: string; replace: string }>
    };
  });

  // Dynamic Web Configurations from Server
  const [webConfig, setWebConfig] = useState({
    hotlineNumber: "+880 1715-120802",
    hotlineNumbersList: ["+880 1715-120802", "+880 1811-253989", "+880 1928-258818"],
    founderName: "Md. Saheb Ali Mollik",
    founderNameBn: "মোঃ সাহেব আলী মল্লিক",
    founderTitle: "Founder, Chairman & Managing Director",
    founderTitleBn: "প্রতিষ্ঠাতা, চেয়ারম্যান ও ব্যবস্থাপনা পরিচালক",
    founderPhone: "+880 1715-120802",
    founderEmail: "sahebalimollik@mollikbuilders.com",
    founderLocation: "Bhuiyan Bari Mor, Plot-Miyabari, (West side of Uttarkhan Primary School), Uttarkhan, Uttara, Dhaka-1230",
    founderLocationBn: "ভূঁইয়া বাড়ি মোড়, প্লট-মিয়াবাড়ি, (উত্তরখান সরকারি প্রাথমিক বিদ্যালয়ের পশ্চিম পাশে), উত্তরখান, উত্তরা, ঢাকা-১২৩০",
    founderBio: "Under the visionary leadership of Chairman Md. Saheb Ali Mollik, Mollik Builders stands as a standard-bearer of absolute integrity, architectural safety, and construction transparency in Uttara and Dakshinkhan. Emphasizing modern earthquake-resistant structural safety and complete legal disclosures, he paves the way for secure, timeless residential masterpieces.",
    founderBioBn: "চেয়ারম্যান মোঃ সাহেব আলী মল্লিকের দূরदर्शी নেতৃত্বে মল্লিক বিল্ডার্স উত্তরা ও দক্ষিণখানের আবাসন খাতের সততা, নিরাপত্তা ও সফলতার প্রতীক হিসেবে দাঁড়িয়ে আছে। আধুনিক ভূমিকম্প সহনশীল কাঠামো এবং শতভাগ আইনি স্বচ্ছতা বজায় রেখে তিনি গড়ে চলেছেন নিখুঁত ও গৌরবময় আবাসন প্রজেক্টসমূহ।",
    founderExp: "25+ Years of Real Estate & Structural Engineering Supremacy",
    founderExpBn: "রিয়েল এস্টেট ও স্ট্রাকচারাল ইঞ্জিনিয়ারিংয়ে ২৫+ বছরের শ্রেষ্ঠত্ব",
    founderImage: "/chairman.webp",
    aboutTitle: "About Our Enterprise",
    aboutTitleBn: "আমাদের উদ্যোগ সম্পর্কে",
    aboutText: "Mollik Builders is a leading premium real estate developer in Bangladesh. With over a decade of dedication to civil excellence, we craft sustainable landmark addresses across Dhaka. Each project integrates modern seismic designs, sound isolation, and meticulously organized green foliage. We operate on a foundation of complete transparency — no hidden cost sheets, explicit RAJUK compliance, and guaranteed deadlines.",
    aboutTextBn: "মল্লিক বিল্ডার্স বাংলাদেশের অন্যতম প্রথম সারির একটি প্রিমিয়াম রিয়েল এস্টেট কোম্পানি। গত এক দশক ধরে আমরা ঢাকার প্রধান প্রধান আবাসন এলাকায় নির্ভরযোগ্য ও ভূমিকম্প প্রতিরোধক ডিজাইনার ভবন বা বাণিজ্যিক ভবন প্রস্তুত করে আসছি। আমাদের প্রতিটি প্রজেক্ট রাজুক কর্তৃক অনুমোদিত এবং সম্পূর্ণ স্বচ্ছ চুক্তির সাথে সঠিক ডেডলাইনে হস্তান্তর করা হয়।",
    aboutImage: "/uploads/project 2(1).webp",
    heroSlides: [
      {
        image: "/uploads/project 1.webp",
        title: "Architectural Excellence & Modern Design",
        titleBn: "স্থাপত্যের শ্রেষ্ঠত্ব ও আধুনিক নকশা",
        subtitle: "Mollik Builders Premium",
        subtitleBn: "মল্লিক বিল্ডার্স প্রিমিয়াম",
        description: "Designed with clean structural aesthetics, optimal natural light ventilation, and maximum space utility.",
        descriptionBn: "পরিষ্কার নান্দনিক গঠন, সর্বোচ্চ প্রাকৃতিক আলো-বাতাস চলাচল এবং পর্যাপ্ত জায়গা উপযোগী নকশা।"
      },
      {
        image: "/uploads/Project 2.webp",
        title: "The Art of Luxurious Urban Living",
        titleBn: "শহুরে অভিজাত জীবনযাত্রার নতুন সংজ্ঞা",
        subtitle: "Quiet Luxury Residences",
        subtitleBn: "শান্ত ও অভিজাত আবাসন",
        description: "Experience structural mastery paired with quiet, natural luxury in the heart of Dhaka.",
        descriptionBn: "ঢাকার হৃদয়ে মনোরম প্রকৃতির ছোঁয়ায় বিলাসবহুল ও সুরক্ষিত আবাসন।"
      },
      {
        image: "/uploads/project 3.webp",
        title: "Sustainable Eco-Friendly High-Rises",
        titleBn: "পরিবেশবান্ধব ও সবুজ আবাসন",
        subtitle: "Eco-conscious Construction",
        subtitleBn: "পরিবেশ সচেতন নির্মাণ",
        description: "Engineered to withstand extreme seismic loads while supporting verdant green landscaping features.",
        descriptionBn: "ভূমিকম্প সহনশীল শক্তিশালী কাঠামো এবং দৃষ্টিনন্দন ঝুলন্ত সুবজের এক চমৎকার সমন্বয়।"
      },
      {
        image: "/uploads/project 8.webp",
        title: "State-of-the-Art Structural Engineering",
        titleBn: "অত্যাধুনিক স্ট্রাকচারাল ইঞ্জিনিয়ারিং",
        subtitle: "RAJUK Approved Blueprint",
        subtitleBn: "রাজউক অনুমোদিত ব্লু-প্রিন্ট",
        description: "Flawlessly implemented designs matching international BNBC standards and RAJUK requirements.",
        descriptionBn: "আন্তর্জাতিক বিএনবিসি মানদণ্ড এবং রাজউক অনুমোদন মেনে নিখুঁত নির্মাণ।"
      },
      {
        image: "/uploads/project 9.webp",
        title: "Exclusive Layouts & Floor Plans",
        titleBn: "এক্সক্লুসিভ লেআউট ও ফ্লোর প্ল্যান",
        subtitle: "Smart Space Optimization",
        subtitleBn: "স্মার্ট স্পেস অপ্টিমাইজেশন",
        description: "Meticulously crafted rooms designed to maximize comfort, privacy, and absolute visual peace.",
        descriptionBn: "সর্বাধিক স্বাচ্ছন্দ্য, গোপনীয়তা এবং নিখুঁত প্রশান্তি প্রদানের জন্য চমৎকার কক্ষ বিন্যাস নকশা।"
      }
    ]
  });

  const fetchWebConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        if (data && data.founderName) {
          setWebConfig(data);
        }
      }
    } catch (err) {
      console.error("Error loading Web Config:", err);
    }
  };

  useEffect(() => {
    fetchWebConfig();
  }, [leadCounter]);

  useEffect(() => {
    try {
      localStorage.setItem("mollik_ux_customizer_v1", JSON.stringify(uxSettings));
    } catch (_) {}
  }, [uxSettings]);

  // Dynamically map project list with the visual overrides
  const customizedProjectList = React.useMemo(() => {
    return PROJECT_LIST.map((project) => {
      const override = uxSettings.projectOverrides?.[project.id];
      if (override) {
        return {
          ...project,
          name: override.name || project.name,
          nameBn: override.nameBn || project.nameBn,
          location: override.location || project.location,
          locationBn: override.locationBn || project.locationBn,
          size: override.size || project.size,
          type: override.type || project.type,
          typeBn: override.typeBn || project.typeBn,
          image: override.image || project.image,
          price: override.price ? String(override.price) + " BDT" : project.price,
        };
      }
      return project;
    }).slice(0, 10);
  }, [uxSettings]);

  // Universal word-replacement dictionary and live translations engine
  const renderText = React.useCallback((defaultEn: string, defaultBn: string) => {
    const textBase = language === "en" ? defaultEn : defaultBn;
    if (!textBase) return "";

    let result = textBase;
    if (uxSettings.dictionary && uxSettings.dictionary.length > 0) {
      uxSettings.dictionary.forEach((item: any) => {
        if (item.search && item.replace) {
          const escapedSearch = item.search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(escapedSearch, 'g');
          result = result.replace(regex, item.replace);
        }
      });
    }
    return result;
  }, [language, uxSettings.dictionary]);

  // Ambient scroll storytelling parameters for advanced luxury parallax
  const heroBgY = useTransform(scrollYProgress, [0, 0.25], ["0%", "15%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.15]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, 60]);
  const heroTextAlpha = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroLeftSlide = useTransform(scrollYProgress, [0, 0.25], [0, -35]);
  const heroRightSlide = useTransform(scrollYProgress, [0, 0.25], [0, 35]);
  
  // Navigation active states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab ] = useState<string>(() => {
    try {
      return localStorage.getItem("mollik_active_tab") || "all";
    } catch (_) {
      return "all";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mollik_active_tab", activeTab);
    } catch (_) {}
  }, [activeTab]);

  const [engineMode, setEngineMode] = useState<"react" | "php">(() => {
    try {
      return (localStorage.getItem("mollik_engine_mode") as "react" | "php") || "php";
    } catch (_) {
      return "php";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mollik_engine_mode", engineMode);
    } catch (_) {}
  }, [engineMode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "close-php-modal") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Scroll to top visibility monitoring
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Executive Concierge Callback State
  const [executivePhone, setExecutivePhone] = useState("");
  const [executiveType, setExecutiveType] = useState("joint_venture");
  const [executiveSuccess, setExecutiveSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  
  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [active3DProject, setActive3DProject] = useState<Project | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [careerApplyJob, setCareerApplyJob] = useState<string | null>(null);
  const [selectedFounderIcon, setSelectedFounderIcon] = useState<string>("voice");

  // Premium Custom Toast Notifications
  interface Toast {
    id: string;
    message: string;
    messageBn?: string;
    type: "success" | "info" | "gold" | "warning";
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (msg: string, msgBn?: string, type: Toast["type"] = "gold") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message: msg, messageBn: msgBn, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Luxury Oral Voice Narrator Guide
  const [narratorPlaying, setNarratorPlaying] = useState(false);
  const synthRef = React.useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const toggleNarrator = () => {
    if (!synthRef.current) return;
    if (narratorPlaying) {
      synthRef.current.cancel();
      setNarratorPlaying(false);
      showToast(
        "Audio Narrator muted.",
        "অডিও ধারাভাষ্যকার বন্ধ করা হয়েছে।",
        "info"
      );
    } else {
      synthRef.current.cancel(); // Stop any pending speech
      const textToSpeak = language === "en" 
        ? `Welcome to Apex Estates. We are dedicated to building dreams and creating legacies. Under the visionary leadership of Md. Saheb Ali Mollik, we deliver absolute architectural integrity, modern earthquake-resistant structural safety, and complete financial transparency. Discover our featured luxurious residential layouts in Gulshan, Dhanmondi, and Uttara, calculate customized multi-year installment projects, or talk directly to our AI Concierge advisor.`
        : `অ্যাপেক্স এস্টেট-এ আপনাকে স্বাগতম। আমরা গড়ে তুলছি ভবিষ্যৎ প্রজেক্ট ও দীর্ঘস্থায়ী গৌরব। মোঃ সাহেব আলী মল্লিকের দূরদর্শী নেতৃত্বে, আমরা নিশ্চিত করি স্থাপত্যের নির্ভরযোগ্যতা, আধুনিক ভূমিকম্প-প্রতিরোধী কাঠামো এবং আর্থিক স্বচ্ছতা। আমাদের বিলাসবহুল অ্যাপার্টমেন্টগুলো এক্সপ্লোর করুন, সুদমুক্ত কিস্তির হিসাব করুন অথবা সাহায্য নিন আমাদের কৃত্রিম বুদ্ধিমত্তা সম্পন্ন উপদেষ্টা থেকে।`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = synthRef.current.getVoices();
      const preferredLang = language === "en" ? "en-US" : "bn-BD";
      const matchedVoice = voices.find(v => v.lang.includes(preferredLang) || v.lang.startsWith(language));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.pitch = 1.05;
      utterance.rate = 0.9; // Leisurely pacing
      
      utterance.onend = () => {
        setNarratorPlaying(false);
      };
      utterance.onerror = () => {
        setNarratorPlaying(false);
      };
      
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setNarratorPlaying(true);
      showToast(
        "VIP Audio Narrator activated. Relax and listen.",
        "ভিআইপি অডিও ধারাভাষ্যকার চালু হয়েছে।",
        "gold"
      );
    }
  };

  // Clean up voice synthesis on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Property comparison & virtual tour states
  const [comparedProjects, setComparedProjects] = useState<Project[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [virtualTourProject, setVirtualTourProject] = useState<Project | null>(null);

  // Synchronously monitor if any modal is active
  const isAnyModalActive = selectedProject !== null || 
                           active3DProject !== null || 
                           adminOpen || 
                           careerApplyJob !== null || 
                           showCompareModal || 
                           virtualTourProject !== null;

  // Browser back button popstate intercepts to close modals and return to main home screen
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isAnyModalActive) {
        // Reset all modal states to return to home view
        setSelectedProject(null);
        setActive3DProject(null);
        setAdminOpen(false);
        setCareerApplyJob(null);
        setShowCompareModal(false);
        setVirtualTourProject(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAnyModalActive]);

  // Push history state whenever a modal is opened, pop it on manual close
  const prevModalActiveRef = React.useRef(false);
  useEffect(() => {
    if (isAnyModalActive && !prevModalActiveRef.current) {
      window.history.pushState({ modalOpen: true }, "");
    } else if (!isAnyModalActive && prevModalActiveRef.current) {
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    }
    prevModalActiveRef.current = isAnyModalActive;
  }, [isAnyModalActive]);

  const handleToggleCompare = (project: Project) => {
    setComparedProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      if (exists) {
        showToast(
          `Removed "${project.name}" from comparison list.`,
          `তুলনা তালিকা থেকে "${project.nameBn}" বাদ দেওয়া হয়েছে।`,
          "info"
        );
        return prev.filter(p => p.id !== project.id);
      }
      if (prev.length >= 3) {
        showToast(
          `Comparison queue is full. Max capacity is 3 properties.`,
          `তুলনা তালিকা পূর্ণ। সর্বোচ্চ ৩টি প্রজেক্ট একসাথে তুলনা করা সম্ভব।`,
          "warning"
        );
        return prev; // Cap of 3
      }
      showToast(
        `Added "${project.name}" to comparison list.`,
        `তুলনা তালিকায় "${project.nameBn}" যুক্ত করা হয়েছে।`,
        "gold"
      );
      return [...prev, project];
    });
  };
  

  // About Section Project Image Slider State
  const [aboutProjectSlide, setAboutProjectSlide] = useState(0);

  // Auto-play the about section slide
  useEffect(() => {
    const timer = setInterval(() => {
      setAboutProjectSlide((prev) => (prev + 1) % 10);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = React.useMemo(() => {
    if (webConfig.heroSlides && webConfig.heroSlides.length > 0) {
      return webConfig.heroSlides;
    }
    return [
      {
        image: uxSettings.heroBgUrl || "/uploads/project 1.webp",
        titleBn: uxSettings.heroTitleBn || "স্থাপত্যের শ্রেষ্ঠত্ব ও আধুনিক নকশা",
        title: uxSettings.heroTitleEn || "Architectural Excellence & Modern Design",
        subtitle: "Mollik Builders Premium",
        subtitleBn: "মল্লিক বিল্ডার্স প্রিমিয়াম",
        description: uxSettings.heroSubEn || "Designed with clean structural aesthetics, optimal natural light ventilation, and maximum space utility.",
        descriptionBn: uxSettings.heroSubBn || "পরিষ্কার নান্দনিক গঠন, সর্বোচ্চ প্রাকৃতিক আলো-বাতাস চলাচল এবং পর্যাপ্ত জায়গা উপযোগী নকশা।"
      },
      {
        image: "/uploads/Project 2.webp",
        titleBn: "শহুরে অভিজাত জীবনযাত্রার নতুন সংজ্ঞা",
        title: "The Art of Luxurious Urban Living",
        subtitle: "Quiet Luxury Residences",
        subtitleBn: "শান্ত ও অভিজাত আবাসন",
        description: "Experience structural mastery paired with quiet, natural luxury in the heart of Dhaka.",
        descriptionBn: "ঢাকার হৃদয়ে মনোরম প্রকৃতির ছোঁয়ায় বিলাসবহুল ও সুরক্ষিত আবাসন।"
      },
      {
        image: "/uploads/project 3.webp",
        titleBn: "পরিবেশবান্ধব ও সবুজ আবাসন",
        title: "Sustainable Eco-Friendly High-Rises",
        subtitle: "Eco-conscious Construction",
        subtitleBn: "পরিবেশ সচেতন নির্মাণ",
        description: "Engineered to withstand extreme seismic loads while supporting verdant green landscaping features.",
        descriptionBn: "ভূমিকম্প সহনশীল শক্তিশালী কাঠামো এবং দৃষ্টিনন্দন ঝুলন্ত সুবজের এক চমৎকার সমন্বয়।"
      },
      {
        image: "/uploads/project 8.webp",
        titleBn: "অত্যাধুনিক স্ট্রাকচারাল ইঞ্জিনিয়ারিং",
        title: "State-of-the-Art Structural Engineering",
        subtitle: "RAJUK Approved Blueprint",
        subtitleBn: "রাজউক অনুমোদিত ব্লু-প্রিন্ট",
        description: "Flawlessly implemented designs matching international BNBC standards and RAJUK requirements.",
        descriptionBn: "আন্তর্জাতিক বিএনবিসি মানদণ্ড এবং রাজউক অনুমোদন মেনে নিখুঁত নির্মাণ।"
      },
      {
        image: "/uploads/project 9.webp",
        titleBn: "এক্সক্লুসিভ লেআউট ও ফ্লোর প্ল্যান",
        title: "Exclusive Layouts & Floor Plans",
        subtitle: "Smart Space Optimization",
        subtitleBn: "স্মার্ট স্পেস অপ্টিমাইজেশন",
        description: "Meticulously crafted rooms designed to maximize comfort, privacy, and absolute visual peace.",
        descriptionBn: "আপনার পরিবারের গোপনীয়তা, স্বাচ্ছন্দ্য এবং চোখের আরামের জন্য যত্নসহকারে তৈরি করা ফ্লোর প্ল্যান।"
      }
    ];
  }, [uxSettings, webConfig]);

  // Auto-play interval for slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // WhatsApp 10-second inactivity notification trigger
  const [showWhatsAppBadge, setShowWhatsAppBadge] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      if (!showWhatsAppBadge) {
        timeoutId = setTimeout(() => {
          setShowWhatsAppBadge(true);
        }, 10000); // 10 seconds of general user inactivity
      }
    };

    // Tracking mouse movement, keyboard, scroll, and click actions as activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    // Bootstrap timing
    resetInactivityTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, [showWhatsAppBadge]);

  // Filter & Search Properties States (restored from persistent localStorage)
  const [searchLocation, setSearchLocation] = useState(() => {
    try {
      return localStorage.getItem("searchLocation") || "";
    } catch (_) {
      return "";
    }
  });
  const [searchType, setSearchType] = useState("");
  const [searchBudget, setSearchBudget] = useState(() => {
    try {
      return localStorage.getItem("searchBudget") || "";
    } catch (_) {
      return "";
    }
  });
  const [searchSize, setSearchSize] = useState(() => {
    try {
      return localStorage.getItem("searchSize") || "";
    } catch (_) {
      return "";
    }
  });
  const [filterSwimmingPool, setFilterSwimmingPool] = useState(false);
  const [filterGym, setFilterGym] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [filteredProjectsList, setFilteredProjectsList] = useState<Project[]>(customizedProjectList);

  // States for predictive live-matches autocompletions & skeleton loaders
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<string[]>([]);

  // Save user search filter preferences to local storage
  useEffect(() => {
    try {
      localStorage.setItem("searchLocation", searchLocation);
    } catch (_) {}
  }, [searchLocation]);

  useEffect(() => {
    try {
      localStorage.setItem("searchBudget", searchBudget);
    } catch (_) {}
  }, [searchBudget]);

  useEffect(() => {
    try {
      localStorage.setItem("searchSize", searchSize);
    } catch (_) {}
  }, [searchSize]);

  // Compute predictive location search suggestions dynamically
  useEffect(() => {
    if (!searchLocation || searchLocation.trim().length === 0) {
      setSuggestionsList([]);
      return;
    }
    const cleanQuery = searchLocation.toLowerCase().trim();
    const suggestionsSet = new Set<string>();

    customizedProjectList.forEach(p => {
      // Name matches
      if (p.name.toLowerCase().includes(cleanQuery)) {
        suggestionsSet.add(p.name);
      }
      if (p.nameBn && p.nameBn.includes(cleanQuery)) {
        suggestionsSet.add(p.nameBn);
      }

      // Location parts matches
      const parts = (p.location || "").split(",").map(part => part.trim());
      parts.forEach(part => {
        if (part.toLowerCase().includes(cleanQuery)) {
          suggestionsSet.add(part);
        }
      });
      if (p.location && p.location.toLowerCase().includes(cleanQuery)) {
        suggestionsSet.add(p.location);
      }

      const partsBn = (p.locationBn || "").split(",").map(part => part.trim());
      partsBn.forEach(part => {
        if (part.includes(cleanQuery)) {
          suggestionsSet.add(part);
        }
      });
      if (p.locationBn && p.locationBn.includes(cleanQuery)) {
        suggestionsSet.add(p.locationBn);
      }
    });

    setSuggestionsList(Array.from(suggestionsSet).slice(0, 5));
  }, [searchLocation, customizedProjectList]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let result = customizedProjectList;

    if (searchLocation) {
      result = result.filter(p => p.location.toLowerCase().includes(searchLocation.toLowerCase()) || p.name.toLowerCase().includes(searchLocation.toLowerCase()));
    }
    if (searchType) {
      result = result.filter(p => p.type === searchType);
    }
    if (searchBudget) {
      // Map simplified filters
      if (searchBudget === "1") result = result.filter(p => p.price.includes("Lac") || p.price.includes("60"));
      if (searchBudget === "2") result = result.filter(p => p.price.includes("72") || p.price.includes("85") || p.price.includes("95"));
      if (searchBudget === "3") result = result.filter(p => p.price.includes("1.2") || p.price.includes("Crore") || p.price.includes("BDT"));
    }
    if (searchSize) {
      if (searchSize === "1") result = result.filter(p => p.size.includes("1200") || p.size.includes("1300") || p.size.includes("1450"));
      if (searchSize === "2") result = result.filter(p => p.size.includes("1600") || p.size.includes("1800") || p.size.includes("2000"));
      if (searchSize === "3") result = result.filter(p => p.size.includes("3000") || p.size.includes("3500"));
    }

    if (filterSwimmingPool) {
      result = result.filter(p => 
        p.amenities?.some(a => a.toLowerCase().includes("pool") || a.toLowerCase().includes("swim") || a.toLowerCase().includes("jacuzzi"))
      );
    }
    if (filterGym) {
      result = result.filter(p => 
        p.amenities?.some(a => a.toLowerCase().includes("gym") || a.toLowerCase().includes("fit") || a.toLowerCase().includes("health"))
      );
    }
    if (filterParking) {
      result = result.filter(p => 
        p.amenities?.some(a => a.toLowerCase().includes("parking") || a.toLowerCase().includes("garage") || a.toLowerCase().includes("car") || a.toLowerCase().includes("lift")) ||
        p.specs?.some(s => s.label.toLowerCase().includes("parking") || s.value.toLowerCase().includes("parking") || s.value.toLowerCase().includes("slot") || s.value.toLowerCase().includes("bays"))
      );
    }

    setFilteredProjectsList(result);
    // Smooth scroll to project list if form manually submitted
    if (e) {
      document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Run search reactively with beautiful skeleton animation simulator
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      handleSearch();
      setIsSearching(false);
    }, 450); // 450ms simulated background database index query processing
    return () => clearTimeout(timer);
  }, [searchLocation, searchType, searchBudget, searchSize, filterSwimmingPool, filterGym, filterParking, customizedProjectList]);

  // Scroll restoration after project search finishes
  useEffect(() => {
    if (!isSearching) {
      const scrollProjectId = sessionStorage.getItem("scroll_to_project_id");
      if (scrollProjectId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`project-card-${scrollProjectId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            sessionStorage.removeItem("scroll_to_project_id");
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isSearching]);

  // Forms Submissions
  const [visitName, setVisitName] = useState("");
  const [visitPhone, setVisitPhone] = useState("");
  const [visitEmail, setVisitEmail] = useState("");
  const [visitProj, setVisitProj] = useState("");
  const [visitType, setVisitType] = useState("");
  const [visitBudget, setVisitBudget] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitSuccess, setVisitSuccess] = useState(false);

  const handleBookVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName || !visitPhone) {
      console.warn("Name and Phone Number are required.");
      return;
    }

    const payload = {
      name: visitName,
      phone: visitPhone,
      email: visitEmail,
      project: visitProj || "General Inquiry",
      propertyType: visitType || "Apartment",
      budget: visitBudget || "Not Spec’d",
      preferredDate: visitDate || "Anytime",
      message: visitMessage
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "visit", data: payload })
      });
      if (res.ok) {
        setVisitSuccess(true);
        setLeadCounter(prev => prev + 1);
        showToast(
          "Tour Scheduled! Our Guest Registry is locked. We will contact you shortly.",
          "ভিজিট বুকিং নিশ্চিত করা হয়েছে! খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।",
          "success"
        );
        setTimeout(() => {
          setVisitSuccess(false);
          setVisitName("");
          setVisitPhone("");
          setVisitEmail("");
          setVisitProj("");
          setVisitType("");
          setVisitBudget("");
          setVisitMessage("");
          setVisitDate("");
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not submit booking request at this time.", "এই মুহূর্তে বুকিং রিকোয়েস্ট সাবমিট করা যাচ্ছে না।", "warning");
    }
  };

  // Landowners Form States
  const [landName, setLandName] = useState("");
  const [landPhone, setLandPhone] = useState("");
  const [landEmail, setLandEmail] = useState("");
  const [landLoc, setLandLoc] = useState("");
  const [landSize, setLandSize] = useState("");
  const [landRoadWidth, setLandRoadWidth] = useState("");
  const [landStatus, setLandStatus] = useState("Joint Venture Proposal");
  const [landSuccess, setLandSuccess] = useState(false);

  const handleLandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landName || !landPhone || !landLoc) {
      console.warn("Name, Phone, and Land location are mandatory.");
      return;
    }

    const payload = {
      name: landName,
      phone: landPhone,
      email: landEmail,
      location: landLoc,
      landSize: landSize,
      roadWidth: landRoadWidth,
      status: landStatus
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "land", data: payload })
      });
      if (res.ok) {
        setLandSuccess(true);
        setLeadCounter(prev => prev + 1);
        showToast(
          "Landowner Registration recorded. High-priority callback initiated.",
          "ল্যান্ডওনার পার্টনারশিপ প্রস্তাব জমা হয়েছে। অগ্রাধিকার ভিত্তিতে কলব্যাক করা হবে।",
          "success"
        );
        setTimeout(() => {
          setLandSuccess(false);
          setLandName("");
          setLandPhone("");
          setLandEmail("");
          setLandLoc("");
          setLandSize("");
          setLandRoadWidth("");
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not record partnership request at this time.", "এই মুহূর্তে প্রস্তাবটি নিবন্ধন করা সম্ভব হয়নি।", "warning");
    }
  };

  // Newsletter Submit State
  const [newsEmail, setNewsEmail] = useState("");
  const [newsSuccess, setNewsSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", data: { email: newsEmail } })
      });
      if (res.ok) {
        setNewsSuccess(true);
        setNewsEmail("");
        setLeadCounter(prev => prev + 1);
        showToast(
          "Subscribed! Welcome to Apex Estates Privilege Newsletter.",
          "সংবাদপত্র ও হেরিটেজ অফার সাবস্ক্রিপশন সম্পন্ন হয়েছে।",
          "success"
        );
        setTimeout(() => setNewsSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
      showToast("Subscription error. Try again later.", "নিউজলেটার সাবস্ক্রিপশন সমস্যা হয়েছে।", "warning");
    }
  };

  // Career Form States
  const [careerName, setCareerName] = useState("");
  const [careerPhone, setCareerPhone] = useState("");
  const [careerEmail, setCareerEmail] = useState("");
  const [careerCvName, setCareerCvName] = useState("");
  const [careerCover, setCareerCover] = useState("");
  const [careerSuccess, setCareerSuccess] = useState(false);

  const handleCareerApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerName || !careerPhone) {
      console.warn("Name and Phone Number are required.");
      return;
    }

    const payload = {
      jobId: careerApplyJob,
      applicantName: careerName,
      phone: careerPhone,
      email: careerEmail,
      cvAttached: careerCvName || "Applicant_CV_Digital_Submit.pdf",
      coverLetter: careerCover
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "career", data: payload })
      });
      if (res.ok) {
        setCareerSuccess(true);
        setLeadCounter(prev => prev + 1);
        showToast(
          "Application Successful! HR department has logged your CV.",
          "আবেদন সফল হয়েছে! আমাদের এইচআর ইউনিট আপনার প্রফাইল রিভিউ করবে।",
          "success"
        );
        setTimeout(() => {
          setCareerSuccess(false);
          setCareerApplyJob(null);
          setCareerName("");
          setCareerPhone("");
          setCareerEmail("");
          setCareerCvName("");
          setCareerCover("");
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      showToast("Application submission error.", "আবেদন সফলভাবে সাবমিট করা যায়নি।", "warning");
    }
  };

  // Video Testimonial Player Modal state
  const [videoOpen, setVideoOpen] = useState(false);

  // Accordion FAQ logic
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Toggle FAQ Index
  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(activeFaqIdx === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-neutral-800 selection:bg-[#C8A165]/30">
      <style>{`
        :root {
          --primary-color: ${uxSettings.primaryColor || "#1B4D3E"};
          --accent-color: ${uxSettings.accentColor || "#C8A165"};
          --dark-bg-color: ${uxSettings.darkBgColor || "#141615"};
          --light-bg-color: ${uxSettings.lightBgColor || "#FAFAFA"};
          --custom-font: "${uxSettings.customFont || "Inter"}", sans-serif;
        }
        
        body, h1, h2, h3, h4, h5, h6, p, span, button, input, textarea, select {
          font-family: var(--custom-font) !important;
        }

        /* Catch in-line specific tailwind hex classes and replace with root variables */
        [class*="bg-[#1B4D3E]"], [class*="hover:bg-[#1B4D3E]:hover"] { background-color: var(--primary-color) !important; }
        [class*="text-[#1B4D3E]"], [class*="hover:text-[#1B4D3E]:hover"] { color: var(--primary-color) !important; }
        [class*="border-[#1B4D3E]"] { border-color: var(--primary-color) !important; }
        [class*="fill-[#1B4D3E]"] { fill: var(--primary-color) !important;_ }
        
        [class*="bg-[#C8A165]"], [class*="hover:bg-[#C8A165]:hover"] { background-color: var(--accent-color) !important; }
        [class*="text-[#C8A165]"], [class*="hover:text-[#C8A165]:hover"] { color: var(--accent-color) !important; }
        [class*="border-[#C8A165]"] { border-color: var(--accent-color) !important; }
        [class*="fill-[#C8A165]"] { fill: var(--accent-color) !important; }
        
        [class*="bg-[#141615]"] { background-color: var(--dark-bg-color) !important; }
        [class*="text-[#141615]"] { color: var(--dark-bg-color) !important; }
        [class*="border-[#141615]"] { border-color: var(--dark-bg-color) !important; }
      `}</style>

      {/* Dynamic Font Loader Link */}
      {uxSettings.customFont && (
        <link 
          rel="stylesheet" 
          href={`https://fonts.googleapis.com/css2?family=${uxSettings.customFont.replace(" ", "+")}:wght@300;400;500;600;700;800&display=swap`} 
        />
      )}
      
      {/* 1_HEADER_NAVIGATION */}
      {/* Top Bar info */}
      <div className="bg-[#181A19] text-neutral-300 text-[10px] sm:text-[11px] px-4 md:px-12 py-2 flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-4 border-b border-neutral-800">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="flex items-center gap-1.5 align-middle font-medium">
            <Phone className="w-3.5 h-3.5 text-[#C8A165]" />
            <span><span className="hidden sm:inline">{language === "en" ? "Founder & MD Hot-line: " : "প্রতিষ্ঠাতা ও এমডি হটলাইন: "}</span>+880 1715-120802</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 align-middle font-medium">
            <Mail className="w-3.5 h-3.5 text-[#C8A165]" />
            founder@mollikbuilders.com
          </span>
          <span className="hidden md:flex items-center gap-1.5 align-middle font-medium">
            <Clock className="w-3.5 h-3.5 text-[#C8A165]" />
            {language === "en" ? "Sat-Thu 9AM-7PM" : "শনিবার-বৃহস্পতিবার সকাল ৯টা-সন্ধ্যা ৭টা"}
          </span>
        </div>

        <div className="flex gap-4 items-center">
          {/* Dhaka Live Weather Widget */}
          <div className="hidden md:flex">
            <DhakaWeatherWidget language={language} />
          </div>

          {/* Mollik Prestige Loyalty Badge */}
          <div className="hidden xs:flex">
            <MollikPrestigeBadge language={language} />
          </div>

          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-[#C8A165]/50 text-white font-bold transition-all text-[11px] rounded uppercase cursor-pointer tracking-wider"
          >
            <Globe className="w-3 h-3 text-[#C8A165]" />
            {language === "en" ? "বাংলা" : "English"}
          </button>

          {/* Social Icons */}
          <div className="hidden sm:flex items-center gap-2">
            <a href="https://www.facebook.com/share/18qYYKv2Eg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8A165] transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-[#C8A165] transition-colors"><Youtube className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-[#C8A165] transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-[#C8A165] transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </div>

      {/* Main Bar Navigation */}
      <header className="sticky top-0 bg-[#141615]/75 backdrop-blur-lg border-b border-[#C8A165]/15 z-40 transition-all shadow-lg">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-12 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0 w-full">
          
          {/* Logo with clean elegant typography */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setSelectedProject(null);
              setActive3DProject(null);
              setAdminOpen(false);
              setCareerApplyJob(null);
              setShowCompareModal(false);
              setVirtualTourProject(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center shrink min-w-0"
          >
            <LuxuryLogo variant="gold" language={language} />
          </a>

          {/* Large Desktop Navigation Menu Items */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-[11px] font-bold uppercase tracking-widest text-neutral-300">
            {[
              { href: "#", text: "Home", textBn: "হোম" },
              { href: "#projects", text: "Projects", textBn: "প্রজেক্ট তালিকা" },
              { href: "#floorplan", text: "Floor Plans", textBn: "ফ্লোর প্ল্যান" },
              { href: "#builder", text: "B2B Console", textBn: "ডেভেলপার হাব" },
              { href: "#contact", text: "Contact", textBn: "যোগাযোগ" }
            ].map((link, idx) => (
              <a 
                key={`nav-link-${idx}`}
                href={link.href} 
                className="relative group py-1.5 hover:text-white transition-colors duration-300"
              >
                {language === "en" ? link.text : link.textBn}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C8A165] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#book-visit"
              className="relative px-5 py-2.5 bg-[#C8A165] hover:bg-[#b28b55] text-neutral-950 text-[11px] font-black uppercase tracking-widest transition-all rounded shadow hover:shadow-lg focus:ring-2 focus:ring-[#C8A165] overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              {language === "en" ? "Book a Visit" : "ভিজিট বুক করুন"}
            </a>
          </div>

          {/* Hamburger Icon for Mobile view */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 bg-neutral-900 hover:bg-neutral-850 rounded cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C8A165]" /> : <Menu className="w-5 h-5 text-[#C8A165]" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-[#141615]/98 border-b border-[#C8A165]/20 p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-neutral-300 overflow-hidden"
            >
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "About" : "আমাদের তথ্য"}</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Projects" : "প্রজেক্ট তালিকা"}</a>
              <a href="#floorplan" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Floor Plans" : "ফ্লোর প্ল্যান"}</a>
              <a href="#amenities" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Amenities" : "সুবিধাসমূহ"}</a>
              <a href="#landowners" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Landowners" : "ভূমির মালিক"}</a>
              <a href="#builder" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "B2B Console" : "ডেভেলপার হাব"}</a>
              <a href="#careers" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Careers" : "চাকরি"}</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A165]">{language === "en" ? "Contact" : "যোগাযোগসমূহ"}</a>
              
              <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
                <button
                  onClick={() => { setAdminOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 border border-dashed border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded text-center"
                >
                  {language === "en" ? "Admin Console Leads" : "অ্যাডমিন লিড লিস্ট"}
                </button>
                <a
                  href="#book-visit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#C8A165] text-neutral-950 font-black rounded text-center tracking-wider"
                >
                  {language === "en" ? "Book a Visit" : "ভিজিট বুক করুন"}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Golden Luxurious Scroll Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#C8A165] via-[#E5C185] to-[#1B4D3E] origin-left z-50 pointer-events-none" 
          style={{ scaleX }}
        />
      </header>


      {/* 2_HERO_SECTION */}
      {/* Dynamic continuous background transition slider */}
      <section className="relative w-full h-[85vh] sm:h-[80vh] bg-neutral-900 overflow-hidden flex items-center">
        {/* Active Slide Image with Cinematic Motion */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0 origin-center"
          >
            <img 
              src={slides[currentSlide].image} 
              alt="Mollik Builders Premium Residential" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-950/65 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay with Scrolling Storytelling Typography */}
        <motion.div 
          style={{ y: heroTextY, opacity: heroTextAlpha }}
          className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 w-full text-white space-y-6"
        >
          <div className="max-w-3xl space-y-5">
            
            {/* Elegant thread pre-headline instead of simple card-badge */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ x: heroLeftSlide }}
                className="flex items-center gap-3"
              >
                <span className="h-[1px] w-6 bg-[#C8A165]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] text-[#C8A165] uppercase font-bold">
                  {language === "en" ? slides[currentSlide].subtitle : slides[currentSlide].subtitleBn}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Main title heading with storytelling typography */}
            <AnimatePresence mode="popLayout">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-[5.5rem] font-serif font-bold tracking-tight text-white leading-[1.1] text-shadow"
              >
                {renderStoryText(language === "en" ? slides[currentSlide].title : slides[currentSlide].titleBn, language === "bn")}
              </motion.h1>
            </AnimatePresence>

            {/* Description subtitle with slide-fade */}
            <AnimatePresence mode="popLayout">
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
                style={{ x: heroRightSlide }}
                className="text-sm sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl italic border-l-2 border-[#C8A165]/40 pl-4 py-1"
              >
                {language === "en" ? slides[currentSlide].description : slides[currentSlide].descriptionBn}
              </motion.p>
            </AnimatePresence>

            {/* Action buttons with elegant entry animation */}
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={`btns-${currentSlide}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                className="flex flex-wrap gap-4 items-center"
              >
                <a
                  href="#projects"
                  className="px-6 py-3 bg-[#C8A165] hover:bg-[#B79054] text-neutral-950 text-xs font-black uppercase tracking-widest rounded transition-all duration-300 shadow-lg"
                >
                  {language === "en" ? "Explore Portfolio" : "প্রজেক্টসমূহ দেখুন"}
                </a>
                <a
                  href="#book-visit"
                  className="px-6 py-3 border border-white hover:bg-white hover:text-neutral-950 text-white text-xs font-black uppercase tracking-widest rounded transition-all duration-300"
                >
                  {language === "en" ? "Book a Consultation" : "পরামর্শ বুক করুন"}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* 3_SEARCH_BAR_SECTION */}
      <section className="relative -mt-10 z-30 max-w-7xl mx-auto px-4 md:px-12">
        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-xl shadow-xl border border-neutral-150 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location input */}
          <div>
            <label className="block text-[9.5px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5 select-none">
              {language === "en" ? "Location / Project" : "অবস্থান / প্রজেক্ট"}
            </label>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder={language === "en" ? "Search locations..." : "অবস্থান খুঁজুন..."}
              className="w-full text-xs font-semibold bg-neutral-50 px-3 py-2.5 rounded border border-neutral-200 text-neutral-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C8A165]/35 focus:border-[#C8A165]"
            />
          </div>

          {/* Property Type select */}
          <div>
            <label className="block text-[9.5px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5 select-none">
              {language === "en" ? "Property Type" : "প্রপার্টি ধরন"}
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full text-xs font-semibold bg-neutral-50 px-3 py-2.5 rounded border border-neutral-200 text-neutral-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C8A165]/35 focus:border-[#C8A165]"
            >
              <option value="">{language === "en" ? "Select Type" : "টাইপ সিলিক্ট করুন"}</option>
              <option value="Residential">{language === "en" ? "Residential" : "আবাসিক"}</option>
              <option value="Commercial">{language === "en" ? "Commercial" : "বাণিজ্যিক"}</option>
              <option value="Duplex">{language === "en" ? "Duplex" : "ডুপ্লেক্স"}</option>
              <option value="Penthouse">{language === "en" ? "Penthouse" : "পেন্টহাউস"}</option>
            </select>
          </div>

          {/* Budget Range select */}
          <div>
            <label className="block text-[9.5px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5 select-none">
              {language === "en" ? "Budget Range" : "বাজেট সীমা"}
            </label>
            <select
              value={searchBudget}
              onChange={(e) => setSearchBudget(e.target.value)}
              className="w-full text-xs font-semibold bg-neutral-50 px-3 py-2.5 rounded border border-neutral-200 text-neutral-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C8A165]/35 focus:border-[#C8A165]"
            >
              <option value="">{language === "en" ? "Select Budget" : "বাজেট সিলিক্ট করুন"}</option>
              <option value="1">{language === "en" ? "Under ৳70 Lac" : "৳৭০ লাখের নিচে"}</option>
              <option value="2">{language === "en" ? "৳70 Lac - ৳1 Crore" : "৳৭০ লাখ - ৳১ কোটি"}</option>
              <option value="3">{language === "en" ? "Over ৳1 Crore" : "৳১ কোটির উপরে"}</option>
            </select>
          </div>

          {/* Size Range select */}
          <div>
            <label className="block text-[9.5px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5 select-none">
              {language === "en" ? "Apartment Size" : "অ্যাপার্টমেন্ট সাইজ"}
            </label>
            <select
              value={searchSize}
              onChange={(e) => setSearchSize(e.target.value)}
              className="w-full text-xs font-semibold bg-neutral-50 px-3 py-2.5 rounded border border-neutral-200 text-neutral-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C8A165]/35 focus:border-[#C8A165]"
            >
              <option value="">{language === "en" ? "Select Size" : "সাইজ সিলিক্ট করুন"}</option>
              <option value="1">1000 - 1500 sqft</option>
              <option value="2">1500 - 2500 sqft</option>
              <option value="3">2500sqft - 3500+ sqft</option>
            </select>
          </div>

          {/* Submit Search properties */}
          <div className="flex flex-col justify-end h-full">
            <button
              type="submit"
              className="relative overflow-hidden group w-full py-2.5 bg-[#1B4D3E] hover:bg-[#143d31] text-[#C8A165] font-black text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#1B4D3E]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              {language === "en" ? "Search properties" : "প্রপার্টি খুঁজুন"}
            </button>
          </div>

          {/* Amenities Filters (Swimming Pool, Gym, Parking) - Spanning across all grid columns */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5 pt-4 border-t border-neutral-100 mt-2">
            <span className="block text-[10px] font-bold text-[#1B4D3E] uppercase tracking-widest mb-3 select-none">
              {language === "en" ? "Filter by Premium Amenities" : "প্রিমিয়াম সুযোগ-সুবিধা অনুযায়ী ফিল্টার করুন"}
            </span>
            <div className="flex flex-wrap gap-5 sm:gap-8 items-center bg-neutral-50/50 p-3 rounded-lg border border-neutral-200/40">
              {/* Swimming Pool Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={filterSwimmingPool}
                  onChange={(e) => setFilterSwimmingPool(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filterSwimmingPool 
                    ? "bg-[#C8A165] border-[#C8A165] text-neutral-900" 
                    : "border-neutral-300 group-hover:border-neutral-450 bg-white"
                }`}>
                  {filterSwimmingPool && (
                    <svg className="w-2.5 h-2.5 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {language === "en" ? "🏊‍♂️ Swimming Pool" : "🏊‍♂️ সুইমিং পুল"}
                </span>
              </label>

              {/* Gym Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={filterGym}
                  onChange={(e) => setFilterGym(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filterGym 
                    ? "bg-[#C8A165] border-[#C8A165] text-neutral-900" 
                    : "border-neutral-300 group-hover:border-neutral-450 bg-white"
                }`}>
                  {filterGym && (
                    <svg className="w-2.5 h-2.5 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {language === "en" ? "🏋️‍♀️ Gymnasium" : "🏋️‍♀️ ফিটনেস জিম"}
                </span>
              </label>

              {/* Parking Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={filterParking}
                  onChange={(e) => setFilterParking(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filterParking 
                    ? "bg-[#C8A165] border-[#C8A165] text-neutral-900" 
                    : "border-neutral-300 group-hover:border-neutral-450 bg-white"
                }`}>
                  {filterParking && (
                    <svg className="w-2.5 h-2.5 stroke-current stroke-[3px] fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {language === "en" ? "🚗 Secure Parking" : "🚗 পার্কিং সুবিধা"}
                </span>
              </label>

              {/* Reset Active Filters Button */}
              {(filterSwimmingPool || filterGym || filterParking || searchLocation || searchType || searchBudget || searchSize) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchLocation("");
                    setSearchType("");
                    setSearchBudget("");
                    setSearchSize("");
                    setFilterSwimmingPool(false);
                    setFilterGym(false);
                    setFilterParking(false);
                  }}
                  className="ml-auto text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline uppercase tracking-wider cursor-pointer font-sans"
                >
                  {language === "en" ? "Clear Filter Criteria" : "সব ফিল্টার মুছুন"}
                </button>
              )}
            </div>
          </div>
        </form>
      </section>


      {/* 11_CHAIRMAN_MESSAGE_SECTION */}
      <section className="py-14 bg-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 md:px-12 relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side Chairman Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
                <img 
                  src={chairmanImg} 
                  alt="Saheb Ali Mollik - Chairman" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#C8A165] text-neutral-950 font-mono text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-lg">
                {language === "en" ? "Founder & Chairman" : "প্রতিষ্ঠাতা ও চেয়ারম্যান"}
              </div>
            </motion.div>

            {/* Right side Chairman details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-serif font-black text-[#1B4D3E]">
                  {language === "en" ? "A Message of Faith & Structural Longevity" : "বিশ্বস্ততা ও সুদীর্ঘস্থায়ী কাঠামোর বার্তা"}
                </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A165]/10 rounded-full text-xs font-semibold text-[#1B4D3E] border border-[#C8A165]/20">
                    <Award className="w-3.5 h-3.5 text-[#C8A165]" />
                    <span>
                      {language === "en" ? "Building Genuine Legacy Since 1999" : "১৯৯৯ সাল থেকে আস্থার সাথে নির্মাণাধীন"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-150 pt-6 space-y-6">
                  {/* Styled blockquote with decorative background accent */}
                  <div className="relative bg-[#FAF9F5] p-6 rounded-2xl border border-[#C8A165]/20 shadow-xs">
                    <span className="absolute top-2 right-4 text-5xl font-serif text-[#C8A165]/20 select-none">“</span>
                    <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-light italic relative z-10">
                      {language === "en" 
                        ? `"${webConfig.founderBio || "In real estate, safety isn't an option—it is an absolute corporate contract. Every project we curate represents 72.5 grade steel reinforcements, structural calculations drafted to survive magnitude 7.5 earthquakes, and completely pristine, transparent land ownership documentation verified up to 4 generations."}"`
                        : `"${webConfig.founderBioBn || "রিয়েল এস্টেটে নিরাপত্তা কোনো আপস নয়—এটি একটি দৃঢ় সামাজিক অঙ্গীকার। প্রতিটি প্রজেক্টে আমরা ব্যবাহার করি ৭২.৫ গ্রেডেড ইস্পাত এবং প্রতিটি নকশা করা হয় রিখটার স্কেলে ৭.৫ মাত্রার ভূমিকম্প সহনশীল করে। সেই সাথে শতভাগ নির্ভেজাল জমির আইনি কাগজপত্র আমরা নিশ্চিত করি চার প্রজন্ম পর্যন্ত।"}"`}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-800">
                          {language === "en" ? webConfig.founderName : webConfig.founderNameBn}
                        </p>
                        <p className="text-[10px] text-[#C8A165] font-mono uppercase tracking-wider">
                          {language === "en" ? "Chairman & MD Office" : "চেয়ারম্যান ও ব্যবস্থাপনা পরিচালক"}
                        </p>
                      </div>
                      
                      {/* Decorative Handwriting Signature Visual Simulation */}
                      <div className="font-serif italic text-base md:text-lg text-[#1B4D3E]/80 tracking-widest font-black select-none pointer-events-none pr-2">
                        {language === "en" ? "Saheb Ali Mollik" : "মোঃ সাহেব আলী মল্লিক"}
                      </div>
                    </div>
                  </div>

                  {/* Founder Direct Contact Info Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F5] p-5 rounded-2xl border border-[#C8A165]/20 shadow-xs mt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#1B4D3E]/5 text-[#1B4D3E] border border-[#1B4D3E]/10">
                        <Phone className="w-4 h-4 text-[#C8A165]" />
                      </div>
                      <div>
                        <span className="block text-[8.5px] font-mono font-bold text-neutral-450 uppercase tracking-wider leading-none">
                          {language === "en" ? "Direct Dial Hotline" : "সরাসরি হটলাইন নম্বর"}
                        </span>
                        <a href="tel:+8801715120802" className="text-[11px] font-bold text-[#1B4D3E] hover:text-[#C8A165] transition-colors font-mono mt-1 block">
                          +880 1715-120802
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#C8A165]/10 text-[#C8A165] border border-[#C8A165]/20">
                        <Mail className="w-4 h-4 text-[#1B4D3E]" />
                      </div>
                      <div>
                        <span className="block text-[8.5px] font-mono font-bold text-neutral-450 uppercase tracking-wider leading-none">
                          {language === "en" ? "Corporate Secretariat" : "কর্পোরেট ইমেইল"}
                        </span>
                        <a href="mailto:mollikbuilders.bd1@gmail.com" className="text-[11px] font-bold text-[#1B4D3E] hover:text-[#C8A165] transition-colors font-mono mt-1 block">
                          mollikbuilders.bd1@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Gilded Pillars of Construction Quality */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-3xs flex flex-col gap-2 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1B4D3E]/5 flex items-center justify-center text-[#1B4D3E]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                        {language === "en" ? "72.5 Grade Steel" : "৭২.৫ গ্রেড ইস্পাত"}
                      </h4>
                      <p className="text-[10.5px] text-neutral-500 font-light leading-snug">
                        {language === "en" ? "Highest high-tensile strength standard for absolute seismic deflection." : "সর্বোচ্চ ভূমিকম্প প্রতিরোধ ও নিখুঁত কাঠামোগত নিরাপত্তা।"}
                      </p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-3xs flex flex-col gap-2 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#C8A165]/10 flex items-center justify-center text-[#C8A165]">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                        {language === "en" ? "Transparent Title" : "১০০% আইনি স্বচ্ছতা"}
                      </h4>
                      <p className="text-[10.5px] text-neutral-500 font-light leading-snug">
                        {language === "en" ? "Exhaustive legal audit of pristine chain land deeds back 30+ years." : "৩০ বছরেরও বেশি নিখুঁত জমির রেকর্ড এবং আইনগত সত্যতা।" }
                      </p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-3xs flex flex-col gap-2 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1B4D3E]/5 flex items-center justify-center text-teal-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                        {language === "en" ? "Ultra Insulation" : "সম্পূর্ণ শব্দ প্রতিরোধ"}
                      </h4>
                      <p className="text-[10.5px] text-neutral-500 font-light leading-snug">
                        {language === "en" ? "Dual-pane double glazed sliding sound insulation profiles standard." : "দ্বিগুণ পুরুত্বের কাচ দিয়ে সম্পূর্ণ কোলাহলমুক্ত আবাসন।"}
                      </p>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>


      {/* 4_ABOUT_COMPANY_SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Storyteller image panels */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-neutral-200">
            <img 
              src="/uploads/project 2(1).webp" 
              alt="Mollik Builders Executive Quality" 
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          {/* Accent Gold frame border */}
          <div className="absolute -bottom-6 -right-6 lg:flex flex-col items-center justify-center p-5 bg-[#1B4D3E] text-white rounded-lg shadow-xl border border-[#C8A165]/30 w-44 hidden">
            <span className="font-serif font-black text-2xl text-[#C8A165]">15+</span>
            <span className="text-[10px] font-bold text-center tracking-wider mt-1 uppercase text-neutral-300">
              {language === "en" ? "Years of Trust" : "বিশ্বস্ততার ১৫ বছর"}
            </span>
          </div>
        </motion.div>

        {/* Right Details Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="space-y-6"
        >
          <AnimatedHeading
            align="left"
            subtitle={language === "en" ? "WHO WE ARE" : "আমাদের পরিচিতি"}
            title={language === "en" ? "Building Trust & Crafting Absolute Legacies" : "মল্লিক বিল্ডার্স — আস্থার প্রতীক এবং স্থায়ী মানের মেলবন্ধন"}
          />

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
            {language === "en" 
              ? "Mollik Builders is a leading premium real estate developer in Bangladesh. With over a decade of dedication to civil excellence, we craft sustainable landmark addresses across Dhaka. Each project integrates modern seismic designs, sound isolation, and meticulously organized green foliage. We operate on a foundation of complete transparency — no hidden cost sheets, explicit RAJUK compliance, and guaranteed deadlines."
              : "মল্লিক বিল্ডার্স বাংলাদেশের অন্যতম প্রথম সারির একটি প্রিমিয়াম রিয়েল এস্টেট কোম্পানি। গত এক দশক ধরে আমরা ঢাকার প্রধান প্রধান আবাসন এলাকায় নির্ভরযোগ্য ও ভূমিকম্প প্রতিরোধক ডিজাইনার ভবন বা বাণিজ্যিক ভবন প্রস্তুত করে আসছি। আমাদের প্রতিটি প্রজেক্ট রাজুক কর্তৃক অনুমোদিত এবং সম্পূর্ণ স্বচ্ছ চুক্তির সাথে সঠিক ডেডলাইনে হস্তান্তর করা হয়।"
            }
          </p>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dotted border-neutral-200">
            {[
              { icon: Award, num: "50+", label: "Completed Projects", labelBn: "সম্পন্ন প্রকল্প ৫০+" },
              { icon: Building, num: "20+", label: "Ongoing Projects", labelBn: "চলমান প্রকল্প ২০+" },
              { icon: User, num: "5000+", label: "Happy Families", labelBn: "সুখী পরিবার ৫০০০+" },
              { icon: ShieldCheck, num: "100%", label: "RAJUK Clearances", labelBn: "রাজুক শতভাগ ছাড়পত্র" }
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div key={`highlight-stat-${i}`} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded bg-[#1B4D3E]/5 flex items-center justify-center text-sm">
                    <IconComp className="w-5 h-5 text-[#C8A165]" />
                  </div>
                  <div>
                    <span className="block font-black text-neutral-800 text-sm">{stat.num}</span>
                    <span className="block text-[10px] text-neutral-500 font-bold uppercase">{language === "en" ? stat.label : stat.labelBn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>


      {/* 5, 6, 7_PROJECTS_SECTION */}
      <section id="projects" className="py-14 bg-[#F5F5F3] relative overflow-hidden">
        {/* Architectural grid background lines for a premium developer vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0decb_1px,transparent_1px),linear-gradient(to_bottom,#e0decb_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-[0.12] pointer-events-none select-none" />
        {/* Subtle radial gradient lighting */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#FAF9F5] to-transparent opacity-80 pointer-events-none" />
        
        {/* Floating cinematic golden and emerald light coordinates */}
        <motion.div 
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-5 w-[320px] h-[320px] bg-[#C8A165]/5 rounded-full blur-[80px] pointer-events-none select-none"
        />
        <motion.div 
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 30, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#1B4D3E]/4 rounded-full blur-[90px] pointer-events-none select-none"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 md:px-12 space-y-10 relative z-10"
        >
          
          {/* Header section with category toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
            <div className="space-y-4">
              <AnimatedHeading
                align="left"
                subtitle={language === "en" ? "OUR PORTFOLIO" : "আমাদের প্রিমিয়াম প্রজেক্ট পোর্টফোলিও"}
                title={language === "en" ? "Explore Exclusive Estates" : "ঢাকার ঐতিহ্যবাহী ও অভিজাত আবাসনসমূহ"}
              />
              <p className="text-xs text-neutral-500 max-w-xl">
                {language === "en" ? "Investing in structural safety with high luxury finishes." : "নিরাপদ ভূমিকম্প সহনশীল কাঠামো ও আধুনিক নান্দনিক ডিজাইনে প্রস্তুত।"}
              </p>

              {/* Luxury Dual-Engine Toggle Selector */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  {language === "en" ? "Display Engine:" : "ডিসপ্লে ইঞ্জিন:"}
                </span>
                <div id="engine-selector-group" className="inline-flex rounded-lg bg-neutral-200/60 p-0.5 text-[9px] font-bold tracking-widest uppercase border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setEngineMode("react")}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      engineMode === "react"
                        ? "bg-[#1B4D3E] text-white shadow-sm font-extrabold"
                        : "text-neutral-500 hover:text-neutral-850"
                    }`}
                  >
                    Interactive SPA
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineMode("php")}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      engineMode === "php"
                        ? "bg-[#1B4D3E] text-white shadow-sm font-extrabold"
                        : "text-neutral-500 hover:text-neutral-850"
                    }`}
                    title="Load dynamic PHP rendered catalog page on item select"
                  >
                    Server-Side PHP
                  </button>
                </div>
              </div>
            </div>

            {/* Categorized Tabs Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Properties", labelBn: "সব প্রজেক্ট" },
                { id: "Ongoing", label: "Ongoing", labelBn: "চলমান প্রকল্প" },
                { id: "Completed", label: "Completed", labelBn: "সম্পন্ন প্রকল্প" },
                { id: "Upcoming", label: "Upcoming", labelBn: "আসন্ন প্রকল্প" }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all duration-300 cursor-pointer overflow-hidden border border-neutral-200"
                    style={{ color: isActive ? '#ffffff' : '#4b5563' }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-[#1B4D3E]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{language === "en" ? tab.label : tab.labelBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid list container */}
          <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isSearching ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div 
                  key={`loading-project-${idx}`}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200/60 shadow-sm p-0 flex flex-col justify-between animate-pulse"
                >
                  <div>
                    <div className="aspect-[4/3] bg-neutral-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[pulse_1.5s_infinite]" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex gap-2">
                        <div className="h-4 bg-neutral-200 rounded w-1/4" />
                        <div className="h-4 bg-neutral-200 rounded w-1/3" />
                      </div>
                      <div className="h-6 bg-neutral-200 rounded w-3/4" />
                      <div className="grid grid-cols-2 gap-3 py-3 bg-neutral-50 px-4 rounded-lg border border-neutral-150">
                        <div className="space-y-1">
                          <div className="h-3 bg-neutral-200 rounded w-1/2" />
                          <div className="h-4 bg-neutral-150 rounded w-3/4" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-3 bg-neutral-200 rounded w-1/2" />
                          <div className="h-4 bg-neutral-150 rounded w-3/4" />
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-1.5">
                        <div className="flex justify-between">
                          <div className="h-3 bg-neutral-200 rounded w-1/5" />
                          <div className="h-3 bg-neutral-200 rounded w-1/3" />
                        </div>
                        <div className="w-full bg-neutral-150 h-1.5 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-[44px] bg-neutral-200 rounded-lg" />
                      <div className="h-[44px] bg-neutral-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-[44px] bg-neutral-200 rounded-lg" />
                      <div className="h-[44px] bg-neutral-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProjectsList.filter(p => activeTab === "all" || p.status.includes(activeTab) || p.status === activeTab).length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 px-6 text-center bg-white rounded-xl border border-dashed border-neutral-200 flex flex-col items-center justify-center space-y-4">
                <span className="text-2xl">🔍</span>
                <div className="space-y-1 max-w-md">
                  <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">
                    {language === "en" ? "No Projects Found" : "কোনো মিল পাওয়া যায়নি"}
                  </h4>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                    {language === "en" 
                      ? "We couldn't find any projects matching your precise criteria. Try broadening your options."
                      : "আপনার নির্বাচিত ফিল্টারের আমাদের কোনো প্রজেক্ট পাওয়া যায়নি। অনুগ্রহ করে অন্য অপশন নির্বাচন করুন।"}
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProjectsList
                  .filter(p => activeTab === "all" || p.status.includes(activeTab) || p.status === activeTab)
                  .map((p, index) => (
                    <motion.div
                      key={p.id}
                      id={`project-card-${p.id}`}
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      exit={{ opacity: 0, scale: 0.94, y: -20 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 150,
                        damping: 22,
                        delay: (index % 3) * 0.08
                      }}
                    >
                      <ProjectCard
                        project={p}
                        language={language}
                        index={index}
                        onSelect={(proj) => {
                          sessionStorage.setItem("scroll_to_project_id", proj.id);
                          if (engineMode === "php") {
                            window.location.href = `/project-details.php?id=${proj.id}&lang=${language}`;
                          } else {
                            setSelectedProject(proj);
                          }
                        }}
                        onBookVisit={(name, type) => {
                          setVisitProj(name);
                          setVisitType(type);
                        }}
                        onView3D={(proj) => {
                          setActive3DProject(proj);
                          setTimeout(() => {
                            const element = document.getElementById("floorplan");
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 100);
                        }}
                        onTriggerVirtualTour={(proj) => {
                          setVirtualTourProject(proj);
                        }}
                        onToggleCompare={handleToggleCompare}
                        isCompared={comparedProjects.some(cp => cp.id === p.id)}
                        onViewGallery={(proj) => {
                          setSelectedGalleryProject(proj);
                          setIsGalleryOpen(true);
                        }}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </section>

      {/* 3D INTERACTIVE FLOOR PLAN SECTION */}
      <FloorPlan 
        language={language} 
        selectedProject={selectedProject} 
        active3DProject={active3DProject}
        onClose3D={() => setActive3DProject(null)}
      />

      {/* DYNAMIC INVESTMENT & INSTALLMENT CALCULATOR (PRODUCTION GRADE) */}
      <InvestmentCalculator 
        language={language}
        onOpenBooking={() => {
          document.getElementById("book-visit")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 8_FEATURES_AMENITIES_SECTION */}
      <section id="amenities" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <AnimatedHeading
              align="center"
              subtitle={language === "en" ? "ENGINEERING EXCELLENCE" : "প্রকৌশল ও নির্মাণ শ্রেষ্ঠত্ব"}
              title={language === "en" ? "Why Invest with Mollik Builders?" : "কেন মল্লিক বিল্ডার্স আপনার সেরা নির্বাচন?"}
            />
            <p className="text-xs text-neutral-500">
              {language === "en" ? "We merge legal certainty, material security, and beautiful architectural balance." : "আইনি নিরাপত্তা, উপাদানের স্থায়িত্ব এবং অপূর্ব শিল্পকলার সমন্বয়।"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "RAJUK Approved", desc: "All projects strictly adhere to RAJUK guidelines and secure clearances prior to launch.", descBn: "সকল কন্সট্রাকশন রাজুকের নিয়ম ও ছাড়পত্র পেয়ে তবেই বুকিং শুরু করে।" },
              { icon: Building, title: "72.5 Grade Steel", desc: "Using premium materials and BNBC compliant structural designs for 7.5 Richter safety.", descBn: "ভূমিকম্প থেকে শতভাগ সুরক্ষায় আমরা ব্যবহার করি প্রিমিয়াম ম্যাটেরিয়ালস।" },
              { icon: Clock, title: "Handover Pledge", desc: "Strict commitment to timelines with real compensation clauses for project delays.", descBn: "সময়মতো বাড়ি হস্তান্তর নিশ্চিতে আমাদের আছে আইনগত চুক্তি নিরাপত্তা।" },
              { icon: Lock, title: "Insulation Block", desc: "Equipped with dual structural soundproofing arrays for perfect residential silence.", descBn: "শব্দ এবং তাপ নিরোধক মেটাল গ্লেজিং দিয়ে আপনার ফ্ল্যাট থাকবে শান্ত।" },
              { icon: Sparkles, title: "Rooftop Pools", desc: "Infinity common spaces, fully curated standard gym zones, and private play gardens.", descBn: "ডাবল টেরেস সুইমিং пул, কন্টিনিউটি হল এবং বাচ্চাদের জন্য নিরাপদ ফ্লোর।" },
              { icon: DollarSign, title: "Zero Hidden Fees", desc: "Clear legal bills with detailed pricing charts and fixed cost installment periods.", descBn: "কোনো লুকানো বা অতিরিক্ত ফিস নেই, সম্পূর্ণ স্বচ্ছ কস্ট ডিস্ট্রিবিউশন।" },
              { icon: Globe, title: "Green Eco Tech", desc: "Extensive vertical gardens, solar electricity panels, and automatic water purifiers.", descBn: "উচ্চপ্রযুক্তির সোলার প্যানেল এবং সুন্দর ঝুলন্ত বাগান।" },
              { icon: Briefcase, title: "Bank Collaborations", desc: "We coordinate with fast-process commercial banking hubs for BDT home loans.", descBn: "শীর্ষস্থানীয় ব্যাংকের সাথে হোম লোনের জন্য দ্রুত প্রসেসে সহযোগিতা।" }
            ].map((f, i) => {
              const IconComp = f.icon;
              return (
                <div key={`feature-card-${i}`} className="bg-neutral-50/70 p-5 rounded-xl border border-neutral-150 hover:border-[#C8A165]/50 transition-all duration-300 hover:shadow-md group flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[#1B4D3E]/5 flex items-center justify-center mb-3 group-hover:bg-[#1B4D3E]/10 transition-colors">
                      <IconComp className="w-4.5 h-4.5 text-[#C8A165]" />
                    </div>
                    <h4 className="font-serif font-black text-[#1B4D3E] text-sm tracking-wide">{f.title}</h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mt-1.5 font-light">
                      {language === "en" ? f.desc : f.descBn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9_TESTIMONIALS_SECTION */}
      <section className="py-12 bg-neutral-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <AnimatedHeading
              align="left"
              titleClassName="text-white"
              subtitle={language === "en" ? "TESTIMONIALS" : "গ্রাহকের সন্তুষ্টির রিভিউ"}
              title={language === "en" ? "What Our Valuable Landowners & Families Say" : "আমাদের সম্মানিত জমির মালিক এবং পরিবারের কিছু অভিজ্ঞতা"}
            />

            <div className="space-y-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={`testimonial-card-${i}`} className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 hover:border-[#C8A165]/40 transition-colors duration-300 space-y-2 relative">
                  <span className="absolute top-2 right-4 text-3xl font-serif text-[#C8A165]/10 select-none">“</span>
                  <p className="text-[11px] md:text-xs italic text-neutral-300 leading-relaxed font-light font-sans pr-6">
                    {language === "en" ? t.comment : t.commentBn}
                  </p>
                  <div className="flex gap-2.5 items-center text-xs pt-1 border-t border-neutral-900/60">
                    <img src={t.avatar} alt={t.name} loading="lazy" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover border border-[#C8A165]/35 shrink-0" />
                    <div>
                      <span className="block font-bold text-white text-[11px]">{language === "en" ? t.name : t.nameBn}</span>
                      <span className="block text-[8.5px] text-[#C8A165] font-mono uppercase tracking-wider">{language === "en" ? t.location : t.locationBn} Resident</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center group cursor-pointer" onClick={() => setVideoOpen(true)}>
            <img 
              src="/uploads/project 8 (1).webp" 
              alt="Video Review Cover" 
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="relative z-10 w-16 h-16 bg-[#C8A165] text-neutral-900 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-neutral-900 ml-1" />
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-[10px] font-bold text-[#C8A165] uppercase z-10">
              {language === "en" ? "Watch video testimonial" : "ভিডিও ইন্টারভিউ প্লে করুন"}
            </div>
          </div>

        </div>

        {videoOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-950 max-w-3xl w-full aspect-video rounded-lg overflow-hidden relative border border-neutral-800">
              <button 
                type="button"
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[#C8A165]"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-neutral-900">
                <Sparkles className="w-12 h-12 text-[#C8A165] animate-spin" />
                <h4 className="text-white text-lg font-bold font-serif">Mollik Tower Handover Celebration, Gulshan-2</h4>
                <p className="text-xs text-neutral-400 max-w-md">Our high-fidelity video testimonial is rendering securely. Standard features include structural audit report reviews and landowner key handouts.</p>
                <button
                  type="button"
                  onClick={() => setVideoOpen(false)}
                  className="px-6 py-2 bg-[#C8A165] text-neutral-900 font-bold text-xs uppercase tracking-widest rounded"
                >
                  Close Cinema Viewer
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* OUR FOUNDER & VISIONARY SECTION (UPPER PLACEMENT SENSITIVE) - ULTRA DECORATIVE LUXE CABINET */}
      <section id="founder" className="py-16 bg-gradient-to-b from-[#090b09] to-[#121814] text-white relative overflow-hidden border-y border-[#C8A165]/20">
        
        {/* Subtle luminous ambient glowing nodes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#C8A165]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1B4D3E]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Portrait Column with Gilded Floating Media Board */}
          <div className="col-span-1 lg:col-span-5 flex flex-col items-center space-y-4">
            <div className="relative group">
              {/* Premium shimmering gold outer frame */}
              <div className="absolute -inset-2.5 rounded-3xl border-2 border-[#C8A165]/25 group-hover:border-[#C8A165]/55 group-hover:scale-[1.02] transition-all duration-500 pointer-events-none" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#1B4D3E]/20 to-[#C8A165]/20 opacity-90 blur-xs" />
              
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-900">
                <img 
                  src={chairmanImg} 
                  alt="Md. Saheb Ali Mollik" 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600";
                  }}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {/* Embedded luxury overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent p-5 text-center">
                  <p className="text-white text-xl font-serif font-black tracking-wide">Md. Saheb Ali Mollik</p>
                  <p className="text-[#C8A165] text-[10px] font-mono font-bold tracking-[0.25em] uppercase mt-1">FOUNDER & CHAIRMAN</p>
                </div>

                {/* Micro security shield tag */}
                <span className="absolute top-3 left-3 bg-[#1B4D3E]/90 text-[#C8A165] border border-[#C8A165]/45 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED DELEGATE
                </span>
              </div>
            </div>

            {/* Custom Interactive Executive Media Console & Digital Keyboard */}
            <div className="w-full max-w-sm bg-[#131514] border border-[#C8A165]/25 rounded-2xl p-3.5 space-y-3 shadow-2xl relative">
              <div className="absolute inset-x-0 -top-3 flex justify-center">
                <span className="px-3 py-1 bg-[#1B4D3E] text-[#C8A165] border border-[#C8A165]/40 text-[7.5px] font-mono tracking-[0.25em] font-extrabold rounded-full uppercase leading-none shadow-md">
                  {language === "en" ? "DIRECT MEDIA DESK" : "সরাসরি যোগাযোগ ডেস্ক"}
                </span>
              </div>

              {/* 5 Luxurious clarified media buttons */}
              <div className="flex justify-between items-center gap-2 pt-2">
                {[
                  { id: "voice", url: "tel:+8801715120802", icon: Phone, title: "Calls", label: "হটলাইন" },
                  { id: "whatsapp", url: "https://api.whatsapp.com/send?phone=8801715120802&text=Hello%20Mollik%20Builders%20Chairman%2C%20I%20am%20interested%20in%20discussing%20a%20development.", icon: MessageSquare, title: "WhatsApp", label: "মেসেজ" },
                  { id: "email", url: "mailto:mollikbuilders.bd1@gmail.com", icon: Mail, title: "Email", label: "ইমেইল" },
                  { id: "facebook", url: "https://www.facebook.com/profile.php?id=100083163276602", icon: Facebook, title: "Facebook", label: "ফেসবুক" },
                  { id: "registry", url: "#projects", icon: Globe, title: "Web Map", label: "মানচিত্র" }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = selectedFounderIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedFounderIcon(item.id);
                        showToast(
                          `Channel updated: ${item.title}`,
                          `চ্যানেল পরিবর্তন: ${item.label}`,
                          "info"
                        );
                      }}
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border ${
                        isActive 
                          ? "bg-[#C8A165] text-neutral-950 border-[#C8A165] shadow-[0_0_15px_rgba(200,161,101,0.5)] scale-105 animate-pulse" 
                          : "bg-[#181918] text-neutral-300 border-neutral-800 hover:text-white hover:border-[#C8A165]/50"
                      }`}
                      title={item.title}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className={`text-[7px] font-mono leading-none tracking-tighter mt-1 font-semibold ${isActive ? "text-neutral-950" : "text-neutral-400"}`}>
                        {language === "en" ? item.title : item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live interactive information panel that perfectly clarifies the active icon choice */}
              <div className="bg-[#131514] rounded-xl p-3 border border-[#C8A165]/20 transition-all text-left">
                {(() => {
                  const detailsMap: Record<string, any> = {
                    voice: {
                      titleEn: "Immediate VIP Phone Line",
                      titleBn: "সরাসরি ভিআইপি ফোন লাইন",
                      statusEn: "SECURE CALL",
                      statusBn: "সুরক্ষিত কলিং",
                      descEn: "Connect instantly to the private desk of Md. Saheb Ali Mollik with dedicated multi-line hotlines.",
                      descBn: "উত্তরা অফিস কার্যালয়ের সরাসরি ৩টি হটলাইন নম্বর সংযুক্ত করা আছে।",
                      actionEn: "Dial: +880 1715-120802",
                      actionBn: "ডায়াল করুন: +৮৮০ ১৭১৫-১২০৮০২",
                      link: "tel:+8801715120802"
                    },
                    whatsapp: {
                      titleEn: "Encrypted WhatsApp Correspondence",
                      titleBn: "হোয়াটসঅ্যাপ ডিরেক্ট মেসেজ",
                      statusEn: "ENCRYPTED CHAT",
                      statusBn: "হোয়াটসঅ্যাপ চ্যাট",
                      descEn: "Share blueprint documents, site papers, or landowner partnership joint-ventures instantly.",
                      descBn: "জমির প্রিমিয়াম নকশা, রাজুকের কাগজ অথবা প্রস্তাব সরাসরি হোয়াটস্যাপ করুন।",
                      actionEn: "Launch Encrypted Chat Desk",
                      actionBn: "হোয়াটসঅ্যাপ মেসেঞ্জার চালু করুন",
                      link: "https://api.whatsapp.com/send?phone=8801715120802&text=Hello%20Mollik%20Builders%20Chairman%2C%20I%20am%25"
                    },
                    email: {
                      titleEn: "Corporate Secretariat Email Desk",
                      titleBn: "চেয়ারম্যানের অফিসিয়াল ইমেইল",
                      statusEn: "VIP INBOX",
                      statusBn: "অফিসিয়াল ইমেইল",
                      descEn: "Submit official supply orders, banking compliance, and corporate architectural bids.",
                      descBn: "অফিসিয়াল কর্পোরেট বিডিং ফাইল, ব্যাংক প্রপোজাল এবং ফাইল সমূহ মেল করুন।",
                      actionEn: "Write: mollikbuilders.bd1@gmail.com",
                      actionBn: "মেল এড্রেস: mollikbuilders.bd1@gmail.com",
                      link: "mailto:mollikbuilders.bd1@gmail.com"
                    },
                    facebook: {
                      titleEn: "Official Facebook Press Hub",
                      titleBn: "অফিসিয়াল ফেসবুক প্রেস চ্যানেল",
                      statusEn: "VERIFIED SOCIAL",
                      statusBn: "সোশ্যাল মিডিয়া",
                      descEn: "Watch real-time structural tests on site, steel grade pouring, and local customer comments.",
                      descBn: "নির্মাণ কাজের ভিডিও কভারেজ, সাইট রিভিউ এবং নতুন প্রজেক্টের লাইভ ফলো করুন।",
                      actionEn: "Visit Mollik Builders Facebook",
                      actionBn: "ফেসবুক ভিডিও পেজ ভিজিট করুন",
                      link: "https://www.facebook.com/share/18qYYKv2Eg/?mibextid=wwXIfr"
                    },
                    registry: {
                      titleEn: "Dynamic GPS Map coordinates",
                      titleBn: "ডিজিটাল জিপিএস ম্যাপ",
                      statusEn: "GPS ACTIVE",
                      statusBn: "হেডঅফিস জিপিএস",
                      descEn: "Navigate directly to our corporate headquarters located at Miyabari crossway in Uttara, Dhaka.",
                      descBn: "উত্তরা ভুঁইয়াবাড়ী মোড়ে অবস্থিত আমাদের হেডকোয়ার্টারে সরাসরি গুগল ম্যাপস গাইড।",
                      actionEn: "Locate on Map",
                      actionBn: "গুগল ম্যাপে হেডকোয়ার্টার দেখুন",
                      link: "#map-section"
                    }
                  };
                  const cur = detailsMap[selectedFounderIcon] || detailsMap.voice;
                  return (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10.5px] font-bold text-[#C8A165] font-serif tracking-wide block">
                          {language === "en" ? cur.titleEn : cur.titleBn}
                        </span>
                        <span className="px-1.5 py-0.5 bg-neutral-900 text-[#C8A165] border border-[#C8A165]/40 text-[6.5px] font-mono tracking-widest uppercase rounded">
                          {language === "en" ? cur.statusEn : cur.statusBn}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-200 font-light leading-normal">
                        {language === "en" ? cur.descEn : cur.descBn}
                      </p>
                      <a 
                        href={cur.link}
                        target={cur.link.startsWith("http") ? "_blank" : undefined}
                        rel={cur.link.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#C8A165] hover:text-white pt-1 transition-colors group/link"
                      >
                        {language === "en" ? cur.actionEn : cur.actionBn}
                        <ArrowRight className="w-2.5 h-2.5 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

          {/* Profile details & Contact info */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C8A165]" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#C8A165]">
                  {language === "en" ? "COMMITTED TO LIFETIME EXCELLENCE" : "আজীবন স্থাপত্যের নির্ভরযোগ্যতার অঙ্গীকার"}
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-white leading-none">
                {language === "en" ? "Md. Saheb Ali Mollik" : "মোঃ সাহেব আলী মল্লিক"}
              </h3>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8A165]/10 rounded-full text-xs font-semibold text-[#C8A165] border border-[#C8A165]/25">
                <Award className="w-4 h-4 text-[#C8A165] animate-pulse" />
                <span className="tracking-wide">
                  {language === "en" 
                    ? "Founder & Chairman - Mollik Builders" 
                    : "প্রতিষ্ঠাতা ও চেয়ারম্যান - মল্লিক বিল্ডার্স"}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-5 space-y-5">
              <p className="text-xs md:text-[14px] text-neutral-200 leading-relaxed font-light font-sans">
                {language === "en" 
                  ? "Under the visionary hand of Chairman Md. Saheb Ali Mollik, Mollik Builders stands as a standard-bearer of absolute integrity, architectural safety, and construction transparency in Uttara and Dakshinkhan. Emphasizing modern earthquake-resistant structural safety and complete legal disclosures, he paves the way for secure, timeless residential masterpieces."
                  : "চেয়ারম্যান মোঃ সাহেব আলী মল্লিকের দূরদর্শী নেতৃত্বে মল্লিক বিল্ডার্স উত্তরা ও দক্ষিণখানের আবাসন খাতের সততা, নিরাপত্তা ও সফলতার প্রতীক হিসেবে দাঁড়িয়ে আছে। আধুনিক ভূমিকম্প সহনশীল কাঠামো এবং শতভাগ আইনি স্বচ্ছতা বজায় রেখে তিনি গড়ে চলেছেন নিখুঁত ও গৌরবময় আবাসন প্রজেক্টসমূহ।"}
              </p>

              {/* Dynamic Luxury Bento cards representing clear corporate credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Telephone Bento Panel */}
                <div className="p-5 rounded-2xl bg-[#131514] border border-[#C8A165]/25 space-y-3 shadow-2xl">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                    <div className="p-2 rounded-xl bg-[#C8A165]/10 text-[#C8A165] border border-[#C8A165]/20">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-[#C8A165] uppercase">
                        {language === "en" ? "VIP Direct Dial" : "ভিআইপি ভয়েস চ্যানেল"}
                      </h4>
                      <p className="text-[8px] text-neutral-300 font-mono">SECURED MULTI-LINE</p>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-[11px] text-neutral-200">
                    <a href="tel:+8801715120802" className="flex items-center justify-between hover:text-[#C8A165] transition-colors leading-relaxed border-b border-neutral-900/60 pb-1.5">
                      <span>+880 1715 120802</span>
                      <span className="text-[8px] bg-[#1B4D3E] text-[#C8A165] border border-[#C8A165]/40 px-1.5 py-0.5 rounded uppercase leading-none font-bold scale-[0.9]">Primary MD</span>
                    </a>
                    <a href="tel:+8801811253989" className="flex items-center justify-between hover:text-[#C8A165] transition-colors leading-relaxed border-b border-neutral-900/60 pb-1.5">
                      <span>+880 1811 253989</span>
                      <span className="text-[8px] bg-neutral-900 border border-[#C8A165]/20 text-[#C8A165] px-1.5 py-0.5 rounded uppercase leading-none font-bold scale-[0.9]">Secretariat</span>
                    </a>
                    <a href="tel:+8801928258818" className="flex items-center justify-between hover:text-[#C8A165] transition-colors leading-relaxed">
                      <span>+880 1928 258818</span>
                      <span className="text-[8px] bg-neutral-900 border border-[#C8A165]/20 text-[#C8A165] px-1.5 py-0.5 rounded uppercase leading-none font-bold scale-[0.9]">Desk Hot</span>
                    </a>
                  </div>
                </div>

                {/* Email & HQ Address Bento Panel */}
                <div className="p-5 rounded-2xl bg-[#131514] border border-[#C8A165]/25 space-y-4 shadow-2xl flex flex-col justify-between">
                  
                  {/* Executive Email Row */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[9px] font-mono font-bold tracking-widest text-[#C8A165] uppercase leading-none">
                        {language === "en" ? "Administrative Courier" : "অফিসিয়াল মেল রুম"}
                      </h4>
                      <p className="text-[7.5px] text-neutral-350 font-mono tracking-tighter mt-1">DIRECT REVIEW</p>
                      <a href="mailto:mollikbuilders.bd1@gmail.com" className="text-[11px] text-[#C8A165] hover:text-white font-mono block truncate mt-1">
                        mollikbuilders.bd1@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Head Office Address Row */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono font-bold tracking-widest text-[#C8A165] uppercase leading-none">
                        {language === "en" ? "Head Office" : "হেড অফিস"}
                      </h4>
                      <p className="text-[10px] text-neutral-200 font-light mt-1.5 leading-normal">
                        {language === "en"
                          ? "House No. 238, Faydabad Police Station, South Khan, Dhaka."
                          : "বাড়ি নং ২৩৮, ফায়দাবাদ পুলিশ ফাঁড়ি, দক্ষিন খান, ঢাকা।"}
                      </p>
                    </div>
                  </div>

                  {/* Branch Office Address Row */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono font-bold tracking-widest text-[#C8A165] uppercase leading-none">
                        {language === "en" ? "Branch Office" : "ব্রাঞ্চ অফিস"}
                      </h4>
                      <p className="text-[10px] text-neutral-200 font-light mt-1.5 leading-normal">
                        {language === "en"
                          ? "Bhuiyabari, Bashtala, Mollik City, Uttarkhan, Dhaka."
                          : "ভুইয়াবাড়ী, বাঁশতলা, মল্লিক সিটি, উত্তরখান, ঢাকা।"}
                      </p>
                    </div>
                  </div>

                  {/* Website Row */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[9px] font-mono font-bold tracking-widest text-[#C8A165] uppercase leading-none">
                        {language === "en" ? "Website" : "ওয়েবসাইট"}
                      </h4>
                      <a
                        href="https://www.khoj24bd.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:text-white font-mono block truncate mt-1.5 transition-colors"
                      >
                        www.khoj24bd.com
                      </a>
                    </div>
                  </div>

                </div>

              </div>
              
              {/* Trust Badge Seal with RAJUK and modern earthquake engineering compliance info */}
              <div className="p-4 bg-gradient-to-r from-[#1B4D3E]/30 to-transparent rounded-2xl border border-[#C8A165]/10 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C8A165] shrink-0" />
                  <p className="text-[10.5px] text-neutral-200 font-light leading-relaxed">
                    {language === "en" 
                      ? "All projects are RAJUK approved with BNBC dual earthquake standard guarantees under strict structural authorization."
                      : "আমাদের সকল প্রকল্প রাজুক অনুমোদিত এবং বিএনবিসি অনুযায়ী ৪ স্তর বিশিষ্ট ভূমিকম্প সহনশীল অবকাঠামো নিশ্চিত করে তৈরি।"}
                  </p>
                </div>
                <div className="hidden sm:block text-[#C8A165] text-xs font-serif italic text-right shrink-0 leading-none">
                  ISO 9001:2015<br/>
                  <span className="text-[8px] font-mono tracking-widest uppercase text-neutral-350">Certified Company</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 11_MEDIA_NEWS_SECTION */}
      <section id="media" className="py-12 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-10">
          <div className="space-y-4">
            <AnimatedHeading
              align="left"
              subtitle={language === "en" ? "PRESS COVERAGE" : "মিডিয়া ও প্রেস কাভারেজ"}
              title={language === "en" ? "Mollik Builders in the Spotlight" : "সংবাদ ও মিডিয়াতে মল্লিক বিল্ডার্স"}
            />
          </div>

          <div className="columns-1 md:columns-2 gap-6 space-y-6 [&>div]:break-inside-avoid">
            {MEDIA_NEWS.map((article, index) => (
              <MediaCard key={`media-news-card-${index}`} article={article} language={language} />
            ))}
          </div>
        </div>
      </section>


      {/* 12_BLOG_SECTION */}
      <section id="blog" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <AnimatedHeading
                align="left"
                subtitle={language === "en" ? "LATEST BLOG" : "সর্বশেষ তথ্য ও ব্লগসমূহ"}
                title={language === "en" ? "Knowledge for Safe Property Investment" : "নিরাপদ জমি ও অ্যাপার্টমেন্ট কেনার নির্দেশিকা"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <div key={`article-card-${article.id || i}`} className="bg-neutral-50 rounded-lg border border-neutral-150 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-video bg-neutral-100 relative">
                    <img src={article.image} alt={article.title} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase">
                      <span>{language === "en" ? article.category : article.categoryBn}</span>
                      <span>•</span>
                      <span>{language === "en" ? article.readTime : article.readTimeBn}</span>
                    </div>
                    <h4 className="font-serif font-bold text-neutral-850 hover:text-[#1B4D3E] transition-colors text-sm">
                      {language === "en" ? article.title : article.titleBn}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      {language === "en" ? article.summary : article.summaryBn}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a 
                    href="#book-visit" 
                    className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D3E] hover:text-[#C8A165] flex items-center gap-1"
                  >
                    {language === "en" ? "Read article guidelines" : "সম্পূর্ণ ডক্যুমেন্টশনটি পড়ুন"}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 13_CAREER_SECTION */}
      <section id="careers" className="py-12 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <AnimatedHeading
              align="center"
              subtitle={language === "en" ? "CAREERS" : "আমাদের সাথে কাজ করুন"}
              title={language === "en" ? "Build Your Career with Mollik Builders" : "মল্লিক বিল্ডার্স কারিয়ার পোর্টাল"}
            />
            <p className="text-xs text-neutral-500">
              {language === "en" ? "Join our architectural drawing rooms and customer relations team." : "উদ্ভাবনী তরুণ এবং এক্সপার্ট সিভিল ইঞ্জিনিয়ারদের ক্যারিয়ার গড়ার সুযোগ।"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAREERS_LIST.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-2 py-0.5 bg-[#1B4D3E]/10 text-[#1B4D3E] text-[9px] font-bold rounded uppercase">
                    {language === "en" ? job.department : job.departmentBn}
                  </span>
                  
                  <h4 className="font-serif font-black text-[#181A19] text-sm md:-mb-1">
                    {language === "en" ? job.title : job.titleBn}
                  </h4>

                  <div className="space-y-1 text-[11px] text-neutral-500">
                    <div>📍 {job.location}</div>
                    <div>💼 {language === "en" ? job.type : job.typeBn} ({job.experience})</div>
                    <div>📅 {language === "en" ? `Deadline: ${job.deadline}` : `ডেডলাইন: ${job.deadline}`}</div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => setCareerApplyJob(job.id)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[11px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer text-center"
                  >
                    {language === "en" ? "Apply for position" : "আবেদন করুন"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Apply vacancy modal popup */}
        {careerApplyJob && (
          <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-neutral-100 text-neutral-800">
              <div className="bg-[#1B4D3E] text-white p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm tracking-widest uppercase">Job Application Portal</h4>
                  <p className="text-[10px] text-[#C8A165] mt-0.5">Submit details for: {careerApplyJob.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setCareerApplyJob(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {careerSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
                  <h5 className="font-bold">Application Received!</h5>
                  <p className="text-xs text-neutral-500 leading-relaxed">Our premium assessment team will examine your CV and schedule interview rounds within 5 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleCareerApplySubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-neutral-450 font-semibold mb-1">Full Name*</label>
                      <input 
                        type="text" 
                        required
                        value={careerName}
                        onChange={(e) => setCareerName(e.target.value)}
                        placeholder="Sayed Kabir"
                        className="w-full bg-neutral-50 border border-neutral-250 p-2 rounded focus:outline-[#1B4D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-450 font-semibold mb-1">Phone Number*</label>
                      <input 
                        type="tel" 
                        required
                        value={careerPhone}
                        onChange={(e) => setCareerPhone(e.target.value)}
                        placeholder="+88017"
                        className="w-full bg-neutral-50 border border-neutral-250 p-2 rounded focus:outline-[#1B4D3E]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-neutral-450 font-semibold mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={careerEmail}
                      onChange={(e) => setCareerEmail(e.target.value)}
                      placeholder="applied@mollikbuilders.com"
                      className="w-full bg-neutral-50 border border-neutral-250 p-2 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>

                  {/* Drag-and-drop simulated file upload bar */}
                  <div className="text-xs space-y-1">
                    <label className="block text-neutral-450 font-semibold">Resume Attachment (PDF only)</label>
                    <div className="border-2 border-dashed border-neutral-200 rounded-lg p-5 text-center hover:bg-neutral-50 transition-colors relative cursor-pointer">
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <Upload className="w-6 h-6 text-[#C8A165]" />
                        <span className="text-[11px] font-bold text-neutral-600 block">Click or Drag CV here to apply</span>
                        <input 
                          type="file" 
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setCareerCvName(e.target.files[0].name);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    {careerCvName && (
                      <p className="text-[11px] font-bold text-[#1B4D3E] text-center mt-1">✓ Attached file: {careerCvName}</p>
                    )}
                  </div>

                  <div className="text-xs">
                    <label className="block text-neutral-450 mb-1">Brief Overview statement</label>
                    <textarea 
                      rows={2}
                      value={careerCover}
                      onChange={(e) => setCareerCover(e.target.value)}
                      placeholder="Describe what values you bring..."
                      className="w-full bg-neutral-50 border border-neutral-250 p-2 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1B4D3E] text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-[#153e32]"
                  >
                    Submit job application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>


      {/* 14_LANDOWNERS_SECTION */}
      <section id="landowners" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left info description */}
          <div className="space-y-6">
            <AnimatedHeading
              align="left"
              subtitle={language === "en" ? "JOINT VENTURES" : "জমির মালিকদের জন্য পার্টনারশিপ"}
              title={language === "en" ? "Have Premium Land in Dhaka? Let's Partner Together" : "আপনার কি ঢাকায় জমি আছে? যৌথ উদ্যোগে চমৎকার বাড়ি গড়ুন"}
            />
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              {language === "en" 
                ? "Mollik Builders excels in transforming prime family lands into elegant legacy structures. We provide landowners with explicit contract metrics: premium construction materials (grade 72.5 bar), modern BNBC anti-seismic safety arrays, state of the art active noise isolation slabs, RAJUK approvals, and fixed hand-over deadlines with late delay clause insurance. Partner with complete mental security and reap maximum financial yields."
                : "মল্লিক বিল্ডার্স যৌথ উন্নয়ন চুক্তিতে আপনার সম্পত্তির আকর্ষণীয় ও নিরাপদ ডিজাইন নির্মাণ করতে প্রতিশ্রুতিবদ্ধ। আমরা জমির মালিকদের সর্বাধিক লভ্যাংশ, আন্তর্জাতিক মানের কন্সট্রাকশন ম্যাটেরিয়ালস, রাজুক ক্লিয়ারেন্স এবং সময়মতো ডেডলাইনে প্রজেক্ট হস্তান্তর নিশ্চিত করি।"
              }
            </p>

            <div className="space-y-2 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A165]" />
                <span>{language === "en" ? "100% Legal & RAJUK Compliance audit" : "শতভাগ স্বচ্ছ আইনি রাজুক ডকুমেন্টেশন"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A165]" />
                <span>{language === "en" ? "Seismic Resistant compliance (Richter 7.5)" : "ভূমিকম্প প্রতিরোধী নিরাপত্তা ম্যাপ (৭.৫ তীব্রতা)"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A165]" />
                <span>{language === "en" ? "Delayed handover compensation guarantees" : "দেরি হলে কাস্টম জরিমানা পেমেন্ট রিফান্ড ক্লজ"}</span>
              </div>
            </div>
          </div>

          {/* Right Submit Land Form */}
          <div className="bg-neutral-50 p-6 md:p-8 rounded-xl border border-neutral-200 shadow-lg">
            <h3 className="font-serif font-bold text-lg text-neutral-800 mb-4 text-center">
              {language === "en" ? "Partner with Mollik Builders" : "জমির বিবরণ জমা দিন"}
            </h3>

            {landSuccess ? (
              <div className="p-8 text-center space-y-3 bg-white rounded border border-neutral-100">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
                <h4 className="font-bold text-sm text-neutral-800">Proposal Logged Successfully!</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">Our land audit experts will contact you and inspect the coordinates within 48 working hours. Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleLandSubmit} className="space-y-4 text-xs text-neutral-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 font-semibold mb-1">Land Owner Name*</label>
                    <input 
                      type="text" 
                      required
                      value={landName}
                      onChange={(e) => setLandName(e.target.value)}
                      placeholder="Farhad Mollik"
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-450 font-semibold mb-1">Contact Phone*</label>
                    <input 
                      type="tel" 
                      required
                      value={landPhone}
                      onChange={(e) => setLandPhone(e.target.value)}
                      placeholder="+8801"
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 font-semibold mb-1">Land Location* (DHaka Area)</label>
                    <input 
                      type="text" 
                      required
                      value={landLoc}
                      onChange={(e) => setLandLoc(e.target.value)}
                      placeholder="Dhanmondi, Road 15"
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-450 mb-1">Land Size (Katha)</label>
                    <input 
                      type="text" 
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      placeholder="10 katha"
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 mb-1">Adjacent Road Width (Feet)</label>
                    <input 
                      type="text" 
                      value={landRoadWidth}
                      onChange={(e) => setLandRoadWidth(e.target.value)}
                      placeholder="40 feet wide"
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-450 mb-1">Preferred Venture</label>
                    <select
                      value={landStatus}
                      onChange={(e) => setLandStatus(e.target.value)}
                      className="w-full bg-white border border-neutral-250 p-2.5 rounded"
                    >
                      <option value="Joint Venture Proposal">Joint Venture Proposal</option>
                      <option value="Outright Purchase Inquiry">Outright Purchase Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-450 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={landEmail}
                    onChange={(e) => setLandEmail(e.target.value)}
                    placeholder="land@prop.com"
                    className="w-full bg-white border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1B4D3E] hover:bg-[#143d31] text-[#C8A165] font-black text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow hover:shadow-lg"
                >
                  {language === "en" ? "Submit Land Details" : "বিস্তারিত বিবরণ পাঠান"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>


      {/* B2B BUILDER AND LAND JV CONSOLE */}
      <BuilderConsole language={language} selectedProject={selectedProject} />


      {/* 15_CONTACT_SECTION */}
      <section id="contact" className="py-12 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Form: Get In Touch */}
          <div id="book-visit" className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
            <h3 className="font-serif font-black text-2xl text-neutral-850 mb-2">
              {language === "en" ? "Book an Exclusive Site Visit" : "একচেটিয়া সাইট ভিজিট বুক করুন"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              {language === "en" ? "Schedule a private coffee meet or site view with our property designers." : "আমাদের সাথে চমৎকার চা পানের আমন্ত্রণ গ্রহণ করুন।"}
            </p>

            {visitSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 text-emerald-800 rounded">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">Site Visit Logged Successfully!</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">We will coordinate and call you shortly to confirm dates and provide a private sedan transport. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleBookVisitSubmit} className="space-y-4 text-xs text-neutral-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 font-semibold mb-1">Full Name*</label>
                    <input 
                      type="text" 
                      required
                      value={visitName}
                      onChange={(e) => setVisitName(e.target.value)}
                      placeholder="Ashraf Kabir"
                      className="w-full bg-neutral-50 border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-450 font-semibold mb-1">Contact Phone*</label>
                    <input 
                      type="tel" 
                      required
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      placeholder="+8801"
                      className="w-full bg-neutral-50 border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={visitEmail}
                      onChange={(e) => setVisitEmail(e.target.value)}
                      placeholder="client@test.com"
                      className="w-full bg-neutral-50 border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-450 mb-1">Preferred Visit Date</label>
                    <input 
                      type="date" 
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-250 p-2 rounded focus:outline-[#1B4D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-450 mb-1">Interested Project</label>
                    <select
                      value={visitProj}
                      onChange={(e) => setVisitProj(e.target.value)}
                      className="w-full bg-neutral-50 border border-[#D1D5DB] p-2.5 rounded focus:outline-[#1B4D3E]"
                    >
                      <option value="">{language === "en" ? "Select Project" : "প্রজেক্ট নির্বাচন করুন"}</option>
                      <option value="Mollik Tower">Mollik Tower (Gulshan-2)</option>
                      <option value="Mollik Heights">Mollik Heights (Banani)</option>
                      <option value="Mollik Garden">Mollik Garden (Uttara)</option>
                      <option value="Mollik Serenade">Mollik Serenade (Dhanmondi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-450 mb-1">Budget Range</label>
                    <select
                      value={visitBudget}
                      onChange={(e) => setVisitBudget(e.target.value)}
                      className="w-full bg-neutral-50 border border-[#D1D5DB] p-2.5 rounded focus:outline-[#1B4D3E]"
                    >
                      <option value="">{language === "en" ? "Select range" : "বাজেট রেঞ্জ"}</option>
                      <option value="৳70 Lac onwards">৳70 Lac onwards</option>
                      <option value="৳1 Crore onwards">৳1 Crore onwards</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-450 mb-1">Message Detail</label>
                  <textarea 
                    rows={2}
                    value={visitMessage}
                    onChange={(e) => setVisitMessage(e.target.value)}
                    placeholder="Specify layout requirements..."
                    className="w-full bg-neutral-50 border border-neutral-250 p-2.5 rounded focus:outline-[#1B4D3E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1B4D3E] hover:bg-[#143b31] text-[#C8A165] font-black text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow hover:shadow-lg"
                >
                  {language === "en" ? "Send Message & Book Visit" : "বার্তা পাঠান ও ভিজিট টাইম বুক করুন"}
                </button>
              </form>
            )}
          </div>

          {/* Right Area: Contact Info and Custom Map Dashboard representation */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-neutral-900 text-white p-6 md:p-8 rounded-xl border border-neutral-800 space-y-4">
              <span className="text-[9px] font-black uppercase text-[#C8A165] tracking-[0.2em]">Contact Information</span>
              
              <h4 className="font-serif font-black text-xl">Mollik Builders Corporate HQ</h4>
              
              <div className="space-y-2 text-xs text-neutral-300">
                <p>
                  📍 <strong>{language === "en" ? "Corporate HQ (Head Office):" : "কর্পোরেট হেডকোয়ার্টার (হেড অফিস):"}</strong>{" "}
                  {language === "en"
                    ? "House No. 238, Faydabad Police Station, South Khan, Dhaka."
                    : "বাড়ি নং ২৩৮, ফায়দাবাদ পুলিশ ফাঁড়ি, দক্ষিন খান, ঢাকা।"}
                </p>
                <p>
                  📍 <strong>{language === "en" ? "Sub-Branch (Branch Office):" : "সাব-ব্রাঞ্চ (ব্রাঞ্চ অফিস):"}</strong>{" "}
                  {language === "en"
                    ? "Bhuiyabari, Bashtala, Mollik City, Uttarkhan, Dhaka."
                    : "ভুইয়াবাড়ী, বাঁশতলা, মল্লিক সিটি, উত্তরখান, ঢাকা।"}
                </p>
                <p>📞 {language === "en" ? "Phone:" : "ফোন:"} +880 1715-120802 (Chairman & MD), +880 1811-253989, +880 1928-258818</p>
                <p>✉️ {language === "en" ? "Email:" : "ইমেইল:"} info@mollikbuilders.com</p>
                <p>🕒 {language === "en" ? "Hours:" : "সময়সূচী:"} {language === "en" ? "Sat-Thu 9:00 AM - 7:00 PM" : "শনি-বৃহস্পতি সকাল ৯:০০ - সন্ধ্যা ৭:০০"}</p>
              </div>

              <div className="p-3 bg-neutral-950/70 rounded border border-neutral-800 text-[11px] text-neutral-400">
                {language === "en" ? "Our corporate showroom houses active construction specimens, physical mock floor stones, and visualizer tools." : "আমাদের কর্পোরেট লাউঞ্জে ভৌত কন্সট্রাকশন সামগ্রী এবং উন্নত থ্রিডি ইন্টেরিয়র কালেকশন ডিসপ্লে আছে।"}
              </div>
            </div>

            {/* Simulated Live Vector Google Maps Dashboard Canvas */}
            <InteractiveVectorMap language={language} />
          </div>

        </div>
      </section>


      {/* 15_FAQ_SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#C8A165] block">
              {language === "en" ? "HAVE QUESTIONS?" : "জিজ্ঞাসা ও উত্তর"}
            </span>
            <h2 className="text-3xl font-serif font-black tracking-tight text-neutral-850">
              {language === "en" ? "Frequently Asked Questions" : "সাধারণ জিজ্ঞাসিত প্রশ্নসমূহ"}
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS_LIST.map((faq, i) => {
              const isOpen = activeFaqIdx === i;
              return (
                <div key={`faq-item-${i}`} className="bg-neutral-50/70 border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left px-5 py-4 font-serif font-bold text-neutral-800 text-xs sm:text-sm flex justify-between items-center bg-white cursor-pointer"
                  >
                    <span>{language === "en" ? faq.question : faq.questionBn}</span>
                    <span className="text-[#C8A165] text-lg font-black">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-neutral-600 leading-relaxed border-t border-dotted border-neutral-200">
                      {language === "en" ? faq.answer : faq.answerBn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 16_FOOTER */}
      <footer className="bg-[#181A19] text-white pt-16 pb-8 border-t border-neutral-850">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-neutral-800 pb-12">
          
          {/* Logo and brief company overview */}
          <div className="space-y-4">
            <LuxuryLogo variant="gold" language={language} />
            
            <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
              {language === "en" 
                ? "Mollik Builders builds high-performance luxury structures in Gulshan, Banani, and Uttara. Explicit transparency, 72.5 grade steel reinforcement, full sound insulating windows, and beautiful structural longevity graphs."
                : "গুলশান, বনানী এবং উত্তরার মতো অভিজাত এলাকায় নান্দনিক ও সর্বোচ্চ আধুনিক প্রযুক্তিসম্পন্ন আবাসন গড়ার একমাত্র নির্ভরযোগ্য অংশীদার মল্লিক বিল্ডার্স।"}
            </p>

            <div className="flex gap-2 items-center">
              <span className="text-[9px] text-neutral-500 uppercase font-bold">Authorized Builder RAJUK license display</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4 text-xs text-neutral-400">
            <h4 className="font-serif font-bold text-white text-sm">{language === "en" ? "Quick navigation" : "মেনু লিঙ্ক"}</h4>
            <div className="flex flex-col gap-2 font-medium">
              <a href="#" className="hover:text-[#C8A165] transition-colors">Home landing page</a>
              <a href="#about" className="hover:text-[#C8A165] transition-colors">{language === "en" ? "About company profile" : "কোম্পানি প্রোফাইল"}</a>
              <a href="#projects" className="hover:text-[#C8A165] transition-colors">{language === "en" ? "Our project portfolio" : "প্রজেক্ট পোর্টফোলিও"}</a>
              <a href="#careers" className="hover:text-[#C8A165] transition-colors">{language === "en" ? "Careers opportunities" : "আমাদের সাথে কাজ করুন"}</a>
              <button 
                onClick={() => setAdminOpen(true)}
                className="text-left hover:text-[#C8A165] transition-colors cursor-pointer font-bold text-[#C8A165]/90 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 mt-1"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>{language === "en" ? "Super Admin Console" : "সুপার অ্যাডমিন কনসোল"}</span>
              </button>
            </div>
          </div>

          {/* Project links details */}
          <div className="space-y-4 text-xs text-neutral-400">
            <h4 className="font-serif font-bold text-white text-sm">{language === "en" ? "Segment categories" : "প্রজেক্ট সেগমেন্টসমূহ"}</h4>
            <div className="flex flex-col gap-2 font-medium">
              <a href="#projects" onClick={() => setActiveTab("Ongoing")} className="hover:text-[#C8A165] transition-colors">Ongoing developments</a>
              <a href="#projects" onClick={() => setActiveTab("Completed")} className="hover:text-[#C8A165] transition-colors">Completed handover arrays</a>
              <a href="#projects" onClick={() => setActiveTab("Upcoming")} className="hover:text-[#C8A165] transition-colors">Upcoming legal pre-launches</a>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4 text-xs">
            <h4 className="font-serif font-bold text-white text-sm">
              {language === "en" ? "Subscribe to Newsletter" : "নিউজলেটার সাবস্ক্রাইব করুন"}
            </h4>
            
            <p className="text-neutral-400 text-[11px] leading-relaxed font-light">
              Get the earliest pre-launch booking estimates and land partnership metrics.
            </p>

            {newsSuccess ? (
              <p className="text-[#C8A165] font-bold text-[11px]">{language === "en" ? "✓ Subscribed successfully!" : "✓ সাবস্ক্রিপশন সফল হয়েছে!"}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5 h-9">
                <input 
                  type="email" 
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="name@email.com" 
                  className="bg-neutral-850 px-2.5 rounded text-xs text-white border border-neutral-750 focus:outline-[#C8A165] flex-1 max-w-[170px]"
                />
                <button 
                  type="submit" 
                  className="px-3 bg-[#C8A165] hover:bg-[#b08c52] transition-all text-neutral-900 font-bold uppercase tracking-wider text-[10px] rounded cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}

            {/* Payment methods icons */}
            <div className="pt-4 border-t border-neutral-800 space-y-1.5 text-[10px] text-neutral-500 uppercase tracking-widest">
              <span>Symmetric BDT payment clearance partners:</span>
              <div className="flex gap-2 flex-wrap items-center">
                <span className="font-bold bg-neutral-900 px-2 py-0.5 text-neutral-400 border border-neutral-800 rounded">bKash</span>
                <span className="font-bold bg-neutral-900 px-2 py-0.5 text-neutral-400 border border-neutral-800 rounded">Nagad</span>
                <span className="font-bold bg-neutral-900 px-2 py-0.5 text-neutral-400 border border-neutral-800 rounded">Rocket</span>
                <span className="font-bold bg-neutral-900 px-2 py-0.5 text-neutral-400 border border-neutral-800 rounded">Bank Link</span>
              </div>
            </div>
          </div>

        </div>

        {/* copyright metadata */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>© 2026 Mollik Builders. All Rights Reserved. RAJUK registered, BNBC structural safety compliant.</span>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span>
              Designed & Crafted by{" "}
              <a 
                href="https://fsferdows.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-[#C8A165] transition-colors underline decoration-[#C8A165]/30 underline-offset-2"
              >
                FS Ferdows
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3.5 mt-2 sm:mt-0">
            <button
              onClick={() => setAdminOpen(true)}
              className="text-neutral-400 hover:text-[#C8A165] transition-colors cursor-pointer flex items-center gap-1.5 font-mono uppercase font-bold text-[9px] border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 rounded"
            >
              <Lock className="w-3 h-3 text-[#C8A165]" />
              <span>{language === "en" ? "Super Admin Portal" : "সুপার অ্যাডমিন পোর্টাল"}</span>
            </button>
          </div>
        </div>
      </footer>


      {/* PERSISTENT LUXURY FLOATING WIDGETS */}
      {/* Floating call-to-action bar */}
      <div className="fixed bottom-4 left-4 z-35 flex flex-col gap-2">
        {/* Call Now button (mobile only or visible on hover) */}
        <a 
          href="tel:+8801715120802"
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-850 text-white rounded-full px-4 py-2.5 shadow-xl border border-neutral-800 text-[11px] font-bold uppercase transition-all tracking-wider font-mono sm:hidden"
        >
          <Phone className="w-4 h-4 text-[#C8A165]" />
          <span>Call Now</span>
        </a>
      </div>

      {/* Luxe Prestige Control Center has been removed as requested */}

      <Suspense fallback={
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-neutral-100">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-[#C8A165] animate-spin" />
            <span className="text-xs font-medium font-mono text-neutral-600 tracking-wider">
              {language === "en" ? "LOADING RESIDENCE..." : "প্রজেক্ট লোড হচ্ছে..."}
            </span>
          </div>
        </div>
      }>
        <AnimatePresence mode="wait">
          {/* Client leads monitor Admin console backdrop */}
          {adminOpen && (
            <AdminPanel 
              language={language}
              onClose={() => setAdminOpen(false)}
              webConfig={webConfig}
              onConfigSaved={fetchWebConfig}
            />
          )}

          {/* Project detail specifications & unit Elevation map */}
          {selectedProject && (
            engineMode === "php" ? (
              <PhpDetailModal
                project={selectedProject}
                language={language}
                onClose={() => setSelectedProject(null)}
              />
            ) : (
              <ProjectDetailModal
                project={selectedProject}
                language={language}
                onClose={() => setSelectedProject(null)}
                onNewBookingSimulated={() => setLeadCounter(prev => prev + 1)}
              />
            )
          )}

          {/* Dynamic Project Benchmarking Side-by-Side comparison Modal */}
          {showCompareModal && (
            <CompareModal
              selectedProjects={comparedProjects}
              language={language}
              onClose={() => setShowCompareModal(false)}
              onSelectProject={(p) => {
                setShowCompareModal(false);
                if (engineMode === "php") {
                  sessionStorage.setItem("scroll_to_project_id", p.id);
                  window.location.href = `/project-details.php?id=${p.id}&lang=${language}`;
                } else {
                  setSelectedProject(p);
                }
              }}
            />
          )}

          {/* Interactive 360-degree Virtual Tour Modal */}
          {virtualTourProject && (
            <VirtualTourModal
              project={virtualTourProject}
              language={language}
              onClose={() => setVirtualTourProject(null)}
            />
          )}

          {/* Authentic full-screen swipeable 'Project Gallery' */}
          <ProjectGallery
            project={selectedGalleryProject}
            isOpen={isGalleryOpen}
            onClose={() => {
              setIsGalleryOpen(false);
              setSelectedGalleryProject(null);
            }}
            language={language}
          />

          {/* Real-time UX/UI Visual Customizer side-drawer modal overlay */}
          <UXCustomizer
            isOpen={uxCustomizerOpen}
            onClose={() => setUxCustomizerOpen(false)}
            language={language}
            settings={uxSettings}
            onSave={setUxSettings}
          />
        </AnimatePresence>
      </Suspense>

      {/* Floating Pill-Shaped Sticky Comparison Queue Bar */}
      {comparedProjects.length > 0 && (
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[94%] max-w-md bg-neutral-900/95 backdrop-blur-md text-white border border-[#C8A165]/50 rounded-full py-2.5 px-4 shadow-2xl flex items-center justify-between gap-3 animate-slideUp pointer-events-auto"
          style={{
            boxShadow: "0 15px 35px -12px rgba(200, 161, 101, 0.45), 0 3px 10px rgba(0,0,0,0.5)"
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex -space-x-2 shrink-0">
              {comparedProjects.map((p) => (
                <div key={p.id} className="w-7 h-7 rounded-full border border-neutral-800 overflow-hidden bg-neutral-850 shadow-xs" title={p.name}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-[8.5px] uppercase font-black font-mono tracking-widest text-[#C8A165] leading-none mb-0.5 truncate">
                {language === "en" ? "COMPARE LIST" : "তুলনা তালিকা"}
              </p>
              <p className="text-[10px] text-neutral-300 leading-none font-sans font-extrabold">
                {comparedProjects.length} / 3 {language === "en" ? "selected" : "নির্বাচিত"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 font-sans">
            <button
              onClick={() => setShowCompareModal(true)}
              className="bg-[#C8A165] hover:bg-[#b5915a] text-neutral-900 font-extrabold text-[9.5px] uppercase tracking-widest py-2 px-3.5 rounded-full transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <span>{language === "en" ? "Compare" : "তুলনা করুন"}</span>
            </button>
            <button
              onClick={() => setComparedProjects([])}
              className="w-5 h-5 rounded-full bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-neutral-500 font-bold flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer text-xs"
              title={language === "en" ? "Clear Selection" : "তালিকা পরিষ্কার করুন"}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Elegant Custom Golden-Rimmed VIP Toast overlay */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-3.5 pointer-events-none items-end max-w-sm w-full font-sans">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 30, transition: { duration: 0.2 } }}
              className="pointer-events-auto select-none overflow-hidden relative w-full bg-[#121312]/95 backdrop-blur-md border border-[#C8A165]/30 rounded-xl p-4 shadow-2xl flex items-start gap-3"
              style={{
                borderLeft: `4px solid ${
                  t.type === "success" ? "#1B4D3E" : t.type === "warning" ? "#ef4444" : "#C8A165"
                }`,
                boxShadow: "0 20px 45px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)"
              }}
            >
              {/* Delicate ambient gold shimmer backdrop pattern */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A165]/5 via-transparent to-[#1B4D3E]/2 pointer-events-none" />
              
              <div className="flex-1 min-w-0 z-10">
                <p className="text-[11.5px] text-neutral-200 font-semibold leading-relaxed">
                  {language === "en" ? t.message : t.messageBn || t.message}
                </p>
                <span className="block text-[7.5px] text-neutral-400 font-mono tracking-widest uppercase mt-1 leading-none">
                  {t.type === "success" ? "VIP ACTION SECURED" : t.type === "warning" ? "NOTIFICATION SYSTEM" : "HERITAGE PORTFOLIO UPDATE"}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToasts(prev => prev.filter(item => item.id !== t.id));
                }}
                className="text-neutral-500 hover:text-[#C8A165] transition-colors text-[13px] font-bold leading-none shrink-0 cursor-pointer z-10 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/5"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AI VIP Voice Hotline calling widget */}
      <AIVoiceConcierge language={language} />

    </div>
  );
}
