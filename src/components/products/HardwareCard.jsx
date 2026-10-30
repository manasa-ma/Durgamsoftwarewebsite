import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Scan, FileText, Layers, Tag, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Badge } from '../common/Badge';
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Thermal Printers':
      return <Printer className="w-6 h-6 text-brand-orange" />;
    case 'Barcode Scanners':
      return <Scan className="w-6 h-6 text-brand-orange" />;
    case 'Label Printers':
      return <Layers className="w-6 h-6 text-brand-orange" />;
    case 'Paper Rolls':
      return <FileText className="w-6 h-6 text-brand-orange" />;
    case 'Labels':
      return <Tag className="w-6 h-6 text-brand-orange" />;
    default:
      return <Printer className="w-6 h-6 text-brand-orange" />;
  }
};
export const HardwareCard = ({ product }) => {
  return (
    <ProductCard className="hover:border-brand-orange/40">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-brand-light-orange flex items-center justify-center">
            {getCategoryIcon(product.category)}
          </div>
          <Badge variant="gray">{product.category}</Badge>
        </div>

        <h3 className="text-xl font-bold text-brand-navy mb-2">{product.name}</h3>

        <p className="text-sm text-brand-secondary-text mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Specifications placeholder list */}
        <div className="space-y-1.5 mb-6 text-xs text-brand-secondary-text bg-brand-light-gray p-3 rounded-lg border border-brand-border">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-brand-border flex items-center justify-between">
        <Link
          to={product.ctaLink}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
        >
          <span>{product.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </ProductCard>
  );
};
