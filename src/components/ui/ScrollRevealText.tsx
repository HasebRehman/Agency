"use client";

import React, { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

// Smooth ease-in-out curve
const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export default function ScrollRevealText() {
  const sectionRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const rafIdRef = useRef<number>(0);
  const progressRef = useRef(0); // Holds the smoothed/lerped progress

  const text =
    "At Curelogics, we specialize in delivering cutting-edge software solutions tailored to your business needs. Our team of experts is dedicated to transforming your ideas into reality.";
  const words = text.split(" ");

  // Cover double the scroll distance (200vh total) to slow down the reveal speed
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    // Initialize the starting progress to avoid initial jumps
    progressRef.current = scrollYProgress.get();

    const updateWords = (prog: number) => {
      // Reveal words between 15% and 65% of the scroll timeline
      const revealStart = 0.15;
      const revealEnd = 0.65;
      const range = revealEnd - revealStart;

      const clampedProgress = Math.max(0, Math.min(1, (prog - revealStart) / range));

      for (let i = 0; i < words.length; i++) {
        const wordEl = wordRefs.current[i];
        if (!wordEl) continue;

        const wordStart = i / words.length;
        const wordEnd = (i + 1) / words.length;
        const localProgress = (clampedProgress - wordStart) / (wordEnd - wordStart);
        const clampedLocal = Math.max(0, Math.min(1, localProgress));

        const easedLocal = easeInOutQuad(clampedLocal);

        // Opacity: 0.08 -> 1.0
        wordEl.style.opacity = String(0.08 + easedLocal * 0.92);

        // Subtle glowing shadow
        if (easedLocal > 0.01) {
          wordEl.style.textShadow = [
            `0 0 ${easedLocal * 8}px rgba(53, 208, 255, ${easedLocal * 0.25})`,
            `0 0 ${easedLocal * 16}px rgba(139, 123, 255, ${easedLocal * 0.12})`,
          ].join(", ");
        } else {
          wordEl.style.textShadow = "none";
        }
      }
    };

    // ── RAF animation loop with lerping ──
    const tick = () => {
      const target = scrollYProgress.get();
      const current = progressRef.current;

      // Dampen the scroll progress updates with a smooth lerp
      const diff = target - current;
      if (Math.abs(diff) > 0.0001) {
        // Slow, buttery smooth interpolation factor (0.055)
        progressRef.current = current + diff * 0.055;
        updateWords(progressRef.current);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Initial draw
    updateWords(progressRef.current);

    // Start RAF loop
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollYProgress, words.length]);

  return (
    <p
      ref={sectionRef}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-relaxed max-w-6xl text-center font-display drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] px-8 select-none"
    >
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) wordRefs.current[i] = el;
          }}
          className="inline-block mr-[0.25em]"
          style={{
            color: "#ffffff",
            opacity: 0.08,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
