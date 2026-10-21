"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * El video de presentación, dentro del recuadro que dibujó el diseñador.
 *
 * Va **justo debajo del hero**: es lo primero que aparece al bajar, que fue la
 * decisión de Alexander y Daniel. Por eso la sección no compite con nada — un
 * título corto y el marco, sin columnas ni tarjetas alrededor.
 *
 * **No arranca solo.** Son 105 segundos con voz: un autoplay silenciado no
 * contaría nada y gastaría los datos de quien entra desde el móvil. Se ve el
 * primer fotograma y un botón grande; al pulsarlo aparecen los controles
 * nativos, que es lo que la gente ya sabe usar.
 */
export default function VideoShowcase() {
  const video = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  const reproducir = () => {
    video.current?.play();
    setReproduciendo(true);
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            El video
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            ESTO ES <span className="text-neon">INVICTO</span>
          </h2>
        </motion.div>

        {/* El marco del diseño: borde lima con resplandor y doble radio, el de
            fuera y el del recorte del video. */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative rounded-[28px] md:rounded-[36px] border border-neon/55 bg-black/60 p-2 md:p-3 shadow-[0_0_70px_rgba(170,255,0,0.16)]"
        >
          <div className="relative overflow-hidden rounded-[22px] md:rounded-[28px] aspect-video bg-black">
            <video
              ref={video}
              className="w-full h-full object-cover"
              poster="/video/invicto-poster.jpg"
              controls={reproduciendo}
              controlsList="nodownload"
              playsInline
              preload="metadata"
              onEnded={() => setReproduciendo(false)}
            >
              <source src="/video/invicto.mp4" type="video/mp4" />
              Tu navegador no puede reproducir este video.
            </video>

            {!reproduciendo && (
              <button
                type="button"
                onClick={reproducir}
                aria-label="Reproducir el video de INVICTO"
                className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors duration-200 hover:bg-black/20 cursor-pointer group"
              >
                <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-neon shadow-[0_0_40px_rgba(170,255,0,0.45)] transition-transform duration-200 group-hover:scale-105">
                  {/* Triángulo desplazado a la derecha: centrado de verdad se
                      ve descentrado, porque el peso visual está a la izquierda. */}
                  <svg
                    width="26"
                    height="30"
                    viewBox="0 0 26 30"
                    aria-hidden="true"
                    className="ml-1"
                  >
                    <path d="M0 0 L26 15 L0 30 Z" fill="#0D0D0D" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
