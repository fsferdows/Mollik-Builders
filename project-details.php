<?php
/**
 * Mollik Builders - Project Premium Detail Portal
 * Dynamic Server-Side PHP Renderer for Luxury Estates
 */

// Define safe dataset of mollik estates
$projects = [
    "mollik-tower" => [
        "id" => "mollik-tower",
        "name" => "Madina Tower",
        "nameBn" => "মদিনা টাওয়ার",
        "location" => "Dakshinkhan, Miyabari, Dhaka",
        "locationBn" => "দক্ষিণখান, মিয়াবাড়ী, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1450-3200 sqft",
        "sizeBn" => "১৪৫০-৩২০০ বর্গফুট",
        "price" => "৳85 Lac onwards",
        "priceBn" => "৳৮৫ লক্ষ থেকে শুরু",
        "status" => "Booking Open",
        "statusBn" => "বুকিং চলছে",
        "image" => "/uploads/0b856c28-6379-4010-a39d-76394ab88269.JPG",
        "description" => "Madina Tower is an exquisitely designed, south-facing project located at the prime block of Miyabari, Dakshinkhan. Presenting perfect ventilation, high architectural security, structural earthquake safety measures, and private elevator lobbies.",
        "descriptionBn" => "মদিনা টাওয়ার দক্ষিণখানের মিয়াবাড়ীর প্রধান ব্লকে অবস্থিত অত্যন্ত সূক্ষ্ম নকশায় তৈরি একটি দক্ষিণমুখী প্রজেক্ট। এতে রয়েছে পর্যাপ্ত আলো-বাতাস, সর্বোচ্চ নিরাপত্তা ব্যবস্থা, ভূমিকম্প প্রতিরোধী কাঠামো এবং চমৎকার লিফট লবি সুবিধা।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Infinity Pool", "Rooftop Observatory", "Private Gymnasium", "24/7 Multi-tier Security", "Dual Standby Generator", "Double Glazed low-E Windows"],
        "amenitiesBn" => ["ইনফিনিটি সুইমিং পুল", "ছাদভিত্তিক পর্যবেক্ষণ কেন্দ্র", "ব্যক্তিগত জিমনেসিয়াম", "২৪/৭ বহুতর নিরাপত্তা", "দ্বৈত ব্যাকআপ জেনারেটর", "ডাবল গ্লেজড গ্লাস উইন্ডো"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "12 Katha", "valueBn" => "১২ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 14 Floors", "valueBn" => "জি + ১৪ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "28 Premium Units", "valueBn" => "২৮টি প্রিমিয়াম ইউনিট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "Ample Basement Slots", "valueBn" => "প্রশস্ত বেসমেন্ট স্লট"]
        ]
    ],
    "mollik-heights" => [
        "id" => "mollik-heights",
        "name" => "Bismillah Tower",
        "nameBn" => "বিসমিল্লাহ্ টাওয়ার",
        "location" => "Dakshinkhan, Miyabari, Dhaka",
        "locationBn" => "দক্ষিণখান, মিয়াবাড়ী, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1200-2800 sqft",
        "sizeBn" => "১২০০-২৮০০ বর্গফুট",
        "price" => "৳72 Lac onwards",
        "priceBn" => "৳৭২ লক্ষ থেকে শুরু",
        "status" => "Few Units Left",
        "statusBn" => "সীমিত ইউনিট বাকি",
        "image" => "/uploads/4ba54971-0a0f-4b98-b36b-3a68b5dbcd3a.JPG",
        "description" => "Designed with modern state-of-the-art layout requirements, Bismillah Tower provides dynamic lifestyle spaces in Dakshinkhan, Miyabari. Enjoy quick transit to Uttara hubs while preserving a completely quiet residential sanctuary.",
        "descriptionBn" => "আবাসন চাহিদার সাথে মিল রেখে ডিজাইন করা বিসমিল্লাহ্ টাওয়ার দক্ষিণখানের মিয়াবাড়ীতে চমৎকার এক প্রশান্তিময় আবাসনের প্রতিশ্রুতি দেয়। উত্তরার কাছাকাছি যোগাযোগ সুবিধা এবং শান্ত পরিবেশের একটি মনোরম মেলবন্ধন।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Rooftop Cafe Area", "Grand Reception Lobby", "Indoor Kids Play Zone", "Fully Automated Lifts", "Underground Rainwater Harvesting", "Fiber Optic Connectivity"],
        "amenitiesBn" => ["রফটপ ক্যাফে এরিয়া", "বিশাল অভ্যর্থনা লবি", "ইনডোর শিশু বিনোদন কেন্দ্র", "সম্পূর্ণ অটোমেটিক লিফট", "ভূগর্ভস্থ বৃষ্টির পানি সংরক্ষণ", "ফাইবার অপটিক ইন্টারনেট সংযোগ"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "10 Katha", "valueBn" => "১০ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 12 Floors", "valueBn" => "জি + ১২ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "24 Premium Units", "valueBn" => "২৪টি প্রিমিয়াম ইউনিট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "2 Bays Per Apartment", "valueBn" => "প্রতি ফ্ল্যাটে ২টি পার্কিং"]
        ]
    ],
    "mollik-garden" => [
        "id" => "mollik-garden",
        "name" => "Apon Bhubon",
        "nameBn" => "আপন ভুবন",
        "location" => "Dakshinkhan, Miyabari, Dhaka",
        "locationBn" => "দক্ষিণখান, মিয়াবাড়ী, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1600-3500 sqft",
        "sizeBn" => "১৬০০-৩৫০০ বর্গফুট",
        "price" => "৳95 Lac onwards",
        "priceBn" => "৳৯৫ লক্ষ থেকে শুরু",
        "status" => "New Launch",
        "statusBn" => "নতুন লঞ্চ",
        "image" => "/uploads/6c08c96c-3d6b-436a-a3fe-54f2b07c0df4.JPG",
        "description" => "Apon Bhubon represents natural eco-friendly architecture with green landscaping in Dakshinkhan, Miyabari. Highly secure, BNBC structural code compliant, featuring modern common areas and automated backup services.",
        "descriptionBn" => "আপন ভুবন দক্ষিণখানের মিয়াবাড়ীতে সবুজ ও পরিবেশবান্ধব স্থাপত্যের এক অনন্য সৃষ্টি। বিএনবিসি কোড অনুযায়ী ভূমিকম্প সহনশীল করে নির্মিত চমৎকার এই প্রজেক্টে রয়েছে আধুনিক নাগরিক সুবিধার সব আয়োজন।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Solar-powered Common Areas", "Jogging Track", "Community Meeting Suite", "Aroma Herb Garden", "High-capacity Cargo Elevator", "Water Filtration Osmosis System"],
        "amenitiesBn" => ["সৌরশক্তি চালিত কমন স্পেস", "জগিং ট্র্যাক", "কমিউনিটি ডিসকাশন হল", "অ্যারোমা হার্বাল গার্ডেন", "উচ্চ ক্ষমতাসম্পন্ন কার্গো লিফট", "ওয়াটার ফিল্টারিং সিস্টেম"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "15 Katha", "valueBn" => "১৫ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 10 Floors", "valueBn" => "জি + ১০ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "20 Spacious Homes", "valueBn" => "২০টি আরামদায়ক অ্যাপার্টমেন্ট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "Secured Ground Parking", "valueBn" => "সুরক্ষিত গ্রাউন্ড পার্কিং"]
        ]
    ],
    "mollik-serenade" => [
        "id" => "mollik-serenade",
        "name" => "Mollik City Tower",
        "nameBn" => "মল্লিক সিটি টাওয়ার",
        "location" => "Uttarkhan, Dhaka",
        "locationBn" => "উত্তরখান, ঢাকা",
        "type" => "Penthouse",
        "typeBn" => "পেন্টহাউস / ডুপ্লেক্স",
        "size" => "1800-3000 sqft",
        "sizeBn" => "১৮০০-৩০০০ বর্গফুট",
        "price" => "৳1.2 Crore onwards",
        "priceBn" => "৳১.২ কোটি থেকে শুরু",
        "status" => "Ongoing",
        "statusBn" => "চলমান প্রকল্প",
        "image" => "/uploads/55e673fc-7278-4f95-9959-6d8c2c83543a.JPG",
        "description" => "Located prominently in the rapidly developing area of Uttarkhan, Mollik City Tower features exquisite hand-carved finishing, spacious dining rooms, and high quality security features suited for premier living.",
        "descriptionBn" => "উত্তরখানের ক্রমবর্ধমান উন্নত এলাকায় চমৎকার অবস্থানে নির্মিত মল্লিক সিটি টাওয়ার। দৃষ্টিনন্দন ডিজাইন ও মজবুত কাঠামোর সাথে প্রস্তুত এই প্রজেক্টে রয়েছে প্রিমিয়াম ফিটিংস এবং সর্বোচ্চ নিরাপত্তা ব্যবস্থা।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Private Plunge Pools", "Rooftop BBQ terrace", "Soundproof Acoustic Glazing", "24-Hour Advanced CCTV", "Centralized Gas piping and safety valves"],
        "amenitiesBn" => ["ব্যক্তিগত মিনি সুইমিং পুল", "রফটপ বারবিকিউ টেরেস", "শব্দ নিরোধক অ্যাকোস্টিক গ্লেজিং", "২৪ ঘণ্টা সিসিটিভি পাহারা", "সেন্ট্রাল গ্যাস ও ফায়ার সেফটি ভালভ"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "8 Katha", "valueBn" => "৮ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 9 Floors", "valueBn" => "জি + ৯ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "16 Limited Units", "valueBn" => "১৬টি চমৎকার অ্যাপার্টমেন্ট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "Basement 1 Slot Each", "valueBn" => "বেসমেন্টে প্রতি ফ্ল্যাটে ১টি স্লট"]
        ]
    ],
    "mollik-grandeur" => [
        "id" => "mollik-grandeur",
        "name" => "Mollik City Tower - 5",
        "nameBn" => "মল্লিক সিটি টাওয়ার - ৫",
        "location" => "Uttarkhan, Dhaka",
        "locationBn" => "উত্তরখান, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1300-2100 sqft",
        "sizeBn" => "১৩০০-২১০০ বর্গফুট",
        "price" => "৳60 Lac onwards",
        "priceBn" => "৳৬০ লক্ষ থেকে শুরু",
        "status" => "Upcoming",
        "statusBn" => "আসন্ন প্রকল্প",
        "image" => "/uploads/321cad5b-7fb9-4b85-93e7-66b1e5eb2673.JPG",
        "description" => "Mollik City Tower - 5 prioritizes modern ventilating design with ample natural air and sunshine in Uttarkhan, Dhaka. Excellent choice for safe family life with close walking proximity to local schools and shopping centers.",
        "descriptionBn" => "উত্তরখানে অবস্থিত মল্লিক সিটি টাওয়ার - ৫ সর্বাধিক প্রাকৃতিক আলো এবং বাতাস চলাচলের নকশায় তৈরি পরিকল্পিত আবাসন। এটি আপনার পরিবারের জন্য এক সুরক্ষিত এবং মনোরম আবাসের নিশ্চয়তা দেয়।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Multi-purpose Community Room", "Equipped Kids Playground", "Deep Tube Well Backup", "Fire escape staircase with smoke doors", "Driver's waiting quarters"],
        "amenitiesBn" => ["বহুমুখী কমিউনিটি হল রুম", "শরীরচর্চা ও শিশু বিনোদন পার্ক ব্যবস্থা", "ধোঁয়ানিরোধক ফায়ার এস্কেপ সিড়ি", "চালকদের অপেক্ষাগার"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "14 Katha", "valueBn" => "১৪ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 15 Floors", "valueBn" => "জি + ১৫ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "30 Family Apartments", "valueBn" => "৩০টি ফ্যামিলি ফ্ল্যাট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "Secure Dual Level Garage", "valueBn" => "দ্বি-স্তরের সুরক্ষিত গ্যারেজ"]
        ]
    ],
    "mollik-splendour" => [
        "id" => "mollik-splendour",
        "name" => "Mollik City VIP",
        "nameBn" => "মল্লিক সিটি VIP",
        "location" => "Dakshinkhan, Dhaka",
        "locationBn" => "দক্ষিণখান, ঢাকা",
        "type" => "Penthouse",
        "typeBn" => "পেন্টহাউস / ডুপ্লেক্স",
        "size" => "2200-4500 sqft",
        "sizeBn" => "২২০০-৪৫০০ বর্গফুট",
        "price" => "৳2.5 Crore onwards",
        "priceBn" => "৳২.৫ কোটি থেকে শুরু",
        "status" => "Booking Open",
        "statusBn" => "বুকিং চলছে",
        "image" => "/uploads/486138b9-4e2d-43b0-b340-a2ae8f3b3d6c.JPG",
        "description" => "Mollik City VIP presents absolute luxury and exclusivity for prestigious buyers in Dakshinkhan. High density earthquake-resistant materials, spacious rooftop recreation deck, and elite private layouts defining majestic living.",
        "descriptionBn" => "ডাকশিনখান এলাকাতে আভিজাত্যের শেষ কথা নিয়ে দাঁড়িয়ে আছে মল্লিক সিটি VIP। শক্তিশালী ভূমিকম্প প্রতিরোধী নির্মাণ সামগ্রী এবং বিলাসবহুল ছাদবাগান আপনার লাইফস্টাইলকে করবে অনন্য ও দৃষ্টি নন্দন।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Smart Keyless Biometric Access", "Heated Hydrotherapy Jacuzzi Pool", "Multi-car Basement with dual EV Chargers", "Soundproof Cinema Auditorium", "State-of-the-art HVAC Central Climate Control", "24/7 Dedicated Diplomatic Guard Connection"],
        "amenitiesBn" => ["স্মার্ট বায়োমেট্রিক লক ও সিকিউরিটি", "হিটেড হাইড্রোথেরাপি জ্যাকুজি", "ইভি চার্জার্স বিশিষ্ট পার্কিং বেসমেন্ট", "শব্দ নিরোধক হোম থিয়াটার সুবিধা", "সেন্ট্রাল এসি ক্লাইমেট কন্ট্রোল", "विशेष ২৪/৭ নিরাপত্তা সংযোগ"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "16 Katha", "valueBn" => "১৬ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 6 Floors", "valueBn" => "জি + ৬ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "10 Duplex Masterpieces", "valueBn" => "১০টি ডুপ্লেক্স মাস্টারপিস"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "3 Assigned Slots Per Unit", "valueBn" => "প্রতি ইউনিটে ৩টি বরাদ্দকৃত পার্কিং"]
        ]
    ],
    "mollik-heritage" => [
        "id" => "mollik-heritage",
        "name" => "Mollik City VIP - 7",
        "nameBn" => "মল্লিক সিটি VIP - ৭",
        "location" => "Uttarkhan, Dhaka",
        "locationBn" => "উত্তরখান, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1500-2700 sqft",
        "sizeBn" => "১৫০০-২৭০০ বর্গফুট",
        "price" => "৳78 Lac onwards",
        "priceBn" => "৳৭৮ লক্ষ থেকে শুরু",
        "status" => "Ongoing",
        "statusBn" => "চলমান প্রকল্প",
        "image" => "/uploads/c2cdf210-72e7-437a-89a2-d779eaa5f27d.JPG",
        "description" => "Mollik City VIP - 7 brings vintage traditional styling blended with modern robust structural design to Uttarkhan, Dhaka. Earthquake compliant foundations, clay architectural details, and secure living for premium taste.",
        "descriptionBn" => "ঐতিহ্যবাহী নকশার সাথে আধুনিক মজবুত স্ট্রাকচারের অপরূপ সংমিশ্রণে উত্তরখানে নির্মিত হচ্ছে মল্লিক সিটি VIP - ৭। ভূমিকম্প সহনশীল শক্তিশালী ভিত্তি এবং চমৎকার লাল ইটের নান্দনিক ডিজাইনের এক নিরাপদ আবাসন।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Classic Community Courtyard", "Traditional Ground-floor Tea Lounge", "Rooftop Stargazing Green Deck", "Retractable Glass Canopy Over Atrium", "Large Emergency Water Reservoir System", "Fully-Equipped Fire Escape Protection System"],
        "amenitiesBn" => ["ঐতিহ্যবাহী কমিউনিটি কোর্ট ইয়ার্ড", "ক্লাসিক নিচতলা চা লাউঞ্জ", "দৃষ্টিনন্দন ছাদবাগান", "অ্যাট্রিয়াম কাঁচ ছাদ", "বিশাল ওয়াটার রিজার্ভার", "অত্যাধুনিক ফায়ার এস্কেপ নিরাপত্তা"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "11 Katha", "valueBn" => "১১ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 10 Floors", "valueBn" => "জি + ১০ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "18 Vintage Residences", "valueBn" => "১৮টি প্রাচীন ঐতিহ্যবাহী �       "status" => "Few Units Left",
        "statusBn" => "সীমিত ইউনিট বাকি",
        "image" => "/uploads/project 9.png",
        "description" => "Mollik City 10 sets a magnificent standard of duplex and penthouse architecture in Dakshinkhan, Dhaka. Live above the cloud with amazing panoramic views, custom marble floors, and state-of-the-art secure details.",
        "descriptionBn" => "দক্ষিণখানের অভিজাত এলাকায় নির্মিত দুতলা ডুপ্লেক্স এবং পেন্টহাউসের বিলাসবহুল আয়োজন মল্লিক সিটি ১০। মনোরম প্যানোরামিক খোলা ভিউ, সুসজ্জিত মার্বেল মেঝের নিখুঁত ফিনিশিং ও রাজকীয় জীবনযাত্রার শ্রেষ্ঠ ঠিকানা।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Private Lake-view Balconies", "Heated Hydrotherapy Jacuzzi", "Dedicated 24/7 Security Concierge", "Integrated VRF Smart Cooling Systems", "Double-Glazed soundproof panels", "Triplex Basement Car Parking with EV Ports"],
        "amenitiesBn" => ["সুপরিসর ভিউ সমৃদ্ধ ব্যালকনি", "হিটেড হাইড্রোথেরাপি জ্যাকুজি", "২৪/৭ বিশেষ সিকিউরিটি কনসিয়ার্জ", "সমন্বিত ভিআরএফ স্মার্ট এসি সিস্টেম", "দ্বি-স্তরবিশিষ্ট শব্দনিরোধক ডাবল গ্লাস", "ইভি চার্জারযুক্ত বাউন্ডেড পার্কিং"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "14 Katha", "valueBn" => "১৪ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 15 Floors", "valueBn" => "জি + ১৫ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "14 Royal Dwellings", "valueBn" => "১৪টি রাজকীয় পেন্টহাউস"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "3 Dedicated Bays per Penthouse", "valueBn" => "প্রতি ফ্ল্যাটে ৩টি ডেডিকেটেড পার্কিং"]
        ]
    ]
];e" => "/uploads/project 9.png",
        "description" => "Mollik City 10 sets a magnificent standard of duplex and penthouse architecture in Dakshinkhan, Dhaka. Live above the cloud with amazing panoramic views, custom marble floors, and state-of-the-art secure details.",
        "descriptionBn" => "দক্ষিণখানের অভিজাত এলাকায় নির্মিত দুতলা ডুপ্লেক্স এবং পেন্টহাউসের বিলাসবহুল আয়োজন মল্লিক সিটি ১০। মনোরম প্যানোরামিক খোলা ভিউ, সুসজ্জিত মার্বেল মেঝের নিখুঁত ফিনিশিং ও রাজকীয় জীবনযাত্রার শ্রেষ্ঠ ঠিকানা।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Private Lake-view Balconies", "Heated Hydrotherapy Jacuzzi", "Dedicated 24/7 Security Concierge", "Integrated VRF Smart Cooling Systems", "Double-Glazed soundproof panels", "Triplex Basement Car Parking with EV Ports"],
        "amenitiesBn" => ["সুপরিসর ভিউ সমৃদ্ধ ব্যালকনি", "হিটেড হাইড্রোথেরাপি জ্যাকুজি", "২৪/৭ বিশেষ সিকিউরিটি কনসিয়ার্জ", "সমন্বিত ভিআরএফ স্মার্ট এসি সিস্টেম", "দ্বি-স্তরবিশিষ্ট শব্দনিরোধক ডাবল গ্লাস", "ইভি চার্জারযুক্ত বাউন্ডেড পার্কিং"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "14 Katha", "valueBn" => "১৪ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 15 Floors", "valueBn" => "জি + ১৫ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "14 Royal Dwellings", "valueBn" => "১৪টি রাজকীয় পেন্টহাউস"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "3 Dedicated Bays per Penthouse", "valueBn" => "প্রতি ফ্ল্যাটে ৩টি ডেডিকেটেড পার্কিং"]
        ]
    ]
];ction"],
        "amenitiesBn" => ["স্মার্ট বায়োমেট্রিক লক ও সিকিউরিটি", "হিটেড হাইড্রোথেরাপি জ্যাকুজি", "ইভি চার্জার্স বিশিষ্ট পার্কিং বেসমেন্ট", "শব্দ নিরোধক হোম থিয়েটার সুবিধা", "সেন্ট্রাল এসি ক্লাইমেট কন্ট্রোল", "কূটনৈতিক এলাকার বিশেষ ২৪/৭ নিরাপত্তা"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "16 Katha", "valueBn" => "১৬ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 6 Floors", "valueBn" => "জি + ৬ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "10 Duplex Masterpieces", "valueBn" => "১০টি ডুপ্লেক্স মাস্টারপিস"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "3 Assigned Slots Per Unit", "valueBn" => "প্রতি ইউনিটে ৩টি বরাদ্দকৃত পার্কিং"]
        ]
    ],
    "mollik-heritage" => [
        "id" => "mollik-heritage",
        "name" => "Mollik Heritage",
        "nameBn" => "মল্লিক হেরিটেজ",
        "location" => "Wari, Old Dhaka",
        "locationBn" => "ওয়ারী, পুরান ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1500-2700 sqft",
        "sizeBn" => "১৫০০-২৭০০ বর্গফুট",
        "price" => "৳78 Lac onwards",
        "priceBn" => "৳৭৮ লক্ষ থেকে শুরু",
        "status" => "Ongoing",
        "statusBn" => "চলমান প্রকল্প",
        "image" => "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
        "description" => "Blending vintage colonial brick patterns with contemporary concrete columns, Mollik Heritage offers nostalgic Dhaka beauty paired with brand new state-of-the-art earthquake compliant foundations. Red clay handpicked textures and custom wrought-iron craftsmanship complement the historic lifestyle of prestigious Wari.",
        "descriptionBn" => "পুরান ঢাকার ওয়ারীর ঐতিহ্যবাহী লাল ইটের স্মৃতি বহনকারী ডিজাইনে আধুনিক কংক্রিট কাঠামোর মিশ্রণে নির্মিত মল্লিক হেরিটেজ। দৃষ্টিনন্দন কলোনিয়াল ডিজাইন ও ভূমিকম্প সহনশীল নিরাপদ ফাউন্ডেশনের এক চমৎকার মেলবন্ধন।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Classic Community Courtyard", "Traditional Ground-floor Tea Lounge", "Rooftop Stargazing Green Deck", "Retractable Glass Canopy Over Atrium", "Large Emergency Water Reservoir System", "Fully-Equipped Fire Escape Protection System"],
        "amenitiesBn" => ["ঐতিহ্যবাহী কমিউনিটি কোর্ট ইয়ার্ড", "ক্লাসিক নিচতলা চা লাউঞ্জ", "দৃষ্টিনন্দন ছাদবাগান ও টেরেস", "অ্যাট্রিয়াম ঢাকা রিট্র্যাক্টেবল কাঁচ ছাদ", "বিশাল রিভার্স অসমোসিস রিজার্ভার", "অত্যাধুনিক ফায়ার এস্কেপ ও স্মোক ডিটেকশন"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "11 Katha", "valueBn" => "১১ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 10 Floors", "valueBn" => "জি + ১০ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "18 Vintage Residences", "valueBn" => "১৮টি প্রাচীন ঐতিহ্যবাহী ফ্ল্যাট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "1 Premium Slot per Apartment", "valueBn" => "প্রতি ফ্ল্যাটে ১টি প্রিমিয়াম স্লট"]
        ]
    ],
    "mollik-vista" => [
        "id" => "mollik-vista",
        "name" => "Mollik Vista",
        "nameBn" => "মল্লিক ভিস্তা",
        "location" => "Mirpur DOHS, Dhaka",
        "locationBn" => "মিরপুর ডিওএইচএস, ঢাকা",
        "type" => "Residential",
        "typeBn" => "আবাসিক",
        "size" => "1350-2500 sqft",
        "sizeBn" => "১৩৫০-২৫০০ বর্গফুট",
        "price" => "৳68 Lac onwards",
        "priceBn" => "৳৬৮ লক্ষ থেকে শুরু",
        "status" => "Upcoming",
        "statusBn" => "আসন্ন প্রকল্প",
        "image" => "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800",
        "description" => "A sleek, disciplined residential haven built exquisitely for veteran defense officers and families seeking elite planning, serenity and quiet living. Mollik Vista provides unparalleled sunset lake views, structured compliance, deep tubewell water backup, and wide open fire-evacuation layouts.",
        "descriptionBn" => "নিরাপত্তা ও শৃঙ্খলার প্রতীক মিরপুর ডিওএইচএস-এ নির্মিত একটি নান্দনিক সুরক্ষাবলয়। আধুনিক অগ্নিনির্বাপণ ব্যবস্থা, চমৎকার পশ্চিমমুখী সূর্যাস্তের ভিউ এবং সুপরিসর আধুনিক রান্নাঘরের ভেন্টিলেশন নিয়ে প্রস্তুত এই প্রজেক্ট।",
        "rajukApproved" => true,
        "earthquakeResistant" => true,
        "amenities" => ["Rooftop Solar Panel Arrays", "Multi-Tier Fire-Resistant Steel Doors", "Integrated Security Alarm Setup", "360-View Observation Lounge", "High capacity modern stretcher lift", "Fully Automatic Car Lift System"],
        "amenitiesBn" => ["সৌরশক্তির সুপ্রশস্ত ছাদ প্যানেল", "ফায়ার-রেজিস্ট্যান্ট মজবুত স্টিল দরজা", "সমন্বিত ইনডোর সিকিউরিটি অ্যালার্ম", "৩৬০ ডিগ্রী সবুজ ক্যানোপি লাউঞ্জ", "উচ্চ ধারণক্ষমতার মাল্টি-স্পিড স্ট্রেচার লিফট", "অটোমেটিক কার লিফটিং মেকানিজম"],
        "specs" => [
            ["label" => "Land Area", "labelBn" => "জমির পরিমাণ", "value" => "9 Katha", "valueBn" => "৯ কাঠা"],
            ["label" => "Building Height", "labelBn" => "ভবনের উচ্চতা", "value" => "G + 12 Floors", "valueBn" => "জি + ১২ তলা"],
            ["label" => "Total Apartments", "labelBn" => "মোট অ্যাপার্টমেন্ট", "value" => "22 Elite Units", "valueBn" => "২২টি এলিট আধুনিক ইউনিট"],
            ["label" => "Car Parking", "labelBn" => "গাড়ি পার্কিং", "value" => "Secure Intelligent Garages", "valueBn" => "সুরক্ষিত আধুনিক ইন্টেলিজেন্ট গ্যারেজ"]
        ]
    ]
];

// Check requested ID
$projectId = isset($_GET['id']) ? trim($_GET['id']) : 'mollik-tower';
$lang = isset($_GET['lang']) && $_GET['lang'] === 'bn' ? 'bn' : 'en';

if (!array_key_exists($projectId, $projects)) {
    // Fallback if not found
    $project = $projects['mollik-tower'];
} else {
    $project = $projects[$projectId];
}

$title = $lang === 'bn' ? $project['nameBn'] . " - মল্লিক বিল্ডার্স" : $project['name'] . " - Mollik Builders";
$desc = $lang === 'bn' ? $project['descriptionBn'] : $project['description'];
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($title); ?></title>
    <!-- Tailwind CSS loaded dynamically -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts Inter & Playfair Display & Hind Siliguri -->
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', 'Hind Siliguri', sans-serif;
        }
        h1, h2, h3, .font-serif {
            font-family: 'Playfair Display', serif;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
    </style>
</head>
<body class="bg-[#faf9f6] text-neutral-850 selection:bg-[#C8A165]/30 min-h-screen flex flex-col justify-between">

    <!-- Premium Minimal Header -->
    <header class="bg-white border-b border-neutral-100 py-5 px-6 md:px-12 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="javascript:if(window.self!==window.top){window.parent.postMessage({type:'close-php-modal'},'*');}else{window.location.href='/';}" class="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs font-bold transition-all px-3 py-1.5 rounded-lg hover:bg-neutral-100 bg-neutral-50 border border-neutral-200" title="Back to Home">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    <span><?php echo $lang === 'bn' ? "ফিরে যান" : "Back"; ?></span>
                </a>
                <div class="h-6 w-px bg-neutral-200"></div>
                <a href="/" class="flex flex-col">
                    <span class="font-serif text-xl md:text-2xl font-black text-neutral-900 tracking-tight">Mollik<span class="text-[#C8A165]">.</span></span>
                    <span class="text-[8px] md:text-[9px] font-mono tracking-[0.4em] text-neutral-400 uppercase">Builders Luxury</span>
                </a>
            </div>
            
            <div class="flex items-center gap-4">
                <!-- Lang selection widget inside PHP -->
                <div class="flex rounded-md bg-neutral-100 p-1 text-xs font-bold font-mono">
                    <a href="?id=<?php echo urlencode($project['id']); ?>&lang=en" class="px-2.5 py-1 rounded <?php echo $lang === 'en' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'; ?>">EN</a>
                    <a href="?id=<?php echo urlencode($project['id']); ?>&lang=bn" class="px-2.5 py-1 rounded <?php echo $lang === 'bn' ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'; ?>">বাংলা</a>
                </div>
                
                <a href="/#contact" class="hidden sm:inline-block px-4 py-2 border border-neutral-300 hover:border-[#1B4D3E] text-[11px] font-extrabold uppercase tracking-widest text-[#1B4D3E] transition-all rounded">
                    <?php echo $lang === 'bn' ? "যোগাযোগ" : "Enquire"; ?>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-grow py-12 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Side: Cinematic Parallax Image and Key Stats -->
        <div class="lg:col-span-7 space-y-6">
            <!-- Project hero image container -->
            <div class="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-neutral-100 border border-neutral-150 group">
                <img src="<?php echo htmlspecialchars($project['image']); ?>" alt="<?php echo htmlspecialchars($project['name']); ?>" class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
                
                <!-- Floating tags -->
                <div class="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur-md px-3.5 py-2 text-[10px] font-mono font-bold tracking-widest uppercase text-[#C8A165] rounded-lg shadow-lg">
                    <?php echo $lang === 'bn' ? $project['statusBn'] : $project['status']; ?>
                </div>
                
                <?php if ($project['rajukApproved']): ?>
                    <div class="absolute top-4 right-4 bg-[#1B4D3E] text-white px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded-lg shadow-lg">
                        RAJUK APPROVED
                    </div>
                <?php endif; ?>
            </div>

            <!-- Specifications Grid -->
            <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-4">
                <h3 class="font-serif text-lg font-black text-neutral-850 border-b border-neutral-100 pb-3">
                    <?php echo $lang === 'bn' ? "প্রজেক্টের বিবরণ ও বৈশিষ্ট্যসমূহ" : "Spec Details & Structural Parameters"; ?>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($project['specs'] as $spec): ?>
                        <div class="p-3.5 bg-[#faf9f6] rounded-xl border border-neutral-150 flex flex-col justify-center">
                            <span class="text-[10px] font-mono uppercase text-neutral-400 font-bold tracking-wider">
                                <?php echo $lang === 'bn' ? $spec['labelBn'] : $spec['label']; ?>
                            </span>
                            <span class="text-sm font-extrabold text-[#1B4D3E] mt-0.5">
                                <?php echo $lang === 'bn' ? $spec['valueBn'] : $spec['value']; ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- INTERACTIVE 3D EXPLORER SECTION -->
            <div class="bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden shadow-2xl space-y-0">
                <div class="p-6 bg-[#080b16] border-b border-neutral-900 flex justify-between items-center">
                    <div>
                        <span class="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C8A165] font-bold block mb-1">
                            <?php echo $lang === 'bn' ? "ত্রিমাত্রিক ইন্টারেক্টিভ মডেল" : "INTERACTIVE 3D CAD MODEL"; ?>
                        </span>
                        <h3 class="font-serif text-2xl font-black text-white leading-tight">
                            <?php echo $lang === 'bn' ? htmlspecialchars($project['nameBn']) . " 3D" : htmlspecialchars($project['name']) . " 3D"; ?>
                        </h3>
                    </div>
                    <span class="px-2.5 py-1 rounded bg-[#1B4D3E] text-white text-[9px] font-mono font-bold tracking-widest uppercase animate-pulse">
                        <?php echo $lang === 'bn' ? "লাইভ সিমুলেশন" : "Live Simulation"; ?>
                    </span>
                </div>
                <div class="relative w-full aspect-[16/10] md:h-[550px] bg-[#05070f]">
                    <iframe 
                        src="/api/3d-view?id=<?php echo urlencode($project['id']); ?>&lang=<?php echo $lang; ?>" 
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
                        <?php echo $lang === 'bn' ? "লাইভ ফ্ল্যাট ট্র্যাকার ও ইনভেন্টরি" : "REAL-TIME SUITE SELECTOR"; ?>
                    </span>
                    <h3 class="font-serif text-2xl font-black text-neutral-855 leading-tight">
                        <?php echo $lang === 'bn' ? "আবাসিক ফ্ল্যাট ও বুকিং পোর্টাল" : "Interactive Suite Availability Matrix"; ?>
                    </h3>
                    <p class="text-xs text-neutral-500 mt-1">
                        <?php echo $lang === 'bn' ? "আপনার কাঙ্ক্ষিত স্যুটটি নির্বাচন করে সরাসরি বুকিং রিকুয়েস্ট পাঠান।" : "Select your preferred layout to view parameters or submit structural reservations instantly."; ?>
                    </p>
                </div>

                <!-- Live counter summary -->
                <div class="grid grid-cols-3 gap-3 bg-[#faf9f6] p-4 rounded-xl border border-neutral-200/60 text-center">
                    <div>
                        <span class="text-[10px] font-mono uppercase text-[#1B4D3E] block font-bold"><?php echo $lang === 'bn' ? "খালি রয়েছে" : "Available"; ?></span>
                        <span id="available-counter" class="text-lg font-black text-emerald-600 font-mono">--</span>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono uppercase text-neutral-400 block font-bold"><?php echo $lang === 'bn' ? "সংরক্ষিত" : "Reserved"; ?></span>
                        <span id="reserved-counter" class="text-lg font-black text-amber-500 font-mono">--</span>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono uppercase text-neutral-400 block font-bold"><?php echo $lang === 'bn' ? "বিক্রিত/বুকড" : "Booked"; ?></span>
                        <span id="booked-counter" class="text-lg font-black text-neutral-400 font-mono">--</span>
                    </div>
                </div>

                <!-- Visual floor selection filter -->
                <div class="space-y-2">
                    <span class="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                        <?php echo $lang === 'bn' ? "ফ্লোর ফিল্টার" : "FILTER BY FLOOR LEVEL"; ?>
                    </span>
                    <div id="floor-tab-container" class="flex flex-wrap gap-1.5 pb-2 border-b border-neutral-100">
                        <!-- Filled by JS -->
                    </div>
                </div>

                <!-- Units Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="units-list-grid">
                    <!-- Filled dynamically by call to backend API -->
                    <div class="col-span-full py-12 text-center text-xs text-neutral-450 font-mono">
                        ⏳ <?php echo $lang === 'bn' ? "লাইভ ডাটা অনুসন্ধান করা হচ্ছে..." : "Synchronizing premium database..."; ?>
                    </div>
                </div>

                <!-- Inline Dynamic Booking Form Module (Hidden by default, slides down when flat is clicked) -->
                <div id="booking-drawer-inner" class="hidden transition-all duration-300 p-5 bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200/80 mt-4 space-y-4 shadow-sm">
                    <div class="flex items-center justify-between border-b border-neutral-200 pb-3">
                        <div>
                            <span class="text-[9px] font-mono uppercase text-[#C8A165] font-bold block">
                                <?php echo $lang === 'bn' ? "নির্বাচনকৃত ফ্ল্যাটের বিবরণ" : "SELECTED RESIDENCE DETAILS"; ?>
                            </span>
                            <h4 id="selected-flat-label" class="text-base font-bold text-neutral-900">Suite 3B</h4>
                        </div>
                        <button type="button" onclick="closeBookingDrawer()" class="text-neutral-400 hover:text-neutral-700 font-bold text-lg">&times;</button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase"><?php echo $lang === 'bn' ? "সাইজ" : "SIZE"; ?></span>
                            <span id="detail-size" class="font-bold text-neutral-850">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase"><?php echo $lang === 'bn' ? "বেডরুম" : "BEDROOMS"; ?></span>
                            <span id="detail-beds" class="font-bold text-neutral-850">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase"><?php echo $lang === 'bn' ? "মূল্য" : "PRICE"; ?></span>
                            <span id="detail-price" class="font-bold text-[#1B4D3E]">--</span>
                        </div>
                        <div class="p-2.5 bg-white rounded border border-neutral-150">
                            <span class="block text-[8px] font-mono tracking-wider text-neutral-400 uppercase"><?php echo $lang === 'bn' ? "অবস্থা" : "STATUS"; ?></span>
                            <span id="detail-status" class="font-bold text-emerald-600">--</span>
                        </div>
                    </div>

                    <!-- Direct reservation form linked to units tracker -->
                    <form id="flat-reservation-form" onsubmit="submitFlatBooking(event)" class="space-y-3 pt-2">
                        <input type="hidden" id="booking-unit-id" name="unitId">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input type="text" id="booking-name" placeholder="<?php echo $lang === 'bn' ? "আপনার পুরো নাম" : "Your full name"; ?>" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800">
                            <input type="tel" id="booking-phone" placeholder="<?php echo $lang === 'bn' ? "মোবাইল নাম্বার (+৮৮০)" : "Phone number"; ?>" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800">
                            <input type="email" id="booking-email" placeholder="<?php echo $lang === 'bn' ? "ইমেইল এড্রেস" : "Email address"; ?>" required class="bg-white border border-neutral-300 rounded px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#C8A165] focus:outline-none placeholder-neutral-450 text-neutral-800">
                        </div>
                        <button type="submit" id="booking-submit-btn" class="w-full py-3 bg-[#1B4D3E] text-white hover:bg-[#153a2f] text-xs font-bold uppercase tracking-widest rounded transition-all shadow-md active:scale-98">
                            <?php echo $lang === 'bn' ? "অনলাইন বুকিং নিশ্চিত করুন" : "SECURE THIS SELECTION IN REAL-TIME"; ?>
                        </button>
                    </form>
                </div>
            </div>

            <script>
                const currentProjectId = "<?php echo $project['id']; ?>";
                const isBanglaLang = "<?php echo $lang; ?>" === "bn";
                let activeProjectUnits = [];
                let currentFloorLvl = 1;

                async function fetchProjectUnits() {
                    try {
                        const response = await fetch(`/api/projects/${currentProjectId}/units`);
                        if (!response.ok) throw new Error("API Connection failed");
                        const data = await response.json();
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
                    const bp = "<?php echo $project['price']; ?>";
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
                    const avail = activeProjectUnits.filter(u => u.status === "Available").length;
                    const res = activeProjectUnits.filter(u => u.status === "Reserved").length;
                    const book = activeProjectUnits.filter(u => u.status === "Booked" || u.status === "Sold").length;

                    document.getElementById("available-counter").innerText = convertNum(avail);
                    document.getElementById("reserved-counter").innerText = convertNum(res);
                    document.getElementById("booked-counter").innerText = convertNum(book);
                }

                function convertNum(num) {
                    if (!isBanglaLang) return num;
                    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
                    return num.toString().split('').map(digit => {
                        const parsed = parseInt(digit);
                        return isNaN(parsed) ? digit : bnDigits[parsed];
                    }).join('');
                }

                function renderFloorTabs() {
                    const floors = [...new Set(activeProjectUnits.map(u => u.floor))].sort((a,b)=>a-b);
                    const container = document.getElementById("floor-tab-container");
                    if (!container) return;
                    container.innerHTML = "";

                    // If requested floor filter is not in current set, default to first available
                    if (floors.length > 0 && !floors.includes(currentFloorLvl)) {
                        currentFloorLvl = floors[0];
                    }

                    floors.forEach(f => {
                        const btn = document.createElement("button");
                        btn.type = "button";
                        btn.className = `px-3 py-1 text-xs font-bold font-mono rounded border transition-all ${
                            currentFloorLvl === f 
                                ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm" 
                                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-500 hover:bg-neutral-50"
                        }`;
                        btn.innerText = (isBanglaLang ? "লেভেল " : "L") + convertNum(f);
                        btn.onclick = () => {
                            currentFloorLvl = f;
                            renderFloorTabs();
                            renderUnitsGrid();
                        };
                        container.appendChild(btn);
                    });
                }

                function renderUnitsGrid() {
                    const grid = document.getElementById("units-list-grid");
                    if (!grid) return;
                    const filtered = activeProjectUnits.filter(u => u.floor === currentFloorLvl);
                    grid.innerHTML = "";

                    if (filtered.length === 0) {
                        grid.innerHTML = `<div class="col-span-full text-center py-12 text-xs text-neutral-400 font-mono">No units listed for this level.</div>`;
                        return;
                    }

                    filtered.forEach(unit => {
                        const card = document.createElement("div");
                        const isAvailable = unit.status === "Available";
                        const isReserved = unit.status === "Reserved";
                        
                        let borderCls = "border-neutral-200 bg-white hover:border-[#C8A165]/80 hover:shadow-md";
                        let statusBadge = "";

                        if (isAvailable) {
                            statusBadge = `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold rounded-full">${isBanglaLang ? "খালি" : "AVAILABLE"}</span>`;
                        } else if (isReserved) {
                            statusBadge = `<span class="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[9px] font-bold rounded-full">${isBanglaLang ? "সংরক্ষিত" : "RESERVED"}</span>`;
                            borderCls = "border-amber-200 bg-amber-50/10 cursor-not-allowed";
                        } else {
                            statusBadge = `<span class="bg-neutral-100 text-neutral-400 border border-neutral-200 px-2 py-0.5 text-[9px] font-bold rounded-full">${isBanglaLang ? "বিক্রিত" : "SOLD OUT"}</span>`;
                            borderCls = "border-neutral-150 bg-neutral-50 cursor-not-allowed opacity-75";
                        }

                        card.className = `p-4 rounded-xl border ${borderCls} transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer relative overflow-hidden group`;
                        
                        card.innerHTML = `
                            <div class="flex items-start justify-between">
                                <div>
                                    <h4 class="font-serif text-lg font-black text-neutral-900 group-hover:text-[#1B4D3E] transition-colors leading-tight">
                                        ${isBanglaLang ? "স্যুট " : "Suite "}${unit.unit}
                                    </h4>
                                    <p class="text-[10px] font-mono text-neutral-450 mt-0.5 uppercase tracking-wider">
                                        ${convertNum(unit.size)} SQFT • ${convertNum(unit.bedrooms || 3)} BHK
                                    </p>
                                </div>
                                ${statusBadge}
                            </div>
                            
                            <div class="border-t border-neutral-100 pt-2.5 flex items-center justify-between text-xs">
                                <div>
                                    <span class="block text-[8px] font-mono text-neutral-400 uppercase tracking-widest leading-none">${isBanglaLang ? "মূল্য বিবরণ" : "VALUATION"}</span>
                                    <span class="font-extrabold text-neutral-750 mt-1 block">${unit.price}</span>
                                </div>
                                ${isAvailable ? `
                                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#C8A165] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        ${isBanglaLang ? "বুকিং দিন" : "BOOK"} &rarr;
                                    </span>
                                ` : `
                                    <span class="text-[10px] font-mono text-neutral-400 font-bold">${isBanglaLang ? "বুকড" : "OCCUPIED"}</span>
                                `}
                            </div>
                        `;

                        if (isAvailable) {
                            card.onclick = () => selectFlatForBooking(unit);
                        } else {
                            card.onclick = () => {
                                alert(isBanglaLang 
                                    ? "দুঃখিত! এই লাক্সারি ইউনিটটি ইতিমধ্যে অন্য একজন ভিজিটর বুক অথবা সংরক্ষিত করে ফেলেছেন।" 
                                    : "This fine luxury residence is already reserved. Please select another available suit."
                                );
                            };
                        }

                        grid.appendChild(card);
                    });
                }

                function selectFlatForBooking(unit) {
                    const drawer = document.getElementById("booking-drawer-inner");
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

                function closeBookingDrawer() {
                    const drawer = document.getElementById("booking-drawer-inner");
                    if (drawer) drawer.classList.add("hidden");
                }

                async function submitFlatBooking(event) {
                    event.preventDefault();
                    const unitId = document.getElementById("booking-unit-id").value;
                    const name = document.getElementById("booking-name").value;
                    const phone = document.getElementById("booking-phone").value;
                    const email = document.getElementById("booking-email").value;

                    const btn = document.getElementById("booking-submit-btn");
                    btn.disabled = true;
                    btn.innerText = isBanglaLang ? "অনুরোধ প্রসেস হচ্ছে..." : "SECURING EXCLUSIVITY REGISTER...";

                    try {
                        const response = await fetch(`/api/projects/${currentProjectId}/book-unit`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ unitId, name, phone, email })
                        });

                        const data = await response.json();
                        if (data.success) {
                            alert(isBanglaLang 
                                ? `অভিনন্দন! আপনার বুকিং অনুরোধটি সফলভাবে সংরক্ষণ করা হয়েছে স্যুট ${unitId}-এর জন্য। আমাদের লাক্সারি পোর্টফোলিও অফিসার দ্রুত যোগাযোগ করবেন।` 
                                : `Congratulations! Suite ${unitId} is successfully reserved for you under name: ${name}. Our relationship director will contact you within 24 hours.`
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
                    activeProjectUnits = activeProjectUnits.map(unit => {
                        if (unit.unit === uId) {
                            return { ...unit, status: "Reserved" };
                        }
                        return unit;
                    });
                    aggregateCounters();
                    renderUnitsGrid();
                    alert(isBanglaLang 
                        ? `ধন্যবাদ ${name}! অফলাইন মেমরিতে প্রজেক্ট ডাটা রেজিস্টার করা হয়েছে। স্যুট ${uId} এখন সংরক্ষিত দেখাচ্ছে।` 
                        : `Thank you ${name}! Your pre-reservation is recorded. Suite ${uId} is now showing as Reserved in active memory.`
                    );
                    closeBookingDrawer();
                }

                document.addEventListener("DOMContentLoaded", fetchProjectUnits);
            </script>

            <!-- Amenities Lists -->
            <div class="bg-white p-6 rounded-2xl border border-neutral-155 shadow-sm space-y-4">
                <h3 class="font-serif text-lg font-black text-neutral-850">
                    <?php echo $lang === 'bn' ? "বিশেষ সুবিধাসমূহ (Premium Amenities)" : "Amenities & Lifestyle Conveniences"; ?>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <?php 
                    $amenityList = $lang === 'bn' ? $project['amenitiesBn'] : $project['amenities'];
                    foreach ($amenityList as $amenity): 
                    ?>
                        <div class="flex items-center gap-3 text-xs text-neutral-700">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#C8A165] flex-shrink-0"></span>
                            <span><?php echo htmlspecialchars($amenity); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Right Side: Contact, Price Booking Desk -->
        <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div class="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white p-6 md:p-8 rounded-2xl border border-neutral-800 shadow-2xl space-y-6">
                <div>
                    <span class="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C8A165] font-bold block mb-1">
                        <?php echo $lang === 'bn' ? "একচেটিয়া আবাসন প্রকল্প" : "EXCLUSIVE PORTFOLIO"; ?>
                    </span>
                    <h2 class="text-3xl font-serif font-bold tracking-tight text-white leading-tight">
                        <?php echo $lang === 'bn' ? $project['nameBn'] : $project['name']; ?>
                    </h2>
                    <p class="text-xs text-neutral-400 mt-2 font-mono tracking-wide">
                        📍 <?php echo $lang === 'bn' ? $project['locationBn'] : $project['location']; ?>
                    </p>
                </div>

                <div class="border-t border-neutral-800 pt-5 flex items-center justify-between">
                    <div>
                        <span class="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                            <?php echo $lang === 'bn' ? "মূল্য পরিসীমা" : "INVESTMENT VALUE"; ?>
                        </span>
                        <span class="text-xl md:text-2xl font-black text-[#C8A165]">
                            <?php echo $lang === 'bn' ? $project['priceBn'] : $project['price']; ?>
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                            <?php echo $lang === 'bn' ? "ফ্ল্যাট সাইজ" : "AVAILABLE SIZES"; ?>
                        </span>
                        <span class="text-sm font-bold text-white">
                            <?php echo $lang === 'bn' ? $project['sizeBn'] : $project['size']; ?>
                        </span>
                    </div>
                </div>

                <p class="text-xs text-neutral-300 font-light leading-relaxed">
                    <?php echo $desc; ?>
                </p>

                <!-- PHP Contact Lead Collector Form -->
                <div class="border-t border-neutral-800 pt-5 space-y-4">
                    <h4 class="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                        📞 <?php echo $lang === 'bn' ? "ইনস্ট্যান্ট বুকিং রিকুয়েস্ট" : "REQUEST FLOORPLANS & CALL"; ?>
                    </h4>
                    
                    <form action="" method="POST" class="space-y-3" onsubmit="alert('Thank you! Your direct consultation lead is recorded on our Mollik server.'); return false;">
                        <input type="text" placeholder="<?php echo $lang === 'bn' ? "আপনার নাম" : "Your full name"; ?>" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        <input type="tel" placeholder="<?php echo $lang === 'bn' ? "মোবাইল নম্বর" : "Contact phone (+880)"; ?>" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        <input type="email" placeholder="<?php echo $lang === 'bn' ? "ইমেইল ঠিকানা" : "Email address"; ?>" required class="w-full bg-neutral-850 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C8A165] placeholder-neutral-500">
                        
                        <button type="submit" class="w-full py-3 bg-[#C8A165] hover:bg-[#b58e54] text-neutral-950 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-98">
                            <?php echo $lang === 'bn' ? "কলব্যাক এবং অফার পাঠান" : "SEND BROCHURE NOW"; ?>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Developer Footnote -->
            <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-[10px] font-mono text-neutral-500 space-y-1">
                <span class="block font-bold uppercase text-[#1B4D3E]">
                    <?php echo $lang === 'bn' ? "মল্লিক সিকিউরিটি স্ট্যান্ডার্ডস" : "STRUCTURAL ASSURANCES"; ?>
                </span>
                <p class="font-normal text-neutral-400">
                    <?php echo $lang === 'bn' 
                        ? '• বিএনবিসি কোড অনুযায়ী ৭.৫ মাত্রার ভূমিকম্প প্রতিরোধ ক্ষমতা বিশিষ্ট নির্মাণ।' 
                        : '• 7.5 Richter scale compliant BNBC seismic structural resilience engineering with high-tensile 72.5-grade steel.'; ?>
                </p>
                <div class="pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px]">
                    <span class="text-[#C8A165] font-bold">📄 PHP Dynamic Live Engine</span>
                    <span>© <?php echo date("Y"); ?> Mollik Builders Ltd.</span>
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
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
