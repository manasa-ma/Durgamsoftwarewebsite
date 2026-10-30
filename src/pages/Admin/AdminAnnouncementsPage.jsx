import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Pin,
  Calendar,
  Building,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { INITIAL_ANNOUNCEMENTS } from '../../data/employeeMockData';

export const AdminAnnouncementsPage = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityTabs = [
    { key: 'all', label: 'All Priorities' },
    { key: 'Urgent', label: 'Urgent' },
    { key: 'High', label: 'High' },
    { key: 'Normal', label: 'Normal' },
    { key: 'Info', label: 'Info' },
  ];

  const fetchAnnouncements = async (silent = false, searchOverride = null, priorityOverride = null) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      let url = '/api/admin/announcements';
      const params = new URLSearchParams();
      const effectivePriority = priorityOverride !== null ? priorityOverride : selectedPriority;
      const effectiveSearch = searchOverride !== null ? searchOverride : searchTerm;

      if (effectivePriority !== 'all') {
        params.append('priority', effectivePriority);
      }
      if (effectiveSearch && effectiveSearch.trim()) {
        params.append('search', effectiveSearch.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnnouncements(data.announcements || []);
      } else if (!silent) {
        setError(data.message || 'Failed to fetch announcements.');
      }
    } catch {
      // Clean fallback for static mode
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedPriority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnnouncements(false, searchTerm);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== itemToDelete.id));
        setItemToDelete(null);
      } else {
        alert(data.message || 'Failed to delete announcement.');
      }
    } catch {
      alert('Network error while deleting announcement.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Urgent Alert
          </span>
        );
      case 'High':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      case 'Info':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Information
          </span>
        );
      case 'Normal':
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Normal Notice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Company Notices
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
            Announcements Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, pin, and broadcast executive announcements and guidelines directly to the employee portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchAnnouncements()}
            disabled={loading}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Refresh announcements"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/admin/announcements/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Announcement</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {priorityTabs.map((tab) => {
            const isSelected = selectedPriority === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedPriority(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, department, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#C74E23] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchAnnouncements(false, '');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchAnnouncements()}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C74E23] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading announcements...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Announcements Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {searchTerm
              ? `No announcements match the search keyword "${searchTerm}".`
              : 'There are no active company announcements. Create one to inform your workforce!'}
          </p>
          <Link
            to="/admin/announcements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142845] text-white text-xs font-bold transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Announcement</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-5 relative overflow-hidden"
            >
              <div className="flex-1 space-y-3">
                {/* Meta tags */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Pin className="w-3 h-3 text-amber-600" />
                      Pinned to Top
                    </span>
                  )}
                  {getPriorityBadge(ann.priority)}
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {ann.category}
                  </span>
                  <span className="font-medium text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {ann.targetDepartment || 'All Departments'}
                  </span>
                  <span className="font-medium text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-[#0B1F3A] leading-snug">
                  {ann.title}
                </h3>

                {/* Summary or excerpt */}
                {ann.summary && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {ann.summary}
                  </p>
                )}

                {/* Author credit */}
                <div className="text-[11px] text-slate-400 font-medium">
                  Author: <span className="font-bold text-slate-700">{ann.author || 'Venu Durgam (Managing Director)'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0">
                <Link
                  to={`/admin/announcements/${ann.id}/edit`}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Edit announcement"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setItemToDelete(ann)}
                  className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Delete Announcement?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong className="text-slate-800">"{itemToDelete.title}"</strong>? It will immediately disappear from the employee dashboard.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;
