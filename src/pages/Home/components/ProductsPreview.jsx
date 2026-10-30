import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { BillmasterCard } from '../../../components/products/BillmasterCard';
import { HardwareCard } from '../../../components/products/HardwareCard';
import { Button } from '../../../components/buttons/Button';
import { BILLMASTER_PRODUCTS, HARDWARE_PRODUCTS } from '../../../data/products';
export const ProductsPreview = () => {
  // Show concise previews on homepage: 1 billmaster + 2 hardware peripherals
  const featuredBillmaster = BILLMASTER_PRODUCTS[0];
  const featuredHardware = HARDWARE_PRODUCTS.slice(0, 2);
  return (
    <section className="bg-white py-16 md:py-24 border-b border-brand-border">
      <div className="container-custom">
        <SectionHeader
          badge="Product Portfolio"
          title="Products — Billmaster + Hardware"
          subtitle="Explore the Billmaster software suite and certified point-of-sale hardware peripherals built for high performance."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* billmaster Preview Card */}
          <div className="md:col-span-1">
            <BillmasterCard product={featuredBillmaster} />
          </div>

          {/* Hardware Preview Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredHardware.map((item) => (
              <HardwareCard key={item.id} product={item} />
            ))}
          </div>
        </div>

        {/* Explore Products CTA linking to /products */}
        <div className="text-center">
          <Button variant="primary" size="lg" to="/products" className="gap-2">
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
