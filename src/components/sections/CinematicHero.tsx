"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import PremiumLoader from "./PremiumLoader";

// 3D Blob Component
interface BlobProps {
  scrollProgressRef: React.RefObject<number>;
  scrollVelocityRef: React.RefObject<number>;
}

function Blob({ scrollProgressRef, scrollVelocityRef }: BlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const isMobile = size.width < 768;

  // Accumulators for automatic rotation (Layer 1)
  const autoRotRef = useRef({ x: 0, y: 0, z: 0 });

  // Current values for smooth interpolation
  const currentPos = useRef(new THREE.Vector3(isMobile ? 0 : viewport.width * 0.22, isMobile ? -0.4 : -0.2, 0));
  const currentScale = useRef(new THREE.Vector3(1, 1, 1));
  const currentDistort = useRef(0.35);

  useFrame((state, delta) => {
    // Clamp delta to avoid massive leaps when tab is inactive
    const dt = Math.min(delta, 0.1);

    const progress = scrollProgressRef.current ?? 0;
    const rawVelocity = scrollVelocityRef.current ?? 0;

    // Normalize velocity (pixels per second to range [-1.5, 1.5])
    const normalizedVelocity = Math.max(-1.5, Math.min(1.5, rawVelocity / 1500));

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetS = 1.0;

    if (isMobile) {
      // Mobile: Center aligned, moves down and shrinks on scroll
      targetX = 0;
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.1, viewport.height * 0.15, progress);
      targetZ = THREE.MathUtils.lerp(0.0, -0.8, progress);
      targetS = viewport.height * 0.22; // responsive scale relative to viewport
    } else {
      // Desktop: Start right -> dips middle -> settle left
      const startX = viewport.width * 0.22; // right side
      const endX = -viewport.width * 0.22; // left side
      const startY = -viewport.height * 0.05;
      const endY = viewport.height * 0.1;
      const startZ = 0.0;
      const endZ = -0.5;

      const curveOffset = Math.sin(progress * Math.PI);

      targetX = THREE.MathUtils.lerp(startX, endX, progress);
      targetY = THREE.MathUtils.lerp(startY, endY, progress) - curveOffset * viewport.height * 0.1;
      targetZ = THREE.MathUtils.lerp(startZ, endZ, progress) - curveOffset * 1.8;
      targetS = viewport.height * 0.38; // occupy 38% of viewport height
    }

    // Smoothly interpolate current position and scale toward targets
    const lerpSpeed = 3.5 * dt;
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, lerpSpeed);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, lerpSpeed);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, lerpSpeed);

    const targetScaleVec = new THREE.Vector3(targetS, targetS, targetS);
    currentScale.current.lerp(targetScaleVec, lerpSpeed);

    // Update automatic base rotation (always running)
    autoRotRef.current.x += dt * 0.12;
    autoRotRef.current.y += dt * 0.16;
    autoRotRef.current.z += dt * 0.08;

    // Scroll velocity offsets
    const velocityOffsetPositionX = normalizedVelocity * -0.25 * viewport.width * 0.1;
    const velocityOffsetY = normalizedVelocity * -0.15 * viewport.height * 0.1;
    const velocityTiltZ = normalizedVelocity * -0.4;
    const velocityTiltX = Math.abs(normalizedVelocity) * 0.2;

    // Apply translation to group
    if (groupRef.current) {
      groupRef.current.position.set(
        currentPos.current.x + velocityOffsetPositionX,
        currentPos.current.y + velocityOffsetY,
        currentPos.current.z
      );
      groupRef.current.scale.copy(currentScale.current);
    }

    // Apply combined rotation to mesh
    if (meshRef.current) {
      meshRef.current.rotation.set(
        autoRotRef.current.x + velocityTiltX,
        autoRotRef.current.y,
        autoRotRef.current.z + velocityTiltZ
      );
    }

    // Dynamic morph distortion based on velocity
    const targetDistort = 0.35 + Math.abs(normalizedVelocity) * 0.15;
    currentDistort.current = THREE.MathUtils.lerp(currentDistort.current, targetDistort, 5.0 * dt);

    if (materialRef.current) {
      materialRef.current.distort = currentDistort.current;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#2563eb" // Vibrant brand blue
          roughness={0.25}
          metalness={0.2} // Low metalness for strong diffuse visibility under lighting
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          distort={0.35}
          speed={1.5}
        />
      </mesh>
    </group>
  );
}

export default function CinematicHero() {
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  // Trigger loader transition
  useEffect(() => {
    setMounted(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPreloadProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsReady(true);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleTransitionComplete = () => {
    setIsLoaded(true);
    document.body.classList.add("show-nav");
  };

  // GSAP ScrollTrigger
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      // Pin Section 1 (Hero) for 100vh
      ScrollTrigger.create({
        trigger: "#hero-section",
        pin: true,
        start: "top top",
        end: "+=100%",
        pinSpacing: true,
      });

      // Track scroll progress and velocity of the scroll container
      ScrollTrigger.create({
        trigger: "#hero-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          scrollVelocityRef.current = self.getVelocity();
        },
      });

      // Fade out hero content during scroll
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

      // Fade out scroll indicator
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

      // Section 3 white panel transition
      gsap.fromTo(
        "#white-panel",
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
          },
        }
      );
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [isLoaded]);

  return (
    <>
      {/* Premium Loader Overlay */}
      {!isLoaded && (
        <PremiumLoader
          assetsReady={assetsReady}
          onTransitionComplete={handleTransitionComplete}
        />
      )}

      {/* R3F Canvas Container - placed on top of background stars at z-[2] with bg-transparent */}
      {mounted && (
        <div className="fixed inset-0 w-screen h-screen z-[2] bg-transparent overflow-hidden pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} color="#051025" />
              
              {/* Key blue light */}
              <pointLight position={[10, 10, 10]} intensity={2.5} color="#64CEFB" />
              
              {/* Soft blue-purple fill light */}
              <pointLight position={[-10, -10, -10]} intensity={1.0} color="#1E4D91" />
              
              {/* Crimson Red rim light from back-left */}
              <pointLight position={[-6, 4, -6]} intensity={5.0} color="#ff3344" />
              
              {/* Ambient white spotlight */}
              <directionalLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />

              <Blob
                scrollProgressRef={scrollProgressRef}
                scrollVelocityRef={scrollVelocityRef}
              />
            </Suspense>
          </Canvas>
        </div>
      )}
    </>
  );
}
