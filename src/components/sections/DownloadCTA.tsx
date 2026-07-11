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
              Disponible ahora
            </span>

            <h2
              className="font-headline font-black italic uppercase text-on-background leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              TU PRÓXIMO CONTRATO
              <br />
              <span className="text-neon text-glow">EMPIEZA AQUÍ</span>
            </h2>

            <p className="text-on-background/50 text-lg leading-relaxed mb-12 max-w-lg">
              Únete a los 50,000+ jugadores que ya tienen su perfil en INVICTO y a
              los scouts que los descubren cada día.
            </p>

            {/* Store buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={onCTAClick}
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(170,255,0,0.35)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-5 bg-on-background text-background px-7 py-4 rounded-2xl hover:bg-white transition-colors duration-200"
              >
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-50 uppercase font-mono tracking-widest">App Store</div>
                  <div className="text-xl font-headline font-black italic">iOS</div>
                </div>
              </motion.button>

              <motion.button
                onClick={onCTAClick}
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(170,255,0,0.35)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-5 bg-on-background text-background px-7 py-4 rounded-2xl hover:bg-white transition-colors duration-200"
              >
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm11.207 10.065l2.249-2.234L3.513.133a1.499 1.499 0 0 0-.766-.207 1.49 1.49 0 0 0-.637.144l10.434 10.919zm0 2.474L2.11 23.477c.19.083.397.129.617.129.27 0 .53-.07.757-.205l10.991-6.22-3.031-3.018z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-50 uppercase font-mono tracking-widest">Google Play</div>
                  <div className="text-xl font-headline font-black italic">ANDROID</div>
                </div>
              </motion.button>
            </div>

            <div className="mt-10 font-mono text-on-background/25 text-[10px] tracking-[0.25em] uppercase">
              GRATIS · Sin tarjeta · Sin compromisos
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
