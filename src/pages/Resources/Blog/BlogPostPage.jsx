import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { updatePageMeta } from '../../../utils/seo';
import { BLOG_ARTICLES } from '../../../data/blogData';

export const BlogPostPage = () => {
  const { slug } = useParams();

  // Find post in our static blog data
  const post = BLOG_ARTICLES.find((p) => p.slug === slug) || BLOG_ARTICLES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Related posts (excluding current post)
  const relatedPosts = BLOG_ARTICLES.filter((p) => p.slug !== (post?.slug || slug)).slice(0, 3);

  // Current post index for next/prev
  const currentIndex = BLOG_ARTICLES.findIndex((p) => p.slug === (post?.slug || slug));
  const prevPost = currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIndex + 1] : null;

  useEffect(() => {
    if (post) {
      updatePageMeta({
        title: `${post.title} — Durgam Soft Blog`,
        description: post.subtitle || post.excerpt,
      });
    }
  }, [post]);


  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Blog', to: '/resources/blog' },
          { label: post.category },
        ]}
      />

      {/* ======================================================== */}
      {/* 1. Article Hero Header (Reference 2 Style - Soft Colors) */}
      {/* ======================================================== */}
      <header className="bg-gradient-to-b from-[#FFF5F2] via-[#FAF7F2] to-white border-b border-stone-200/70 pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="container-custom max-w-5xl">
          {/* Back link */}
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#C74E23] uppercase tracking-wider mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>

          {/* Category Pill & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-[#B83E15] border border-rose-200">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#C74E23]" />
              <span>{post.date}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight leading-[1.15] mb-4">
            {post.title}
          </h1>

          {/* Subtitle / Synopsis */}
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-4xl">
            {post.subtitle || post.excerpt}
          </p>

          {/* Author Meta Row */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-stone-200/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-orange-100 text-[#B83E15] flex items-center justify-center font-black text-sm shrink-0 border border-orange-200">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <span className="text-sm font-bold text-black block">
                  {post.author.name}
                </span>
                <span className="text-xs text-slate-500">
                  {post.author.role}
                </span>
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. Featured Image Showcase with Ambient Soft Shadow       */}
      {/* ======================================================== */}
      {post.image && (
        <section className="py-8 bg-white">
          <div className="container-custom max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[16/9] bg-stone-100 group">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 3. Main Content with Sticky Sidebar (Reference 2 Style)   */}
      {/* ======================================================== */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Sticky Sidebar (Table of Contents + Share) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Table of Contents Card */}
              {post.tableOfContents && post.tableOfContents.length > 0 && (
                <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-3">
                    IN THIS ARTICLE
                  </span>
                  <nav className="space-y-2.5">
                    {post.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#C74E23] transition-colors leading-snug"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}



              {/* Direct Demo Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFF5F2] to-orange-50/60 border border-orange-200/80 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white text-[#C74E23] flex items-center justify-center font-bold shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-black">
                  Interested in Billmaster POS?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book a live 1-on-1 walkthrough tailored to your grocery, supermarket, or retail enterprise.
                </p>
                <Link
                  to="/book-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B83E15] hover:text-orange-600 uppercase tracking-wider"
                >
                  <span>Request Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </aside>

            {/* Right Column: Rich Editorial Body */}
            <div className="lg:col-span-8 space-y-10">
              {Array.isArray(post.content) ? (
                post.content.map((sec) => (
                  <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-snug">
                      {sec.heading}
                    </h2>

                    {sec.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                        {p}
                      </p>
                    ))}

                    {/* Pull Quote Callout */}
                    {sec.quote && (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/80 via-rose-50/40 to-amber-50/30 border-l-4 border-[#C74E23] my-6">
                        <blockquote className="text-base sm:text-lg italic font-semibold text-slate-800 leading-relaxed">
                          &ldquo;{sec.quote}&rdquo;
                        </blockquote>
                      </div>
                    )}

                    {/* Key Takeaway Box */}
                    {sec.takeaway && (
                      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200 flex items-start gap-3 text-xs sm:text-sm text-slate-800 my-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Key Takeaway:</strong> {sec.takeaway}
                        </div>
                      </div>
                    )}

                    {/* Bullet List */}
                    {sec.bullets && (
                      <ul className="space-y-2.5 my-4 pl-1">
                        {sec.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C74E23] shrink-0 mt-2.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))
              ) : typeof post.content === 'string' && post.content.trim() ? (
                <div className="space-y-6">
                  {post.content.split(/\n\s*\n/).map((para, idx) => (
                    <p key={idx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-slate-700 leading-relaxed">{post.excerpt}</p>
                </div>
              )}

              {/* External References & Helpful Links (if provided) */}
              {Array.isArray(post.externalLinks) && post.externalLinks.length > 0 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-orange-200/90 shadow-2xs space-y-4 my-8">
                  <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#C74E23] flex items-center justify-center">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span>External References &amp; Helpful Links</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Explore reference materials, official documentation, or related tools provided for this article:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {post.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all shadow-2xs"
                      >
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#C74E23] transition-colors line-clamp-1 block">
                            {link.title || link.url}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono truncate block mt-0.5">
                            {link.url}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#C74E23] transition-colors shrink-0 mt-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Cloud */}
              {post.tags && (
                <div className="pt-8 border-t border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    RELATED TOPICS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-stone-100 text-slate-700 text-xs font-semibold hover:bg-orange-50 hover:text-[#C74E23] transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next & Previous Post Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-stone-200">
                {prevPost ? (
                  <Link
                    to={`/resources/blog/${prevPost.slug}`}
                    className="p-5 rounded-2xl bg-[#FAF7F2] hover:shadow-lg hover:border-stone-300 hover:-translate-y-0.5 border border-stone-200 transition-all duration-300 group block"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#C74E23] block mb-1">
                      ← PREVIOUS ARTICLE
                    </span>
                    <h5 className="text-sm font-bold text-black line-clamp-2 leading-snug">
                      {prevPost.title}
                    </h5>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost && (
                  <Link
                    to={`/resources/blog/${nextPost.slug}`}
                    className="p-5 rounded-2xl bg-[#FAF7F2] hover:shadow-lg hover:border-stone-300 hover:-translate-y-0.5 border border-stone-200 transition-all duration-300 group block text-right"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#C74E23] block mb-1">
                      NEXT ARTICLE →
                    </span>
                    <h5 className="text-sm font-bold text-black line-clamp-2 leading-snug">
                      {nextPost.title}
                    </h5>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Related Articles (Cards with Image Zoom Animation)    */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-[#FAF7F2] border-t border-stone-200">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-1">
                KEEP EXPLORING
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Related Articles &amp; Insights
              </h3>
            </div>
            <Link
              to="/resources/blog"
              className="text-xs font-bold text-slate-600 hover:text-[#C74E23] uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                className="rounded-3xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[16/10] bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#C74E23]">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                      {rel.date}
                    </span>
                    <h4 className="text-base font-black text-black group-hover:text-[#C74E23] transition-colors leading-snug line-clamp-2">
                      <Link to={`/resources/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{rel.readTime}</span>
                  <Link
                    to={`/resources/blog/${rel.slug}`}
                    className="text-xs font-bold text-black hover:text-[#C74E23] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
