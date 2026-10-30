import React from 'react';
import { Globe } from 'lucide-react';
export const Slide5WebsiteVisual = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center select-none overflow-visible">
      {/* Background radial glow */}
      <div className="absolute w-84 h-84 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none hero-animate-pulse-glow" />
      <div className="absolute w-72 h-72 rounded-full bg-brand-navy/5 blur-2xl pointer-events-none top-0 left-4" />

      {/* SVG Responsive Alignment Guides */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Alignment lines between desktop, tablet, and mobile */}
        <line
          x1="220"
          y1="160"
          x2="150"
          y2="280"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="hero-animate-dash"
          opacity="0.5"
        />
        <line
          x1="380"
          y1="220"
          x2="480"
          y2="300"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="hero-animate-dash"
          opacity="0.5"
        />
      </svg>

      {/* 1. DESKTOP MONITOR (Center / Background Layer) */}
      <div className="relative z-10 w-[290px] sm:w-[350px] lg:w-[390px] bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
        {/* Browser Top Bar */}
        <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="ml-2 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[8px] font-mono text-slate-500 flex items-center gap-1">
              <span className="text-emerald-500">🔒</span>
              <span>https://durgamsoft.com</span>
            </div>
          </div>
          <span className="text-[8px] font-mono font-semibold text-slate-400">Desktop: 1440px</span>
        </div>

        {/* Website Content Mockup */}
        <div className="p-3 bg-white space-y-2.5">
          {/* Web Navbar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <img
                src="/images/durgamsoft-logo.webp"
                alt="DS"
                className="w-4 h-4 object-contain"
              />
              <span className="text-[9px] font-bold text-brand-navy">Durgam Soft</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[8px] text-slate-600">
              <span className="text-brand-orange font-semibold">Home</span>
              <span>Products</span>
              <span>Services</span>
              <span>About</span>
            </div>
            <div className="px-2 py-0.5 bg-brand-orange text-white text-[7px] font-bold rounded">
              Get Started
            </div>
          </div>

          {/* Web Hero Banner Mini */}
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-orange-50/50 border border-slate-100 flex items-center justify-between">
            <div className="space-y-1 max-w-[65%]">
              <div className="inline-block px-1.5 py-0.2 bg-brand-light-orange text-brand-orange text-[6px] font-bold rounded">
                ENTERPRISE TECH
              </div>
              <div className="text-[10px] font-extrabold text-brand-navy leading-tight">
                Modern High-Performance Web Architecture
              </div>
              <div className="text-[7px] text-slate-500 leading-tight">
                Custom engineered for lightning speed and conversion.
              </div>
            </div>
            <div className="w-12 h-10 rounded-md bg-white border border-slate-200 p-1 shadow-xs flex flex-col justify-center items-center">
              <div className="text-[9px] font-extrabold text-emerald-600">99+</div>
              <div className="text-[5px] text-slate-400">PageSpeed</div>
            </div>
          </div>

          {/* Web 3-Column Service Cards */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="w-2.5 h-2.5 rounded bg-brand-light-orange text-brand-orange flex items-center justify-center text-[6px] font-bold mb-1">
                ⚡
              </div>
              <div className="text-[7px] font-bold text-brand-navy">Fast Speed</div>
              <div className="text-[6px] text-slate-400">Sub-second load</div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="w-2.5 h-2.5 rounded bg-brand-light-orange text-brand-orange flex items-center justify-center text-[6px] font-bold mb-1">
                📱
              </div>
              <div className="text-[7px] font-bold text-brand-navy">Responsive</div>
              <div className="text-[6px] text-slate-400">Fluid on all screens</div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="w-2.5 h-2.5 rounded bg-brand-light-orange text-brand-orange flex items-center justify-center text-[6px] font-bold mb-1">
                🔍
              </div>
              <div className="text-[7px] font-bold text-brand-navy">SEO Ready</div>
              <div className="text-[6px] text-slate-400">Search indexed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABLET DEVICE (Overlapping Mid-Left) */}
      <div className="absolute z-20 left-1 sm:left-4 bottom-2 sm:bottom-6 w-38 sm:w-48 bg-slate-900 rounded-2xl p-2 shadow-2xl border-2 border-slate-700/80 hero-animate-float">
        <div className="bg-white rounded-xl p-2 space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="text-[8px] font-bold text-brand-navy">Durgam Soft</div>
            <span className="text-[6px] font-mono text-brand-orange font-bold">Tablet 768px</span>
          </div>

          <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
            <div className="text-[8px] font-extrabold text-brand-navy">Clean Tablet View</div>
            <div className="text-[6px] text-slate-500">Fluid 2-column layout</div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[6px]">
            <div className="p-1 bg-white border border-slate-100 rounded text-center font-semibold text-brand-navy">
              Products
            </div>
            <div className="p-1 bg-brand-orange text-white rounded text-center font-bold">
              Services
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMARTPHONE DEVICE (Overlapping Forefront Right) */}
      <div className="absolute z-20 right-1 sm:right-4 bottom-3 sm:bottom-8 w-28 sm:w-34 bg-slate-900 rounded-2xl p-2 shadow-2xl border-2 border-slate-700/80 hero-animate-float-reverse">
        {/* Notch */}
        <div className="w-8 h-1 bg-slate-700 rounded-full mx-auto mb-1.5" />

        <div className="bg-white rounded-xl p-1.5 space-y-1">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[7px] font-bold text-brand-navy">Mobile Web</span>
            <span className="text-[5px] font-mono text-emerald-600 font-bold">390px</span>
          </div>

          <div className="p-1 bg-slate-50 rounded border border-slate-100">
            <div className="text-[7px] font-extrabold text-brand-navy">Mobile First</div>
            <div className="text-[5px] text-slate-500">Fast tap navigation</div>
          </div>

          <div className="w-full py-0.5 bg-brand-orange text-white text-[6px] font-bold rounded text-center">
            Tap to Call / Contact
          </div>
        </div>
      </div>

      {/* Bottom Floating Architecture Badge */}
      <div className="absolute -bottom-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-full px-3.5 py-1 flex items-center gap-2">
        <Globe className="w-3.5 h-3.5 text-brand-orange" />
        <span className="text-[10px] font-bold text-brand-navy">
          Pixel-Perfect Responsive Design Across All Devices
        </span>
      </div>
    </div>
  );
};
