import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { ServicesPreview } from './components/ServicesPreview';
import { updatePageMeta } from '../../utils/seo';

export const HomePage = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Durgam Soft Pvt. Ltd. | Software Products & Technology Solutions',
      description:
        'Durgam Soft Pvt. Ltd. is a software product and technology company offering billmaster billing software, business applications, billing hardware, web and mobile app development, desktop applications, and digital solutions for businesses.',
      canonical: 'https://www.durgamsoft.com/',
      image: 'https://www.durgamsoft.com/logos/durgamsoft-logo.webp',
    });
  }, []);

  return (
    <>
      {/* 1. Hero Slideshow */}
      <Hero />

      {/* Video Showcase Section */}
      <VideoSection />

      {/* 2. What We Do (Services Showcase) */}
      <ServicesPreview />
    </>
  );
};

export default HomePage;
