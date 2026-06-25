import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Send, Sparkles, X, ChevronDown, MessageSquare, AlertCircle
} from "lucide-react";

interface AIVoiceConciergeProps {
  language: "en" | "bn";
}

type CallState = "idle" | "dialing" | "ringing" | "connected" | "disconnected";
type EmotionState = "warm cordial" | "reassuring pace" | "analytical elite" | "empathetic pause";

interface ChatMessage {
  sender: "user" | "sarah";
  text: string;
  emotion?: EmotionState;
  timestamp: string;
}

export default function AIVoiceConcierge({ language }: AIVoiceConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>("warm cordial");
  const [sarahSpeakingText, setSarahSpeakingText] = useState("");
  
  // Audio & Speech references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Visual wave animation values (dynamic simulation when speaking/listening)
  const [voiceLevels, setVoiceLevels] = useState<number[]>([1, 1, 1, 1, 1, 1, 1, 1]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Initialize Web Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "bn" ? "bn-BD" : "en-US";
      
      recognition.onstart = () => {
        simulateVoiceActivity(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleUserUtterance(transcript);
        }
      };
      
      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        simulateVoiceActivity(false);
        // Switch to text mode automatically on speech errors
        if (callState === "connected") {
          setIsTextMode(true);
        }
      };
      
      recognition.onend = () => {
        simulateVoiceActivity(false);
        // If still connected and not muted, automatically re-listen in voice mode
        if (callState === "connected" && !isTextMode && !isMuted && !synthRef.current?.speaking) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore if already running
          }
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsTextMode(true); // Fallback to text mode if API is missing
    }

    return () => {
      stopRingtone();
      cleanupSpeech();
    };
  }, [language, callState, isTextMode, isMuted]);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sarahSpeakingText]);

  // Adjust speech language on change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "bn" ? "bn-BD" : "en-US";
    }
  }, [language]);

  const cleanupSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
    }
  };

  // Simulate graphical levels on the voice bar
  const simulateVoiceActivity = (isActive: boolean) => {
    if (!isActive) {
      setVoiceLevels([1, 1, 1, 1, 1, 1, 1, 1]);
      return;
    }
    const interval = setInterval(() => {
      setVoiceLevels(Array.from({ length: 8 }, () => Math.random() * 25 + 5));
    }, 120);
    return () => clearInterval(interval);
  };

  // WEB AUDIO API - Premium Sound Generator (No external files needed)
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playDialingTone = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Pleasant digital high-end double chime
    const playChime = (timeOffset: number, freq1: number, freq2: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(freq1, ctx.currentTime + timeOffset);
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + timeOffset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime + timeOffset);
      osc2.start(ctx.currentTime + timeOffset);

      osc1.stop(ctx.currentTime + timeOffset + 0.5);
      osc2.stop(ctx.currentTime + timeOffset + 0.5);
    };

    // Play double keytone chime sequence
    playChime(0, 697, 1209);
    playChime(0.18, 770, 1336);
    playChime(0.36, 852, 1477);
  };

  const startRingtone = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const playRing = () => {
      // European ringback tone (425Hz pulsing)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(425, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 1.0);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    };

    playRing();
    ringIntervalRef.current = window.setInterval(playRing, 3000);
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
  };

  // CONTROL ACTIONS
  const startCall = async () => {
    initAudioCtx();
    setCallState("dialing");
    setMessages([]);
    setSarahSpeakingText("");
    
    playDialingTone();

    setTimeout(() => {
      setCallState("ringing");
      startRingtone();
      
      setTimeout(() => {
        stopRingtone();
        setCallState("connected");
        handleUserUtterance("__GREETING__");
      }, 3000);
    }, 1500);
  };

  const endCall = () => {
    stopRingtone();
    cleanupSpeech();
    setCallState("disconnected");
    simulateVoiceActivity(false);
    setTimeout(() => setCallState("idle"), 1500);
  };

  // SEND & RECEIVE AI LOGIC
  const handleUserUtterance = async (text: string) => {
    const isGreeting = text === "__GREETING__";
    
    if (!isGreeting) {
      const userMsg: ChatMessage = {
        sender: "user",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }

      const historyPayload = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: isGreeting ? "Hello" : text,
          history: historyPayload,
          language: language
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const rawText = data.text || "";
      const emotionRegex = /^\[(.*?)\]\s*(.*)/s;
      const match = rawText.match(emotionRegex);
      
      let parsedEmotion: EmotionState = "warm cordial";
      let cleanText = rawText;

      if (match) {
        const parsedTag = match[1].toLowerCase();
        cleanText = match[2];
        if (["warm cordial", "reassuring pace", "analytical elite", "empathetic pause"].includes(parsedTag)) {
          parsedEmotion = parsedTag as EmotionState;
        }
      }

      setCurrentEmotion(parsedEmotion);

      const sarahMsg: ChatMessage = {
        sender: "sarah",
        text: cleanText,
        emotion: parsedEmotion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, sarahMsg]);
      setSarahSpeakingText(cleanText);

      if (data.audio) {
        playBase64Audio(data.audio);
      } else {
        speakSarahText(cleanText, parsedEmotion);
      }

    } catch (e) {
      console.error("Call agent request failed:", e);
      const fallbackText = language === "en" 
        ? "I am sorry, my connection is slightly unstable. Let us continue via text messaging."
        : "দুঃখিত, সংযোগে সামান্য ত্রুটি হচ্ছে। চলুন আমরা টেক্সট মেসেজের মাধ্যমে যোগাযোগ অব্যাহত রাখি।";
      
      setSarahSpeakingText(fallbackText);
      speakSarahText(fallbackText, "warm cordial");
      setIsTextMode(true);
    }
  };

  const playBase64Audio = (base64Data: string) => {
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onplay = () => {
        simulateVoiceActivity(true);
      };
      
      audio.onended = () => {
        simulateVoiceActivity(false);
        setSarahSpeakingText("");
        if (callState === "connected" && !isTextMode && !isMuted && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {}
        }
      };
      
      audio.play();
    } catch (e) {
      console.error("Failed to play base64 audio:", e);
      // Fallback to text synthesis on audio failure
      speakSarahText(sarahSpeakingText, currentEmotion);
    }
  };

  const speakSarahText = (text: string, emotion: EmotionState) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";

    if (emotion === "reassuring pace") {
      utterance.rate = 0.85;
      utterance.pitch = 0.95;
    } else if (emotion === "analytical elite") {
      utterance.rate = 1.05;
      utterance.pitch = 1.05;
    } else if (emotion === "empathetic pause") {
      utterance.rate = 0.80;
      utterance.pitch = 0.90;
    } else {
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
    }

    const voices = synthRef.current.getVoices();
    const targetLang = language === "bn" ? "bn" : "en";
    const preferredVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      const matchesLang = lang.includes(targetLang);
      const isFemale = name.includes("female") || name.includes("zira") || name.includes("samantha") || name.includes("susan") || name.includes("hazel") || name.includes("moira") || name.includes("tessa") || name.includes("karen") || name.includes("google") || name.includes("natural") || name.includes("microsoft");
      return matchesLang && isFemale;
    }) || voices.find(v => v.lang.toLowerCase().includes(targetLang));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      simulateVoiceActivity(true);
    };

    utterance.onend = () => {
      simulateVoiceActivity(false);
      setSarahSpeakingText("");
      if (callState === "connected" && !isTextMode && !isMuted && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          // Ignore
        }
      }
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText("");
    handleUserUtterance(textToSend);
  };

  const getEmotionTheme = () => {
    switch (currentEmotion) {
      case "reassuring pace":
        return {
          glow: "rgba(16, 185, 129, 0.45)",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          title: language === "en" ? "Reassuring Council" : "নিশ্চিন্ত পরামর্শদাতা"
        };
      case "analytical elite":
        return {
          glow: "rgba(99, 102, 241, 0.45)",
          border: "border-indigo-500/40",
          text: "text-indigo-400",
          bg: "bg-indigo-500/10",
          title: language === "en" ? "Financial Advisory" : "আর্থিক বিশ্লেষণ"
        };
      case "empathetic pause":
        return {
          glow: "rgba(236, 72, 153, 0.45)",
          border: "border-pink-500/40",
          text: "text-pink-400",
          bg: "bg-pink-500/10",
          title: language === "en" ? "Thoughtful Solver" : "সহানুভূতিশীল সমাধান"
        };
      case "warm cordial":
      default:
        return {
          glow: "rgba(200, 161, 101, 0.45)",
          border: "border-[#C8A165]/40",
          text: "text-[#C8A165]",
          bg: "bg-[#C8A165]/10",
          title: language === "en" ? "VIP Sales Concierge" : "ভিআইপি কনসিয়ার্জ ডিরেক্টর"
        };
    }
  };

  const theme = getEmotionTheme();

  return (
    <div className="fixed bottom-6 right-6 z-45 font-sans pointer-events-auto">
      {/* 1. FLOATING LAUNCH BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="call-launcher"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={() => {
              setIsOpen(true);
              startCall();
            }}
            className="w-14 h-14 rounded-full bg-[#141615] border border-[#C8A165]/50 flex items-center justify-center cursor-pointer text-[#C8A165] shadow-2xl hover:text-white hover:border-white transition-all duration-300 animate-pulse-gold relative group"
            title={language === "en" ? "Call VIP Hotline" : "ভিআইপি হটলাইন কল করুন"}
          >
            <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A165] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C8A165]"></span>
            </span>
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-neutral-900/90 text-white border border-neutral-850 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {language === "en" ? "Sarah - AI Advisor" : "সারা - এআই অ্যাডভাইজার"}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. HOTLINE MODAL DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="call-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ "--glow-color": theme.glow } as React.CSSProperties}
            className={`w-80 sm:w-[350px] bg-[#141615]/95 backdrop-blur-xl border border-[#C8A165]/25 rounded-2xl p-4 shadow-2xl glass-panel-glow flex flex-col gap-3 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8A165]/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${callState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${callState === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  {callState === "connected" ? "SECURED ENCRYPTED CONNECTION" : "VIP SECURE LINE"}
                </span>
              </div>
              <button 
                onClick={() => {
                  cleanupSpeech();
                  endCall();
                  setIsOpen(false);
                }} 
                className="text-neutral-500 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center py-3 text-center z-10 border-b border-neutral-900">
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-neutral-900 border border-neutral-800 shadow-inner mb-3">
                <div className={`absolute inset-1 rounded-full border border-dashed ${theme.border} ${callState === 'connected' ? 'animate-[spin_20s_linear_infinite]' : ''}`} />
                <div className={`absolute inset-3 rounded-full ${theme.bg} blur-xs animate-pulse`} />
                <Sparkles className={`w-8 h-8 ${theme.text} z-10`} />
              </div>
              
              <h4 className="text-sm font-serif font-bold text-white tracking-wide leading-none">
                {language === "en" ? "Sarah" : "সারা"}
              </h4>
              <p className="text-[9px] font-mono uppercase tracking-widest text-[#C8A165] mt-1.5 leading-none">
                {theme.title}
              </p>

              <div className="mt-3 text-xs font-mono font-bold tracking-widest uppercase">
                {callState === "dialing" && (
                  <span className="text-amber-400 animate-pulse">DIALING...</span>
                )}
                {callState === "ringing" && (
                  <span className="text-amber-400 animate-pulse">RINGING SECURE SUITE...</span>
                )}
                {callState === "connected" && (
                  <span className="text-emerald-400">CONNECTED</span>
                )}
                {callState === "disconnected" && (
                  <span className="text-neutral-500">LINE DISCONNECTED</span>
                )}
              </div>
            </div>

            <div className="h-44 overflow-y-auto border border-neutral-900/60 bg-[#0c0d0d]/80 rounded-xl p-3 flex flex-col gap-2.5 z-10 scrollbar-thin">
              {messages.length === 0 && callState !== "disconnected" && (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 gap-1.5 p-4">
                  <AlertCircle className="w-4 h-4 text-neutral-600" />
                  <p className="text-[10px] font-mono leading-relaxed">
                    {language === "en" ? "Establishing satellite connection..." : "স্যাটেলাইট সংযোগ স্থাপন করা হচ্ছে..."}
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-tighter mb-0.5 leading-none">
                    {msg.sender === "user" ? (language === "en" ? "You" : "আপনি") : "Sarah"} • {msg.timestamp}
                  </span>
                  <div className={`px-2.5 py-1.5 rounded-xl text-[10.5px] leading-relaxed shadow-sm font-sans ${
                    msg.sender === "user" 
                      ? "bg-neutral-800 text-white rounded-tr-none" 
                      : "bg-[#181918] text-neutral-200 border border-[#C8A165]/10 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {sarahSpeakingText && (
                <div className="flex flex-col max-w-[85%] self-start items-start">
                  <span className="text-[8px] font-mono text-[#C8A165] uppercase tracking-wider animate-pulse mb-0.5 leading-none">
                    {language === "en" ? "SARAH IS RESPONDING..." : "সারা উত্তর দিচ্ছেন..."}
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {callState === "connected" && (
              <div className="flex items-center justify-center gap-1 py-1 z-10 h-8">
                {voiceLevels.map((lvl, i) => (
                  <span
                    key={i}
                    className="voice-wave-bar"
                    style={{
                      height: `${lvl}px`,
                      backgroundColor: currentEmotion === "warm cordial" ? "#C8A165" : 
                                       currentEmotion === "reassuring pace" ? "#10B981" :
                                       currentEmotion === "analytical elite" ? "#6366F1" : "#EC4899",
                      animationDelay: `${i * 0.1}s`,
                      transform: `scaleY(${lvl > 1 ? 1 : 0.3})`
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 z-10 border-t border-neutral-900 pt-3">
              {isTextMode && callState === "connected" && (
                <form onSubmit={handleTextSubmit} className="flex gap-1.5 w-full">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={language === "en" ? "Ask Sarah something..." : "সারাকে কিছু জিজ্ঞাসা করুন..."}
                    className="flex-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-[#C8A165] outline-none text-xs px-3 py-2 rounded-xl text-white transition-all font-sans"
                  />
                  <button 
                    type="submit"
                    className="bg-[#C8A165] hover:bg-[#b28b55] text-neutral-950 p-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <div className="flex items-center justify-between gap-4 px-2 mt-1">
                {callState === "connected" && (
                  <button
                    onClick={() => {
                      cleanupSpeech();
                      setIsTextMode(!isTextMode);
                    }}
                    className="text-[10px] font-mono tracking-widest text-neutral-400 hover:text-[#C8A165] cursor-pointer flex items-center gap-1.5 transition-colors uppercase"
                    title={isTextMode ? "Switch to Voice" : "Switch to Text"}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isTextMode ? "Voice" : "Text"}</span>
                  </button>
                )}

                {!isTextMode && callState === "connected" && (
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (!isMuted) {
                        cleanupSpeech();
                      } else {
                        if (recognitionRef.current) {
                          try { recognitionRef.current.start(); } catch(e){}
                        }
                      }
                    }}
                    className={`text-[10px] font-mono tracking-widest cursor-pointer flex items-center gap-1.5 transition-colors uppercase ${
                      isMuted ? "text-red-500 hover:text-red-400" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isMuted ? "Muted" : "Mute"}</span>
                  </button>
                )}

                {(callState === "connected" || callState === "dialing" || callState === "ringing") ? (
                  <button
                    onClick={endCall}
                    className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors shadow-md ml-auto"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">DISCONNECT</span>
                  </button>
                ) : (
                  <button
                    onClick={startCall}
                    disabled={callState === "disconnected"}
                    className="bg-[#C8A165] hover:bg-[#b28b55] text-neutral-950 rounded-xl px-5 py-2 flex items-center gap-2 cursor-pointer transition-colors shadow-md disabled:bg-neutral-800 disabled:text-neutral-500 ml-auto"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">REDIAL</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
