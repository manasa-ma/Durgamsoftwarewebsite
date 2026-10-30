import React from 'react';
import { cn } from '../../utils/helpers';
export const ServiceCard = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rounded-none bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-orange/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
};
