"use client";

import React, { useState, useEffect, startTransition, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoImg from "@/logo/logo-for-dark-bg.png";
import logoImgLight from "@/logo/fulllogo.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightBg, setIsLightBg] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Subscribe to document.body class changes using React's built-in external store hook
  // This avoids calling setState inside a MutationObserver callback (lint error fix)
  const showNav = useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    },
    () => document.body.classList.contains("show-nav"),
    // Server-side snapshot — no document available, default to false
    () => false,
  );

  // Fallback: show nav after a short delay even if body class isn't set yet
  useEffect(() => {
    if (!document.body.classList.contains("show-nav")) {
      const fallback = setTimeout(() => {
        document.body.classList.add("show-nav");
      }, 2000);
      return () => clearTimeout(fallback);
    }
  }, []);

  // Trigger capsule expansion after header slides in from top
  useEffect(() => {
    if (showNav) {
      const timer = setTimeout(() => {
        startTransition(() => {
          setIsExpanded(true);
        });
      }, 700);
      return () => clearTimeout(timer);
    } else {
      startTransition(() => {
        setIsExpanded(false);
      });
    }
  }, [showNav]);

  useEffect(() => {
    let animId: number;

    const updateThemeAndScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      let isOverWhite = false;
      const whiteSections = document.querySelectorAll('[data-theme-section="white"]');

      whiteSections.forEach((sec) => {
        const id = sec.id;
        const rect = sec.getBoundingClientRect();

        if (id === "key-facts-section") {
          // Check if top 100vw white bar has scaled up over the header area
          const topBar = document.getElementById("hero-white-bar-top");
          if (topBar) {
            const style = window.getComputedStyle(topBar);
            const transform = style.transform || (style as unknown as Record<string, string>).webkitTransform;
            if (transform && transform !== "none") {
              const values = transform.split("(")[1].split(")")[0].split(",");
              const scaleY = parseFloat(values.length === 6 ? values[3] : values[5]);
              if (scaleY >= 0.5) {
                isOverWhite = true;
              }
            }
          }
          const keyFactsContent = document.getElementById("key-facts-content");
          if (keyFactsContent) {
            const opacity = parseFloat(window.getComputedStyle(keyFactsContent).opacity);
            if (opacity >= 0.05) {
              isOverWhite = true;
            }
          }
        } else {
          // Standard white background sections
          if (rect.top <= 80 && rect.bottom >= 60) {
            isOverWhite = true;
          }
        }
      });

      setIsLightBg(isOverWhite);
    };

    updateThemeAndScroll();
    window.addEventListener("scroll", updateThemeAndScroll, { passive: true });
    window.addEventListener("resize", updateThemeAndScroll);

    // Animation frame loop ensures zero delay during GSAP scrubbed scroll
    const loop = () => {
      updateThemeAndScroll();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", updateThemeAndScroll);
      window.removeEventListener("resize", updateThemeAndScroll);
    };
  }, []);

  const isHeaderVisible = showNav;

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "About", href: "#about" },
  ];

  return (
    <div
      className={`fixed top-3 left-0 w-full flex justify-center z-50 transition-all duration-1000 cubic-bezier(.2,.8,.2,1) ${
        isHeaderVisible
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
        className={`relative flex items-center justify-between transition-all duration-300 ease-in-out bg-transparent border-none shadow-none ${
          isExpanded
            ? "w-[96%] md:w-[92%] max-w-[1300px] h-[64px]"
            : "w-[320px] h-[50px]"
        }`}
        role="navigation"
      >
        {/* Logo container (pixel-perfect unnoticeable cross-fade) */}
        <motion.a
          layout
          href="#"
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10 w-[170px] h-[50px]"
        >
          <div className="relative w-[170px] h-[50px]">
            <Image
              src={logoImg}
              alt="CureLogics Logo"
              fill
              priority
              sizes="170px"
              className={`object-contain object-left select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                isLightBg ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={logoImgLight}
              alt="CureLogics Logo"
              fill
              priority
              sizes="170px"
              className={`object-contain object-left select-none pointer-events-none transition-opacity duration-700 ease-in-out ${
                isLightBg ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </motion.a>

        {/* Desktop nav links container - centered inside the header */}
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
                    className={`transition-colors duration-300 text-[15px] font-sans font-medium no-underline ${
                      isLightBg
                        ? "text-black hover:text-zinc-600"
                        : "text-white hover:text-cyan-300"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop CTA (Book a Call) */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex items-center shrink-0 z-10">
          <motion.div layout className="hidden md:block">
            <a
              href="#contact"
              className={`text-[0.88rem] font-medium px-6 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap ${
                isLightBg
                  ? "text-black border-black/20 bg-black/5 hover:bg-black/10"
                  : "text-white border-white/20 bg-white/10 hover:bg-white/20 hover:border-cyan-400"
              }`}
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
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "rotate-45 translate-y-[5px]" : ""}`}
              />
              <span
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-[1.5px] w-5 transition-all duration-300 ${
                  isLightBg ? "bg-black" : "bg-[#eaf1fb]"
                } ${isOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
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
              className="absolute top-[125%] left-0 w-full backdrop-blur-lg bg-black/90 border border-white/10 flex flex-col items-center py-6 gap-5 rounded-[24px] shadow-2xl md:hidden z-40"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-[17px] transition-colors duration-300 no-underline font-sans ${
                    isLightBg
                      ? "text-black hover:text-[#eaf1fb]"
                      : "text-[#8b96ac] hover:text-[#eaf1fb]"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className={`text-[15px] font-semibold px-6 py-2.5 rounded-full transition-colors duration-300 ${
                  isLightBg
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] text-[#031018]"
                }`}
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
