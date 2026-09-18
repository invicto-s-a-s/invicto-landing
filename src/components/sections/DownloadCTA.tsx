"use client";

import { motion } from "framer-motion";

const MOCKUP_URL =
  "/celular-app-invicto-home.jpg"; // Placeholder for the app mockup image

interface DownloadCTAProps {
  onCTAClick: () => void;
}

export default function DownloadCTA({ onCTAClick }: DownloadCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden bg-surface-container-low">
      {/* Background decorative elements */}
      <div className="absolute inset-0 radar-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Phone image */}
          <motion.div
            className="w-full lg:w-[40%] flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="relative">
              <div className="absolute inset-[-20%] bg-neon opacity-[0.12] blur-[100px] rounded-full pointer-events-none" />
              <motion.img
                src={MOCKUP_URL}
                alt="INVICTO App"
                className="relative z-10 w-full max-w-[260px] md:max-w-[300px] rounded-[3rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Right: Text + CTAs */}
          <motion.div
            className="w-full lg:w-[60%]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.15 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-6 block">
              Acceso anticipado · Beta
            </span>

            <h2
              className="font-headline font-black italic uppercase text-on-background leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              TU CAMINO EMPIEZA
              <br />
              <span className="text-neon text-glow">DESDE HOY</span>
            </h2>

            <p className="text-on-background/50 text-lg leading-relaxed mb-12 max-w-lg">
              Sé parte de los primeros jugadores que están construyendo su
              perfil en INVICTO. Estamos apenas empezando, y queremos que hagas
              parte del recorrido.
            </p>

            {/* Access request CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <motion.button
                onClick={onCTAClick}
                whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(170,255,0,0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="relative bg-neon text-background font-headline font-black italic text-lg px-10 py-5 skew-card overflow-hidden group"
              >
                <span className="skew-content flex items-center gap-3 relative z-10">
                  SOLICITAR ACCESO
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.button>

              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                <span className="font-mono text-on-background/40 text-[10px] tracking-[0.25em] uppercase">
                  Cupos limitados
                </span>
              </div>
            </div>

            <div className="mt-10 font-mono text-on-background/25 text-[10px] tracking-[0.25em] uppercase">
              Próximamente en iOS y Android · Gratis para empezar
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
