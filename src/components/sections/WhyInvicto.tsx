"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: "visibility",
    title: "VISIBILIDAD",
    desc: "Ayudamos a que más jugadores puedan mostrar su talento.",
  },
  {
    icon: "insights",
    title: "EVALUACIÓN",
    desc: "Facilitamos herramientas para analizar y seguir el rendimiento deportivo.",
  },
  {
    icon: "hub",
    title: "OPORTUNIDADES",
    desc: "Conectamos el talento con quienes están buscando descubrirlo.",
  },
];

export default function WhyInvicto() {
  return (
    <section
      id="por-que-invicto"
      className="py-32 bg-surface-container-lowest relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-neon opacity-[0.04] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-neon opacity-[0.03] blur-[200px] rounded-full pointer-events-none" />

      {/* Decorative large word */}
      <div
        className="absolute left-0 top-10 font-headline font-black italic text-[22vw] md:text-[18vw] text-white/[0.015] leading-none select-none pointer-events-none"
        aria-hidden
      >
        WHY
      </div>

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
            ¿Por qué existe INVICTO?
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            DONDE EL TALENTO
            <br />
            <span className="text-neon">ENCUENTRA OPORTUNIDADES</span>
          </h2>
        </motion.div>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto space-y-6 mb-16 text-center"
        >
          <p className="text-on-background/70 text-lg md:text-xl leading-relaxed">
            En el fútbol existen miles de jugadores con talento, disciplina y
            potencial, pero no todos tienen acceso a las mismas oportunidades
            para ser observados y evaluados.
          </p>
          <p className="text-on-background/50 text-base md:text-lg leading-relaxed">
            Muchos deportistas dependen de contactos, ubicación geográfica o
            circunstancias externas para lograr visibilidad dentro del
            ecosistema deportivo.
          </p>
          <p className="text-on-background/70 text-lg md:text-xl leading-relaxed">
            <span className="text-neon font-headline italic">INVICTO</span> nace
            para reducir esa brecha.
          </p>
          <p className="text-on-background/50 text-base md:text-lg leading-relaxed">
            Estamos construyendo un ecosistema digital que conecta jugadores,
            scouts, academias y clubes mediante herramientas que facilitan la
            visibilidad, la evaluación y el acceso a oportunidades reales.
          </p>
        </motion.div>

        {/* Highlighted quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto mb-20 relative border-l-2 border-neon pl-6 md:pl-8 py-4"
        >
          <span
            className="absolute -top-4 -left-2 font-headline font-black italic text-neon/25 text-6xl leading-none select-none"
            aria-hidden
          >
            &ldquo;
          </span>
          <p className="font-headline font-black italic uppercase text-on-background text-xl md:text-2xl leading-snug">
            Que ningún jugador quede fuera del radar por falta de exposición,
            información o acceso a las herramientas adecuadas.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, borderColor: "rgba(170,255,0,0.35)" }}
              className="bg-surface-container border border-white/8 p-8 lg:p-10 relative overflow-hidden group cursor-default transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-neon/30 group-hover:bg-neon transition-colors duration-300" />

              <span className="material-symbols-outlined text-neon text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </span>

              <h3 className="font-headline font-black italic uppercase text-on-background text-2xl mb-4 leading-tight">
                {pillar.title}
              </h3>

              <p className="text-on-background/50 leading-relaxed">
                {pillar.desc}
              </p>

              <div className="mt-6 h-0.5 w-0 bg-neon group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-3xl mx-auto"
        >
          <p
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)" }}
          >
            INVICTO no es solo una aplicación.
            <br />
            <span className="text-neon text-glow">
              Estamos construyendo un ecosistema
            </span>{" "}
            para impulsar el desarrollo del talento deportivo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
