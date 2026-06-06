"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MOCKUP_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrrVJotqSjAiM_IGTD4Rxt7n9RApZdvlv-BfoXAVSZlo3d-QPxMXOq6hNPPTW0s-jAMJdYtqyHMj_CieSWMN5YTOwUOKw7wye2zwa2JoJdTZq-z6kDkF1eGFDY10J4WqHEAEu9hwIbKgABrfAHUXMaitNCe-bAYWCx5RO4nRrvpuqn8ZghfResvVur3yCSiLI5klJI83unG2sMpvBMp-KrgT0mru0sTk4tH9swE4js4ZILLrNswCZ6WmWRfdXIcQi3L7Y8MmM68hr";

const LINES = [
  { text: "AQUÍ NO SOLO", neon: false },
  { text: "TE VEN...", neon: false },
  { text: "AQUÍ TE PUEDEN", neon: false },
  { text: "FICHAR", neon: true },
];

const STATS = [
  { value: "50K+", label: "Jugadores" },
  { value: "2K+", label: "Scouts activos" },
  { value: "120+", label: "Países" },
];

interface HeroProps {
  onCTAClick: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -55]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20"
    >
      {/* Radar grid background */}
      <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

      {/* Neon ambient glows */}
      <div className="absolute -bottom-40 -left-40 w-[750px] h-[750px] rounded-full bg-neon opacity-[0.05] blur-[180px] pointer-events-none" />
      <div className="absolute top-[10%] -right-20 w-[500px] h-[500px] rounded-full bg-neon opacity-[0.03] blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-32 lg:py-0 min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-16 w-full">

          {/* Left: Text */}
          <motion.div className="w-full lg:w-[57%]" style={{ y: contentY }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-10 border border-neon/30 bg-neon/10 px-5 py-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
              <span className="font-mono text-neon text-[10px] tracking-[0.3em] uppercase">
                Social Scouting Platform
              </span>
            </motion.div>

            {/* Headline — line-by-line reveal */}
            <div className="mb-8">
              {LINES.map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1 + i * 0.13,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  >
                    <span
                      className={`block font-headline font-black italic uppercase leading-[0.88] tracking-tighter ${
                        line.neon ? "text-neon text-glow" : "text-on-background"
                      }`}
                      style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)" }}
                    >
                      {line.text}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.72 }}
              className="text-on-background/50 text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
            >
              Una plataforma donde el talento se muestra, se mide y se convierte
              en oportunidades reales.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.88 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <motion.button
                onClick={onCTAClick}
                whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(170,255,0,0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="relative bg-neon text-background font-headline font-black italic text-lg px-10 py-5 skew-card overflow-hidden group"
              >
                <span className="skew-content flex items-center gap-3 relative z-10">
                  DESCARGAR AHORA
                  <span className="material-symbols-outlined text-xl">download</span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.button>

              <motion.a
                href="#como-funciona"
                whileHover={{ scale: 1.02 }}
                className="border border-white/15 text-on-background font-headline font-black italic text-lg px-10 py-5 skew-card hover:border-neon/40 hover:text-neon transition-all duration-300 cursor-pointer"
              >
                <span className="skew-content">CÓMO FUNCIONA</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex gap-8 pt-8 border-t border-white/8"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-headline font-black italic text-2xl md:text-3xl text-neon">
                    {stat.value}
                  </div>
                  <div className="font-mono text-on-background/35 text-[10px] tracking-[0.22em] uppercase mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Phone + floating cards */}
          <motion.div
            className="w-full lg:w-[43%] flex justify-center lg:justify-end"
            style={{ y: phoneY }}
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.05, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="relative">
              {/* Phone ambient glow */}
              <div className="absolute inset-[-25%] bg-neon rounded-full opacity-[0.13] blur-[120px] pointer-events-none" />

              {/* Phone */}
              <motion.img
                src={MOCKUP_URL}
                alt="INVICTO App"
                className="relative z-10 w-full max-w-[260px] md:max-w-[300px] rounded-[3rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.85)]"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Floating: Rating */}
              <motion.div
                className="absolute -left-14 top-16 bg-surface-container border border-neon/25 p-4 rounded-2xl shadow-2xl z-20"
                initial={{ opacity: 0, x: -20, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="font-mono text-on-background/35 text-[9px] uppercase tracking-widest mb-1">
                  Rating global
                </div>
                <div className="font-headline font-black italic text-3xl text-neon leading-none">94</div>
                <div className="flex gap-0.5 mt-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-neon text-sm">★</span>
                  ))}
                </div>
              </motion.div>

              {/* Floating: Scout contact */}
              <motion.div
                className="absolute -right-14 bottom-28 bg-surface-container border border-white/8 p-4 rounded-2xl shadow-2xl z-20 w-[155px]"
                initial={{ opacity: 0, x: 20, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="font-mono text-on-background/35 text-[9px] uppercase tracking-widest mb-1">
                  Scout contactó
                </div>
                <div className="font-headline font-black italic text-sm text-on-background leading-tight">
                  FC Barcelona B
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                  <span className="text-neon text-[10px] font-mono">Hace 3h</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 1 }}
      >
        <span className="font-mono text-on-background/25 text-[9px] tracking-[0.35em] uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-neon to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
