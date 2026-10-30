import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { updatePageMeta } from '../../../utils/seo';
import { BLOG_ARTICLES, BLOG_CATEGORIES } from '../../../data/blogData';

export const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles] = useState(BLOG_ARTICLES);

  useEffect(() => {
    updatePageMeta({
      title: 'Blog & Editorial — Technology, Retail POS & Software Insights | Durgam Soft',
      description:
        'Official blog of Durgam Soft Pvt. Ltd. Discover expert articles on retail billing systems, Flutter mobile engineering, GST automation, and business growth.',
    });
  }, []);

  // Filter articles based on category
  const filteredArticles = articles.filter((article) => {
    return selectedCategory === 'All' || article.category === selectedCategory;
  });

  // Featured hero articles (top 2 featured/hero picks, fallback to first 2 articles)
  const heroCandidates = articles.filter((a) => a.isHeroPick || a.featured);
  const heroFeatured =
    heroCandidates.length >= 2 ? heroCandidates.slice(0, 2) : articles.slice(0, 2);

  // Top stories for sidebar (take next 3 stories not already shown in heroFeatured)
  const heroSlugs = new Set(heroFeatured.map((a) => a.slug));
  const sidebarFeatured = articles
    .filter((a) => !heroSlugs.has(a.slug))
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Blog' }]} />

      {/* ======================================================== */}
      {/* 1. Hero Section (Reference 3 & 1: Soft Beige/Blush)      */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] via-[#FAF7F2] to-white border-b border-stone-200/70 pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft Ambient Glows & Subtle Organic Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(120, 113, 108, 0.16) 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="container-custom relative z-10 max-w-5xl text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#B83E15] text-xs font-bold uppercase tracking-widest shadow-2xs mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#C74E23] animate-pulse" />
            <span>Blog &amp; Knowledge Base</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.1] uppercase mb-5">
            Discover Our{' '}
            <span className="text-[#B83E15]">Latest Insights</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-9">
            Practical perspectives on modern retail POS, software engineering, and business automation from Durgam Soft.
          </p>

          {/* Category Filter Pills (Reference 3 & 1) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {BLOG_CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? articles.length
                  : articles.filter((a) => a.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-black text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 hover:bg-stone-50 hover:text-[#C74E23] border border-stone-200 shadow-2xs'
                  }`}
                >
                  {cat}{' '}
                  <span className="ml-1 opacity-75 text-[11px]">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Featured Showcase: Split Grid (Reference 3 + Ref 1)   */}
      {/* ======================================================== */}
      <section className="py-12 md:py-16 bg-[#FAF7F2] border-b border-stone-200/70">
        <div className="container-custom max-w-6xl">
          {/* Section Heading */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-1">
                CURATED PICKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Featured Perspectives &amp; Deep Dives
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
              <TrendingUp className="w-4 h-4 text-[#C74E23]" />
              <span>Trending Across Retail &amp; Engineering</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: 2 Tall Featured Cards with Rich Hover Animation (Reference 3 Style) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {heroFeatured.map((article) => (
                <Link
                  key={article.id}
                  to={`/resources/blog/${article.slug}`}
                  className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-end min-h-[440px] sm:min-h-[480px] bg-stone-900 border border-stone-200/70"
                >
                  {/* Full-bleed Cover Image with Cursor Zoom Animation */}
                  <picture>
                    <source srcSet={article.image} type="image/webp" />
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      width={440}
                      height={480}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </picture>

                  {/* Gradient Scrim for crystal clear readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                  {/* Top Category Badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#C74E23] shadow-md border border-white/40">
                      {article.category}
                    </span>
                  </div>

                  {/* Inset Content Box with Smooth Slide Animation on Hover */}
                  <div className="relative z-10 p-6 sm:p-7 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-[11px] text-stone-300 font-semibold mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C74E23]" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-300 transition-colors tracking-tight leading-snug mb-3">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-2 mb-4 font-normal">
                      {article.excerpt}
                    </p>

                    <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 group-hover:text-white uppercase tracking-wider transition-colors">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Column: Stacked Featured Articles List (Reference 1 & 3 Style) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-4 border-b border-stone-100 pb-2">
                  TOP STORIES THIS MONTH
                </span>

                <div className="space-y-5">
                  {sidebarFeatured.map((item) => (
                    <Link
                      key={item.id}
                      to={`/resources/blog/${item.slug}`}
                      className="flex items-center gap-4 group/item pb-4 border-b border-stone-100 last:border-0 last:pb-0"
                    >
                      {/* Square Thumbnail with Hover Scale Animation */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                        <picture>
                          <source srcSet={item.image} type="image/webp" />
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500 ease-out"
                          />
                        </picture>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <span className="text-[#B83E15]">{item.category}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-black group-hover/item:text-[#C74E23] transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h4>

                        <span className="text-xs text-slate-400 mt-1 block">
                          {item.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Author Focus Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/70 via-[#FAF7F2] to-amber-50/50 border border-rose-200/70 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-black">
                    Written by Durgam Soft Practitioners
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Real engineering experiences, retail deployments, and founder insights.
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-[#C74E23] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. Latest Articles Grid (Reference 1 & 3 Cards)          */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-white border-b border-stone-200/70">
        <div className="container-custom max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-1">
                ALL PERSPECTIVES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                Latest Articles &amp; Analysis
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredArticles.length} of {articles.length} published guides
            </span>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border border-stone-200">
              <h3 className="text-xl font-bold text-black mb-2">No articles found</h3>
              <p className="text-sm text-slate-600 mb-4">
                No published guides match {selectedCategory}.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 items-stretch">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-3xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-2xl hover:-translate-y-2 hover:border-orange-300 transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container with Zoom & Hover Movement */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-stone-100">
                      <picture>
                        <source srcSet={article.image} type="image/webp" />
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                      </picture>

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#C74E23] shadow-2xs border border-white/60">
                        {article.category}
                      </span>

                      {/* Read time pill */}
                      <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                        {article.readTime}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C74E23]" />
                        <span>{article.date}</span>
                      </div>

                      <h3 className="text-xl font-black text-black group-hover:text-[#C74E23] transition-colors tracking-tight leading-snug mb-3">
                        <Link to={`/resources/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Author + Read Link */}
                  <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-[#B83E15] flex items-center justify-center font-bold text-xs shrink-0">
                        {article.author.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-black block truncate">
                          {article.author.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {article.author.role}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/resources/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#C74E23] transition-colors shrink-0 group/link"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Bottom Call to Action Section                         */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="rounded-3xl bg-[#1A1A1A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block">
                TRANSFORM YOUR BUSINESS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ready to Experience Billmaster POS?
              </h3>
              <p className="text-sm text-stone-300 max-w-lg leading-relaxed">
                Schedule a 1-on-1 walkthrough with our retail technology specialists or discuss custom software requirements for your enterprise.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                to="/book-demo"
                className="px-6 py-3.5 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
              >
                Book a Free Demo
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
