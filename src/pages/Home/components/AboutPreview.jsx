import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { CompanyIntro } from '../../../components/about/CompanyIntro';
import { Button } from '../../../components/buttons/Button';
export const AboutPreview = () => {
  return (
    <section className="bg-brand-light-gray py-16 md:py-24 border-b border-brand-border">
      <div className="container-custom">
        <SectionHeader
          badge="About Durgam Soft"
          title="About Us — Company Overview"
          subtitle="Learn more about our organizational foundation, engineering values, and executive leadership."
        />

        {/* Company Overview Intro */}
        <div className="mb-12">
          <CompanyIntro />
        </div>

        {/* Learn About Us CTA linking to /about */}
        <div className="text-center">
          <Button variant="secondary" size="lg" to="/about" className="gap-2">
            <span>Learn More About Us</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
