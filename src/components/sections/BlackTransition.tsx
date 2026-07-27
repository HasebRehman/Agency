"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function BlackTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const bar3Ref = useRef<HTMLDivElement>(null);
  const bar4Ref = useRef<HTMLDivElement>(null);
  const bar5Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const bar1 = bar1Ref.current;
      const bar2 = bar2Ref.current;
      const bar3 = bar3Ref.current;
      const bar4 = bar4Ref.current;
      const bar5 = bar5Ref.current;

      if (!container || !bar1 || !bar2 || !bar3 || !bar4 || !bar5) return;

      ScrollTrigger.getById("bt-pin")?.kill();

      gsap.set([bar1, bar2, bar3, bar4, bar5], {
        scaleY: 0,
        rotateX: 0,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "bt-pin",
          trigger: container,
          start: "top top",
          end: "+=60%",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Exact same animation pattern as WhiteTransition — each bar flips open separately
      tl.to(bar1, { scaleY: 0.005, duration: 0.02, ease: "none" }, 0.0);
      tl.to(bar1, { scaleY: 0.5,   rotateX: -60, duration: 0.08, ease: "power2.out"   }, 0.02);
      tl.to(bar1, { scaleY: 1.05,  rotateX: 0,   duration: 0.08, ease: "power2.inOut" }, 0.10);

      tl.to(bar2, { scaleY: 0.005, duration: 0.02, ease: "none" }, 0.10);
      tl.to(bar2, { scaleY: 0.5,   rotateX: -60, duration: 0.08, ease: "power2.out"   }, 0.12);
      tl.to(bar2, { scaleY: 1.05,  rotateX: 0,   duration: 0.08, ease: "power2.inOut" }, 0.20);

      tl.to(bar3, { scaleY: 0.005, duration: 0.02, ease: "none" }, 0.20);
      tl.to(bar3, { scaleY: 0.5,   rotateX: -60, duration: 0.08, ease: "power2.out"   }, 0.22);
      tl.to(bar3, { scaleY: 1.05,  rotateX: 0,   duration: 0.08, ease: "power2.inOut" }, 0.30);

      tl.to(bar4, { scaleY: 0.005, duration: 0.02, ease: "none" }, 0.30);
      tl.to(bar4, { scaleY: 0.5,   rotateX: -60, duration: 0.08, ease: "power2.out"   }, 0.32);
      tl.to(bar4, { scaleY: 1.05,  rotateX: 0,   duration: 0.08, ease: "power2.inOut" }, 0.40);

      tl.to(bar5, { scaleY: 0.005, duration: 0.02, ease: "none" }, 0.40);
      tl.to(bar5, { scaleY: 0.5,   rotateX: -60, duration: 0.08, ease: "power2.out"   }, 0.42);
      tl.to(bar5, { scaleY: 1.05,  rotateX: 0,   duration: 0.08, ease: "power2.inOut" }, 0.50);

      // Hold full black screen so user sees it before next section
      tl.to({}, { duration: 0.35 }, 0.55);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      id="bt-section"
     className="relative w-full h-screen overflow-hidden bg-white z-40 -mt-[13vh]"
    >
      <div className="absolute inset-0 z-10" style={{ perspective: "800px" }}>
        {/* Bar 5 — top strip (rises LAST) */}
        <div
          ref={bar5Ref}
          className="absolute left-0 right-0 top-0 bg-black"
          style={{ height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        {/* Bar 4 */}
        <div
          ref={bar4Ref}
          className="absolute left-0 right-0 bg-black"
          style={{ top: "20vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        {/* Bar 3 — middle */}
        <div
          ref={bar3Ref}
          className="absolute left-0 right-0 bg-black"
          style={{ top: "40vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        {/* Bar 2 */}
        <div
          ref={bar2Ref}
          className="absolute left-0 right-0 bg-black"
          style={{ top: "60vh", height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
        {/* Bar 1 — bottom strip (rises FIRST) */}
        <div
          ref={bar1Ref}
          className="absolute left-0 right-0 bottom-0 bg-black"
          style={{ height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
      </div>
    </section>
  );
}