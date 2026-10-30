import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Printer,
  Radio,
} from 'lucide-react';
import {
  BILLMASTER_MOBILE_CASE_STUDY,
  BILLMASTER_DESKTOP_CASE_STUDY,
} from '../../data/clientReviews';
import billmasterShowcaseImg from '../../assets/images/about/about-billmaster-showcase.webp';
import serviceMobileImg from '../../assets/images/services/service-mobile-hero.webp';

export const BillmasterShowcase = ({ type = 'mobile' }) => {
  const isMobile = type === 'mobile';
  const data = isMobile ? BILLMASTER_MOBILE_CASE_STUDY : BILLMASTER_DESKTOP_CASE_STUDY;
  const showcaseImage = isMobile ? serviceMobileImg : billmasterShowcaseImg;

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);

  const mobileTicker = [
    { text: 'Billmaster Mobile: Counter #3 printed receipt via Bluetooth in 1.2s', time: 'Just now' },
    { text: 'Offline SQLite Engine: 240 items billed without internet in basement', time: '2m ago' },
    { text: 'WhatsApp Invoice #BM-8402 delivered instantly with PDF copy', time: '5m ago' },
    { text: 'Owner Dashboard: Real-time sales aggregated from 3 branches', time: '9m ago' },
  ];

  const desktopTicker = [
    { text: 'Billmaster Desktop: 5 counters active in synchronized local LAN cluster', time: 'Just now' },
    { text: 'DirectPrint Engine: ESC/POS 3-inch receipt printed in 380ms', time: '1m ago' },
    { text: 'RS232 Digital Scale: 1.250 kg tare auto-calculated with zero lag', time: '4m ago' },
    { text: 'Offline Mode: 100% active during broadband outage • 0 downtime', time: '7m ago' },
  ];

  const tickerUpdates = isMobile ? mobileTicker : desktopTicker;

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % tickerUpdates.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [tickerUpdates.length]);

  const activeLeader = data.leadership[activeReviewIdx];

  const highlights = isMobile
    ? [
        'Wireless Bluetooth thermal receipt printing on all standard 2-inch & 3-inch printers',
        'Camera-based barcode & QR scanner for high-speed item ring-up on the shop floor',
        'Direct WhatsApp PDF invoice sharing with automated GST tax breakdown',
        'Offline-first SQLite local persistence with seamless multi-counter cloud sync',
      ]
    : [
        'Direct ESC/POS thermal printing with sub-500ms execution (no Windows print spool lag)',
        'RS232 serial weighing scale integration with automatic gram-accurate tare deduction',
        'Multi-till local LAN database clustering with 100% resilience against internet drops',
        'Keyboard-driven cashier interface optimized for 10-second high-rush customer checkout',
      ];

  return (
    <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 my-10 font-sans">
      {/* Top Header & Official Link Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Official Flagship Product • Live Production Deployments</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {data.productName}{' '}
              <span className="text-[#C74E23] text-lg sm:text-xl font-normal block sm:inline">
                ({data.domain})
              </span>
            </h3>
            <a
              href="https://www.billmasterapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-300 hover:border-[#C74E23] text-xs font-bold text-slate-700 hover:text-[#C74E23] shadow-2xs transition-all group"
              title="Visit official Billmaster website"
            >
              <span>Visit www.billmasterapp.com</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {data.industry} • {data.location}
          </p>
        </div>

        {/* Live System Activity Ticker */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-3 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#B83E15] flex items-center justify-center shrink-0">
            {isMobile ? <Radio className="w-4 h-4 animate-pulse" /> : <Printer className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>LIVE TELEMETRY</span>
              <span className="w-1 h-1 rounded-full bg-[#C74E23]" />
              <span className="text-[#C74E23]">{tickerUpdates[tickerIdx].time}</span>
            </div>
            <p className="text-xs font-medium text-slate-800 truncate">
              {tickerUpdates[tickerIdx].text}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Image Mockup & Technical Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs mt-6">
        {/* Left: Device Mockup Image with Floating Stat Badge */}
        <div className="lg:col-span-7">
          <div className="relative group overflow-hidden rounded-2xl border border-stone-200 shadow-sm aspect-[16/10] bg-stone-100">
            <img
              src={showcaseImage}
              alt={data.productName}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />


          </div>
        </div>

        {/* Right: Technical Capabilities & Deliverables */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[#B83E15] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built by Durgam Soft</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
            {isMobile ? 'Mobile Point-of-Sale & Telemetry' : 'Native Windows Counter Billing Engine'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {data.summary}
          </p>

          <ul className="space-y-2.5 pt-1">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <a
              href="https://www.billmasterapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#C74E23] text-white text-xs sm:text-sm font-bold transition-all group shadow-sm active:scale-95"
            >
              <span>Explore www.billmasterapp.com</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Verified Store Owner Reviews with Leadership Switcher */}
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
              Verified Retail Store Reviews for Billmaster
            </h3>
          </div>

          {/* Reviewer Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {data.leadership.map((leader, lIdx) => (
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
                {leader.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Review Quote Card */}
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
                <a
                  href="https://www.billmasterapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C74E23] hover:underline mt-0.5"
                >
                  <span>www.billmasterapp.com</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-[#FAF7F2] p-4 rounded-xl border border-stone-200 text-center w-full md:w-auto">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
              100% Verified
            </span>
            <span className="text-[10px] text-slate-500 block">
              Live Billmaster Deployment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillmasterShowcase;
