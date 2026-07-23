"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PremiumLoader from "./PremiumLoader";

// ─── Custom Iridescent Shader for Torus Knot ───
const KnotShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorCyan;
    uniform vec3 uColorPurple;
    uniform vec3 uColorMagenta;
    uniform vec3 uLightPos;
    uniform float uTime;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // 1. Fresnel term for iridescent rim glow
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
      
      // 2. Diffuse shading from light source
      vec3 lightDir = normalize(uLightPos - vPosition);
      float diffuse = max(dot(normal, lightDir), 0.0);
      
      // 3. Dynamic color blending
      // Creates a moving wave across coordinates to animate color gradients along the knot
      float flow = sin(vPosition.x * 2.0 + vPosition.y * 2.0 + uTime * 1.2) * 0.5 + 0.5;
      vec3 baseMix = mix(uColorPurple, uColorCyan, flow);
      
      // Blend magenta highlights on the edges
      vec3 finalBase = mix(baseMix, uColorMagenta, fresnel * 0.5);
      
      // 4. Combine base color with diffuse shading
      vec3 litColor = finalBase * (diffuse * 0.85 + 0.3);
      
      // 5. Add iridescent Fresnel rim glow
      vec3 rimColor = mix(uColorCyan, uColorMagenta, fresnel);
      vec3 finalColor = mix(litColor, rimColor, fresnel * 0.85);
      
      // 6. Specular highlights for polished glass/chrome finish
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
      finalColor += vec3(1.0) * spec * 0.7;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// ─── Nested Planetary/Gyro Tech Visual Assembly ───
interface VisualProps {
  scrollProgressRef: React.RefObject<number>;
  scrollVelocityRef: React.RefObject<number>;
}

function AgencyVisual({ scrollProgressRef, scrollVelocityRef }: VisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const smallKnotRef = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);
  
  const knotMatRef = useRef<THREE.ShaderMaterial>(null);
  const smallKnotMatRef = useRef<THREE.ShaderMaterial>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const isMobile = size.width < 768;

  // Accumulators for automatic rotation (Layer 1)
  const autoRotRef = useRef({ x: 0, y: 0, z: 0 });

  // Current values for smooth interpolation (Layer 3 - Ultra Smooth Damping)
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentScale = useRef(new THREE.Vector3(0.1, 0.1, 0.1));

  // Individual components' local positions and scales for deconstructed scroll movement
  const currentGridPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentGridScale = useRef(new THREE.Vector3(1, 1, 1));

  const currentRingPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentRingScale = useRef(new THREE.Vector3(1, 1, 1));

  const currentKnotPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentCorePos = useRef(new THREE.Vector3(0, 0, 0));

  // Auxiliary elements' local positions
  const currentOctaPos = useRef(new THREE.Vector3(-0.8, 0.5, -0.4));
  const currentSmallKnotPos = useRef(new THREE.Vector3(0.9, -0.5, -0.5));
  const currentSatellitePos = useRef(new THREE.Vector3(-0.5, -0.6, -0.3));

  // Smooth lerp accumulators for scroll-driven rotations (Direction & Spin changes)
  const scrollRotKnot = useRef(new THREE.Vector3(0, 0, 0));
  const scrollRotRing = useRef(new THREE.Vector2(0, 0));
  const scrollRotGrid = useRef(0);
  const scrollRotOcta = useRef(new THREE.Vector2(0, 0));
  const scrollRotSmallKnot = useRef(new THREE.Vector2(0, 0));

  const isInitialized = useRef(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    const progress = scrollProgressRef.current ?? 0;
    const rawVelocity = scrollVelocityRef.current ?? 0;

    // Normalize velocity (pixels/second to range [-1.5, 1.5])
    const normalizedVelocity = Math.max(-1.5, Math.min(1.5, rawVelocity / 1500));

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetS = 1.0;

    const curveOffset = Math.sin(progress * Math.PI);

    if (isMobile) {
      // Mobile positioning: centered, moves up/down slightly
      targetX = 0;
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.05, viewport.height * 0.08, progress);
      targetZ = THREE.MathUtils.lerp(0.0, -0.5, progress);
      targetS = viewport.height * 0.28;
    } else {
      // Desktop positioning: centered backdrop behind text
      targetX = curveOffset * viewport.width * 0.04;
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.05, viewport.height * 0.04, progress) - curveOffset * viewport.height * 0.06;
      targetZ = THREE.MathUtils.lerp(0.0, -0.5, progress) - curveOffset * 2.0; // Recedes deep in 3D during scroll
      targetS = viewport.height * 0.42; // occupies ~42% of viewport height
    }

    if (!isInitialized.current) {
      currentPos.current.set(targetX, targetY, targetZ);
      currentScale.current.set(targetS, targetS, targetS);
      isInitialized.current = true;
    }

    const lerpSpeed = 2.2 * dt;
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, lerpSpeed);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, lerpSpeed);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, lerpSpeed);

    const targetScaleVec = new THREE.Vector3(targetS, targetS, targetS);
    currentScale.current.lerp(targetScaleVec, lerpSpeed);

    // ─── DECONSTRUCTED / SEPARATED MOVEMENTS ON SCROLL ───
    const targetGridX = progress * 0.7;
    const targetGridY = progress * 0.4;
    const targetGridZ = progress * -0.5;
    const targetGridS = 1.0 + progress * 0.25;

    currentGridPos.current.x = THREE.MathUtils.lerp(currentGridPos.current.x, targetGridX, lerpSpeed);
    currentGridPos.current.y = THREE.MathUtils.lerp(currentGridPos.current.y, targetGridY, lerpSpeed);
    currentGridPos.current.z = THREE.MathUtils.lerp(currentGridPos.current.z, targetGridZ, lerpSpeed);
    currentGridScale.current.set(targetGridS, targetGridS, targetGridS);

    const targetRingX = progress * -0.5;
    const targetRingY = progress * -0.7;
    const targetRingZ = progress * 0.3;
    const targetRingS = 1.0 + progress * 0.15;

    currentRingPos.current.x = THREE.MathUtils.lerp(currentRingPos.current.x, targetRingX, lerpSpeed);
    currentRingPos.current.y = THREE.MathUtils.lerp(currentRingPos.current.y, targetRingY, lerpSpeed);
    currentRingPos.current.z = THREE.MathUtils.lerp(currentRingPos.current.z, targetRingZ, lerpSpeed);
    currentRingScale.current.set(targetRingS, targetRingS, targetRingS);

    const targetKnotX = progress * -0.15;
    const targetKnotY = progress * 0.1;
    const targetKnotZ = progress * 0.15;

    currentKnotPos.current.x = THREE.MathUtils.lerp(currentKnotPos.current.x, targetKnotX, lerpSpeed);
    currentKnotPos.current.y = THREE.MathUtils.lerp(currentKnotPos.current.y, targetKnotY, lerpSpeed);
    currentKnotPos.current.z = THREE.MathUtils.lerp(currentKnotPos.current.z, targetKnotZ, lerpSpeed);

    const targetCoreX = progress * 0.25;
    const targetCoreY = progress * -0.25;
    const targetCoreZ = progress * -0.25;

    currentCorePos.current.x = THREE.MathUtils.lerp(currentCorePos.current.x, targetCoreX, lerpSpeed);
    currentCorePos.current.y = THREE.MathUtils.lerp(currentCorePos.current.y, targetCoreY, lerpSpeed);
    currentCorePos.current.z = THREE.MathUtils.lerp(currentCorePos.current.z, targetCoreZ, lerpSpeed);

    const targetOctaX = THREE.MathUtils.lerp(-0.8, 0.8, progress);
    const targetOctaY = THREE.MathUtils.lerp(0.5, -0.6, progress);
    const targetOctaZ = THREE.MathUtils.lerp(-0.4, -1.2, progress);

    currentOctaPos.current.x = THREE.MathUtils.lerp(currentOctaPos.current.x, targetOctaX, lerpSpeed);
    currentOctaPos.current.y = THREE.MathUtils.lerp(currentOctaPos.current.y, targetOctaY, lerpSpeed);
    currentOctaPos.current.z = THREE.MathUtils.lerp(currentOctaPos.current.z, targetOctaZ, lerpSpeed);

    const targetSmallKnotX = THREE.MathUtils.lerp(0.9, -0.9, progress);
    const targetSmallKnotY = THREE.MathUtils.lerp(-0.5, 0.5, progress);
    const targetSmallKnotZ = THREE.MathUtils.lerp(-0.5, -1.0, progress);

    currentSmallKnotPos.current.x = THREE.MathUtils.lerp(currentSmallKnotPos.current.x, targetSmallKnotX, lerpSpeed);
    currentSmallKnotPos.current.y = THREE.MathUtils.lerp(currentSmallKnotPos.current.y, targetSmallKnotY, lerpSpeed);
    currentSmallKnotPos.current.z = THREE.MathUtils.lerp(currentSmallKnotPos.current.z, targetSmallKnotZ, lerpSpeed);

    const targetSatelliteX = THREE.MathUtils.lerp(-0.5, 0.6, progress);
    const targetSatelliteY = THREE.MathUtils.lerp(-0.6, 0.7, progress);
    const targetSatelliteZ = THREE.MathUtils.lerp(-0.3, -0.8, progress);

    currentSatellitePos.current.x = THREE.MathUtils.lerp(currentSatellitePos.current.x, targetSatelliteX, lerpSpeed);
    currentSatellitePos.current.y = THREE.MathUtils.lerp(currentSatellitePos.current.y, targetSatelliteY, lerpSpeed);
    currentSatellitePos.current.z = THREE.MathUtils.lerp(currentSatellitePos.current.z, targetSatelliteZ, lerpSpeed);

    // ─── SCROLL-DRIVEN ROTATIONS ───
    const targetKnotRotX = progress * Math.PI * 1.2;
    const targetKnotRotY = progress * -Math.PI * 1.5;
    const targetKnotRotZ = progress * Math.PI * 0.8;

    const targetRingRotX = progress * -Math.PI * 0.5;
    const targetRingRotY = progress * Math.PI * 2.0;

    const targetGridRotY = progress * -Math.PI * 1.0;

    const targetOctaRotX = progress * Math.PI * 1.5;
    const targetOctaRotY = progress * -Math.PI * 1.0;

    const targetSmallKnotRotX = progress * -Math.PI * 2.0;
    const targetSmallKnotRotY = progress * Math.PI * 1.5;

    scrollRotKnot.current.x = THREE.MathUtils.lerp(scrollRotKnot.current.x, targetKnotRotX, lerpSpeed);
    scrollRotKnot.current.y = THREE.MathUtils.lerp(scrollRotKnot.current.y, targetKnotRotY, lerpSpeed);
    scrollRotKnot.current.z = THREE.MathUtils.lerp(scrollRotKnot.current.z, targetKnotRotZ, lerpSpeed);

    scrollRotRing.current.x = THREE.MathUtils.lerp(scrollRotRing.current.x, targetRingRotX, lerpSpeed);
    scrollRotRing.current.y = THREE.MathUtils.lerp(scrollRotRing.current.y, targetRingRotY, lerpSpeed);

    scrollRotGrid.current = THREE.MathUtils.lerp(scrollRotGrid.current, targetGridRotY, lerpSpeed);

    scrollRotOcta.current.x = THREE.MathUtils.lerp(scrollRotOcta.current.x, targetOctaRotX, lerpSpeed);
    scrollRotOcta.current.y = THREE.MathUtils.lerp(scrollRotOcta.current.y, targetOctaRotY, lerpSpeed);

    scrollRotSmallKnot.current.x = THREE.MathUtils.lerp(scrollRotSmallKnot.current.x, targetSmallKnotRotX, lerpSpeed);
    scrollRotSmallKnot.current.y = THREE.MathUtils.lerp(scrollRotSmallKnot.current.y, targetSmallKnotRotY, lerpSpeed);

    autoRotRef.current.x += dt * 0.15;
    autoRotRef.current.y += dt * 0.2;
    autoRotRef.current.z += dt * 0.1;

    const velocityOffsetPositionX = normalizedVelocity * -0.15 * viewport.width * 0.1;
    const velocityOffsetY = normalizedVelocity * -0.1 * viewport.height * 0.1;
    const velocityTiltZ = normalizedVelocity * -0.3;
    const velocityTiltX = Math.abs(normalizedVelocity) * 0.12;

    if (groupRef.current) {
      groupRef.current.position.set(
        currentPos.current.x + velocityOffsetPositionX,
        currentPos.current.y + velocityOffsetY,
        currentPos.current.z
      );
      groupRef.current.scale.copy(currentScale.current);
    }

    if (knotRef.current) {
      knotRef.current.rotation.set(
        autoRotRef.current.x * 0.6 + scrollRotKnot.current.x + velocityTiltX,
        autoRotRef.current.y * 0.8 + scrollRotKnot.current.y,
        autoRotRef.current.z * 0.4 + scrollRotKnot.current.z + velocityTiltZ
      );
    }

    if (ringRef.current) {
      const ringVelocitySpin = normalizedVelocity * 3.0;
      ringRef.current.rotation.set(
        Math.PI / 4 + scrollRotRing.current.x,
        autoRotRef.current.y * 1.8 + scrollRotRing.current.y + ringVelocitySpin,
        autoRotRef.current.x * 0.5
      );
    }

    if (gridRef.current) {
      gridRef.current.rotation.set(
        -autoRotRef.current.x * 0.3,
        -autoRotRef.current.y * 0.3 + scrollRotGrid.current,
        -autoRotRef.current.z * 0.2
      );
    }

    if (octaRef.current) {
      octaRef.current.rotation.set(
        autoRotRef.current.x * 1.2 + scrollRotOcta.current.x,
        autoRotRef.current.y * 1.0 + scrollRotOcta.current.y,
        autoRotRef.current.z * 0.8
      );
    }

    if (smallKnotRef.current) {
      smallKnotRef.current.rotation.set(
        autoRotRef.current.x * 0.5 + scrollRotSmallKnot.current.x,
        autoRotRef.current.y * 1.2 + scrollRotSmallKnot.current.y,
        autoRotRef.current.z * 0.6
      );
    }

    if (satelliteRef.current) {
      satelliteRef.current.rotation.set(
        autoRotRef.current.x,
        autoRotRef.current.y,
        autoRotRef.current.z
      );
    }

    if (knotMatRef.current) {
      knotMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (smallKnotMatRef.current) {
      smallKnotMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Technical outer wireframe cage (Cyan) */}
      <mesh ref={gridRef} position={currentGridPos.current} scale={currentGridScale.current}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* 2. Orbiting Gyro Ring (metallic magenta) */}
      <mesh ref={ringRef} position={currentRingPos.current} scale={currentRingScale.current}>
        <torusGeometry args={[1.15, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ec4899"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* 3. Central Torus Knot (iridescent glass/chrome) */}
      <mesh ref={knotRef} position={currentKnotPos.current}>
        <torusKnotGeometry args={[0.55, 0.18, 150, 16]} />
        <shaderMaterial
          ref={knotMatRef}
          vertexShader={KnotShader.vertexShader}
          fragmentShader={KnotShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColorCyan: { value: new THREE.Color("#22d3ee") },
            uColorPurple: { value: new THREE.Color("#7c3aed") },
            uColorMagenta: { value: new THREE.Color("#ec4899") },
            uLightPos: { value: new THREE.Vector3(5, 5, 5) }
          }}
        />
      </mesh>

      {/* 4. Glowing inner core sphere */}
      <mesh ref={coreRef} position={currentCorePos.current}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
        />
      </mesh>

      {/* 5. Auxiliary Glossy Octahedron */}
      <mesh ref={octaRef} position={currentOctaPos.current}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color="#db2777"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* 6. Auxiliary Small Torus Knot */}
      <mesh ref={smallKnotRef} position={currentSmallKnotPos.current}>
        <torusKnotGeometry args={[0.16, 0.04, 64, 8, 3, 4]} />
        <shaderMaterial
          ref={smallKnotMatRef}
          vertexShader={KnotShader.vertexShader}
          fragmentShader={KnotShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uColorCyan: { value: new THREE.Color("#38bdf8") },
            uColorPurple: { value: new THREE.Color("#4f46e5") },
            uColorMagenta: { value: new THREE.Color("#d946ef") },
            uLightPos: { value: new THREE.Vector3(5, 5, 5) }
          }}
        />
      </mesh>

      {/* 7. Auxiliary Glass Satellite Sphere */}
      <mesh ref={satelliteRef} position={currentSatellitePos.current}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// ─── Floating 3D Volumetric Balls Component (Replaces 2D background canvas stars) ───
function FloatingBalls() {
  const count = 75;
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const viewport = useThree((state) => state.viewport);

  // Initialize random speed, color, scale, and start positions for 3D balls
  const ballsData = useRef(
    Array.from({ length: count }, () => {
      const colors = ["#22d3ee", "#7c3aed", "#ec4899", "#ffffff"];
      return {
        speed: 1.0 + Math.random() * 2.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.04 + Math.random() * 0.12,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          -Math.random() * 10
        )
      };
    })
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Subtle pointer parallax steering
    const mouseX = state.pointer.x * viewport.width * 0.12;
    const mouseY = state.pointer.y * viewport.height * 0.12;
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, -mouseX, 2.0 * dt);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -mouseY, 2.0 * dt);
    }

    // Move each 3D sphere forward along Z axis
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = ballsData.current[i];

      data.pos.z += dt * data.speed;

      // Recycle if it goes past camera viewport depth
      if (data.pos.z > 2.0) {
        data.pos.z = -10.0;
        data.pos.x = (Math.random() - 0.5) * viewport.width * 2.5;
        data.pos.y = (Math.random() - 0.5) * viewport.height * 2.5;
      }

      mesh.position.copy(data.pos);
    });
  });

  return (
    <group ref={groupRef}>
      {ballsData.current.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          scale={[data.scale, data.scale, data.scale]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={data.color}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
      ))}
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

      {/* R3F Canvas Container - placed behind flow elements at z-[2] with bg-transparent */}
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

              <AgencyVisual
                scrollProgressRef={scrollProgressRef}
                scrollVelocityRef={scrollVelocityRef}
              />

              <FloatingBalls />
            </Suspense>
          </Canvas>
        </div>
      )}
    </>
  );
}
