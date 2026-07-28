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

      // Defensive: kill any stale instances before creating new ones.
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
          end: "+=190%",
          pin: true,
          pinSpacing: true,
          scrub: 2.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // White bars unfold very slowly, gradually, and smoothly
      tl.to(bar1, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.0);
      tl.to(bar1, { scaleY: 0.5, rotateX: -45, duration: 0.15, ease: "power3.out" }, 0.05);
      tl.to(bar1, { scaleY: 1.05, rotateX: 0, duration: 0.15, ease: "power2.inOut" }, 0.2);

      tl.to(bar2, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.18);
      tl.to(bar2, { scaleY: 0.5, rotateX: -45, duration: 0.15, ease: "power3.out" }, 0.23);
      tl.to(bar2, { scaleY: 1.05, rotateX: 0, duration: 0.15, ease: "power2.inOut" }, 0.38);

      tl.to(bar3, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.36);
      tl.to(bar3, { scaleY: 0.5, rotateX: -45, duration: 0.15, ease: "power3.out" }, 0.41);
      tl.to(bar3, { scaleY: 1.05, rotateX: 0, duration: 0.15, ease: "power2.inOut" }, 0.56);

      tl.to(bar4, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.54);
      tl.to(bar4, { scaleY: 0.5, rotateX: -45, duration: 0.15, ease: "power3.out" }, 0.59);
      tl.to(bar4, { scaleY: 1.05, rotateX: 0, duration: 0.15, ease: "power2.inOut" }, 0.74);

      tl.to(bar5, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.72);
      tl.to(bar5, { scaleY: 0.5, rotateX: -45, duration: 0.15, ease: "power3.out" }, 0.77);
      tl.to(bar5, { scaleY: 1.05, rotateX: 0, duration: 0.15, ease: "power2.inOut" }, 0.92);

      // Make container background solid white and reveal About content smoothly
      tl.to(container, { backgroundColor: "#ffffff", duration: 0.01 }, 0.92);
      tl.to(content, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.35, ease: "power2.out" }, 0.93);

      // Smooth exit into Services & Skills (extra hold so the reveal isn't too abrupt)
      tl.to({}, { duration: 0.15 }, 1.0);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      // Explicit cleanup: kill this section's ScrollTrigger (and its pin-spacer)
      // before React unmounts / Fast Refresh remounts the component.
      return () => {
        ScrollTrigger.getById("key-facts-pin")?.kill();
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      id="key-facts-section"
      data-theme-section="white"
      className="relative w-full h-screen overflow-hidden bg-transparent z-20"
      style={{ marginTop: "-100vh" }}
    >
      <div className="absolute inset-0 pointer-events-none z-10" style={{ perspective: "800px" }}>
        <div
          ref={bar5Ref}
          id="hero-white-bar-top"
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
        id="key-facts-content"
        className="absolute inset-0 bg-white flex flex-col justify-center items-center text-center px-6 z-20"
        style={{ willChange: "opacity, transform" }}
      >
        <div className="max-w-5xl w-full flex flex-col items-center">
          <p className="text-sm sm:text-base md:text-lg font-sans font-semibold tracking-[0.15em] uppercase mb-4">
            <span className="text-zinc-950">About</span> <span className="text-sky-400">Curelogics</span>
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] sm:text-6xl md:text-7xl text-zinc-950 mb-4 font-display leading-tight">
            Empowering Healthcare &amp; Businesses
            <br className="hidden sm:block" /> Through IT Solutions
          </h2>
          <p className="text-zinc-500 text-lg sm:text-xl md:text-2xl font-sans font-normal max-w-3xl mb-0">
            At <span className="text-sky-400 font-semibold">Curelogics</span>, we&apos;re your one-stop destination for all your digital needs. From software
            development and design to SEO, marketing, and beyond, we provide comprehensive solutions to
            propel your business forward. With our expertise and dedication, we help you achieve your goals
            and stand out in today&apos;s competitive market.
          </p>
        </div>
      </div>
    </section>
  );
}