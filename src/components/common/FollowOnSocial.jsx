import React from 'react';

export const FacebookAppIcon = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="11" fill="#1877F2" />
    <path
      fill="#ffffff"
      d="M29.5 25.5h-4.4v14h-5.8v-14H16v-5.2h3.3v-3.7c0-2.8 1.3-6.9 6.9-6.9l5 .02v5.3h-3.6c-.6 0-1.2.3-1.2 1.4v3.9h5l-.8 5.2z"
    />
  </svg>
);

export const InstagramAppIcon = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="ig-app-bg" cx="20%" cy="105%" r="135%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="10%" stopColor="#fdf497" />
        <stop offset="35%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="11" fill="url(#ig-app-bg)" />
    <rect
      x="12"
      y="12"
      width="24"
      height="24"
      rx="6.5"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.6"
    />
    <circle cx="24" cy="24" r="5.5" fill="none" stroke="#ffffff" strokeWidth="2.6" />
    <circle cx="31.5" cy="16.5" r="1.4" fill="#ffffff" />
  </svg>
);

// Backward-compatibility aliases
export const FacebookIcon = FacebookAppIcon;
export const InstagramIcon = InstagramAppIcon;

export const FollowOnSocial = ({
  className = '',
  heading = 'Follow on Social Media',
}) => {
  const facebookUrl =
    'https://www.facebook.com/people/Billmaster/61569207380121/?rdid=vTqZqnHUQO3l293t&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1VVSTddrSZ%2F';
  const instagramUrl =
    'https://www.instagram.com/billmasterapp?dlrf=MTdubDB1d3p1dDQ5OA%3D%3D';

  return (
    <section className={`py-12 sm:py-16 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] border-t border-stone-200/80 relative overflow-hidden ${className}`}>
      {/* Subtle ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl"
      />

      <div className="container-custom max-w-4xl text-center relative z-10">
        {/* Main Heading with Highlight */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
          {heading === 'Follow on Social Media' ? (
            <>
              Follow on <span className="text-[#C74E23]">Social Media</span>
            </>
          ) : (
            heading
          )}
        </h3>

        {/* Decorative Brand Accent Line */}
        <div className="w-14 h-1 bg-gradient-to-r from-[#C74E23] via-amber-500 to-[#C74E23] rounded-full mx-auto mt-3 mb-8" />

        {/* Official App Icons */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Billmaster on Facebook"
            title="Facebook"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 block cursor-pointer group"
          >
            <FacebookAppIcon className="w-full h-full transition-transform duration-300 group-hover:scale-105" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Billmaster on Instagram"
            title="Instagram"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 block cursor-pointer group"
          >
            <InstagramAppIcon className="w-full h-full transition-transform duration-300 group-hover:scale-105" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FollowOnSocial;
