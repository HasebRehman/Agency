import Header from "@/components/sections/Header";
import CinematicHero from "@/components/sections/CinematicHero";
import RotatingWord from "@/components/ui/RotatingWord";
import WhiteTransition from "@/components/sections/WhiteTransition";
import ServicesSkills from "@/components/sections/ServicesSkills";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <main className="relative flex flex-col w-full min-h-screen bg-black overflow-x-hidden">
      {/* Background 3D balls are now rendered directly inside the R3F Canvas */}

      {/* Header Overlay */}
      <Header />

      {/* Cinematic Hero — fixed background canvas */}
      <CinematicHero />
      
      {/* 
        This wrapper is the scroll trigger. It covers exactly 100vh (1 section)
        and will be pinned by ScrollTrigger.
      */}
      <div id="hero-scroll-container" className="relative z-10">
        
        {/* First Section — Hero content overlay */}
        <section id="hero-section" className="relative flex h-[100vh] w-full flex-col justify-between items-start bg-transparent px-12 lg:px-24 pt-28 pb-10 overflow-hidden">
          <div id="hero-container-wrapper" className="flex flex-col justify-between h-full w-full pointer-events-none opacity-0">
            {/* Main Content (Heading + Subheading) */}
            <div id="hero-content" className="max-w-4xl text-left z-10 w-full flex flex-col items-start pointer-events-auto my-auto">
              {/* Heading - font weight changed to 500 (medium) with tracking -0.02em to match Reference Image 2 */}
              <h1 id="hero-title" className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[6.2rem] tracking-[-0.02em] text-white leading-[1.02] flex flex-col items-start mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {/* Line 1 Masked Reveal */}
                <div className="overflow-hidden w-full flex pb-2">
                  <span id="hero-title-line-1" className="block origin-left">Innovative</span>
                </div>
                {/* Line 2 Masked Reveal - Padded bottom and right to prevent cursive descender clipping */}
                <div className="overflow-hidden w-full flex pb-4 pr-4">
                  <span id="hero-title-line-2" className="block origin-left">
                    Software <RotatingWord align="left" />
                  </span>
                </div>
              </h1>

              {/* Subheading */}
              <p id="hero-subheading" className="font-sans font-normal text-zinc-400 leading-[1.6] text-[18px] sm:text-[20px] max-w-xl sm:max-w-2xl mt-1">
                At CureLogics, we specialize in delivering cutting-edge software solutions tailored to your business needs.
              </p>
            </div>

            {/* Partner Logos from Reference Image 2 - full width, positioned at the bottom of the section */}
            <div id="hero-logos" className="relative z-10 flex flex-wrap items-center justify-between w-full text-zinc-500 select-none pb-4 border-t border-white/5 pt-8 pointer-events-auto">
              {/* AAVE */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h4l3.5-7.5h5L18 22h4L12 2zm-1.2 10.5L12 9.7l1.2 2.8h-2.4z"/>
                </svg>
                <span className="font-sans font-bold tracking-wider text-sm sm:text-base md:text-lg">AAVE</span>
              </div>
              {/* Compound */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4h-2v-6h2v6z"/>
                </svg>
                <span className="font-sans font-semibold text-sm sm:text-base md:text-lg">Compound</span>
              </div>
              {/* Synthetix */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-3-10 3z"/>
                </svg>
                <span className="font-sans font-bold tracking-widest text-xs sm:text-sm md:text-base">SYNTHETIX</span>
              </div>
              {/* Nexus Mutual */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
                <span className="font-sans font-medium text-sm sm:text-base md:text-lg">Nexus Mutual</span>
              </div>
              {/* Paxos */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
                </svg>
                <span className="font-sans font-bold tracking-widest text-xs sm:text-sm md:text-base">PAXOS</span>
              </div>
              {/* Celsius */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2V7h2v8z"/>
                </svg>
                <span className="font-sans font-semibold text-sm sm:text-base md:text-lg">celsius</span>
              </div>
              {/* ENS */}
              <div className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11H8v-2h8v2z"/>
                </svg>
                <span className="font-sans font-bold text-sm sm:text-base md:text-lg">ENS</span>
              </div>
            </div>
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
