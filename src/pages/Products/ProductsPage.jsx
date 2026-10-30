import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SectionHeader } from '../../components/common/SectionHeader';
import { BillmasterCard } from '../../components/products/BillmasterCard';
import { HardwareCard } from '../../components/products/HardwareCard';
import { Button } from '../../components/buttons/Button';
import { BILLMASTER_PRODUCTS, HARDWARE_PRODUCTS } from '../../data/products';
import { updatePageMeta } from '../../utils/seo';
import { FollowOnSocial } from '../../components/common/FollowOnSocial';
export const ProductsPage = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Products — Billmaster & Hardware Solutions',
      description:
        'Explore the full product suite from Durgam Soft, including Billmaster billing software, mobile apps, and certified POS hardware peripherals.',
    });
  }, []);
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Products' }]} />

      {/* Page Header */}
      <section className="bg-brand-light-gray py-12 md:py-16 border-b border-brand-border">
        <div className="container-custom">
          <SectionHeader
            badge="Product Catalog"
            title="Durgam Soft Products"
            subtitle="Explore enterprise-grade billing software and certified hardware peripherals built to accelerate commercial operations."
            align="center"
          />

          {/* Quick Category Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
            <Link
              to="/products/billmaster"
              className="p-6 rounded-xl bg-white border border-brand-border hover:border-brand-orange hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-light-orange flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors">
                <Layers className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors flex items-center justify-between">
                  <span>Billmaster Suite</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-brand-secondary-text mt-1">
                  Billing software and mobile application platform.
                </p>
              </div>
            </Link>

            <Link
              to="/products/hardware"
              className="p-6 rounded-xl bg-white border border-brand-border hover:border-brand-orange hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-light-orange flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors">
                <Cpu className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors flex items-center justify-between">
                  <span>POS Hardware</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-brand-secondary-text mt-1">
                  Thermal printers, barcode scanners, and supplies.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* billmaster Section */}
      <section className="py-16 border-b border-brand-border">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Billmaster Ecosystem</h2>
              <p className="text-sm text-brand-secondary-text">
                Point-of-sale and business management software systems.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              to="/products/billmaster"
              className="gap-1.5 self-start sm:self-auto"
            >
              <span>View Billmaster Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BILLMASTER_PRODUCTS.map((product) => (
              <BillmasterCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-16 bg-brand-light-gray border-b border-brand-border">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Hardware & POS Peripherals</h2>
              <p className="text-sm text-brand-secondary-text">
                Certified printers, scanners, and consumables tested for Billmaster.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              to="/products/hardware"
              className="gap-1.5 self-start sm:self-auto"
            >
              <span>View Hardware Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HARDWARE_PRODUCTS.map((product) => (
              <HardwareCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-16 bg-brand-navy text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Hardware & Software Bundle?</h2>
          <p className="text-slate-300 mb-8 text-sm md:text-base leading-relaxed">
            Our engineers can help tailor Billmaster and point-of-sale peripherals for your specific
            retail or restaurant workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" to="/book-demo">
              Book a Demo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              to="/contact"
              className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Follow on Social (Facebook & Instagram) */}
      <FollowOnSocial />
    </div>
  );
};
export default ProductsPage;
