"use client";

import { motion } from "framer-motion";

const ACTORS = [
  { icon: "sports_soccer", label: "JUGADORES" },
  { icon: "manage_search", label: "SCOUTS" },
  { icon: "school", label: "ACADEMIAS" },
  { icon: "shield", label: "CLUBES" },
  { icon: "handshake", label: "ALIADOS ESTRATÉGICOS" },
];

const NEEDS = [
  "Visibilidad",
  "Evaluación",
  "Oportunidades",
];

export default function Ecosystem() {
  return (
    <section
      id="ecosistema"
      className="py-32 bg-background relative overflow-hidden"
    >
      {/* Radar grid background */}
      <div className="absolute inset-0 radar-grid opacity-15 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neon opacity-[0.04] blur-[220px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-neon opacity-[0.03] blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            Construyendo el ecosistema
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            CONSTRUYENDO EL FUTURO
            <br />
            <span className="text-neon">DEL TALENTO DEPORTIVO</span>
          </h2>
        </motion.div>

        {/* Needs kinetic list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <p className="text-on-background/70 text-lg md:text-xl leading-relaxed mb-8">
            El talento necesita más que entrenamiento.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {NEEDS.map((need, i) => (
              <motion.div
                key={need}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                viewport={{ once: true }}
                className="border border-neon/30 bg-neon/[0.06] px-5 md:px-6 py-2.5 md:py-3"
              >
                <span className="font-headline font-black italic uppercase text-neon text-lg md:text-xl">
                  {need}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto space-y-5 mb-20 text-center"
        >
          <p className="text-on-background/50 text-base md:text-lg leading-relaxed">
            Por eso estamos construyendo un ecosistema donde jugadores, scouts,
            academias, clubes y aliados estratégicos puedan encontrarse en un
            mismo lugar.
          </p>
          <p className="text-on-background/70 text-base md:text-lg leading-relaxed">
            <span className="text-neon font-headline italic">INVICTO</span> nace
            con una visión clara: conectar el talento con las oportunidades y
            ayudar a que más deportistas puedan mostrar su potencial dentro y
            fuera de la cancha.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span className="font-mono text-neon text-[11px] tracking-[0.3em] uppercase">
                Hoy — Primeros pasos
              </span>
            </div>
            <div className="hidden sm:block w-12 h-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-on-background/25" />
              <span className="font-mono text-on-background/40 text-[11px] tracking-[0.3em] uppercase">
                Mañana — Miles de jugadores
              </span>
            </div>
          </div>
        </motion.div>

        {/* Actors — kinetic chain */}
        <div className="mb-20">
          {/* Desktop: horizontal chain */}
          <div className="hidden md:flex items-stretch justify-between gap-3 lg:gap-4 relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent z-0" />

            {ACTORS.map((actor, i) => (
              <motion.div
                key={actor.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6 }}
                className="flex-1 flex flex-col items-center text-center group relative z-10"
              >
                <div className="w-16 h-16 rounded-full border-2 border-neon/40 bg-background flex items-center justify-center mb-4 group-hover:border-neon group-hover:shadow-[0_0_30px_rgba(170,255,0,0.35)] transition-all duration-300">
                  <span className="material-symbols-outlined text-neon text-2xl group-hover:scale-110 transition-transform duration-300">
                    {actor.icon}
                  </span>
                </div>
                <span className="font-headline font-black italic uppercase text-on-background/70 group-hover:text-neon transition-colors duration-300 text-sm lg:text-base leading-tight px-1">
                  {actor.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {ACTORS.map((actor, i) => (
              <motion.div
                key={actor.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center text-center bg-surface-container border border-white/8 p-5 ${
                  i === ACTORS.length - 1 && ACTORS.length % 2 === 1
                    ? "col-span-2"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full border border-neon/40 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-neon text-xl">
                    {actor.icon}
                  </span>
                </div>
                <span className="font-headline font-black italic uppercase text-on-background text-xs leading-tight">
                  {actor.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto text-center border-t border-b border-neon/20 py-12 md:py-16 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
            <span className="font-mono text-neon/60 text-[10px] tracking-[0.35em] uppercase">
              La visión
            </span>
          </div>
          <p
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)" }}
          >
            No estamos construyendo una aplicación.
            <br />
            <span className="text-neon text-glow">
              Estamos construyendo el ecosistema
            </span>
            <br />
            donde el talento encuentra oportunidades.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
