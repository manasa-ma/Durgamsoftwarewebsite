import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';

export const EmployeeLayout = ({ activeTab, onSelectTab, children }) => {
  const { employeeUser, logout, unreadAnnouncementsCount } = useEmployeeAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Enforce noindex, nofollow for employee portal
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the Employee Portal?')) {
      logout();
      navigate('/employee/login', { replace: true });
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Clock,
    },
    {
      id: 'leaves',
      label: 'Leave Requests',
      icon: Calendar,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Bell,
    },
  ];

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Employee Dashboard';
      case 'attendance':
        return 'Attendance Management';
      case 'leaves':
        return 'Leave Applications';
      case 'profile':
        return 'Employee Profile Details';
      case 'announcements':
        return 'Company Announcements';
      default:
        return 'Workspace';
    }
  };

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
              Employee Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell with Badge (Mobile) */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('announcements');
              setMobileMenuOpen(false);
            }}
            className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} unread announcements` : 'Announcements'}
          >
            <Bell className="w-4 h-4 text-orange-400" />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Active status indicator */}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {employeeUser?.department?.split(' ')[0]}
          </span>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={durgamSoftLogo}
                alt="Durgam Soft Logo"
                className="w-9 h-9 object-contain drop-shadow-sm"
              />
              <div>
                <h1 className="font-bold text-sm tracking-wide text-white">
                  Durgam Soft
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-orange-400 uppercase tracking-wider font-semibold">
                    Employee Portal
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Workspace Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#C74E23] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'announcements' && unreadAnnouncementsCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-red-500 text-white shadow-xs">
                      {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                External Link
              </span>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-orange-400" />
                  <span>Public Website</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Employee Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {employeeUser?.photo ? (
                <img
                  src={employeeUser.photo}
                  alt={employeeUser?.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{employeeUser?.name ? employeeUser.name.charAt(0).toUpperCase() : 'E'}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {employeeUser?.name || 'Employee'}
              </p>
              <p className="text-[11px] text-orange-400 font-semibold truncate">
                {employeeUser?.department}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {employeeUser?.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ======================================================== */}
      {/* MAIN DASHBOARD CONTENT AREA                               */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar on Desktop */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-base font-black text-[#0B1F3A]">
              {getSectionTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell Button (Desktop) */}
            <button
              type="button"
              onClick={() => onSelectTab('announcements')}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'announcements'
                  ? 'bg-orange-50 border-orange-300 text-[#C74E23]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} unread announcement(s)` : 'Company Announcements'}
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
                </span>
              )}
            </button>

            {employeeUser?.photo && (
              <img
                src={employeeUser.photo}
                alt={employeeUser?.name || 'Profile'}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shadow-2xs"
              />
            )}
            <span className="text-xs font-bold text-slate-800">
              {employeeUser?.name}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#C74E23] border border-orange-200">
              {employeeUser?.department}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
