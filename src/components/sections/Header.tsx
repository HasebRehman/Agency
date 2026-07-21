"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoImg from "@/logo/logo-for-dark-bg.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Monitor document.body class to synchronize with GSAP/JS entry sequence
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("show-nav")) {
        setShowNav(true);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Check initial state
    if (document.body.classList.contains("show-nav")) {
      setShowNav(true);
    }

    // Fallback: show nav after a short delay even if body class isn't set yet
    const fallback = setTimeout(() => setShowNav(true), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav
      className={`relative z-10 flex items-center justify-between w-full px-[7%] py-[34px] transition-all duration-700 cubic-bezier(.2,.8,.2,1) ${
        showNav
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-7 pointer-events-none"
      }`}
    >
      {/* Logo */}
      <a href="#" className="logo flex items-center">
        <Image
          src={logoImg}
          alt="CureLogics Logo"
          height={38}
          priority
          className="h-[38px] w-auto object-contain"
        />
      </a>

      {/* Desktop nav links container using user's nav-links class */}
      <div className="nav-links hidden md:flex items-center gap-9">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="transition-colors duration-200 hover:text-[#eaf1fb] focus-visible:outline-2 focus-visible:outline-[#35d0ff] focus-visible:outline-offset-4 focus-visible:rounded"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="hidden md:block">
        <a
          href="#contact"
          className="nav-cta text-[0.85rem] font-medium px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.045] hover:bg-white/[0.07] hover:border-[#35d0ff]/40 transition-all duration-200"
        >
          Book a call
        </a>
      </div>

      {/* Mobile Hamburger toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 md:hidden focus:outline-none p-2 z-50"
        aria-label="Toggle Navigation"
      >
        <span
          className={`h-[2px] w-6 bg-[#eaf1fb] transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-[8px]" : ""
          }`}
        />
        <span
          className={`h-[2px] w-6 bg-[#eaf1fb] transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-[2px] w-6 bg-[#eaf1fb] transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-[8px]" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 w-full bg-[#05070c]/95 border-b border-white/5 backdrop-blur-md flex flex-col items-center py-8 gap-6 md:hidden z-40"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-[17px] text-[#8b96ac] hover:text-[#eaf1fb] transition-colors no-underline font-sans"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-[15px] font-semibold px-6 py-2.5 rounded-full bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] text-[#031018]"
            >
              Book a call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
