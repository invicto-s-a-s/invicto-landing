"use client";

import { motion } from "framer-motion";

interface FooterProps {
  onCTAClick: () => void;
}

const NAV_LINKS = [
  { label: "Privacidad", href: "#" },
  { label: "Términos", href: "#" },
  { label: "Contacto", href: "#" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1D96FHkkMi/",
    icon: (
      <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/invictoapp?utm_source=qr&igsh=MzVwb2NjOTV4cnZo",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@invicto.app?_r=1&_t=ZS-974saShwmG1",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.32 1.78-3.41 2.86-5.55 2.89-1.34.05-2.67-.38-3.78-1.07-1.96-1.23-3.23-3.42-3.34-5.73-.01-.45-.01-.9 0-1.35.14-2.17 1.16-4.27 2.82-5.68 1.84-1.56 4.37-2.3 6.74-1.9.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

export default function Footer({ onCTAClick }: FooterProps) {
  return (
    <footer className="py-16 border-t border-neon/10 relative z-10" style={{ background: "rgb(13 13 13 / 0.75)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          {/* Brand */}
          <div>
            <img
              alt="INVICTO"
              src="/logo.png"
              className="h-9 object-contain brightness-0 invert mb-4"
            />
            <p className="font-mono text-on-background/30 text-[10px] tracking-[0.2em] uppercase max-w-xs">
              Una plataforma donde el talento se muestra, se mide y se convierte en oportunidades reales.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.3em] uppercase text-on-background/35 hover:text-neon transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Download */}
          <div className="flex gap-5">
            <button
              onClick={onCTAClick}
              className="font-headline font-black italic text-on-background/40 hover:text-neon transition-colors duration-200 hover:scale-105 transform"
            >
              iOS
            </button>
            <button
              onClick={onCTAClick}
              className="font-headline font-black italic text-on-background/40 hover:text-neon transition-colors duration-200 hover:scale-105 transform"
            >
              ANDROID
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-8 pt-8 border-t border-white/5">
          {/* Social links - Large buttons */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(170,255,0,0.6)" }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl border-2 border-neon/50 hover:border-neon bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 text-neon/70 hover:text-neon group shadow-lg hover:shadow-neon/20"
                title={social.name}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 group-hover:scale-125 transition-transform duration-300">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </div>

          {/* Copyright and tagline */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-mono text-[9px] tracking-[0.25em] text-on-background/25 uppercase">
              © 2026 INVICTO PERFORMANCE. ALL RIGHTS RESERVED.
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-headline font-black italic text-neon/30 text-sm tracking-widest"
            >
              NO EXCUSES.
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
