export const NAVIGATION_ITEMS = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Our Products',
    to: '/products',
  },
  {
    label: 'Services',
    to: '/services',
    children: [
      {
        title: 'Web Development',
        to: '/services/web-development',
        description: 'Scalable cloud, SaaS, and enterprise web applications',
      },
      {
        title: 'Mobile App Development',
        to: '/services/mobile-development',
        description: 'iOS and Android native and cross-platform apps',
      },
      {
        title: 'Desktop Application Development',
        to: '/services/desktop-development',
        description: 'High-performance desktop systems and POS tools',
      },
      {
        title: 'Digital Marketing',
        to: '/services/digital-marketing',
        description: 'SEO, performance marketing, and digital growth',
      },
      {
        title: 'View All Services',
        to: '/services',
        description: 'Full-cycle custom engineering capabilities',
        isAction: true,
      },
    ],
  },
  {
    label: 'About Us',
    to: '/about-us',
  },
  {
    label: 'Blog',
    to: '/resources/blog',
  },
  {
    label: 'Careers',
    to: '/careers',
  },
  {
    label: 'Contact Us',
    to: '/contact',
    isButton: true,
    buttonVariant: 'secondary',
  },
  {
    label: 'Book a Demo',
    to: '/book-demo',
    isButton: true,
    buttonVariant: 'primary',
  },
];
