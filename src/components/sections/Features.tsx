"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "jugadores" | "scouts";

const FEATURES: Record<Tab, { icon: string; title: string; desc: string }[]> = {
  jugadores: [
    { icon: "verified", title: "Perfil profesional verificado", desc: "Un perfil auténtico que muestra tu talento real sin filtros ni sesgos." },
    { icon: "videocam", title: "Videos de tus mejores jugadas", desc: "Sube y organiza tus clips más impactantes para que los scouts te vean en acción." },
    { icon: "star", title: "Sistema de rating objetivo", desc: "Un score calculado sobre datos reales que habla por ti mejor que cualquier recomendación." },
    { icon: "trending_up", title: "Historial de evolución", desc: "Registra tu progreso y muestra a los clubes tu trayectoria de mejora constante." },
    { icon: "public", title: "Visibilidad global", desc: "Tu perfil accesible para scouts de más de 120 países las 24 horas del día." },
    { icon: "fitness_center", title: "Análisis de rendimiento", desc: "Métricas biométricas y físicas integradas para un perfil deportivo completo." },
  ],
  scouts: [
    { icon: "manage_search", title: "50K+ talentos verificados", desc: "La mayor base de datos de jugadores jóvenes con perfiles verificados y actualizados." },
    { icon: "filter_list", title: "Filtros avanzados", desc: "Busca por posición, edad, país, rating, historial y mucho más con precisión quirúrgica." },
    { icon: "verified_user", title: "Ratings imparciales", desc: "Scores generados por algoritmos objetivos, sin sesgos humanos ni manipulación posible." },
    { icon: "chat", title: "Contacto directo y seguro", desc: "Comunícate con jugadores directamente en la plataforma con privacidad garantizada." },
    { icon: "download", title: "Informes exportables", desc: "Genera reportes detallados de cada jugador para compartir con tu equipo técnico." },
    { icon: "notifications", title: "Alertas de nuevos talentos", desc: "Recibe notificaciones cuando aparece un jugador que cumple tus criterios exactos." },
  ],
};

export default function Features() {
  const [active, setActive] = useState<Tab>("jugadores");

  return (
    <section id="caracteristicas" className="py-32 bg-surface-container-low relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <span className="font-mono text-neon text-[10px] tracking-[0.35em] uppercase mb-4 block">
            Herramientas de élite
          </span>
          <h2
            className="font-headline font-black italic uppercase text-on-background leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            DISEÑADO PARA
            <br />
            <span className="text-neon">GANAR EN EL CAMPO</span>
          </h2>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex gap-0 mb-14 border border-white/10 p-1 w-fit"
        >
          {(["jugadores", "scouts"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="relative px-8 py-3 font-headline font-black italic uppercase text-sm transition-colors duration-300 z-10"
            >
              {active === tab && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-neon"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  active === tab ? "text-background" : "text-on-background/40"
                }`}
              >
                {tab === "jugadores" ? "JUGADORES" : "SCOUTS"}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Features grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES[active].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -5, borderColor: "rgba(170,255,0,0.3)" }}
                className="bg-surface-container border border-white/8 p-7 group cursor-default transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-neon text-3xl mb-5 block group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </span>
                <h4 className="font-headline font-black italic uppercase text-on-background text-lg mb-3 leading-tight">
                  {feat.title}
                </h4>
                <p className="text-on-background/45 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
