"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import loaderIcon from "@/logo/favicon-white-bg.png";

interface PremiumLoaderProps {
  assetsReady: boolean;
  onTransitionComplete: () => void;
}

export default function PremiumLoader({
  assetsReady,
  onTransitionComplete,
}: PremiumLoaderProps) {
  const [introDone, setIntroDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIntroDone(true);
        },
      });

      // 1. Draw border lines of the box clockwise (dashoffset 880 to 0)
      tl.fromTo(
        "#border-path",
        { strokeDashoffset: 880 },
        { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" },
        0
      );

      // 2. Fade in corner plus signs (+) when the line reaches them
      tl.to("#corner-plus-tl", { opacity: 0.8, scale: 1, duration: 0.15 }, 0);
      tl.to("#corner-plus-tr", { opacity: 0.8, scale: 1, duration: 0.15 }, 0.44); // ~27% of 1.6s
      tl.to("#corner-plus-br", { opacity: 0.8, scale: 1, duration: 0.15 }, 0.8);  // ~50% of 1.6s
      tl.to("#corner-plus-bl", { opacity: 0.8, scale: 1, duration: 0.15 }, 1.24); // ~77% of 1.6s
      tl.to("#corner-plus-tl-close", { opacity: 0.8, scale: 1, duration: 0.15 }, 1.6);

      // 3. Fade in text "INSPIRE · INNOVATE · IMPACT"
      tl.fromTo(
        "#loader-text",
        { opacity: 0, y: 8 },
        { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" },
        0.7
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 4. Trigger background dark expansion once intro is done and assets are fully preloaded
  useEffect(() => {
    if (assetsReady && introDone) {
      const ctx = gsap.context(() => {
        const expandTl = gsap.timeline({
          onComplete: () => {
            onTransitionComplete();
          },
        });

        // Immediately fade out the lines, corners, text, and loader icon container
        expandTl.to(
          ["#border-path", "#corner-plus-signs", "#loader-text", "#loader-icon-container"],
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          0
        );

        // Expand the dark container from behind the logo box to cover the screen
        expandTl.to(
          "#dark-expander",
          {
            scale: 25,
            borderRadius: "0px",
            duration: 1.2,
            ease: "power4.inOut",
          },
          0
        );

        // Fade out the main loader overlay wrapper
        expandTl.to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [assetsReady, introDone, onTransitionComplete]);

  return (
    <div
      ref={containerRef}
      id="loader-wrapper"
      className="fixed inset-0 w-screen h-screen z-50 bg-[#f3f4f6] flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* The Dark Expander that expands from behind the logo box */}
      <div
        id="dark-expander"
        className="absolute bg-black rounded-[16px] pointer-events-none scale-0"
        style={{
          width: "240px",
          height: "200px",
          transformOrigin: "center center",
          zIndex: 1,
        }}
      />

      {/* Centered Logo Box (no mix-blend-mode difference, dark charcoal color for borders and text) */}
      <div
        id="logo-box"
        className="relative flex flex-col items-center justify-center p-8"
        style={{
          width: "240px",
          height: "200px",
          zIndex: 2,
          color: "#111827",
        }}
      >
        {/* Clockwise Border Path SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 240 200"
          fill="none"
        >
          {/* Border Box Path */}
          <path
            id="border-path"
            d="M 0 0 L 240 0 L 240 200 L 0 200 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="880"
            strokeDashoffset="880"
          />

          {/* Corner Plus Signs (+) */}
          <g id="corner-plus-signs">
            <g id="corner-plus-tl" opacity="0">
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="currentColor" strokeWidth="1.5" />
            </g>
            <g id="corner-plus-tr" opacity="0" transform="translate(240, 0)">
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="currentColor" strokeWidth="1.5" />
            </g>
            <g id="corner-plus-br" opacity="0" transform="translate(240, 200)">
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="currentColor" strokeWidth="1.5" />
            </g>
            <g id="corner-plus-bl" opacity="0" transform="translate(0, 200)">
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="currentColor" strokeWidth="1.5" />
            </g>
            <g id="corner-plus-tl-close" opacity="0">
              <path d="M-5,0 L5,0 M0,-5 L0,5" stroke="currentColor" strokeWidth="1.5" />
            </g>
          </g>
        </svg>

        {/* Agency Icon (Centered, solid from the start, original colors) */}
        <div
          id="loader-icon-container"
          className="relative flex items-center justify-center mb-6 mt-[-6px] w-[64px] h-[64px] overflow-hidden"
        >
          <Image
            src={loaderIcon}
            alt="CureLogics Loader Icon"
            width={64}
            height={64}
            priority
            className="object-contain max-h-[64px] w-auto select-none pointer-events-none"
          />
        </div>

        {/* Muted Subtitle Text */}
        <div
          id="loader-text"
          className="text-[9px] font-sans font-medium tracking-[0.25em] text-center"
          style={{ letterSpacing: "0.25em" }}
        >
          INSPIRE · INNOVATE · IMPACT
        </div>
      </div>
    </div>
  );
}
