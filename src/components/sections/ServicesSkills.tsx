"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type CardBase = {
  type: "heading" | "service";
  title: string;
  description: string;
};

type HeadingCard = CardBase & { type: "heading" };
type ServiceCard = CardBase & { type: "service"; index: string; image: string };
type Card = HeadingCard | ServiceCard;

const CARDS: Card[] = [
  {
    type: "heading",
    title: "Our Services & Skills",
    description:
      "What we bring to every project, from first sketch to shipped product.",
  },
  {
    type: "service",
    index: "01",
    title: "Web Development",
    description: "Fast, accessible, production-grade builds on modern stacks.",
    image: "/services/webdevelopemnt.avif",
  },
  {
    type: "service",
    index: "02",
    title: "UI / UX Design",
    description:
      "Interfaces designed around real user behaviour, not just aesthetics.",
    image: "/services/UI&UX.png",
  },
  {
    type: "service",
    index: "03",
    title: "SEO Optimization",
    description:
      "Positioning, naming, and identity systems built to scale with the business.",
    image: "/services/SEO optimization.webp",
  },
  {
    type: "service",
    index: "04",
    title: "Cloud-Devops",
    description:
      "Scroll-driven storytelling and micro-interactions that feel intentional.",
    image: "/services/Cloud-Devops.jpg",
  },
];

export default function ServicesSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ScrollTrigger.getById("services-entrance")?.kill();
      ScrollTrigger.getById("services-pin")?.kill();

      if (prefersReducedMotion) {
        gsap.set(cardRefs.current.filter(Boolean), { clearProps: "all" });
        return;
      }

      // ── Entrance: slides + fades the section into place as it
      // approaches the top of the viewport, ending exactly where the
      // pin below begins. Scroll-linked (not time-based), so it tracks
      // correctly no matter how fast the user scrolls.
      gsap.fromTo(
        contentRef.current,
        { yPercent: 6, opacity: 0.4 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            id: "services-entrance",
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = cardRefs.current.filter(
          (el): el is HTMLDivElement => el !== null
        );
        if (cards.length < 2) return;

        // ── All positions are in xPercent/yPercent (relative to each
        // card's OWN size, i.e. 50% of the screen). This removes any
        // dependency on measuring pixel widths — no race condition with
        // layout/paint timing, which was causing the overlap bug.
        const ENTER_X = 130; // % of one card-width to the right, for waiting cards
        const ENTER_Y = 45; // % of card height, lower, for waiting cards
        const EXIT_X = -130; // % of one card-width to the left, on exit

        gsap.set(cards[0], { xPercent: 0, yPercent: 0, opacity: 1 });
        gsap.set(cards[1], { xPercent: 100, yPercent: 0, opacity: 1 });
        for (let i = 2; i < cards.length; i++) {
          gsap.set(cards[i], { xPercent: ENTER_X, yPercent: ENTER_Y, opacity: 0 });
        }

        const steps = cards.length - 1; // 4 transitions
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "services-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=130%",
            scrub: 1,
            pin: true,
            // Parent <main> is display:flex — GSAP auto-disables pinSpacing
            // in flex containers, which broke this section's scroll math.
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < steps; i++) {
          const leaving = cards[i];
          const shifting = cards[i + 1];
          const entering = cards[i + 2];

          tl.to(leaving, { xPercent: EXIT_X, opacity: 0, duration: 1, ease: "power2.inOut" }, i)
            .to(shifting, { xPercent: 0, yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, i);

          if (entering) {
            tl.to(
              entering,
              { xPercent: 100, yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
              i
            );
          }
        }
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full h-screen bg-white overflow-hidden"
    >
      <div ref={contentRef} className="relative w-full h-full">
        <div ref={stageRef} className="relative hidden md:block w-full h-full">
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`absolute top-0 left-0 w-1/2 h-full bg-white ${
                i % 2 === 0 ? "border-r border-neutral-200" : ""
              }`}
            >
              <ServiceCardContent card={card} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 px-6 py-16 md:hidden">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden min-h-[280px] flex flex-col"
            >
              <ServiceCardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCardContent({ card }: { card: Card }) {
  if (card.type === "heading") {
    return (
      <div className="h-full flex flex-col justify-center px-16 lg:px-24">
        <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-neutral-900">
          {card.title}
        </h2>
        <p className="mt-6 text-neutral-500 max-w-xs">{card.description}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Image ke around padding + background — frame jaisa look */}
      <div className="relative w-full h-[65%] p-8 lg:p-10 bg-neutral-100">
        <div className="relative w-full h-full overflow-hidden rounded-xl shadow-sm">
          <img
            src={encodeURI(card.image)}
            alt={card.title}
            className="w-full h-full object-contain md:object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-between gap-6 px-10 lg:px-14 py-8">
        <div>
          <span className="font-mono text-sm text-sky-600 block mb-2">
            {card.index}
          </span>
          <h3 className="font-[var(--font-display)] text-2xl text-neutral-900 mb-2">
            {card.title}
          </h3>
          <p className="text-neutral-500 max-w-sm">{card.description}</p>
        </div>

        <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-neutral-400 border-b border-transparent hover:border-sky-600 hover:text-sky-600 transition-colors pb-1 cursor-pointer">
          Explore →
        </span>
      </div>
    </div>
  );
}
