import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const TestimonialCarousel = ({
  reviews = [],
  badge = 'Client Feedback',
  title = 'What Our Clients Say',
  subtitle = 'Real reviews from business owners running software built by Durgam Soft.',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const totalReviews = reviews.length;

  const nextSlide = useCallback(() => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const prevSlide = useCallback(() => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  // Auto-slide every 5 seconds (pauses on hover/touch)
  useEffect(() => {
    if (isPaused || totalReviews <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, totalReviews, nextSlide]);

  if (!reviews || reviews.length === 0) return null;

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX) > 45) {
      if (touchDeltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsPaused(false);
  };

  const current = reviews[currentIndex];

  return (
    <section className="py-14 md:py-20 bg-[#FAF7F2] border-t border-stone-200/70 font-sans">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Card with Smooth Fade/Transition */}
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/90 shadow-sm transition-all duration-500 relative min-h-[260px] sm:min-h-[240px] flex flex-col justify-between group">
            {/* Top Stars & Verified Tag */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-black text-black ml-1.5">5.0</span>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{current.date || 'Verified Review'}</span>
              </span>
            </div>

            {/* Headline & 2-3 Line Review */}
            <div className="my-2">
              {current.headline && (
                <h3 className="text-base sm:text-lg font-black text-black mb-2 tracking-tight">
                  &ldquo;{current.headline}&rdquo;
                </h3>
              )}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal line-clamp-4">
                {current.review}
              </p>
            </div>

            {/* Author, Company & External Link */}
            <div className="pt-5 mt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C74E23] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {current.avatarInitial || current.author?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black leading-tight">
                    {current.author}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {current.role} • {current.company}
                  </p>
                </div>
              </div>

              {current.url && (
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C74E23] hover:underline self-start sm:self-center"
                >
                  <span>{current.displayUrl || current.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Controls: Previous / Next Buttons */}
          {totalReviews > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-slate-700 hover:text-black shadow-2xs transition-all active:scale-95 cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-slate-700 hover:text-black shadow-2xs transition-all active:scale-95 cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots Indicators */}
              <div className="flex items-center gap-1">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className="p-2 cursor-pointer flex items-center justify-center min-w-[28px] min-h-[28px]"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span
                      className={`h-2 rounded-full transition-all duration-300 block ${
                        idx === currentIndex ? 'w-6 bg-[#C74E23]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
