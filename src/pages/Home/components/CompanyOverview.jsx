import React from 'react';
import { Layers, ShieldCheck, Cpu, Headphones } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { COMPANY_OVERVIEW_DATA } from '../../../data/about';
export const CompanyOverview = () => {
  return (
    <section
      id="company-overview"
      className="bg-brand-light-gray py-16 md:py-24 border-b border-brand-border"
    >
      <div className="container-custom">
        <SectionHeader
          badge="Company Overview"
          title={COMPANY_OVERVIEW_DATA.headline}
          subtitle={COMPANY_OVERVIEW_DATA.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white border border-brand-border shadow-xs hover:border-brand-orange/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-brand-light-orange flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-brand-orange" />
            </div>
            <h4 className="text-base font-bold text-brand-navy mb-2">Integrated Billing</h4>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              [PILLAR_DESCRIPTION_PLACEHOLDER]
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-brand-border shadow-xs hover:border-brand-orange/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-brand-light-orange flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5 text-brand-orange" />
            </div>
            <h4 className="text-base font-bold text-brand-navy mb-2">Hardware Compatibility</h4>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              [PILLAR_DESCRIPTION_PLACEHOLDER]
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-brand-border shadow-xs hover:border-brand-orange/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-brand-light-orange flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-brand-orange" />
            </div>
            <h4 className="text-base font-bold text-brand-navy mb-2">Reliable Engineering</h4>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              [PILLAR_DESCRIPTION_PLACEHOLDER]
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-brand-border shadow-xs hover:border-brand-orange/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-brand-light-orange flex items-center justify-center mb-4">
              <Headphones className="w-5 h-5 text-brand-orange" />
            </div>
            <h4 className="text-base font-bold text-brand-navy mb-2">Dedicated Support</h4>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              [PILLAR_DESCRIPTION_PLACEHOLDER]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
