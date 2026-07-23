"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useScroll } from "framer-motion";

// Smooth ease-out curve for interpolation
const easeOutQuad = (t: number) => t * (2 - t);

export default function ScrollRevealText() {
  const sectionRef = useRef<HTMLParagraphElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const rafIdRef = useRef<number>(0);
  const lastProgressRef = useRef(-1);

  const text =
    "At Curelogics, we specialize in delivering cutting-edge software solutions tailored to your business needs. Our team of experts is dedicated to transforming your ideas into reality.";
  
  const words = useMemo(() => text.split(" "), [text]);

  // Pre-calculate characters and assign flat indices
  const wordsAndChars = useMemo(() => {
    let charCounter = 0;
    return words.map((word) => {
      const chars = word.split("").map((char) => {
        const index = charCounter++;
        return { char, index };
      });
      return { word, chars };
    });
  }, [words]);

  const totalChars = useMemo(() => {
    let count = 0;
    wordsAndChars.forEach((w) => {
      count += w.chars.length;
    });
    return count;
  }, [wordsAndChars]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  useEffect(() => {
    const updateChars = (progress: number) => {
      const revealStart = 0.28;
      const revealEnd = 0.95;
      const range = revealEnd - revealStart;

      // Normalise relative scroll progress
      const clampedProgress = Math.max(0, Math.min(1, (progress - revealStart) / range));

      for (let i = 0; i < totalChars; i++) {
        const charEl = charRefs.current[i];
        if (!charEl) continue;

        // character start threshold (first starts at 0.0, last starts at 0.82)
        const charStart = (i / totalChars) * 0.82;
        // character fade duration (18% scroll window overlap for smooth blending)
        const charDuration = 0.18;
        
        const localProgress = (clampedProgress - charStart) / charDuration;
        const clampedLocal = Math.max(0, Math.min(1, localProgress));

        const easedLocal = easeOutQuad(clampedLocal);

        // Opacity: 0.15 (dim gray) → 1.0 (bright white)
        charEl.style.opacity = String(0.15 + easedLocal * 0.85);

        // White shadow glow that expands and blends
        if (easedLocal > 0.01) {
          charEl.style.textShadow = `0 0 ${easedLocal * 8}px rgba(255, 255, 255, ${easedLocal * 0.45})`;
        } else {
          charEl.style.textShadow = "none";
        }
      }
    };

    // RAF loop for smooth performance
    const tick = () => {
      const current = scrollYProgress.get();
      if (Math.abs(current - lastProgressRef.current) > 0.0005) {
        lastProgressRef.current = current;
        updateChars(current);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Initial sync
    updateChars(scrollYProgress.get());

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollYProgress, wordsAndChars, totalChars]);

  return (
    <p
      ref={sectionRef}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-relaxed max-w-6xl text-center font-display drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] px-8 select-none"
    >
      {wordsAndChars.map((w, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {w.chars.map((c) => (
            <span
              key={c.index}
              ref={(el) => {
                if (el) charRefs.current[c.index] = el;
              }}
              className="inline-block transition-all duration-75 ease-out"
              style={{
                color: "#ffffff",
                opacity: 0.15,
              }}
            >
              {c.char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
