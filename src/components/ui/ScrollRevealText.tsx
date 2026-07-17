"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollRevealText() {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const text =
    "At Curelogics, we specialize in delivering cutting-edge software solutions tailored to your business needs. Our team of experts is dedicated to transforming your ideas into reality.";
  const words = text.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = el.querySelectorAll(".reveal-word");

    // Animate words opacity from dimmed (0.15) to bright (1.0)
    const anim = gsap.to(spans, {
      scrollTrigger: {
        trigger: "#hero-scroll-container",
        start: "42% top", // start highlighting when Section 2 begins scrolling up
        end: "68% top",   // complete highlighting before Section 3 starts rising
        scrub: true,      // perfectly matches scroll ticks with zero interpolation delay
      },
      opacity: 1,
      stagger: 0.05,      // tight, progressive stagger for organic flow
      ease: "none",
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <p
      ref={containerRef}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-relaxed max-w-6xl text-center font-display drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] px-8 select-none"
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="reveal-word inline-block mr-[0.25em]"
          style={{ opacity: 0.15, color: "#ffffff" }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
