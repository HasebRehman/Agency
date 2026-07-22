"use client";

import { useEffect, useState, startTransition } from "react";

export function useDeviceDetect() {
  const [disable3D, setDisable3D] = useState(true); // Default to true for SSR safety
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });

    const checkSpecs = () => {
      // 1. Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // 2. Check viewport size (mobile devices < 768px)
      const isMobile = window.innerWidth < 768;

      // 3. Check hardware concurrency (low-end device detection)
      const isLowPower =
        typeof navigator !== "undefined" &&
        navigator.hardwareConcurrency !== undefined &&
        navigator.hardwareConcurrency < 4;

      // Disable 3D if any condition is met
      startTransition(() => {
        setDisable3D(prefersReducedMotion || isMobile || isLowPower);
      });
    };

    checkSpecs();

    // Re-check on resize in case of window adjustments
    window.addEventListener("resize", checkSpecs);
    return () => window.removeEventListener("resize", checkSpecs);
  }, []);

  return { disable3D: isMounted ? disable3D : true, isMounted };
}
