"use client";

import React, { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

// Smooth ease-out curve (pure function, no hook needed)
const easeOutQuad = (t: number) => t * (2 - t);

export default function ScrollRevealText() {
  const sectionRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const rafIdRef = useRef<number>(0);
  const lastProgressRef = useRef(-1);

  const text =
    "At Curelogics, we specialize in delivering cutting-edge software solutions tailored to your business needs. Our team of experts is dedicated to transforming your ideas into reality.";
  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  useEffect(() => {
    const updateWords = (progress: number) => {
      const revealStart = 0.28;
      const revealEnd = 0.95;
      const range = revealEnd - revealStart;

      const clampedProgress = Math.max(0, Math.min(1, (progress - revealStart) / range));

      for (let i = 0; i < words.length; i++) {
        const wordEl = wordRefs.current[i];
        if (!wordEl) continue;

        const wordStart = i / words.length;
        const wordEnd = (i + 1) / words.length;
        const localProgress = (clampedProgress - wordStart) / (wordEnd - wordStart);
        const clampedLocal = Math.max(0, Math.min(1, localProgress));

        const easedLocal = easeOutQuad(clampedLocal);

        // Opacity: 0.08 → 1.0 (high contrast)
        wordEl.style.opacity = String(0.08 + easedLocal * 0.92);

        // Glow shadow that grows with brightness
        if (easedLocal > 0.01) {
          wordEl.style.textShadow = [
            `0 0 ${easedLocal * 6}px rgba(53, 208, 255, ${easedLocal * 0.25})`,
            `0 0 ${easedLocal * 14}px rgba(139, 123, 255, ${easedLocal * 0.12})`,
          ].join(", ");
        } else {
          wordEl.style.textShadow = "none";
        }
      }
    };

    // ── RAF polling loop ──
    // Continuously reads scrollYProgress on every frame so fast scroll
    // never skips intermediate positions.
    // Skips update if progress hasn't changed (saves CPU during idle).
    const tick = () => {
      const current = scrollYProgress.get();
      if (Math.abs(current - lastProgressRef.current) > 0.001) {
        lastProgressRef.current = current;
        updateWords(current);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Initial sync (prevent flash on mount)
    updateWords(scrollYProgress.get());

    // Start RAF loop (runs continuously — progress-skip optimization
    // prevents unnecessary style writes when not scrolling)
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
