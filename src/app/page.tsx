import Header from "@/components/sections/Header";
import CinematicHero from "@/components/sections/CinematicHero";
import RotatingWord from "@/components/ui/RotatingWord";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import WhiteTransition from "@/components/sections/WhiteTransition";
import ServicesSkills from "@/components/sections/ServicesSkills";
import Projects from "@/components/sections/Projects";
import ThreeDStars from "@/components/ui/ThreeDStars";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full min-h-screen bg-black overflow-x-hidden">
      {/* Background 3D balls are now rendered directly inside the R3F Canvas */}

      {/* Header Overlay */}
      <Header />

      {/* Cinematic Hero — fixed background canvas */}
      <CinematicHero />
      
      {/* 
        This wrapper is the scroll trigger. It covers exactly 200vh (2 sections).
        The first section will be pinned.
      */}
      <div id="hero-scroll-container" className="relative z-10">
        
        {/* First Section — Hero content overlay */}
        <section id="hero-section" className="relative flex h-[100vh] w-full flex-col justify-center items-center bg-transparent px-6 overflow-hidden">
          <div id="hero-content" className="max-w-5xl text-center z-10 select-none pointer-events-none w-full">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-zinc-50 mb-0 font-display drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] leading-[1.1] flex flex-col items-center">
              <span className="block text-zinc-300 font-light text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2">
                Elevating Your Business with
              </span>
              <span className="block text-zinc-50 tracking-tight">
                Innovative Software <RotatingWord />
              </span>
            </h1>
          </div>
          
          {/* Subtle scroll down indicator */}
          <div id="hero-scroll-indicator" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest font-mono select-none">
            <span>SCROLL TO EXPLORE</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent animate-pulse" />
          </div>
        </section>
        
        {/* Second Section — Text overlays the fixed canvas with scroll reveal */}
        <section id="about-section" className="relative flex h-[100vh] w-full flex-col justify-center items-center bg-transparent px-6">
          <div className="z-10 flex justify-center items-center w-full">
            <ScrollRevealText />
          </div>
        </section>
        
      </div>
      
      {/* Third Section — Premium window shield transition reveal */}
      <WhiteTransition />
      <ServicesSkills />
      <Projects />
    </main>
  );
}
