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

export default function Footer({ onCTAClick }: FooterProps) {
  return (
    <footer className="py-16 bg-background border-t border-white/5 relative z-10">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
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
    </footer>
  );
}
