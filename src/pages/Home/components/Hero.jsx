import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from './hero/heroSlidesData';
import { Slide1EcosystemVisual } from './hero/Slide1EcosystemVisual';
import { Slide2SoftwareVisual } from './hero/Slide2SoftwareVisual';
import { Slide3MarketingVisual } from './hero/Slide3MarketingVisual';
import { Slide4BillmasterVisual } from './hero/Slide4BillmasterVisual';
import { Slide5WebsiteVisual } from './hero/Slide5WebsiteVisual';
import { Button } from '../../../components/buttons/Button';
import { Badge } from '../../../components/common/Badge';
import { SECTION_IDS } from '../../../utils/constants';
import './hero/Hero.css';
const AUTO_PLAY_INTERVAL = 6000; // 6 seconds normal slide interval
const HOVER_STOP_DURATION = 10000; // 10 seconds stop on hover
export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const containerRef = useRef(null);
  const totalSlides = HERO_SLIDES.length;
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimerKey((prev) => prev + 1);
  }, [totalSlides]);
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimerKey((prev) => prev + 1);
  }, [totalSlides]);
  // When hovering any card, pause / hold slide for 10 seconds
  const handleCardMouseEnter = useCallback(() => {
    setIsHovered(true);
    setTimerKey((prev) => prev + 1);
  }, []);
  const handleCardMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  // Autoplay timer effect (10s on card hover, 6s normal)
  useEffect(() => {
    if (isPaused) return;
    const intervalDuration = isHovered ? HOVER_STOP_DURATION : AUTO_PLAY_INTERVAL;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setTimerKey((prev) => prev + 1);
    }, intervalDuration);
    return () => clearTimeout(timer);
  }, [isPaused, isHovered, timerKey, totalSlides]);
  // Manual button navigation that permanently stops auto movement
  const handlePrevClick = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    prevSlide();
  };

  const handleNextClick = (e) => {
    e?.stopPropagation();
    setIsPaused(true);
    nextSlide();
  };

  const handleDotClick = (index) => {
    setIsPaused(true);
    setCurrentSlide(index);
    setTimerKey((prev) => prev + 1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsPaused(true);
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsPaused(true);
      nextSlide();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPaused((prev) => !prev);
    }
  };

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setIsPaused(true);
      nextSlide();
    } else if (isRightSwipe) {
      setIsPaused(true);
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };
  // Visual Scene mapping
  const renderVisual = (index) => {
    switch (index) {
      case 0:
        return <Slide1EcosystemVisual />;
      case 1:
        return <Slide2SoftwareVisual />;
      case 2:
        return <Slide3MarketingVisual />;
      case 3:
        return <Slide4BillmasterVisual />;
      case 4:
        return <Slide5WebsiteVisual />;
      default:
        return <Slide1EcosystemVisual />;
    }
  };
  return (
    <section
      id={SECTION_IDS.HOME}
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Durgam Soft Digital Solutions Slideshow"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-slate-50/70 mt-0 pt-3 pb-8 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14 border-b border-brand-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      {/* Subtle modern background textures */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-light-orange/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/60 rounded-full blur-3xl" />
      </div>

      {/* Horizontal Sliding Track (Physical Carousel Motion) */}
      <div className="relative w-full overflow-hidden py-2">
        <div
          className="flex w-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 flex-none px-4 sm:px-8 lg:px-[50px]"
                role="tabpanel"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${totalSlides}`}
              >
                <div className="container-custom py-2 sm:py-3 lg:py-[25px]">
                  {/* Slide Card Container with Rich Elevation & Shadow - 50px smaller on all sides */}
                  <div
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                    className={`relative hero-slide-card ${
                      isActive
                        ? 'hero-slide-card-active scale-100 opacity-100'
                        : 'scale-[0.985] opacity-85'
                    } overflow-hidden p-5 sm:p-6 lg:p-8 xl:p-9 transition-all duration-500`}
                  >
                    {/* Card Top Accent Glow Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-navy" />

                    {/* Corner Decorative Subtle Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-light-orange rounded-full blur-3xl pointer-events-none opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-100 rounded-full blur-3xl pointer-events-none opacity-60" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-[390px] sm:min-h-[430px] lg:min-h-[450px]">
                      {/* Left Column: Eyebrow, Headline, Subheading, CTAs, Supporting labels */}
                      <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5">
                        {/* Eyebrow Badge */}
                        <div>
                          <Badge variant="orange" className="mb-2 tracking-wider font-bold">
                            {slide.eyebrow}
                          </Badge>
                        </div>

                        {/* Headline with Orange Accent */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-brand-navy tracking-tight leading-[1.15]">
                          {slide.headline.lead}
                          <span className="text-brand-orange">{slide.headline.highlight}</span>
                          {slide.headline.tail}
                        </h1>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg lg:text-xl text-brand-secondary-text max-w-2xl leading-relaxed">
                          {slide.subheading}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                          <Button
                            variant="primary"
                            size="lg"
                            to={slide.primaryCta.to}
                            className="gap-2 shadow-md hover:shadow-lg transition-all"
                          >
                            <span>{slide.primaryCta.label}</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="lg"
                            to={slide.secondaryCta.to}
                            className="hover:border-brand-orange hover:text-brand-orange transition-colors"
                          >
                            {slide.secondaryCta.label}
                          </Button>
                        </div>

                        {/* Supporting Labels / Value Indicators */}
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            {slide.supportingLabels.map((label, labelIdx) => (
                              <div
                                key={labelIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-semibold text-brand-navy hover:border-orange-200 hover:bg-orange-50/50 transition-colors shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                                <span>{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Visual Scene */}
                      <div className="lg:col-span-5 relative flex items-center justify-center">
                        <div className="w-full">{renderVisual(idx)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side Navigation Buttons (Previous / Next) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 sm:px-4 lg:px-6">
          {/* Left / Previous Slide Button */}
          <button
            type="button"
            onClick={handlePrevClick}
            aria-label="Previous Slide (Stops auto-movement)"
            title="Previous Slide"
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-brand-navy hover:text-brand-orange border border-slate-200/90 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Right / Next Slide Button */}
          <button
            type="button"
            onClick={handleNextClick}
            aria-label="Next Slide (Stops auto-movement)"
            title="Next Slide"
            className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-brand-navy hover:text-brand-orange border border-slate-200/90 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Carousel Pagination Dots (Small, Round Buttons Indicating Active Slide) */}
      <div
        className="relative z-30 flex items-center justify-center pt-2 sm:pt-3"
        role="tablist"
        aria-label="Carousel slide navigation"
      >
        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id || idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                title={`Slide ${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(idx);
                }}
                className="p-1 sm:p-1.5 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange transition-transform cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-brand-orange ring-2 ring-orange-500/30 shadow-xs scale-105'
                      : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
