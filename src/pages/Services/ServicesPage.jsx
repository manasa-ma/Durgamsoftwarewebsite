import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  Receipt,
  ArrowRight,
  ChevronDown,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { updatePageMeta } from '../../utils/seo';
import { SERVICES_DATA, SERVICES_PAGE_DATA } from '../../data/services';

export const ServicesPage = () => {
  // State to track which capability is expanded in each service block
  const [activeCapability, setActiveCapability] = useState({
    'web-development': 0,
    'mobile-development': 0,
    'desktop-development': 0,
    'digital-marketing': 0,
    'billing-software': 0,
  });

  useEffect(() => {
    updatePageMeta({
      title: 'Our Services — Web, Mobile, Desktop POS & Digital Marketing | Durgam Soft',
      description:
        'Explore Durgam Soft custom engineering services: scalable web applications, Flutter mobile apps, offline-first desktop POS systems, and performance digital marketing.',
    });
  }, []);

  const toggleCapability = (serviceId, index) => {
    setActiveCapability((prev) => ({
      ...prev,
      [serviceId]: prev[serviceId] === index ? null : index,
    }));
  };

  const getServiceIcon = (id) => {
    switch (id) {
      case 'web-development':
        return <Globe className="w-5 h-5 text-[#C74E23]" />;
      case 'mobile-development':
        return <Smartphone className="w-5 h-5 text-[#C74E23]" />;
      case 'desktop-development':
        return <Monitor className="w-5 h-5 text-[#C74E23]" />;
      case 'billing-software':
        return <Receipt className="w-5 h-5 text-[#C74E23]" />;
      case 'digital-marketing':
      default:
        return <TrendingUp className="w-5 h-5 text-[#C74E23]" />;
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Services' }]} />

      {/* ======================================================== */}
      {/* 1. Hero Section (Reference: Soft White & Warm Beige)     */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] via-[#FAF7F2] to-white border-b border-stone-200/70 pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Subtle Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(120, 113, 108, 0.16) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="container-custom relative z-10 max-w-6xl text-center">

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.1] uppercase mb-5">
            End-to-End Software{' '}
            <span className="text-[#B83E15]">Development &amp; Growth</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal mb-10">
            {SERVICES_PAGE_DATA.hero.subtitle}
          </p>

          {/* 4 Interactive Service Quick-Jump Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto mb-10">
            {SERVICES_DATA.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-xl hover:border-stone-300 hover:-translate-y-1 transition-all duration-300 text-left group block cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50/80 border border-orange-100/80 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
                  {getServiceIcon(service.id)}
                </div>
                <span className="text-xs sm:text-sm font-black text-black group-hover:text-[#C74E23] transition-colors line-clamp-1 block">
                  {service.title.replace(' Application', '').replace(' App', '')}
                </span>
                <span className="text-[10px] text-slate-600 font-medium block truncate mt-0.5">
                  {service.badge}
                </span>
              </a>
            ))}
          </div>

          {/* Hero Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-200/80 max-w-4xl mx-auto">
            {SERVICES_PAGE_DATA.hero.stats.map((st, idx) => (
              <div key={idx} className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-black tracking-tight block">
                  {st.value}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Alternating Service Rows (Inspired by Dribbble Ref)    */}
      {/* ======================================================== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom max-w-6xl space-y-16 md:space-y-24">
          {SERVICES_DATA.map((service, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-24 pt-4 border-t border-stone-100 first:border-0 first:pt-0"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Text / Capabilities Column */}
                  <div
                    className={`lg:col-span-6 space-y-6 ${
                      isReversed ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                      {service.title}
                    </h2>

                    {/* Short Description */}
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                      {service.shortDescription}
                    </p>

                    {/* Interactive Capabilities Accordion (Directly from Dribbble Ref) */}
                    <div className="space-y-3 pt-2">
                      {service.capabilities.map((cap, capIdx) => {
                        const isExpanded =
                          activeCapability[service.id] === capIdx;

                        return (
                          <div
                            key={capIdx}
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                              isExpanded
                                ? 'bg-[#FAF7F2] border-orange-200 shadow-2xs'
                                : 'bg-white border-stone-200/80 hover:border-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleCapability(service.id, capIdx)}
                              className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span className="font-bold text-sm sm:text-base text-black flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C74E23]" />
                                {cap.title}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                  isExpanded ? 'rotate-180 text-[#C74E23]' : ''
                                }`}
                              />
                            </button>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-200/60">
                                {cap.description}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                        TECHNOLOGIES &amp; TOOLING
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {service.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-slate-700 border border-stone-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Primary Button Linking to Dedicated Sub-Page */}
                    <div className="pt-3">
                      <Link
                        to={service.navPath}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-black hover:bg-[#C74E23] text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all duration-300 group/btn"
                      >
                        <span>Explore {service.title}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Image / Composite Showcase Column */}
                  <div
                    className={`lg:col-span-6 ${
                      isReversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="relative group">
                      {/* Main Large Image Container with Hover Scale Animation */}
                      <div className="rounded-3xl overflow-hidden border border-stone-200/90 shadow-md group-hover:shadow-2xl transition-all duration-500 aspect-[4/3] bg-stone-100">
                        <picture>
                          {service.webpImage && (
                            <source srcSet={service.webpImage} type="image/webp" />
                          )}
                          <img
                            src={service.image}
                            alt={
                              service.id === 'billing-software'
                                ? 'Billmaster Smart Billing — Mobile App, 2 Inch Printer, Barcode Scanner, and Cloud Dashboard'
                                : service.title
                            }
                            loading="lazy"
                            decoding="async"
                            width={600}
                            height={450}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                          />
                        </picture>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. Why Partner with Durgam Soft                          */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-white border-t border-stone-200/70">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mb-5 text-[#C74E23] shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-black tracking-tight mb-2">
                100% Code Ownership
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You own all intellectual property, source code, and database schemas with zero vendor lock-in or surprise license fees.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mb-5 text-[#C74E23] shadow-2xs">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-black tracking-tight mb-2">
                Hardware &amp; POS Mastery
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                From barcode scanners and weighing scales to thermal printers and cloud sync, our software is battle-tested in real high-volume retail stores.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mb-5 text-[#C74E23] shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-black tracking-tight mb-2">
                Dedicated SLA &amp; Support
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct phone and on-site support from Hyderabad headquarters, continuous software telemetry, and proactive maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Bottom CTA Banner (Inspired by Reference 1 Footer)    */}
      {/* ======================================================== */}
      <section className="py-14 md:py-20 bg-[#FAF7F2] border-t border-stone-200/70">
        <div className="container-custom max-w-5xl">
          <div className="rounded-3xl bg-[#1A1A1A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C] block">
                LET&rsquo;S COLLABORATE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Have a Software Project in Mind?
              </h3>
              <p className="text-sm text-stone-300 max-w-lg leading-relaxed">
                Schedule a scoping consultation with our engineering team or request a detailed technical proposal for your business.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
              >
                Schedule Scoping Call
              </Link>
              <Link
                to="/book-demo"
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
