import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { Badge } from '../common/Badge';

export const MarketingServiceCard = ({ service }) => {
  return (
    <ServiceCard className="min-h-[440px] h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-none bg-brand-light-orange flex items-center justify-center group-hover:bg-brand-orange/15 transition-colors">
            <Megaphone className="w-6 h-6 text-brand-orange" />
          </div>
          <Badge variant="orange">Marketing & SEO</Badge>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-2 leading-snug group-hover:text-brand-orange transition-colors">
          {service.title}
        </h3>

        <p className="text-xs text-brand-secondary-text mb-5 leading-relaxed">
          {service.description}
        </p>

        {/* Sub-services / Capabilities */}
        <div className="space-y-2 mb-6">
          {service.subServices.map((sub, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
              <span className="leading-tight">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-brand-border">
        <Link
          to={service.ctaLink}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
        >
          <span>{service.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </ServiceCard>
  );
};
