"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

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

  const handleBackHome = () => {
    window.scroll(0, 0);
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-4 flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-sky-600 transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <span className="text-xs font-mono text-neutral-400 tracking-widest uppercase">
            All Projects
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <section
        data-theme-section="white"
        className="w-full bg-white pb-28 pt-12 px-6 md:px-16 flex flex-col items-center justify-start text-neutral-900 overflow-hidden"
      >
        <div className="mb-16 text-center max-w-2xl">
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl text-neutral-900 font-semibold mb-4">
            More Projects
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            A deeper look at the work we've shipped across trading, healthcare, AI agents, and eCommerce.
          </p>
        </div>

        <div ref={containerRef} className="max-w-6xl w-full flex flex-col items-center text-center gap-24">
          {projects.slice(4).map((project, index) => {
            const isEven = index % 2 === 1;
            const hasLink = Boolean(project.link);

            return (
              <div
                key={project.title}
                className="project-row grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center text-left"
                style={{ perspective: "1200px" }}
              >
                {/* INFO BLOCK */}
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

                {/* IMAGE BLOCK */}
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

        {/* Bottom back navigation */}
        <div className="mt-24">
          <button
            onClick={handleBackHome}
            className="text-xs uppercase tracking-widest font-semibold text-white bg-neutral-900 hover:bg-sky-600 transition-colors rounded-full px-8 py-3"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
