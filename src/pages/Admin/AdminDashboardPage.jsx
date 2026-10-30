import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  FileEdit,
  Archive,
  PlusCircle,
  ArrowRight,
  Eye,
  RefreshCw,
  Users,
  BookOpen,
  Megaphone,
  Clock,
  Calendar,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getSharedAttendance, getSharedLeaves } from '../../utils/sharedStorage';
import { getRegisteredUsers } from '../../utils/authStorage';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';

export const AdminDashboardPage = () => {
  const { getAuthHeaders, adminUser } = useAdminAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    publishedJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalAnnouncements: 0,
    todayAttendanceCount: 0,
    pendingLeavesCount: 0,
    totalEmployeesCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = () => {
    setLoading(true);
    setError('');

    const allAttendance = getSharedAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttCount = allAttendance.filter((r) => r.date === todayStr).length;

    const allLeaves = getSharedLeaves();
    const pendingLeaves = allLeaves.filter((l) => l.status === 'Pending').length;

    const registeredUsers = getRegisteredUsers();

    setStats({
      totalJobs: 6,
      publishedJobs: 6,
      draftJobs: 0,
      closedJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      totalBlogs: 8,
      publishedBlogs: 8,
      totalAnnouncements: 2,
      todayAttendanceCount: todayAttCount,
      pendingLeavesCount: pendingLeaves,
      totalEmployeesCount: Math.max(1, registeredUsers.length),
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    const onUpdate = () => fetchDashboardData();
    window.addEventListener('durgam_attendance_updated', onUpdate);
    window.addEventListener('durgam_leaves_updated', onUpdate);
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener('durgam_attendance_updated', onUpdate);
      window.removeEventListener('durgam_leaves_updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  const statCards = [
    {
      title: 'Total Job Postings',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'blue',
      description: 'All postings across all states',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Active (Live)',
      value: stats.publishedJobs,
      icon: CheckCircle2,
      color: 'emerald',
      description: 'Visible on public careers page',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Total Candidates',
      value: stats.totalApplications,
      icon: Users,
      color: 'indigo',
      badge: stats.newApplications > 0 ? stats.newApplications : null,
      description: 'Candidate applications received',
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      to: '/admin/jobs',
    },
    {
      title: 'Draft Postings',
      value: stats.draftJobs,
      icon: FileEdit,
      color: 'amber',
      description: 'Work in progress, hidden from public',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Closed / Archived',
      value: stats.closedJobs,
      icon: Archive,
      color: 'slate',
      description: 'Expired or filled vacancies',
      bgColor: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      title: 'Total Blogs & Insights',
      value: stats.totalBlogs || 0,
      icon: BookOpen,
      color: 'amber',
      description: 'Articles published on website',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
      to: '/admin/blogs',
    },
    {
      title: 'Company Announcements',
      value: stats.totalAnnouncements || 0,
      icon: Megaphone,
      color: 'purple',
      description: 'Active employee notices',
      bgColor: 'bg-purple-50 text-purple-600 border-purple-200',
      to: '/admin/announcements',
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployeesCount || 0,
      icon: Users,
      color: 'blue',
      description: 'Active staff directory',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
      to: '/admin/employees',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendanceCount || 0,
      icon: Clock,
      color: 'emerald',
      description: 'Staff checked in today',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      to: '/admin/attendance',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeavesCount || 0,
      icon: Calendar,
      color: 'amber',
      badge: stats.pendingLeavesCount > 0 ? stats.pendingLeavesCount : null,
      description: 'Requires approval / rejection',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
      to: '/admin/leaves',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-[#071525] via-[#0B1F3A] to-[#142845] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm">
              <img
                src={durgamSoftLogo}
                alt="Durgam Soft Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
                  Admin Console
                </span>
                <span className="text-slate-400 text-xs">Durgam Soft Careers</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, {adminUser?.name || 'Administrator'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Manage career openings, publish new roles, and oversee job postings on the official Durgam Soft website.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Refresh statistics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/admin/leaves"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all cursor-pointer relative"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Leaves</span>
              {stats.pendingLeavesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title={`${stats.pendingLeavesCount} pending approval`} />
              )}
            </Link>
            <Link
              to="/admin/announcements/new"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all cursor-pointer"
            >
              <Megaphone className="w-4 h-4 text-orange-400" />
              <span>Add Announcement</span>
            </Link>
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Add Blogs</span>
            </Link>
            <Link
              to="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div
                  className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${card.bgColor}`}
                >
                  <Icon className="w-5 h-5" />
                  {card.badge && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-black leading-none shadow-md ring-2 ring-white animate-pulse"
                      title={`${card.badge} new applications`}
                    >
                      {card.badge > 99 ? '99+' : card.badge}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 flex items-baseline gap-2">
                  <span>{loading ? '...' : card.value}</span>
                  {card.badge && (
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                      +{card.badge} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Job Postings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest vacancies managed through the admin panel
            </p>
          </div>
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#C74E23] transition-colors"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Postings...</p>
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#EA580C] mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No jobs posted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Get started by creating your first career opening. It can be saved as a draft or published immediately.
            </p>
            <Link
              to="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#EA580C] text-white text-xs font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Job</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3 px-5">Job Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-5 text-right">Public View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentJobs.map((job) => {
                  let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  let displayStatus = job.status;

                  if (job.status === 'published' || job.status === 'active') {
                    statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    displayStatus = 'Active';
                  } else if (job.status === 'deactivated' || job.status === 'deactivate') {
                    statusBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                    displayStatus = 'Deactivated';
                  } else if (job.status === 'draft') {
                    statusBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    displayStatus = 'Draft';
                  } else if (job.status === 'closed') {
                    statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
                    displayStatus = 'Closed';
                  }

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        <span>{job.title}</span>
                        <span className="block text-[11px] font-normal text-slate-500">
                          {job.jobType} · {job.experience}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{job.department}</td>
                      <td className="py-3.5 px-4 text-slate-600">{job.location}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {job.status === 'published' ? (
                          <a
                            href={`/careers/${job.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#EA580C] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                            title="View live public posting"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span>View Live</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unpublished</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
