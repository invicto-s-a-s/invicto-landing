"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Ratings from "@/components/sections/Ratings";
import Testimonials from "@/components/sections/Testimonials";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/Footer";
import DownloadModal from "@/components/DownloadModal";

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  return (
    <>
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/Imagen-BG.png')",
          opacity: 0.35,
        }}
      />

      {/* Film grain overlay */}
      <div className="grain-overlay" />

      <Navbar onCTAClick={open} />

      <main>
        <Hero onCTAClick={open} />
        <Problem />
        <HowItWorks />
        <Features />
        <Ratings />
        <Testimonials />
        <DownloadCTA onCTAClick={open} />
      </main>

      <Footer onCTAClick={open} />

      <DownloadModal isOpen={modalOpen} onClose={close} />
    </>
  );
}
