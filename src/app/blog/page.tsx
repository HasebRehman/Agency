import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { getAllPosts } from "@/lib/wordpress";
import Header from "@/components/sections/Header";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog & Insights | CureLogics",
  description: "Explore the latest insights, technical guides, and thought leadership from the CureLogics team.",
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function stripHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return clean.replace(/&[a-z0-9]+;/gi, " ").trim();
}

export default async function BlogPage() {
  const posts = await getAllPosts();

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
              CureLogics Insights
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Blog & Articles
          </h1>
          <p className="text-base sm:text-lg text-[#8b96ac] leading-relaxed">
            Discover articles on software engineering, intelligent automation, modern web architecture, and cloud infrastructure.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#8b96ac]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              No Blog Posts Found
            </h2>
            <p className="text-[#8b96ac] text-sm max-w-md mx-auto mb-6">
              Ensure WordPress is running with WPGraphQL plugin active at your configured GraphQL endpoint.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all duration-300"
            >
              ← Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageSrc = post.featuredImage?.node?.sourceUrl;
              const cleanExcerpt = stripHtml(post.excerpt);

              return (
                <article
                  key={post.id}
                  className="group relative flex flex-col bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#35d0ff]/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(53,208,255,0.12)] hover:-translate-y-1"
                >
                  {/* Card Image Container */}
                  <div className="relative w-full aspect-[16/9] bg-white/5 overflow-hidden border-b border-white/10">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={post.featuredImage?.node?.altText || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#35d0ff]/20 via-[#8b7bff]/10 to-transparent flex items-center justify-center p-6 text-center">
                        <span className="font-display font-bold text-2xl text-white/20 tracking-wider uppercase">
                          CureLogics
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-6 sm:p-7">
                    {/* Meta info */}
                    <div className="flex items-center justify-between gap-4 mb-3 text-xs font-mono text-[#8b96ac]">
                      <span>{formatDate(post.date)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-xl font-semibold text-white group-hover:text-[#35d0ff] transition-colors duration-200 line-clamp-2 mb-3 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-[#8b96ac] line-clamp-3 mb-6 leading-relaxed flex-1">
                      {cleanExcerpt}
                    </p>

                    {/* Footer link */}
                    <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-[#35d0ff] group-hover:text-white transition-colors duration-200 gap-1.5 pt-4 border-t border-white/5">
                      <span>Read Article</span>
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
