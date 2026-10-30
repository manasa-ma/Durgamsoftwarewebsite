import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Smartphone, Monitor, Receipt, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { Badge } from '../common/Badge';

const getBadgeText = (id) => {
  if (id === 'web-development') return 'Web Apps';
  if (id === 'mobile-development') return 'Mobile Apps';
  if (id === 'billing-software') return 'Billing Software';
  if (id === 'desktop-development') return 'Desktop Apps';
  return 'Development';
};

const getDevIcon = (title) => {
  if (title.toLowerCase().includes('web')) {
    return <Globe className="w-6 h-6 text-brand-orange" />;
  }
  if (title.toLowerCase().includes('mobile')) {
    return <Smartphone className="w-6 h-6 text-brand-orange" />;
  }
  if (title.toLowerCase().includes('bill')) {
    return <Receipt className="w-6 h-6 text-brand-orange" />;
  }
  return <Monitor className="w-6 h-6 text-brand-orange" />;
};

export const DevelopmentServiceCard = ({ service }) => {
  const isBilling = service.id.includes('bill') || service.title.toLowerCase().includes('bill');
  const badgeText = getBadgeText(service.id);

  return (
    <ServiceCard
      className={`min-h-[440px] h-full ${
        isBilling ? 'border-orange-200 hover:border-brand-orange' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-none flex items-center justify-center transition-colors ${
              isBilling
                ? 'bg-orange-100 group-hover:bg-brand-orange/20'
                : 'bg-brand-light-orange group-hover:bg-brand-orange/15'
            }`}
          >
            {getDevIcon(service.title)}
          </div>
          <Badge variant={isBilling ? 'orange' : 'navy'}>
            {badgeText}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-2 leading-snug group-hover:text-brand-orange transition-colors">
          {service.title}
        </h3>

        <p className="text-xs text-brand-secondary-text mb-5 leading-relaxed">
          {service.description}
        </p>

        {/* Sub-services list */}
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
