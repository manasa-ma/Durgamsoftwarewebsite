// -------------------------------------------------------------
// 1. Company Overview
// -------------------------------------------------------------
export const COMPANY_OVERVIEW_DATA = {
  headline: 'Durgam Soft Pvt. Ltd.',
  heading: 'More Than Software. A Technology Partner for Businesses.',
  subheadline: 'Software Products • Custom Development • Digital Marketing',
  eyebrow: 'Company Overview',
  sectionTitle: 'Company Overview',
  leadParagraph1:
    'Established in 2022 in Hyderabad, Durgam Soft Pvt. Ltd. combines its experience in building its own software products with its expertise in developing customized solutions for other businesses.',
  leadParagraph2:
    'We create technology products such as billmaster, develop custom web, mobile, and desktop applications based on business requirements, and provide digital marketing services that help companies strengthen their online presence and reach more customers.',
  description:
    'Durgam Soft Pvt. Ltd. builds software products and provides technology and digital solutions that help businesses simplify operations, improve customer experiences, and grow in the digital world.',
  location: 'Hyderabad, India',
  pillars: [
    {
      id: 'software-products',
      title: 'Our Products (billmaster)',
      category: 'Proprietary Software',
      description:
        'A business billing and management solution designed to simplify everyday business operations.',
      iconName: 'software',
      features: [
        'Billing software & mobile application',
        'Certified thermal printers & scanners',
        'Direct thermal label printers & supplies',
        'Comprehensive store inventory management',
      ],
      linkTo: '/products/billmaster',
    },
    {
      id: 'hardware-supplies',
      title: 'POS Hardware & Peripherals',
      category: 'Certified Hardware',
      description:
        'Certified thermal receipt printers, barcode scanners, and label supplies tested for plug-and-play compatibility.',
      iconName: 'hardware',
      features: [
        'High-speed 2-inch & 3-inch thermal printers',
        'Handheld 1D and 2D barcode scanners',
        'Direct thermal label rolls & stickers',
        'Seamless integration with billmaster POS',
      ],
      linkTo: '/products/hardware',
    },
    {
      id: 'custom-development',
      title: 'Software Development',
      category: 'Client Solutions',
      description:
        'Custom software developed specifically for other businesses based on unique business requirements.',
      iconName: 'dev',
      features: [
        'Scalable cloud and web applications',
        'Native and cross-platform mobile apps',
        'High-performance desktop systems',
        'Bespoke enterprise software architecture',
      ],
      linkTo: '/services',
    },
  ],
  mission:
    'Durgam Soft builds its own technology products and also builds technology and digital solutions for other businesses.',
  values: ['Customer Focus', 'Reliability', 'Continuous Improvement', 'Accountability'],
};

// Backward compatibility alias
export const WHO_WE_ARE_DATA = {
  sectionBadge: 'Company Overview',
  title: COMPANY_OVERVIEW_DATA.heading,
  leadParagraph1: COMPANY_OVERVIEW_DATA.leadParagraph1,
  leadParagraph2: COMPANY_OVERVIEW_DATA.leadParagraph2,
  customerFocusPillars: [
    {
      title: 'Our Own Products',
      desc: 'Proprietary software products like billmaster designed for real-world business counters.',
    },
    {
      title: 'Custom Software Development',
      desc: 'Web, mobile, and desktop applications tailored to client-specific business workflows.',
    },
    {
      title: 'Digital Marketing & Growth',
      desc: 'SEO, digital campaigns, and online visibility services that help businesses reach customers.',
    },
    {
      title: 'Technology Consultation',
      desc: 'Practical technology advisory grounded in real product development experience.',
    },
  ],
};

// -------------------------------------------------------------
// 2. Three Core Business Areas (What We Do)
// -------------------------------------------------------------
export const CORE_BUSINESS_AREAS = [
  {
    number: '01',
    category: 'Our Products',
    title: 'Products We Build',
    description:
      'Durgam Soft develops and maintains its own software products, built to solve practical day-to-day business challenges.',
    highlightTitle: 'billmaster',
    highlightDescription:
      'A business billing and management solution designed to simplify everyday business operations.',
    items: [
      'Billing software',
      'Mobile application',
      'Thermal printers',
      'Barcode scanners',
      'Label printers',
      'Paper rolls',
      'Labels',
    ],
    ctaText: 'Explore billmaster',
    ctaLink: '/products/billmaster',
  },
  {
    number: '02',
    category: 'Software Development',
    title: 'Software Built Around Your Business',
    description:
      'Durgam Soft also develops software specifically for other businesses, engineering tailored solutions around unique operational workflows.',
    items: [
      'Web applications',
      'Mobile applications',
      'Desktop applications',
      'Custom business software',
      'Business-specific solutions',
    ],
    keyMessage:
      'Have a business requirement or software idea? Durgam Soft can design and develop the technology around your requirements.',
    ctaText: 'Explore Software Development',
    ctaLink: '/services',
  },
  {
    number: '03',
    category: 'Digital Marketing',
    title: 'Helping Businesses Grow Online',
    description:
      'Durgam Soft also provides digital marketing services to help businesses promote their products and services effectively.',
    items: [
      'SEO & search visibility',
      'Social media marketing',
      'Online promotion',
      'Digital campaigns',
      'Content strategy',
      'Website visibility',
    ],
    keyMessage:
      "We don't just build digital products. We also help businesses reach the people they are built for.",
    ctaText: 'Explore Digital Marketing',
    ctaLink: '/services/digital-marketing',
  },
];

// Backward compatibility alias
export const WHAT_WE_DO_PILLARS = [
  {
    id: 'software-products',
    title: 'Our Products (billmaster)',
    category: 'Proprietary Software',
    description:
      'A business billing and management solution designed to simplify everyday business operations.',
    iconName: 'software',
    features: [
      'Billing software & mobile application',
      'Certified thermal printers & scanners',
      'Direct thermal label printers & supplies',
      'Comprehensive store inventory management',
    ],
    linkTo: '/products/billmaster',
  },
  {
    id: 'custom-development',
    title: 'Software Development',
    category: 'Client Solutions',
    description:
      'Custom software developed specifically for other businesses based on unique business requirements.',
    iconName: 'dev',
    features: [
      'Scalable cloud and web applications',
      'Native and cross-platform mobile apps',
      'High-performance desktop systems',
      'Bespoke enterprise software architecture',
    ],
    linkTo: '/services',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Growth Services',
    description:
      'Comprehensive marketing services to help businesses promote products, increase visibility, and acquire customers.',
    iconName: 'marketing',
    features: [
      'Search Engine Optimization (SEO)',
      'Social media marketing & outreach',
      'Targeted digital acquisition campaigns',
      'Online brand & website visibility',
    ],
    linkTo: '/services/digital-marketing',
  },
];

// -------------------------------------------------------------
// 3. Strong Positioning Section
// -------------------------------------------------------------
export const POSITIONING_DATA = {
  heading: 'One Technology Partner. Multiple Possibilities.',
  supportingMessage:
    'From building our own products to developing custom software and helping businesses grow online, Durgam Soft brings product development, software engineering, and digital marketing together under one technology partner.',
  keywords: [
    {
      keyword: 'BUILD',
      subtitle: 'Products & Software',
      description:
        'Engineering our own proprietary products like billmaster to address practical business needs around billing, inventory, and operations.',
    },
    {
      keyword: 'DEVELOP',
      subtitle: 'Custom Business Solutions',
      description:
        'Architecting custom web, mobile, and desktop software built precisely around each client’s operational requirements.',
    },
    {
      keyword: 'GROW',
      subtitle: 'Digital Marketing',
      description:
        'Driving search engine visibility, digital campaigns, and online promotion so businesses reach the audiences their products are built for.',
    },
  ],
};

// -------------------------------------------------------------
// 4. Explain the Difference (Our Approach)
// -------------------------------------------------------------
export const APPROACH_DATA = {
  heading: 'We Understand Both Products and Businesses.',
  paragraph1:
    'Durgam Soft doesn’t only develop software based on technical specifications. Because we build and operate our own software products, we deeply understand the practical challenges involved in creating technology for real businesses.',
  paragraph2:
    'That firsthand experience in software stability, real user workflows, and daily reliability is directly applied when developing customized technology solutions for our clients.',
  flowSteps: [
    {
      step: '01',
      title: 'Our Products',
      detail: 'In-house product development',
    },
    {
      step: '02',
      title: 'Technology Experience',
      detail: 'Practical engineering & uptime',
    },
    {
      step: '03',
      title: 'Software Development',
      detail: 'Custom engineering capabilities',
    },
    {
      step: '04',
      title: 'Understanding of Business',
      detail: 'Real-world commercial workflows',
    },
    {
      step: '05',
      title: 'Better Digital Solutions',
      detail: 'High-impact results for clients',
    },
  ],
};

// -------------------------------------------------------------
// 5. billmaster Focus (Our Product Journey)
// -------------------------------------------------------------
export const PRODUCT_JOURNEY_DATA = {
  heading: 'Our Product Journey',
  lead: 'billmaster is one of Durgam Soft’s own software products, developed to address practical business needs around billing and everyday operations.',
  description:
    'Building, maintaining, and supporting our own products has helped Durgam Soft develop deep practical experience in:',
  experienceAreas: [
    'Product development',
    'Software engineering',
    'Business workflows',
    'User experience',
    'Application development',
    'Business technology',
  ],
  ctaText: 'Discover billmaster',
  ctaLink: '/products/billmaster',
};

// -------------------------------------------------------------
// 6. Dedicated Software Development
// -------------------------------------------------------------
export const SOFTWARE_DEV_SECTION = {
  heading: 'Your Business. Your Requirements. Your Software.',
  description:
    'Every business does not work the same way and sometimes standard software is not enough. Durgam Soft can develop customized solutions based on business requirements.',
  cards: [
    {
      id: 'web-apps',
      title: 'Web Applications',
      description:
        'Business applications accessible through the web, engineered for reliability, security, and multi-user performance.',
      linkTo: '/services/web-development',
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Applications',
      description:
        'Mobile solutions for customers, teams, and business operations across iOS and Android platforms.',
      linkTo: '/services/mobile-development',
    },
    {
      id: 'desktop-apps',
      title: 'Desktop Applications',
      description:
        'Purpose-built desktop software for specific business workflows, localized hardware controls, and high-speed data entry.',
      linkTo: '/services/desktop-development',
    },
  ],
  ctaText: 'Talk to Our Development Team',
  ctaLink: '/contact',
};

// -------------------------------------------------------------
// 7. Dedicated Digital Marketing
// -------------------------------------------------------------
export const DIGITAL_MARKETING_SECTION = {
  heading: 'Build It. Promote It. Grow It.',
  description:
    'Technology and marketing work together. Durgam Soft helps businesses not only build their digital presence but also promote it to connect with customers and accelerate commercial growth.',
  steps: [
    {
      action: 'Create',
      title: 'Websites & Digital Products',
      desc: 'Modern, responsive web platforms and applications built for clear user engagement.',
    },
    {
      action: 'Reach',
      title: 'Digital Marketing & SEO',
      desc: 'Search engine optimization, content visibility, and targeted online campaigns.',
    },
    {
      action: 'Grow',
      title: 'Online Visibility & Customer Reach',
      desc: 'Expanding brand awareness and generating sustained customer inquiries.',
    },
  ],
  ctaText: 'Explore Digital Marketing',
  ctaLink: '/services/digital-marketing',
};

// -------------------------------------------------------------
// 8. Company Capability Summary
// -------------------------------------------------------------
export const CAPABILITY_SUMMARY = {
  heading: 'Durgam Soft at a Glance',
  blocks: [
    {
      keyword: 'PRODUCTS',
      title: 'Our Own Software Products',
      desc: 'In-house business software like billmaster built to simplify counter and retail operations.',
    },
    {
      keyword: 'SOFTWARE',
      title: 'Custom Business Applications',
      desc: 'Bespoke web and cloud applications designed specifically around client requirements.',
    },
    {
      keyword: 'MOBILE',
      title: 'Mobile & Cross-Platform Solutions',
      desc: 'Dedicated mobile applications connecting businesses with on-the-go teams and customers.',
    },
    {
      keyword: 'MARKETING',
      title: 'Digital Marketing & Online Growth',
      desc: 'Strategic SEO, digital promotion, and marketing services to reach target audiences.',
    },
  ],
};

// -------------------------------------------------------------
// 9. Founder & CEO Profile
// -------------------------------------------------------------
export const FOUNDER_DATA = {
  id: 'venu-durgam',
  sectionTitle: 'Meet Our Founder & CEO',
  name: 'Durgam Venu Gopal',
  designation: 'Founder & CEO, Durgam Soft Pvt. Ltd.',
  initials: 'VD',
  imageSrc: '/images/about/about-founder-venu-durgam.webp',
  imagePlaceholder: 'Durgam Venu Gopal — Founder & CEO Portrait',
  bioParagraphs: [
    'Durgam Venu Gopal is the Founder and Chief Executive Officer of Durgam Soft Pvt. Ltd. With an engineering mindset and deep respect for commercial business operations, he established Durgam Soft in 2022 in Hyderabad to build software that business owners genuinely enjoy using.',
    'Recognizing that traditional billing software was often bloated, difficult to learn, and prone to peripheral hardware mismatches, Durgam Venu Gopal led the in-house architecture and development of billmaster. His hands-on involvement spans core product design, intuitive user interface development, and testing every printer and scanner model in our lineup.',
    'Under his leadership, Durgam Soft has grown into a comprehensive technology solutions partner — developing its own proprietary software products, building custom web, mobile, and desktop software for other businesses, and delivering digital marketing services to help companies grow.',
  ],
  visionQuote:
    'Technology should make business simpler, not harder. That’s the standard we hold every product and every project to.',
  focusAreas: [
    'Proprietary Product Architecture',
    'Custom Software Engineering',
    'POS Hardware & Consumables Verification',
    'Customer-Centric UX Design',
  ],
  profileLink: '/about/founder',
  ctaText: 'Talk to Our Team',
  ctaLink: '/contact',
};

export const DIRECTORS = [FOUNDER_DATA];

// -------------------------------------------------------------
// 10. Final CTA
// -------------------------------------------------------------
export const CLOSING_CTA_DATA = {
  heading: "Let's Build, Develop & Grow Together.",
  text: 'Whether you are looking for a ready-to-use business product, custom software development, or digital marketing support, Durgam Soft can help you find the right technology solution for your business.',
  primaryButtonText: 'Talk to Our Team',
  primaryButtonLink: '/contact',
  secondaryButtonText: 'Explore Our Services',
  secondaryButtonLink: '/services',
};

export const MISSION_VISION_VALUES_DATA = {
  badge: 'Purpose & Philosophy',
  heading: 'Our Mission, Vision & Core Values',
  subtitle:
    'Guiding every software product we build and every digital solution we deliver for modern businesses.',
  mission: {
    title: 'Our Mission',
    tagline: 'Practical Technology for Real Growth',
    statement:
      'To empower businesses with practical, dependable software products and tailored digital solutions that simplify daily operations, eliminate workflow friction, and enable sustained business growth.',
    highlights: [
      'Build intuitive, reliable software products like billmaster',
      'Provide plug-and-play POS hardware & verified peripherals',
      'Engineer bespoke web, mobile, and desktop applications',
    ],
  },
  vision: {
    title: 'Our Vision',
    tagline: 'A Trusted Technology Partner of Choice',
    statement:
      'To become the preferred technology partner for retail, commercial, and enterprise businesses by consistently delivering robust software products and high-impact digital solutions that make business simpler.',
    highlights: [
      'Lead retail point-of-sale and business management software',
      'Champion engineering excellence across custom client platforms',
      'Deliver measurable growth through modern digital marketing',
    ],
  },
  values: {
    title: 'Our Core Values',
    tagline: 'Principles We Stand By',
    statement:
      'Our core values are embedded in how we design architectures, write code, test hardware, and support our clients every single day.',
    items: [
      {
        name: 'Client-Centric Practicality',
        desc: 'We solve real operational challenges rather than building unnecessary complexity.',
      },
      {
        name: 'Uncompromising Reliability',
        desc: 'Our software and verified hardware peripherals are engineered for uptime and peak hours.',
      },
      {
        name: 'Honesty & Accountability',
        desc: 'We offer straightforward advice, clear delivery timelines, and genuine long-term support.',
      },
      {
        name: 'Continuous Innovation',
        desc: 'We constantly refine our products and engineering capabilities to keep our clients ahead.',
      },
    ],
  },
};

export const WHY_CHOOSE_US_DATA = {
  badge: 'The Durgam Soft Advantage',
  heading: 'Why Businesses Partner With Us',
  subtitle:
    'Combining the discipline of an in-house software product company with the flexibility of custom development and digital marketing.',
  advantages: [
    {
      number: '01',
      title: 'Product-Led Engineering DNA',
      description:
        'Because we build and maintain our own proprietary software products (such as billmaster), we deeply understand system stability, real checkout speed, and user experience. That battle-tested experience goes directly into every custom client project.',
    },
    {
      number: '02',
      title: 'Complete Software + Hardware Stack',
      description:
        'We don’t leave you stranded with driver conflicts or peripheral mismatches. From cloud/desktop billing software to thermal printers, barcode scanners, and custom web portals, we provide end-to-end integrated technology.',
    },
    {
      number: '03',
      title: 'Bespoke Solutions, Not Rigid Templates',
      description:
        'Every business operates with unique processes. We engineer custom web, mobile, and desktop applications designed precisely around your workflows, data security, and operational objectives.',
    },
    {
      number: '04',
      title: 'End-to-End Growth & Digital Marketing',
      description:
        'Building great software is only half the journey. Our digital marketing, SEO, and visibility strategies help companies reach more customers, increase brand awareness, and expand commercial reach.',
    },
  ],
};

// Backward-compatible placeholders for legacy tests/imports
export const JOURNEY_MILESTONES = [
  {
    year: '2022',
    title: 'Established in Hyderabad',
    description:
      'Durgam Soft was established in 2022 in Hyderabad with a clear vision: build practical technology products and software solutions for businesses.',
    tag: 'Origins',
  },
  {
    year: 'Product Launch',
    title: 'Launch of billmaster Desktop POS',
    description:
      'Engineered and released billmaster POS, establishing our in-house product engineering practice.',
    tag: 'Product',
  },
  {
    year: 'Service Expansion',
    title: 'Custom Software Development & Digital Services',
    description:
      'Expanded capabilities to build custom web, mobile, and desktop applications for clients, backed by digital marketing.',
    tag: 'Solutions',
  },
];

export const MISSION_DATA = {
  badge: 'Our Mission',
  headline: 'Making Useful, Practical Technology Accessible to Every Business',
  description:
    'Durgam Soft builds its own technology products and also builds technology and digital solutions for other businesses.',
  pillars: [
    {
      title: 'Our Own Products',
      desc: 'Developing and maintaining proprietary software products like billmaster.',
    },
    {
      title: 'Custom Software',
      desc: 'Building custom web, mobile, and desktop applications for businesses.',
    },
    {
      title: 'Digital Marketing',
      desc: 'Helping businesses promote their products and expand their digital presence.',
    },
  ],
};

export const VALUES_DATA = [
  {
    title: 'Customer Focus',
    description: 'Every solution begins with understanding real business requirements.',
    iconName: 'Users',
  },
  {
    title: 'Reliability',
    description: 'We engineer software with uncompromising standards of stability and performance.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Continuous Improvement',
    description: 'We refine our products and custom solutions through active client feedback.',
    iconName: 'TrendingUp',
  },
  {
    title: 'Accountability',
    description: 'We stand firmly behind our products, development work, and marketing outcomes.',
    iconName: 'Award',
  },
];

export const CUSTOMER_RELATIONSHIPS_DATA = {
  badge: 'Customer Relationships',
  title: 'Built on Trust & Everyday Dependability',
  subtitle:
    'Powering everyday commercial operations across retail, enterprise, and digital businesses.',
  clientTypes: [
    {
      name: 'Retail & Supermarkets',
      metric: 'billmaster POS',
      detail: 'Rapid counter checkout and inventory sync.',
    },
    { name: 'Enterprises', metric: 'Custom Software', detail: 'Bespoke web and cloud platforms.' },
    {
      name: 'Growing Brands',
      metric: 'Digital Marketing',
      detail: 'SEO and online customer acquisition.',
    },
    {
      name: 'Commercial Businesses',
      metric: 'Complete Solutions',
      detail: 'End-to-end technology partner.',
    },
  ],
  stories: [],
};

// -------------------------------------------------------------
// 11. Techasoft Reference: Tech Stack & Stats
// -------------------------------------------------------------
export const STATS_DATA = [
  { value: '2022', label: 'Company Established' },
  { value: '100+', label: 'Business Deployments' },
  { value: '3', label: 'Core Capabilities' },
  { value: '100%', label: 'In-House Engineering' },
];

export const TECH_STACK_DATA = {
  eyebrow: 'TOOLS & TECHNOLOGIES',
  heading: 'OUR TECH STACK',
  subtitle:
    'From business-critical billing software and POS firmware to high-scale cloud platforms and mobile applications.',
  categories: [
    {
      name: 'Frontend & Web',
      categoryIcon: 'Layers',
      skills: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 & CSS3', 'REST API Client'],
    },
    {
      name: 'Backend & Cloud',
      categoryIcon: 'Cpu',
      skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'Secure Auth', 'Cloud Deployment'],
    },
    {
      name: 'Mobile Development',
      categoryIcon: 'Smartphone',
      skills: ['React Native', 'Flutter', 'Android SDK', 'iOS Integration', 'Cross-Platform Sync', 'Offline Storage'],
    },
    {
      name: 'Hardware & POS Systems',
      categoryIcon: 'Printer',
      skills: [
        'Thermal Printers (2" & 3")',
        '1D / 2D Barcode Scanners',
        'Direct Thermal Label Rolls',
        'Desktop POS (Electron / C#)',
        'Serial / USB / Bluetooth SDKs',
      ],
    },
  ],
};

