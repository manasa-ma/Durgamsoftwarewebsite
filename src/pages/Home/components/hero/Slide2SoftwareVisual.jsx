import React from 'react';
import { Code, Smartphone, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
export const Slide2SoftwareVisual = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center select-none overflow-visible">
      {/* Background glow and subtle studio grid */}
      <div className="absolute w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none hero-animate-pulse-glow" />
      <div className="absolute w-72 h-72 rounded-full bg-brand-navy/5 blur-2xl pointer-events-none top-0 right-10" />

      {/* SVG Connecting Flow Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="codeFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1F3A" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Path from Code Editor to App Dashboard */}
        <path
          d="M 180 230 C 230 210 270 200 320 220"
          stroke="url(#codeFlowGrad)"
          strokeWidth="2.5"
          className="hero-animate-dash"
        />

        {/* Path from App Dashboard to Mobile Screen */}
        <path
          d="M 440 260 C 470 280 490 320 510 350"
          stroke="url(#codeFlowGrad)"
          strokeWidth="2"
          className="hero-animate-dash"
        />
      </svg>

      {/* LEFT: Code Editor Studio Window (Transformation Source) */}
      <div className="absolute z-20 left-1 sm:left-4 top-10 sm:top-14 w-[190px] sm:w-[240px] bg-brand-navy rounded-xl shadow-2xl border border-slate-700/80 overflow-hidden hero-animate-float">
        {/* Editor Tab Bar */}
        <div className="bg-brand-dark-navy px-3 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[9px] font-mono text-slate-400">AppEngine.tsx</span>
          </div>
          <Code className="w-3 h-3 text-brand-orange" />
        </div>

        {/* Syntax Code Body */}
        <div className="p-3 font-mono text-[9px] leading-relaxed text-slate-300 space-y-1">
          <div className="text-slate-500 text-[8px]">// Clean architecture</div>
          <div>
            <span className="text-orange-400">interface</span>{' '}
            <span className="text-amber-200">CustomApp</span> {'{'}
          </div>
          <div className="pl-2">
            <span className="text-slate-400">web:</span>{' '}
            <span className="text-emerald-400">React.FC</span>;
          </div>
          <div className="pl-2">
            <span className="text-slate-400">mobile:</span>{' '}
            <span className="text-emerald-400">NativeApp</span>;
          </div>
          <div className="pl-2">
            <span className="text-slate-400">performance:</span>{' '}
            <span className="text-cyan-400">100</span>;
          </div>
          <div>{'}'}</div>
          <div className="pt-1 text-slate-400">
            <span className="text-orange-400">export const</span>{' '}
            <span className="text-blue-300">Deploy</span> = () ={'>'} {'{'}
          </div>
          <div className="pl-2 text-emerald-400 flex items-center gap-1">
            <span>buildProject();</span>
            <span className="w-1.5 h-3 bg-brand-orange hero-cursor-blink inline-block" />
          </div>
          <div>{'}'};</div>
        </div>

        {/* Compilation Status Pill */}
        <div className="bg-brand-dark-navy/90 px-3 py-1.5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-semibold">
            <CheckCircle2 className="w-2.5 h-2.5" /> Compiled: 0 Errors
          </div>
          <span className="text-[7px] text-orange-400 font-mono">Ready to Ship</span>
        </div>
      </div>

      {/* CENTER / MAIN: Desktop Production Application Dashboard */}
      <div className="relative z-10 w-[270px] sm:w-[320px] lg:w-[360px] bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden ml-8 sm:ml-16 transform transition-transform duration-500 hover:scale-[1.02]">
        {/* App Titlebar */}
        <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <img
              src="/images/durgamsoft-logo.webp"
              alt="DS"
              className="w-4 h-4 object-contain"
            />
            <span className="text-[10px] font-bold text-brand-navy">Enterprise Portal v3.4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-bold">
              Production
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3.5 bg-slate-50 space-y-3">
          {/* Top Bar with Search & Action */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-white rounded border border-slate-200 px-2 flex items-center text-[8px] text-slate-400">
              Filter modules...
            </div>
            <button className="px-2 py-1 bg-brand-orange text-white rounded text-[8px] font-bold flex items-center gap-1 shadow-xs">
              <span>Deploy Update</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="text-[8px] text-slate-500 font-medium">Daily Active Users</div>
              <div className="text-[14px] font-extrabold text-brand-navy">24,850</div>
              <div className="text-[8px] text-emerald-600 font-semibold">+18.4% this month</div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="text-[8px] text-slate-500 font-medium">Processing Speed</div>
              <div className="text-[14px] font-extrabold text-brand-navy">0.14s</div>
              <div className="text-[8px] text-brand-orange font-semibold">Optimized Core</div>
            </div>
          </div>

          {/* User Activity / Data Grid Preview */}
          <div className="bg-white rounded-lg border border-slate-200 p-2 space-y-1.5">
            <div className="flex justify-between items-center text-[8px] font-bold text-brand-navy border-b border-slate-100 pb-1">
              <span>Integrated Modules</span>
              <span className="text-slate-400">Status</span>
            </div>
            <div className="flex justify-between items-center text-[8px]">
              <span className="text-slate-600">Web Engine & Portal</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center text-[8px]">
              <span className="text-slate-600">Mobile API Synchronizer</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center text-[8px]">
              <span className="text-slate-600">Database & Security Shield</span>
              <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded">Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOREFRONT RIGHT: Mobile App synchronized screen */}
      <div className="absolute z-20 right-1 sm:right-4 bottom-2 sm:bottom-6 w-34 sm:w-42 bg-brand-navy rounded-2xl p-2.5 shadow-2xl border-2 border-slate-700/80 hero-animate-float-reverse">
        {/* Smartphone Speaker & Camera Notch */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-2" />

        <div className="bg-slate-900 rounded-xl p-2 text-white space-y-2">
          <div className="flex justify-between items-center">
            <Smartphone className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-[7px] text-slate-400 font-mono">v2.1 iOS / Android</span>
          </div>

          <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <div className="text-[7px] text-slate-400">Synced Database</div>
            <div className="text-[10px] font-bold text-white">All Records Clean</div>
            <div className="text-[7px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-2 h-2" /> Live sync active
            </div>
          </div>

          <div className="w-full py-1 bg-brand-orange rounded text-center text-[8px] font-bold text-white shadow-xs">
            Open Dashboard
          </div>
        </div>

        <div className="mt-1.5 text-center text-[8px] font-semibold text-slate-300">
          Mobile App Platform
        </div>
      </div>

      {/* Bottom Floating Architecture Badge */}
      <div className="absolute -bottom-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-full px-3.5 py-1 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-brand-orange" />
        <span className="text-[10px] font-bold text-brand-navy">
          Full-Stack Web, Mobile & Desktop Architecture
        </span>
      </div>
    </div>
  );
};
