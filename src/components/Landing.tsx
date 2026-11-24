"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import VideoShowcase from "@/components/sections/VideoShowcase";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyInvicto from "@/components/sections/WhyInvicto";
import Features from "@/components/sections/Features";
import Ratings from "@/components/sections/Ratings";
import Ecosystem from "@/components/sections/Ecosystem";
import ContactForm from "@/components/sections/ContactForm";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Landing() {
  return (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      <Navbar />

      <main>
        <Hero />
        <VideoShowcase />
        <Problem />
        <HowItWorks />
        <WhyInvicto />
        <Features />
        <Ratings />
        <Ecosystem />
        <DownloadCTA />
        <ContactForm />
      </main>

      <Footer />

      <WhatsAppButton />

    </>
  );
}
