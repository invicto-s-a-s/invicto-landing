"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyInvicto from "@/components/sections/WhyInvicto";
import Features from "@/components/sections/Features";
import Ratings from "@/components/sections/Ratings";
import Ecosystem from "@/components/sections/Ecosystem";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/Footer";
import AccessRequestModal from "@/components/AccessRequestModal";

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  return (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      <Navbar onCTAClick={open} />

      <main>
        <Hero onCTAClick={open} />
        <Problem />
        <HowItWorks />
        <WhyInvicto />
        <Features />
        <Ratings />
        <Ecosystem />
        <DownloadCTA onCTAClick={open} />
      </main>

      <Footer onCTAClick={open} />

      <AccessRequestModal isOpen={modalOpen} onClose={close} />
    </>
  );
}
