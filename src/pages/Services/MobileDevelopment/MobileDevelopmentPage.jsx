import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Zap,
  Lock,
  Layers,
  Apple,
  Cpu,
  Smile,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { updatePageMeta } from '../../../utils/seo';
import { ProjectShowcaseCarousel } from '../../../components/common/ProjectShowcaseCarousel';
import { TestimonialCarousel } from '../../../components/common/TestimonialCarousel';
import { ServiceBenefits } from '../../../components/common/ServiceBenefits';
import { ServiceFinalCTA } from '../../../components/common/ServiceFinalCTA';
import { MOBILE_PROJECTS } from '../../../data/serviceProjects';
import { SERVICE_REVIEWS } from '../../../data/clientReviews';
import serviceMobileImg from '../../../assets/images/services/service-mobile-hero.webp';

export const MobileDevelopmentPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageMeta({
      title: 'Mobile Apps Built for Modern Businesses — Durgam Soft',
      description:
        'High-performance iOS and Android mobile app development by Durgam Soft. Flutter cross-platform apps, offline-first SQLite sync, and POS mobile solutions.',
    });
  }, []);

  const serviceCards = [
    {
      title: 'Android Apps',
      description:
        'Native-feeling Android applications tailored for smartphones, tablets, and rugged handheld POS terminals across diverse hardware.',
      icon: <Smartphone className="w-6 h-6" />,
      features: ['Play Store Ready', 'Hardware Interfacing', 'Offline Caching'],
    },
    {
      title: 'iOS Apps',
      description:
        'Pixel-perfect iPhone and iPad applications engineered to strict Apple Human Interface Guidelines with smooth 60fps animations.',
      icon: <Apple className="w-6 h-6" />,
      features: ['App Store Compliant', 'Biometric Auth', 'Push Notifications'],
    },
    {
      title: 'Cross-Platform Apps',
      description:
        'Unified Flutter codebases delivering identical performance and UI across both iOS and Android simultaneously, saving time and maintenance.',
      icon: <Layers className="w-6 h-6" />,
      features: ['Single Codebase', 'Fast Iteration', '40% Lower Cost'],
    },
    {
      title: 'Business Apps',
      description:
        'Dedicated apps for field sales, van billing, delivery agents, and executive owner telemetry with real-time cloud data sync.',
      icon: <Cpu className="w-6 h-6" />,
      features: ['Bluetooth Printing', 'QR/Barcode Scanner', 'Offline SQLite'],
    },
  ];

  const benefits = [
    {
      title: 'Simple UI',
      description:
        'Clean, intuitive layouts that minimize friction, reduce training time, and make navigation natural for users.',
      icon: <Smile className="w-6 h-6" />,
    },
    {
      title: 'Fast',
      description:
        'Butter-smooth 60fps animations and near-instant screen transitions powered by optimized native Flutter code.',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Responsive',
      description:
        'Adaptive layouts designed to render flawlessly across all smartphone dimensions, aspect ratios, and tablets.',
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      title: 'Secure',
      description:
        'End-to-end data encryption, secure token authentication, biometric sign-in, and compliance with modern app standards.',
      icon: <Lock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Services', to: '/services' },
          { label: 'Mobile Development' },
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
                <Smartphone className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>iOS &amp; Android App Development</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-[1.15]">
                Mobile Apps Built for{' '}
                <span className="text-[#B83E15]">Modern Businesses</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                We engineer fast, intuitive iOS and Android applications that keep your customers engaged, streamline field operations, and drive daily revenue.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all"
                >
                  <span>Build Your App</span>
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
                    src={serviceMobileImg}
                    alt="Mobile App Development Mockup"
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
              Mobile Application Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              From customer-facing mobile stores to enterprise field operations tools.
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
        projects={MOBILE_PROJECTS}
        badge="Recent Mobile Deliveries"
        title="Mobile Apps We've Built"
        subtitle="Explore production mobile applications engineered with Flutter, offline SQLite sync, and peripheral hardware support."
      />

      {/* ======================================================== */}
      {/* 4. Benefits Section (4 Small Cards)                      */}
      {/* ======================================================== */}
      <ServiceBenefits
        badge="Engineered for Quality"
        title="Why Businesses Trust Our Mobile Apps"
        subtitle="Built to deliver fluid performance, secure offline transactions, and outstanding customer reviews."
        items={benefits}
      />

      {/* ======================================================== */}
      {/* 5. Reviews Carousel (Smooth Auto-Slide & Touch Support)  */}
      {/* ======================================================== */}
      <TestimonialCarousel
        reviews={SERVICE_REVIEWS['mobile-development']}
        badge="Verified Client Reviews"
        title="What Clients Say About Our Mobile Apps"
        subtitle="Real reviews from businesses and store owners using mobile applications engineered by Durgam Soft."
      />

      {/* ======================================================== */}
      {/* 6. Final Conversion CTA                                  */}
      {/* ======================================================== */}
      <ServiceFinalCTA
        ctaText="Build Your App"
        ctaTo="/contact"
        title="Have a project in mind?"
        subtitle="Let’s build something great together."
        secondaryText="Book a Demo"
        secondaryTo="/book-demo"
      />
    </div>
  );
};

export default MobileDevelopmentPage;
