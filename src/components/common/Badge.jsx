import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = ({ children, variant = 'orange', className }) => {
  const variantStyles = {
    orange: 'bg-orange-50 text-[#B83E15] border border-orange-200',
    navy: 'bg-slate-100 text-brand-navy border border-slate-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
