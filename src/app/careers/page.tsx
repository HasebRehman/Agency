import type { Metadata } from "next";
import Link from "next/link";
import { getAllJobs } from "@/lib/wordpress";
import Header from "@/components/sections/Header";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers & Open Roles | CureLogics",
  description: "Join the CureLogics team. Explore open engineering, design, and automation roles.",
};

export default async function CareersPage() {
  const jobs = await getAllJobs();

  return (
    <div className="min-h-screen bg-[#05070c] text-[#eaf1fb] relative overflow-hidden font-sans">
      <Header />

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-[#35d0ff]/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#8b7bff]/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#35d0ff] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#35d0ff]">
              Join Our Team
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Careers at CureLogics
          </h1>
          <p className="text-base sm:text-lg text-[#8b96ac] leading-relaxed">
            We are engineering the logic behind modern automation. Discover opportunities to build impactful software with ambitious minds.
          </p>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#8b96ac]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 14.15m18 0V8.25A2.25 2.25 0 0018 6H6a2.25 2.25 0 00-2.25 2.25v5.9m16.5 0v.008M2.25 14.158v.008" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              No Open Positions Right Now
            </h2>
            <p className="text-[#8b96ac] text-sm max-w-md mx-auto mb-6">
              We aren&apos;t actively hiring for specific roles today, but we are always looking for exceptional talent. Feel free to check back soon.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all duration-300"
            >
              ← Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {jobs.map((job) => {
              const location = job.jobDetails?.location || "Remote";
              const jobType = job.jobDetails?.jobType || "Full-time";
              const salaryRange = job.jobDetails?.salaryRange;

              return (
                <article
                  key={job.id}
                  className="group relative flex flex-col bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#35d0ff]/40 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(53,208,255,0.12)] hover:-translate-y-1"
                >
                  <div className="flex-1">
                    {/* Tags / Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#35d0ff]/10 text-[#35d0ff] border border-[#35d0ff]/20">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#8b7bff]/10 text-[#8b7bff] border border-[#8b7bff]/20">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {jobType}
                      </span>
                      {salaryRange && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {salaryRange}
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <h2 className="font-display text-2xl font-bold text-white group-hover:text-[#35d0ff] transition-colors duration-200 mb-3">
                      <Link href={`/careers/${job.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {job.title}
                      </Link>
                    </h2>
                  </div>

                  {/* Card Footer Link */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                    <span className="text-xs font-mono text-[#8b96ac]">
                      CureLogics Team
                    </span>
                    <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-[#35d0ff] group-hover:text-white transition-colors duration-200 gap-1.5">
                      <span>View Role</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
