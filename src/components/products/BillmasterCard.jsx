import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Badge } from '../common/Badge';
import { Button } from '../buttons/Button';
export const BillmasterCard = ({ product }) => {
  return (
    <ProductCard featured className="relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant="orange">{product.category}</Badge>
          <span className="text-xs font-mono text-slate-400">billmaster OS</span>
        </div>

        <h3 className="text-2xl font-bold text-brand-navy mb-2">{product.name}</h3>

        <p className="text-sm font-semibold text-brand-orange mb-3">{product.tagline}</p>

        <p className="text-sm text-brand-secondary-text mb-6 leading-relaxed">
          {product.description}
        </p>

        {/* Product Visual Mockup */}
        <div className="h-48 mb-6 overflow-hidden rounded-lg border border-slate-200/80 bg-white group">
          <img
            src="/images/billmaster-product-card.webp"
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 mb-8">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm text-brand-secondary-text">
              <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-brand-border">
        {product.ctaLink?.startsWith('http') ? (
          <a
            href={product.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md text-sm px-5 py-2.5 bg-brand-orange text-white hover:bg-brand-orange-hover focus:ring-brand-orange shadow-xs font-semibold gap-2"
          >
            <span>{product.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <Button variant="primary" to={product.ctaLink} className="w-full gap-2">
            <span>{product.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ProductCard>
  );
};
