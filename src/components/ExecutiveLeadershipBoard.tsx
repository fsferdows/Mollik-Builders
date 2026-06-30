import React, { useState } from "react";
import { Phone, Mail, MessageSquare, Award, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Channel {
  url: string;
  label: string;
  labelBn: string;
  desc: string;
  descBn: string;
  value: string;
}

interface DetailItem {
  label: string;
  labelBn: string;
  value: string;
  valueBn: string;
}

interface Leader {
  id: string;
  name: string;
  nameBn: string;
  title: string;
  titleBn: string;
  role: string;
  roleBn: string;
  image: string;
  bio: string;
  bioBn: string;
  badge: string;
  badgeBn: string;
  signature: string;
  signatureBn: string;
  channels: {
    voice: Channel;
    whatsapp: Channel;
    email: Channel;
  };
  details: DetailItem[];
}

interface ExecutiveLeadershipBoardProps {
  language: "en" | "bn";
  showToast: (titleEn: string, titleBn: string, type: "success" | "error" | "info") => void;
}

const LEADERS_DATA: Leader[] = [
  {
    id: "saheb-ali",
    name: "Md. Saheb Ali Mollik",
    nameBn: "মোঃ সাহেব আলী মল্লিক",
    title: "Founder & Chairman",
    titleBn: "প্রতিষ্ঠাতা ও চেয়ারম্যান",
    role: "Chairman's Secretariat Office",
    roleBn: "চেয়ারম্যান ও ব্যবস্থাপনা পরিচালক",
    image: "/chairman.webp",
    bio: "Under the visionary hand of Chairman Md. Saheb Ali Mollik, Mollik Builders stands as a standard-bearer of absolute integrity, architectural safety, and construction transparency in Uttara and Dakshinkhan. Emphasizing modern earthquake-resistant structural safety and complete legal disclosures, he paves the way for secure, timeless residential masterpieces.",
    bioBn: "চেয়ারম্যান মোঃ সাহেব আলী মল্লিকের দূরদর্শী নেতৃত্বে মল্লিক বিল্ডার্স উত্তরা ও দক্ষিণখানের আবাসন খাতের সততা, নিরাপত্তা ও সফলতার প্রতীক হিসেবে দাঁড়িয়ে আছে। আধুনিক ভূমিকম্প সহনশীল কাঠামো এবং শতভাগ আইনি স্বচ্ছতা বজায় রেখে তিনি গড়ে চলেছেন নিখুঁত ও গৌরবময় আবাসন প্রজেক্টসমূহ।",
    badge: "FOUNDER & CHAIRMAN",
    badgeBn: "প্রতিষ্ঠাতা ও চেয়ারম্যান",
    signature: "Saheb Ali Mollik",
    signatureBn: "মোঃ সাহেব আলী মল্লিক",
    channels: {
      voice: {
        url: "tel:+8801715120802",
        label: "VIP Phone Line",
        labelBn: "ভিআইপি ফোন লাইন",
        desc: "Connect instantly to the private desk of Md. Saheb Ali Mollik with dedicated multi-line hotlines.",
        descBn: "উত্তরা অফিস কার্যালয়ের সরাসরি ৩টি হটলাইন নম্বর সংযুক্ত করা আছে।",
        value: "+880 1715-120802"
      },
      whatsapp: {
        url: "https://api.whatsapp.com/send?phone=8801715120802&text=Hello%20Mollik%20Builders%20Chairman%2C%20I%20am%20interested%20in%20discussing%20a%20development.",
        label: "WhatsApp Desk",
        labelBn: "হোয়াটসঅ্যাপ ডেস্ক",
        desc: "Share blueprint documents, site papers, or landowner partnership joint-ventures instantly.",
        descBn: "জমির প্রিমিয়াম নকশা, রাজুকের কাগজ অথবা প্রস্তাব সরাসরি হোয়াটস্যাপ করুন।",
        value: "Chat via WhatsApp"
      },
      email: {
        url: "mailto:mollikbuilders.bd1@gmail.com",
        label: "Secure Email",
        labelBn: "অফিসিয়াল ইমেইল",
        desc: "Submit official supply orders, banking compliance, and corporate architectural bids.",
        descBn: "অফিসিয়াল কর্পোরেট বিডিং ফাইল, ব্যাংক প্রপোজাল এবং ফাইল সমূহ মেল করুন।",
        value: "mollikbuilders.bd1@gmail.com"
      }
    },
    details: [
      { label: "Experience", labelBn: "অভিজ্ঞতা", value: "25+ Years of Leadership", valueBn: "২৫+ বছরের নেতৃত্ব" },
      { label: "Standard", labelBn: "মানদণ্ড", value: "BNBC structural compliance", valueBn: "বিএনবিসি অনুযায়ী স্ট্রাকচারাল ডিজাইন" },
      { label: "Core Focus", labelBn: "প্রধান লক্ষ্য", value: "Integrity & Construction Safety", valueBn: "সততা ও নির্মাণ নিরাপত্তা" }
    ]
  },
  {
    id: "sarah-mollik",
    name: "Sarah Mollik",
    nameBn: "সারাহ মল্লিক",
    title: "Managing & Operations Director",
    titleBn: "ব্যবস্থাপনা ও অপারেশনস ডিরেক্টর",
    role: "Operations & Procurement Head",
    roleBn: "অপারেশনস ও প্রকিউরমেন্ট প্রধান",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600",
    bio: "Overseeing day-to-day operations and strategic development, Sarah Mollik ensures precision execution and high-luxury finishing across all Mollik Builders projects. She implements advanced management tools to maintain strict scheduling and material procurement transparency.",
    bioBn: "ব্যবস্থাপনা ও অপারেশনস ডিরেক্টর হিসেবে সারাহ মল্লিক প্রতিটি প্রকল্পের নিখুঁত নির্মাণ ও বিলাসবহুল ফিনিশিং নিশ্চিত করেন। আধুনিক ম্যানেজমেন্ট সিস্টেমের মাধ্যমে তিনি প্রজেক্টের সঠিক সময়সীমা ও কাঁচামালের গুণগত মান বজায় রাখতে ভূমিকা রাখেন।",
    badge: "MANAGING & OPERATIONS DIRECTOR",
    badgeBn: "ব্যবস্থাপনা ও অপারেশনস ডিরেক্টর",
    signature: "Sarah Mollik",
    signatureBn: "সারাহ মল্লিক",
    channels: {
      voice: {
        url: "tel:+8801715120802",
        label: "Direct Operations Line",
        labelBn: "অপারেশনস ফোন লাইন",
        desc: "Call for immediate project status, construction updates, or material quality queries.",
        descBn: "প্রকল্পের অগ্রগতি, নির্মাণ আপডেট বা কাঁচামাল সংক্রান্ত আলোচনার জন্য সরাসরি কল করুন।",
        value: "+880 1715-120802"
      },
      whatsapp: {
        url: "https://api.whatsapp.com/send?phone=8801715120802&text=Hello%20Sarah%20Mollik%2C%20I%20would%2520like%2520to%2520discuss%2520operations.",
        label: "Operations Chat",
        labelBn: "অপারেশনস চ্যাট",
        desc: "Send documents regarding finishing materials, schedule adjustments, or supplier applications.",
        descBn: "ফিনিশিং ম্যাটেরিয়ালস, শিডিউল সমন্বয় বা সাপ্লায়ার চুক্তির ফাইল সরাসরি হোয়াটসঅ্যাপ করুন।",
        value: "Chat via WhatsApp"
      },
      email: {
        url: "mailto:sarah.mollik@mollikbuilders.com",
        label: "Operations Email",
        labelBn: "অপারেশনস ইমেইল",
        desc: "Official channel for material supply proposals, project delivery confirmations, and client feedback.",
        descBn: "উপকরণ সরবরাহ প্রস্তাব, প্রজেক্ট ডেলিভারি নিশ্চিতকরণ এবং ক্লায়েন্ট মতামতের অফিসিয়াল ইমেইল।",
        value: "sarah.mollik@mollikbuilders.com"
      }
    },
    details: [
      { label: "Expertise", labelBn: "অভিজ্ঞতা", value: "Luxury Finishes & Operations", valueBn: "বিলাসবহুল ফিনিশিং ও অপারেশনস" },
      { label: "Technology", labelBn: "প্রযুক্তি", value: "Real-time Construction Audits", valueBn: "রিয়েল-টাইম কনস্ট্রাকশন অডিট" },
      { label: "Scheduling", labelBn: "শিডিউলিং", value: "On-time Handover Guarantees", valueBn: "সঠিক সময়ে প্রজেক্ট হ্যান্ডওভার" }
    ]
  },
  {
    id: "engr-rahman",
    name: "Engr. K. M. Rahman",
    nameBn: "ইঞ্জি. কে. এম. রহমান",
    title: "Chief Structural Advisor",
    titleBn: "প্রধান কাঠামোগত উপদেষ্টা",
    role: "Structural Engineering Desk",
    roleBn: "স্ট্রাকচারাল ইঞ্জিনিয়ারিং ডেস্ক",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600",
    bio: "A former BUET engineering advisor, Engr. K. M. Rahman oversees all structural design calculations, ensuring every building is designed to withstand Richter Scale 7.5 magnitude earthquakes. He enforces Dhaka Zone-2 seismic safety standards and uses premium 72.5 Grade steel exclusively.",
    bioBn: "বুয়েটের সাবেক এই প্রকৌশল উপদেষ্টা মল্লিক বিল্ডার্সের সকল স্ট্রাকচারাল হিসাব-নিকাশ তদারকি করেন। রিখটার স্কেলে ৭.৫ মাত্রার ভূমিকম্প প্রতিরোধকারী কাঠামো, ঢাকা জোন-২ সিসমিক কোড এবং ৭২.৫ গ্রেড ইস্পাতের ব্যবহার নিশ্চিত করাই তার প্রধান কাজ।",
    badge: "CHIEF STRUCTURAL ADVISOR",
    badgeBn: "প্রধান কাঠামোগত উপদেষ্টা",
    signature: "K. M. Rahman",
    signatureBn: "কে. এম. রহমান",
    channels: {
      voice: {
        url: "tel:+8801811253989",
        label: "Engineering Hotline",
        labelBn: "ইঞ্জিনিয়ারিং হটলাইন",
        desc: "Consult directly on soil tests, foundation loads, piling results, or Grade-72 steel details.",
        descBn: "সয়েল টেস্ট, ফাউন্ডেশন লোড, পাইলিং রিপোর্ট বা গ্রেড-৭২ রডের বিষয়ে সরাসরি পরামর্শ করুন।",
        value: "+880 1811-253989"
      },
      whatsapp: {
        url: "https://api.whatsapp.com/send?phone=8801811253989&text=Hello%20Engr%20Rahman%2C%20I%20have%20a%20structural%20query.",
        label: "Structural Chat Desk",
        labelBn: "স্ট্রাকচারাল চ্যাট ডেস্ক",
        desc: "Send structural blueprints, piling plans, or soil investigation data for direct assessment.",
        descBn: "স্ট্রাকচারাল ব্লুপ্রিন্ট, পাইলিং প্ল্যান বা সয়েল টেস্ট রিপোর্ট মূল্যায়নের জন্য পাঠান।",
        value: "Chat via WhatsApp"
      },
      email: {
        url: "mailto:structural.advisor@mollikbuilders.com",
        label: "Advisory Inbox",
        labelBn: "উপদেষ্টা ইনবক্স",
        desc: "Submit architectural drawings for structural validation, load-bearing calculations, and safety reviews.",
        descBn: "কাঠামোগত স্থায়িত্ব পরীক্ষা, লোড ক্যালকুলেশন এবং নিরাপত্তা রিভিউয়ের জন্য ফাইল মেল করুন।",
        value: "structural.advisor@mollikbuilders.com"
      }
    },
    details: [
      { label: "Credentials", labelBn: "যোগ্যতা", value: "Former BUET Engineering Advisor", valueBn: "সাবেক বুয়েট ইঞ্জিনিয়ারিং উপদেষ্টা" },
      { label: "Compliance", labelBn: "কমপ্লায়েন্স", value: "Dhaka Zone-2 Seismic Code", valueBn: "ঢাকা জোন-২ সিসমিক কোড বাস্তবায়ন" },
      { label: "Material", labelBn: "উপকরণ", value: "Grade-72.5 Steel Reinforcement", valueBn: "৭২.৫ গ্রেড প্রিমিয়াম রড ব্যবহার" }
    ]
  },
  {
    id: "barrister-chowdhury",
    name: "Barrister Tanjib Chowdhury",
    nameBn: "ব্যারিস্টার তানজিব চৌধুরী",
    title: "Legal Director & Advisor",
    titleBn: "আইনি পরিচালক ও উপদেষ্টা",
    role: "Legal Audit Secretariat",
    roleBn: "আইনি অডিট সচিবালয়",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600",
    bio: "Specializing in property law and land ownership verification, Barrister Tanjib Chowdhury audits and secures all joint-venture contracts and land acquisitions. He performs rigorous land deed verification dating back 4 generations, ensuring absolute security for landowners and buyers.",
    bioBn: "সম্পত্তি আইন ও ভূমি মালিকানা যাচাইকরণে বিশেষজ্ঞ ব্যারিস্টার তানজিব চৌধুরী সকল ল্যান্ড জয়েন্ট-ভেঞ্চার ও ভূমি ক্রয় চুক্তি আইনিভাবে সুরক্ষিত করেন। ৪ প্রজন্ম পূর্বের দলিলপত্রাদি নিখুঁতভাবে পরীক্ষা করে ক্রেতা ও জমির মালিকদের শতভাগ আইনি নিরাপত্তা প্রদান করেন।",
    badge: "LEGAL DIRECTOR & ADVISOR",
    badgeBn: "আইনি পরিচালক ও উপদেষ্টা",
    signature: "Tanjib Chowdhury",
    signatureBn: "তানজিব চৌধুরী",
    channels: {
      voice: {
        url: "tel:+8801928258818",
        label: "Legal Hotline Desk",
        labelBn: "আইনি হটলাইন ডেস্ক",
        desc: "Discuss land registry security, Joint Venture clearances, or title deed verification protocols.",
        descBn: "ভূমির মালিকানা স্বত্ব, জয়েন্ট ভেঞ্চার চুক্তিপত্র এবং আইনি ছাড়পত্রের বিষয়ে সরাসরি আলোচনা করুন।",
        value: "+880 1928-258818"
      },
      whatsapp: {
        url: "https://api.whatsapp.com/send?phone=8801928258818&text=Hello%20Barrister%2520Chowdhury%2C%20I%20have%20a%20land%20legal%20query.",
        label: "Legal Chat Desk",
        labelBn: "আইনি চ্যাট ডেস্ক",
        desc: "Send deed copies, Bia-deed records, or draft development agreements for regulatory compliance audits.",
        descBn: "মূল দলিল, বায়া দলিল অথবা খসড়া আমমোক্তারনামা আইনি মূল্যায়নের জন্য হোয়াটসঅ্যাপ করুন।",
        value: "Chat via WhatsApp"
      },
      email: {
        url: "mailto:legal.desk@mollikbuilders.com",
        label: "Legal Registry Email",
        labelBn: "আইনি রেজিস্ট্রি ইমেইল",
        desc: "Submit official title clearance inquiries, legal draft amendments, and escrow agreement files.",
        descBn: "ভূমির স্বত্ব পরীক্ষা, চুক্তি সংশোধন এবং আইনি খসড়া অনুমোদনের জন্য ফাইল মেল করুন।",
        value: "legal.desk@mollikbuilders.com"
      }
    },
    details: [
      { label: "Expertise", labelBn: "অভিজ্ঞতা", value: "Property Law & Deed Verification", valueBn: "সম্পত্তি আইন ও দলিলপত্র যাচাইকরণ" },
      { label: "Clearance", labelBn: "ছাড়পত্র", value: "4-Generation Title Verification", valueBn: "৪ প্রজন্মের মালিকানা স্বত্ব অডিট" },
      { label: "Security", labelBn: "নিরাপত্তা", value: "Guaranteed Land Joint Ventures", valueBn: "শতভাগ নিরাপদ জয়েন্ট ভেঞ্চার চুক্তি" }
    ]
  }
];

export default function ExecutiveLeadershipBoard({ language, showToast }: ExecutiveLeadershipBoardProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>("saheb-ali");
  const [selectedChannelId, setSelectedChannelId] = useState<"voice" | "whatsapp" | "email">("voice");

  const leader = LEADERS_DATA.find((l) => l.id === selectedLeaderId) || LEADERS_DATA[0];
  const channel = leader.channels[selectedChannelId];

  return (
    <div className="space-y-12">
      {/* 4-Member Navigation Grid Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LEADERS_DATA.map((item) => {
          const isActive = item.id === selectedLeaderId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedLeaderId(item.id);
                setSelectedChannelId("voice");
                showToast(
                  `Active Profile: ${item.name}`,
                  `সক্রিয় প্রোফাইল: ${item.nameBn}`,
                  "info"
                );
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                isActive
                  ? "bg-[#1B4D3E] text-white border-[#C8A165] shadow-[0_15px_30px_rgba(27,77,62,0.15)] scale-[1.02]"
                  : "bg-white text-neutral-800 border-neutral-200 hover:border-[#1B4D3E]/40 hover:bg-[#FAF9F5]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-neutral-300 bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-[11px] font-bold truncate ${isActive ? "text-white" : "text-neutral-900"}`}>
                    {language === "en" ? item.name : item.nameBn}
                  </h4>
                  <p className={`text-[8.5px] font-mono tracking-wider truncate mt-0.5 ${isActive ? "text-[#C8A165]" : "text-neutral-500"}`}>
                    {language === "en" ? item.title : item.titleBn}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Panel */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#C8A165]/20 overflow-hidden shadow-[0_20px_50px_rgba(200,161,101,0.06)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLeaderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 items-center"
          >
            {/* Left Column: Portrait & Direct Desk Console */}
            <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center space-y-6">
              <div className="relative group">
                <div className="absolute -inset-2.5 rounded-2xl border border-dashed border-[#C8A165]/35 group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#1B4D3E]/10 to-[#C8A165]/10 opacity-70 blur-xs" />
                
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-neutral-100">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent p-5 text-center">
                    <p className="text-white text-lg font-serif font-bold tracking-wide">
                      {language === "en" ? leader.name : leader.nameBn}
                    </p>
                    <p className="text-[#C8A165] text-[10px] font-mono font-bold tracking-widest uppercase mt-1">Mollik Builders</p>
                  </div>
                  
                  {/* Verified delegate tag */}
                  <span className="absolute top-3 left-3 bg-[#1B4D3E]/90 text-[#C8A165] border border-[#C8A165]/40 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-widest flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED DELEGATE
                  </span>
                </div>
              </div>

              {/* Direct Media Desk Selector Console */}
              <div className="w-full max-w-sm bg-[#FAF9F5] border border-[#C8A165]/35 rounded-2xl p-4 space-y-3.5 shadow-md relative">
                <div className="absolute inset-x-0 -top-3 flex justify-center">
                  <span className="px-3 py-1 bg-[#1B4D3E] text-[#C8A165] border border-[#C8A165]/40 text-[7.5px] font-mono tracking-[0.25em] font-extrabold rounded-full uppercase leading-none shadow-md">
                    {language === "en" ? "DIRECT COMMUNICATION DESK" : "সরাসরি যোগাযোগ ডেস্ক"}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2 pt-2">
                  {[
                    { id: "voice" as const, icon: Phone, title: "Call Hotline", label: "হটলাইন" },
                    { id: "whatsapp" as const, icon: MessageSquare, title: "WhatsApp Messenger", label: "মেসেঞ্জার" },
                    { id: "email" as const, icon: Mail, title: "Official Mail", label: "ইমেইল" }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = selectedChannelId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedChannelId(item.id);
                          showToast(
                            `Channel updated: ${item.title}`,
                            `চ্যানেল পরিবর্তন: ${item.label}`,
                            "info"
                          );
                        }}
                        className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border ${
                          isActive 
                            ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-[0_4px_10px_rgba(27,77,62,0.2)] scale-105" 
                            : "bg-white text-neutral-600 border-neutral-200 hover:text-neutral-800 hover:border-[#1B4D3E]/30"
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-[#C8A165]" />
                        <span className="text-[7.5px] font-bold leading-none tracking-tighter mt-1">
                          {language === "en" ? item.label : item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* active channel details description sheet */}
                <div className="bg-white rounded-xl p-3.5 border border-[#C8A165]/20 text-left space-y-1.5 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wider block">
                      {language === "en" ? channel.label : channel.labelBn}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#1B4D3E]/10 text-[#1B4D3E] text-[7px] font-mono tracking-widest uppercase rounded font-bold">
                      ACTIVE CHNL
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-light leading-normal">
                    {language === "en" ? channel.desc : channel.descBn}
                  </p>
                  <a 
                    href={channel.url}
                    target={channel.url.startsWith("http") ? "_blank" : undefined}
                    rel={channel.url.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#1B4D3E] hover:text-[#C8A165] pt-1 transition-colors group/link"
                  >
                    <span>{channel.value}</span>
                    <span className="text-[9px] font-sans group-hover/link:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Bio, Detailed Covenants, Signature */}
            <div className="col-span-1 lg:col-span-7 space-y-6 md:space-y-8 text-neutral-800">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C8A165]" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1B4D3E]">
                    {language === "en" ? leader.badge : leader.badgeBn}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-neutral-900 leading-tight">
                  {language === "en" ? "Governance & Execution Excellence" : "পরিচালনা পর্ষদ ও আইনি নিশ্চয়তা"}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B4D3E]/5 rounded-full text-xs font-semibold text-[#1B4D3E] border border-[#1B4D3E]/10">
                  <Award className="w-3.5 h-3.5 text-[#C8A165]" />
                  <span>
                    {language === "en" ? leader.title : leader.titleBn}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 space-y-6">
                {/* quote box */}
                <div className="relative bg-[#FAF9F5] p-6 rounded-2xl border border-[#C8A165]/20 shadow-xs">
                  <span className="absolute top-2 right-4 text-5xl font-serif text-[#C8A165]/20 select-none">“</span>
                  <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-light italic relative z-10">
                    {language === "en" ? leader.bio : leader.bioBn}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">
                        {language === "en" ? leader.name : leader.nameBn}
                      </p>
                      <p className="text-[9px] text-[#C8A165] font-mono uppercase tracking-wider font-bold">
                        {language === "en" ? leader.title : leader.titleBn}
                      </p>
                    </div>
                    
                    {/* Signature */}
                    <div className="font-serif italic text-sm md:text-base text-[#1B4D3E]/80 tracking-widest font-black select-none pointer-events-none pr-2">
                      {language === "en" ? leader.signature : leader.signatureBn}
                    </div>
                  </div>
                </div>

                {/* Professional details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {leader.details.map((detail, idx) => (
                    <div 
                      key={`leader-detail-${idx}`}
                      className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1 shadow-xs"
                    >
                      <span className="block text-[8.5px] font-mono font-bold text-neutral-405 uppercase tracking-wider">
                        {language === "en" ? detail.label : detail.labelBn}
                      </span>
                      <p className="text-[10px] font-bold text-[#1B4D3E] font-sans leading-snug">
                        {language === "en" ? detail.value : detail.valueBn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Certification / compliance banner */}
                <div className="p-4 bg-gradient-to-r from-[#1B4D3E]/5 to-transparent rounded-2xl border border-[#1B4D3E]/10 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C8A165] shrink-0" />
                    <p className="text-[10.5px] text-neutral-600 font-light leading-relaxed">
                      {language === "en" 
                        ? "Verified corporate advisory protocols. Fully certified structural safety and documentation guarantees."
                        : "যাচাইকৃত কর্পোরেট উপদেষ্টা প্রোটোকল। শতভাগ সার্টিফাইড স্ট্রাকচারাল নিরাপত্তা ও ল্যান্ড ডিড গ্যারান্টি।"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
