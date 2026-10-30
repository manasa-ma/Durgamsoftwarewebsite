import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Zap,
  Maximize2,
  Smile,
  ShoppingCart,
  Layers,
  Code2,
  Building2,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { updatePageMeta } from '../../../utils/seo';
import { ProjectShowcaseCarousel } from '../../../components/common/ProjectShowcaseCarousel';
import { TestimonialCarousel } from '../../../components/common/TestimonialCarousel';
import { ServiceBenefits } from '../../../components/common/ServiceBenefits';
import { ServiceFinalCTA } from '../../../components/common/ServiceFinalCTA';
import { WEB_PROJECTS } from '../../../data/serviceProjects';
import { SERVICE_REVIEWS } from '../../../data/clientReviews';
import serviceWebImg from '../../../assets/images/services/service-web-hero.webp';

export const WebDevelopmentPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageMeta({
      title: 'Websites & Web Applications That Grow Your Business — Durgam Soft',
      description:
        'Custom web development by Durgam Soft. Fast, responsive, scalable business websites, e-commerce stores, and cloud web applications.',
    });
  }, []);

  const serviceCards = [
    {
      title: 'Business Websites',
      description:
        'Professional, mobile-friendly websites that build credibility, communicate your value, and generate qualified customer inquiries.',
      icon: <Building2 className="w-6 h-6" />,
      features: ['Modern UI/UX', 'SEO Optimized', 'Mobile Responsive'],
    },
    {
      title: 'E-Commerce',
      description:
        'High-converting online stores with fast product catalogs, secure checkout, payment gateway integrations, and automatic inventory sync.',
      icon: <ShoppingCart className="w-6 h-6" />,
      features: ['UPI & Card Gateways', 'Instant Cart', 'Order Management'],
    },
    {
      title: 'Web Applications',
      description:
        'Cloud-based portals, client dashboards, and internal workflow tools engineered for high concurrency, security, and effortless navigation.',
      icon: <Layers className="w-6 h-6" />,
      features: ['Role-Based Access', 'REST & Cloud APIs', 'Real-Time Sync'],
    },
    {
      title: 'Custom Websites',
      description:
        'Tailored digital experiences architected from the ground up to match your specific business requirements and unique brand identity.',
      icon: <Code2 className="w-6 h-6" />,
      features: ['Bespoke Codebase', 'Zero Bloat', 'Scalable Architecture'],
    },
  ];

  const benefits = [
    {
      title: 'Responsive',
      description:
        'Pixel-perfect layout and fluid touch interactions across all mobile phones, tablets, laptops, and ultra-wide desktop monitors.',
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      title: 'Fast',
      description:
        'Sub-second load times engineered with lightweight asset delivery, clean code, and edge caching for optimal speed.',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Scalable',
      description:
        'Modular cloud architecture ready to handle high-concurrency traffic spikes effortlessly as your business expands.',
      icon: <Maximize2 className="w-6 h-6" />,
    },
    {
      title: 'User Friendly',
      description:
        'Intuitive navigation, frictionless forms, and crystal-clear calls-to-action designed to maximize visitor engagement.',
      icon: <Smile className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Services', to: '/services' },
          { label: 'Web Development' },
        ]}
      />

      {/* ======================================================== */}
      {/* 1. Hero Section (Visual-First, Clean & Spaced)           */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] via-[#FAF7F2] to-white border-b border-stone-200/70 pt-8 pb-14 md:pt-14 md:pb-20">
        <div className="container-custom max-w-6xl">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#C74E23] uppercase tracking-wider mb-6 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#B83E15] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>Web Development Services</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-[1.15]">
                Websites &amp; Web Applications That{' '}
                <span className="text-[#B83E15]">Grow Your Business</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                We design and build fast, responsive, and secure websites that look stunning, engage visitors, and turn traffic into paying customers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#work-showcase"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-black font-bold text-sm shadow-2xs transition-colors"
                >
                  View Our Work
                </a>
              </div>
            </div>

            {/* Right Visual Mockup */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl aspect-[4/3] bg-stone-100">
                  <img
                    src={serviceWebImg}
                    alt="Web Application Development Mockup"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Service Cards Grid (4 Clean Rounded Cards)            */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-2">
              WHAT WE BUILD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
              Web Development Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              From commercial business websites to custom web platforms and e-commerce stores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCards.map((card, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-stone-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#C74E23] mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>

                  <h3 className="text-lg font-black text-black tracking-tight mb-2.5 group-hover:text-[#C74E23] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 flex flex-wrap gap-1.5">
                  {card.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-slate-600 border border-stone-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. Project / Work Showcase Carousel                      */}
      {/* ======================================================== */}
      <ProjectShowcaseCarousel
        projects={WEB_PROJECTS}
        badge="Recent Deliveries"
        title="Websites &amp; Platforms We've Built"
        subtitle="Explore real client platforms engineered for speed, clean UX, and high conversion."
      />

      {/* ======================================================== */}
      {/* 4. Benefits Section (4 Small Cards)                      */}
      {/* ======================================================== */}
      <ServiceBenefits
        badge="Engineered for Quality"
        title="Why Businesses Trust Our Web Solutions"
        subtitle="Built with modern web standards to ensure high reliability, speed, and great user experience."
        items={benefits}
      />

      {/* ======================================================== */}
      {/* 5. Reviews Carousel (Smooth Auto-Slide & Touch Support)  */}
      {/* ======================================================== */}
      <TestimonialCarousel
        reviews={SERVICE_REVIEWS['web-development']}
        badge="Verified Client Reviews"
        title="What Our Clients Say About Our Web Work"
        subtitle="Genuine feedback from business owners running custom web platforms built by Durgam Soft."
      />

      {/* ======================================================== */}
      {/* 6. Final Conversion CTA                                  */}
      {/* ======================================================== */}
      <ServiceFinalCTA
        ctaText="Start Your Project"
        ctaTo="/contact"
        title="Have a project in mind?"
        subtitle="Let’s build something great together."
        secondaryText="Book a Demo"
        secondaryTo="/book-demo"
      />
    </div>
  );
};

export default WebDevelopmentPage;
