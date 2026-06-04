"use client";

import { useState, useEffect } from "react";

const LOGO_URL = "/logo.png";

const APP_MOCKUP_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrrVJotqSjAiM_IGTD4Rxt7n9RApZdvlv-BfoXAVSZlo3d-QPxMXOq6hNPPTW0s-jAMJdYtqyHMj_CieSWMN5YTOwUOKw7wye2zwa2JoJdTZq-z6kDkF1eGFDY10J4WqHEAEu9hwIbKgABrfAHUXMaitNCe-bAYWCx5RO4nRrvpuqn8ZghfResvVur3yCSiLI5klJI83unG2sMpvBMp-KrgT0mru0sTk4tH9swE4js4ZILLrNswCZ6WmWRfdXIcQi3L7Y8MmM68hr";

const VALUES = [
  { icon: "visibility", title: "Visibilidad", desc: "Ponemos tu talento frente a los ojos adecuados en todo el mundo." },
  { icon: "hub", title: "Conexión", desc: "Unimos atletas con clubes, agentes y marcas líderes en la industria.", delay: "100ms" },
  { icon: "memory", title: "Innovación", desc: "Análisis biométrico y tecnológico de última generación para tu perfil.", delay: "200ms" },
  { icon: "verified", title: "Autenticidad", desc: "Datos reales, métricas puras, talento auténtico sin filtros ni sesgos.", delay: "300ms" },
  { icon: "fitness_center", title: "Superación", desc: "Acompañamos tu crecimiento ante cualquier desafío deportivo.", delay: "400ms" },
];

const FEATURES = [
  { num: "01", title: "Asistencia Médica", desc: "Acceso a red de especialistas y seguimiento de salud deportiva integrada directamente en tu perfil de atleta." },
  { num: "02", title: "Marketing Deportivo", desc: "Asesoramiento profesional para potenciar tu marca personal y atraer las mejores propuestas de clubes y patrocinadores." },
  { num: "03", title: "Análisis de Rendimiento", desc: "Tracking de métricas en tiempo real para visualizar tu evolución competitiva con estándares de clubes profesionales." },
];

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <>
      <div className="scan-line-bg animate-scanline" />
      <div className="fixed inset-0 radar-grid pointer-events-none z-0" />
      <div className="bg-noise" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[60] bg-background/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <img alt="INVICTO" className="h-8 md:h-10 object-contain brightness-0 invert" src={LOGO_URL} />
          <div className="hidden md:flex gap-10 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
            <a className="hover:text-neon transition-all hover:tracking-[0.4em]" href="#values">Valores</a>
            <a className="hover:text-neon transition-all hover:tracking-[0.4em]" href="#features">Funciones</a>
            <a className="hover:text-neon transition-all hover:tracking-[0.4em]" href="#about">Misión</a>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-neon text-background font-headline font-black italic px-6 py-2 skew-card hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(196,247,80,0.3)]"
          >
            <span className="skew-content">DESCARGAR</span>
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center relative overflow-hidden">
          <div className="reveal">
            <h1 className="font-headline text-5xl md:text-[7rem] font-black italic uppercase leading-[0.9] tracking-tighter mb-8">
              LLEVA TU TALENTO <br />
              <span className="text-neon text-glow inline-block transform -skew-x-6">AL SIGUIENTE NIVEL</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-on-background/60 mb-12 font-medium leading-relaxed">
              La plataforma de social scouting que conecta el talento con las oportunidades reales mediante tecnología de élite.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="animate-pulse-glow bg-neon text-background font-headline text-2xl font-black italic px-12 py-6 skew-card hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-4 group"
            >
              <span className="skew-content flex items-center gap-3">
                EMPEZAR AHORA
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">bolt</span>
              </span>
            </button>
          </div>

          <div className="mt-24 reveal animate-float">
            <div className="relative group">
              <div className="absolute inset-0 bg-neon/20 blur-[120px] rounded-full group-hover:bg-neon/30 transition-all duration-1000" />
              <img
                alt="App Interface"
                className="relative z-10 max-w-2xl w-full mx-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)] border-4 border-white/5 rounded-[3rem]"
                src={APP_MOCKUP_URL}
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section id="values" className="py-32 bg-surface-container/30 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 reveal">
              <h2 className="font-headline text-5xl md:text-7xl font-black italic uppercase text-neon mb-6">NUESTROS VALORES</h2>
              <div className="h-1.5 w-48 bg-neon transform -skew-x-12" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="reveal p-8 bg-surface-container/50 kinetic-border skew-card hover:bg-surface-bright transition-all group"
                  style={v.delay ? { transitionDelay: v.delay } : undefined}
                >
                  <div className="skew-content">
                    <span className="material-symbols-outlined text-neon text-4xl mb-6 group-hover:scale-110 transition-transform block">{v.icon}</span>
                    <h3 className="font-headline text-xl font-black italic uppercase mb-3">{v.title}</h3>
                    <p className="text-sm text-on-background/50 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="w-full lg:w-1/2 reveal">
                <h2 className="font-headline text-5xl md:text-7xl font-black italic uppercase mb-12 leading-none">
                  HERRAMIENTAS DE <span className="text-neon block">ALTO RENDIMIENTO</span>
                </h2>
                <div className="space-y-16">
                  {FEATURES.map((f) => (
                    <div key={f.num} className="flex gap-8 group">
                      <div className="shrink-0 w-16 h-16 bg-neon/10 border-2 border-neon flex items-center justify-center text-neon font-headline text-2xl font-black italic skew-card group-hover:scale-110 transition-transform">
                        <span className="skew-content">{f.num}</span>
                      </div>
                      <div>
                        <h4 className="font-headline text-3xl font-black italic uppercase mb-3 text-neon/90">{f.title}</h4>
                        <p className="text-on-background/60 text-lg leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-1/2 reveal" style={{ transitionDelay: "200ms" }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-neon/10 blur-[150px] rounded-full" />
                  <img
                    alt="Feature Display"
                    className="w-full relative z-10 drop-shadow-[0_50px_50px_rgba(196,247,80,0.15)] rounded-2xl border border-white/10"
                    src={APP_MOCKUP_URL}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="about" className="py-32 bg-neon text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none radar-grid" />
          <div className="max-w-5xl mx-auto px-6 text-center reveal">
            <h2 className="font-headline text-5xl md:text-8xl font-black italic uppercase mb-12 leading-tight tracking-tighter">
              NUESTRA MISIÓN
            </h2>
            <div className="font-headline text-3xl md:text-5xl italic font-black mb-16 leading-tight max-w-4xl mx-auto">
              &ldquo;INVICTO nace para romper las barreras del fútbol tradicional. No importa dónde estés, tu talento merece ser visto.&rdquo;
            </div>
            <div className="max-w-3xl mx-auto text-xl md:text-2xl font-medium opacity-90 mb-16 leading-relaxed">
              Somos la primera plataforma de social scouting diseñada para democratizar el acceso al profesionalismo.
              Combinamos tecnología de punta, asistencia médica y análisis de rendimiento para que el único límite sea tu pasión.
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-background text-neon font-headline text-2xl font-black italic px-12 py-6 skew-card hover:scale-110 active:scale-95 transition-all shadow-2xl"
            >
              <span className="skew-content">ÚNETE A LA REVOLUCIÓN</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img alt="INVICTO" className="h-8 brightness-0 invert" src={LOGO_URL} />
            <div className="font-mono text-[10px] tracking-[0.2em] text-on-background/30 uppercase">
              © 2024 INVICTO PERFORMANCE. NO EXCUSES.
            </div>
          </div>
          <div className="flex gap-12 font-mono text-[10px] tracking-[0.3em] font-bold uppercase text-on-background/40">
            <a className="hover:text-neon transition-colors" href="#">Privacidad</a>
            <a className="hover:text-neon transition-colors" href="#">Términos</a>
            <a className="hover:text-neon transition-colors" href="#">Contacto</a>
          </div>
          <div className="flex gap-8">
            <button onClick={() => setModalOpen(true)} className="text-neon/60 hover:text-neon font-headline italic font-black transition-all hover:scale-110">ANDROID</button>
            <button onClick={() => setModalOpen(true)} className="text-neon/60 hover:text-neon font-headline italic font-black transition-all hover:scale-110">iOS</button>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" onClick={() => setModalOpen(false)} />
          <div className="relative bg-surface-container border-2 border-neon p-10 md:p-16 max-w-2xl w-full skew-card shadow-[0_0_100px_rgba(196,247,80,0.1)]">
            <div className="skew-content">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="font-headline text-4xl md:text-5xl font-black italic uppercase text-neon mb-4">DESCARGAR APP</h3>
                  <div className="h-1 w-24 bg-neon" />
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-on-background/30 hover:text-neon transition-colors hover:rotate-90 duration-300"
                >
                  <span className="material-symbols-outlined text-4xl">close</span>
                </button>
              </div>
              <p className="text-on-background/60 text-lg mb-12 leading-relaxed">
                Selecciona tu ecosistema para comenzar tu camino al éxito profesional con INVICTO.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="#" className="flex items-center gap-6 bg-background border-2 border-white/5 p-6 rounded-2xl hover:border-neon transition-all hover:scale-[1.05] group">
                  <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 transition-colors shrink-0">
                    <svg className="w-9 h-9 text-on-background group-hover:text-neon transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase font-mono tracking-widest font-bold">App Store</div>
                    <div className="text-2xl font-black font-headline italic">iOS</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-6 bg-background border-2 border-white/5 p-6 rounded-2xl hover:border-neon transition-all hover:scale-[1.05] group">
                  <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 transition-colors shrink-0">
                    <svg className="w-9 h-9 text-on-background group-hover:text-neon transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm11.207 10.065l2.249-2.234L3.513.133a1.499 1.499 0 0 0-.766-.207 1.49 1.49 0 0 0-.637.144l10.434 10.919zm0 2.474L2.11 23.477c.19.083.397.129.617.129.27 0 .53-.07.757-.205l10.991-6.22-3.031-3.018z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] opacity-40 uppercase font-mono tracking-widest font-bold">Google Play</div>
                    <div className="text-2xl font-black font-headline italic">ANDROID</div>
                  </div>
                </a>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-mono tracking-[0.2em] opacity-30 uppercase italic font-bold">
                  V 2.4.1 · HIGH PERFORMANCE BUILD · NO EXCUSES
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
