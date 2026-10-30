import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Megaphone,
  Clock,
  Calendar,
  Users,
  User,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import durgamSoftLogo from '../assets/logos/durgamsoft-logo.webp';

export const AdminLayout = () => {
  const { adminUser, logout, getAuthHeaders } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadAppsCount, setUnreadAppsCount] = useState(0);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Static notification badges
  useEffect(() => {
    setUnreadAppsCount(0);
    setPendingLeavesCount(0);
  }, [location.pathname]);

  // Enforce noindex, nofollow for search engines
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const originalContent = robotsMeta.getAttribute('content');
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (originalContent) {
        robotsMeta.setAttribute('content', originalContent);
      } else {
        robotsMeta.removeAttribute('content');
      }
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the admin panel?')) {
      logout();
      navigate('/admin/login', { replace: true });
    }
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/admin/jobs',
      label: 'Jobs Management',
      icon: Briefcase,
      end: true,
    },
    {
      to: '/admin/jobs/new',
      label: 'Add Job',
      icon: PlusCircle,
      end: true,
    },
    {
      to: '/admin/blogs',
      label: 'Blogs Management',
      icon: BookOpen,
      end: true,
    },
    {
      to: '/admin/blogs/new',
      label: 'Add Blogs',
      icon: PlusCircle,
      end: true,
    },
    {
      to: '/admin/announcements',
      label: 'Announcements',
      icon: Megaphone,
      end: true,
    },
    {
      to: '/admin/announcements/new',
      label: 'Add Announcement',
      icon: PlusCircle,
      end: true,
    },
    {
      to: '/admin/employees',
      label: 'Employee Management',
      icon: Users,
      end: true,
    },
    {
      to: '/admin/attendance',
      label: 'Employee Attendance',
      icon: Clock,
      end: true,
    },
    {
      to: '/admin/leaves',
      label: 'Leave Approvals',
      icon: Calendar,
      badge: pendingLeavesCount,
      end: true,
    },
    {
      to: '/admin/profile',
      label: 'My Profile',
      icon: User,
      end: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* ======================================================== */}
      {/* MOBILE TOPBAR                                             */}
      {/* ======================================================== */}
      <header className="md:hidden bg-[#071525] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img
            src={durgamSoftLogo}
            alt="Durgam Soft Logo"
            className="w-8 h-8 object-contain drop-shadow-sm"
          />
          <div>
            <span className="font-bold text-sm tracking-wide block">Durgam Soft</span>
            <span className="text-[10px] text-orange-400 uppercase tracking-widest font-semibold block">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadAppsCount > 0 && (
            <Link
              to="/admin/jobs"
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center"
              title={`${unreadAppsCount} new applicant${unreadAppsCount > 1 ? 's' : ''}`}
            >
              <Briefcase className="w-5 h-5 text-orange-400" />
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black leading-none ring-2 ring-[#071525] animate-pulse">
                {unreadAppsCount > 99 ? '99+' : unreadAppsCount}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* DESKTOP / MOBILE SIDEBAR                                  */}
      {/* ======================================================== */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 bg-[#071525] text-white w-64 shrink-0 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <img
                src={durgamSoftLogo}
                alt="Durgam Soft Logo"
                className="w-9 h-9 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <div>
                <h1 className="font-bold text-sm tracking-wide text-white group-hover:text-orange-400 transition-colors">
                  Durgam Soft
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Admin Portal
                  </span>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isJobsNav = item.to === '/admin/jobs';
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#F97316] text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {/* Dynamic counter badge for Leave Requests or other items */}
                  {item.badge > 0 && (
                    <span
                      className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-black leading-none shadow-md ring-2 ring-[#071525] animate-pulse"
                      title={`${item.badge} pending request${item.badge > 1 ? 's' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Red e-commerce cart style badge for new candidate applications */}
                  {isJobsNav && unreadAppsCount > 0 && (
                    <span
                      className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black leading-none shadow-md ring-2 ring-[#071525] animate-pulse"
                      title={`${unreadAppsCount} new candidate application${unreadAppsCount > 1 ? 's' : ''}!`}
                    >
                      {unreadAppsCount > 99 ? '99+' : unreadAppsCount}
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                External
              </span>
              <a
                href="/careers"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-orange-400" />
                  <span>Public Careers</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <Link
            to="/admin/profile"
            className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors group cursor-pointer"
            title="View CEO Profile"
          >
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-orange-400 shrink-0 overflow-hidden">
              {adminUser?.photo ? (
                <img
                  src={adminUser.photo}
                  alt={adminUser?.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'V'}</span>
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                {adminUser?.name || 'Venu Durgam'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {adminUser?.email || 'ceo@durgamsoft.com'}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
