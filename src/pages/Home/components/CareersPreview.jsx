import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { Button } from '../../../components/buttons/Button';
import { Badge } from '../../../components/common/Badge';
import { CAREERS_DATA } from '../data';
export const CareersPreview = () => {
  return (
    <section className="bg-brand-light-gray py-16 md:py-24 border-b border-brand-border">
      <div className="container-custom">
        <SectionHeader
          badge="Careers"
          title={CAREERS_DATA.headline}
          subtitle={CAREERS_DATA.description}
        />

        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {CAREERS_DATA.positions.slice(0, 2).map((pos) => (
            <div
              key={pos.id}
              className="p-6 rounded-xl bg-white border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-orange/40 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="navy">{pos.category}</Badge>
                </div>
                <h4 className="text-lg font-bold text-brand-navy">{pos.title}</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-secondary-text mt-2">
                  <span>Location: {pos.location}</span>
                  <span>Type: {pos.employmentType}</span>
                </div>
              </div>

              <div>
                <Button variant="secondary" size="sm" to="/careers">
                  View Role
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="primary" size="lg" to="/careers" className="gap-2">
            <Briefcase className="w-4 h-4" />
            <span>View All Careers</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
