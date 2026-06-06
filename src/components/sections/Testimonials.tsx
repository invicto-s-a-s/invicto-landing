"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "A los 45 días de activar mi perfil, un scout del Real Betis me escribió directamente. Antes mandaba videos a la nada.",
    name: "Carlos M.",
    detail: "Delantero · 19 años · Medellín, Colombia",
    initial: "C",
    rating: 5,
  },
  {
    quote:
      "El sistema de ratings de INVICTO eliminó el sesgo subjetivo de mi proceso. La calidad de los perfiles es brutal.",
    name: "Ahmed S.",
    detail: "Scout FIFA Certificado · Dubai, EAU",
    initial: "A",
    rating: 5,
  },
  {
    quote:
      "Subí mi rating de 71 a 89 en 4 meses. Ese historial de progreso fue lo que convenció al club para firmarme.",
    name: "Lucas F.",
    detail: "Mediocampista · 22 años · Buenos Aires, Argentina",
    initial: "L",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon opacity-[0.03] blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-20"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            Prueba social
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            LO QUE DICEN
            <br />
            <span className="text-neon">LOS QUE YA DESPEGARON</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, borderColor: "rgba(170,255,0,0.3)" }}
              className="bg-surface-container border border-white/8 p-8 flex flex-col gap-6 group cursor-default transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-neon text-base">★</span>
                ))}
              </div>

              {/* Quote icon */}
              <span
                className="font-headline font-black italic text-neon/20 text-6xl leading-none select-none"
                aria-hidden
              >
                "
              </span>

              {/* Quote */}
              <p className="text-on-background/75 text-lg leading-relaxed -mt-4 flex-1">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/8">
                <div className="w-11 h-11 rounded-full bg-neon flex items-center justify-center shrink-0">
                  <span className="font-headline font-black italic text-background text-lg">
                    {t.initial}
                  </span>
                </div>
                <div>
                  <div className="font-headline font-black italic text-on-background text-base">
                    {t.name}
                  </div>
                  <div className="font-mono text-on-background/35 text-[10px] tracking-wide">
                    {t.detail}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
