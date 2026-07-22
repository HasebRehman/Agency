"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function WhiteTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const bar3Ref = useRef<HTMLDivElement>(null);
  const bar4Ref = useRef<HTMLDivElement>(null);
  const bar5Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const bar1 = bar1Ref.current;
      const bar2 = bar2Ref.current;
      const bar3 = bar3Ref.current;
      const bar4 = bar4Ref.current;
      const bar5 = bar5Ref.current;
      const content = contentRef.current;

      if (!container || !bar1 || !bar2 || !bar3 || !bar4 || !bar5 || !content) return;

      // Defensive: kill any stale instance with this id before creating a new one.
      ScrollTrigger.getById("key-facts-pin")?.kill();

      gsap.set([bar1, bar2, bar3, bar4, bar5], {
        scaleY: 0,
        rotateX: 0,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      });
      gsap.set(content, { opacity: 0, y: 30, pointerEvents: "none" });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "key-facts-pin",
          trigger: container,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(bar1, { scaleY: 0.005, rotateX: 0, duration: 0.05, ease: "none" }, 0.15);
      tl.to(bar1, { scaleY: 0.5, rotateX: -60, duration: 0.1, ease: "power2.out" }, 0.2);
      tl.to(bar1, { scaleY: 1.05, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.3);

      tl.to(bar2, { scaleY: 0.005, rotateX: 0, duration: 0.05, ease: "none" }, 0.29);
      tl.to(bar2, { scaleY: 0.5, rotateX: -60, duration: 0.1, ease: "power2.out" }, 0.34);
      tl.to(bar2, { scaleY: 1.05, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.44);

      tl.to(bar3, { scaleY: 0.005, rotateX: 0, duration: 0.05, ease: "none" }, 0.43);
      tl.to(bar3, { scaleY: 0.5, rotateX: -60, duration: 0.1, ease: "power2.out" }, 0.48);
      tl.to(bar3, { scaleY: 1.05, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.58);

      tl.to(bar4, { scaleY: 0.005, rotateX: 0, duration: 0.05, ease: "none" }, 0.57);
      tl.to(bar4, { scaleY: 0.5, rotateX: -60, duration: 0.1, ease: "power2.out" }, 0.62);
      tl.to(bar4, { scaleY: 1.05, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.72);

      tl.to(bar5, { scaleY: 0.005, rotateX: 0, duration: 0.05, ease: "none" }, 0.71);
      tl.to(bar5, { scaleY: 0.5, rotateX: -60, duration: 0.1, ease: "power2.out" }, 0.76);
      tl.to(bar5, { scaleY: 1.05, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.86);

      tl.to(content, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.1, ease: "power2.out" }, 0.95);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      id="key-facts-section"
      className="relative w-full h-screen overflow-hidden bg-transparent z-20"
    >
      <div className="absolute inset-0 pointer-events-none z-10" style={{ perspective: "800px" }}>
        <div
          ref={bar5Ref}
          className="absolute left-0 right-0 top-0 bg-white"
          style={{ height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        <div
          ref={bar4Ref}
          className="absolute left-0 right-0 bg-white"
          style={{ top: "20vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        <div
          ref={bar3Ref}
          className="absolute left-0 right-0 bg-white"
          style={{ top: "40vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        <div
          ref={bar2Ref}
          className="absolute left-0 right-0 bg-white"
          style={{ top: "60vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        <div
          ref={bar1Ref}
          className="absolute left-0 right-0 bottom-0 bg-white"
          style={{ height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
      </div>

      <div
        ref={contentRef}
        className="absolute inset-0 bg-white flex flex-col justify-center items-center text-center px-6 z-20"
        style={{ willChange: "opacity, transform" }}
      >
        <div className="max-w-5xl w-full flex flex-col items-center">
          <h2 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl text-zinc-950 mb-6 font-display">
            Key facts
          </h2>
          <p className="text-zinc-500 text-lg sm:text-xl md:text-2xl font-light max-w-xl mb-0">
            A snapshot of our experience and impact.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full mt-24 max-w-5xl border-t border-zinc-200 pt-16">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">99%</span>
              <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Client Satisfaction</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">120+</span>
              <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Products Shipped</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">10x</span>
              <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Deployment Speed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black leading-none">24/7</span>
              <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Systems Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}