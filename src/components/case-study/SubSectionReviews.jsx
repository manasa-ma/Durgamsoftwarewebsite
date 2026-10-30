import React from 'react';
import {
  Star,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { SERVICE_REVIEWS } from '../../data/clientReviews';

export const SubSectionReviews = ({
  serviceId,
  title = 'Verified Client Reviews & Production Impact',
  subtitle = 'Real software deployed in real commercial businesses across India.',
}) => {
  const reviews = SERVICE_REVIEWS[serviceId] || [];

  if (reviews.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-[#FAF7F2] border-t border-stone-200/70 font-sans">
      <div className="container-custom max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-2xs mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VERIFIED PRODUCTION FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            {title}
          </h2>
          <div className="w-16 h-1 bg-[#C74E23] rounded-full mx-auto mt-3 mb-4" />
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating Stars */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                    Verified Client
                  </span>
                </div>

                {/* Client Company & Optional Live Link */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-black tracking-tight group-hover:text-[#C74E23] transition-colors">
                      {rev.client}
                    </h4>
                    {rev.isLiveLink && rev.url && (
                      <a
                        href={rev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#C74E23] transition-colors"
                        title="Open live website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {rev.tagline}
                  </span>
                  {rev.url && (
                    <a
                      href={rev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C74E23] hover:underline mt-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{rev.displayUrl || rev.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Review Headline & Quote */}
                <h5 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  &ldquo;{rev.headline}&rdquo;
                </h5>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                  {rev.review}
                </p>

                {/* Key Quantitative Metrics */}
                {rev.metrics && (
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 mb-5">
                    {rev.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <span className="text-sm font-black text-[#C74E23] block">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Author Card */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {rev.avatarInitial}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black block">
                      {rev.author}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {rev.role} • {rev.company}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubSectionReviews;
