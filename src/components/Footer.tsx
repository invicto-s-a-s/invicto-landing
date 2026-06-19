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
      <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.6 6.02h-1.848v-1.84c0-.497.416-.898.93-.898.325 0 .595.202.74.486h.177V5.1zm-1.85 2.63H12v5.97c0 1.27-.883 2.35-2.08 2.35-1.197 0-2.08-1.08-2.08-2.35v-5.97h-1.35v5.97c0 1.95 1.49 3.52 3.43 3.52s3.43-1.57 3.43-3.52v-5.97zm2.1-.25h1.35V15.6c0 1.272.883 2.352 2.08 2.352 1.197 0 2.08-1.08 2.08-2.352v-5.97h1.35v5.97c0 1.95-1.49 3.52-3.43 3.52s-3.43-1.57-3.43-3.52v-5.97z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@invicto.app?_r=1&_t=ZS-974saShwmG1",
    icon: (
      <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
        <path d="M19.321 5.562a5.122 5.122 0 01-.868-.074c.356-1.327.321-2.415-.213-3.247-.534-.832-1.476-1.366-2.826-1.602-1.35-.236-2.878.068-4.583.91-1.706.842-2.833 2.12-3.381 3.834-.548 1.714-.548 3.536 0 5.465l.139 1.118c-1.05.353-2.071.795-3.066 1.328-1.528.823-2.872 1.918-4.032 3.284C.395 17.243-.166 19.16.087 21.256c.253 2.096 1.323 3.94 3.21 5.532 1.888 1.59 4.228 2.386 7.031 2.386 3.08 0 5.77-.968 8.07-2.904 2.3-1.937 3.45-4.527 3.45-7.771V8.918c.895.709 1.99 1.328 3.284 1.857 1.295.529 2.386.794 3.275.794v-4.093c-1.189 0-2.421-.354-3.695-1.063-1.275-.71-2.316-1.644-3.125-2.804z" />
      </svg>
    ),
  },
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
