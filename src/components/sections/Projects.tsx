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
  {
    tag: "Featured Project",
    title: "videotest.testrtc.com",
    description:
      "WebRTC testing tool for real-time video and audio quality checks, enabling 10K+ monthly test sessions with detailed performance metrics and diagnostics.",
    stack: ["React", "Node.js", "WebRTC", "AWS", "TypeScript"],
    image: "/projects/5.png",
    link: "https://videotest.testrtc.com/",
  },
  {
    tag: "Featured Project",
    title: "orijin.io",
    description:
      "Agriculture platform for farm management, digital payments, and EUDR compliance, supporting 100K+ farm records and... transactions with real-time insights.",
    stack: ["Express.js", "React", "Node.js", "MongoDB", "TypeScript"],
    image: "/projects/6.png",
    link: "https://orijin.io/",
  },
  {
    tag: "Featured Project",
    title: "AI Markdown Editor",
    description:
      "Collaborative WYSIWYG Markdown editor with AI integration, enabling seamless real-time editing for 5K+ concurrent users and... intelligent content suggestions.",
    stack: ["Tiptap", "Yjs", "Next.js", "RAG", "Hocus Pocus"],
    image: "/projects/7.png",
    link: "",
  },
  {
    tag: "Featured Project",
    title: "hellosenseai.com",
    description:
      "AI receptionist for small businesses, handling 1M+ customer calls and message monthly with automated scheduling,... messaging, and CRM integration.",
    stack: ["Lovable", "Supabase", "FastAPI", "Next.js", "VAPI"],
    image: "/projects/8.png",
    link: "https://hellosenseai.com/",
  },
  {
    tag: "Featured Project",
    title: "AI Voice Chatbot/Agent",
    description:
      "Automated AI voice assistant for financial institutions, processing 100K+ voice queries monthly with natural speech synthesis and... advanced workflows.",
    stack: ["Node.js", "VAPI", "n8n", "ElevenLabs", "SDKs", "RAG"],
    image: "/projects/9.png",
    link: "",
  },
  {
    tag: "Featured Project",
    title: "docus.ai",
    description:
      "Medical AI platform offering health assistant, AI doctor, and lab test interpretation, serving 500K+ patients... worldwide with secure, scalable infrastructure.",
    stack: ["Next.js", "Node.js", "Vercel", "AI Integrations"],
    image: "/projects/10.png",
    link: "https://docus.ai/",
  },
  {
    tag: "Featured Project",
    title: "qiyas.pro",
    description:
      "Quiz platform with multilingual support and admin dashboards, powering 50K+ quizzes completed monthly with real-time analytic... and user management.",
    stack: ["Loveable", "Next.js", "Supabase", "Vercel", "TypeScript"],
    image: "/projects/11.png",
    link: "https://qiyas.pro/landing",
  },
  {
    tag: "Featured Project",
    title: "Crypto Arbitrage Bot",
    description:
      "Low-latency trading bot executing 1K+ daily arbitrage trades with MetaMask/Phantom login, real-time order book syncing, and... adaptive cross-exchange strategies.",
    stack: ["Node.js", "Express.js", "Socket.IO", "CCXT Pro"],
    image: "/projects/12.png",
    link: "",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Kill any leftover ScrollTrigger instances tied to this container
      // from a previous mount/run. Without this, if the component
      // survives a client-side route change (rather than fully
      // unmounting), old triggers stack up on top of new ones and their
      // "start" positions get calculated incorrectly — which is why the
      // reveal animation can silently stop firing on repeat visits.
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && container.contains(st.trigger as Node)) {
          st.kill();
        }
      });

      const rows = container.querySelectorAll<HTMLDivElement>(".project-row");

      // Sets up (or re-sets-up) the reveal animation for every row.
      // Pulled into a function so both the initial run and the
      // pageshow/back-navigation handler below can reuse the exact same
      // logic.
      const setupRowAnimations = () => {
        rows.forEach((row) => {
          const leftEl = row.querySelector<HTMLElement>(".slide-left");
          const rightEl = row.querySelector<HTMLElement>(".slide-right");

          // KEY FIX: if the browser has restored a scroll position where
          // this row is already inside (or above) its trigger zone —
          // which happens when you navigate back to this page and the
          // scroll position is restored to where you left off — a
          // ScrollTrigger created with start "top 80%" will NEVER fire,
          // because it only fires on a future scroll crossing that line.
          // If we still reset such a row to opacity:0, it stays invisible
          // forever. So: check each element's current position first —
          // already past its reveal point => show it immediately instead
          // of hiding it and waiting for a scroll event that won't come.
          const rowRect = row.getBoundingClientRect();
          const alreadyInView = rowRect.top < window.innerHeight * 0.8;

          if (leftEl) {
            gsap.set(leftEl, alreadyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 });
          }
          if (rightEl) {
            gsap.set(rightEl, alreadyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 });
          }

          // Only rows that are NOT already in view get a ScrollTrigger —
          // they'll animate in normally as the user scrolls down to them.
          if (!alreadyInView) {
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
          }
        });
      };

      setupRowAnimations();

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

      // Browser back/forward navigation can restore this page straight
      // from the bfcache (bfcache = the browser's snapshot of the page
      // it keeps so back/forward is instant). When that happens React
      // effects don't re-run on their own, so the reveal animation
      // wouldn't replay without this listener forcing a reset + refresh.
      const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger && container.contains(st.trigger as Node)) {
              st.kill();
            }
          });

          setupRowAnimations();
          ScrollTrigger.refresh();
        }
      };

      window.addEventListener("pageshow", handlePageShow);
      return () => window.removeEventListener("pageshow", handlePageShow);
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
          const hasLink = Boolean(project.link);

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

                {/* Only render a clickable link when one actually exists.
                    Previously an empty href="" caused a click to reload
                    the current page as if it were a "live" link. */}
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
                  // absolute + inset-0 guarantees the image always fills
                  // the parent card fully (regardless of its own natural
                  // aspect ratio), which fixes images like orijin.io,
                  // hellosenseai.com, and qiyas.pro rendering smaller
                  // than the div.
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}