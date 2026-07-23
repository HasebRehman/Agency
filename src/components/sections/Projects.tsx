"use client";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

type Project = {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  link: string;
};

const projects: Project[] = [
  {
    tag: "Featured Project",
    title: "COTD.AI – AI-Powered Trading Intelligence Platform",
    description:
      "Developed COTD.AI, an AI-powered trading intelligence platform delivering 10K+ daily sentiment signals for global traders. Implemented full-stack architecture using React for frontend and Nest.js/Node.js for backend. Integrated blockchain for secure transaction tracking and real-time WebSocket APIs for live market data. Built AI models using TensorFlow and Python to generate trading signals, optimized database performance with MongoDB and PostgreSQL, and deployed scalable serverless functions on AWS Lambda.",
    stack: [
      "React.js",
      "Nest.js",
      "Node.js",
      "Blockchain",
      "Netlify",
      "TypeScript",
      "AWS Lambda",
      "MongoDB",
      "WebSockets",
      "REST APIs",
      "Docker",
      "GraphQL",
      "TensorFlow",
      "Python",
      "Redis",
      "PostgreSQL",
      "Jest",
    ],
    image: "/projects/1st.png",
    link: "https://cotd.ai/",
  },
  {
    tag: "Featured Project",
    title: "HIMS – Hospital Information Management System",
    description:
      "Developed the HIMS project using MERN technologies, encompassing both front-end and back-end development. Implemented modules for appointments, insurance, financial reporting, access configuration, employees, OPD, IPD, pathology, radiology, pharmacy, and blood bank management. Ensured seamless user experience and efficient data handling by integrating robust APIs and optimizing database performance.",
    stack: [
      "Node.js",
      "MongoDB",
      "Express.js",
      "AWS S3",
      "AWS EC2",
      "Microsoft Azure",
      "Docker",
      "Next.js",
      "SQL Server",
      "TypeScript",
      "Nest.js",
      "Memcached",
      "ElasticSearch",
      "Lambda Functions",
      "React.js",
      "Google Extensions",
    ],
    image: "/projects/2nd.png",
    link: "https://pakhims.com/login",
  },
  {
    tag: "Featured Project",
    title: "Sportecolytics – Sports Sustainability Dashboard",
    description:
      "Developed Sportecolytics, a comprehensive dashboard that enables sports organizations to track, analyze, and reduce over 100K tons of CO₂ emissions annually. Implemented the frontend using React and Next.js with responsive, interactive charts powered by Chart.js and D3.js. Built backend services with Node.js and Supabase for secure user authentication, real-time data management, and optimized database queries. Deployed the platform on Vercel for high performance and scalability.",
    stack: [
      "React.js",
      "Next.js",
      "Node.js",
      "Supabase",
      "Vercel",
      "TypeScript",
      "PostgreSQL",
      "REST APIs",
      "Chart.js",
      "D3.js",
      "Docker",
      "AWS S3",
      "Jest",
      "Tailwind CSS",
      "Redux",
    ],
    image: "/projects/3rd.png",
    link: "https://www.sportecolytics.com/",
  },
  {
    tag: "Featured Project",
    title: "TapMeSaveMe – NFC-based eCommerce Platform",
    description:
      "Developed TapMeSaveMe, an NFC-based eCommerce platform that enables seamless shopping experiences and powers over 50K product scans monthly. Integrated Shopify for product management and Firebase for authentication, real-time database updates, and analytics tracking. Built a responsive and modern frontend using Next.js and React.js, ensuring smooth user interactions across devices. Implemented secure payment flows, order tracking, and analytics dashboards.",
    stack: [
      "Next.js",
      "React.js",
      "Firebase",
      "Shopify API",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
      "Firestore",
      "Vercel",
      "Docker",
    ],
    image: "/projects/4th.png",
    link: "https://www.tapmesaveme.com/",
  }, 
];

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const rows = container.querySelectorAll<HTMLDivElement>(".project-row");

      rows.forEach((row) => {
        const leftEl = row.querySelector(".slide-left");
        const rightEl = row.querySelector(".slide-right");

        // Explicitly reset to the hidden/offset state first. If this
        // page was cached (rather than fully unmounted) by client-side
        // navigation, the elements may still be sitting at their
        // already-played state from last time — this guarantees they
        // start hidden again so the animation actually has something to
        // play when you scroll back into view.
        if (leftEl) gsap.set(leftEl, { opacity: 0, x: -80 });
        if (rightEl) gsap.set(rightEl, { opacity: 0, x: 80 });

        if (leftEl) {
          gsap.to(leftEl, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              // Play once when scrolling down into view. Nothing
              // happens on scroll-up (no reverse).
              toggleActions: "play none none none",
            },
          });
        }

        if (rightEl) {
          gsap.to(rightEl, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      // Images load asynchronously and change each row's height/position
      // after ScrollTrigger has already measured the page. Refresh once
      // everything (including images) has finished loading so trigger
      // positions stay accurate.
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
    // Re-running on pathname change makes sure that if this component
    // survives a client-side route change (rather than unmounting), the
    // reveal animation still replays each time you land back on this page.
    { scope: containerRef, dependencies: [pathname] }
  );

  return (
    <section
      ref={containerRef}
      id="projects-section"
      data-theme-section="white"
      className="relative z-40 w-full bg-white pb-28 pt-12 px-6 md:px-16 flex flex-col items-center justify-start text-neutral-900 overflow-hidden"
    >
      <div className="max-w-6xl w-full flex flex-col items-center text-center gap-24">
        {projects.map((project, index) => {
          const isEven = index % 2 === 1; // 2nd, 4th... project => image on left

          return (
            <div
              key={project.title}
              className="project-row grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center text-left"
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
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-sky-600 transition-colors flex items-center gap-1"
                >
                  View Project <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              {/* ===== IMAGE BLOCK ===== */}
              <div
                className={`${isEven ? "md:order-1 slide-left" : "md:order-2 slide-right"} relative rounded-3xl border border-neutral-200 bg-neutral-50 min-h-[320px] md:min-h-[380px] overflow-hidden group transition-all duration-500 ease-out hover:shadow-[0_0_35px_rgba(0,0,0,0.08)] hover:border-neutral-300`}
              >
                {/* Ambient glow that softly brightens on hover — white, not blue */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/25 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                {/* Underglow that appears from the bottom on hover — soft white, kept subtle */}
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
                    // If the mouse leaves mid-sequence, ease straight back
                    // to normal instead of letting the timeline finish.
                    gsap.killTweensOf(e.currentTarget);
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" });
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}