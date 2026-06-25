import { motion } from "motion/react";

interface AnimatedHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
}

export default function AnimatedHeading({
  title,
  subtitle,
  align = "center",
  className = "",
  subtitleClassName = "",
  titleClassName = "",
}: AnimatedHeadingProps) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const lineVariants: any = {
    hidden: { width: "0%" },
    visible: {
      width: "60px",
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  const words = (title || "").split(" ");
  const alignmentClass = 
    align === "left" 
      ? "text-left items-start" 
      : align === "right" 
        ? "text-right items-end" 
        : "text-center items-center mx-auto";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className={`flex flex-col ${alignmentClass} ${className}`}
    >
      {subtitle && (
        <motion.span
          variants={wordVariants}
          className={`text-[#C8A165] text-[10px] font-bold uppercase tracking-[0.25em] mb-2.5 block ${subtitleClassName}`}
        >
          {subtitle}
        </motion.span>
      )}

      <h2 className={`text-3xl md:text-4xl font-serif font-black tracking-tight leading-tight ${titleClassName || "text-neutral-850"}`}>
        {words.map((word, idx) => (
          <motion.span
            key={`heading-word-${idx}`}
            variants={wordVariants}
            className="inline-block mr-[0.25em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      <motion.div
        variants={lineVariants}
        className="h-[3px] bg-[#C8A165] mt-4 rounded-full"
      />
    </motion.div>
  );
}
