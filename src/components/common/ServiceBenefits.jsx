import React from 'react';

export const ServiceBenefits = ({
  isProcess = false,
  badge = 'Why Choose Us',
  title = 'Key Benefits',
  subtitle = 'Engineered for exceptional performance and measurable business growth.',
  items = [],
}) => {
  return (
    <section className="py-14 md:py-20 bg-[#FAF7F2] border-t border-stone-200/70 font-sans">
      <div className="container-custom max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B83E15] block mb-2">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F2] border border-orange-100/80 flex items-center justify-center text-[#C74E23] mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                  {item.icon}
                </div>

                {isProcess && (
                  <span className="text-xs font-bold font-mono text-[#B83E15] block mb-1">
                    STEP 0{idx + 1}
                  </span>
                )}

                <h3 className="text-lg font-black text-black tracking-tight mb-2 group-hover:text-[#C74E23] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
