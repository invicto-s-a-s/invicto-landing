"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ y: 60, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 60, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
            className="relative z-10 w-full max-w-xl bg-surface-container border border-neon/20 p-8 md:p-12 shadow-[0_0_120px_rgba(170,255,0,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Neon top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-neon" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-on-background/30 hover:text-neon transition-colors duration-200"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {/* Header */}
            <div className="mb-10">
              <h3 className="font-headline font-black italic uppercase text-neon text-3xl md:text-4xl mb-2">
                DESCARGAR APP
              </h3>
              <div className="h-0.5 w-16 bg-neon" />
            </div>

            <p className="text-on-background/50 text-base mb-10 leading-relaxed">
              Selecciona tu plataforma y comienza tu camino al profesionalismo con INVICTO.
            </p>

            {/* Store buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.03, borderColor: "rgba(170,255,0,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-5 bg-background border-2 border-white/8 p-5 rounded-2xl group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 transition-colors duration-200 shrink-0">
                  <svg
                    className="w-8 h-8 text-on-background group-hover:text-neon transition-colors duration-200"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-on-background/40 uppercase tracking-widest">
                    App Store
                  </div>
                  <div className="font-headline font-black italic text-on-background text-xl">iOS</div>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.03, borderColor: "rgba(170,255,0,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-5 bg-background border-2 border-white/8 p-5 rounded-2xl group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 transition-colors duration-200 shrink-0">
                  <svg
                    className="w-8 h-8 text-on-background group-hover:text-neon transition-colors duration-200"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm11.207 10.065l2.249-2.234L3.513.133a1.499 1.499 0 0 0-.766-.207 1.49 1.49 0 0 0-.637.144l10.434 10.919zm0 2.474L2.11 23.477c.19.083.397.129.617.129.27 0 .53-.07.757-.205l10.991-6.22-3.031-3.018z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-on-background/40 uppercase tracking-widest">
                    Google Play
                  </div>
                  <div className="font-headline font-black italic text-on-background text-xl">ANDROID</div>
                </div>
              </motion.a>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="font-mono text-[9px] tracking-[0.25em] text-on-background/25 uppercase">
                V 2.4 · High Performance Build · No Excuses
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
