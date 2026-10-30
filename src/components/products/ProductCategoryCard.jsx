import React from 'react';
import { ProductCard } from './ProductCard';
export const ProductCategoryCard = ({ category }) => {
  return (
    <ProductCard className="border-l-4 border-l-brand-orange bg-gradient-to-r from-brand-light-gray to-white">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-brand-orange font-bold mb-2">
          {category.itemCountPlaceholder}
        </div>
        <h4 className="text-lg font-bold text-brand-navy mb-2">{category.title}</h4>
        <p className="text-sm text-brand-secondary-text">{category.description}</p>
      </div>
    </ProductCard>
  );
};
