"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const CATEGORIES = [
  { label: "Velocidad", value: 97 },
  { label: "Técnica", value: 91 },
  { label: "Resistencia", value: 95 },
  { label: "Regate", value: 88 },
  { label: "Visión", value: 93 },
  { label: "Posición", value: 96 },
];

const PILLARS = [
  { icon: "verified", title: "100% Objetivo", desc: "Basado en datos reales, no en opiniones subjetivas" },
  { icon: "lock", title: "Imposible de manipular", desc: "Sistema verificado con múltiples fuentes de datos" },
  { icon: "trending_up", title: "Evolución visible", desc: "Historial completo de tu progreso en el tiempo" },
];

function CountUp({ target, duration = 1600 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let animId: number;
    let startTime: number | null = null;

    function step(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

function RatingBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-on-background/40 text-[10px] uppercase tracking-wider w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-neon"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.3, delay, ease: [0.33, 1, 0.68, 1] }}
          viewport={{ once: true }}
        />
      </div>
      <span className="font-headline font-black italic text-neon text-sm w-6 text-right shrink-0">
        {value}
      </span>
    </div>
  );
}

export default function Ratings() {
  return (
    <section id="ratings" className="py-32 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-neon opacity-[0.025] blur-[250px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* Left: Text */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
                Diferencial exclusivo
              </span>
              <h2
                className="font-headline font-black italic uppercase text-on-background leading-tight mb-8"
                style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
              >
                UN RATING QUE
                <br />
                <span className="text-neon">HABLA POR TI</span>
              </h2>
              <p className="text-on-background/50 text-lg leading-relaxed mb-12 max-w-md">
                Nuestro sistema analiza tu rendimiento en múltiples categorías y
                genera un rating objetivo, verificado e imposible de manipular.
              </p>

              <div className="space-y-7">
                {PILLARS.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <span className="material-symbols-outlined text-neon text-2xl mt-0.5 shrink-0">
                      {p.icon}
                    </span>
                    <div>
                      <h4 className="font-headline font-black italic text-on-background text-xl mb-1">
                        {p.title}
                      </h4>
                      <p className="text-on-background/40 text-sm">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Player card */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="relative w-full max-w-sm">
              {/* Glow */}
              <div className="absolute inset-[-15%] bg-neon opacity-[0.1] blur-[80px] rounded-3xl pointer-events-none" />

              {/* Card */}
              <div className="relative bg-surface-container border border-neon/20 rounded-3xl p-8 overflow-hidden">
                {/* Card decoration top-right */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]"
                  style={{
                    background: "radial-gradient(circle at top right, #AAFF00, transparent)",
                  }}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                  <div className="font-mono text-neon text-[9px] tracking-[0.35em] uppercase">
                    INVICTO CARD
                  </div>
                  <div className="font-mono text-on-background/25 text-[9px]">V 2.0</div>
                </div>

                {/* Player info */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-14 h-14 bg-surface-container-high border-2 border-neon/30 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-neon text-2xl">person</span>
                  </div>
                  <div>
                    <div className="font-headline font-black italic text-on-background text-xl">
                      CARLOS M.
                    </div>
                    <div className="font-mono text-on-background/35 text-[10px] tracking-wider">
                      Delantero · COL · 19 años
                    </div>
                  </div>
                </div>

                {/* Overall score */}
                <div className="bg-surface-container-lowest border border-neon/10 rounded-2xl p-6 mb-7 text-center">
                  <div className="font-mono text-on-background/30 text-[9px] uppercase tracking-widest mb-2">
                    Rating Global
                  </div>
                  <div
                    className="font-headline font-black italic text-neon text-glow leading-none"
                    style={{ fontSize: "5.5rem" }}
                  >
                    <CountUp target={94} />
                  </div>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring", damping: 10 }}
                        viewport={{ once: true }}
                        className="text-neon text-xl"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Category bars */}
                <div className="space-y-4">
                  {CATEGORIES.map((cat, i) => (
                    <RatingBar
                      key={cat.label}
                      label={cat.label}
                      value={cat.value}
                      delay={0.35 + i * 0.09}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
