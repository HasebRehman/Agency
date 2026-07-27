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
      const projectsSection = document.getElementById("projects-section");

      if (!container || !bar1 || !bar2 || !bar3 || !bar4 || !bar5 || !projectsSection) return;

      ScrollTrigger.getById("bt-pin")?.kill();

      // All bars start invisible
      gsap.set([bar1, bar2, bar3, bar4, bar5], {
        scaleY: 0,
        rotateX: 0,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "bt-pin",
          trigger: projectsSection,
          start: "bottom bottom",
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          scrub: 2.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // EXACT 3-stage bar unfold sequence directly over Projects section
      // Stage 1: thin line appears   (scaleY: 0.005)
      // Stage 2: tilt & grow         (scaleY: 0.5, rotateX: -45)
      // Stage 3: lock flat in place  (scaleY: 1.05, rotateX: 0)

      tl.to(bar1, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.0);
      tl.to(bar1, { scaleY: 0.5,   rotateX: -45, duration: 0.15, ease: "power3.out"  }, 0.05);
      tl.to(bar1, { scaleY: 1.05,  rotateX: 0,   duration: 0.15, ease: "power2.inOut"}, 0.20);

      tl.to(bar2, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.18);
      tl.to(bar2, { scaleY: 0.5,   rotateX: -45, duration: 0.15, ease: "power3.out"  }, 0.23);
      tl.to(bar2, { scaleY: 1.05,  rotateX: 0,   duration: 0.15, ease: "power2.inOut"}, 0.38);

      tl.to(bar3, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.36);
      tl.to(bar3, { scaleY: 0.5,   rotateX: -45, duration: 0.15, ease: "power3.out"  }, 0.41);
      tl.to(bar3, { scaleY: 1.05,  rotateX: 0,   duration: 0.15, ease: "power2.inOut"}, 0.56);

      tl.to(bar4, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.54);
      tl.to(bar4, { scaleY: 0.5,   rotateX: -45, duration: 0.15, ease: "power3.out"  }, 0.59);
      tl.to(bar4, { scaleY: 1.05,  rotateX: 0,   duration: 0.15, ease: "power2.inOut"}, 0.74);

      tl.to(bar5, { scaleY: 0.005, duration: 0.05, ease: "none" }, 0.72);
      tl.to(bar5, { scaleY: 0.5,   rotateX: -45, duration: 0.15, ease: "power3.out"  }, 0.77);
      tl.to(bar5, { scaleY: 1.05,  rotateX: 0,   duration: 0.15, ease: "power2.inOut"}, 0.92);

      // Hold full black screen briefly
      tl.to({}, { duration: 0.10 }, 0.93);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div
      ref={containerRef}
      id="bt-section"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-50 overflow-hidden"
    >
      {/* Perspective container for the 5 black bars */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ perspective: "800px" }}>
        {/* Bar 5 — top strip (unfolds LAST) */}
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
        {/* Bar 1 — bottom strip (unfolds FIRST) */}
        <div
          ref={bar1Ref}
          className="absolute left-0 right-0 bottom-0 bg-black"
          style={{ height: "20.5vh", transformOrigin: "center center", willChange: "transform", transformStyle: "preserve-3d" }}
        />
      </div>
    </div>
  );
}