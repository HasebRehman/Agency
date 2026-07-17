"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * WhiteTransition
 *
 * Architecture:
 * ─────────────────────────────────────────────────────────────────
 * The outer section (#key-facts-section) is PINNED for 250vh of
 * scroll distance. This gives us a long, controlled scrub window:
 *
 *  0%  – 12%   Resistance zone: nothing moves. The page feels
 *               like it has tension before the reveal starts.
 *
 *  12% – 88%   5 white bands scaleY(0 → 1) from the bottom,
 *               each starting ~14% after the previous, so the
 *               cascade is visible and appreciable.
 *
 *  88% – 100%  Section 3 content fades in (opacity + translateY).
 * ─────────────────────────────────────────────────────────────────
 */
export default function WhiteTransition() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const bandsRef      = useRef<HTMLDivElement>(null);
  const band1Ref      = useRef<HTMLDivElement>(null);
  const band2Ref      = useRef<HTMLDivElement>(null);
  const band3Ref      = useRef<HTMLDivElement>(null);
  const band4Ref      = useRef<HTMLDivElement>(null);
  const band5Ref      = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bands   = [band1Ref, band2Ref, band3Ref, band4Ref, band5Ref].map(r => r.current);
    const content = contentRef.current;

    if (!section || bands.some(b => !b) || !content) return;

    // ── Initial states ─────────────────────────────────────────
    // All bands collapsed at scaleY(0), anchored at their bottom edge
    gsap.set(bands, { scaleY: 0, transformOrigin: "bottom center" });
    gsap.set(content, { opacity: 0, y: 30 });

    // ── Master timeline ────────────────────────────────────────
    // scrub: 1.4 gives a slightly weighted / buttery follow
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",          // pin starts the moment section hits viewport top
        end: "+=250%",             // 250vh of scroll real estate for the whole animation
        scrub: 1.4,
        pin: true,
        anticipatePin: 1,          // avoids the brief jump when pin activates
        pinSpacing: true,
      },
    });

    /**
     * Timeline positions (0 → 1):
     *
     *  0.00 ── dead silence (resistance) ──────────────────────
     *  0.12 ── band 1 starts rising ───────────────────────────
     *  0.26 ── band 2 starts rising ───────────────────────────
     *  0.40 ── band 3 starts rising ───────────────────────────
     *  0.54 ── band 4 starts rising ───────────────────────────
     *  0.68 ── band 5 starts rising ───────────────────────────
     *  0.86 ── all bands fully expanded ───────────────────────
     *  0.88 ── content fades in ────────────────────────────────
     *  1.00 ── end ─────────────────────────────────────────────
     *
     * Each band expand-duration = 0.22 (in timeline units).
     * Bands overlap slightly so the wipe feels continuous.
     */

    const BAND_DURATION = 0.22;
    const BAND_STEP     = 0.14; // gap between band starts
    const START_OFFSET  = 0.12; // resistance dead-zone

    bands.forEach((band, i) => {
      tl.to(band, {
        scaleY: 1,
        duration: BAND_DURATION,
        ease: "power2.inOut",
      }, START_OFFSET + i * BAND_STEP);
    });

    // Content reveal — after last band has settled
    tl.to(content, {
      opacity: 1,
      y: 0,
      duration: 0.14,
      ease: "power2.out",
    }, 0.88);

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
      tl.kill();
    };
  }, []);

  /* ── Band heights ────────────────────────────────────────────
   * 5 equal bands × 22vh each = 110vh total.
   * A 10vh gap between them means they're NOT contiguous in the
   * DOM — but since each one scaleY-expands from its bottom edge,
   * and they overlap by the time they're fully expanded, the
   * visual result is a solid white fill.
   *
   * To guarantee a seamless fill we actually tile them with
   * NO gap, using top offsets so band edges align perfectly.
   * Each band = 24vh tall, stacked: 0, 20%, 40%, 60%, 80%
   * (adjusted to cover 100vh when fully expanded).
   * ─────────────────────────────────────────────────────────── */

  const bandStyles: React.CSSProperties[] = [
    { bottom:  "0",   height: "24vh" },   // 1 — lowest
    { bottom: "20vh", height: "24vh" },   // 2
    { bottom: "40vh", height: "24vh" },   // 3
    { bottom: "60vh", height: "24vh" },   // 4
    { bottom: "80vh", height: "24vh" },   // 5 — highest
  ];

  const bandRefs = [band1Ref, band2Ref, band3Ref, band4Ref, band5Ref];

  return (
    <section
      id="key-facts-section"
      ref={sectionRef}
      /* Black bg shows through between bands while they're still expanding */
      className="relative w-full h-screen z-20 bg-[#05070c] overflow-hidden"
    >
      {/* ── Five cascading white bands ── */}
      <div ref={bandsRef} className="absolute inset-0 pointer-events-none">
        {bandStyles.map((style, i) => (
          <div
            key={i}
            ref={bandRefs[i]}
            className="absolute left-0 right-0 bg-white"
            style={{
              ...style,
              willChange: "transform",
              /* scaleY origin is set via GSAP; explicit declaration avoids
                 any browser default overriding it during reflows */
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>

      {/* ── Section 3 content — sits above all bands ── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 bg-white flex flex-col justify-center items-center text-center px-6 overflow-auto"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Main heading */}
        <div className="max-w-5xl w-full flex flex-col items-center">
          <h2 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl text-zinc-950 mb-6 font-display">
            Key facts
          </h2>
          <p className="text-zinc-500 text-lg sm:text-xl md:text-2xl font-light max-w-xl mb-0">
            A snapshot of our experience and impact.
          </p>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-12 w-full mt-24 max-w-4xl border-t border-zinc-200 pt-16">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">
                99%
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                Client Satisfaction
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">
                120+
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                Products Shipped
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">
                10x
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                Deployment Speed
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">
                24/7
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                Systems Monitoring
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
