"use client";

import React, { createContext, useContext, useEffect, useRef, useState, startTransition } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register GSAP ScrollTrigger plugin ONCE globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimationContext = createContext<{ lenis: Lenis | null }>({ lenis: null });

export function useAnimation() {
  return useContext(AnimationContext);
}

export default function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  // State to store Lenis instance so context value updates properly on render
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    startTransition(() => {
      setLenisInstance(lenis);
    });

    // 2. Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 3. Sync GSAP ticker with Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      // Lenis expects milliseconds, GSAP ticker time is in seconds
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);
    
    // Disable lag smoothing for GSAP because Lenis handles scroll easing
    gsap.ticker.lagSmoothing(0);

    // 4. Force ScrollTrigger refresh on mount
    ScrollTrigger.refresh();

    // 5. Synchronize ScrollTrigger refresh events with Lenis resize
    const handleRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Clean up
    return () => {
      gsap.ticker.remove(updateTicker);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.destroy();
      lenisRef.current = null;
      startTransition(() => {
        setLenisInstance(null);
      });
    };
  }, []);

  return (
    <AnimationContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </AnimationContext.Provider>
  );
}
