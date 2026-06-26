import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Send, Sparkles, X, ChevronDown, MessageSquare, AlertCircle
} from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";

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
  const [activeLanguage, setActiveLanguage] = useState<"en" | "bn">(language);

  useEffect(() => {
    setActiveLanguage(language);
  }, [language]);

  const [isOpen, setIsOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState>("warm cordial");
  const [sarahSpeakingText, setSarahSpeakingText] = useState("");
  
  // Audio & Live API references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Visual wave animation values
  const [voiceLevels, setVoiceLevels] = useState<number[]>([1, 1, 1, 1, 1, 1, 1, 1]);

  useEffect(() => {
    return () => {
      stopRingtone();
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sarahSpeakingText]);

  const cleanupAudio = () => {
    stopAllActiveSources();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e){}
      sessionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const stopAllActiveSources = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e){}
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  };

  // WEB AUDIO API - Dialing & Ringing Sound Generators
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

    playChime(0, 697, 1209);
    playChime(0.18, 770, 1336);
    playChime(0.36, 852, 1477);
  };

  const startRingtone = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const playRing = () => {
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
    setActiveLanguage("bn"); // ALWAYS start call in Bangla
    setCallState("dialing");
    setMessages([]);
    setSarahSpeakingText("");
    
    playDialingTone();

    // Fetch API Key from Backend
    let apiKey = "";
    try {
      const response = await fetch("/api/gemini-key");
      const data = await response.json();
      apiKey = data.apiKey;
    } catch (e) {
      console.error("Failed to fetch API key:", e);
    }

    if (!apiKey) {
      setTimeout(() => {
        setMessages([
          {
            sender: "sarah",
            text: "Welcome to Mollik Builders. The live audio connection requires a valid Gemini API Key. Please configure GEMINI_API_KEY in your environment, or continue via text mode.",
            emotion: "warm cordial",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setCallState("connected");
        setIsTextMode(true);
      }, 2000);
      return;
    }

    setTimeout(() => {
      setCallState("ringing");
      startRingtone();
      
      setTimeout(async () => {
        stopRingtone();
        try {
          await connectToGeminiLive(apiKey);
        } catch (err) {
          console.error("Failed to establish live connection:", err);
          endCall();
        }
      }, 2500);
    }, 1200);
  };

  const endCall = () => {
    stopRingtone();
    cleanupAudio();
    setCallState("disconnected");
    setVoiceLevels([1, 1, 1, 1, 1, 1, 1, 1]);
    setTimeout(() => setCallState("idle"), 1500);
  };

  const connectToGeminiLive = async (apiKey: string) => {
    const localAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioCtxRef.current = localAudioContext;
    nextPlayTimeRef.current = 0;

    // Initialize Analyser Nodes
    const inputAnalyser = localAudioContext.createAnalyser();
    inputAnalyser.fftSize = 64;
    inputAnalyserRef.current = inputAnalyser;

    const outputAnalyser = localAudioContext.createAnalyser();
    outputAnalyser.fftSize = 64;
    outputAnalyser.connect(localAudioContext.destination);
    outputAnalyserRef.current = outputAnalyser;

    // Get microphone stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const ai = new GoogleGenAI({ apiKey });

    // Build the system instruction
    const promptInstructions = 
      `You are Sarah (সারা), the charming, sweet-spoken, elegant, and warm senior VIP Sales and Investor Relations Director for Mollik Builders, Dhaka. ` +
      `You are on a live voice telephone call with a premium customer. ` +
      `You must talk dynamically in the language the customer chooses. If they speak Bengali, speak exclusively in highly attractive, polite, and persuasive Bengali (Bangla/বাংলা). If they speak English, speak in premium English. ` +
      `Sound exactly like a real human with deep emotional pacing, using natural voice fillers (like 'আসলে...', 'জি, একদম ঠিক!', 'দারুণ প্রশ্ন!', 'জানেন কি...', 'ইনশাল্লাহ...'). ` +
      `Keep your replies very sweet, respectful, concise and strictly under 60 words for delightful telephone auditory delivery. ` +
      `You MUST start your response with exactly ONE of these emotional state tags in brackets: \n` +
      `  - [warm cordial] (for greetings, general friendly answers in sweet tones)\n` +
      `  - [reassuring pace] (for structural integrity, earthquakes, BUET consultants, RAJUK legality/approvals)\n` +
      `  - [analytical elite] (for exact pricing in Lacs/Crores, downpayment (30%), 36-month interest-free installment)\n` +
      `  - [empathetic pause] (for negotiation, budget concerns, special client requests)\n` +
      `Always rely on real details of our premier Dhaka real estate portfolio: ` +
      `1. Madina Tower (Miyabari, South Khan, G+14, starting BDT 85 Lacs, 1450-3200 sqft, infinity pool with rooftop observatory, 7.5 earthquake resistant Grade-72 steel, RAJUK approved)\n` +
      `2. Bismillah Tower (South Khan, G+12, starting BDT 72 Lacs, 1200-2800 sqft, kids play area, rooftop cafe)\n` +
      `3. Apon Bhubon (South Khan, G+10, starting BDT 60 Lacs, green landscaping, osmosis filtration)\n` +
      `Guide the premium customer politely to book a physical visit with premium tea or coffee this Wednesday or Saturday afternoon.`;

    const sessionPromise = ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      callbacks: {
        onopen: () => {
          setCallState("connected");

          // Add a welcome greeting message
          setMessages([
            {
              sender: "sarah",
              text: "আসসালামু আলাইকুম স্যার, আমি সারা। মলিক বিল্ডার্সের পক্ষ থেকে স্বাগত। আমাদের দক্ষিণখানের অভিজাত প্রজেক্টগুলো সম্পর্কে আপনার কি তথ্য জানার আছে বলুন, স্যার?",
              emotion: "warm cordial",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          // Start streaming audio from microphone
          const source = localAudioContext.createMediaStreamSource(stream);
          const processor = localAudioContext.createScriptProcessor(4096, 1, 1);
          
          source.connect(inputAnalyser);
          source.connect(processor);
          processor.connect(localAudioContext.destination);

          processor.onaudioprocess = (e) => {
            if (isMutedRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Convert Float32 to Int16 PCM
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }
            
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
            sessionPromise.then(session => {
              session.sendRealtimeInput({
                media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              });
            });
          };

          // Continuous visual levels update
          const bufferLength = inputAnalyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateLevels = () => {
            if (!sessionRef.current) return;

            // Check output first (Sarah speaking), then fallback to input (user speaking)
            let activeAnalyser = null;
            
            // Simple heuristic to check if output is active
            if (outputAnalyserRef.current) {
              activeAnalyser = outputAnalyserRef.current;
            } else if (inputAnalyserRef.current && !isMutedRef.current) {
              activeAnalyser = inputAnalyserRef.current;
            }

            if (activeAnalyser) {
              activeAnalyser.getByteFrequencyData(dataArray);
              const newLevels = [];
              for (let i = 0; i < 8; i++) {
                const index = Math.floor((i / 8) * bufferLength);
                const value = dataArray[index];
                newLevels.push(Math.max(2, (value / 255) * 28 + 2));
              }
              setVoiceLevels(newLevels);
            } else {
              setVoiceLevels(Array.from({ length: 8 }, () => Math.random() * 2 + 1));
            }
            
            animationFrameRef.current = requestAnimationFrame(updateLevels);
          };
          animationFrameRef.current = requestAnimationFrame(updateLevels);
        },
        onmessage: async (message: any) => {
          // Handle server-side user interruption signal
          if (message.serverContent?.interrupted || message.interrupted) {
            stopAllActiveSources();
            setSarahSpeakingText("");
            return;
          }

          // Handle audio output chunks
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && localAudioContext) {
            const audioBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
            const int16Data = new Int16Array(audioBuffer);
            const float32Data = new Float32Array(int16Data.length);
            for (let i = 0; i < int16Data.length; i++) {
              float32Data[i] = int16Data[i] / 32768.0;
            }
            
            const buffer = localAudioContext.createBuffer(1, float32Data.length, 24000); // 24kHz Gemini output
            buffer.getChannelData(0).set(float32Data);
            
            const source = localAudioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAnalyserRef.current || localAudioContext.destination);
            
            activeSourcesRef.current.push(source);
            source.onended = () => {
              activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
            };

            // Playback queuing to avoid clicking gaps
            const now = localAudioContext.currentTime;
            if (nextPlayTimeRef.current < now) {
              nextPlayTimeRef.current = now;
            }
            source.start(nextPlayTimeRef.current);
            nextPlayTimeRef.current += buffer.duration;
          }

          // Handle text transcriptions
          const rawText = message.serverContent?.modelTurn?.parts[0]?.text;
          if (rawText) {
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
            setSarahSpeakingText(prev => prev + cleanText);

            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.sender === "sarah") {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...last,
                  text: last.text + cleanText,
                  emotion: parsedEmotion
                };
                return updated;
              } else {
                return [...prev, {
                  sender: "sarah",
                  text: cleanText,
                  emotion: parsedEmotion,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }];
              }
            });
          }
        },
        onclose: () => endCall(),
        onerror: (err) => {
          console.error("Live session WebSocket error:", err);
          endCall();
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }, // Premium native female voice
        },
        systemInstruction: promptInstructions,
      },
    });

    sessionRef.current = await sessionPromise;
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText("");
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Send to live connection session
    if (sessionRef.current) {
      sessionRef.current.send({
        clientContent: {
          turns: [{
            role: "user",
            parts: [{ text: textToSend }]
          }],
          turnComplete: true
        }
      });
    }
  };

  const getEmotionTheme = () => {
    switch (currentEmotion) {
      case "reassuring pace":
        return {
          glow: "rgba(16, 185, 129, 0.45)",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          title: activeLanguage === "en" ? "Reassuring Council" : "নিশ্চিন্ত পরামর্শদাতা"
        };
      case "analytical elite":
        return {
          glow: "rgba(99, 102, 241, 0.45)",
          border: "border-indigo-500/40",
          text: "text-indigo-400",
          bg: "bg-indigo-500/10",
          title: activeLanguage === "en" ? "Financial Advisory" : "আর্থিক বিশ্লেষণ"
        };
      case "empathetic pause":
        return {
          glow: "rgba(236, 72, 153, 0.45)",
          border: "border-pink-500/40",
          text: "text-pink-400",
          bg: "bg-pink-500/10",
          title: activeLanguage === "en" ? "Thoughtful Solver" : "সহানুভূতিশীল সমাধান"
        };
      case "warm cordial":
      default:
        return {
          glow: "rgba(200, 161, 101, 0.45)",
          border: "border--[#C8A165]/40",
          text: "text-[#C8A165]",
          bg: "bg-[#C8A165]/10",
          title: activeLanguage === "en" ? "VIP Sales Concierge" : "ভিআইপি কনসিয়ার্জ ডিরেক্টর"
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
            title={activeLanguage === "en" ? "Call VIP Hotline" : "ভিআইপি হটলাইন কল করুন"}
          >
            <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A165] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C8A165]"></span>
            </span>
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-neutral-900/90 text-white border border-neutral-850 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {activeLanguage === "en" ? "Sarah - AI Advisor" : "সারা - এআই অ্যাডভাইজার"}
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
                  {callState === "connected" ? "SECURED LINE" : "VIP LINE"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={activeLanguage}
                  onChange={(e) => setActiveLanguage(e.target.value as "en" | "bn")}
                  className="bg-neutral-950 border border-[#C8A165]/30 text-[#C8A165] text-[9px] font-mono rounded px-1 py-0.5 focus:outline-none focus:border-[#C8A165] cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="bn">বাংলা</option>
                </select>
                <button 
                  onClick={() => {
                    cleanupAudio();
                    endCall();
                    setIsOpen(false);
                  }} 
                  className="text-neutral-500 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center py-3 text-center z-10 border-b border-neutral-900">
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-neutral-900 border border-neutral-800 shadow-inner mb-3">
                <div className={`absolute inset-1 rounded-full border border-dashed ${theme.border} ${callState === 'connected' ? 'animate-[spin_20s_linear_infinite]' : ''}`} />
                <div className={`absolute inset-3 rounded-full ${theme.bg} blur-xs animate-pulse`} />
                <Sparkles className={`w-8 h-8 ${theme.text} z-10`} />
              </div>
              
              <h4 className="text-sm font-serif font-bold text-white tracking-wide leading-none">
                {activeLanguage === "en" ? "Sarah" : "সারা"}
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
                    {activeLanguage === "en" ? "Establishing satellite connection..." : "স্যাটেলাইট সংযোগ স্থাপন করা হচ্ছে..."}
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-tighter mb-0.5 leading-none">
                    {msg.sender === "user" ? (activeLanguage === "en" ? "You" : "আপনি") : "Sarah"} • {msg.timestamp}
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
                    {activeLanguage === "en" ? "SARAH IS RESPONDING..." : "সারা উত্তর দিচ্ছেন..."}
                  </span>
                  <div className="px-2.5 py-1.5 rounded-xl text-[10.5px] leading-relaxed shadow-sm font-sans bg-[#181918] text-neutral-200 border border-[#C8A165]/10 rounded-tl-none">
                    {sarahSpeakingText}
                  </div>
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
                    placeholder={activeLanguage === "en" ? "Ask Sarah something..." : "সারাকে কিছু জিজ্ঞাসা করুন..."}
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
                      stopAllActiveSources();
                      setSarahSpeakingText("");
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
