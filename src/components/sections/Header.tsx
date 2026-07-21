"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoImg from "@/logo/logo-for-dark-bg.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Trigger capsule expansion after header slides in from top
  useEffect(() => {
    if (showNav) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [showNav]);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "About", href: "#about" },
  ];

  return (
    <div
      className={`fixed top-3 left-0 w-full flex justify-center z-50 transition-all duration-1000 cubic-bezier(.2,.8,.2,1) ${
        showNav
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-24 pointer-events-none"
      }`}
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className={`relative flex items-center justify-between rounded-full border border-white/10 bg-black/40 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-visible ${
          isExpanded
            ? "w-[96%] md:w-[92%] max-w-[1300px] h-[64px]"
            : "w-[320px] h-[50px]"
        }`}
        role="navigation"
      >
        {/* Logo (Absolute positioning so its height doesn't stretch the header) */}
        <motion.a
          layout
          href="#"
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10"
        >
          <Image
            src={logoImg}
            alt="CureLogics Logo"
            height={60}
            priority
            className="h-[60px] w-auto object-contain max-h-none select-none pointer-events-none"
          />
        </motion.a>

        {/* Desktop nav links container - centered inside the capsule */}
        <div className="flex-1 flex justify-center overflow-hidden h-full items-center">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="hidden sm:flex items-center gap-9"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="transition-colors duration-200 text-[#8b96ac] hover:text-[#eaf1fb] text-[0.88rem] font-sans font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop CTA (Book a Call) / Mobile Hamburger toggle (Absolute positioned right) */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10">
          {/* Desktop CTA */}
          <motion.div layout className="hidden md:block">
            <a
              href="#contact"
              className="nav-cta text-[0.88rem] font-medium px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.045] hover:bg-white/[0.07] hover:border-[#35d0ff]/40 transition-all duration-200 whitespace-nowrap"
            >
              Book a call
            </a>
          </motion.div>

          {/* Mobile Hamburger toggle - only shown when expanded on mobile */}
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col gap-1 md:hidden focus:outline-none p-2"
              aria-label="Toggle Navigation"
            >
              <span
                className={`h-[1.5px] w-5 bg-[#eaf1fb] transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-[#eaf1fb] transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-5 bg-[#eaf1fb] transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[5px]" : ""
                }`}
              />
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isOpen && isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-[125%] left-0 w-full bg-black/90 border border-white/10 backdrop-blur-lg flex flex-col items-center py-6 gap-5 rounded-[24px] shadow-2xl md:hidden z-40"
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
      </motion.div>
    </div>
  );
}
