import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { DevelopmentServiceCard } from '../../../components/services/DevelopmentServiceCard';
import { MarketingServiceCard } from '../../../components/services/MarketingServiceCard';
import { Button } from '../../../components/buttons/Button';
import { SERVICES_DATA } from '../../../data/services';
export const ServicesPreview = () => {
  const devServices = SERVICES_DATA.filter((s) => s.group === 'Application Development');
  const marketingServices = SERVICES_DATA.filter((s) => s.group === 'Digital Marketing');
  return (
    <section id="products" className="bg-brand-light-gray mt-0 relative z-10 border-t border-b border-brand-border py-16 md:py-24">
      <div className="container-custom">
        <SectionHeader
          title="What We Do"
          subtitle="Full-cycle software engineering and targeted digital growth services designed to scale your enterprise."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {devServices.map((service) => (
            <DevelopmentServiceCard key={service.id} service={service} />
          ))}
          {marketingServices.map((service) => (
            <MarketingServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Explore Services CTA linking to /services */}
        <div className="text-center">
          <Button variant="primary" size="lg" to="/services" className="gap-2">
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
