import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/Home/HomePage';

const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const BillmasterPage = lazy(() => import('../pages/Products/Billmaster/BillmasterPage'));
const HardwarePage = lazy(() => import('../pages/Products/Hardware/HardwarePage'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage'));
const WebDevelopmentPage = lazy(() => import('../pages/Services/WebDevelopment/WebDevelopmentPage'));
const MobileDevelopmentPage = lazy(() => import('../pages/Services/MobileDevelopment/MobileDevelopmentPage'));
const DesktopDevelopmentPage = lazy(() => import('../pages/Services/DesktopDevelopment/DesktopDevelopmentPage'));
const DigitalMarketingPage = lazy(() => import('../pages/Services/DigitalMarketing/DigitalMarketingPage'));
const IndustriesPage = lazy(() => import('../pages/Industries/IndustriesPage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ResourcesPage = lazy(() => import('../pages/Resources/ResourcesPage'));
const BlogPage = lazy(() => import('../pages/Resources/Blog/BlogPage'));
const BlogPostPage = lazy(() => import('../pages/Resources/Blog/BlogPostPage'));
const CareersPage = lazy(() => import('../pages/Careers/CareersPage'));
const JobDetailsPage = lazy(() => import('../pages/Careers/JobDetailsPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const BookDemoPage = lazy(() => import('../pages/BookDemo/BookDemoPage'));
const LandingPage = lazy(() => import('../pages/LandingPage/LandingPage'));
const LegalPage = lazy(() => import('../pages/Legal/LegalPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

// Admin Components (isolated from public website)
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const ProtectedRoute = lazy(() => import('../components/admin/ProtectedRoute'));
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'));
const AdminJobsPage = lazy(() => import('../pages/Admin/AdminJobsPage'));
const AdminJobFormPage = lazy(() => import('../pages/Admin/AdminJobFormPage'));
const AdminJobCandidatesPage = lazy(() => import('../pages/Admin/AdminJobCandidatesPage'));
const AdminBlogsPage = lazy(() => import('../pages/Admin/AdminBlogsPage'));
const AdminBlogFormPage = lazy(() => import('../pages/Admin/AdminBlogFormPage'));
const AdminAnnouncementsPage = lazy(() => import('../pages/Admin/AdminAnnouncementsPage'));
const AdminAnnouncementFormPage = lazy(() => import('../pages/Admin/AdminAnnouncementFormPage'));
const AdminAttendancePage = lazy(() => import('../pages/Admin/AdminAttendancePage'));
const AdminLeavesPage = lazy(() => import('../pages/Admin/AdminLeavesPage'));
const AdminEmployeesPage = lazy(() => import('../pages/Admin/AdminEmployeesPage'));
const AdminProfilePage = lazy(() => import('../pages/Admin/AdminProfilePage'));

// Auth / Registration Component
const PortalRegisterPage = lazy(() => import('../pages/Auth/PortalRegisterPage'));

// Employee Portal Components (Isolated frontend workspace)
const EmployeeProtectedRoute = lazy(() => import('../components/employee/EmployeeProtectedRoute'));
const EmployeeLoginPage = lazy(() => import('../pages/Employee/EmployeeLoginPage'));
const EmployeeDashboardPage = lazy(() => import('../pages/Employee/EmployeeDashboardPage'));

const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900" aria-busy="true">
    <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-[#F97316] animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  // Public Website Routes
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/products',
        element: <BillmasterPage />,
      },
      {
        path: '/our-products',
        element: <Navigate to="/products" replace />,
      },
      {
        path: '/products/billmaster',
        element: <BillmasterPage />,
      },
      {
        path: '/products/hardware',
        element: <HardwarePage />,
      },
      {
        path: '/products/all',
        element: <ProductsPage />,
      },
      {
        path: '/services',
        element: <ServicesPage />,
      },
      {
        path: '/services/web-development',
        element: <WebDevelopmentPage />,
      },
      {
        path: '/services/mobile-development',
        element: <MobileDevelopmentPage />,
      },
      {
        path: '/services/desktop-development',
        element: <DesktopDevelopmentPage />,
      },
      {
        path: '/services/digital-marketing',
        element: <DigitalMarketingPage />,
      },
      {
        path: '/industries',
        element: <IndustriesPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/about-us',
        element: <AboutPage />,
      },
      {
        path: '/about/founder',
        element: <Navigate to="/about-us" replace />,
      },
      {
        path: '/about-us/founder',
        element: <Navigate to="/about-us" replace />,
      },
      {
        path: '/resources',
        element: <ResourcesPage />,
      },
      {
        path: '/resources/blog',
        element: <BlogPage />,
      },
      {
        path: '/resources/blog/:slug',
        element: <BlogPostPage />,
      },
      {
        path: '/blog',
        element: <BlogPage />,
      },
      {
        path: '/blog/:slug',
        element: <BlogPostPage />,
      },
      {
        path: '/careers',
        element: <CareersPage />,
      },
      {
        path: '/careers/:jobId',
        element: <JobDetailsPage />,
      },
      {
        path: '/jobs/:jobId',
        element: <JobDetailsPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/book-demo',
        element: <BookDemoPage />,
      },
      {
        path: '/demo',
        element: <BookDemoPage />,
      },
      {
        path: '/landingpage',
        element: <LandingPage />,
      },
      {
        path: '/landing-page',
        element: <Navigate to="/landingpage" replace />,
      },
      {
        path: '/legal',
        element: <LegalPage />,
      },
      {
        path: '/legal-information',
        element: <Navigate to="/legal" replace />,
      },
      {
        path: '/legal-policies',
        element: <Navigate to="/legal" replace />,
      },
      {
        path: '/privacy-policy',
        element: <Navigate to="/legal#privacy-policy" replace />,
      },
      {
        path: '/terms-and-conditions',
        element: <Navigate to="/legal#terms-and-conditions" replace />,
      },
      {
        path: '/cookie-policy',
        element: <Navigate to="/legal#cookie-policy" replace />,
      },
      {
        path: '/disclaimer',
        element: <Navigate to="/legal#disclaimer" replace />,
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<FallbackLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },

  // Universal Authentication Routes (Registration / Sign In & Login)
  {
    path: '/signup',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <EmployeeLoginPage />
      </Suspense>
    ),
  },

  // Admin Section (Completely separate from public layout & navigation)
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/signup',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage defaultRole="CEO" />
      </Suspense>
    ),
  },
  {
    path: '/admin/register',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage defaultRole="CEO" />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'jobs',
        element: <AdminJobsPage />,
      },
      {
        path: 'jobs/new',
        element: <AdminJobFormPage />,
      },
      {
        path: 'jobs/:id/edit',
        element: <AdminJobFormPage />,
      },
      {
        path: 'jobs/:jobId/candidates',
        element: <AdminJobCandidatesPage />,
      },
      {
        path: 'jobs/:jobId/applications',
        element: <AdminJobCandidatesPage />,
      },
      {
        path: 'blogs',
        element: <AdminBlogsPage />,
      },
      {
        path: 'blogs/new',
        element: <AdminBlogFormPage />,
      },
      {
        path: 'blogs/add',
        element: <AdminBlogFormPage />,
      },
      {
        path: 'blogs/:id/edit',
        element: <AdminBlogFormPage />,
      },
      {
        path: 'announcements',
        element: <AdminAnnouncementsPage />,
      },
      {
        path: 'announcements/new',
        element: <AdminAnnouncementFormPage />,
      },
      {
        path: 'announcements/add',
        element: <AdminAnnouncementFormPage />,
      },
      {
        path: 'announcements/:id/edit',
        element: <AdminAnnouncementFormPage />,
      },
      {
        path: 'attendance',
        element: <AdminAttendancePage />,
      },
      {
        path: 'leaves',
        element: <AdminLeavesPage />,
      },
      {
        path: 'employees',
        element: <AdminEmployeesPage />,
      },
      {
        path: 'profile',
        element: <AdminProfilePage />,
      },
    ],
  },

  // Employee Portal Section (Frontend only, isolated from public website & CEO/Admin dashboard)
  {
    path: '/employee/login',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <EmployeeLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/employee/signup',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage defaultRole="Software Engineer" />
      </Suspense>
    ),
  },
  {
    path: '/employee/register',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <PortalRegisterPage defaultRole="Software Engineer" />
      </Suspense>
    ),
  },
  {
    path: '/employee/dashboard',
    element: (
      <Suspense fallback={<FallbackLoader />}>
        <EmployeeProtectedRoute>
          <EmployeeDashboardPage />
        </EmployeeProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/employee',
    element: <Navigate to="/employee/dashboard" replace />,
  },
]);

export default router;
