import serviceWebHero from '../assets/images/services/service-web-hero.webp';
import serviceDesktopHero from '../assets/images/services/service-desktop-hero.webp';
import serviceMobileHero from '../assets/images/services/service-mobile-hero.webp';
import serviceMarketingHero from '../assets/images/services/service-marketing-hero.webp';

export const SERVICES_PAGE_DATA = {
  hero: {
    badge: 'Custom Engineering & Growth',
    title: 'High-Impact Software Development & Digital Services',
    subtitle:
      'We architect, build, and scale resilient web platforms, cross-platform mobile apps, offline-first desktop systems, and performance marketing engines tailored to growing businesses.',
    stats: [
      { value: '500+', label: 'Active Business Deployments' },
      { value: '99.9%', label: 'System Uptime & Reliability' },
      { value: '10x', label: 'Faster Counter Operations' },
      { value: '24/7', label: 'Technical SLA Support' },
    ],
  },
  process: [
    {
      step: '01',
      title: 'Discovery & System Scoping',
      description:
        'We deep-dive into your operational workflows, transaction volume, hardware peripherals, and business goals to draft a clear technical blueprint.',
    },
    {
      step: '02',
      title: 'Agile Architecture & Prototyping',
      description:
        'Our engineers build responsive prototypes and modular system architectures with rapid iteration cycles, keeping your team involved at every milestone.',
    },
    {
      step: '03',
      title: 'Rigorous Testing & Hardware QA',
      description:
        'From network disruption testing to high-speed thermal printing and weighing scale stress tests, we ensure zero glitches during live production.',
    },
    {
      step: '04',
      title: 'Deployment & SLA Maintenance',
      description:
        'Smooth data migration, cashier/staff training, live counter rollout, and continuous performance telemetry to keep your software running flawlessly.',
    },
  ],
};

export const SERVICES_DATA = [
  {
    id: 'web-development',
    group: 'Application Development',
    title: 'Web Application Development',
    badge: 'Cloud, SaaS & Portals',
    navPath: '/services/web-development',
    ctaLink: '/services/web-development',
    ctaText: 'Explore Web Development',
    image: serviceWebHero,
    webpImage: serviceWebHero,
    shortDescription:
      'Custom cloud web applications, business dashboards, and enterprise portals built for blazing speed, high concurrency, and effortless responsive browsing.',
    description:
      'Custom cloud web applications, business dashboards, and enterprise portals built for blazing speed, high concurrency, and effortless responsive browsing.',
    subServices: [
      'Cloud & SaaS Platforms',
      'Custom ERP & Admin Portals',
      'REST & GraphQL API Backends',
      'High-Conversion UI/UX Design',
    ],
    fullOverview:
      'At Durgam Soft, we build secure, scalable web platforms that solve real business problems. From centralized multi-branch inventory consoles and vendor portals to consumer-facing SaaS products, our web engineering is rooted in modern component architectures, fast database indexing, and intuitive UX.',
    heroStats: [
      { value: '<1s', label: 'Average Page Load Time' },
      { value: '100%', label: 'Mobile & Tablet Responsive' },
      { value: 'Zero', label: 'Vendor Lock-in' },
    ],
    capabilities: [
      {
        title: 'Cloud & SaaS Platforms',
        description:
          'Multi-tenant web applications with secure role-based access, automated billing subscriptions, and distributed database sharding.',
      },
      {
        title: 'Custom ERP & Admin Portals',
        description:
          'Centralized management dashboards for monitoring sales, stock levels, warehouse transfers, and staff permissions across branches.',
      },
      {
        title: 'REST & GraphQL API Backends',
        description:
          'High-throughput microservices and APIs engineered with Node.js and Python for seamless synchronization with mobile apps and POS hardware.',
      },
      {
        title: 'High-Conversion UI/UX Design',
        description:
          'Clean, touch-friendly, accessibility-compliant user interfaces that reduce staff training time and maximize user productivity.',
      },
    ],
    techStack: [
      'React',
      'Node.js',
      'Python',
      'Tailwind CSS',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Docker',
      'AWS / Cloud',
    ],
    deliverables: [
      'Full Source Code & Architecture Documentation',
      'Responsive Web App (Mobile, Tablet, Desktop)',
      'Admin Control Panel with Granular Permissions',
      'Automated Database Backups & SSL Security',
      '90-Day Post-Launch Warranty & Maintenance',
    ],
    faqs: [
      {
        q: 'How long does a custom web application take to build?',
        a: 'Standard business portals and MVPs typically take 4 to 8 weeks, while complex multi-branch enterprise systems take 8 to 14 weeks with weekly sprint demos.',
      },
      {
        q: 'Can the web portal sync with our existing Billmaster desktop tills?',
        a: 'Yes! We build secure background synchronization bridges that push live sales and inventory figures from local desktop counters straight to your web dashboard.',
      },
      {
        q: 'Do we own the software code after project completion?',
        a: 'Yes, 100%. All proprietary source code, database schemas, and intellectual property belong entirely to your company upon project sign-off.',
      },
    ],
  },
  {
    id: 'mobile-development',
    group: 'Application Development',
    title: 'Mobile App Development',
    badge: 'iOS, Android & Flutter',
    navPath: '/services/mobile-development',
    ctaLink: '/services/mobile-development',
    ctaText: 'Explore Mobile Development',
    image: serviceMobileHero,
    webpImage: serviceMobileHero,
    shortDescription:
      'High-performance cross-platform iOS and Android apps engineered with Flutter, featuring offline SQLite caching, Bluetooth hardware support, and fluid touch navigation.',
    description:
      'High-performance cross-platform iOS and Android apps engineered with Flutter, featuring offline SQLite caching, Bluetooth hardware support, and fluid touch navigation.',
    subServices: [
      'Cross-Platform Flutter & Dart',
      'Offline-First Data Synchronization',
      'Bluetooth & POS Peripheral Interfacing',
      'Push Notifications & Real-Time Alerts',
    ],
    fullOverview:
      'Smartphone applications are the front line of modern commerce. Whether you need a mobile companion app for field sales executives, a customer loyalty app with instant digital receipts, or an on-the-go owner dashboard, Durgam Soft delivers native-feeling mobile applications with a single unified codebase.',
    heroStats: [
      { value: '60 FPS', label: 'Smooth Butter Animations' },
      { value: 'Offline', label: 'First SQLite Architecture' },
      { value: '2-in-1', label: 'iOS & Android Parity' },
    ],
    capabilities: [
      {
        title: 'Cross-Platform Flutter & Dart',
        description:
          'Beautiful native-compiled applications for iOS and Android from a single battle-tested codebase, saving development time and maintenance cost.',
      },
      {
        title: 'Offline-First Data Synchronization',
        description:
          'Built-in local SQLite persistence that allows field agents and store staff to create orders and collect data even without active internet.',
      },
      {
        title: 'Bluetooth & POS Peripheral Interfacing',
        description:
          'Seamless pairing with handheld Bluetooth thermal receipt printers, wireless barcode scanners, and mobile card swipers.',
      },
      {
        title: 'Push Notifications & Real-Time Alerts',
        description:
          'Automated low-stock notifications, daily sales summaries, and promotional discount broadcasts sent directly to user lock screens.',
      },
    ],
    techStack: [
      'Flutter',
      'Dart',
      'SQLite',
      'Firebase',
      'REST APIs',
      'Bluetooth LE',
      'Push Notifications',
      'Google Play / App Store',
    ],
    deliverables: [
      'Google Play Store & Apple App Store Production Builds',
      'Offline-First Local Storage Engine',
      'Push Notification & Cloud Messaging Setup',
      'Bluetooth Printer & Scanner Driver Library',
      'Complete Mobile Source Code & Store Assets',
    ],
    faqs: [
      {
        q: 'Why does Durgam Soft recommend Flutter for mobile apps?',
        a: 'Flutter allows us to build identical, pixel-perfect, 60fps native apps for both iOS and Android simultaneously, reducing your development cost by almost 40%.',
      },
      {
        q: 'Can the mobile app work without an internet connection?',
        a: 'Yes. All our business apps feature offline-first architecture with local SQLite databases that synchronize automatically the moment connectivity resumes.',
      },
      {
        q: 'Will you handle publishing to the App Store and Google Play?',
        a: 'Yes, our team handles the entire store submission process, including metadata, screenshots, privacy policies, and compliance reviews.',
      },
    ],
  },
  {
    id: 'desktop-development',
    group: 'Application Development',
    title: 'Desktop Application Development',
    badge: 'Windows POS & Offline Tills',
    navPath: '/services/desktop-development',
    ctaLink: '/services/desktop-development',
    ctaText: 'Explore Desktop Development',
    image: serviceDesktopHero,
    webpImage: serviceDesktopHero,
    shortDescription:
      'Ultra-fast native Windows desktop billing systems, thermal printer drivers, and electronic scale integrations built for zero-latency retail operations.',
    description:
      'Ultra-fast native Windows desktop billing systems, thermal printer drivers, and electronic scale integrations built for zero-latency retail operations.',
    subServices: [
      'Windows POS & Retail Tills',
      'Direct Hardware & Peripheral Interfacing',
      'Robust Local Database Engines',
      'Automated Background Cloud Sync',
    ],
    fullOverview:
      'When thousands of items pass through checkout counters during peak evening rushes, browser lag is unacceptable. Durgam Soft specializes in high-speed, hardware-integrated desktop applications that communicate directly with thermal printers, cash drawers, customer displays, and barcode readers without operating system print delays.',
    heroStats: [
      { value: '<500ms', label: 'Direct Print Execution' },
      { value: '100%', label: 'Offline Hardware Resilience' },
      { value: 'Zero', label: 'Browser Lag or Freezes' },
    ],
    capabilities: [
      {
        title: 'Windows POS & Retail Tills',
        description:
          'Keyboard-first cashier software designed for lightning-fast item lookup, instant barcode scanning, and split tender payments in seconds.',
      },
      {
        title: 'Direct Hardware & Peripheral Interfacing',
        description:
          'Low-level driver communication with USB, Serial RS232, and LAN thermal receipt printers, electronic scales, and customer-facing pole displays.',
      },
      {
        title: 'Robust Local Database Engines',
        description:
          'High-performance SQLite and embedded database storage capable of handling 50,000+ SKUs with instant search and zero internet dependency.',
      },
      {
        title: 'Automated Background Cloud Sync',
        description:
          'Silent multi-thread replication that streams end-of-day Z-reports, inventory adjustments, and GST tax records to the head office cloud.',
      },
    ],
    techStack: [
      'C# / .NET',
      'Flutter Desktop',
      'Electron',
      'SQLite',
      'ESC/POS DirectPrint',
      'RS232 Serial APIs',
      'Windows 10/11',
    ],
    deliverables: [
      'Native Windows Installer (.exe / .msi)',
      'Integrated ESC/POS Thermal Printing Engine',
      'Weighing Scale Serial Communication Drivers',
      'Local Backup & Data Recovery Scripts',
      'Remote Installation & Cashier Training',
    ],
    faqs: [
      {
        q: 'What hardware is compatible with Durgam Soft desktop applications?',
        a: 'Our software supports all standard 2-inch and 3-inch ESC/POS thermal printers, USB and wireless barcode scanners, weighing scales with RS232/USB output, and cash drawers.',
      },
      {
        q: 'Does the desktop app require constant internet connectivity?',
        a: 'No. The desktop software is 100% offline-first. Billing never stops if the internet fluctuates. Transactions sync to the cloud automatically in the background.',
      },
      {
        q: 'Can multiple billing counters in one store share the same stock database?',
        a: 'Yes. We support local LAN network clustering, allowing 2 to 10+ billing counters to read and update a unified store database in real time without external internet.',
      },
    ],
  },
  {
    id: 'billing-software',
    group: 'Application Development',
    title: 'Billmaster Billing Software',
    badge: 'POS, Invoicing & Inventory',
    navPath: '/products/billmaster',
    ctaLink: '/products/billmaster',
    ctaText: 'Explore Billmaster',
    image: '/images/billmaster-smart-billing.webp',
    webpImage: '/images/billmaster-smart-billing.webp',
    shortDescription:
      'Fast, reliable billing and POS software designed to simplify transactions, manage inventory, and generate GST-compliant invoices.',
    description:
      'Fast, reliable billing and POS software designed to simplify transactions, manage inventory, and generate GST-compliant invoices.',
    subServices: [
      'Rapid POS Billing & Instant Invoicing',
      'Inventory, Stock & Ledger Tracking',
      'GST & Tax Compliance Reports',
      'Thermal Printer & Barcode Scanner Sync',
    ],
    fullOverview:
      'Billmaster by Durgam Soft is an enterprise-grade billing and point-of-sale software engineered for retail shops, restaurants, supermarkets, and wholesale businesses. It delivers lightning-fast barcode scanning, instant thermal receipt printing, real-time inventory tracking, and full GST compliance.',
    heroStats: [
      { value: '10x', label: 'Faster Counter Checkout' },
      { value: '100%', label: 'GST Compliant Invoicing' },
      { value: 'Offline', label: 'First Reliability' },
    ],
    capabilities: [
      {
        title: 'Rapid POS Billing & Invoicing',
        description:
          'High-speed counter checkout with keyboard shortcuts, barcode scanner integration, and automatic discount calculation.',
      },
      {
        title: 'Inventory & Stock Management',
        description:
          'Real-time stock deduction, low-stock alerts, multi-warehouse transfers, and batch/expiry tracking.',
      },
      {
        title: 'GST & Tax Compliance',
        description:
          'Automated GSTR-1, GSTR-3B tax report generation, HSN/SAC code mapping, and multi-rate tax calculations.',
      },
      {
        title: 'Hardware Peripherals Sync',
        description:
          'Seamless connectivity with USB/Bluetooth thermal receipt printers, barcode scanners, and weighing scales.',
      },
    ],
    techStack: [
      'Windows Desktop',
      'Android Mobile',
      'Cloud Sync',
      'ESC/POS Thermal Printing',
      'SQLite / Cloud DB',
    ],
    deliverables: [
      'Full Software Installation & Licensing',
      'Complete Database & Product Import',
      'Cashier & Staff Training Session',
      'Dedicated Customer Support & Updates',
    ],
    faqs: [
      {
        q: 'Does Billmaster work without internet?',
        a: 'Yes, Billmaster is built offline-first. Billing never stops even if your internet connection goes down.',
      },
      {
        q: 'Can Billmaster connect with barcode scanners and thermal printers?',
        a: 'Yes, it works out-of-the-box with all standard 2-inch and 3-inch thermal printers and barcode scanners.',
      },
    ],
  },
  {
    id: 'digital-marketing',
    group: 'Digital Marketing',
    title: 'Digital Marketing & SEO',
    badge: 'Search, Ads & Brand Growth',
    navPath: '/services/digital-marketing',
    ctaLink: '/services/digital-marketing',
    ctaText: 'Explore Digital Marketing',
    image: serviceMarketingHero,
    webpImage: serviceMarketingHero,
    shortDescription:
      'Data-driven local and national SEO, targeted Google/Meta advertising campaigns, and conversion optimization to drive verified commercial inquiries.',
    description:
      'Data-driven local and national SEO, targeted Google/Meta advertising campaigns, and conversion optimization to drive verified commercial inquiries.',
    subServices: [
      'Local & National SEO Optimization',
      'Targeted Google Ads & Meta PPC',
      'Conversion Rate Optimization (CRO)',
      'Brand Positioning & Content Strategy',
    ],
    fullOverview:
      'Great software and retail products deserve visibility. Durgam Soft combines deep technical search engine optimization with performance-driven digital advertising. We help local stores dominate Google Maps local pack rankings and assist B2B software brands in capturing qualified commercial leads.',
    heroStats: [
      { value: '3x-5x', label: 'Average Inbound Lead Lift' },
      { value: 'Top 3', label: 'Local Search Map Pack Target' },
      { value: 'ROAS', label: 'Focused PPC Campaigning' },
    ],
    capabilities: [
      {
        title: 'Local & National SEO Optimization',
        description:
          'Technical site audits, Google Business Profile optimization, schema markup, and keyword targeting to dominate high-intent search terms.',
      },
      {
        title: 'Targeted Google Ads & Meta PPC',
        description:
          'Data-backed search and social advertising campaigns with rigorous audience negative-keyword filtering to eliminate wasted ad spend.',
      },
      {
        title: 'Conversion Rate Optimization (CRO)',
        description:
          'Landing page A/B testing, heatmap analysis, and clear call-to-action tuning that turn website visitors into qualified paying leads.',
      },
      {
        title: 'Brand Positioning & Content Strategy',
        description:
          'Authority-building blog articles, customer case studies, and social collateral that establish your brand as a trusted industry leader.',
      },
    ],
    techStack: [
      'Google Ads',
      'Meta Business Suite',
      'Google Search Console',
      'Google Analytics 4',
      'SEMrush / Ahrefs',
      'Schema.org SEO',
    ],
    deliverables: [
      'Comprehensive Website & Competitor Audit',
      'Complete On-Page & Technical SEO Setup',
      'PPC Campaign Architecture & Ad Creatives',
      'Monthly Transparent ROI & Lead Analytics Report',
      'Dedicated Marketing Account Manager',
    ],
    faqs: [
      {
        q: 'How soon can we expect results from SEO services?',
        a: 'Technical SEO fixes and Google Maps optimization typically yield noticeable ranking improvements in 30 to 60 days, with substantial organic growth compounding over 3 to 6 months.',
      },
      {
        q: 'Do you manage our ad budget directly?',
        a: 'Your ad budget is paid directly to Google or Meta through your own corporate account. We manage the campaigns, keywords, and optimizations with 100% financial transparency.',
      },
      {
        q: 'Can you help a local retail store get more foot traffic?',
        a: 'Absolutely! Our Hyper-Local SEO package optimizes your store on Google Maps, local directories, and WhatsApp click-to-chat ads to drive immediate neighborhood footfall.',
      },
    ],
  },
];
