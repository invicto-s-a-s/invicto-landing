"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function AccessRequestModal({
  isOpen,
  onClose,
}: AccessRequestModalProps) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleClose = () => {
    setEmail("");
    setReason("");
    setStatus("idle");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const disabled = status === "submitting" || !email.trim();

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
            onClick={handleClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ y: 60, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 60, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
            className="relative z-10 w-full max-w-xl bg-surface-container border border-neon/20 p-8 md:p-12 shadow-[0_0_120px_rgba(170,255,0,0.08)] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Neon top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-neon" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-on-background/30 hover:text-neon transition-colors duration-200"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-neon flex items-center justify-center">
                  <span className="material-symbols-outlined text-neon text-4xl">
                    check
                  </span>
                </div>
                <h3 className="font-headline font-black italic uppercase text-neon text-2xl md:text-3xl mb-3">
                  SOLICITUD RECIBIDA
                </h3>
                <p className="text-on-background/60 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                  Gracias por querer hacer parte de INVICTO. Te contactaremos
                  pronto para darte acceso anticipado a la app.
                </p>
                <button
                  onClick={handleClose}
                  className="font-mono text-on-background/40 hover:text-neon text-[10px] tracking-[0.3em] uppercase transition-colors duration-200"
                >
                  Cerrar
                </button>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8">
                  <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-3 block">
                    Estamos en fase Beta
                  </span>
                  <h3 className="font-headline font-black italic uppercase text-neon text-3xl md:text-4xl mb-2 leading-tight">
                    SOLICITAR ACCESO
                  </h3>
                  <div className="h-0.5 w-16 bg-neon" />
                </div>

                <p className="text-on-background/50 text-base mb-8 leading-relaxed">
                  INVICTO está en pruebas. Déjanos tus datos y te contactaremos
                  para darte acceso anticipado a la app.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="access-email"
                      className="block font-mono text-on-background/40 text-[10px] tracking-[0.3em] uppercase mb-2.5"
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="access-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full bg-background border border-white/10 focus:border-neon focus:outline-none px-4 py-3.5 text-on-background placeholder:text-on-background/25 font-body transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="access-reason"
                      className="block font-mono text-on-background/40 text-[10px] tracking-[0.3em] uppercase mb-2.5"
                    >
                      ¿Por qué quieres acceso anticipado?
                    </label>
                    <textarea
                      id="access-reason"
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Cuéntanos brevemente: ¿eres jugador, scout, academia, club? ¿Qué esperas de INVICTO?"
                      className="w-full bg-background border border-white/10 focus:border-neon focus:outline-none px-4 py-3.5 text-on-background placeholder:text-on-background/25 font-body transition-colors duration-200 resize-none"
                    />
                    <p className="mt-2 font-mono text-on-background/25 text-[10px] tracking-wider">
                      Opcional · Nos ayuda a priorizar tu invitación.
                    </p>
                  </div>

                  {status === "error" && (
                    <p className="font-mono text-red-400/80 text-[11px] tracking-wider">
                      Ocurrió un error al enviar. Intenta nuevamente.
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={disabled}
                    whileHover={disabled ? {} : { scale: 1.02 }}
                    whileTap={disabled ? {} : { scale: 0.98 }}
                    className="w-full bg-neon text-background font-headline font-black italic text-lg px-8 py-4 skew-card disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200"
                  >
                    <span className="skew-content flex items-center justify-center gap-3">
                      {status === "submitting" ? (
                        <>
                          <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                          ENVIANDO...
                        </>
                      ) : (
                        <>
                          ENVIAR SOLICITUD
                          <span className="material-symbols-outlined text-xl">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="font-mono text-[9px] tracking-[0.25em] text-on-background/25 uppercase">
                    Beta privado · Cupos limitados · No Excuses
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
