import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Printer,
  Barcode,
  Layers,
  Sparkles,
  Check,
  Target,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/buttons/Button';
import { updatePageMeta } from '../../utils/seo';

// High-Definition WebP Assets
import heroBento1 from '../../assets/images/about/about-hero-bento-1.webp';
import heroBento2 from '../../assets/images/about/about-hero-bento-2.webp';
import heroBento3 from '../../assets/images/about/about-hero-bento-3.webp';
import founderVenuDurgamWebp from '../../assets/images/about/about-founder-venu-durgam.webp';
import capabilitiesTeamWebp from '../../assets/images/about/about-capabilities-team.webp';
import billmasterShowcaseWebp from '../../assets/images/about/about-billmaster-showcase.webp';

// Testimonial Avatars
import testi1 from '../../assets/images/about/testimonial-avatar-1.webp';
import testi2 from '../../assets/images/about/testimonial-avatar-2.webp';
import testi3 from '../../assets/images/about/testimonial-avatar-3.webp';

export const AboutPage = () => {
  const [stat90, setStat90] = useState(0);
  const [stat50, setStat50] = useState(0);

  useEffect(() => {
    updatePageMeta({
      title: 'About Us — Durgam Soft Pvt. Ltd. | Products, Software Development & Digital Marketing',
      description:
        'Established in 2022 in Hyderabad, Durgam Soft builds proprietary software products like billmaster, develops custom software for other businesses, and delivers digital marketing services.',
    });

    const duration = 1200;
    let frameId;
    let startTime;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart: 1 - (1 - progress)^4
      const ease = 1 - Math.pow(1 - progress, 4);

      setStat90(Math.round(ease * 90));
      setStat50(Math.round(ease * 50));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    const delayTimer = setTimeout(() => {
      frameId = requestAnimationFrame(animateCount);
    }, 350);

    return () => {
      clearTimeout(delayTimer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const testimonials = [
    {
      quote:
        'Durgam Soft rebuilt modrunclothing.com into a headless powerhouse and launched our native Flutter app. Our load speed dropped to 0.8s, and we now process over 15,000 monthly apparel dispatches seamlessly.',
      author: 'Karthik Sundaram',
      role: 'Founder & MD, ModRun Clothing',
      url: 'https://modrunclothing.com/',
      isLiveLink: true,
      avatar: testi1,
    },
    {
      quote:
        'Billmaster POS with LAN clustering transformed our 5 billing counters. Direct weighing scale integration and barcode scanning eliminated counter queue delays during our busiest festival rushes.',
      author: 'M. Ramesh Kumar',
      role: 'Managing Director, Sri Krishna Retail',
      avatar: testi2,
    },
    {
      quote:
        'Durgam Soft engineered an offline-first mobile delivery app for our 45 field agents. Even in rural zones with zero connectivity, drivers capture signatures and print Bluetooth receipts without losing a single record.',
      author: 'Sunil K. Reddy',
      role: 'Operations Director, Zenith Express Logistics',
      avatar: testi3,
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased bg-[#FAF7F2]">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'About Us' }]} />

      {/* ======================================================== */}
      {/* 1. Hero Bento Grid Section (Reference Screenshot 1)      */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] pt-10 pb-10 md:pt-14 md:pb-12 overflow-hidden">
        <div className="container-custom">
          {/* Main Title & Subtitle with Entrance Animations */}
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-5 animate-hero-title">
              Where technology meets
              <br />
              opportunity
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-hero-intro">
              Durgam Soft builds its own software products, develops software  for other businesses, and helps businesses grow through digital marketing.
            </p>
          </div>

          {/* Bento Asymmetric Photo & Stat Grid with Authentic ShrinkIn & SlideUp Animations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-6xl mx-auto items-stretch">
            {/* Left Column: Tall Portrait (ShrinkIn 1) */}
            <div className="md:col-span-4 h-full">
              <div className="h-full rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 group bg-stone-100">
                <img
                  src={heroBento1}
                  alt="Technology visionary"
                  className="w-full h-full object-cover min-h-[380px] md:min-h-[500px] animate-hero-shrink-1 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-106"
                />
              </div>
            </div>

            {/* Middle Column: Orange Stat Card (Top) + Team Photo (Bottom) */}
            <div className="md:col-span-4 flex flex-col gap-5 justify-between">
              {/* Orange Stat Card (SlideInUp Orange) */}
              <div className="bg-[#C74E23] rounded-3xl p-8 sm:p-9 text-white flex flex-col justify-between shadow-xs min-h-[190px] animate-hero-card-orange hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 group cursor-default">
                <span className="text-5xl font-black tracking-tight block transition-transform duration-300 group-hover:scale-105 origin-left">
                  {stat90}%
                </span>
                <p className="text-white text-lg font-medium leading-snug mt-6">
                  Faster Response Times
                </p>
              </div>

              {/* Collaborative Team Photo (ShrinkIn 2) */}
              <div className="rounded-3xl overflow-hidden shadow-xs flex-1 min-h-[220px] hover:shadow-xl transition-all duration-500 group bg-stone-100">
                <img
                  src={heroBento2}
                  alt="Team collaboration"
                  className="w-full h-full object-cover animate-hero-shrink-2 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-106"
                />
              </div>
            </div>

            {/* Right Column: Engineer Photo (Top) + Black Stat Card (Bottom) */}
            <div className="md:col-span-4 flex flex-col gap-5 justify-between">
              {/* Software Engineer Photo (ShrinkIn 3) */}
              <div className="rounded-3xl overflow-hidden shadow-xs flex-1 min-h-[220px] hover:shadow-xl transition-all duration-500 group bg-stone-100">
                <img
                  src={heroBento3}
                  alt="Software developer"
                  className="w-full h-full object-cover animate-hero-shrink-3 transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-106"
                />
              </div>

              {/* Black Stat Card (SlideInUp Black) */}
              <div className="bg-[#141414] rounded-3xl p-8 sm:p-9 text-white flex flex-col justify-between shadow-xs min-h-[190px] animate-hero-card-black hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 group cursor-default">
                <span className="text-5xl font-black tracking-tight block transition-transform duration-300 group-hover:scale-105 origin-left">
                  {stat50}%
                </span>
                <p className="text-white text-lg font-medium leading-snug mt-6">
                  Lower Operational Costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Story Narrative (Reference Screenshot 2)               */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] pb-6 md:pb-8 border-b border-stone-200/60">
        <div className="container-custom max-w-6xl">
          {/* Two-Column Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                Making software
                <br />
                better for everyone
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              <p>
                Established in 2022 in Hyderabad, Durgam Soft was founded with a vision to simplify business operations. What began with building our flagship commercial software, <strong>billmaster</strong>, has grown into a trusted technology partner for teams across retail, wholesale, and enterprise industries.
              </p>
              <p>
                Our goal is to simplify complex processes, enabling businesses to focus on what matters most—their goals and customers. By delivering powerful yet user-friendly software solutions, custom web, mobile, and desktop development, and digital marketing, we're redefining productivity and innovation for teams of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. Core Business Capabilities (Side-by-Side Narrative)   */}
      {/* ======================================================== */}
      <section className="bg-white py-10 md:py-14 border-b border-slate-100">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Narrative Paragraphs */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B83E15] block">
                Our Capabilities
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                More than software.
                <br />
                A complete technology partner.
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                At Durgam Soft, we believe technology should be comprehensive and accessible. While many know us for <strong>billmaster</strong>—our flagship billing software and integrated POS hardware ecosystem—our capabilities extend far beyond a single solution.
              </p>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Durgam Soft builds its own products, develops software services for other businesses, and helps businesses grow through digital marketing. Whether you require scalable <strong>web applications</strong>, native <strong>iOS & Android mobile apps</strong>, custom <strong>desktop platforms</strong>, or specialized business workflows, our engineering team builds software specifically tailored to your operational requirements.
              </p>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                To help companies scale in an increasingly connected economy, our dedicated <strong>digital marketing</strong> division drives online visibility, search optimization (SEO), and commercial customer acquisition, ensuring your products connect with the markets they are built for.
              </p>

              {/* Three Core Areas List */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[#B83E15] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <strong className="text-black font-bold">1. Our Products — </strong>
                    <span className="text-slate-600">
                      Proprietary billmaster billing software, mobile apps, and complete POS hardware (thermal receipt printers, barcode scanners, label printers, rolls & labels).
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[#B83E15] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <strong className="text-black font-bold">2. Software Development — </strong>
                    <span className="text-slate-600">
                      Custom software engineering for client businesses across web applications, mobile apps, desktop systems, and automated internal workflows.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[#B83E15] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <strong className="text-black font-bold">3. Digital Marketing — </strong>
                    <span className="text-slate-600">
                      Strategic online promotion, search engine optimization (SEO), and targeted digital marketing campaigns to scale business reach.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  to="/services"
                  className="gap-2 shadow-md text-base px-8 py-3.5 bg-black hover:bg-slate-800 text-white border-transparent rounded-full"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-base font-bold text-[#B83E15] hover:text-[#d85c32] group py-3 px-4"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Simple Clean Image */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xs border border-stone-200 bg-white">
                <picture>
                  <source srcSet={capabilitiesTeamWebp} type="image/webp" />
                  <img
                    src={capabilitiesTeamWebp}
                    alt="Durgam Soft engineering and marketing team collaborating"
                    loading="lazy"
                    decoding="async"
                    width={500}
                    height={520}
                    className="w-full h-[520px] object-cover"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Dedicated billmaster Showcase & Hardware Ecosystem     */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 md:py-14 border-b border-stone-200/60">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B83E15] block">
                Flagship Proprietary Product
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                billmaster: Built for Fast, Everyday Business Operations
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Recognizing that traditional billing software was often bloated, difficult to learn, and prone to peripheral mismatches, Durgam Soft engineered <strong>billmaster</strong> as an intuitive, high-speed retail and business management solution.
              </p>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                Our complete product ecosystem includes desktop and mobile billing applications alongside tested, certified POS hardware:
              </p>

              {/* Hardware & Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-2xs">
                  <Printer className="w-5 h-5 text-[#C74E23] shrink-0" />
                  <div>
                    <div className="font-bold text-black text-sm">Thermal Printers</div>
                    <div className="text-xs text-slate-500">2" & 3" Fast Counter Printing</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-2xs">
                  <Barcode className="w-5 h-5 text-[#C74E23] shrink-0" />
                  <div>
                    <div className="font-bold text-black text-sm">Barcode Scanners</div>
                    <div className="text-xs text-slate-500">1D & 2D QR Rapid Capture</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-2xs">
                  <Layers className="w-5 h-5 text-[#C74E23] shrink-0" />
                  <div>
                    <div className="font-bold text-black text-sm">Label Printers & Supplies</div>
                    <div className="text-xs text-slate-500">Direct Thermal Rolls & Labels</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-[#C74E23] shrink-0" />
                  <div>
                    <div className="font-bold text-black text-sm">Mobile Billing App</div>
                    <div className="text-xs text-slate-500">Real-Time Cloud Inventory Sync</div>
                  </div>
                </div>
              </div>

              {/* Two Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  to="/products/billmaster"
                  className="gap-2 shadow-md text-base px-8 py-3.5 bg-black hover:bg-slate-800 text-white border-transparent rounded-full"
                >
                  <span>Explore billmaster</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  to="/book-demo"
                  className="gap-2 text-base px-8 py-3.5 bg-white border border-stone-300 text-black hover:bg-stone-50 rounded-full"
                >
                  <span>Book a Live Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right: billmaster Official Product Showcase Image */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-md border border-stone-200/80 bg-white group hover:shadow-xl transition-all duration-300">
                <picture>
                  <source srcSet={billmasterShowcaseWebp} type="image/webp" />
                  <img
                    src={billmasterShowcaseWebp}
                    alt="billmaster Smart Billing Solution - Software, App, and POS Hardware Ecosystem"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. Our Purpose: Mission & Vision                         */}
      {/* ======================================================== */}
      <section className="bg-white py-10 md:py-14 border-t border-stone-200/60">
        <div className="container-custom max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B83E15] block mb-3">
              OUR PURPOSE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight uppercase">
              MISSION &amp; VISION
            </h2>
            {/* Warm brand accent bar */}
            <div className="w-16 h-1 bg-[#C74E23] rounded-full mx-auto mt-4" />
          </div>

          {/* 2-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Mission Card */}
            <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/90 p-8 sm:p-12 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-[#B83E15] text-xs font-bold uppercase tracking-wider mb-6">
                <Target className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>MISSION</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-6">
                OUR MISSION
              </h3>

              {/* Single Quote Capturing Entire Business */}
              <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug border-l-4 border-[#C74E23] pl-5 italic">
                &ldquo;To empower businesses of every size with intuitive, dependable technology that eliminates operational complexity and drives everyday growth.&rdquo;
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/90 p-8 sm:p-12 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/80 border border-stone-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-6">
                <Eye className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>VISION</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-6">
                OUR VISION
              </h3>

              {/* Single Quote Capturing Entire Business */}
              <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug border-l-4 border-black pl-5 italic">
                &ldquo;To be the most trusted technology partner businesses rely on, recognized for unwavering reliability, transparent partnerships, and long-term value.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CEO & Founder (A Word from the Founder)               */}
      {/* ======================================================== */}
      <section className="bg-white py-10 md:py-14 border-t border-slate-100">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                CEO & Founder
              </h2>

              <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                <p>
                  When I started this journey in 2022 in Hyderabad, my vision was simple. I wanted to create something that brings value, fosters connection, and makes a meaningful impact on daily business operations. Every step we've taken has been guided by a passion for innovation and a commitment to putting people first.
                </p>
                <p>
                  This is not just a brand. It is a community, a space where ideas grow, challenges are met with creativity, and every voice matters. None of this would be possible without your support, trust, and belief in what we stand for. Thank you for being a part of this story.
                </p>
                <p>
                  Together, we are building something truly special, and I can't wait to see what the future holds.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-xl text-black">
                  Durgam Venu Gopal
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Founder & CEO, Durgam Soft Pvt. Ltd.
                </p>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                <picture>
                  <source srcSet={founderVenuDurgamWebp} type="image/webp" />
                  <img
                    src={founderVenuDurgamWebp}
                    alt="Durgam Venu Gopal, Founder & CEO"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. Client Testimonials (3 Reviews)                       */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] py-10 md:py-14 border-t border-stone-200/60">
        <div className="container-custom max-w-6xl">
          {/* 3 Testimonials Card Grid (No Heading) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-black leading-tight">
                        {t.author}
                      </h4>
                      {t.isLiveLink && (
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-[#C74E23] transition-colors"
                          title="Visit live client website"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. Start Your Trial Today CTA                            */}
      {/* ======================================================== */}
      <section className="bg-white py-12 md:py-16 border-t border-stone-200/60">
        <div className="container-custom max-w-4xl text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight leading-tight">
              Start your trial today.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Unlock the potential of your business with our next-level SaaS platform. Transform your workflows and achieve new heights today.
            </p>

            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                to="/contact"
                className="gap-2 shadow-md text-base px-8 py-3.5 bg-black hover:bg-slate-800 text-white border-transparent rounded-full"
              >
                <span>Get started</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
