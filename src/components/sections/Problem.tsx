"use client";

import { motion } from "framer-motion";

const BEFORE = [
  "Mandas videos que nadie ve",
  "Sin métricas objetivas de tu nivel",
  "Dependes de contactos o de la suerte",
  "Tu talento es invisible para el mundo",
];

const AFTER = [
  "Tu perfil llega a miles de scouts globales",
  "Ratings verificados e imposibles de manipular",
  "Oportunidades que encuentran tu talento",
  "Visible para cualquier club del planeta",
];

export default function Problem() {
  return (
    <section className="py-32 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            El problema real
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            EL TALENTO EXISTE.
            <br />
            <span className="text-neon">LA VISIBILIDAD, NO.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="bg-surface-container border border-white/8 p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600/50" />
            <div className="font-mono text-red-500/70 text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2.5">
              <span className="w-2 h-2 bg-red-500/60 rounded-full" />
              Sin INVICTO
            </div>
            <div className="space-y-5">
              {BEFORE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <span className="text-red-500/60 text-xl mt-0.5 shrink-0 font-bold">✗</span>
                  <p className="text-on-background/40 text-lg leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-700/5 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            viewport={{ once: true, margin: "-80px" }}
            className="border border-neon/20 p-8 lg:p-10 relative overflow-hidden"
            style={{ background: "rgba(170, 255, 0, 0.03)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-neon" />
            <div className="font-mono text-neon text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-2.5">
              <span className="w-2 h-2 bg-neon rounded-full animate-pulse" />
              Con INVICTO
            </div>
            <div className="space-y-5">
              {AFTER.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <span className="text-neon text-xl mt-0.5 shrink-0 font-bold">✓</span>
                  <p className="text-on-background text-lg leading-snug">{item}</p>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-neon/5 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
