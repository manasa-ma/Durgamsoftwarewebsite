import React, { useEffect } from 'react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { HardwareCard } from '../../../components/products/HardwareCard';
import { Button } from '../../../components/buttons/Button';
import { HARDWARE_PRODUCTS } from '../../../data/products';
import { updatePageMeta } from '../../../utils/seo';
import { FollowOnSocial } from '../../../components/common/FollowOnSocial';
export const HardwarePage = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'POS Hardware & Peripherals — Durgam Soft',
      description:
        'Certified point-of-sale hardware peripherals including thermal printers, barcode scanners, label printers, and supplies verified for Billmaster.',
    });
  }, []);
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: 'Our Products', to: '/products' }, { label: 'Hardware' }]} />

      {/* Header */}
      <section className="bg-brand-light-gray py-14 md:py-20 border-b border-brand-border">
        <div className="container-custom">
          <SectionHeader
            badge="POS Peripherals"
            title="Point-of-Sale Hardware & Supplies"
            subtitle="Industrial-grade thermal printers, barcode scanners, label printers, and genuine paper supplies certified for Billmaster integration."
            align="center"
          />
        </div>
      </section>

      {/* Hardware Grid */}
      <section className="py-16 border-b border-brand-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HARDWARE_PRODUCTS.map((prod) => (
              <HardwareCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Quote CTA */}
      <section className="py-16 bg-brand-navy text-white text-center">
        <div className="container-custom max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Inquire About Bulk Hardware Bundles</h2>
          <p className="text-slate-300 text-sm md:text-base mb-8">
            Get in touch with our team for certified hardware bundles, POS accessories, and
            procurement advice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" to="/contact">
              Request Hardware Quote
            </Button>
            <Button
              variant="secondary"
              size="lg"
              to="/products/billmaster"
              className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              Explore Billmaster Software
            </Button>
          </div>
        </div>
      </section>

      {/* Follow on Social (Facebook & Instagram) */}
      <FollowOnSocial />
    </div>
  );
};
export default HardwarePage;
