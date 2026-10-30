import React from 'react';
import { cn } from '../../utils/helpers';
export const ProductCard = ({ children, className, featured = false }) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-6 md:p-8 border transition-all duration-200 flex flex-col justify-between',
        featured
          ? 'border-brand-orange shadow-lg ring-1 ring-brand-orange/20 relative'
          : 'border-brand-border hover:border-slate-300 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};
