"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleExploreNow = () => {
    // Save current scroll position so we can restore it when coming back
    sessionStorage.setItem("curelogics_scroll_y", String(window.scrollY));

    const cta = ctaRef.current;
    if (cta) {
      gsap.to(cta, {
        opacity: 0,
        y: -20,
        scale: 0.96,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          router.push("/projects");
        },
      });
    } else {
      router.push("/projects");
    }
  };

  // Always show only the first 4 projects on the homepage
  const visibleProjects = projects.slice(0, 4);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Kill any leftover ScrollTrigger instances tied to this container
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && container.contains(st.trigger as Node)) {
          st.kill();
        }
      });

      const rows = container.querySelectorAll<HTMLDivElement>(".project-row");

      const setupRowAnimations = () => {
        rows.forEach((row, i) => {
          const leftEl = row.querySelector<HTMLElement>(".slide-left");
          const rightEl = row.querySelector<HTMLElement>(".slide-right");
          const fromRight = i % 2 === 0;

          const rowRect = row.getBoundingClientRect();
          const alreadyInView = rowRect.top < window.innerHeight * 0.85;

          const initial = {
            opacity: 0,
            rotateY: fromRight ? 45 : -45,
            rotateX: 8,
            x: fromRight ? 140 : -140,
            scale: 0.85,
            transformPerspective: 1000,
          };

          const settled = {
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            x: 0,
            scale: 1,
          };

          if (leftEl) gsap.set(leftEl, alreadyInView ? settled : initial);
          if (rightEl) gsap.set(rightEl, alreadyInView ? settled : initial);

          if (alreadyInView) return;

          const targets = [leftEl, rightEl].filter(Boolean) as HTMLElement[];
          if (targets.length === 0) return;

          gsap.to(targets, {
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            x: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top -30%",
              toggleActions: "play reverse play reverse",
            },
          });
        });
      };

      setupRowAnimations();

      const images = container.querySelectorAll("img");
      let pending = images.length;
      if (pending === 0) {
        ScrollTrigger.refresh();
      } else {
        images.forEach((img) => {
          if (img.complete) {
            pending -= 1;
            if (pending === 0) ScrollTrigger.refresh();
          } else {
            img.addEventListener(
              "load",
              () => {
                pending -= 1;
                if (pending === 0) ScrollTrigger.refresh();
              },
              { once: true }
            );
          }
        });
      }
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      id="projects-section"
      data-theme-section="white"
      className="relative z-40 w-full bg-white pb-28 pt-12 px-6 md:px-16 flex flex-col items-center justify-start text-neutral-900 overflow-hidden"
    >
      <div ref={containerRef} className="max-w-6xl w-full flex flex-col items-center text-center gap-24">
        {visibleProjects.map((project, index) => {
          const isEven = index % 2 === 1; // 2nd, 4th... project => image on left
          const hasLink = Boolean(project.link);

          return (
            <div
              key={project.title}
              className="project-row grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center text-left"
              style={{ perspective: "1200px" }}
            >
              {/* ===== INFO BLOCK ===== */}
              <div
                className={`${isEven ? "md:order-2 slide-right" : "md:order-1 slide-left"} flex flex-col justify-center`}
              >
                <span className="font-mono text-xs uppercase tracking-widest text-sky-600 mb-3 block">
                  {project.tag}
                </span>
                <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl text-neutral-900 font-semibold mb-4">
                  {project.title}
                </h3>
                <p className="text-neutral-500 text-sm sm:text-base mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {hasLink ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-sky-600 transition-colors flex items-center gap-1"
                  >
                    View Project{" "}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                ) : (
                  <span
                    className="w-fit text-xs uppercase tracking-widest font-semibold text-neutral-400 flex items-center gap-1 opacity-50 cursor-not-allowed select-none"
                    aria-disabled="true"
                  >
                    Coming Soon
                  </span>
                )}
              </div>

              {/* ===== IMAGE BLOCK ===== */}
              <div
                className={`${isEven ? "md:order-1 slide-left" : "md:order-2 slide-right"} relative rounded-3xl border border-neutral-200 bg-neutral-50 min-h-[320px] md:min-h-[380px] overflow-hidden group transition-all duration-500 ease-out hover:shadow-[0_0_35px_rgba(0,0,0,0.08)] hover:border-neutral-300`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/25 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-white/0 group-hover:bg-white/15 rounded-full blur-2xl transition-all duration-500" />
                <img
                  src={project.image}
                  alt={project.title}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    gsap.killTweensOf(target);
                    gsap
                      .timeline()
                      .to(target, { scale: 1.035, duration: 0.18, ease: "power2.out" })
                      .to(target, { scale: 0.985, duration: 0.16, ease: "power2.inOut" })
                      .to(target, { scale: 1.008, duration: 0.14, ease: "power2.inOut" })
                      .to(target, { scale: 1, duration: 0.18, ease: "power2.out" });
                  }}
                  onMouseLeave={(e) => {
                    gsap.killTweensOf(e.currentTarget);
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" });
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* "Explore More" CTA — navigates to /projects page with exit animation */}
      <div
        ref={ctaRef}
        className="mt-24 w-full max-w-2xl flex flex-col items-center text-center rounded-3xl border border-neutral-200 bg-neutral-50 px-8 py-14"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-sky-600 mb-3 block">
          There's More to Explore
        </span>
        <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl text-neutral-900 font-semibold mb-4">
          Discover More Projects
        </h3>
        <p className="text-neutral-500 text-sm sm:text-base mb-8 max-w-md">
          From AI solutions and healthcare platforms to trading systems and eCommerce experiences, explore a broader collection of projects we've designed and developed.
        </p>
        <button
          onClick={handleExploreNow}
          className="text-xs uppercase tracking-widest font-semibold text-white bg-neutral-900 hover:bg-sky-600 transition-colors rounded-full px-8 py-3"
        >
          Explore Now
        </button>
      </div>
    </section>
  );
}
