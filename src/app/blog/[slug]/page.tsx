import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { getPostBySlug } from "@/lib/wordpress";
import Header from "@/components/sections/Header";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | CureLogics",
    };
  }

  const description = post.excerpt ? stripHtml(post.excerpt).slice(0, 160) : post.title;

  return {
    title: `${post.title} | CureLogics Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
    },
  };
}

export default async function SinglePostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageSrc = post.featuredImage?.node?.sourceUrl;
  const sanitizedContent = DOMPurify.sanitize(post.content);

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
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8b96ac] hover:text-[#35d0ff] transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Post Title & Meta Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-xs font-mono text-[#35d0ff] mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            {post.title}
          </h1>
        </header>

        {/* Featured Image */}
        {imageSrc && (
          <div className="relative w-full aspect-[16/9] bg-white/5 rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
            <Image
              src={imageSrc}
              alt={post.featuredImage?.node?.altText || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Post HTML Content */}
        <div
          className="wp-content bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-sm"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Footer Back Link */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 hover:border-[#35d0ff]/40"
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
