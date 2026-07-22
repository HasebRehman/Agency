"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, ArrowUpRight } from "lucide-react";

/* ─── ShinyText Component ─── */
function ShinyText({ text }: { text: string }) {
  return (
    <motion.span
      className="inline-block"
      style={{
        backgroundImage: "linear-gradient(100deg, #64CEFB 35%, #ffffff 50%, #64CEFB 65%)",
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={{
        backgroundPositionX: ["150%", "-150%"],
      }}
      transition={{
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {text}
    </motion.span>
  );
}

/* ─── DesignPro Hero Section ─── */
export default function DesignProHero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Courses", href: "#courses" },
    { name: "Instructors", href: "#instructors" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "#blog" },
  ];

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* Background looping video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-1" />

      {/* Main Content Layout Container */}
      <div className="relative w-full h-full flex flex-col justify-between max-w-7xl mx-auto px-6 md:px-12 py-8 z-10">
        
        {/* ─── Navigation Bar ─── */}
        <header className="w-full flex items-center justify-between">
          {/* Logo design */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white font-sans">
              DesignPro
            </span>
          </div>

          {/* Pill navigation links container */}
          <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-gray-700 bg-black/60 px-6 py-2 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors duration-200 text-sm px-3.5 py-1 font-medium font-sans no-underline"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm px-3.5 py-1 font-medium font-sans no-underline flex items-center gap-1"
            >
              Contact us <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile hamburger toggle (lg breakpoint mobile first) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-white/80 transition-colors p-2"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-6 right-6 bg-black/90 border border-gray-700 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-lg z-50 lg:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium py-1 no-underline"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium py-1 no-underline flex items-center gap-1"
              >
                Contact us <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Top Content Section (Below Nav) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-6 lg:mt-12">
          {/* Left Column */}
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl mb-0 font-sans">
            We deliver transformative programs that empower emerging product designers with cutting-edge expertise and vision to thrive globally.
          </p>

          {/* Right Column */}
          <p className="text-white/80 text-sm md:text-base font-medium lg:text-right mb-0 font-sans">
            8000+ Talented Designers Launched !
          </p>
        </div>

        {/* ─── Hero Section (Center Layout) ─── */}
        <div className="flex flex-col items-center justify-center text-center flex-1 my-auto">
          {/* Subtitle above header */}
          <span className="text-white/80 text-xs sm:text-sm tracking-widest uppercase font-semibold mb-3 sm:mb-4">
            Seats for Next Program Opening Soon
          </span>

          {/* Main Heading lines */}
          <h1 className="flex flex-col items-center justify-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] mb-8 font-sans">
            <span className="text-white font-medium block">
              Become
            </span>
            <ShinyText text="Product Leader." />
          </h1>

          {/* CTA Button */}
          <button className="group relative flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-black text-white hover:bg-zinc-900 border border-gray-800 transition-all duration-300 font-medium text-sm md:text-base cursor-pointer shadow-lg">
            Apply for Next Enrollment
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
