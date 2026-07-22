"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PremiumLoader from "./PremiumLoader";

/* ─── Constants ─── */
const TOTAL_FRAMES = 240;
const FOLDER_NAME = "frame_img";
const FILE_PREFIX = "ezgif-frame-";

function getFrameUrl(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/animated_img/${FOLDER_NAME}/${FILE_PREFIX}${padded}.png`;
}

/* ══════════════════════════════════════════════════════════════
   CINEMATIC HERO — Scroll-Controlled Frame Sequence Animation
   ══════════════════════════════════════════════════════════════ */
export default function CinematicHero() {
  /* ─── Refs ─── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const inFlightRef = useRef<Set<number>>(new Set());
  
  const targetFrameIndexRef = useRef<number>(1);
  const lerpedFrameIndexRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);

  /* ─── State ─── */
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  /* ═══════════════════════════════════════
     1. IMAGE LOADER HELPER
     ═══════════════════════════════════════ */
  const loadFrame = (index: number): Promise<void> => {
    if (loadedFramesRef.current.has(index)) {
      return Promise.resolve();
    }
    if (inFlightRef.current.has(index)) {
      return Promise.resolve();
    }

    inFlightRef.current.add(index);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameUrl(index);
      
      // Asynchronously decode the image to avoid blocking the main thread
      img.decode()
        .then(() => {
          cacheRef.current.set(index, img);
          loadedFramesRef.current.add(index);
          inFlightRef.current.delete(index);
          resolve();
        })
        .catch(() => {
          // Fallback to standard onload for backward compatibility
          img.onload = () => {
            cacheRef.current.set(index, img);
            loadedFramesRef.current.add(index);
            inFlightRef.current.delete(index);
            resolve();
          };
          img.onerror = () => {
            inFlightRef.current.delete(index);
            resolve(); // Resolve to not block queue
          };
        });
    });
  };

  /* ═══════════════════════════════════════
     2. PRIORITIZE FRAMES ON SCROLL
     ═══════════════════════════════════════ */
  const prioritizeFrames = (centerFrame: number) => {
    const WINDOW_SIZE = 15; // Load 15 frames ahead and behind
    const start = Math.max(1, centerFrame - WINDOW_SIZE);
    const end = Math.min(TOTAL_FRAMES, centerFrame + WINDOW_SIZE);
    
    for (let i = start; i <= end; i++) {
      if (!loadedFramesRef.current.has(i) && !inFlightRef.current.has(i)) {
        loadFrame(i);
      }
    }
  };

  /* ═══════════════════════════════════════
     3. BACKGROUND PRELOAD REMAINDER
     ═══════════════════════════════════════ */
  const startBackgroundPreload = () => {
    const remaining: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!loadedFramesRef.current.has(i)) {
        remaining.push(i);
      }
    }

    let index = 0;
    const loadNextIdle = () => {
      if (index >= remaining.length) return;
      
      const frameToLoad = remaining[index];
      index++;
      
      const scheduler: (cb: () => void) => void =
        typeof window !== "undefined" && "requestIdleCallback" in window
          ? (cb) => window.requestIdleCallback(cb)
          : (cb) => setTimeout(cb, 50);
        
      scheduler(() => {
        loadFrame(frameToLoad).then(() => {
          loadNextIdle();
        });
      });
    };
    
    loadNextIdle();
  };

  /* ═══════════════════════════════════════
     4. PRELOAD BASELINE FRAMES (PHASE 1)
     ═══════════════════════════════════════ */
  useEffect(() => {
    const BASELINE_INTERVAL = 8;
    const baselineFrames: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += BASELINE_INTERVAL) {
      baselineFrames.push(i);
    }
    if (baselineFrames[baselineFrames.length - 1] !== TOTAL_FRAMES) {
      baselineFrames.push(TOTAL_FRAMES);
    }

    let loadedCount = 0;
    const totalBaseline = baselineFrames.length;

    baselineFrames.forEach(async (index) => {
      await loadFrame(index);
      loadedCount++;
      setPreloadProgress(Math.round((loadedCount / totalBaseline) * 100));
      
      if (loadedCount === totalBaseline) {
        setAssetsReady(true);
        // Start background preloading for high-framerate scroll
        startBackgroundPreload();
      }
    });
  }, []);

  const handleTransitionComplete = () => {
    setIsLoaded(true);
    document.body.classList.add("show-nav");
  };

  /* ═══════════════════════════════════════
     5. FIT IMAGE COVER MATH
     ═══════════════════════════════════════ */
  const drawImageProp = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number
  ) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = (w - nw) * 0.5;
    const cy = (h - nh) * 0.5;
    ctx.drawImage(img, cx, cy, nw, nh);
  };

  /* ═══════════════════════════════════════
     6. NEAREST-NEIGHBOR RESOLVING
     ═══════════════════════════════════════ */
  const findNearestLoadedFrame = (index: number): HTMLImageElement | undefined => {
    let minDiff = Infinity;
    let nearestIndex = -1;
    
    for (const loadedIndex of loadedFramesRef.current) {
      const diff = Math.abs(loadedIndex - index);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = loadedIndex;
      }
    }
    
    if (nearestIndex !== -1) {
      return cacheRef.current.get(nearestIndex);
    }
    
    return undefined;
  };

  /* ═══════════════════════════════════════
     7. DRAW FRAME ON CANVAS
     ═══════════════════════════════════════ */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = cacheRef.current.get(index);
    
    if (!img || !loadedFramesRef.current.has(index)) {
      img = findNearestLoadedFrame(index);
    }

    if (img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageProp(ctx, img, canvas.width, canvas.height);
      lastDrawnFrameRef.current = index;
    }
  };

  /* ═══════════════════════════════════════
     8. CANVAS RESIZE HANDLER
     ═══════════════════════════════════════ */
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      if (isLoaded) {
        drawFrame(Math.round(lerpedFrameIndexRef.current));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded]);

  /* ═══════════════════════════════════════
     9. FRAME INTERPOLATION LOOP (RAF)
     ═══════════════════════════════════════ */
  useEffect(() => {
    if (!isLoaded) return;
    
    let animationFrameId: number;
    
    const render = () => {
      const target = targetFrameIndexRef.current;
      const current = lerpedFrameIndexRef.current;
      
      const diff = target - current;
      if (Math.abs(diff) > 0.01) {
        lerpedFrameIndexRef.current = current + diff * 0.12; // buttery smooth lerp
      } else {
        lerpedFrameIndexRef.current = target;
      }
      
      const activeFrame = Math.round(lerpedFrameIndexRef.current);
      
      if (activeFrame !== lastDrawnFrameRef.current) {
        drawFrame(activeFrame);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

  /* ═══════════════════════════════════════
     10. GSAP SCROLLTRIGGER PIN & SYNC
     ═══════════════════════════════════════ */
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      // Pin Section 1 (Hero) for 100vh of scroll distance
      ScrollTrigger.create({
        trigger: "#hero-section",
        pin: true,
        start: "top top",
        end: "+=100%",
        pinSpacing: true,
      });

      // Map scroll progress of container (Hero pinned + About) to frame indexes
      ScrollTrigger.create({
        trigger: "#hero-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Map 0-1 progress to 1-TOTAL_FRAMES
          const targetFrame = Math.round(1 + p * (TOTAL_FRAMES - 1));
          targetFrameIndexRef.current = targetFrame;
          
          prioritizeFrames(targetFrame);
        },
      });

      // Fade out hero content during the first half of pinning
      gsap.to("#hero-content", {
        scrollTrigger: {
          trigger: "#hero-scroll-container",
          start: "top top",
          end: "40% top",
          scrub: true,
        },
        opacity: 0,
        y: -60,
      });

      // Fade out scroll indicator early
      gsap.to("#hero-scroll-indicator", {
        scrollTrigger: {
          trigger: "#hero-scroll-container",
          start: "top top",
          end: "15% top",
          scrub: true,
        },
        opacity: 0,
        y: 30,
      });

      // Premium card expansion and reveal for Section 3 white panel
      gsap.fromTo("#white-panel",
        {
          y: 160,
          scale: 0.98,
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
          opacity: 0.9,
        },
        {
          y: 0,
          scale: 1.0,
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          opacity: 1.0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: "#key-facts-section",
            start: "top bottom",
            end: "top 10%",
            scrub: true,
          }
        }
      );
    });

    // Refresh ScrollTrigger calculations after pinning is initialized
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [isLoaded]);

  /* ═══════════════════════════════════════
     RENDER LOADER + CANVAS
     ═══════════════════════════════════════ */
  return (
    <>
      {/* Premium Loader Overlay */}
      {!isLoaded && (
        <PremiumLoader
          assetsReady={assetsReady}
          onTransitionComplete={handleTransitionComplete}
        />
      )}

      {/* Main Canvas Container */}
      <div className="fixed inset-0 w-screen h-screen z-0 bg-black overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </>
  );
}

