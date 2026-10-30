import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const VideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Helper to safely reset video time to 0 seconds
    const safelyResetTime = () => {
      try {
        video.currentTime = 0;
      } catch {
        // Ignored if browser has not yet loaded seekable media buffer
      }
    };

    // Triggered whenever the user comes to this section: always resets to 0 and runs from the beginning
    const handleEnterSection = () => {
      safelyResetTime();

      // If video metadata isn't ready yet, reset again as soon as it loads
      if (video.readyState < 1) {
        const onMeta = () => {
          safelyResetTime();
          video.removeEventListener('loadedmetadata', onMeta);
        };
        video.addEventListener('loadedmetadata', onMeta);
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Confirm playback is at 0 seconds
            if (video.currentTime > 0.3) {
              safelyResetTime();
            }
          })
          .catch(() => {
            // Browser policy fallback: mute and replay if unmuted autoplay is blocked
            video.muted = true;
            setIsMuted(true);
            safelyResetTime();
            video.play().catch((e) => console.log('Autoplay deferred:', e));
          });
      }
    };

    // Triggered whenever the user leaves this section: pauses and resets back to 0 seconds
    const handleLeaveSection = () => {
      video.pause();
      safelyResetTime();
    };

    // IntersectionObserver to auto-play from 0s when user sees the section, and reset to 0s when user leaves
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;

        if (inView) {
          if (!isIntersectingRef.current) {
            isIntersectingRef.current = true;
            handleEnterSection();
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
          if (isIntersectingRef.current) {
            isIntersectingRef.current = false;
            handleLeaveSection();
          } else {
            handleLeaveSection();
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.5],
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(section);

    // Pause and reset to 0s if user switches tabs or window loses visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isIntersectingRef.current = false;
        handleLeaveSection();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section
      id="services-video"
      ref={sectionRef}
      className="bg-white mt-0 py-12 md:py-16 border-b border-brand-border relative z-10"
    >
      <div className="container-custom max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            See Our Solutions In Action
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Take a quick walkthrough of Durgam Soft's enterprise engineering capabilities, smart billing suite, and digital services.
          </p>
        </div>

        {/* Video Player Card Container */}
        <div className="relative mx-auto rounded-2xl bg-white p-2.5 sm:p-4 shadow-xl border border-slate-200/90 overflow-hidden group">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] via-amber-400 to-[#0B1F3A]" />

          {/* 16:9 Responsive Video Element */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0B1F3A] shadow-inner">
            <video
              ref={videoRef}
              controls
              playsInline
              muted={isMuted}
              loop
              preload="metadata"
              className="w-full h-full object-cover rounded-xl"
              aria-label="Durgam Soft Services Showcase Video"
            >
              <source src="/videos/services-showcase.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Quick Unmute / Mute floating pill */}
            <button
              type="button"
              onClick={toggleSound}
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
