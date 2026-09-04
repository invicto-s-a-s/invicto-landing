"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import DownloadModal from "@/components/DownloadModal";

interface LegalPageShellProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="grain-overlay" />

      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="inline-block">
            <img
              alt="INVICTO"
              src="/logo.png"
              className="h-8 md:h-9 object-contain brightness-0 invert"
            />
          </Link>

          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.28em] uppercase text-on-background/45 hover:text-neon transition-colors duration-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-32 md:pt-40 pb-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="bg-background/90 backdrop-blur-xl border border-white/8 rounded-2xl p-6 md:p-12 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="mb-12">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon/60 mb-4">
                Documento legal
              </div>
              <h1 className="font-headline font-black italic text-on-background text-4xl md:text-5xl leading-tight mb-4">
                {title}
              </h1>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-background/40">
                Última actualización: {lastUpdated}
              </div>
              <div className="h-0.5 w-16 bg-neon mt-8" />
            </div>

            <article className="legal-content text-on-background/85 font-body text-[15px] leading-[1.8]">
              {children}
            </article>
          </div>
        </div>
      </main>

      <Footer onCTAClick={() => setModalOpen(true)} />
      <DownloadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
