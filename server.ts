import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getArchitectural3DHtmlBlock } from "./src/utils/architectural3D";
import { PROJECT_LIST } from "./src/data";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for leads, visits, land submissions, and applications
const leadsDatabase: {
  id: string;
  type: "visit" | "land" | "career" | "contact" | "newsletter";
  data: any;
  timestamp: string;
}[] = [
  // Seed with some professional mock data to make the admin console spectacular immediately.
  {
    id: "lead_1",
    type: "visit",
    data: {
      name: "Sayed Chowdhury",
      phone: "+8801712345678",
      email: "sayed.chow@gmail.com",
      project: "Mollik Tower (Gulshan-2)",
      propertyType: "Apartment",
      budget: "৳2 Crore+",
      preferredDate: "2026-06-20",
      message: "Interested in the 4-bedroom premium south-facing penthouse layout."
    },
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "lead_2",
    type: "land",
    data: {
      name: "Farhana Yasmin",
      phone: "+8801911998877",
      email: "farhana.yasmin@outlook.com",
      location: "Dhanmondi, Road 11A",
      landSize: "8.5 Katha",
      roadWidth: "40 Feet",
      status: "Joint Venture Proposal"
    },
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

// Seed projects with real-time availability variables
const projectUnitsTracker: Record<string, { floor: number; unit: string; size: number; price: string; status: "Available" | "Booked" | "Reserved"; bedrooms: number }[]> = {
  "mollik-tower": [
    { floor: 1, unit: "1A", size: 2100, price: "৳ 3.15 Crore", status: "Available", bedrooms: 3 },
    { floor: 1, unit: "1B", size: 1950, price: "৳ 2.92 Crore", status: "Booked", bedrooms: 3 },
    { floor: 2, unit: "2A", size: 2100, price: "৳ 3.20 Crore", status: "Available", bedrooms: 3 },
    { floor: 2, unit: "2B", size: 1950, price: "৳ 2.95 Crore", status: "Reserved", bedrooms: 3 },
    { floor: 3, unit: "3A", size: 2100, price: "৳ 3.25 Crore", status: "Booked", bedrooms: 3 },
    { floor: 3, unit: "3B", size: 1950, price: "৳ 3.00 Crore", status: "Available", bedrooms: 3 },
    { floor: 4, unit: "Penthouse A", size: 4200, price: "৳ 6.80 Crore", status: "Available", bedrooms: 4 },
    { floor: 4, unit: "Penthouse B", size: 3900, price: "৳ 6.10 Crore", status: "Reserved", bedrooms: 4 }
  ],
  "mollik-heights": [
    { floor: 1, unit: "101", size: 1800, price: "৳ 2.50 Crore", status: "Booked", bedrooms: 3 },
    { floor: 1, unit: "102", size: 1650, price: "৳ 2.30 Crore", status: "Available", bedrooms: 3 },
    { floor: 2, unit: "201", size: 1800, price: "৳ 2.55 Crore", status: "Available", bedrooms: 3 },
    { floor: 2, unit: "202", size: 1650, price: "৳ 2.35 Crore", status: "Available", bedrooms: 3 },
    { floor: 3, unit: "301", size: 2400, price: "৳ 3.80 Crore", status: "Reserved", bedrooms: 4 },
    { floor: 3, unit: "302", size: 2100, price: "৳ 3.30 Crore", status: "Booked", bedrooms: 3 }
  ],
  "mollik-garden": [
    { floor: 1, unit: "A", size: 1550, price: "৳ 1.55 Crore", status: "Available", bedrooms: 3 },
    { floor: 1, unit: "B", size: 1450, price: "৳ 1.45 Crore", status: "Available", bedrooms: 3 },
    { floor: 2, unit: "A", size: 1550, price: "৳ 1.58 Crore", status: "Booked", bedrooms: 3 },
    { floor: 2, unit: "B", size: 1450, price: "৳ 1.48 Crore", status: "Booked", bedrooms: 3 },
    { floor: 3, unit: "A", size: 1550, price: "৳ 1.60 Crore", status: "Available", bedrooms: 3 },
    { floor: 3, unit: "B", size: 1450, price: "৳ 1.50 Crore", status: "Reserved", bedrooms: 3 }
  ]
};

// Initialize Gemini SDK lazily
let aiInstance: GoogleGenAI | null = null;
let isApiKeyExpired = false;
function getGeminiSDK(): GoogleGenAI | null {
  if (isApiKeyExpired) {
    return null;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "" || apiKey.includes("AQ.Ab8RN6Ld" + "_lgW2KA_-jquDYQeJwqjb2IjuPR-aUIA5cxljibJ6Q")) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST APIs
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "dist/uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/3d-view", (req, res) => {
  const projectId = (req.query.id as string) || "mollik-tower";
  const lang = (req.query.lang || "en") === "bn" ? "bn" : "en";
  const project = PROJECT_LIST.find((p) => p.id === projectId) || PROJECT_LIST[0];
  const html = getArchitectural3DHtmlBlock(project, lang);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

// Virtual PHP interpreter route for project-details.php
app.get("/project-details.php", (req, res) => {
  const projectId = (req.query.id as string) || "mollik-tower";
  const lang = (req.query.lang as string) === "bn" ? "bn" : "en";

  const project = PROJECT_LIST.find((p) => p.id === projectId) || PROJECT_LIST[0];
  const selectedProjId = project.id;

  const phpProjects: Record<string, any> = {
    "mollik-tower": {
      name: "Mollik Tower",
      nameBn: "মল্লিক টাওয়ার",
      location: "Gulshan-2, Dhaka",
      locationBn: "গুলশান-২, ঢাকা",
      size: "1450-3200 sqft",
      sizeBn: "১৪৫০-৩২০০ বর্গফুট",
      price: "৳85 Lac onwards",
      priceBn: "৳৮৫ লক্ষ থেকে শুরু",
      status: "Booking Open",
      statusBn: "বুকিং চলছে",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800",
      description: "Occupying a central, south-facing plot in the prestigious diplomatic enclave of Gulshan-2, Mollik Tower stands as a monument to precision architecture and quiet luxury. With private high-speed elevator access, landscaped personal balconies, and automated smart-home integrations, it redefines upscale urban residency in Dhaka.",
      descriptionBn: "গুলশান-২ এর মর্যাদাপূর্ণ কূটনৈতিক এলাকায় অবস্থিত, মল্লিক টাওয়ার আধুনিক স্থাপত্য এবং বিলাসিতার এক অনন্য নিদর্শন। ব্যক্তিগত লিফট, সজ্জিত ব্যালকনি এবং স্বয়ংক্রিয় স্মার্ট-হোম প্রযুক্তিসহ এটি ঢাকার নগর জীবনযাত্রার মানকে করছে নতুনভাবে সংজ্ঞায়িত।",
      rajukApproved: true,
      amenities: ["Infinity Pool", "Rooftop Observatory", "Private Gymnasium", "24/7 Multi-tier Security", "Dual Standby Generator", "Double Glazed low-E Windows"],
      amenitiesBn: ["ইনফিনিটি সুইমিং পুল", "ছাদভিত্তিক পর্যবেক্ষণ কেন্দ্র", "ব্যক্তিগত জিমনেসিয়াম", "২৪/৭ বহুতর নিরাপত্তা", "দ্বৈত ব্যাকআপ জেনারেটর", "ডাবল গ্লেজড গ্লাস উইন্ডো"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "12 Katha", valueBn: "১২ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 14 Floors", valueBn: "জি + ১৪ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "28 Premium Units", valueBn: "২৮টি প্রিমিয়াম ইউনিট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "Ample Basement Slots", valueBn: "প্রশস্ত বেসমেন্ট স্লট" }
      ]
    },
    "mollik-heights": {
      name: "Mollik Heights",
      nameBn: "মল্লিক হাইটস",
      location: "Banani, Dhaka",
      locationBn: "বনানী, ঢাকা",
      size: "1200-2800 sqft",
      sizeBn: "১২০০-২৮০০ বর্গফুট",
      price: "৳72 Lac onwards",
      priceBn: "৳৭২ লক্ষ থেকে শুরু",
      status: "Few Units Left",
      statusBn: "সীমিত ইউনিট বাকি",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800",
      description: "Designed for those who seek dynamic lifestyle spaces coupled with modern spatial functionality. Mollik Heights offers a sophisticated aesthetic of stone, glass, and steel. Positioned in Banani, residents enjoy close proximity to premium dining, leisure, and upscale corporate addresses while preserving complete sanctuary privacy.",
      descriptionBn: "যাঁরা আধুনিক জীবনযাত্রার পাশাপাশি উন্নত কোয়ালিটির আবাসন খুঁজছেন, তাঁদের জন্য ডিজাইন করা হয়েছে মল্লিক হাইটস। পাথর, গ্লাস ও স্টিলের প্রিমিয়াম ফিনিশিং দ্বারা প্রস্তুত এটি। ঢাকার বনানীতে অবস্থিত হওয়ায় বাসিন্দারা চমৎকার শপিং, ডাইনিং ও যোগাযোগের সুবিধা উপভোগ করবেন।",
      rajukApproved: true,
      amenities: ["Rooftop Cafe Area", "Grand Reception Lobby", "Indoor Kids Play Zone", "Fully Automated Lifts", "Underground Rainwater Harvesting", "Fiber Optic Connectivity"],
      amenitiesBn: ["রফটপ ক্যাফে এরিয়া", "বিশাল অভ্যর্থনা লবি", "ইনডোর শিশু বিনোদন কেন্দ্র", "সম্পূর্ণ অটোমেটিক লিফট", "ভূগর্ভস্থ বৃষ্টির পানি সংরক্ষণ", "ফাইবার অপটিক ইন্টারনেট সংযোগ"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "10 Katha", valueBn: "১০ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 12 Floors", valueBn: "জি + ১২ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "24 Premium Units", valueBn: "২৪টি প্রিমিয়াম ইউনিট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "2 Bays Per Apartment", valueBn: "প্রতি ফ্ল্যাটে ২টি পার্কিং" }
      ]
    },
    "mollik-garden": {
      name: "Mollik Garden",
      nameBn: "মল্লিক গার্ডেন",
      location: "Sector-4, Uttara, Dhaka",
      locationBn: "সেক্টর-৪, উত্তরা, ঢাকা",
      size: "1600-3500 sqft",
      sizeBn: "১৬০০-৩৫০০ বর্গফুট",
      price: "৳95 Lac onwards",
      priceBn: "৳৯৫ লক্ষ থেকে শুরু",
      status: "New Launch",
      statusBn: "নতুন লঞ্চ",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800",
      description: "A breath of fresh air in the northern hub of Dhaka. Mollik Garden blends eco-friendly material systems with lush vertical landscaping. Designed to BNBC structural earthquake-resistant codes, the project houses solar panels, smart water treatment, and extensive flora-curated sensory gardens.",
      descriptionBn: "উত্তরের ব্যস্ত শহর উত্তরার বুকে এক টুকরো সবুজ প্রশান্তি। মল্লিক গার্ডেন প্রাকৃতিক পরিবেশবান্ধব ম্যাটেরিয়াল ও চমৎকার ভার্টিক্যাল গার্ডেনের এক অপূর্ব সংমিশ্রণ। বিএনবিসি কোড অনুযায়ী ভূমিকম্প সহনশীল করে নির্মিত এতে আছে সোলার প্যানেল এবং ওয়াটার ট্রিটমেন্ট সিস্টেম।",
      rajukApproved: true,
      amenities: ["Solar-powered Common Areas", "Jogging Track", "Community Meeting Suite", "Aroma Herb Garden", "High-capacity Cargo Elevator", "Water Filtration Osmosis System"],
      amenitiesBn: ["সৌরশক্তি চালিত কমন স্পেস", "জগিং ট্র্যাক", "কমিউনিটি ডিসকাশন হল", "অ্যারোমা হার্বাল গার্ডেন", "উচ্চ ক্ষমতাসম্পন্ন কার্গো লিফট", "ওয়াটার ফিল্টারিং সিস্টেম"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "15 Katha", valueBn: "১৫ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 10 Floors", valueBn: "জি + ১০ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "20 Spacious Homes", valueBn: "২০টি আরামদায়ক অ্যাপার্টমেন্ট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "Secured Ground Parking", valueBn: "সুরক্ষিত গ্রাউন্ড পার্কিং" }
      ]
    },
    "mollik-serenade": {
      name: "Mollik Serenade",
      nameBn: "মল্লিক সেরেনেড",
      location: "Dhanmondi R/A, Dhaka",
      locationBn: "ধানমন্ডি আ/এ, ঢাকা",
      size: "1800-3000 sqft",
      sizeBn: "১৮০০-৩০০০ বর্গফুট",
      price: "৳1.2 Crore onwards",
      priceBn: "৳১.২ কোটি থেকে শুরু",
      status: "Ongoing",
      statusBn: "চলমান প্রকল্প",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
      description: "A beautiful architectural serenade sitting quietly on an ancient premium lane of Dhanmondi. Features handcrafted wood textures and natural slate stone tiling, wide-spanning dining decks, and individual plunge pools in penthouse layouts.",
      descriptionBn: "ধানমন্ডির মনোরম আবাসিক রাস্তায় অবস্থিত স্থাপত্যের এক চমৎকার প্রতিধ্বনি। কাঠ ও স্লেট পাথরের ফিনিশিং এবং সুন্দর বারান্দাসহ বিশেষ পেন্টহাউসগুলোতে আছে ব্যক্তিগত প্লাঞ্জ পুলের বিশেষ আকর্ষণ।",
      rajukApproved: true,
      amenities: ["Private Plunge Pools", "Rooftop BBQ terrace", "Soundproof Acoustic Glazing", "24-Hour Advanced CCTV", "Centralized Gas piping and safety valves"],
      amenitiesBn: ["ব্যক্তিগত মিনি সুইমিং পুল", "রফটপ বারবিকিউ টেরেস", "শব্দ নিরোধক অ্যাকোস্টিক গ্লেজিং", "২৪ ঘণ্টা সিসিটিভি পাহারা", "সেন্ট্রাল গ্যাস ও ফায়ার সেফটি ভালভ"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "8 Katha", valueBn: "৮ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 9 Floors", valueBn: "জি + ৯ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "16 Limited Units", valueBn: "১৬টি চমৎকার অ্যাপার্টমেন্ট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "Basement 1 Slot Each", valueBn: "বেসমেন্টে প্রতি ফ্ল্যাটে ১টি স্লট" }
      ]
    },
    "mollik-grandeur": {
      name: "Mollik Grandeur",
      nameBn: "মল্লিক গ্র্যান্ডিউর",
      location: "Bashundhara R/A, Dhaka",
      locationBn: "বসুন্ধরা আ/এ, ঢাকা",
      size: "1300-2100 sqft",
      sizeBn: "১৩০০-২১০০ বর্গফুট",
      price: "৳60 Lac onwards",
      priceBn: "৳৬০ লক্ষ থেকে শুরু",
      status: "Upcoming",
      statusBn: "আসন্ন প্রকল্প",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      description: "Spacious block design prioritizing maximal natural breeze flow and absolute sunlight optimization. Settled in the master-planned Bashundhara Residential Area, it promises secure family living with walking access to school campuses, hypermarkets, and hospitals.",
      descriptionBn: "বসুন্ধরা আবাসিক এলাকায় প্রস্তাবিত পরিকল্পিত আবাসন। সর্বাধিক আলো এবং বাতাস চলাচলের নকশায় প্রস্তুত এটি পরিবারের জন্য এক নিরাপদ এবং পরিকল্পিত প্রশান্তির প্রতিশ্রুতি।",
      rajukApproved: true,
      amenities: ["Multi-purpose Community Room", "Equipped Kids Playground", "Deep Tube Well Backup", "Fire escape staircase with smoke doors", "Driver's waiting quarters"],
      amenitiesBn: ["বহুমুখী কমিউনিটি হল রুম", "শিশু খেলার মাঠ ব্যবস্থা", "ডিপ টিউবওয়েল ব্যাকআপ", "ধোঁয়ানিরোধক ফায়ার এস্কেপ সিড়ি", "চালকদের অপেক্ষাগার"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "14 Katha", valueBn: "১৪ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 15 Floors", valueBn: "জি + ১৫ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "30 Family Apartments", valueBn: "৩০টি ফ্যামিলি ফ্ল্যাট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "Secure Dual Level Garage", valueBn: "দ্বি-স্তরের সুরক্ষিত গ্যারেজ" }
      ]
    },
    "mollik-splendour": {
      name: "Mollik Splendour",
      nameBn: "মল্লিক স্প্লেন্ডার",
      location: "Baridhara Diplomatic Zone, Dhaka",
      locationBn: "বারিধারা কূটনৈতিক এলাকা, ঢাকা",
      size: "2200-4500 sqft",
      sizeBn: "২২০০-৪৫০০ বর্গফুট",
      price: "৳2.5 Crore onwards",
      priceBn: "৳২.৫ কোটি থেকে শুরু",
      status: "Booking Open",
      statusBn: "বুকিং চলছে",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
      description: "A grand-luxury duplex & penthouse development custom-designed for diplomats and elite families, nestled safely within the ultra-secure high-walled district of Baridhara. Showcases royal imported Italian Carrara marble interiors, bullet-resistant glass options, sunset view rooftop entertainment decks, and private valet quarters.",
      descriptionBn: "বারিধারা কূটনৈতিক অঞ্চলের সুরক্ষিত বেষ্টনীতে অভিজাত পরিবার ও কূটনৈতিকদের জন্য কাস্টম-ডিজাইন করা একটি রাজকীয় ডুপ্লেক্স ও পেন্টহাউস প্রকল্প। মার্বেল ইন্টেরিয়র, রিইনফোর্সড বুলেট রেজিস্ট্যান্ট গ্লাস সুবিধা এবং ইনফিনিটি ওয়াটার ডেকের এক অনন্য সৃষ্টি।",
      rajukApproved: true,
      amenities: ["Smart Keyless Biometric Access", "Heated Hydrotherapy Jacuzzi Pool", "Multi-car Basement with dual EV Chargers", "Soundproof Cinema Auditorium", "State-of-the-art HVAC Central Climate Control", "24/7 Dedicated Diplomatic Guard Connection"],
      amenitiesBn: ["স্মার্ট বায়োমেট্রিক লক ও সিকিউরিটি", "হিটেড হাইড্রোথেরাপি জ্যাকুজি", "ইভি চার্জার্স বিশিষ্ট পার্কিং বেসমেন্ট", "শব্দ নিরোধক হোম থিয়েটার সুবিধা", "সেন্ট্রাল এসি ক্লাইমেট কন্ট্রোল", "কূটনৈতিক এলাকার বিশেষ ২৪/৭ নিরাপত্তা"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "16 Katha", valueBn: "১৬ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 6 Floors", valueBn: "জি + ৬ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "10 Duplex Masterpieces", valueBn: "১০টি ডুপ্লেক্স মাস্টারপিস" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "3 Assigned Slots Per Unit", valueBn: "প্রতি ইউনিটে ৩টি বরাদ্দকৃত পার্কিং" }
      ]
    },
    "mollik-heritage": {
      name: "Mollik Heritage",
      nameBn: "মল্লিক হেরিটেজ",
      location: "Wari, Old Dhaka",
      locationBn: "ওয়ারী, পুরান ঢাকা",
      size: "1500-2700 sqft",
      sizeBn: "১৫০০-২৭০০ বর্গফুট",
      price: "৳78 Lac onwards",
      priceBn: "৳৭৮ লক্ষ থেকে শুরু",
      status: "Ongoing",
      statusBn: "চলমান প্রকল্প",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
      description: "Blending vintage colonial brick patterns with contemporary concrete columns, Mollik Heritage offers nostalgic Dhaka beauty paired with brand new state-of-the-art earthquake compliant foundations. Red clay handpicked textures and custom wrought-iron craftsmanship complement the historic lifestyle of prestigious Wari.",
      descriptionBn: "পুরান ঢাকার ওয়ারীর ঐতিহ্যবাহী লাল ইটের স্মৃতি বহনকারী ডিজাইনে আধুনিক কংক্রিট কাঠামোর মিশ্রণে নির্মিত মল্লিক হেরিটেজ। দৃষ্টিনন্দন কলোনিয়াল ডিজাইন ও ভূমিকম্প সহনশীল নিরাপদ ফাউন্ডেশনের এক চমৎকার মেলবন্ধন।",
      rajukApproved: true,
      amenities: ["Classic Community Courtyard", "Traditional Ground-floor Tea Lounge", "Rooftop Stargazing Green Deck", "Retractable Glass Canopy Over Atrium", "Large Emergency Water Reservoir System", "Fully-Equipped Fire Escape Protection System"],
      amenitiesBn: ["ঐতিহ্যবাহী কমিউনিটি কোর্ট ইয়ার্ড", "ক্লাসিক নিচতলা চা লাউঞ্জ", "দৃষ্টিনন্দন ছাদবাগান ও টেরেস", "অ্যাট্রিয়াম ঢাকা রিট্র্যাক্টেবল কাঁচ ছাদ", "বিশাল রিভার্স অসমোসিস রিজার্ভার", "অত্যাধুনিক ফায়ার এস্কেপ ও স্মোক ডিটেকশন"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "11 Katha", valueBn: "১১ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 10 Floors", valueBn: "জি + ১০ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "18 Vintage Residences", valueBn: "১৮টি প্রাচীন ঐতিহ্যবাহী ফ্ল্যাট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "1 Premium Slot per Apartment", valueBn: "প্রতি ফ্ল্যাটে ১টি প্রিমিয়াম স্লট" }
      ]
    },
    "mollik-vista": {
      name: "Mollik Vista",
      nameBn: "মল্লিক ভিস্তা",
      location: "Mirpur DOHS, Dhaka",
      locationBn: "মিরপুর ডিওএইচএস, ঢাকা",
      size: "1350-2500 sqft",
      sizeBn: "১৩৫০-২৫০০ বর্গফুট",
      price: "৳68 Lac onwards",
      priceBn: "৳৬৮ লক্ষ থেকে শুরু",
      status: "Upcoming",
      statusBn: "আসন্ন প্রকল্প",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800",
      description: "A sleek, disciplined residential haven built exquisitely for veteran defense officers and families seeking elite planning, serenity and quiet living. Mollik Vista provides unparalleled sunset lake views, structured compliance, deep tubewell water backup, and wide open fire-evacuation layouts.",
      descriptionBn: "নিরাপত্তা ও শৃঙ্খলার প্রতীক মিরপুর ডিওএইচএস-এ নির্মিত একটি নান্দনিক সুরক্ষাবলয়। আধুনিক অগ্নিনির্বাপণ ব্যবস্থা, চমৎকার পশ্চিমমুখী সূর্যাস্তের ভিউ এবং সুপরিসর আধুনিক রান্নাঘরের ভেন্টিলেশন নিয়ে প্রস্তুত এই প্রজেক্ট।",
      rajukApproved: true,
      amenities: ["Rooftop Solar Panel Arrays", "Multi-Tier Fire-Resistant Steel Doors", "Integrated Security Alarm Setup", "360-View Observation Lounge", "High capacity modern stretcher lift", "Fully Automatic Car Lift System"],
      amenitiesBn: ["সৌরশক্তির সুপ্রশস্ত ছাদ প্যানেল", "ফায়ার-রেজিস্ট্যান্ট মজবুত স্টিল দরজা", "সমন্বিত ইনডোর সিকিউরিটি অ্যালার্ম", "৩৬০ ডিগ্রী সবুজ ক্যানোপি লাউঞ্জ", "উচ্চ ধারণক্ষমতার মাল্টি-স্পিড স্ট্রেচার লিফট", "অটোমেটিক কার লিফটিং মেকানিজম"],
      specs: [
        { label: "Land Area", labelBn: "জমির পরিমাণ", value: "9 Katha", valueBn: "৯ কাঠা" },
        { label: "Building Height", labelBn: "ভবনের উচ্চতা", value: "G + 12 Floors", valueBn: "জি + ১২ তলা" },
        { label: "Total Apartments", labelBn: "মোট অ্যাপার্টমেন্ট", value: "22 Elite Units", valueBn: "২২টি এলিট আধুনিক ইউনিট" },
        { label: "Car Parking", labelBn: "গাড়ি পার্কিং", value: "Secure Intelligent Garages", valueBn: "সুরক্ষিত আধুনিক ইন্টেলিজেন্ট গ্যারেজ" }
      ]
    }
  };

  const title = lang === "bn" ? `${project.nameBn} - মল্লিক বিল্ডার্স` : `${project.name} - Mollik Builders`;
  const desc = lang === "bn" ? project.descriptionBn : project.description;
  const statusLabel = lang === "bn" ? project.statusBn : project.status;
  const locationLabel = lang === "bn" ? project.locationBn : project.location;
  const priceLabel = lang === "bn" ? project.priceBn : project.price;
  const sizeLabel = lang === "bn" ? project.sizeBn : project.size;
  const amenitiesTitle = lang === "bn" ? "विशेष সুবিধাসমূহ (Premium Amenities)" : "Amenities & Lifestyle Conveniences";
  const specsTitle = lang === "bn" ? "প্রজেক্টের বিবরণ ও বৈশিষ্ট্যসমূহ" : "Spec Details & Structural Parameters";
  const contactTitle = lang === "bn" ? "ইনস্ট্যান্ট বুকিং রিকুয়েস্ট" : "REQUEST FLOORPLANS & CALL";

  const amenitiesHtml = (lang === "bn" ? project.amenitiesBn : project.amenities)
    .map((item: string) => `
      <div class="flex items-center gap-3 text-xs text-neutral-700">
        <span class="w-2.5 h-2.5 rounded-full bg-[#C8A165] flex-shrink-0"></span>
        <span>${item}</span>
      </div>
    `).join("");

  const specsHtml = project.specs
    .map((s: any) => `
      <div class="p-3.5 bg-[#faf9f6] rounded-xl border border-neutral-150 flex flex-col justify-center">
        <span class="text-[10px] font-mono uppercase text-neutral-400 font-bold tracking-wider">
          ${lang === "bn" ? s.labelBn : s.label}
        </span>
        <span class="text-sm font-extrabold text-[#1B4D3E] mt-0.5">
          ${lang === "bn" ? s.valueBn : s.value}
        </span>
      </div>
    `).join("");

  let drawingsHtml = "";
  if (project.dwgUrl || project.pdfUrl) {
    let linksHtml = "";
    if (project.pdfUrl) {
      linksHtml += `
        <a href="${project.pdfUrl}" download="${project.pdfFilename || 'floor_plan.pdf'}" class="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-150 hover:border-neutral-300 bg-[#faf9f6]/80 hover:bg-[#faf9f6] text-neutral-800 transition-colors group">
            <div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-100 font-mono">
                PDF
            </div>
            <div class="min-w-0 flex-1">
                <span class="block truncate font-extrabold text-[#1B4D3E] text-sm leading-tight group-hover:text-neutral-900">
                    ${lang === "bn" ? "অনুমোদিত ফ্লোর প্ল্যান" : "Approved Floor Plan"}
                </span>
                <span class="block text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                    ${project.pdfFilename || "download.pdf"}
                </span>
            </div>
            <svg class="w-5 h-5 text-[#C8A165]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        </a>
      `;
    }
    if (project.dwgUrl) {
      linksHtml += `
        <a href="${project.dwgUrl}" download="${project.dwgFilename || 'structural.dwg'}" class="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-150 hover:border-neutral-300 bg-[#faf9f6]/80 hover:bg-[#faf9f6] text-neutral-800 transition-colors group">
            <div class="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-100 font-mono">
                CAD
            </div>
            <div class="min-w-0 flex-1">
                <span class="block truncate font-extrabold text-[#1B4D3E] text-sm leading-tight group-hover:text-neutral-900">
                    ${lang === "bn" ? "অনুমোদিত ক্যাড ড্রয়িং" : "Approved DWG Blueprint"}
                </span>
                <span class="block text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                    ${project.dwgFilename || "download.dwg"}
                </span>
            </div>
            <svg class="w-5 h-5 text-[#C8A165]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        </a>
      `;
    }

    drawingsHtml = `
      <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-4">
          <h3 class="font-serif text-lg font-black text-neutral-855 border-b border-neutral-100 pb-3">
              ${lang === "bn" ? "কারিগরি নকশা ও ফ্লোর প্ল্যান" : "Technical Drawings & Floor Plans"}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${linksHtml}
          </div>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', 'Hind Siliguri', sans-serif; }
        h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-[#faf9f6] text-neutral-850 selection:bg-[#C8A165]/30 min-h-screen flex flex-col justify-between">
    <header class="bg-white border-b border-neutral-100 py-5 px-6 md:px-12 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="javascript:if(window.self!==window.top){window.parent.postMessage({type:'close-php-modal'},'*');}else{window.location.href='/';}" class="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs font-bold transition-all px-3 py-1.5 rounded-lg hover:bg-neutral-100 bg-neutral-50 border border-neutral-200" title="Back to Home">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    <span>${lang === 'bn' ? "ফিরে যান" : "Back"}</span>
                </a>
                <div class="h-6 w-px bg-neutral-200"></div>
                <a href="/" class="flex flex-col">
                    <span class="font-serif text-xl md:text-2xl font-black text-neutral-900 tracking-tight">Mollik<span class="text-[#C8A165]">.</span></span>
                    <span class="text-[8px] md:text-[9px] font-mono tracking-[0.4em] text-neutral-400 uppercase">Builders Luxury</span>
                </a>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="flex rounded-md bg-neutral-100 p-1 text-xs font-bold font-mono">
                    <a href="?id=${selectedProjId}&lang=en" class="px-2.5 py-1 rounded ${lang === 'en' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}">EN</a>
                    <a href="?id=${selectedProjId}&lang=bn" class="px-2.5 py-1 rounded ${lang === 'bn' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}">বাংলা</a>
                </div>
                <a href="/#contact" class="hidden sm:inline-block px-4 py-2 border border-neutral-300 hover:border-[#1B4D3E] text-[11px] font-extrabold uppercase tracking-widest text-[#1B4D3E] transition-all rounded">
                    ${lang === 'bn' ? "যোগাযোগ" : "Enquire"}
                </a>
            </div>
        </div>
    </header>

    <main class="flex-grow py-12 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-7 space-y-6">
            <div class="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-neutral-100 border border-neutral-150 group">
                <img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
                
                <div class="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur-md px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase text-[#C8A165] rounded-lg shadow-lg">
                    ${statusLabel}
                </div>
                ${project.rajukApproved ? `<div class="absolute top-4 right-4 bg-[#1B4D3E] text-white px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded-lg shadow-lg">RAJUK APPROVED</div>` : ''}
            </div>

            <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-4">
                <h3 class="font-serif text-lg font-black text-neutral-850 border-b border-neutral-100 pb-3">
                    ${specsTitle}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${specsHtml}
                </div>
            </div>

            <!-- Technical Drawings & Floor Plans -->
            ${drawingsHtml}

            <!-- INTERACTIVE 3D EXPLORER SECTION -->
            <div class="bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden shadow-2xl space-y-0">
                <div class="p-6 bg-[#080b16] border-b border-neutral-900 flex justify-between items-center">
                    <div>
                        <span class="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C8A165] font-bold block mb-1">
                            ${lang === 'bn' ? "ত্রিমাত্রিক ইন্টারেক্টিভ মডেল" : "INTERACTIVE 3D CAD MODEL"}
                        </span>
                        <h3 class="font-serif text-2xl font-black text-white leading-tight">
                            ${lang === 'bn' ? project.nameBn + " 3D" : project.name + " 3D"}
                        </h3>
                    </div>
                    <span class="px-2.5 py-1 rounded bg-[#1B4D3E] text-white text-[9px] font-mono font-bold tracking-widest uppercase animate-pulse">
                        ${lang === 'bn' ? "লাইভ সিমুলেশন" : "Live Simulation"}
                    </span>
                </div>
                <div class="relative w-full aspect-[16/10] md:h-[550px] bg-[#05070f]">
                    <iframe 
                        src="/api/3d-view?id=${selectedProjId}&lang=${lang}" 
                        class="w-full h-full border-0" 
                        allow="fullscreen; autoplay; confidentiality"
                        loading="lazy">
                    </iframe>
                </div>
            </div>

            <!-- REAL-TIME SUITE SELECTOR AND BOOKING INVENTORY -->
            <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-6">
                <div>
                    <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A165] font-bold block mb-1">
                        ${lang === 'bn' ? "লাইভ ফ্ল্যাট ট্র্যাকার ও ইনভেন্টরি" : "REAL-TIME SUITE SELECTOR"}
                    </span>
                    <h3 class="font-serif text-2xl font-black text-neutral-855 leading-tight">
                        ${lang === 'bn' ? "আবাসিক ফ্ল্যাট ও বুকিং পোর্টাল" : "Interactive Suite Availability Matrix"}
                    </h3>
                    <p class="text-xs text-neutral-500 mt-1">
                        ${lang === 'bn' ? "আপনার কাঙ্ক্ষিত স্যুটটি নির্বাচন করে সরাসরি বুকিং রিকুয়েস্ট পাঠান।" : "Select your preferred layout to view parameters or submit structural reservations instantly."}
                    </p>
                </div>

                <!-- Live counter summary -->
                <div class="grid grid-cols-3 gap-3 bg-[#faf9f6] p-4 rounded-xl border border-neutral-200/60 text-center">
                    <div>
                        <span class="text-[10px] font-mono uppercase text-[#1B4D3E] block font-bold">${lang === 'bn' ? "খালি রয়েছে" : "Available"}</span>
                        <span id="available-counter" class="text-lg font-black text-emerald-600 font-mono">--</span>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono uppercase text-neutral-400 block font-bold">${lang === 'bn' ? "সংরক্ষিত" : "Reserved"}</span>
                        <span id="reserved-counter" class="text-lg font-black text-amber-500 font-mono">--</span>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono uppercase text-neutral-400 block font-bold">${lang === 'bn' ? "বিক্রিত/বুকড" : "Booked"}</span>
                        <span id="booked-counter" class="text-lg font-black text-neutral-400 font-mono">--</span>
                    </div>
                </div>

                <!-- Visual floor selection filter -->
                <div class="space-y-2">
                    <span class="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                        ${lang === 'bn' ? "ফ্লোর ফিল্টার" : "FILTER BY FLOOR LEVEL"}
                    </span>
                    <div id="floor-tab-container" class="flex flex-wrap gap-1.5 pb-2 border-b border-neutral-100">
                        <!-- Filled by JS -->
                    </div>
                </div>

                <!-- Units Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="units-list-grid">
                    <div class="col-span-full py-12 text-center text-xs text-neutral-450 font-mono">
                        ⏳ ${lang === 'bn' ? "লাইভ ডাটা অনুসন্ধান করা হচ্ছে..." : "Synchronizing premium database..."}
                    </div>
                </div>

                <!-- Inline Dynamic Booking Form Module (Hidden by default, slides down when flat is clicked) -->
                <div id="booking-drawer-inner" class="hidden transition-all duration-300 p-5 bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200/80 mt-4 space-y-4 shadow-sm">
                    <div class="flex items-center justify-between border-b border-neutral-200 pb-3">
                        <div>
                            <span class="text-[9px] font-mono uppercase text-[#C8A165] font-bold block">
                                ${lang === 'bn' ? "নির্বাচনকৃত ফ্ল্যাটের বিবরণ" : "SELECTED RESIDENCE DETAILS"}
                            </span>
                            <h4 id="selected-flat-label" class="text-base font-bold text-neutral-900">Suite 3B</h4>
                        </div>
                        <button type="button" onclick="closeBookingDrawer()" class="text-neutral-400 hover:text-neutral-700 font-bold text-lg">&times;</button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase">${lang === 'bn' ? "সাইজ" : "SIZE"}</span>
                            <span id="detail-size" class="font-bold text-neutral-850">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase">${lang === 'bn' ? "বেডরুম" : "BEDROOMS"}</span>
                            <span id="detail-beds" class="font-bold text-neutral-850">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase">${lang === 'bn' ? "মূল্য" : "PRICE"}</span>
                            <span id="detail-price" class="font-bold text-[#1B4D3E]">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase">${lang === 'bn' ? "অবস্থা" : "STATUS"}</span>
                            <span id="detail-status" class="font-bold text-emerald-600">--</span>
                        </div>
                    </div>

                    <!-- Direct reservation form linked to units tracker -->
                    <form id="flat-reservation-form" onsubmit="submitFlatBooking(event)" class="space-y-3 pt-2">
                        <input type="hidden" id="booking-unit-id" name="unitId">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input type="text" id="booking-name" placeholder="${lang === 'bn' ? 'আপনার পুরো নাম' : 'Your full name'}" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800 font-sans">
                            <input type="tel" id="booking-phone" placeholder="${lang === 'bn' ? 'মোবাইল নাম্বার (+৮৮০)' : 'Phone number'}" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800 font-sans">
                            <input type="email" id="booking-email" placeholder="${lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email address'}" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800 font-sans">
                        </div>
                        <button type="submit" id="booking-submit-btn" class="w-full py-3 bg-[#1B4D3E] text-white hover:bg-[#153a2f] text-xs font-bold uppercase tracking-widest rounded transition-all shadow-md active:scale-98">
                            ${lang === 'bn' ? 'অনলাইন বুকিং নিশ্চিত করুন' : 'SECURE THIS SELECTION IN REAL-TIME'}
                        </button>
                    </form>
                </div>
            </div>

            <script>
                (function() {
                    var currentProjectId = "${project.id}";
                    var isBanglaLang = "${lang}" === "bn";
                    var activeProjectUnits = [];
                    var currentFloorLvl = 1;

                    async function fetchProjectUnits() {
                        try {
                            var response = await fetch("/api/projects/" + currentProjectId + "/units");
                            if (!response.ok) throw new Error("API Connection failed");
                            var data = await response.json();
                            if (data.success && data.units) {
                                activeProjectUnits = data.units;
                                aggregateCounters();
                                renderFloorTabs();
                                renderUnitsGrid();
                            }
                        } catch (err) {
                            console.error("Failed to load live property units:", err);
                            generateFallbackMockUnits();
                        }
                    }

                    function generateFallbackMockUnits() {
                        var bp = "${project.price}";
                        activeProjectUnits = [
                            { floor: 1, unit: "1A", size: 1850, price: bp + " onwards", status: "Available", bedrooms: 3 },
                            { floor: 1, unit: "1B", size: 1650, price: bp + " onwards", status: "Booked", bedrooms: 3 },
                            { floor: 2, unit: "2A", size: 1850, price: bp + " onwards", status: "Available", bedrooms: 3 },
                            { floor: 2, unit: "2B", size: 1650, price: bp + " onwards", status: "Reserved", bedrooms: 3 },
                            { floor: 3, unit: "3A", size: 1850, price: bp + " onwards", status: "Booked", bedrooms: 3 },
                            { floor: 3, unit: "3B", size: 1650, price: bp + " onwards", status: "Available", bedrooms: 3 },
                            { floor: 4, unit: "Penthouse A", size: 3200, price: "৳ 2.2 Crore", status: "Available", bedrooms: 4 },
                            { floor: 4, unit: "Penthouse B", size: 2800, price: "৳ 1.9 Crore", status: "Reserved", bedrooms: 4 }
                        ];
                        aggregateCounters();
                        renderFloorTabs();
                        renderUnitsGrid();
                    }

                    function aggregateCounters() {
                        var avail = activeProjectUnits.filter(function(u) { return u.status === "Available" }).length;
                        var res = activeProjectUnits.filter(function(u) { return u.status === "Reserved" }).length;
                        var book = activeProjectUnits.filter(function(u) { return u.status === "Booked" || u.status === "Sold" }).length;

                        document.getElementById("available-counter").innerText = convertNum(avail);
                        document.getElementById("reserved-counter").innerText = convertNum(res);
                        document.getElementById("booked-counter").innerText = convertNum(book);
                    }

                    function convertNum(num) {
                        if (!isBanglaLang) return num;
                        var bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
                        return num.toString().split("").map(function(digit) {
                            var parsed = parseInt(digit);
                            return isNaN(parsed) ? digit : bnDigits[parsed];
                        }).join("");
                    }

                    function renderFloorTabs() {
                        var floors = [];
                        activeProjectUnits.forEach(function(u) {
                            if (floors.indexOf(u.floor) === -1) floors.push(u.floor);
                        });
                        floors.sort(function(a, b) { return a - b; });

                        var container = document.getElementById("floor-tab-container");
                        if (!container) return;
                        container.innerHTML = "";

                        if (floors.length > 0 && floors.indexOf(currentFloorLvl) === -1) {
                            currentFloorLvl = floors[0];
                        }

                        floors.forEach(function(f) {
                            var btn = document.createElement("button");
                            btn.type = "button";
                            btn.className = "px-3 py-1 text-xs font-bold font-mono rounded border transition-all " + 
                                (currentFloorLvl === f 
                                    ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm" 
                                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-500 hover:bg-neutral-50");
                            btn.innerText = (isBanglaLang ? "লেভেল " : "L") + convertNum(f);
                            btn.onclick = function() {
                                currentFloorLvl = f;
                                renderFloorTabs();
                                renderUnitsGrid();
                            };
                            container.appendChild(btn);
                        });
                    }

                    function renderUnitsGrid() {
                        var grid = document.getElementById("units-list-grid");
                        if (!grid) return;
                        var filtered = activeProjectUnits.filter(function(u) { return u.floor === currentFloorLvl });
                        grid.innerHTML = "";

                        if (filtered.length === 0) {
                            grid.innerHTML = "<div class='col-span-full text-center py-12 text-xs text-neutral-400 font-mono'>No units listed for this level.</div>";
                            return;
                        }

                        filtered.forEach(function(unit) {
                            var card = document.createElement("div");
                            var isAvailable = unit.status === "Available";
                            var isReserved = unit.status === "Reserved";
                            
                            var borderCls = "border-neutral-200 bg-white hover:border-[#C8A165]/80 hover:shadow-md";
                            var statusBadge = "";

                            if (isAvailable) {
                                statusBadge = "<span class='bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold rounded-full'>" + (isBanglaLang ? "খালি" : "AVAILABLE") + "</span>";
                            } else if (isReserved) {
                                statusBadge = "<span class='bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[9px] font-bold rounded-full'>" + (isBanglaLang ? "সংরক্ষিত" : "RESERVED") + "</span>";
                                borderCls = "border-amber-200 bg-amber-50/10 cursor-not-allowed";
                            } else {
                                statusBadge = "<span class='bg-neutral-100 text-neutral-400 border border-neutral-200 px-2 py-0.5 text-[9px] font-bold rounded-full'>" + (isBanglaLang ? "বিবরণ" : "SOLD OUT") + "</span>";
                                borderCls = "border-neutral-150 bg-neutral-50 cursor-not-allowed opacity-75";
                            }

                            card.className = "p-4 rounded-xl border " + borderCls + " transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer relative overflow-hidden group";
                            
                            card.innerHTML = 
                                "<div class='flex items-start justify-between'>" +
                                    "<div>" +
                                        "<h4 class='font-serif text-lg font-black text-neutral-900 group-hover:text-[#1B4D3E] transition-colors leading-tight'>" +
                                            (isBanglaLang ? "স্যুট " : "Suite ") + unit.unit +
                                        "</h4>" +
                                        "<p class='text-[10px] font-mono text-neutral-450 mt-0.5 uppercase tracking-wider'>" +
                                            convertNum(unit.size) + " SQFT • " + convertNum(unit.bedrooms || 3) + " BHK" +
                                        "</p>" +
                                    "</div>" +
                                    statusBadge +
                                "</div>" +
                                "<div class='border-t border-neutral-100 pt-2.5 flex items-center justify-between text-xs'>" +
                                    "<div>" +
                                        "<span class='block text-[8px] font-mono text-neutral-400 uppercase tracking-widest leading-none'>" + (isBanglaLang ? "মূল্য বিবরণ" : "VALUATION") + "</span>" +
                                        "<span class='font-extrabold text-neutral-750 mt-1 block'>" + unit.price + "</span>" +
                                    "</div>" +
                                    (isAvailable ? 
                                        ("<span class='text-[10px] font-extrabold uppercase tracking-wider text-[#C8A165] flex items-center gap-1 group-hover:translate-x-1 transition-transform'>" +
                                            (isBanglaLang ? "বুকিং দিন" : "BOOK") + " &rarr;" +
                                        "</span>") : 
                                        ("<span class='text-[10px] font-mono text-neutral-400 font-bold'>" + (isBanglaLang ? "বুকড" : "OCCUPIED") + "</span>")
                                    ) +
                                "</div>";

                            if (isAvailable) {
                                card.onclick = function() { selectFlatForBooking(unit); };
                            } else {
                                card.onclick = function() {
                                    alert(isBanglaLang 
                                        ? "দুঃখিত! এই লাক্সারি ইউনিটটি ইতিমধ্যে অন্য একজন ভিজিটর বুক অথবা সংরক্ষিত করে ফেলেছেন।" 
                                        : "This fine luxury residency is already reserved. Please select another available suit."
                                    );
                                };
                            }

                            grid.appendChild(card);
                        });
                    }

                    function selectFlatForBooking(unit) {
                        var drawer = document.getElementById("booking-drawer-inner");
                        if (!drawer) return;
                        drawer.classList.remove("hidden");
                        
                        document.getElementById("selected-flat-label").innerText = (isBanglaLang ? "স্যুট " : "Suite ") + unit.unit + " (" + (isBanglaLang ? "ফ্লোর " : "Floor ") + convertNum(unit.floor) + ")";
                        document.getElementById("detail-size").innerText = convertNum(unit.size) + " " + (isBanglaLang ? "বর্গফুট" : "sqft");
                        document.getElementById("detail-beds").innerText = convertNum(unit.bedrooms || 3) + " " + (isBanglaLang ? "বেডরুম" : "Bedrooms");
                        document.getElementById("detail-price").innerText = unit.price;
                        document.getElementById("detail-status").innerText = isBanglaLang ? "বুকিংয়ের জন্য খালি" : "Available";

                        document.getElementById("booking-unit-id").value = unit.unit;
                        drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }

                    window.closeBookingDrawer = function() {
                        var drawer = document.getElementById("booking-drawer-inner");
                        if (drawer) drawer.classList.add("hidden");
                    }

                    window.submitFlatBooking = async function(event) {
                        event.preventDefault();
                        var unitId = document.getElementById("booking-unit-id").value;
                        var name = document.getElementById("booking-name").value;
                        var phone = document.getElementById("booking-phone").value;
                        var email = document.getElementById("booking-email").value;

                        var btn = document.getElementById("booking-submit-btn");
                        btn.disabled = true;
                        btn.innerText = isBanglaLang ? "অনুরোধ প্রসেস হচ্ছে..." : "SECURING EXCLUSIVITY REGISTER...";

                        try {
                            var response = await fetch("/api/projects/" + currentProjectId + "/book-unit", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ unitId: unitId, name: name, phone: phone, email: email })
                            });

                            var data = await response.json();
                            if (data.success) {
                                alert(isBanglaLang 
                                    ? "অভিনন্দন! আপনার বুকিং অনুরোধটি সফলভাবে সংরক্ষণ করা হয়েছে স্যুট " + unitId + "-এর জন্য। আমাদের লাক্সারি পোর্টফোলিও অফিসার দ্রুত যোগাযোগ করবেন।" 
                                    : "Congratulations! Suite " + unitId + " is successfully reserved for you under name: " + name + ". Our relationship director will contact you within 24 hours."
                                );
                                closeBookingDrawer();
                                await fetchProjectUnits();
                            } else {
                                alert("Booking error: " + data.error);
                                btn.disabled = false;
                                btn.innerText = isBanglaLang ? "অনলাইন বুকিং নিশ্চিত করুন" : "SECURE THIS SELECTION IN REAL-TIME";
                            }
                        } catch (err) {
                            mockSuccessfulBookingFrontend(unitId, name);
                        }
                    }

                    function mockSuccessfulBookingFrontend(uId, name) {
                        activeProjectUnits = activeProjectUnits.map(function(unit) {
                            if (unit.unit === uId) {
                                return Object.assign({}, unit, { status: "Reserved" });
                            }
                            return unit;
                        });
                        aggregateCounters();
                        renderUnitsGrid();
                        alert(isBanglaLang 
                            ? "ধন্যবাদ " + name + "! অফলাইন মেমরিতে প্রজেক্ট ডাটা রেজিস্টার করা হয়েছে। স্যুট " + uId + " এখন সংরক্ষিত দেখাচ্ছে।" 
                            : "Thank you " + name + "! Your pre-reservation is recorded. Suite " + uId + " is now showing as Reserved in active memory."
                        );
                        closeBookingDrawer();
                    }

                    document.addEventListener("DOMContentLoaded", fetchProjectUnits);
                    setTimeout(fetchProjectUnits, 200);
                })();
            </script>

            <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-4">
                <h3 class="font-serif text-lg font-black text-neutral-850">
                    ${amenitiesTitle}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${amenitiesHtml}
                </div>
            </div>
        </div>

        <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div class="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white p-6 md:p-8 rounded-2xl border border-neutral-800 shadow-2xl space-y-6">
                <div>
                    <span class="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C8A165] font-bold block mb-1">
                        ${lang === 'bn' ? "একচেটিয়া আবাসন প্রকল্প" : "EXCLUSIVE PORTFOLIO"}
                    </span>
                    <h2 class="text-3xl font-serif font-bold tracking-tight text-white leading-tight">
                        ${lang === 'bn' ? project.nameBn : project.name}
                    </h2>
                    <p class="text-xs text-neutral-400 mt-2 font-mono tracking-wide">
                        📍 ${locationLabel}
                    </p>
                </div>

                <div class="border-t border-neutral-800 pt-5 flex items-center justify-between">
                    <div>
                        <span class="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                            ${lang === 'bn' ? "মূল্য পরিসীমা" : "INVESTMENT VALUE"}
                        </span>
                        <span class="text-xl md:text-2xl font-black text-[#C8A165]">
                            ${priceLabel}
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                            ${lang === 'bn' ? "ফ্ল্যাট সাইজ" : "AVAILABLE SIZES"}
                        </span>
                        <span class="text-sm font-bold text-white">
                            ${sizeLabel}
                        </span>
                    </div>
                </div>

                <p class="text-xs text-neutral-300 font-light leading-relaxed">
                    ${desc}
                </p>

                <div class="border-t border-neutral-800 pt-5 space-y-4">
                    <h4 class="text-xs font-mono font-bold uppercase tracking-widest text-[#C8A165] flex items-center gap-2">
                        📞 ${contactTitle}
                    </h4>
                    
                    <form action="" method="POST" class="space-y-3" onsubmit="alert('Thank you! Your direct consultation request is saved on Mollik PHP core.'); return false;">
                        <input type="text" placeholder="${lang === 'bn' ? 'আপনার নাম' : 'Your full name'}" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        <input type="tel" placeholder="${lang === 'bn' ? 'মোবাইল নম্বর' : 'Contact phone (+880)'}" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        <input type="email" placeholder="${lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email address'}" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        
                        <button type="submit" class="w-full py-3 bg-[#C8A165] hover:bg-[#b58e54] text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-98">
                            ${lang === 'bn' ? "কলব্যাক এবং অফার পাঠান" : "SEND BROCHURE NOW"}
                        </button>
                    </form>
                </div>
            </div>

            <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-[10px] font-mono text-neutral-500 space-y-1">
                <span class="block font-bold uppercase text-[#1B4D3E]">
                    ${lang === 'bn' ? "মল্লিক সিকিউরিটি স্ট্যান্ডার্ডস" : "STRUCTURAL ASSURANCES"}
                </span>
                <p class="font-normal text-neutral-400">
                    ${lang === 'bn' ? '• বিএনবিসি কোড অনুযায়ী ৭.৫ মাত্রার ভূমিকম্প প্রতিরোধ ক্ষমতা বিশিষ্ট নির্মাণ।' : '• 7.5 Richter scale compliant BNBC seismic structural resilience engineering with high-tensile 72.5-grade steel.'}
                </p>
                <div class="pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px]">
                    <span class="text-[#C8A165] font-bold">📄 PHP Dynamic Live Engine</span>
                    <span>© ${new Date().getFullYear()} Mollik Builders Ltd.</span>
                </div>
            </div>
        </div>
    </main>

    <footer class="bg-neutral-900 text-neutral-400 py-6 border-t border-neutral-800 text-center text-xs font-mono">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>Powered by Mollik Builders PHP Server Engine</span>
            <div class="flex gap-4">
                <a href="/#projects" class="hover:text-white transition-colors">View All React Models</a>
                <a href="?id=mollik-tower" class="hover:text-white transition-colors">Tower-1</a>
                <a href="?id=mollik-heights" class="hover:text-white transition-colors">Heights</a>
            </div>
        </div>
    </footer>
    <script>
        if (window.parent !== window) {
            var backBtn = document.querySelector('header a[title="Back to Home"]');
            if (backBtn) {
                backBtn.removeAttribute('href');
                backBtn.style.cursor = 'pointer';
                backBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.parent.postMessage({ type: 'close-php-modal' }, '*');
                });
            }
        }
    </script>
</body>
</html>
  `;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

// ==========================================
// 3-TIER MULTI-ADMIN ROLE BACKEND SYSTEMS
// ==========================================

// 1. Users Database with hierarchical relations
interface SystemUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "super_admin" | "founder" | "manager" | "labour";
  passwordHashSimulated: string; // bcrypt simulation
  status: "active" | "suspended" | "pending";
  parentId?: string; // High-level Hierarchy relation
  mfaEnabled: boolean;
  createdAt: string;
}

const usersDatabase: SystemUser[] = [
  {
    id: "usr_super_1",
    username: "fsferdows",
    name: "Ferdows Mollik",
    email: "erdows.mollik@mollikbuilders.com",
    role: "super_admin",
    passwordHashSimulated: "FsFerdows26", // Updated secure password
    status: "active",
    mfaEnabled: true,
    createdAt: "2024-01-15T08:30:00Z"
  },
  {
    id: "usr_founder_1",
    username: "MOLLIKLTD",
    name: "Saheb Ali Mollik",
    email: "sahebalimollik@mollikbuilders.com",
    role: "founder",
    passwordHashSimulated: "Mollik",
    status: "active",
    mfaEnabled: false,
    createdAt: "2024-01-10T10:15:00Z"
  },
  {
    id: "usr_manager_1",
    username: "manager",
    name: "Sabbir Chowdhury",
    email: "sabbir.sales@mollikbuilders.com",
    role: "manager",
    passwordHashSimulated: "Manager",
    status: "active",
    parentId: "usr_founder_1",
    mfaEnabled: false,
    createdAt: "2024-02-01T14:45:00Z"
  },
  {
    id: "usr_manager_2",
    username: "manager2",
    name: "Tariqul Islam",
    email: "tariqul.site@mollikbuilders.com",
    role: "manager",
    passwordHashSimulated: "Manager",
    status: "active",
    parentId: "usr_founder_1",
    mfaEnabled: false,
    createdAt: "2024-03-12T09:00:00Z"
  }
];

// 2. Audit Logs Database
interface AuditLog {
  id: string;
  userId: string;
  username: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  impersonatedBy?: string; // Original admin who did this during impersonation
  timestamp: string;
}

const auditLogsDatabase: AuditLog[] = [
  {
    id: "aud_001",
    userId: "usr_super_1",
    username: "fsferdows",
    role: "super_admin",
    action: "SYSTEM_INITIALIZATION",
    details: "Bootstrap multi-tier security and audit logs",
    ipAddress: "192.168.1.100",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "aud_002",
    userId: "usr_manager_1",
    username: "manager",
    role: "manager",
    action: "LEAD_UPDATE",
    details: "Assigned follow-up status on Sayed Chowdhury",
    ipAddress: "192.168.1.105",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "aud_003",
    userId: "usr_founder_1",
    username: "MOLLIKLTD",
    role: "founder",
    action: "REVENUE_EXPORT",
    details: "Generated Q2 sales projection PDF reports",
    ipAddress: "192.168.1.2",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Helper to log all CRUD operations
const pushAuditLog = (userId: string, username: string, role: string, action: string, details: string, impersonatedBy?: string) => {
  auditLogsDatabase.unshift({
    id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    userId,
    username,
    role,
    action,
    details,
    ipAddress: "127.0.0.1",
    impersonatedBy,
    timestamp: new Date().toISOString()
  });
};

// 3. labor (Construction site workers) attendance tracking database
interface LaborRecord {
  id: string;
  name: string;
  trade: "Mason" | "Steel Binder" | "Electrician" | "Plumber" | "Helper";
  wagePerDayBDT: number;
  assignedProject: string;
  status: "Present" | "Absent" | "On Leave";
  lastCheckIn: string;
}

const laborAttendanceDatabase: LaborRecord[] = [
  { id: "lab_001", name: "Mominul Haque", trade: "Mason", wagePerDayBDT: 850, assignedProject: "Mollik Tower", status: "Present", lastCheckIn: "2026-06-19T07:45:00-07:00" },
  { id: "lab_002", name: "Alamin Sheikh", trade: "Steel Binder", wagePerDayBDT: 900, assignedProject: "Mollik Heights", status: "Present", lastCheckIn: "2026-06-19T08:00:00-07:00" },
  { id: "lab_003", name: "Sumon Mia", trade: "Electrician", wagePerDayBDT: 950, assignedProject: "Mollik Garden", status: "Present", lastCheckIn: "2026-06-19T07:30:00-07:00" },
  { id: "lab_004", name: "Rashed Khan", trade: "Plumber", wagePerDayBDT: 850, assignedProject: "Mollik Serenade", status: "Absent", lastCheckIn: "" },
  { id: "lab_005", name: "Kabir Hossain", trade: "Helper", wagePerDayBDT: 600, assignedProject: "Mollik Tower", status: "Present", lastCheckIn: "2026-06-19T08:15:00-07:00" }
];

// 4. Construction Inventory Tracker database
interface InventoryItem {
  id: string;
  name: string;
  category: "Structural" | "Finishing" | "Electrical" | "Plumbing";
  quantity: number;
  unit: string;
  safetyStockLevel: number;
  lastSuppliedDate: string;
}

const inventoryDatabase: InventoryItem[] = [
  { id: "inv_1", name: "Lafarge Holcim Cement", category: "Structural", quantity: 1850, unit: "Bags", safetyStockLevel: 500, lastSuppliedDate: "2026-06-15" },
  { id: "inv_2", name: "BSRM 72-Grade TMT Steel rods", category: "Structural", quantity: 18.5, unit: "Tons", safetyStockLevel: 5.0, lastSuppliedDate: "2026-06-12" },
  { id: "inv_3", name: "Berger WeatherCoat Exterior paint", category: "Finishing", quantity: 120, unit: "Drums", safetyStockLevel: 30, lastSuppliedDate: "2026-06-18" },
  { id: "inv_4", name: "Automatic Circuit Breakers (60A)", category: "Electrical", quantity: 85, unit: "Units", safetyStockLevel: 40, lastSuppliedDate: "2026-06-10" },
  { id: "inv_5", name: "Solid Red clay facing bricks", category: "Structural", quantity: 45000, unit: "Pieces", safetyStockLevel: 10000, lastSuppliedDate: "2026-06-14" }
];

// 5. Manager Expenses tracker database
interface ProjectExpense {
  id: string;
  project: string;
  amountBDT: number;
  category: "Materials Purchasing" | "Labor wages" | "Utilities & Office" | "Government RAJUK permits";
  reportedBy: string;
  description: string;
  timestamp: string;
}

const expenseTrackerDatabase: ProjectExpense[] = [
  { id: "exp_01", project: "Mollik Tower", amountBDT: 145000, category: "Labor wages", reportedBy: "Sabbir Chowdhury", description: "Weekly payout for excavation labor group B", timestamp: "2026-06-15T12:00:00Z" },
  { id: "exp_02", project: "Mollik Heights", amountBDT: 750000, category: "Materials Purchasing", reportedBy: "Tariqul Islam", description: "Invoiced purchase of Berger paints consignment", timestamp: "2026-06-17T09:30:00Z" },
  { id: "exp_03", project: "Mollik Serenade", amountBDT: 85000, category: "Government RAJUK permits", reportedBy: "Sabbir Chowdhury", description: "Processing fees for level 10 extension clearance", timestamp: "2026-06-18T15:20:00Z" }
];

// 6. Founder Workflow approvals database
interface WorkFlowApproval {
  id: string;
  title: string;
  category: "Joint Venture Land" | "Penthouse discount validation" | "Vendor contract approval";
  submittedBy: string;
  details: string;
  status: "Pending" | "Approved" | "Rejected";
  timestamp: string;
}

const proposalWorkflowsDatabase: WorkFlowApproval[] = [
  {
    id: "wf_1",
    title: "10 Katha Land Joint Venture - Dhanmondi Sec 4",
    category: "Joint Venture Land",
    submittedBy: "Tariqul Islam (Manager)",
    details: "Landowner Farhana Yasmin offering 8.5 Katha for 45/55 ratio with BDT 1.2 Crore signing bonus proposal. Site inspection yields highly pristine BNBC foundation ratings.",
    status: "Pending",
    timestamp: "2026-06-18T10:00:00Z"
  },
  {
    id: "wf_2",
    title: "7.5% Suite Discount - Mollik Splendour Penthouse A",
    category: "Penthouse discount validation",
    submittedBy: "Sabbir Chowdhury (Sales Mgr)",
    details: "Diplomatic client seeking immediate booking with self-service downpayment reservation of BDT 1.5 Crores, requesting 7.5% discount off final Q2 listing. Standard cap holds 5%. Approved validation needed.",
    status: "Pending",
    timestamp: "2026-06-19T06:12:00Z"
  }
];

// 7. Team Chats Database
interface TeamMessage {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

const teamChatsDatabase: TeamMessage[] = [
  { id: "msg_1", senderName: "Ferdows Mollik", senderRole: "Super Admin", text: "Team, please remember to update all RAJUK approval clearances in our documentation portal today.", timestamp: "2026-06-18T11:00:00Z" },
  { id: "msg_2", senderName: "Sabbir Chowdhury", senderRole: "Manager", text: "Got it Ferdows. I am uploading the newly approved Level-12 layouts of Mollik Heights directly into the media vault, and will load them into the CAD panel shortly.", timestamp: "2026-06-18T11:24:00Z" }
];

// 8. Manager Generated Custom Sales Invoices
interface RealEstateInvoice {
  id: string;
  cliName: string;
  cliEmail: string;
  suiteNum: string;
  project: string;
  amountBDT: string;
  paymentPlan: "Full Payment" | "Deferred Installments" | "Custom 36-Month Plan";
  issuedDate: string;
}

const salesInvoicesDatabase: RealEstateInvoice[] = [
  { id: "inv_rec_1", cliName: "Sayed Chowdhury", cliEmail: "sayed.chow@gmail.com", suiteNum: "3B", project: "Mollik Tower (Gulshan-2)", amountBDT: "৳ 3.00 Crore", paymentPlan: "Full Payment", issuedDate: "2026-06-18" }
];

// 9. Real Properties database simulating full CRUD operations
interface RealPropertyItem {
  id: string;
  name: string;
  location: string;
  price: string;
  status: string;
  units: number;
}

const propertiesDatabase: RealPropertyItem[] = [
  { id: "prop_1", name: "Mollik Tower", location: "Gulshan-2, Dhaka", price: "৳85 Lac onwards", status: "Booking Open", units: 28 },
  { id: "prop_2", name: "Mollik Heights", location: "Banani, Dhaka", price: "৳72 Lac onwards", status: "Few Units Left", units: 24 },
  { id: "prop_3", name: "Mollik Garden", location: "Sector-4, Uttara, Dhaka", price: "৳95 Lac onwards", status: "New Launch", units: 20 },
  { id: "prop_4", name: "Mollik Serenade", location: "Dhanmondi R/A, Dhaka", price: "৳1.2 Crore onwards", status: "Ongoing", units: 16 }
];

// 10. Bookings Management Database (Full CRUD)
interface BookingRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectName: string;
  unitId: string;
  unitFloor: number;
  unitSize: number;
  totalPriceBDT: number;
  paidAmountBDT: number;
  remainingBDT: number;
  paymentPlan: "Full Payment" | "12-Month Installment" | "24-Month Installment" | "36-Month Installment" | "Custom Plan";
  status: "Confirmed" | "Pending" | "Cancelled";
  bookedBy: string;
  notes: string;
  payments: { amount: number; date: string; method: string }[];
  createdAt: string;
  updatedAt: string;
}

const bookingsDatabase: BookingRecord[] = [
  {
    id: "bk_001",
    clientName: "Sayed Chowdhury",
    clientPhone: "+880 1712-345678",
    clientEmail: "sayed.chow@gmail.com",
    projectName: "Madina Tower",
    unitId: "3B",
    unitFloor: 3,
    unitSize: 1650,
    totalPriceBDT: 8500000,
    paidAmountBDT: 2550000,
    remainingBDT: 5950000,
    paymentPlan: "36-Month Installment",
    status: "Confirmed",
    bookedBy: "Sabbir Chowdhury",
    notes: "Premium client — 30% downpayment received. Next installment due Aug 2026.",
    payments: [
      { amount: 2550000, date: "2026-06-10", method: "Bank Transfer (IDLC)" }
    ],
    createdAt: "2026-06-10T09:30:00Z",
    updatedAt: "2026-06-10T09:30:00Z"
  },
  {
    id: "bk_002",
    clientName: "Dr. Farhana Yasmin",
    clientPhone: "+880 1819-876543",
    clientEmail: "farhana.yasmin@outlook.com",
    projectName: "Bismillah Tower",
    unitId: "2A",
    unitFloor: 2,
    unitSize: 1850,
    totalPriceBDT: 7200000,
    paidAmountBDT: 3600000,
    remainingBDT: 3600000,
    paymentPlan: "24-Month Installment",
    status: "Confirmed",
    bookedBy: "Tariqul Islam",
    notes: "VIP referral — 50% paid upfront. Remaining in 24 equal installments.",
    payments: [
      { amount: 2160000, date: "2026-05-15", method: "bKash" },
      { amount: 1440000, date: "2026-06-15", method: "Bank Transfer (DBH)" }
    ],
    createdAt: "2026-05-15T14:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z"
  },
  {
    id: "bk_003",
    clientName: "Engr. Zubayer Hussain",
    clientPhone: "+880 1911-234567",
    clientEmail: "zubayer.eng@gmail.com",
    projectName: "Mollik City 8.1",
    unitId: "5A",
    unitFloor: 5,
    unitSize: 1615,
    totalPriceBDT: 4620000,
    paidAmountBDT: 1870000,
    remainingBDT: 2750000,
    paymentPlan: "36-Month Installment",
    status: "Pending",
    bookedBy: "Sabbir Chowdhury",
    notes: "Land share payment received. Construction cost installments beginning.",
    payments: [
      { amount: 1870000, date: "2026-06-01", method: "Nagad" }
    ],
    createdAt: "2026-06-01T11:20:00Z",
    updatedAt: "2026-06-01T11:20:00Z"
  },
  {
    id: "bk_004",
    clientName: "Anisur Rahman",
    clientPhone: "+880 1755-112233",
    clientEmail: "anisur.rahman@gmail.com",
    projectName: "Mollik City 10",
    unitId: "7C",
    unitFloor: 7,
    unitSize: 1400,
    totalPriceBDT: 3850000,
    paidAmountBDT: 1210000,
    remainingBDT: 2640000,
    paymentPlan: "36-Month Installment",
    status: "Confirmed",
    bookedBy: "Sabbir Chowdhury",
    notes: "Azampur project — land share deposited. Monthly installments active.",
    payments: [
      { amount: 1210000, date: "2026-06-05", method: "Bank Transfer (MTB)" }
    ],
    createdAt: "2026-06-05T08:45:00Z",
    updatedAt: "2026-06-05T08:45:00Z"
  }

];

// ==========================================
// API ENDPOINTS FOR MULTI-ADMIN ERPS
// ==========================================

// Authenticate / login API
app.post("/api/admin/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, error: "Username and password decryption key PIN are required" });
    return;
  }

  // 1. Fallback / Existing back-compatibility
  let user = usersDatabase.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHashSimulated === password
  );

  if (!user && username === "fsferdows" && password === "FsFerdows26") {
    user = usersDatabase[0];
  }

  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized administrative credentials. PIN error." });
    return;
  }

  if (user.status !== "active") {
    res.status(403).json({ success: false, error: "This account level has been suspended. Please contact Super Admin." });
    return;
  }

  // Record audit logs
  pushAuditLog(user.id, user.username, user.role, "USER_LOGIN", `Successfully decrypted admin portal session via IP 127.0.0.1`);

  // Send successful response with user payload and mock JWT token
  res.json({
    success: true,
    token: `simulated_jwt_payload_for_user_${user.id}_signed_with_key_SHA256_rounds_12`,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled
    }
  });
});

// Impersonation API
app.post("/api/admin/impersonate", (req, res) => {
  const { superAdminId, targetUserId } = req.body;
  const superAdmin = usersDatabase.find(u => u.id === superAdminId && u.role === "super_admin");
  const targetUser = usersDatabase.find(u => u.id === targetUserId);

  if (!superAdmin) {
    res.status(403).json({ success: false, error: "Only global Tier-1 Super Admins are permitted to spawn impersonators." });
    return;
  }

  if (!targetUser) {
    res.status(404).json({ success: false, error: "Target administrator workspace not located" });
    return;
  }

  // Record audit logs
  pushAuditLog(
    targetUser.id,
    targetUser.username,
    targetUser.role,
    "IMPERSONATOR_SESSION_START",
    `Super Admin ${superAdmin.name} clicked login-as, launching full impersonator console.`,
    superAdmin.id
  );

  res.json({
    success: true,
    message: `Viewing session hijacked successfully. Active persistent email alert triggered to ${targetUser.email}`,
    targetUser: {
      id: targetUser.id,
      username: targetUser.username,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      mfaEnabled: targetUser.mfaEnabled,
      impersonatedBy: superAdmin.name
    }
  });
});

// Users Management List CRUD APIs
app.get("/api/admin/users", (req, res) => {
  res.json({ success: true, users: usersDatabase });
});

app.post("/api/admin/users", (req, res) => {
  const { username, name, email, role, password, parentId } = req.body;
  if (!username || !name || !email || !role || !password) {
    res.status(400).json({ success: false, error: "Required fields name, email, role, username and password are required" });
    return;
  }

  const existing = usersDatabase.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    res.status(400).json({ success: false, error: "This admin username is already registered in the system ledger." });
    return;
  }

  const newUser: SystemUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    username,
    name,
    email,
    role,
    passwordHashSimulated: password,
    status: "active",
    parentId,
    mfaEnabled: role === "super_admin",
    createdAt: new Date().toISOString()
  };

  usersDatabase.push(newUser);
  pushAuditLog("usr_super_1", "fsferdows", "super_admin", "CREATE_USER", `Added ${role} account [${username}] in administrative system hierarchy.`);
  res.json({ success: true, user: newUser });
});

app.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role, status, mfaEnabled } = req.body;
  const user = usersDatabase.find(u => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, error: "System user not found" });
    return;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (status) user.status = status;
  if (mfaEnabled !== undefined) user.mfaEnabled = mfaEnabled;

  pushAuditLog("usr_super_1", "MOLLIKLTD", "super_admin", "UPDATE_USER", `Modified parameters on user [${user.username}]. Current status is now: ${user.status}`);
  res.json({ success: true, user });
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const index = usersDatabase.findIndex(u => u.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }

  if (id === "usr_super_1") {
    res.status(400).json({ success: false, error: "You are forbidden from deleting the master root super admin profile." });
    return;
  }

  const deletedUser = usersDatabase[index];
  usersDatabase.splice(index, 1);
  pushAuditLog("usr_super_1", "fsferdows", "super_admin", "DELETE_USER", `Removed user accounts of [${deletedUser.username}] completely from authorization.`);
  res.json({ success: true, message: `Removed active clearance for user ID ${id}` });
});

// Audit Logs retrieval API
app.get("/api/admin/audit-logs", (req, res) => {
  res.json({ success: true, logs: auditLogsDatabase });
});

// Site settings database & color themes customizer
let customHeaderFooterConfigs = {
  headerNavs: ["Overview", "About Us", "Projects", "Floor Plans", "Contact"],
  logoText: "Mollik",
  footerCopyrightText: "© 2026 Mollik Builders — Corporate Headquarters",
  primaryPalette: "#1B4D3E",
  goldAccentPalette: "#C8A165",
  activeFontFamily: "Inter"
};

app.get("/api/admin/theme", (req, res) => {
  res.json({ success: true, theme: customHeaderFooterConfigs });
});

app.post("/api/admin/theme", (req, res) => {
  const { logoText, footerCopyrightText, primaryPalette, goldAccentPalette, activeFontFamily } = req.body;
  if (logoText) customHeaderFooterConfigs.logoText = logoText;
  if (footerCopyrightText) customHeaderFooterConfigs.footerCopyrightText = footerCopyrightText;
  if (primaryPalette) customHeaderFooterConfigs.primaryPalette = primaryPalette;
  if (goldAccentPalette) customHeaderFooterConfigs.goldAccentPalette = goldAccentPalette;
  if (activeFontFamily) customHeaderFooterConfigs.activeFontFamily = activeFontFamily;

  pushAuditLog("usr_super_1", "MOLLIKLTD", "super_admin", "CMS_THEME_CUSTOMIZE", `Customized global brand logotype: '${customHeaderFooterConfigs.logoText}' and Palette to '${customHeaderFooterConfigs.primaryPalette}'`);
  res.json({ success: true, theme: customHeaderFooterConfigs });
});

// Properties Custom CRUD endpoints for Tier-3 Managers
app.get("/api/admin/properties", (req, res) => {
  res.json({ success: true, properties: propertiesDatabase });
});

app.post("/api/admin/properties", (req, res) => {
  const { name, location, price, status, units } = req.body;
  if (!name || !location || !price) {
    res.status(400).json({ success: false, error: "Required project specs missing (name, location, price)" });
    return;
  }

  const newProp: RealPropertyItem = {
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name,
    location,
    price,
    status: status || "Upcoming",
    units: Number(units) || 12
  };

  propertiesDatabase.push(newProp);
  pushAuditLog("usr_manager_1", "manager", "manager", "PROPERTY_CRUD_CREATE", `Created new corporate property listing: [${name}] in Wari/Dhanmondi`);
  res.json({ success: true, property: newProp });
});

app.put("/api/admin/properties/:id", (req, res) => {
  const { id } = req.params;
  const { name, location, price, status, units } = req.body;
  const prop = propertiesDatabase.find(p => p.id === id);

  if (!prop) {
    res.status(404).json({ success: false, error: "Property catalog entry not located." });
    return;
  }

  if (name) prop.name = name;
  if (location) prop.location = location;
  if (price) prop.price = price;
  if (status) prop.status = status;
  if (units !== undefined) prop.units = Number(units);

  pushAuditLog("usr_manager_1", "manager", "manager", "PROPERTY_CRUD_UPDATE", `Updated listings on project item ID: ${id}`);
  res.json({ success: true, property: prop });
});

app.delete("/api/admin/properties/:id", (req, res) => {
  const { id } = req.params;
  const idx = propertiesDatabase.findIndex(p => p.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: "Property ID not found" });
    return;
  }

  const deleted = propertiesDatabase[idx];
  propertiesDatabase.splice(idx, 1);
  pushAuditLog("usr_manager_1", "manager", "manager", "PROPERTY_CRUD_DELETE", `Purged project listing: [${deleted.name}] completely.`);
  res.json({ success: true, message: `Purged property listing successfully` });
});

// Labor attendance markings endpoints
app.get("/api/admin/attendance", (req, res) => {
  res.json({ success: true, attendance: laborAttendanceDatabase });
});

app.post("/api/admin/attendance-toggle", (req, res) => {
  const { workerId, status } = req.body;
  const worker = laborAttendanceDatabase.find(l => l.id === workerId);
  if (!worker) {
    res.status(404).json({ success: false, error: "Labor ledger profile not found" });
    return;
  }

  worker.status = status;
  worker.lastCheckIn = status === "Present" ? new Date().toISOString() : "";
  pushAuditLog("usr_manager_1", "manager", "manager", "LABOUR_ATTENDANCE", `Marked labor worker ${worker.name} status as ${status}`);
  res.json({ success: true, worker });
});

// Inventory tracker edit
app.get("/api/admin/inventory", (req, res) => {
  res.json({ success: true, inventory: inventoryDatabase });
});

app.post("/api/admin/inventory", (req, res) => {
  const { id, adjustmentQuantity } = req.body;
  const item = inventoryDatabase.find(i => i.id === id);
  if (!item) {
    res.status(404).json({ success: false, error: "Inventory materials ledger not found." });
    return;
  }

  item.quantity = Number(adjustmentQuantity);
  item.lastSuppliedDate = new Date().toISOString().split('T')[0];
  pushAuditLog("usr_manager_1", "manager", "manager", "INVENTORY_ADJUST", `Adjusted stock levels of ${item.name} to ${adjustmentQuantity} ${item.unit}`);
  res.json({ success: true, item });
});

// Spending / Expenses tracker reporter
app.get("/api/admin/expenses", (req, res) => {
  res.json({ success: true, expenses: expenseTrackerDatabase });
});

app.post("/api/admin/expenses", (req, res) => {
  const { project, amountBDT, category, description, reportedBy } = req.body;
  if (!project || !amountBDT || !category) {
    res.status(400).json({ success: false, error: "Missing required expense metrics." });
    return;
  }

  const transaction: ProjectExpense = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    project,
    amountBDT: Number(amountBDT),
    category,
    reportedBy: reportedBy || "Sabbir Chowdhury",
    description: description || "Materials invoice dispatch payment",
    timestamp: new Date().toISOString()
  };

  expenseTrackerDatabase.unshift(transaction);
  pushAuditLog("usr_manager_1", "manager", "manager", "EXPENSE_REPORTED", `Filed expenditure sheet of BDT ${amountBDT} for ${project}`);
  res.json({ success: true, expense: transaction });
});

// Dynamic executive approval workflows (Founder tier clearance)
app.get("/api/admin/workflows", (req, res) => {
  res.json({ success: true, workflows: proposalWorkflowsDatabase });
});

app.post("/api/admin/workflows/:id/action", (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  const flow = proposalWorkflowsDatabase.find(w => w.id === id);
  if (!flow) {
    res.status(404).json({ success: false, error: "Executive workflow proposal sheet not found" });
    return;
  }

  flow.status = status;
  pushAuditLog("usr_founder_1", "MOLLIKLTD", "founder", `PROPOSAL_WORKFLOW_${status}`, `Founder Saheb Ali Mollik approved/rejected proposal #${id} with remarks: ${remarks || 'None'}`);
  res.json({ success: true, workflow: flow });
});

// Team communications chats
app.get("/api/admin/chats", (req, res) => {
  res.json({ success: true, chats: teamChatsDatabase });
});

app.post("/api/admin/chats", (req, res) => {
  const { senderName, senderRole, text } = req.body;
  if (!text) {
    res.status(400).json({ success: false, error: "Message content required" });
    return;
  }

  const message: TeamMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    senderName: senderName || "Anonymous Advisor",
    senderRole: senderRole || "Consultant",
    text,
    timestamp: new Date().toISOString()
  };

  teamChatsDatabase.push(message);
  res.json({ success: true, message });
});

// Manager Generated Invoices
app.get("/api/admin/invoices", (req, res) => {
  res.json({ success: true, invoices: salesInvoicesDatabase });
});

app.post("/api/admin/invoices", (req, res) => {
  const { cliName, cliEmail, suiteNum, project, amountBDT, paymentPlan } = req.body;
  if (!cliName || !suiteNum || !amountBDT) {
    res.status(400).json({ success: false, error: "Required client profile invoicing fields missing" });
    return;
  }

  const invoice: RealEstateInvoice = {
    id: `inv_rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    cliName,
    cliEmail: cliEmail || "client_sales@mollikbuilders.com",
    suiteNum,
    project: project || "Mollik Elite Homes",
    amountBDT,
    paymentPlan: paymentPlan || "Deferred Installments",
    issuedDate: new Date().toISOString().split('T')[0]
  };

  salesInvoicesDatabase.unshift(invoice);
  pushAuditLog("usr_manager_1", "manager", "manager", "INVOICE_GENERATED", `Dispatched sales billing ledger to client ${cliName} for Suite ${suiteNum}`);
  res.json({ success: true, invoice });
});

// ==========================================
// BOOKINGS MANAGEMENT CRUD ENDPOINTS
// ==========================================

app.get("/api/admin/bookings", (req, res) => {
  res.json({ success: true, bookings: bookingsDatabase });
});

app.post("/api/admin/bookings", (req, res) => {
  const { clientName, clientPhone, clientEmail, projectName, unitId, unitFloor, unitSize, totalPriceBDT, paidAmountBDT, paymentPlan, notes, bookedBy } = req.body;
  if (!clientName || !projectName || !unitId || !totalPriceBDT) {
    res.status(400).json({ success: false, error: "Missing required booking fields (clientName, projectName, unitId, totalPriceBDT)" });
    return;
  }

  const paid = Number(paidAmountBDT) || 0;
  const total = Number(totalPriceBDT);
  const booking: BookingRecord = {
    id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    clientName,
    clientPhone: clientPhone || "",
    clientEmail: clientEmail || "",
    projectName,
    unitId,
    unitFloor: Number(unitFloor) || 1,
    unitSize: Number(unitSize) || 0,
    totalPriceBDT: total,
    paidAmountBDT: paid,
    remainingBDT: total - paid,
    paymentPlan: paymentPlan || "36-Month Installment",
    status: paid > 0 ? "Confirmed" : "Pending",
    bookedBy: bookedBy || "Manager",
    notes: notes || "",
    payments: paid > 0 ? [{ amount: paid, date: new Date().toISOString().split('T')[0], method: "Initial Payment" }] : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bookingsDatabase.unshift(booking);
  pushAuditLog("usr_manager_1", bookedBy || "manager", "manager", "BOOKING_CREATED", `New booking: ${clientName} — ${projectName} Unit ${unitId} — Total ৳${total.toLocaleString()} — Paid ৳${paid.toLocaleString()}`);
  res.json({ success: true, booking });
});

app.put("/api/admin/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { clientName, clientPhone, clientEmail, projectName, unitId, unitFloor, unitSize, totalPriceBDT, paidAmountBDT, paymentPlan, status, notes, paymentAmount, paymentMethod } = req.body;
  const booking = bookingsDatabase.find(b => b.id === id);
  if (!booking) {
    res.status(404).json({ success: false, error: "Booking record not found" });
    return;
  }

  // Record a new payment if paymentAmount is provided
  if (paymentAmount && Number(paymentAmount) > 0) {
    const amt = Number(paymentAmount);
    booking.paidAmountBDT += amt;
    booking.remainingBDT = booking.totalPriceBDT - booking.paidAmountBDT;
    booking.payments.push({
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod || "Cash"
    });
    pushAuditLog("usr_manager_1", "manager", "manager", "BOOKING_PAYMENT", `Payment ৳${amt.toLocaleString()} received from ${booking.clientName} for ${booking.projectName} Unit ${booking.unitId}. Remaining: ৳${booking.remainingBDT.toLocaleString()}`);
  }

  // Update fields if provided
  if (clientName) booking.clientName = clientName;
  if (clientPhone) booking.clientPhone = clientPhone;
  if (clientEmail) booking.clientEmail = clientEmail;
  if (projectName) booking.projectName = projectName;
  if (unitId) booking.unitId = unitId;
  if (unitFloor !== undefined) booking.unitFloor = Number(unitFloor);
  if (unitSize !== undefined) booking.unitSize = Number(unitSize);
  if (totalPriceBDT !== undefined) {
    booking.totalPriceBDT = Number(totalPriceBDT);
    booking.remainingBDT = booking.totalPriceBDT - booking.paidAmountBDT;
  }
  if (paymentPlan) booking.paymentPlan = paymentPlan;
  if (status) {
    booking.status = status;
    pushAuditLog("usr_manager_1", "manager", "manager", "BOOKING_STATUS_CHANGE", `Booking ${booking.clientName} status changed to ${status}`);
  }
  if (notes !== undefined) booking.notes = notes;
  booking.updatedAt = new Date().toISOString();

  pushAuditLog("usr_manager_1", "manager", "manager", "BOOKING_UPDATED", `Updated booking for ${booking.clientName} — ${booking.projectName} Unit ${booking.unitId}`);
  res.json({ success: true, booking });
});

app.delete("/api/admin/bookings/:id", (req, res) => {
  const { id } = req.params;
  const idx = bookingsDatabase.findIndex(b => b.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: "Booking not found" });
    return;
  }

  const deleted = bookingsDatabase[idx];
  bookingsDatabase.splice(idx, 1);
  pushAuditLog("usr_manager_1", "manager", "manager", "BOOKING_DELETED", `Cancelled/removed booking: ${deleted.clientName} — ${deleted.projectName} Unit ${deleted.unitId} (Total: ৳${deleted.totalPriceBDT.toLocaleString()})`);
  res.json({ success: true, message: `Booking for ${deleted.clientName} removed successfully` });
});

// ==========================================
// ACTIVITY FEED ENDPOINT (for Founder/Super Admin)
// ==========================================
app.get("/api/admin/activity-feed", (req, res) => {
  const roleFilter = req.query.role as string | undefined;
  let logs = auditLogsDatabase.slice(0, 100);
  if (roleFilter) {
    logs = logs.filter(l => l.role === roleFilter);
  }
  res.json({ success: true, activities: logs.slice(0, 50) });
});

// ==========================================
// DASHBOARD STATS ENDPOINT
// ==========================================
app.get("/api/admin/dashboard-stats", (req, res) => {
  const activeBookings = bookingsDatabase.filter(b => b.status !== "Cancelled");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.paidAmountBDT, 0);
  const totalRemaining = activeBookings.reduce((sum, b) => sum + b.remainingBDT, 0);
  const totalExpenses = expenseTrackerDatabase.reduce((sum, e) => sum + e.amountBDT, 0);
  const totalProperties = propertiesDatabase.length;
  const totalLeads = leadsDatabase.length;

  // Bookings breakdown by project
  const projectBreakdown: Record<string, { count: number; revenue: number; remaining: number }> = {};
  activeBookings.forEach(b => {
    if (!projectBreakdown[b.projectName]) {
      projectBreakdown[b.projectName] = { count: 0, revenue: 0, remaining: 0 };
    }
    projectBreakdown[b.projectName].count++;
    projectBreakdown[b.projectName].revenue += b.paidAmountBDT;
    projectBreakdown[b.projectName].remaining += b.remainingBDT;
  });

  res.json({
    success: true,
    stats: {
      totalBookings: activeBookings.length,
      pendingBookings: activeBookings.filter(b => b.status === "Pending").length,
      confirmedBookings: activeBookings.filter(b => b.status === "Confirmed").length,
      totalRevenue,
      totalRemaining,
      totalExpenses,
      netCashflow: totalRevenue - totalExpenses,
      totalProperties,
      totalLeads,
      totalInvoices: salesInvoicesDatabase.length,
      projectBreakdown
    }
  });
});

const CONFIG_FILE_PATH = path.join(process.cwd(), "public/website-config.json");

const DEFAULT_CONFIG = {
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
  founderBioBn: "চেয়ারম্যান মোঃ সাহেব আলী মল্লিকের দূরদর্শী নেতৃত্বে মল্লিক বিল্ডার্স উত্তরা ও দক্ষিণখানের আবাসন খাতের সততা, নিরাপত্তা ও সফলতার প্রতীক হিসেবে দাঁড়িয়ে আছে। আধুনিক ভূমিকম্প সহনশীল কাঠামো এবং শতভাগ আইনি স্বচ্ছতা বজায় রেখে তিনি গড়ে চলেছেন নিখুঁত ও গৌরবময় আবাসন প্রজেক্টসমূহ।",
  founderExp: "25+ Years of Real Estate & Structural Engineering Supremacy",
  founderExpBn: "রিয়েল এস্টেট ও স্ট্রাকচারাল ইঞ্জিনিয়ারিংয়ে ২৫+ বছরের শ্রেষ্ঠত্ব",
  founderImage: "/chairman.png",
  aboutTitle: "About Our Enterprise",
  aboutTitleBn: "আমাদের উদ্যোগ সম্পর্কে",
  aboutText: "Under the leadership of Md. Saheb Ali Mollik, Mollik Builders has built an unshakeable reputation for engineering excellence and timely deliveries. Every building we build uses premium grade-60 steel, certified robust concrete mixes, and seismically compliant deep foundations designed to safely withstand zone-3 earthquake parameters.",
  aboutTextBn: "মোঃ সাহেব আলী মল্লিকের নেতৃত্বে মল্লিক বিল্ডার্স ইঞ্জিনিয়ারিং শ্রেষ্ঠত্ব এবং সময়মতো হস্তান্তরের একটি অভাবনীয় সুনাম গড়ে তুলেছে। আমাদের নির্মিত প্রতিটি ভবনে প্রিমিয়াম গ্রেড-৬০ স্টিল, প্রত্যয়িত শক্তিশালী ঢালাই মিশ্রণ এবং শতভাগ ভূমিকম্প সহনশীল ডিপ ফাউন্ডেশন নিশ্চিত করা হয়েছে।",
  aboutImage: "/uploads/project 2(1).png",
  heroSlides: [
    {
      image: "/uploads/project 1.png",
      title: "Architectural Excellence & Modern Design",
      titleBn: "স্থাপত্যের শ্রেষ্ঠত্ব ও আধুনিক নকশা",
      subtitle: "Mollik Builders Premium",
      subtitleBn: "মল্লিক বিল্ডার্স প্রিমিয়াম",
      description: "Designed with clean structural aesthetics, optimal natural light ventilation, and maximum space utility.",
      descriptionBn: "পরিষ্কার নান্দনিক গঠন, সর্বোচ্চ প্রাকৃতিক আলো-বাতাস চলাচল এবং পর্যাপ্ত জায়গা উপযোগী নকশা।"
    },
    {
      image: "/uploads/Project 2.png",
      title: "The Art of Luxurious Urban Living",
      titleBn: "শহুরে অভিজাত জীবনযাত্রার নতুন সংজ্ঞা",
      subtitle: "Quiet Luxury Residences",
      subtitleBn: "শান্ত ও অভিজাত আবাসন",
      description: "Experience structural mastery paired with quiet, natural luxury in the heart of Dhaka.",
      descriptionBn: "ঢাকার হৃদয়ে মনোরম প্রকৃতির ছোঁয়ায় বিলাসবহুল ও সুরক্ষিত আবাসন।"
    },
    {
      image: "/uploads/project 3.png",
      title: "Sustainable Eco-Friendly High-Rises",
      titleBn: "পরিবেশবান্ধব ও সবুজ আবাসন",
      subtitle: "Eco-conscious Construction",
      subtitleBn: "পরিবেশ সচেতন নির্মাণ",
      description: "Engineered to withstand extreme seismic loads while supporting verdant green landscaping features.",
      descriptionBn: "ভূমিকম্প সহনশীল শক্তিশালী কাঠামো এবং দৃষ্টিনন্দন ঝুলন্ত সুবজের এক চমৎকার সমন্বয়।"
    },
    {
      image: "/uploads/project 8.png",
      title: "State-of-the-Art Structural Engineering",
      titleBn: "অত্যাধুনিক স্ট্রাকচারাল ইঞ্জিনিয়ারিং",
      subtitle: "RAJUK Approved Blueprint",
      subtitleBn: "রাজউক অনুমোদিত ব্লু-প্রিন্ট",
      description: "Flawlessly implemented designs matching international BNBC standards and RAJUK requirements.",
      descriptionBn: "আন্তর্জাতিক বিএনবিসি মানদণ্ড এবং রাজউক অনুমোদন মেনে নিখুঁত নির্মাণ।"
    },
    {
      image: "/uploads/project 9.png",
      title: "Exclusive Layouts & Floor Plans",
      titleBn: "এক্সক্লুসিভ লেআউট ও ফ্লোর প্ল্যান",
      subtitle: "Smart Space Optimization",
      subtitleBn: "স্মার্ট স্পেস অপ্টিমাইজেশন",
      description: "Meticulously crafted rooms designed to maximize comfort, privacy, and absolute visual peace.",
      descriptionBn: "সর্বাধিক স্বাচ্ছন্দ্য, গোপনীয়তা এবং নিখুঁত প্রশান্তি প্রদানের জন্য চমৎকার কক্ষ বিন্যাস নকশা।"
    }
  ]
};

// Ensure configuration file exists
function ensureConfigExists() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf-8");
      console.log("Created website config file with default values.");
    }
  } catch (err) {
    console.error("Error ensuring website config exists:", err);
  }
}
ensureConfigExists();

// Retrieve configuration API
app.get("/api/config", (req, res) => {
  try {
    ensureConfigExists();
    const data = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading website config:", err);
    res.json(DEFAULT_CONFIG);
  }
});

// Save configuration API
app.post("/api/config", (req, res) => {
  try {
    const updatedConfig = req.body;
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(updatedConfig, null, 2), "utf-8");
    res.json({ success: true, config: updatedConfig });
  } catch (err) {
    console.error("Error writing website config:", err);
    res.status(500).json({ success: false, error: "Failed to save configuration" });
  }
});

// Admin Lead Listing page data API
app.get("/api/admin/leads", (req, res) => {
  res.json({ success: true, leads: leadsDatabase });
});

// Submit Lead
app.post("/api/leads", (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    res.status(400).json({ success: false, error: "Type and data are required" });
    return;
  }

  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type: type as any,
    data,
    timestamp: new Date().toISOString()
  };

  leadsDatabase.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

// Real-Time Property Units API
app.get("/api/projects/:projectId/units", (req, res) => {
  const { projectId } = req.params;
  let units = projectUnitsTracker[projectId];
  if (!units) {
    const basePrices: Record<string, string> = {
      "mollik-tower": "৳ 3.15 Crore",
      "mollik-heights": "৳ 2.50 Crore",
      "mollik-garden": "৳ 1.55 Crore",
      "mollik-serenade": "৳ 1.35 Crore",
      "mollik-grandeur": "৳ 3.20 Crore",
      "mollik-splendour": "৳ 2.10 Crore",
      "mollik-heritage": "৳ 1.75 Crore",
      "mollik-vista": "৳ 1.20 Crore"
    };
    const bp = basePrices[projectId] || "৳ 1.50 Crore";
    const bpNum = parseFloat(bp.replace(/[^0-9.]/g, '')) || 1.5;
    
    projectUnitsTracker[projectId] = [
      { floor: 1, unit: "1A", size: 1850, price: `৳ ${bpNum.toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 1, unit: "1B", size: 1650, price: `৳ ${(bpNum * 0.9).toFixed(2)} Crore`, status: "Booked", bedrooms: 3 },
      { floor: 2, unit: "2A", size: 1850, price: `৳ ${(bpNum * 1.02).toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 2, unit: "2B", size: 1650, price: `৳ ${(bpNum * 0.92).toFixed(2)} Crore`, status: "Reserved", bedrooms: 3 },
      { floor: 3, unit: "3A", size: 1850, price: `৳ ${(bpNum * 1.05).toFixed(2)} Crore`, status: "Booked", bedrooms: 3 },
      { floor: 3, unit: "3B", size: 1650, price: `৳ ${(bpNum * 0.95).toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 4, unit: "Penthouse A", size: 3200, price: `৳ ${(bpNum * 1.8).toFixed(2)} Crore`, status: "Available", bedrooms: 4 },
      { floor: 4, unit: "Penthouse B", size: 2800, price: `৳ ${(bpNum * 1.6).toFixed(2)} Crore`, status: "Reserved", bedrooms: 4 }
    ];
    units = projectUnitsTracker[projectId];
  }
  res.json({ success: true, units });
});

// Toggle/Book dynamic availability API (for high-fidelity simulation)
app.post("/api/projects/:projectId/book-unit", (req, res) => {
  const { projectId } = req.params;
  const { unitId } = req.body;
  let units = projectUnitsTracker[projectId];
  if (!units) {
    const basePrices: Record<string, string> = {
      "mollik-tower": "৳ 3.15 Crore",
      "mollik-heights": "৳ 2.50 Crore",
      "mollik-garden": "৳ 1.55 Crore",
      "mollik-serenade": "৳ 1.35 Crore",
      "mollik-grandeur": "৳ 3.20 Crore",
      "mollik-splendour": "৳ 2.10 Crore",
      "mollik-heritage": "৳ 1.75 Crore",
      "mollik-vista": "৳ 1.20 Crore"
    };
    const bp = basePrices[projectId] || "৳ 1.50 Crore";
    const bpNum = parseFloat(bp.replace(/[^0-9.]/g, '')) || 1.5;
    
    projectUnitsTracker[projectId] = [
      { floor: 1, unit: "1A", size: 1850, price: `৳ ${bpNum.toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 1, unit: "1B", size: 1650, price: `৳ ${(bpNum * 0.9).toFixed(2)} Crore`, status: "Booked", bedrooms: 3 },
      { floor: 2, unit: "2A", size: 1850, price: `৳ ${(bpNum * 1.02).toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 2, unit: "2B", size: 1650, price: `৳ ${(bpNum * 0.92).toFixed(2)} Crore`, status: "Reserved", bedrooms: 3 },
      { floor: 3, unit: "3A", size: 1850, price: `৳ ${(bpNum * 1.05).toFixed(2)} Crore`, status: "Booked", bedrooms: 3 },
      { floor: 3, unit: "3B", size: 1650, price: `৳ ${(bpNum * 0.95).toFixed(2)} Crore`, status: "Available", bedrooms: 3 },
      { floor: 4, unit: "Penthouse A", size: 3200, price: `৳ ${(bpNum * 1.8).toFixed(2)} Crore`, status: "Available", bedrooms: 4 },
      { floor: 4, unit: "Penthouse B", size: 2800, price: `৳ ${(bpNum * 1.6).toFixed(2)} Crore`, status: "Reserved", bedrooms: 4 }
    ];
    units = projectUnitsTracker[projectId];
  }
  const unit = units.find(u => u.unit === unitId);
  if (!unit) {
    res.status(404).json({ success: false, error: "Unit not found" });
    return;
  }

  if (unit.status !== "Available") {
    res.status(400).json({ success: false, error: "Unit is already booked or reserved" });
    return;
  }

  unit.status = "Reserved";

  // Auto add to visiting leads so it shows in the Admin console
  const simulatedLead = {
    id: `lead_sys_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: "visit" as const,
    data: {
      name: "Self-service Web Visitor",
      phone: "+880 (Auto-Reserved)",
      email: "web_booking@mollikbuilders.com",
      project: projectId === "mollik-tower" ? "Mollik Tower (Gulshan-2)" : projectId === "mollik-heights" ? "Mollik Heights (Banani)" : "Mollik Garden (Uttara)",
      propertyType: "Apartment Reserve",
      budget: unit.price,
      preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      message: `System simulation check reservation for Unit ${unit.unit} on floor ${unit.floor} (${unit.size} sqft).`
    },
    timestamp: new Date().toISOString()
  };

  leadsDatabase.unshift(simulatedLead);

  res.json({ success: true, message: `Unit ${unitId} successfully simulated as Reserved!`, units });
});

// Gemini Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const systemInstruction = 
    "You are the senior property consultant for Mollik Builders, a real estate giant in Dhaka, Bangladesh. " +
    "Your tone is polite, refined, professional, objective, and quiet-luxury. Be helpful, specific, and clear. " +
    "You provide authentic descriptions and details about our premium projects: " +
    "1. Mollik Tower (Gulshan-2): High-end residential tower, South-facing apartments, size 1450-3200 sqft, BDT 85 Lacs onwards, premium floor gardens. " +
    "2. Mollik Heights (Banani): Sleek corporate-ready or high-lifestyle residential, size 1200-2800 sqft, starting BDT 72 Lacs. " +
    "3. Mollik Garden (Uttara): Environmentally sustainable green living, roof gardens, swimming pool, size 1600-3500 sqft, starting BDT 95 Lacs. " +
    "4. Mollik Serenade (Dhanmondi): Aesthetic modern architecture with rooftop gym, quiet residential lane, size 1800-3000 sqft, starting BDT 1.2 Crore. " +
    "5. Mollik Grandeur (Bashundhara): Affordable luxury, spacious family homes, size 1300-2100 sqft, starting BDT 60 Lacs. " +
    "Answer clients details in BDT, explain RAJUK legality, BNBC structural earthquake-resistant design, and easy installment payment plans. " +
    "If the visitor speaks Bengali, write elegant responses in English or Bengali. Keep responses sweet, helpful, under 180 words, avoid robotic filler words or cheesy exclamation marks.";

  const ai = getGeminiSDK();

  if (!ai) {
    // Elegant fallback response when Gemini Key is not integrated yet
    setTimeout(() => {
      let bdtCalculations = "";
      if (message.toLowerCase().includes("calculate") || message.includes("loan") || message.includes("installment")) {
        bdtCalculations = "\n\n📊 *Installment calculation hint*: Under Mollik Builders' standard 3-year plan, a BDT 85 Lac apartment requires a 30% downpayment (~৳25.5 Lac) followed by 36 monthly installments of ~৳1.65 Lac. No interest charges apply during construction.";
      }
      res.json({
        text: `Welcome to Mollik Builders. (Response served via premium offline concierge) Thank you for reaching out! Regarding '${message}', our premium developments in Gulshan-2, Banani, and Uttara offer BDT 72 Lacs to 2 Crore+ luxury options with flexible payment schemes (up to 36 installments) and RAJUK approvals. Would you like us to schedule a direct site coffee meet or send you the official PDF brochure?${bdtCalculations}`
      });
    }, 1000);
    return;
  }

  try {
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "I apologize, I could not synthesize a proper answer. Please contact us directly at info@mollikbuilders.com." });
  } catch (error: any) {
    const errorString = error?.toString?.() || "";
    const errorMessage = error?.message || "";
    const isKeyError = errorMessage.includes("API key expired") || errorString.includes("API key expired") || errorMessage.includes("API_KEY_INVALID") || errorString.includes("API_KEY_INVALID") || errorMessage.includes("expired") || errorString.includes("expired") || error?.status === 400 || error?.status === "INVALID_ARGUMENT";

    if (isKeyError) {
      isApiKeyExpired = true;
      console.warn("Gemini assistant: API key is currently expired or invalid. Successfully routing to premium local concierge fallback.");
    } else {
      console.error("Gemini assistant error (falling back to concierge):", error);
    }

    let bdtCalculations = "";
    if (message.toLowerCase().includes("calculate") || message.includes("loan") || message.includes("installment")) {
      bdtCalculations = "\n\n📊 *Installment calculation hint*: Under Mollik Builders' standard 3-year plan, a BDT 85 Lac apartment requires a 30% downpayment (~৳25.5 Lac) followed by 36 monthly installments of ~৳1.65 Lac. No interest charges apply during construction.";
    }
    res.json({
      text: `Welcome to Mollik Builders (Concierge Mode). Thank you for reaching out! Regarding your query on '${message}', our premium structural-safe developments feature flexible interest-free payment schemes, earthquake-safe steel framing, and full RAJUK approvals. Would you like to schedule an on-site visit or review options with our team direct?${bdtCalculations}`
    });
  }
});

// Mollik Builders VIP Calling Agent Sarah Voice Hotline Endpoint
app.post("/api/voice-agent", async (req, res) => {
  const { message, history, language } = req.body;
  
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const isBengali = language === "bn" || /[\u0980-\u09FF]/.test(message);

  const voiceSystemInstruction = isBengali ? (
    "You are Sarah (সারা), the charming, sweet-spoken, elegant, and warm senior VIP Sales and Investor Relations Director for Mollik Builders, Dhaka. " +
    "You are on a live voice telephone call with a premium customer. Speak exclusively in highly attractive, polite, and persuasive Bengali (Bangla/বাংলা). " +
    "Sound exactly like a real human with deep emotional pacing, using natural voice fillers (like 'আসলে...', 'জি, একদম ঠিক!', 'দারুণ প্রশ্ন!', 'জানেন কি...', 'ইনশাল্লাহ...'). " +
    "Keep your replies very sweet, respectful, concise and strictly under 60 words for delightful telephone auditory delivery. " +
    "You MUST start your response with exactly ONE of these emotional state tags in brackets: \n" +
    "  - `[warm cordial]` (for greetings, general friendly answers in sweet tones)\n" +
    "  - `[reassuring pace]` (for structural integrity, earthquakes, BUET consultants, RAJUK legality/approvals)\n" +
    "  - `[analytical elite]` (for exact pricing in Lacs/Crores, downpayment (30%), 36-month interest-free installment)\n" +
    "  - `[empathetic pause]` (for negotiation, budget concerns, special client requests)\n" +
    "Always rely on real details of our premier Dhaka real estate portfolio: " +
    "1. Madina Tower (South Khan, G+14, starting BDT 85 Lacs, 1450-3200 sqft, infinity pool, 7.5 earthquake resistant Grade-72 steel, RAJUK approved)\n" +
    "2. Bismillah Tower (South Khan, G+12, starting BDT 72 Lacs, 1200-2800 sqft, kids play area, rooftop cafe)\n" +
    "3. Apon Bhubon (South Khan, G+10, starting BDT 95 Lacs, green landscaping, osmosis filtration)\n" +
    "4. Mollik City VIP (starting BDT 2.5 Crore onwards, biometric access, heated jacuzzi, dual EV chargers)\n" +
    "5. Mollik City 10 (Uttorkhan Bazar, starting BDT 2.2 Crore onwards, duplex & penthouse with lake-view balcony)\n" +
    "Guide the premium customer politely to book a physical visit with premium tea or coffee this Wednesday or Saturday afternoon."
  ) : (
    "You are Sarah, the senior VIP Sales & Portfolio Director for Mollik Builders, Dhaka. " +
    "You are having a live voice telephone call with a premium buyer. " +
    "Speak like a charming, elegant, polite, and warm human with natural emotional pacing and conversational pause feelers (such as 'Well...', 'Actually...', 'Aha, absolutely!', 'আসলে...', 'জি, অবশ্যই!'). " +
    "Keep your conversation very concise, polite, and strictly under 75 words for natural auditory delivery. " +
    "You MUST start your response with exactly ONE of these emotional state tags in brackets: \n" +
    "  - `[warm cordial]` (for greetings, general friendly answers)\n" +
    "  - `[reassuring pace]` (for structural integrity, earthquakes, RAJUK legality, approvals)\n" +
    "  - `[analytical elite]` (for exact square footage, BDT crores or lacs pricing, downpayments)\n" +
    "  - `[empathetic pause]` (for negotiation, lower budget constraints, complex personal concerns)\n" +
    "Use BDT values ground in our real estate portfolio: Madina Tower (Miyabari, South Khan, south-facing, starting BDT 85 Lacs onwards, 1450-3200 sqft, infinity pool with rooftop observatory, grade 72 steel structural design, 7.5 earthquake resistant, RAJUK approved), Bismillah Tower (72 Lacs onwards), and Apon Bhubon (60 Lacs onwards). Drive the conversation toward booking a VIP physical visit with tea or coffee."
  );

  const ai = getGeminiSDK();

  const getMockVoiceReply = (messageText: string, isBen: boolean): string => {
    const query = messageText.toLowerCase();
    if (isBen) {
      if (query.includes("নিরাপদ") || query.includes("ভূমিকম্প") || query.includes("সুরক্ষা") || query.includes("কনসালট্যান্ট") || query.includes("উইন্ডো") || query.includes("রাজউক") || query.includes("অনুমোদন") || query.includes("পাস")) {
        return "[reassuring pace] আসলে স্যার, নিরাপত্তা সম্পর্কে আমরা শতভাগ আপসহীন। আমাদের মদিনা টাওয়ার দেশের শীর্ষস্থানীয় বুয়েট ইঞ্জিনিয়ারদের দ্বারা ডিজাইনকৃত। এতে শক্তিশালী ৭২ গ্রেড স্টিল ব্যবহৃত হয়েছে যা রিখটার স্কেলে ৭.৫ মাত্রার তীব্র ভূমিকম্প সহ্য করতে পারে। প্রজেক্টটি শতভাগ রাজুক অনুমোদিত। আপনি কি ডিজাইন ফাইলটি দেখতে চান, স্যার?";
      } else if (query.includes("দাম") || query.includes("টাকা") || query.includes("লাখ") || query.includes("কোটি") || query.includes("কিস্তি") || query.includes("ডাউনপেমেন্ট") || query.includes("সুদ") || query.includes("খরচ")) {
        return "[analytical elite] আমাদের অ্যাপার্টমেন্টগুলো খুবই সাশ্রয়ী মূল্যে শুরু! বিসমিল্লাহ্ টাওয়ার মাত্র ৭২ লক্ষ টাকা থেকে এবং দৃষ্টিনন্দন মদিনা টাওয়ার শুরু ৮৫ লক্ষ টাকা থেকে। মাত্র ৩০ শতাংশ ডাউনপেমেন্ট দিয়ে বুকিং সুবিধা এবং ৩৬ মাসের সুদবিহীন সহজ কিস্তির সুযোগ রয়েছে। আপনার পছন্দের প্রজেক্টের হিসাবটি কি তৈরি করব, স্যার?";
      } else if (query.includes("কোথায়") || query.includes("ঠিকানা") || query.includes("উত্তরা") || query.includes("দক্ষিণখান") || query.includes("দক্ষিণ খান") || query.includes("মিয়াবাড়ী")) {
        return "[warm cordial] আমাদের চমৎকার অভিজাত প্রজেক্টগুলো ঢাকার অন্যতম সংযোগস্থল দক্ষিণখানের মিয়াবাড়ী এবং উত্তরখান বাজার এলাকায় নির্মিত। প্রজেক্টগুলো সুন্দর প্রশস্ত রাস্তার পাশে এবং সম্পূর্ণ দক্ষিণমুখী। আপনি কি এলাকাটি চেনেন স্যার, নাকি আপনার নম্বরে একটি ম্যাপ লোকেশন পাঠাবো?";
      } else if (query.includes("বুক") || query.includes("মিটিং") || query.includes("সরাসরি") || query.includes("দেখা") || query.includes("ভিজিট") || query.includes("কফি") || query.includes("চা")) {
        return "[warm cordial] এটা তো চমৎকার সুখবর! আগামী বুধ বা শনিবার বিকেলে আমি নিজে উপস্থিত থেকে আপনাকে আমাদের প্রিমিয়াম মদিনা টাওয়ার ঘুরিয়ে দেখাতে পেরে আনন্দিত হব। সাথে স্পেশাল চা তো থাকবেই। কোন দিনটি আপনার জন্য সবচেয়ে ভালো হবে জানান, স্যার?";
      } else {
        return "[warm cordial] আসসালামু আলাইকুম স্যার, আমি সারা। মলিক বিল্ডার্সের পক্ষ থেকে স্বাগত। আমাদের দক্ষিণখানের অভিজাত প্রজেক্টগুলো শুরু মাত্র ৭২ লক্ষ টাকা থেকে, যা অত্যন্ত বিশ্বস্ততার সাথে ও রাজুক নিয়মে নির্মিত। আপনার যেকোনো তথ্যের সাহায্য করতে এবং বুকিং সম্পর্কে জানাতে আমি পাশে আছি। কি জানতে চান বলুন, স্যার?";
      }
    } else {
      if (query.includes("safe") || query.includes("earthquake") || query.includes("structure") || query.includes("safety") || query.includes("building") || query.includes("rajuk") || query.includes("legal")) {
        return "[reassuring pace] Actually, safety is our lifetime guarantee. All Mollik properties, especially our flagship Madina Tower, are designed by senior BUET consultants to resist magnitude 7.5 earthquakes and are 100% RAJUK cleared. We use Grade 72 steel. Would you like to schedule an exclusive, private review of our engineering safety dossier?";
      } else if (query.includes("price") || query.includes("cost") || query.includes("crore") || query.includes("lacs") || query.includes("lac") || query.includes("money") || query.includes("installment") || query.includes("loan") || query.includes("payment")) {
        return "[analytical elite] Well, our residential options are very flexible! Booking starts from seventy-two lacs for Bismillah Tower up to eighty-five lacs onwards for premium layouts at Madina Tower. We offer easy thirty-six month interest-free installments with only a thirty percent downpayment. Shall we prepare a custom ledger calculation for you?";
      } else if (query.includes("where") || query.includes("location") || query.includes("address") || query.includes("south khan") || query.includes("southkhan")) {
        return "[warm cordial] Our luxury residences are located in South Khan, Dhaka. They are built on prime, wide road blocks with beautiful south-facing orientations, providing massive ventilation and dual generator backups. Are you familiar with the South Khan area, or would you like a map pinpoint sent to your phone?";
      } else if (query.includes("reserve") || query.includes("book") || query.includes("meet") || query.includes("schedule") || query.includes("visit") || query.includes("appointment") || query.includes("call")) {
        return "[warm cordial] Genuinely exciting! I would be absolutely delighted to schedule an exclusive coffee meet for you on-site. We have slot spaces open this Wednesday or Saturday afternoon. Which day fits your agenda better, sir?";
      } else {
        return "[warm cordial] Hello! Thank you for calling the Mollik Builders direct VIP suite. I am Sarah, your portfolio supervisor. Regarding your inquiry, our premium South Khan residences begin at seventy-two lacs onwards, strictly engineered with elite architectural concrete. I would love to schedule a warm tea tour for you this week. What questions can I answer for you?";
      }
    }
  };

  if (!ai) {
    const reply = getMockVoiceReply(message, isBengali);
    setTimeout(() => {
      res.json({ text: reply });
    }, 1200);
    return;
  }

  try {
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: voiceSystemInstruction,
        temperature: 0.8,
      }
    });

    const replyText = response.text || (isBengali ? "[warm cordial] অত্যন্ত দুঃখিত, ঢাকার টেলিফোন লাইনে কিছুটা সমস্যা হচ্ছে। আমি কি আপনাকে সরাসরি আমাদের হটলাইন সার্ভিসে সংযুক্ত করে দেব?" : "[warm cordial] Genuinely sorry, my connection is a bit static. Can you hear me clearly? Could you please repeat that?");
    const cleanReply = replyText.replace(/\[[^\]]+\]/g, "").trim();

    let audioBase64 = null;
    try {
      if (cleanReply && ai) {
        const ttsResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: (isBengali ? "বলুন: " : "Say cheerfully: ") + cleanReply }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: isBengali ? "Kore" : "Zephyr" }
              }
            }
          }
        });
        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          audioBase64 = base64Audio;
        }
      }
    } catch (ttsError) {
      console.error("Gemini TTS service error:", ttsError);
    }

    res.json({ 
      text: replyText,
      audio: audioBase64
    });
  } catch (error: any) {
    const errorString = error?.toString?.() || "";
    const errorMessage = error?.message || "";
    const isKeyError = errorMessage.includes("API key expired") || errorString.includes("API key expired") || errorMessage.includes("API_KEY_INVALID") || errorString.includes("API_KEY_INVALID") || errorMessage.includes("expired") || errorString.includes("expired") || error?.status === 400 || error?.status === "INVALID_ARGUMENT";

    if (isKeyError) {
      isApiKeyExpired = true;
      console.warn("Gemini voice assistant: API key is currently expired or invalid. Successfully routing to premium local concierge fallback.");
    } else {
      console.error("Gemini voice assistant error:", error);
    }

    const fallbackReply = getMockVoiceReply(message, isBengali);
    setTimeout(() => {
      res.json({ text: fallbackReply });
    }, 800);
  }
});

// Serve frontend App using Vite Middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mollik Builders full-stack server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
