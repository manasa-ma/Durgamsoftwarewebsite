import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Boxes,
  Briefcase,
  Smile,
  Lock,
  Layers,
  Receipt,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { updatePageMeta } from '../../../utils/seo';
import { ProjectShowcaseCarousel } from '../../../components/common/ProjectShowcaseCarousel';
import { TestimonialCarousel } from '../../../components/common/TestimonialCarousel';
import { ServiceBenefits } from '../../../components/common/ServiceBenefits';
import { ServiceFinalCTA } from '../../../components/common/ServiceFinalCTA';
import { DESKTOP_PROJECTS } from '../../../data/serviceProjects';
import { SERVICE_REVIEWS } from '../../../data/clientReviews';
import serviceDesktopImg from '../../../assets/images/services/service-desktop-hero.webp';

export const DesktopDevelopmentPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageMeta({
      title: 'Custom Software Built Around Your Business — Durgam Soft',
      description:
        'Native Windows desktop billing systems, inventory control, and retail POS software by Durgam Soft. Direct ESC/POS printing, electronic scales, and offline LAN clustering.',
    });
  }, []);

  const serviceCards = [
    {
      title: 'Billing Software',
      description:
        'High-speed, keyboard-driven retail POS tills designed for rapid barcode scanning, split payments, and sub-500ms direct thermal printing.',
      icon: <Receipt className="w-6 h-6" />,
      features: ['ESC/POS Direct Print', 'Keyboard Shortcuts', 'Split Payments'],
    },
    {
      title: 'Business Management',
      description:
        'Comprehensive management systems integrating customer ledgers, GST tax invoicing, daily cash reconciliation, and staff permissions.',
      icon: <Briefcase className="w-6 h-6" />,
      features: ['GST Invoicing', 'Audit Trails', 'User Roles & Security'],
    },
    {
      title: 'Inventory Systems',
      description:
        'Real-time multi-counter stock tracking, automated low-stock reorder triggers, batch/expiry alerts, and barcode label generation.',
      icon: <Boxes className="w-6 h-6" />,
      features: ['50,000+ SKUs', 'Barcode Generation', 'Batch Expiry Alerts'],
    },
    {
      title: 'Custom Applications',
      description:
        'Tailored desktop software with low-level RS232 weighing scale drivers, multi-till LAN database clusters, and automatic cloud replication.',
      icon: <Layers className="w-6 h-6" />,
      features: ['RS232 Serial Scales', 'LAN Clustering', 'Cloud Backup Sync'],
    },
  ];

  const benefits = [
    {
      title: 'Easy to Use',
      description:
        'Keyboard-first cashier shortcuts and intuitive screens designed so counter staff master the software in minutes.',
      icon: <Smile className="w-6 h-6" />,
    },
    {
      title: 'Reliable',
      description:
        '100% offline-first architecture that guarantees billing never stops even during complete broadband outages.',
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: 'Secure',
      description:
        'Granular role-based staff permissions, tamper-proof local databases, and automated daily cloud encrypted backups.',
      icon: <Lock className="w-6 h-6" />,
    },
    {
      title: 'Business Focused',
      description:
        'Engineered specifically to slash checkout queues to under 12 seconds per customer and prevent inventory shrinkage.',
      icon: <Briefcase className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 antialiased selection:bg-[#C74E23]/20 selection:text-[#C74E23]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Services', to: '/services' },
          { label: 'Desktop Development' },
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
                <Monitor className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>Desktop Systems &amp; POS Software</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-[1.15]">
                Custom Software Built{' '}
                <span className="text-[#B83E15]">Around Your Business</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                We build high-performance Windows desktop software, fast retail billing systems, and hardware-integrated tools that keep your operations running with zero delay.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all"
                >
                  <span>Discuss Your Requirement</span>
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
                    src={serviceDesktopImg}
                    alt="Desktop POS & Software Development Mockup"
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
              Desktop &amp; POS Software Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              From high-speed supermarket billing tills to multi-branch inventory systems.
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
        projects={DESKTOP_PROJECTS}
        badge="Recent Deliveries"
        title="Software &amp; Desktop Systems We've Built"
        subtitle="Explore production retail billing software, weighing scale integrations, and warehouse dispatch tools engineered by Durgam Soft."
      />

      {/* ======================================================== */}
      {/* 4. Benefits Section (4 Small Cards)                      */}
      {/* ======================================================== */}
      <ServiceBenefits
        badge="Engineered for Quality"
        title="Why Businesses Trust Our Desktop Software"
        subtitle="Built for maximum counter throughput, zero downtime, and seamless hardware interoperability."
        items={benefits}
      />

      {/* ======================================================== */}
      {/* 5. Reviews Carousel (Smooth Auto-Slide & Touch Support)  */}
      {/* ======================================================== */}
      <TestimonialCarousel
        reviews={SERVICE_REVIEWS['desktop-development']}
        badge="Verified Client Reviews"
        title="What Retailers Say About Our Desktop Systems"
        subtitle="Real reviews from supermarkets, wholesale distributors, and retail chains running billmaster POS software."
      />

      {/* ======================================================== */}
      {/* 6. Final Conversion CTA                                  */}
      {/* ======================================================== */}
      <ServiceFinalCTA
        ctaText="Discuss Your Requirement"
        ctaTo="/contact"
        title="Have a project in mind?"
        subtitle="Let’s build something great together."
        secondaryText="Book a Demo"
        secondaryTo="/book-demo"
      />
    </div>
  );
};

export default DesktopDevelopmentPage;
