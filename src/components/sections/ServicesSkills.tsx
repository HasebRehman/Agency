"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type ServiceItem = {
  index: string;
  title: string;
  description: string;
  image: string;
};

const HEADING = {
  title: "Our Services & Skills",
  description:
    "What we bring to every project, from first sketch to shipped product.",
};

const SERVICES: ServiceItem[] = [
  {
    index: "01",
    title: "Web Development",
    description: "Fast, accessible, production-grade builds on modern stacks.",
    image: "/services/webdevelopemnt.avif",
  },
  {
    index: "02",
    title: "UI / UX Design",
    description:
      "Interfaces designed around real user behaviour, not just aesthetics.",
    image: "/services/UI&UX.png",
  },
  {
    index: "03",
    title: "SEO Optimization",
    description:
      "Positioning, naming, and identity systems built to scale with the business.",
    image: "/services/SEO optimization.webp",
  },
  {
    index: "04",
    title: "Cloud-Devops",
    description:
      "Scroll-driven storytelling and micro-interactions that feel intentional.",
    image: "/services/Cloud-Devops.jpg",
  },
];

export default function ServicesSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ScrollTrigger.getById("services-entrance")?.kill();
      ScrollTrigger.getById("services-horizontal")?.kill();
      ScrollTrigger.getById("services-indicator-fade")?.kill();

      if (prefersReducedMotion) {
        gsap.set(track, { clearProps: "all" });
        gsap.set(imageRefs.current.filter(Boolean), { clearProps: "all" });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Entrance: the strip (so effectively the first two visible slides —
        // the intro heading + Web Development) slides into place as the
        // section enters the viewport. No opacity fade here — the cards must
        // stay fully opaque the whole time, or the static heading behind them
        // would briefly show through.
        gsap.fromTo(
          track,
          { yPercent: 4 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              id: "services-entrance",
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );

        // FIX 1: distance must be AT LEAST track.scrollWidth for the last
        // card to fully clear the viewport (track starts flush with the
        // section's left edge, so it must travel its own full width before
        // the last card's right edge passes the left edge of the screen).
        // CLEARANCE_RATIO > 1 adds a bit of extra scroll on top of that full
        // clearance so the centered heading has room to read cleanly before
        // the section unpins.
        const CLEARANCE_RATIO = 1.15;
        const getScrollDistance = () =>
          track.scrollWidth - section.clientWidth * (1 - CLEARANCE_RATIO);

        // Plain, linear, 1:1 scroll-linked horizontal move. No per-card easing,
        // no staggering — the whole joined strip just tracks the scrollbar.
        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            id: "services-horizontal",
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // FIX 2: each image's reveal is now scrubbed directly against the
        // container animation's scroll position (a start->end range) instead
        // of a one-shot toggleActions("play none none reverse") tween.
        // toggleActions + containerAnimation doesn't reliably re-fire the
        // reverse leg on fast/short reverse-scroll gestures. A scrubbed
        // fromTo binds the image's transform to scroll progress directly, so
        // it always tracks correctly whether scrolling forward or backward.
        imageRefs.current.forEach((img, i) => {
          const card = cardRefs.current[i];
          if (!img || !card) return;

          gsap.fromTo(
            img,
            { xPercent: 28, yPercent: 28, opacity: 0 },
            {
              xPercent: 0,
              yPercent: 0,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "left 75%",
                end: "left 35%",
                scrub: true,
              },
            }
          );
        });

        // Indicator: fades out quickly (short scroll distance) once the strip
        // finishes and the section unpins, instead of visibly sliding with the page.
        if (indicatorRef.current) {
          gsap.set(indicatorRef.current, { opacity: 1 });
          gsap.to(indicatorRef.current, {
            opacity: 0,
            ease: "power1.out",
            scrollTrigger: {
              id: "services-indicator-fade",
              trigger: section,
              start: "bottom bottom",
              end: "+=60",
              scrub: true,
            },
          });
        }

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          horizontalTween.scrollTrigger?.kill();
          horizontalTween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  // Hover "ripple" on an image — a quick settle-like scale wobble.
  // Not a literal water drop, just the kind of subtle movement a drop
  // landing on paper would leave behind.
  const handleImageEnter = (i: number) => {
    const img = imageRefs.current[i];
    if (!img) return;
    gsap
      .timeline()
      .to(img, { scale: 1.035, duration: 0.28, ease: "power2.out" })
      .to(img, { scale: 0.985, duration: 0.26, ease: "power1.inOut" })
      .to(img, { scale: 1.008, duration: 0.22, ease: "power1.inOut" })
      .to(img, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <section
      ref={sectionRef}
      data-theme-section="white"
      className="relative z-30 w-full h-screen bg-white overflow-hidden"
    >
      {/* Desktop */}
      <div className="hidden md:block relative w-full h-full">
        {/* Static background — never moves. Only gets uncovered as the track
            (cards) slides fully past it. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-0">
          <h2 className="font-[var(--font-display)] text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-extrabold tracking-tight text-neutral-950 leading-[1.05] max-w-4xl">
            Projects We Have
            <br />
            Worked On
          </h2>
          <p className="text-neutral-500 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mt-6">
            Selected work showcasing our engineering, design, and digital innovation.
          </p>
        </div>

        <div
          ref={indicatorRef}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-3 text-zinc-400 text-xs tracking-[0.25em] font-mono select-none pointer-events-none z-0"
        >
          <span>SCROLL TO EXPLORE PROJECTS</span>
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-zinc-400 to-transparent animate-pulse" />
        </div>

        {/* Sliding track: only the cards (joined, edge-to-edge). Slides fully
            off to the left, uncovering the static background above. */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex h-full w-max z-10"
        >
          {/* Intro slide */}
          <div className="w-[50vw] h-full flex-shrink-0 flex flex-col justify-center px-16 lg:px-24 bg-white border-r border-neutral-200">
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-neutral-900">
              {HEADING.title}
            </h2>
            <p className="mt-6 text-neutral-500 max-w-xs">{HEADING.description}</p>
          </div>

          {SERVICES.map((service, i) => (
            <div
              key={service.index}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-[50vw] h-full flex-shrink-0 flex flex-col bg-neutral-50 border-r border-neutral-200"
            >
              <div className="relative w-full h-[65%] p-8 lg:p-10 bg-neutral-100 overflow-hidden">
                <div
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  onMouseEnter={() => handleImageEnter(i)}
                  className="relative w-full h-full overflow-hidden rounded-xl shadow-sm cursor-pointer"
                >
                  <img
                    src={encodeURI(service.image)}
                    alt={service.title}
                    className="w-full h-full object-contain md:object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-start justify-between gap-6 px-10 lg:px-14 py-8 bg-neutral-50">
                <div>
                  <span className="font-mono text-sm text-sky-600 block mb-2">
                    {service.index}
                  </span>
                  <h3 className="font-[var(--font-display)] text-2xl text-neutral-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 max-w-sm">{service.description}</p>
                </div>

                <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-neutral-400 border-b border-transparent hover:border-sky-600 hover:text-sky-600 transition-colors pb-1 cursor-pointer">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: simple stacked cards, no horizontal scroll animation */}
      <div className="flex flex-col gap-6 px-6 py-16 md:hidden overflow-y-auto h-full">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col justify-center">
          <h2 className="font-[var(--font-display)] text-3xl leading-[1.05] text-neutral-900">
            {HEADING.title}
          </h2>
          <p className="mt-4 text-neutral-500">{HEADING.description}</p>
        </div>

        {SERVICES.map((service) => (
          <div
            key={service.index}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden min-h-[280px] flex flex-col"
          >
            <div className="relative w-full h-[65%] p-6 bg-neutral-100 overflow-hidden">
              <div className="relative w-full h-full overflow-hidden rounded-xl shadow-sm">
                <img
                  src={encodeURI(service.image)}
                  alt={service.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 flex items-start justify-between gap-6 px-6 py-6 bg-neutral-50">
              <div>
                <span className="font-mono text-sm text-sky-600 block mb-2">
                  {service.index}
                </span>
                <h3 className="font-[var(--font-display)] text-xl text-neutral-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-neutral-500">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}