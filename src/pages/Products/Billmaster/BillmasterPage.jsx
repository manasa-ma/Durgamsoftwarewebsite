import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Boxes,
  BarChart3,
  Barcode,
  Smartphone,
  Cloud,
  Users,
  FileBarChart,
  ShieldCheck,
  ArrowRight,
  Store,
  Utensils,
  Shirt,
  ShoppingCart,
  Truck,
  Printer,
  ScanLine,
  Scroll,
  Package,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { Button } from '../../../components/buttons/Button';
import { updatePageMeta } from '../../../utils/seo';
import { FollowOnSocial } from '../../../components/common/FollowOnSocial';

const KEY_FEATURES = [
  {
    icon: Receipt,
    title: 'Fast Billing & Invoicing',
  },
  {
    icon: Boxes,
    title: 'Stock & Inventory',
  },
  {
    icon: Users,
    title: 'Customer Management',
  },
  {
    icon: FileBarChart,
    title: 'Detailed Reports',
  },
  {
    icon: Smartphone,
    title: 'Multi-Device Access',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
  },
];

const BUSINESS_SECTORS = [
  {
    title: 'Retail Stores',
    description: 'Faster billing, better inventory control.',
    image: '/images/billmaster-sector-retail.webp',
    icon: Store,
  },
  {
    title: 'Restaurants & Cafés',
    description: 'Manage orders, tables and bills with ease.',
    image: '/images/billmaster-sector-restaurant.webp',
    icon: Utensils,
  },
  {
    title: 'Clothing & Fashion',
    description: 'Track stock and sales seamlessly.',
    image: '/images/billmaster-sector-fashion.webp',
    icon: Shirt,
  },
  {
    title: 'Supermarkets',
    description: 'Handle high volume with confidence.',
    image: '/images/billmaster-sector-supermarket.webp',
    icon: ShoppingCart,
  },
  {
    title: 'Wholesale & Distribution',
    description: 'Complete control over inventory and sales.',
    image: '/images/billmaster-sector-wholesale.webp',
    icon: Truck,
  },
];

const HARDWARE_QUICK_BADGES = [
  { label: 'Printers', icon: Printer },
  { label: 'Scanners', icon: ScanLine },
  { label: 'Paper Rolls', icon: Scroll },
];

const HARDWARE_ITEMS = [
  {
    title: 'Thermal Printers',
    description: 'Print clear receipts, every time.',
    image: '/images/hardware-thermal-printer.webp',
  },
  {
    title: 'Barcode Scanners',
    description: 'Fast and accurate scanning.',
    image: '/images/hardware-barcode-scanner.webp',
  },
  {
    title: 'Thermal Paper Rolls',
    description: 'Compatible with major printers.',
    image: '/images/hardware-paper-rolls.webp',
  },
];

export const BillmasterPage = () => {
  useEffect(() => {
    updatePageMeta({
      title: 'Billmaster — Smart Billing. Greater Control. | Durgam Soft',
      description:
        'Billmaster is our powerful billing software and mobile app designed to simplify daily retail, restaurant, and enterprise operations.',
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Our Products' }]} />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 border-b border-brand-border bg-gradient-to-b from-slate-50/70 via-white to-white">
        {/* Soft background ambient glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              {/* Tag / Badge */}
              <div className="inline-block mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange">
                  OUR PRODUCTS
                </span>
              </div>

              {/* Main Brand Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-none">
                Billmaster
              </h1>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-brand-navy mt-3 tracking-tight leading-tight">
                Smart Billing. Greater Control.
              </h2>

              {/* Descriptive Copy */}
              <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-xl leading-relaxed">
                Billmaster is our powerful billing software and mobile app designed to simplify your
                daily operations. From sales and inventory to reports and customer management —
                everything you need in one place.
              </p>

              {/* 6 Mini Feature Bullets (2 rows x 3 columns) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-4 mt-7 max-w-lg">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <Receipt className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Billing & Invoicing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <Boxes className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Inventory Management</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Sales Reports</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <Barcode className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Barcode Integration</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <Smartphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Mobile App</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <Cloud className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-navy shrink-0" />
                  <span>Cloud Access</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <a
                  href="https://billmasterapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-orange text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-all shadow-orange-500/20 active:scale-95"
                >
                  <span>Explore Billmaster App</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Button
                  variant="secondary"
                  to="/book-demo"
                  className="px-7 py-3 rounded-full border-2 border-brand-navy text-brand-navy font-bold text-sm hover:bg-brand-navy hover:text-white transition-all"
                >
                  Book a Demo
                </Button>
              </div>
            </div>

            {/* Right Graphic Column: Devices Mockup */}
            <div className="lg:col-span-6 relative flex items-center justify-center mt-4 lg:mt-0">
              <div className="relative w-full max-w-xl aspect-[16/9] transition-transform duration-500 hover:scale-[1.01]">
                <picture>
                  <source srcSet="/images/billmaster-smart-billing.webp" type="image/webp" />
                  <img
                    src="/images/billmaster-smart-billing.webp"
                    alt="Billmaster Smart Billing — Mobile App, 2 Inch Printer, Barcode Scanner, and Cloud Dashboard"
                    width={576}
                    height={324}
                    loading="eager"
                    fetchpriority="high"
                    className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5">
              <div className="w-10 h-1 bg-brand-orange rounded-full mb-3" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                Key Features
              </h2>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy mt-1">
                Everything You Need for a Smarter Business
              </h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-md">
                Billmaster helps you manage sales, inventory, customers, and reports with simple and
                easy-to-use tools.
              </p>
            </div>

            {/* Right Cards Grid (3 cols x 2 rows) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {KEY_FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-orange/40 transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-brand-navy leading-snug group-hover:text-brand-orange transition-colors">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BILLMASTER FOR EVERY BUSINESS SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-brand-border">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-orange rounded-xs inline-block shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                Billmaster for Every Business
              </h2>
            </div>
            <a
              href="#features"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-700 hover:text-brand-orange transition-colors"
            >
              <span>VIEW ALL FEATURES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 5 Industry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BUSINESS_SECTORS.map((sector) => {
              const IconComp = sector.icon;
              return (
                <div
                  key={sector.title}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Photo Container */}
                    <div className="h-32 sm:h-36 overflow-hidden relative bg-slate-100">
                      <picture>
                        <source srcSet={sector.image} type="image/webp" />
                        <img
                          src={sector.image}
                          alt={sector.title}
                          loading="lazy"
                          decoding="async"
                          width={280}
                          height={144}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </picture>
                      {/* Top-Right Circular Orange Badge */}
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      {/* Bottom-Left Pill Badge Overlapping Photo */}
                      <div className="absolute -bottom-2.5 left-3 w-7 h-7 rounded-lg bg-white shadow-md border border-slate-100 flex items-center justify-center text-brand-orange z-10">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Card Text Content */}
                    <div className="pt-4 p-3.5 sm:p-4">
                      <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                        {sector.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {sector.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Right Arrow */}
                  <div className="px-4 pb-3.5 flex justify-end">
                    <span className="text-sky-500 group-hover:text-brand-orange group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. USE BILLMASTER ON ANY DEVICE SECTION */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="container-custom">
          <div className="rounded-3xl bg-gradient-to-br from-[#EBF3FA] via-[#F0F5FA] to-[#E6F0F9] border border-slate-200/80 p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column (6 cols) */}
              <div className="lg:col-span-6 z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                  Use Billmaster on Any Device
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2.5">
                  Work from your desktop, tablet or mobile — anytime, anywhere.
                </p>

                {/* Platform Badges */}
                <div className="flex flex-wrap items-center gap-3.5 mt-8">
                  {/* Windows */}
                  <a
                    href="https://www.durgamsoft.com/downloads/billmastersetup.exe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-24 sm:w-28 h-28 bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-brand-orange/60 hover:-translate-y-1 transition-all group cursor-pointer"
                    title="Download Billmaster for Windows"
                  >
                    <svg
                      className="w-8 h-8 text-[#00A4EF] mb-2 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm0 17.1L9.75 21.9v-9.45H0v8.099zm10.702 1.35l13.298 1.901V11.55H10.702v10.35zm0-19.8L24 0.2v11.35H10.702V2.1z" />
                    </svg>
                    <span className="text-xs font-bold text-brand-navy group-hover:text-brand-orange transition-colors">Windows</span>
                    <span className="text-[10px] text-slate-500 font-medium">Desktop</span>
                  </a>

                  {/* Android */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.durgamsoft.com.dsmartpos&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-24 sm:w-28 h-28 bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-brand-orange/60 hover:-translate-y-1 transition-all group cursor-pointer"
                    title="Get Billmaster on Google Play Store"
                  >
                    <svg
                      className="w-8 h-8 text-[#3DDC84] mb-2 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8564 8 12 8s-3.5902.411-5.1368.9507L4.841 5.4477a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                    </svg>
                    <span className="text-xs font-bold text-brand-navy group-hover:text-brand-orange transition-colors">Android</span>
                    <span className="text-[10px] text-slate-500 font-medium">Mobile App</span>
                  </a>
                </div>
              </div>

              {/* Right Column (6 cols): Sync Devices Graphic */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <picture>
                  <source srcSet="/images/billmaster-device-sync.webp" type="image/webp" />
                  <img
                    src="/images/billmaster-device-sync.webp"
                    alt="Billmaster across Desktop, Tablet and Mobile"
                    loading="lazy"
                    decoding="async"
                    width={576}
                    height={324}
                    className="w-full max-w-lg lg:max-w-xl aspect-[16/9] object-contain drop-shadow-2xl rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HARDWARE & SUPPLIES SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FFF9F3] via-white to-white border-b border-brand-border relative overflow-hidden">
        {/* Soft peach ambient background glow */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Top Hero: Content + Device Bundle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
            {/* Left Column */}
            <div className="lg:col-span-6">
              {/* Badge */}
              <div className="inline-block mb-2.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100/90 text-brand-orange">
                  OUR PRODUCTS
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-navy tracking-tight leading-tight">
                Hardware & Supplies
              </h2>

              {/* Subtitle */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy mt-2.5 tracking-tight">
                Reliable Hardware. Everyday Essentials.
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 mt-3.5 max-w-xl leading-relaxed">
                We offer high-quality <strong className="text-brand-navy font-bold">billmaster</strong> branded
                hardware and everyday printing supplies designed to support retail, checkout,
                labelling and inventory workflows.
              </p>

              {/* 3 Quick Icon Badges */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 max-w-xs sm:max-w-sm mt-7">
                {HARDWARE_QUICK_BADGES.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className="bg-white rounded-xl p-2 sm:p-2.5 shadow-xs border border-slate-200/80 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-brand-orange/50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-50/80 flex items-center justify-center text-brand-navy group-hover:text-brand-orange transition-colors mb-1.5">
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button (Disabled) */}
              <div className="mt-8">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed select-none opacity-80"
                  title="Order Now is currently disabled"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Hardware Bundle Showcase */}
            <div className="lg:col-span-6 relative flex items-center justify-center mt-4 lg:mt-0">
              {/* Handwritten Note Callout with curved arrow */}
              <div className="absolute -top-6 right-2 sm:right-6 z-20 flex flex-col items-end pointer-events-none select-none">
                <div className="text-right">
                  <span className="block text-xs sm:text-sm font-black italic tracking-tight text-[#1E3A8A]">
                    Quality Products.
                  </span>
                  <span className="block text-xs sm:text-sm font-black italic tracking-tight text-[#1E3A8A] -mt-0.5">
                    Better Performance.
                  </span>
                </div>
                {/* Curved Sketch Arrow */}
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-[#1E3A8A] mt-0.5 mr-2"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M30 6 C24 16, 20 26, 12 28" />
                  <path d="M11 20 L12 28 L20 28" />
                </svg>
              </div>

              <div className="relative w-full max-w-lg transition-transform duration-500 hover:scale-[1.01]">
                <picture>
                  <source srcSet="/images/billmaster-hardware-bundle.webp" type="image/webp" />
                  <img
                    src="/images/billmaster-hardware-bundle.webp"
                    alt="Billmaster Hardware & Supplies Bundle"
                    loading="lazy"
                    decoding="async"
                    width={512}
                    height={320}
                    className="w-full aspect-[16/10] object-contain drop-shadow-2xl rounded-2xl"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* 3 Hardware Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {HARDWARE_ITEMS.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-brand-orange/40 hover:-translate-y-1 transition-all p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-slate-50/70 flex items-center justify-center mb-3.5 p-3 relative">
                    <picture>
                      <source srcSet={item.image} type="image/webp" />
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        width={240}
                        height={160}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </picture>
                    {/* Official billmaster logo badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 shadow-xs">
                      <img
                        src="/images/billmaster-logo.webp"
                        alt="billmaster"
                        width={60}
                        height={14}
                        loading="lazy"
                        decoding="async"
                        className="h-3.5 w-auto object-contain rounded-xs"
                      />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner: Need Help Choosing the Right Product? */}
          <div className="mt-12 rounded-2xl bg-brand-navy p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 text-brand-orange shadow-inner">
                <Package className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Need Help Choosing the Right Product?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Our team is here to guide you with the best software and hardware for your business.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-orange text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-all shadow-orange-500/20 active:scale-95 shrink-0 z-10"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Follow on Social (Facebook & Instagram) */}
      <FollowOnSocial />
    </div>
  );
};

export default BillmasterPage;
