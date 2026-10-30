import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { IndustryCard } from '../../../components/industries/IndustryCard';
import { Button } from '../../../components/buttons/Button';
import { INDUSTRIES_DATA } from '../../../data/industries';
export const IndustriesPreview = () => {
  // Show concise preview of 3 major industries on homepage
  const previewIndustries = INDUSTRIES_DATA.slice(0, 3);
  return (
    <section className="bg-white py-16 md:py-24 border-b border-brand-border">
      <div className="container-custom">
        <SectionHeader
          badge="Who We Serve"
          title="Industries — Specialized Solutions"
          subtitle="Discover tailored point-of-sale and business management solutions designed for distinct industry workflows."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {previewIndustries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>

        {/* Explore Industries CTA */}
        <div className="text-center">
          <Button variant="secondary" size="lg" to="/industries" className="gap-2">
            <span>Explore All Industries</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
