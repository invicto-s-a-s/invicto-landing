"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  onCTAClick: () => void;
}

export default function Navbar({ onCTAClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <img
          alt="INVICTO"
          src="/logo.png"
          className="h-8 md:h-9 object-contain brightness-0 invert"
        />

        <div className="hidden md:flex gap-8 items-center">
          {[
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "Características", href: "#caracteristicas" },
            { label: "Testimonios", href: "#testimonios" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] tracking-[0.28em] uppercase text-on-background/45 hover:text-neon transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.button
          onClick={onCTAClick}
          whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(170,255,0,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-neon text-background font-headline font-black italic px-7 py-2.5 skew-card transition-shadow duration-300"
        >
          <span className="skew-content text-sm">DESCARGAR</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
