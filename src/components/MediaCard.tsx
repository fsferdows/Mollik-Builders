import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface MediaArticle {
  image: string;
  outlet: string;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
}

interface MediaCardProps {
  article: MediaArticle;
  language: "en" | "bn";
  key?: any;
}

export default function MediaCard({ article, language }: MediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tracking relative mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end cinematic physical feel
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  
  // Parallax translation for the image layer inside
  const imageTranslateX = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  const imageTranslateY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), springConfig);

  // Parallax translation for the text content layer
  const textTranslateX = useSpring(useTransform(x, [-0.5, 0.5], [4, -4]), springConfig);
  const textTranslateY = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate normalized coordinates (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="inline-block w-full bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm md:shadow-md/5 hover:border-[#C8A165]/30 transition-shadow duration-500 ease-out flex flex-col md:flex-row gap-5 items-stretch overflow-hidden group select-none relative"
      animate={{
        y: isHovered ? -4 : 0,
        boxShadow: isHovered 
          ? "0 20px 40px -15px rgba(200, 161, 101, 0.12), 0 15px 25px -10px rgba(0, 0, 0, 0.04)" 
          : "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
      }}
    >
      {/* Glare effect overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200,161,101,0.06) 0%, transparent 60%)"
        }}
        ref={(el) => {
          if (el && cardRef.current) {
            const updateGlow = (e: MouseEvent) => {
              const rect = cardRef.current?.getBoundingClientRect();
              if (rect) {
                const xPct = ((e.clientX - rect.left) / rect.width) * 100;
                const yPct = ((e.clientY - rect.top) / rect.height) * 100;
                el.style.setProperty("--mouse-x", `${xPct}%`);
                el.style.setProperty("--mouse-y", `${yPct}%`);
              }
            };
            cardRef.current.addEventListener("mousemove", updateGlow);
          }
        }}
      />

      {/* Parallax Image container */}
      <div className="w-full md:w-2/5 aspect-[16/10] md:aspect-auto min-h-[140px] md:min-h-full bg-neutral-50 rounded-xl overflow-hidden relative shrink-0">
        <motion.div
          style={{
            x: imageTranslateX,
            y: imageTranslateY,
            scale: isHovered ? 1.08 : 1.0,
          }}
          transition={{ duration: 0.4 }}
          className="w-full h-full absolute inset-0"
        >
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </motion.div>
        {/* Subtle vignette on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply pointer-events-none" />
      </div>

      {/* Description space-y block */}
      <motion.div
        style={{
          x: textTranslateX,
          y: textTranslateY,
        }}
        className="flex-1 flex flex-col justify-center space-y-3 relative z-10"
      >
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase font-mono text-[#C8A165] block bg-[#C8A165]/5 border border-[#C8A165]/10 px-2 py-0.5 rounded-full w-max">
            {article.outlet}
          </span>
          <h4 className="font-serif font-bold text-neutral-850 hover:text-[#1B4D3E] transition-colors leading-snug text-sm sm:text-base pt-1">
            {language === "en" ? article.title : article.titleBn}
          </h4>
        </div>
        
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          {language === "en" ? article.summary : article.summaryBn}
        </p>

        {/* Tactile reading feedback tag */}
        <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-[#1B4D3E] group-hover:text-[#C8A165] transition-colors">
          <span>{language === "en" ? "Read Press Release" : "প্রেস বিজ্ঞপ্তি পড়ুন"}</span>
          <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
