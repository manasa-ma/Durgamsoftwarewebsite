import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Star,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import modrunEcoImg from '../../assets/images/clients/case-study-modrun-ecommerce.webp';
import modrunMobImg from '../../assets/images/clients/case-study-modrun-mobile-app.webp';
import modrunPosImg from '../../assets/images/clients/case-study-modrun-warehouse-pos.webp';
import modrunMktImg from '../../assets/images/clients/case-study-modrun-growth-analytics.webp';
import { MODRUN_CASE_STUDY } from '../../data/clientReviews';

export const ModrunShowcase = ({ currentSection = 'all' }) => {
  // Tab states: 'web' | 'mobile' | 'pos' | 'growth'
  const initialTab =
    currentSection === 'mobile'
      ? 'mobile'
      : currentSection === 'desktop'
      ? 'pos'
      : currentSection === 'marketing'
      ? 'growth'
      : 'web';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [liveTickerIdx, setLiveTickerIdx] = useState(0);

  const tickerUpdates = [
    { text: 'Order #MR-9428 dispatched via Billmaster POS • Tiruppur Hub', time: 'Just now' },
    { text: 'modrunclothing.com handled 6,240 concurrent visitors with 0.8s latency', time: '3m ago' },
    { text: 'ModRun Flutter App: 140+ new user registrations today', time: '8m ago' },
    { text: 'Google Shopping Campaign: 4.4x ROAS verified in GA4', time: '14m ago' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTickerIdx((prev) => (prev + 1) % tickerUpdates.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerUpdates.length]);

  const tabs = [
    {
      id: 'web',
      label: 'Headless E-Commerce Web',
      sublabel: '0.8s Load • Next.js & Redis',
      icon: <Globe className="w-4 h-4" />,
      image: modrunEcoImg,
      alt: 'ModRun Clothing E-Commerce Website by Durgam Soft',
      statPill: { value: '0.8s', label: 'Average Page Load' },
      url: 'https://modrunclothing.com/',
      highlights: [
        'Custom headless Next.js catalog with sub-second page transitions',
        'Multi-gateway instant checkout with Razorpay, Cashfree & UPI',
        'Dynamic size finder quiz reducing customer return rate by 28%',
        'Automated real-time inventory synchronization with Tiruppur warehouse',
      ],
    },
    {
      id: 'mobile',
      label: 'Flutter Mobile App',
      sublabel: '60 FPS • iOS & Android',
      icon: <Smartphone className="w-4 h-4" />,
      image: modrunMobImg,
      alt: 'ModRun Clothing Flutter Mobile App by Durgam Soft',
      statPill: { value: '42%', label: 'Of Total Brand Revenue' },
      url: 'https://modrunclothing.com/',
      highlights: [
        'Native-compiled Flutter app with butter-smooth 60fps animations',
        'Drop countdown alerts & instant push notifications for new releases',
        '1-tap re-order with saved shipping addresses and biometric login',
        'Offline-capable apparel catalog with instant SQLite local cache',
      ],
    },
    {
      id: 'pos',
      label: 'Warehouse Billmaster POS',
      sublabel: '2s / Parcel • RS232 Scales',
      icon: <Monitor className="w-4 h-4" />,
      image: modrunPosImg,
      alt: 'ModRun Fulfillment Center Billmaster POS by Durgam Soft',
      statPill: { value: '15,000+', label: 'Monthly Dispatches' },
      url: 'https://modrunclothing.com/',
      highlights: [
        'Integrated RS232 digital weighing scale with gram-accurate tare',
        'Direct ESC/POS thermal barcode printer driver for courier slips',
        'Automated item-check verification preventing wrong garment dispatch',
        'Real-time courier tracking API generation for Delhivery & BlueDart',
      ],
    },
    {
      id: 'growth',
      label: 'Performance Ads & SEO',
      sublabel: '4.4x ROAS • #1 Google Rank',
      icon: <TrendingUp className="w-4 h-4" />,
      image: modrunMktImg,
      alt: 'ModRun Digital Marketing Growth by Durgam Soft',
      statPill: { value: '4.4x', label: 'Verified Blended ROAS' },
      url: 'https://modrunclothing.com/',
      highlights: [
        'High-converting Meta Ads & Google Shopping product campaign funnels',
        'Top 3 organic Google rankings for "streetwear oversized t shirts India"',
        'Dynamic product retargeting recovering 34% of abandoned carts',
        'Weekly transparent GA4 revenue attribution & conversion analytics',
      ],
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const activeLeader = MODRUN_CASE_STUDY.leadership[activeReviewIdx];

  return (
    <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 my-10 font-sans">
      {/* Top Header Badge & Live Production Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Verified Client • Live Production Case Study</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              ModRun Clothing{' '}
              <span className="text-[#C74E23] text-lg sm:text-xl font-normal block sm:inline">
                ({MODRUN_CASE_STUDY.domain})
              </span>
            </h3>
            <a
              href="https://modrunclothing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-300 hover:border-[#C74E23] text-xs font-semibold text-slate-700 hover:text-[#C74E23] shadow-2xs transition-all group"
              title="Visit live client website"
            >
              <span>Visit modrunclothing.com</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {MODRUN_CASE_STUDY.industry} • {MODRUN_CASE_STUDY.location}
          </p>
        </div>

        {/* Live Simulation Ticker */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-3 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#B83E15] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>LIVE TELEMETRY</span>
              <span className="w-1 h-1 rounded-full bg-[#C74E23]" />
              <span className="text-[#C74E23]">{tickerUpdates[liveTickerIdx].time}</span>
            </div>
            <p className="text-xs font-medium text-slate-800 truncate">
              {tickerUpdates[liveTickerIdx].text}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Category Viewport Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 py-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white border-[#C74E23] shadow-md -translate-y-0.5 ring-2 ring-orange-100'
                  : 'bg-white/70 hover:bg-white border-stone-200/80 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                  isActive
                    ? 'bg-[#C74E23] text-white'
                    : 'bg-stone-100 text-slate-600'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-black tracking-tight leading-snug block">
                {tab.label}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Image Mockup & Technical Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
        {/* Left: Device Mockup Image with Floating Stat Badge */}
        <div className="lg:col-span-7">
          <div className="relative group overflow-hidden rounded-2xl border border-stone-200 shadow-sm aspect-[16/10] bg-stone-100">
            <img
              src={currentTab.image}
              alt={currentTab.alt}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />


          </div>
        </div>

        {/* Right: Technical Capabilities & Deliverables */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[#B83E15] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered by Durgam Soft</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
            {currentTab.label}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Custom engineered for ModRun Clothing's high-traffic apparel operations. Every component is optimized for speed, reliability, and automated order fulfillment.
          </p>

          <ul className="space-y-2.5 pt-1">
            {currentTab.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <a
              href="https://modrunclothing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-[#C74E23] text-white text-xs font-bold transition-all group shadow-sm"
            >
              <span>Explore Live ModRun Platform</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Verified Client Review Cards with Leadership Switcher */}
      <div className="mt-8 pt-8 border-t border-stone-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-black text-black ml-1">5.0 / 5.0</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-black tracking-tight">
              What ModRun Leadership Says About Durgam Soft
            </h3>
          </div>

          {/* Reviewer Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {MODRUN_CASE_STUDY.leadership.map((leader, lIdx) => (
              <button
                key={lIdx}
                type="button"
                onClick={() => setActiveReviewIdx(lIdx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeReviewIdx === lIdx
                    ? 'bg-[#C74E23] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-black border border-stone-200'
                }`}
              >
                {leader.name} ({leader.role.split('&')[0].trim()})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Review Box */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed italic font-normal">
              &ldquo;{activeLeader.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C74E23] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                {activeLeader.avatarInitial}
              </div>
              <div>
                <span className="text-sm font-bold text-black block">
                  {activeLeader.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeLeader.role} • {activeLeader.company}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-[#FAF7F2] p-4 rounded-xl border border-stone-200 text-center w-full md:w-auto">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
              100% Verified
            </span>
            <span className="text-[10px] text-slate-500 block">
              Direct Durgam Soft Client
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModrunShowcase;
