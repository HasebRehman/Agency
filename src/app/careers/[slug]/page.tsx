import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { getJobBySlug } from "@/lib/wordpress";
import Header from "@/components/sections/Header";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getApplyHref(applyRaw: string | undefined | null, jobTitle: string): string {
  if (!applyRaw || !applyRaw.trim()) {
    return `mailto:careers@curelogics.com?subject=${encodeURIComponent(`Application for ${jobTitle}`)}`;
  }
  const trimmed = applyRaw.trim();
  if (trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  if (trimmed.includes("@") && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `mailto:${trimmed}?subject=${encodeURIComponent(`Application for ${jobTitle}`)}`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Listing Not Found | CureLogics",
    };
  }

  const location = job.jobDetails?.location || "Remote";
  const jobType = job.jobDetails?.jobType || "Full-time";

  return {
    title: `${job.title} — Careers | CureLogics`,
    description: `Apply for the ${job.title} role (${jobType}, ${location}) at CureLogics.`,
    openGraph: {
      title: `${job.title} — Careers | CureLogics`,
      description: `Apply for the ${job.title} role (${jobType}, ${location}) at CureLogics.`,
    },
  };
}

export default async function SingleJobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const location = job.jobDetails?.location || "Remote";
  const jobType = job.jobDetails?.jobType || "Full-time";
  const salaryRange = job.jobDetails?.salaryRange;
  const applyHref = getApplyHref(job.jobDetails?.apply, job.title);

  const sanitizedContent = DOMPurify.sanitize(job.content || "");

  return (
    <div className="min-h-screen bg-[#05070c] text-[#eaf1fb] relative overflow-hidden font-sans">
      <Header />

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-[#35d0ff]/10 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-[#8b7bff]/10 rounded-full blur-[140px]" />
      </div>

      <article className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-24">
        {/* Navigation / Back link */}
        <div className="mb-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8b96ac] hover:text-[#35d0ff] transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Open Positions</span>
          </Link>
        </div>

        {/* Job Header */}
        <header className="mb-12 border-b border-white/10 pb-10">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-[#35d0ff]/10 text-[#35d0ff] border border-[#35d0ff]/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-[#8b7bff]/10 text-[#8b7bff] border border-[#8b7bff]/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {jobType}
            </span>
            {salaryRange && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {salaryRange}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-8">
            {job.title}
          </h1>

          {/* Apply Button */}
          <div>
            <a
              href={applyHref}
              target={applyHref.startsWith("http") ? "_blank" : "_self"}
              rel={applyHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] text-[#031018] shadow-[0_8px_30px_rgba(53,208,255,0.25)] hover:shadow-[0_12px_36px_rgba(53,208,255,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Apply Now</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </header>

        {/* Job Description Content */}
        {sanitizedContent ? (
          <div className="mb-16">
            <h2 className="font-display text-xl font-semibold text-white mb-6">
              Job Overview & Requirements
            </h2>
            <div
              className="wp-content bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-sm"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        ) : (
          <div className="mb-16 text-[#8b96ac] bg-white/[0.02] border border-white/10 rounded-3xl p-8 text-center">
            No detailed description provided for this role.
          </div>
        )}

        {/* Bottom Apply Section */}
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center">
          <h3 className="font-display text-2xl font-bold text-white mb-3">
            Interested in this role?
          </h3>
          <p className="text-[#8b96ac] text-sm max-w-lg mb-8">
            Click below to submit your application or contact our talent acquisition team directly.
          </p>
          <a
            href={applyHref}
            target={applyHref.startsWith("http") ? "_blank" : "_self"}
            rel={applyHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-lg"
          >
            <span>Apply Now</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
