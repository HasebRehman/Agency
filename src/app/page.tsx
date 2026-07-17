import Header from "@/components/sections/Header";
import CinematicHero from "@/components/sections/CinematicHero";
import RotatingWord from "@/components/ui/RotatingWord";
import ScrollRevealText from "@/components/ui/ScrollRevealText";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full min-h-screen bg-black overflow-x-hidden">
      {/* Header Overlay */}
      <Header />

      {/* Cinematic Hero — fixed background canvas */}
      <CinematicHero />
      
      {/* 
        This wrapper is the scroll trigger. It covers exactly 200vh (2 sections).
        The first section will be pinned.
      */}
      <div id="hero-scroll-container">
        
        {/* First Section — Hero content overlay */}
        <section id="hero-section" className="relative flex h-[100vh] w-full flex-col justify-center items-center bg-transparent px-6 overflow-hidden">
          <div id="hero-content" className="max-w-5xl text-center z-10 select-none pointer-events-none">
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
      
      {/* Third Section — Light background covers canvas and features marquee transition */}
      <section id="key-facts-section" className="relative w-full min-h-[100vh] bg-black z-20 overflow-visible">
        <div 
          id="white-panel" 
          className="w-full min-h-[100vh] bg-white text-zinc-950 flex flex-col justify-start items-center overflow-hidden pb-32"
          style={{ 
            willChange: "transform, opacity, border-radius",
            boxShadow: "0 -20px 40px rgba(0,0,0,0.15)"
          }}
        >
          {/* Stacked Marquee Transition Border */}
          <div className="w-full flex flex-col border-b border-zinc-200">
            {/* Row 1: White bg, black text, slides left */}
            <div className="w-full overflow-hidden bg-white py-4 border-y border-zinc-200 select-none">
              <div className="animate-marquee-left flex gap-12 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-wider text-black">
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
              </div>
            </div>

            {/* Row 2: Black bg, white text, slides right */}
            <div className="w-full overflow-hidden bg-black py-4 select-none">
              <div className="animate-marquee-right flex gap-12 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-wider text-white">
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
              </div>
            </div>

            {/* Row 3: White bg, black text, slides left */}
            <div className="w-full overflow-hidden bg-white py-4 border-y border-zinc-200 select-none">
              <div className="animate-marquee-left flex gap-12 whitespace-nowrap text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-wider text-black">
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
                <span>IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +  IMPACT  +  INSPIRE  +  INNOVATE  +</span>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-28 max-w-6xl w-full">
            <h2 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl text-zinc-950 mb-6 font-display">
              Key facts
            </h2>
            <p className="text-zinc-600 text-lg sm:text-xl md:text-2xl font-light max-w-xl">
              A snapshot of our experience and impact.
            </p>
            
            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full mt-24 text-center max-w-5xl border-t border-zinc-100 pt-20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black">99%</span>
                <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Client Satisfaction</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black">120+</span>
                <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Products Shipped</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black">10x</span>
                <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Deployment Speed</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-display text-black">24/7</span>
                <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 uppercase">Systems Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
