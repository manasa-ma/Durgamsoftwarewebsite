import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ServiceFinalCTA = ({
  ctaText = 'Start Your Project',
  ctaTo = '/contact',
  title = 'Have a project in mind?',
  subtitle = 'Let’s build something great together.',
  secondaryText = 'Book a Demo',
  secondaryTo = '/book-demo',
}) => {
  return (
    <section className="py-14 md:py-20 bg-white border-t border-stone-200/70 font-sans">
      <div className="container-custom max-w-4xl text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#1A1A1A] text-white shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#FB923C] shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-stone-300 max-w-md mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              to={ctaTo}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={secondaryTo}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors active:scale-95"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFinalCTA;
