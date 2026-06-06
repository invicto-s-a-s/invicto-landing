"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    icon: "person_add",
    title: "CREA TU PERFIL",
    desc: "Registra tus datos, sube videos de tus mejores jugadas y conecta tus estadísticas reales al instante.",
  },
  {
    num: "02",
    icon: "analytics",
    title: "DEMUESTRA TU NIVEL",
    desc: "Nuestro sistema analiza tu rendimiento y genera un rating objetivo basado en datos verificados.",
  },
  {
    num: "03",
    icon: "hub",
    title: "CONECTA CON CLUBES",
    desc: "Scouts de todo el mundo descubren tu talento y te contactan directamente en la plataforma.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 bg-background relative overflow-hidden">
      {/* Large decorative number */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-headline font-black italic text-[30vw] text-white/[0.015] leading-none select-none pointer-events-none"
        aria-hidden
      >
        HOW
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-20"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            Simple, directo, efectivo
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            3 PASOS PARA
            <br />
            <span className="text-neon">CAMBIAR TU CARRERA</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-neon/30 via-neon/60 to-neon/30 z-0" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-80px" }}
              className="relative z-10"
            >
              {/* Step indicator circle */}
              <div className="w-8 h-8 rounded-full border-2 border-neon bg-background flex items-center justify-center mb-8 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-neon" />
              </div>

              <motion.div
                whileHover={{ y: -6, borderColor: "rgba(170,255,0,0.35)" }}
                transition={{ duration: 0.3 }}
                className="bg-surface-container border border-white/8 p-8 h-full group cursor-default"
              >
                {/* Big step number */}
                <div
                  className="font-headline font-black italic text-neon/20 leading-none mb-4 select-none"
                  style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}
                >
                  {step.num}
                </div>

                <span className="material-symbols-outlined text-neon text-3xl mb-5 block group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </span>

                <h3 className="font-headline font-black italic uppercase text-on-background text-2xl mb-4 leading-tight">
                  {step.title}
                </h3>

                <p className="text-on-background/50 leading-relaxed">{step.desc}</p>

                <div className="mt-6 h-0.5 w-0 bg-neon group-hover:w-full transition-all duration-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
