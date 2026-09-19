"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "jugadores" | "scouts";

/**
 * Las dos listas van ordenadas de más a menos decisivo, no por temas.
 *
 * La primera tarjeta de cada pestaña es la razón por la que alguien se queda:
 * al jugador le importa que alguien con criterio lo mire; al ojeador, poder
 * llegar a quien busca. Lo demás sostiene esa promesa.
 *
 * **Todo lo de aquí existe en la app.** Se cayeron cuatro tarjetas que no:
 * «scouts de más de 120 países», «métricas biométricas» (son la estatura y el
 * peso del registro), «rating objetivo» y «algoritmos sin sesgos humanos» —
 * quien evalúa es una persona, y esa es precisamente la parte buena—.
 */
const FEATURES: Record<Tab, { icon: string; title: string; desc: string }[]> = {
  jugadores: [
    { icon: "verified", title: "Te evalúa un ojeador verificado", desc: "22 atributos técnicos, físicos, tácticos y mentales, puntuados uno a uno por alguien que se identificó con sus documentos ante nosotros." },
    { icon: "radar", title: "El radar de tu posición", desc: "A un portero no se le mide el regate. Cada posición se evalúa con los atributos que le tocan y se dibuja en su propio gráfico." },
    { icon: "videocam", title: "Tus jugadas, no un video suelto", desc: "Clips y fotos ordenados en un perfil que un ojeador puede recorrer entero, con las estadísticas de cada partido al lado." },
    { icon: "trending_up", title: "Tu trayectoria, club por club", desc: "Por dónde has pasado, cuántos partidos, goles y asistencias. Lo que hasta hoy cabía en una frase suelta." },
    { icon: "visibility", title: "Sabes que te están mirando", desc: "Cuánta gente entró a tu perfil y cuándo. Deja de ser una sensación y pasa a ser un número." },
    { icon: "shield", title: "Quien te escribe da la cara", desc: "Si eres menor de edad, solo puede escribirte una cuenta cuyos documentos hemos revisado. Y para proponerte una cita hay que estar verificado, tengas la edad que tengas." },
  ],
  scouts: [
    { icon: "filter_list", title: "Filtra hasta dar con el perfil", desc: "Posición, zona, pierna dominante, valoración y si está libre o con equipo. Y el feed te acerca a quien juega cerca de ti." },
    { icon: "notifications", title: "Te avisamos cuando aparece", desc: "Guarda la búsqueda y recibe un aviso el día que alguien empieza a encajar, aunque se registrara meses atrás." },
    { icon: "manage_search", title: "Tu control de captación", desc: "A quién observas, qué reportes llevas, qué partidos has visto y comparativas entre dos jugadores. Privado: nadie ve a quién estás siguiendo." },
    { icon: "download", title: "Informes exportables", desc: "Saca el informe de un jugador y compártelo con tu cuerpo técnico fuera de la app." },
    { icon: "event", title: "Propón una cita", desc: "Fecha, hora y lugar; el jugador acepta o no. Una propuesta viva por jugador, para que nadie reciba veinte." },
    { icon: "workspace_premium", title: "Tu trabajo queda a la vista", desc: "Cuántos jugadores has evaluado y cuántos partidos has visto, más tu experiencia y tus logros. El número se publica; a quién observas, no." },
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
