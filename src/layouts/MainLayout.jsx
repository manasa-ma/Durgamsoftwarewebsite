import React, { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/layout/Footer';

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-20" aria-busy="true">
    <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[#C74E23] animate-spin" />
  </div>
);

export const MainLayout = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top upon navigating to a new route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-primary-text">
      {/* Shared Header Navigation */}
      <Header />

      {/* Dynamic Page Content & Shared Footer wrapped in Suspense to prevent layout shift */}
      <Suspense fallback={<PageFallback />}>
        <main className="flex-grow">
          {children || <Outlet />}
        </main>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MainLayout;
