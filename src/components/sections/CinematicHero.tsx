"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PremiumLoader from "./PremiumLoader";

// ─── Custom Iridescent Deformed Shader Material ───
const BlobShader = {
  uniforms: {
    uTime: { value: 0 },
    uDistort: { value: 0.35 },
    uColorCyan: { value: new THREE.Color("#22d3ee") },
    uColorPurple: { value: new THREE.Color("#7c3aed") },
    uColorMagenta: { value: new THREE.Color("#ec4899") },
    uLightPos: { value: new THREE.Vector3(5, 5, 5) }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uDistort;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    // Simplex 3D Noise by Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Local normal for a unit sphere is just normalize(position)
      vec3 norm = normalize(position);
      
      // Construct local tangent space (tangent and bitangent)
      vec3 tangent = vec3(1.0, 0.0, 0.0);
      if (abs(dot(norm, tangent)) > 0.9) {
        tangent = vec3(0.0, 0.0, 1.0);
      }
      vec3 t = normalize(cross(norm, tangent));
      vec3 b = normalize(cross(norm, t));
      
      float epsilon = 0.015;
      
      // Calculate ridge noise to create organic bulges/folds like the reference image
      float noise1 = snoise(position * 1.4 + uTime * 0.5);
      float ridge1 = 1.0 - abs(noise1);
      float noise2 = snoise(position * 2.8 - uTime * 0.9) * 0.12;
      float disp = (ridge1 * 0.35 + noise2);

      // Evaluate nearby positions for numerical normal estimation
      float noiseT1 = snoise((position + t * epsilon) * 1.4 + uTime * 0.5);
      float ridgeT1 = 1.0 - abs(noiseT1);
      float noiseT2 = snoise((position + t * epsilon) * 2.8 - uTime * 0.9) * 0.12;
      float dispT = (ridgeT1 * 0.35 + noiseT2);

      float noiseB1 = snoise((position + b * epsilon) * 1.4 + uTime * 0.5);
      float ridgeB1 = 1.0 - abs(noiseB1);
      float noiseB2 = snoise((position + b * epsilon) * 2.8 - uTime * 0.9) * 0.12;
      float dispB = (ridgeB1 * 0.35 + noiseB2);

      // Displace along surface normals
      vec3 p = position + norm * disp * uDistort;
      
      vec3 normT = normalize(position + t * epsilon);
      vec3 pT = (position + t * epsilon) + normT * dispT * uDistort;
      
      vec3 normB = normalize(position + b * epsilon);
      vec3 pB = (position + b * epsilon) + normB * dispB * uDistort;
      
      // Recalculate normal based on displaced positions
      vec3 newNormal = normalize(cross(pT - p, pB - p));
      vNormal = normalize(normalMatrix * newNormal);
      vPosition = p;
      vDisplacement = disp;
      
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorCyan;
    uniform vec3 uColorPurple;
    uniform vec3 uColorMagenta;
    uniform vec3 uLightPos;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;
    varying float vDisplacement;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // 1. Fresnel term for iridescent rim outline
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
      
      // 2. Diffuse lighting calculations
      vec3 lightDir = normalize(uLightPos - vPosition);
      float diffuse = max(dot(normal, lightDir), 0.0);
      
      // 3. Color gradients
      float yNorm = clamp((vPosition.y + 1.2) / 2.4, 0.0, 1.0);
      vec3 baseMix = mix(uColorPurple, uColorCyan, yNorm);
      
      // Valleys/crevices (low displacement) are painted dark indigo, ridges are bright cyan
      float dispNorm = clamp((vDisplacement + 0.1) / 0.55, 0.0, 1.0);
      vec3 finalBase = mix(uColorPurple * 0.3, baseMix, dispNorm);
      
      // Mix magenta highlight on edges and creases
      finalBase = mix(finalBase, uColorMagenta, fresnel * 0.4 + (1.0 - dispNorm) * 0.2);
      
      // 4. Combine base color with diffuse shading
      vec3 litColor = finalBase * (diffuse * 0.8 + 0.35);
      
      // 5. Apply iridescent Fresnel glow
      vec3 rimColor = mix(uColorCyan, uColorMagenta, fresnel);
      vec3 finalColor = mix(litColor, rimColor, fresnel * 0.85);
      
      // 6. Shiny specular highlight for a wet, glossy coat
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 48.0);
      finalColor += vec3(1.0) * spec * 0.6;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// 3D Blob Component
interface BlobProps {
  scrollProgressRef: React.RefObject<number>;
  scrollVelocityRef: React.RefObject<number>;
}

function Blob({ scrollProgressRef, scrollVelocityRef }: BlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const isMobile = size.width < 768;

  // Accumulators for automatic rotation (Layer 1)
  const autoRotRef = useRef({ x: 0, y: 0, z: 0 });

  // Current values for smooth interpolation
  const currentPos = useRef(new THREE.Vector3(0, isMobile ? -0.4 : -0.2, 0));
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
      // Mobile: Center aligned behind text, moves vertically and scales down slightly
      targetX = 0;
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.08, viewport.height * 0.12, progress);
      targetZ = THREE.MathUtils.lerp(0.0, -0.6, progress);
      targetS = viewport.height * 0.22;
    } else {
      // Desktop: Centered behind text, creates a wave and goes deeper on scroll
      const curveOffset = Math.sin(progress * Math.PI);

      // Slight wave side-drift, but returns centered at both ends (progress 0 & 1)
      targetX = curveOffset * viewport.width * 0.05;
      targetY = THREE.MathUtils.lerp(-viewport.height * 0.05, viewport.height * 0.05, progress) - curveOffset * viewport.height * 0.08;
      targetZ = THREE.MathUtils.lerp(0.0, -0.6, progress) - curveOffset * 2.0; // Recedes deep in 3D during scroll
      targetS = viewport.height * 0.52; // Very large, visually dominant backdrop behind the heading
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
    const velocityOffsetPositionX = normalizedVelocity * -0.2 * viewport.width * 0.1;
    const velocityOffsetY = normalizedVelocity * -0.12 * viewport.height * 0.1;
    const velocityTiltZ = normalizedVelocity * -0.3;
    const velocityTiltX = Math.abs(normalizedVelocity) * 0.15;

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
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uDistort.value = currentDistort.current;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={BlobShader.vertexShader}
          fragmentShader={BlobShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uDistort: { value: 0.35 },
            uColorCyan: { value: new THREE.Color("#22d3ee") },
            uColorPurple: { value: new THREE.Color("#7c3aed") },
            uColorMagenta: { value: new THREE.Color("#ec4899") },
            uLightPos: { value: new THREE.Vector3(5, 5, 5) }
          }}
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

      {/* R3F Canvas Container - placed behind flow elements at z-[2] with bg-transparent */}
      {mounted && (
        <div className="fixed inset-0 w-screen h-screen z-[2] bg-transparent overflow-hidden pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
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
