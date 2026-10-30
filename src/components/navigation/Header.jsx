import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { cn } from '../../utils/helpers';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-200',
        isScrolled ? 'shadow-md border-b border-brand-border' : 'shadow-xs border-b border-brand-border'
      )}
    >
      <Navbar />
    </header>
  );
};

export default Header;
