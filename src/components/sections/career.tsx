"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Resting Y position of the jar once it has settled in view.
// 0 = dead center of the canvas. Negative = lower on screen.
// Shared by the scroll rig (where it animates to) and OrbitControls
// (so cursor-rotation orbits around the jar's actual resting spot).
// Lowered slightly (was -0.5) so the jar no longer pokes up into the
// curved heading above it, then raised again a bit as the jar's own
// size settled — keeps clearance from the team row below.
const REST_Y = -0.75;

/* ============================================================
   3D MODEL — /public/brain_in_a_jar.glb
   Rotates gently forever, independent of scroll.
   ============================================================ */
function BrainJarModel() {
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/brain_in_a_jar.glb");

  // useGLTF caches and SHARES the same scene object across every mount.
  // If we mutate it directly, React Strict Mode's double-effect (or HMR)
  // re-measures an already-scaled object and compounds the scale into a
  // runaway number. Cloning gives each mount its own untouched copy.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Auto-fit: whatever the original export scale/units are, normalize the
  // model to a consistent on-screen size and center it at the origin.
  useEffect(() => {
    if (!model) return;

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 1.65; // desired size in world units — raise/lower to make it bigger/smaller
    const scale = targetSize / maxDim;

    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [model]);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.28; // spin speed
    }
  });

  return (
    <group ref={spinRef}>
      <primitive object={model} />
    </group>
  );
}
useGLTF.preload("/brain_in_a_jar.glb");

/* ============================================================
   SCROLL RIG — moves the model up into its resting position,
   then reveals the heading + team row once it's settled.

   NOTE: intentionally NOT using `pin: true` here. Pinning inserts
   a spacer element that changes document layout/height, which was
   desyncing the scroll math (jar getting stuck off-screen, or
   snapping on resize/devtools-inspect). A single un-pinned,
   scrubbed timeline avoids that entirely and is more robust.
   ============================================================ */
function ScrollBrainRig({
  triggerRef,
  headingRef,
  teamRef,
}: {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  headingRef: React.RefObject<HTMLDivElement | null>;
  teamRef: React.RefObject<HTMLDivElement | null>;
}) {
  const moveRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!moveRef.current || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 95%", // begins as soon as the section starts entering view
          end: "top -30%",  // finishes shortly after the section passes the top
          scrub: 1,
          // markers: true, // uncomment temporarily to debug start/end points
        },
      });

      // Phase 1 (0 -> 0.5 of timeline) — jar rises into its resting spot.
      tl.fromTo(
        moveRef.current!.position,
        { y: -4.2 },
        { y: REST_Y, ease: "power2.out" },
        0
      );

      // Phase 2 (0.5 -> 1 of timeline) — heading + team row fade in
      // together once the jar has essentially arrived, then hold visible.
      tl.fromTo(
        [headingRef.current, teamRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "power2.out" },
        0.5
      );
    });

    // The 3D model loads asynchronously — recalculate trigger positions
    // once it's actually on screen so the scroll math stays accurate.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [triggerRef, headingRef, teamRef]);

  return (
    <group ref={moveRef} position={[0, -4.2, 0]}>
      <BrainJarModel />
    </group>
  );
}

/* ============================================================
   TEAM DATA — edit names/roles here.
   Photos are read from /public/Team/<image>.png — drop your files
   in that folder using these exact names (change the extension in
   TeamMemberCard below if yours aren't .png).
   ============================================================ */
const TEAM_MEMBERS = [
  { name: "Senior Developer", role: "Backend Specialist", image: "snr" },
  { name: "MERN Stack Developer", role: "Web Developer", image: "mern" },
  { name: "Founder & CEO", role: "Curelogics visionary leader", image: "ceo" },
  { name: "Full Stack Developer", role: "Web Developer", image: "web" },
  { name: "UI/UX Designer", role: "Creative Designer", image: "ui" },
];

// Vertical offset (in px, translateY) per card, left to right — this is
// what creates the wave/arc: CEO (center, index 2) sits highest, the
// two members either side of it sit a little lower, and the two on the
// outer edges sit lowest of all. Mirrors the reference screenshot.
// Kept a bit gentler than before so the CEO card doesn't reach up far
// enough to collide with the jar above it.
const TEAM_OFFSETS = [40, 14, 0, 14, 40];

function TeamMemberCard({
  name,
  role,
  image,
  offset,
  isCeo,
}: {
  name: string;
  role: string;
  image: string;
  offset: number;
  isCeo?: boolean;
}) {
  return (
    <div
      className="group flex flex-col items-center text-center"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="relative">
        {/* Glow — hidden by default, fades in and blurs out behind the
            photo on hover. */}
        <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
        <div
          className={`relative ${
            isCeo ? "w-40 h-40 sm:w-48 sm:h-48" : "w-32 h-32 sm:w-36 sm:h-36"
          } rounded-2xl overflow-hidden bg-zinc-200 shadow-md transition-transform duration-300 ease-out group-hover:scale-110`}
        >
          <Image
            src={`/Team/${image}.webp`}
            alt={name}
            fill
            sizes="(max-width: 640px) 128px, 192px"
            className="object-cover"
          />
        </div>
      </div>
      <p className="mt-3 text-sm sm:text-lg font-semibold text-zinc-900">
        {name}
      </p>
      <p className="text-xs sm:text-sm text-zinc-500">{role}</p>
    </div>
  );
}

/* ============================================================
   CURVED HEADING — renders the title along a downward-bending
   arc (like a "C" / dome shape) sitting just above the jar,
   using an SVG <textPath> so the curve is smooth at any width.
   ============================================================ */
function CurvedHeading() {
  return (
    <svg viewBox="-40 0 1800 220" className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id="curelogicsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        {/* Chord length (~1800) is kept comfortably longer than the
            rendered text width at fontSize 42, so nothing clips —
            but the viewBox itself is now sized close to the container's
            actual pixel width, so the text renders large again instead
            of shrinking down. Peaks in the middle, dips at both
            corners — the "C" bend. */}
        <path id="headingArc" d="M -20 190 Q 890 10 1780 190" fill="none" />
      </defs>
      <text
        fontSize="42"
        fontWeight="800"
        letterSpacing="-0.3"
        style={{ fontFamily: "inherit" }}
      >
        <textPath href="#headingArc" startOffset="50%" textAnchor="middle">
          <tspan fill="#18181b">Meet the Brilliant Minds Behind </tspan>
          <tspan fill="url(#curelogicsGradient)">CureLogics&apos; Success</tspan>
        </textPath>
      </text>
    </svg>
  );
}

/* ============================================================
   PAGE — hero section with jar, curved heading, and team row.
   ============================================================ */
export default function CareerPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#f6f5f2] overflow-hidden flex items-center justify-center"
    >
      {/* Curved heading, bending down at the corners like a "C" over the jar */}
      <div
        ref={headingRef}
        className="absolute top-[3%] left-1/2 -translate-x-1/2 z-20 w-full max-w-[1500px] px-4 opacity-0 pointer-events-none"
      >
        <CurvedHeading />
      </div>

      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 40 }}
          dpr={1}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          {/* Canvas defaults to an opaque black background — override it here
              so the light theme actually shows instead of black. */}
          <color attach="background" args={["#f6f5f2"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 5]} intensity={1.3} />
          {/* Metal/glass materials need reflections or they render flat
              black under plain lights. Re-enable once layout is confirmed. */}
          {/* <Environment preset="apartment" resolution={128} /> */}
          <Suspense fallback={null}>
            <ScrollBrainRig triggerRef={sectionRef} headingRef={headingRef} teamRef={teamRef} />
          </Suspense>
          {/* Lets the user click-drag to spin the jar in place. Pan and
              zoom are disabled so it can never be dragged off its spot —
              only rotation is allowed. */}
          <OrbitControls
            target={[0, REST_Y, 0]}
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>

      {/* Team row — sits at the bottom of the section, below the jar.
          CEO in the center, two members on each side, staggered
          vertically to form the same gentle arc as the heading. */}
      <div
        ref={teamRef}
        className="absolute bottom-[3%] left-1/2 -translate-x-1/2 z-20 flex items-end justify-center gap-6 sm:gap-16 md:gap-24 opacity-0"
      >
        {TEAM_MEMBERS.map((member, i) => (
          <TeamMemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            image={member.image}
            offset={TEAM_OFFSETS[i]}
            isCeo={i === 2}
          />
        ))}
      </div>
    </section>
  );
}