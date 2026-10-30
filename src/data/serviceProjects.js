// Visual Project Showcase Data for Durgam Soft Service Pages
import modrunEcoImg from '../assets/images/clients/case-study-modrun-ecommerce.webp';
import modrunMobImg from '../assets/images/clients/case-study-modrun-mobile-app.webp';
import modrunPosImg from '../assets/images/clients/case-study-modrun-warehouse-pos.webp';
import modrunMktImg from '../assets/images/clients/case-study-modrun-growth-analytics.webp';
import billmasterShowcaseImg from '../assets/images/about/about-billmaster-showcase.webp';
import serviceWebImg from '../assets/images/services/service-web-hero.webp';
import serviceMobileImg from '../assets/images/services/service-mobile-hero.webp';
import blogPosCheckoutImg from '../assets/images/blog/blog-pos-checkout.webp';
import blogModernTechImg from '../assets/images/blog/blog-modern-tech.webp';
import blogAutomationImg from '../assets/images/blog/blog-automation-software.webp';
import blogSmallBusinessImg from '../assets/images/blog/blog-small-business-growth.webp';

export const WEB_PROJECTS = [
  {
    id: 'modrun-web',
    title: 'ModRun Clothing Storefront',
    category: 'Headless E-Commerce',
    description:
      'High-speed online apparel storefront with sub-second page transitions, dynamic size finder, and instant Razorpay/UPI checkout.',
    image: modrunEcoImg,
    metrics: [
      { value: '0.8s', label: 'Page Load Speed' },
      { value: '+34%', label: 'Cart Conversion' },
    ],
    tags: ['Next.js', 'Redis Cache', 'Razorpay UPI', 'Tailwind CSS'],
    url: 'https://modrunclothing.com/',
    urlLabel: 'modrunclothing.com',
  },
  {
    id: 'sri-krishna-web',
    title: 'Sri Krishna Wholesale B2B Portal',
    category: 'B2B Wholesale & Distribution',
    description:
      'Centralized wholesale ordering portal connecting 60+ distributor accounts with custom price tiers and automated GST e-invoices.',
    image: serviceWebImg,
    metrics: [
      { value: '4 hrs/day', label: 'Time Saved' },
      { value: '+180%', label: 'B2B Order Volume' },
    ],
    tags: ['React Enterprise', 'Node.js Microservices', 'PostgreSQL', 'GST API'],
  },
  {
    id: 'medverve-web',
    title: 'MedVerve Healthcare Diagnostics',
    category: 'Healthcare Cloud Portal',
    description:
      'Secure patient diagnostic web portal with instant WhatsApp PDF report delivery and verified digital doctor signatures.',
    image: blogModernTechImg,
    metrics: [
      { value: '<2 mins', label: 'Report Delivery' },
      { value: '-62%', label: 'Front Desk Calls' },
    ],
    tags: ['Healthcare SaaS', 'WhatsApp Cloud API', 'Role-Based Access'],
  },
];

export const MOBILE_PROJECTS = [
  {
    id: 'billmaster-mobile',
    title: 'billmaster Mobile POS App',
    category: 'Handheld POS & Multi-Store Telemetry',
    description:
      'Wireless mobile billing companion enabling Bluetooth thermal receipt printing, phone camera barcode scanning, and live owner analytics.',
    image: serviceMobileImg,
    metrics: [
      { value: '5,000+', label: 'Active Mobile Tills' },
      { value: '0ms', label: 'Offline Billing Latency' },
    ],
    tags: ['Flutter Mobile', 'Bluetooth ESC/POS', 'Offline SQLite', 'GST Invoicing'],
    url: 'https://www.billmasterapp.com/',
    urlLabel: 'www.billmasterapp.com',
  },
  {
    id: 'modrun-mobile',
    title: 'ModRun Streetwear Shopping App',
    category: 'D2C Retail & Fashion',
    description:
      'Native-feel Flutter shopping app with butter-smooth 60fps gesture navigation, flash drop countdown alerts, and 1-tap re-ordering.',
    image: modrunMobImg,
    metrics: [
      { value: '42%', label: 'Of Total Revenue' },
      { value: '4.8 ★', label: 'App Store Rating' },
    ],
    tags: ['Flutter Mobile', 'iOS & Android', 'Firebase Push', 'Razorpay SDK'],
    url: 'https://modrunclothing.com/',
    urlLabel: 'modrunclothing.com',
  },
  {
    id: 'zenith-mobile',
    title: 'Zenith Logistics Route Delivery App',
    category: 'Logistics & Fleet Operations',
    description:
      'Offline SQLite mobile application allowing 45 route delivery drivers to capture digital signatures and print Bluetooth receipts without internet.',
    image: blogPosCheckoutImg,
    metrics: [
      { value: '45 Active', label: 'Field Agents' },
      { value: '100%', label: 'Zero Transaction Loss' },
    ],
    tags: ['Flutter', 'Offline SQLite', 'Bluetooth Printing', 'QR Scanner'],
  },
];

export const DESKTOP_PROJECTS = [
  {
    id: 'billmaster-desktop',
    title: 'billmaster Desktop POS Software',
    category: 'Supermarket & Retail POS',
    description:
      'Keyboard-first Windows cashier billing engine with sub-500ms ESC/POS direct printing, multi-till LAN clustering, and offline database resilience.',
    image: billmasterShowcaseImg,
    metrics: [
      { value: '<500ms', label: 'Direct Thermal Print' },
      { value: '12s', label: 'Avg Checkout Time' },
    ],
    tags: ['C# / .NET', 'ESC/POS DirectPrint', 'LAN Clustering', 'Dual Display'],
    url: 'https://www.billmasterapp.com/',
    urlLabel: 'www.billmasterapp.com',
  },
  {
    id: 'scale-pos',
    title: 'Weighing Scale Integrated Till',
    category: 'Confectionery & Produce Systems',
    description:
      'Direct RS232 serial communication with digital weighing scales for automatic tare deduction, weight validation, and instant price computing.',
    image: blogPosCheckoutImg,
    metrics: [
      { value: '100% Digital', label: 'Tare Precision' },
      { value: 'Zero', label: 'Weight Shrinkage' },
    ],
    tags: ['RS232 Serial Port', 'Weighing Scale Driver', 'Barcode Printing'],
    url: 'https://www.billmasterapp.com/',
    urlLabel: 'www.billmasterapp.com',
  },
  {
    id: 'warehouse-dispatch',
    title: 'ModRun Tiruppur Dispatch Station',
    category: 'Apparel Logistics & Labeling',
    description:
      'High-speed dispatch packing station with barcode item verification, parcel weighing, and 2-second courier thermal shipping label generation.',
    image: modrunPosImg,
    metrics: [
      { value: '2s / box', label: 'Dispatch Speed' },
      { value: '15,000+', label: 'Monthly Parcels' },
    ],
    tags: ['Thermal Label Driver', 'RS232 Scale', 'Courier API Sync'],
    url: 'https://modrunclothing.com/',
    urlLabel: 'modrunclothing.com',
  },
];

export const MARKETING_PROJECTS = [
  {
    id: 'modrun-marketing',
    title: 'ModRun Streetwear Growth Scaling',
    category: 'Performance Ads & SEO',
    description:
      'Full-funnel Google Shopping and Meta Ads campaigns scaling monthly orders to 15,000+ while sustaining a verified 4.4x blended ROAS.',
    image: modrunMktImg,
    metrics: [
      { value: '4.4x', label: 'Blended ROAS' },
      { value: '+260%', label: 'Monthly Orders' },
    ],
    tags: ['Meta Ads Suite', 'Google Shopping', 'Technical SEO', 'GA4 Attribution'],
    url: 'https://modrunclothing.com/',
    urlLabel: 'modrunclothing.com',
  },
  {
    id: 'siddhartha-marketing',
    title: 'Siddhartha Academy Admissions Funnel',
    category: 'Search Ads & Lead Generation',
    description:
      'Localized high-intent Google Search advertising and conversion rate optimization driving 420+ verified parent inquiries in 60 days.',
    image: blogAutomationImg,
    metrics: [
      { value: '420+', label: 'Verified Inquiries' },
      { value: '-45%', label: 'Acquisition Cost' },
    ],
    tags: ['Google Search Ads', 'Landing Page CRO', 'WhatsApp Lead Routing'],
  },
  {
    id: 'apex-marketing',
    title: 'Apex Dental Care Hyper-Local SEO',
    category: 'Google Maps & Local Search',
    description:
      'Technical schema markup, local citation building, and review optimization securing the #1 Google 3-pack ranking in West Hyderabad.',
    image: blogSmallBusinessImg,
    metrics: [
      { value: '#1 in Area', label: 'Google Maps Rank' },
      { value: '3.8x', label: 'Appointment Lift' },
    ],
    tags: ['Local SEO', 'Google Maps Pack', 'Schema.org SEO', 'Reputation Mgmt'],
  },
];
