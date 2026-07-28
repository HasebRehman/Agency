import Header from "@/components/sections/Header";
import CinematicHero from "@/components/sections/CinematicHero";
import RotatingWord from "@/components/ui/RotatingWord";
import WhiteTransition from "@/components/sections/WhiteTransition";
import ServicesSkills from "@/components/sections/ServicesSkills";
import Projects from "@/components/sections/Projects";
import BlackTransition from "@/components/sections/BlackTransition";
import { FaMeta, FaSlack } from "react-icons/fa6";

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

              {/* Partner Logos — static row, 8 logos, no animation */}
              <div id="hero-logos" className="relative z-10 flex flex-wrap items-center justify-between w-full text-zinc-500 select-none pb-4 border-t border-white/5 pt-8 pointer-events-auto">
                {/* Meta */}
                <div className="flex items-center gap-2.5 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 hover:text-white transition-all duration-300">
                  <FaMeta className="h-5 sm:h-6 w-auto" />
                  <span className="font-sans font-semibold text-sm sm:text-base md:text-lg">Meta</span>
                </div>
                {/* Upwork */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-bold lowercase text-sm sm:text-base md:text-lg tracking-tight">
                    up<span className="font-normal">work</span>
                  </span>
                </div>
                {/* Slack */}
                <div className="flex items-center gap-2.5 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 hover:text-white transition-all duration-300">
                  <FaSlack className="h-5 sm:h-6 w-auto" />
                  <span className="font-sans font-bold lowercase text-sm sm:text-base md:text-lg">slack</span>
                </div>
                {/* Amazon */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-medium lowercase text-sm sm:text-base md:text-lg">amazon</span>
                </div>
                {/* eBay */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-bold text-sm sm:text-base md:text-lg">
                    e<span className="font-normal">bay</span>
                  </span>
                </div>
                {/* Google */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-medium text-sm sm:text-base md:text-lg">Google</span>
                </div>
                {/* LinkedIn */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-semibold text-sm sm:text-base md:text-lg">LinkedIn</span>
                </div>
                {/* Logitech */}
                <div className="flex items-center opacity-45 hover:opacity-100 hover:text-white transition-all duration-300">
                  <span className="font-sans font-semibold lowercase text-sm sm:text-base md:text-lg tracking-wide">logitech</span>
                </div>
              </div>
            </div>
          </section>
          
        </div>
        
        {/* Third Section — Premium window shield transition reveal */}
        <WhiteTransition />
        <ServicesSkills />
        <Projects />
        <BlackTransition />
      </main>
  );
}