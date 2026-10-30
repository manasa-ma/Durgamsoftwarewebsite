import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  PowerOff,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Users,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { CAREERS_PAGE_DATA } from '../../data/careers';

export const AdminJobsPage = () => {
  const { getAuthHeaders, adminUser } = useAdminAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Format user display name - All set to CEO as requested
  const getDisplayName = () => {
    return 'CEO';
  };

  // Delete modal state
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status update loading state
  const [updatingId, setUpdatingId] = useState(null);

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'deactivated', label: 'Deactivated' },
    { key: 'draft', label: 'Draft' },
    { key: 'closed', label: 'Closed' },
  ];

  const fetchJobs = async (silent = false, searchOverride = null, statusOverride = null) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      let url = '/api/admin/jobs';
      const params = new URLSearchParams();
      const effectiveStatus = statusOverride !== null ? statusOverride : selectedStatus;
      const effectiveSearch = searchOverride !== null ? searchOverride : searchTerm;

      if (effectiveStatus !== 'all') {
        params.append('status', effectiveStatus);
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
        setJobs(data.jobs || []);
      } else if (!silent) {
        setError(data.message || 'Failed to fetch jobs.');
      }
    } catch {
      // Clean fallback for static mode
      const staticPositions = CAREERS_PAGE_DATA.positions.map((p) => ({
        ...p,
        status: 'published',
        applicationsCount: 0,
      }));
      setJobs(staticPositions);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(() => fetchJobs(true), 10000);
    return () => clearInterval(interval);
  }, [selectedStatus]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    // When user removes all text, immediately reload all jobs without needing to submit
    if (!val.trim()) {
      fetchJobs(false, '');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchJobs(false, '');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(false, searchTerm);
  };

  const handleStatusToggle = async (job, newStatus) => {
    setUpdatingId(job.id);
    const currentEditor = getDisplayName(adminUser);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          status: newStatus,
          updatedBy: currentEditor,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: newStatus,
                  statusChangedAt: data.statusChangedAt || new Date().toISOString(),
                  updatedBy: data.updatedBy || currentEditor,
                }
              : j
          )
        );
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
        setJobToDelete(null);
      } else {
        alert(data.message || 'Failed to delete job.');
      }
    } catch (err) {
      alert('Network error while deleting job: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Postings Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, activate, deactivate, and track applications for all company vacancies.
          </p>
        </div>

        <Link
          to="/admin/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs: All, Active, Draft, Closed */}
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search title, role, city..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Clear search and return to all jobs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchJobs}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Jobs Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Jobs List...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No jobs match your filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              Try searching with different keywords or switch the status filter tab.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                fetchJobs(false, '', 'all');
              }}
              className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3.5 px-5">Job Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Deactivate</th>
                  <th className="py-3.5 px-4 text-center">Count</th>
                  <th className="py-3.5 px-4">Created & Edited By</th>
                  <th className="py-3.5 px-4">Status Change Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
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

                  const isUpdating = updatingId === job.id;
                  const isActive = job.status === 'published' || job.status === 'active';
                  const statusChangeDate = new Date(job.statusChangedAt || job.updatedAt || job.createdAt);

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Job Title & Department & Experience */}
                      <td className="py-4 px-5">
                        <Link
                          to={`/admin/jobs/${job.id}/edit`}
                          className="font-bold text-slate-900 hover:text-[#EA580C] transition-colors block text-sm"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                          <span className="font-semibold text-[#EA580C]">
                            {job.department}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">
                            {job.experience}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}
                        >
                          {displayStatus}
                        </span>
                      </td>

                      {/* Deactivate / Activate Column */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {isActive ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusToggle(job, 'deactivated')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer disabled:opacity-50"
                            title="Deactivate job (status changes to deactivated)"
                          >
                            {isUpdating ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <PowerOff className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusToggle(job, 'published')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors cursor-pointer disabled:opacity-50"
                            title="Activate job (publish to public careers)"
                          >
                            {isUpdating ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span>Activate</span>
                          </button>
                        )}
                      </td>

                      {/* Count Column (E-commerce Cart Style with Red Badge for New Applications) */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center">
                          <Link
                            to={`/admin/jobs/${job.id}/candidates`}
                            onClick={() => {
                              // Optimistically clear newApplicationCount locally so badge clears
                              setJobs((prev) =>
                                prev.map((j) => (j.id === job.id ? { ...j, newApplicationCount: 0 } : j))
                              );
                            }}
                            className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer group shadow-2xs ${
                              job.newApplicationCount > 0
                                ? 'bg-red-50 text-red-950 border border-red-200 hover:bg-red-100'
                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-orange-50 hover:text-brand-orange hover:border-orange-200'
                            }`}
                            title={`View ${job.applicationCount || 0} candidate applications (${job.newApplicationCount || 0} new)`}
                          >
                            <Users
                              className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                                job.newApplicationCount > 0 ? 'text-red-600' : 'text-slate-600 group-hover:text-brand-orange'
                              }`}
                            />
                            <span>{job.applicationCount || 0} Applied</span>

                            {/* Red E-commerce Cart Style Badge indicating new applications */}
                            {job.newApplicationCount > 0 && (
                              <span
                                className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black leading-none shadow-md ring-2 ring-white animate-pulse"
                                title={`${job.newApplicationCount} new application${job.newApplicationCount > 1 ? 's' : ''}!`}
                              >
                                {job.newApplicationCount > 99 ? '99+' : job.newApplicationCount}
                              </span>
                            )}
                          </Link>
                        </div>
                      </td>

                      {/* Created and Edited By (No Dropdown - Shows logged in names like Admin, HR) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1.5 text-xs">
                          {/* Created By */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide w-14 shrink-0">
                              Created:
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold text-slate-700 bg-slate-100 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span>{getDisplayName(job.createdBy)}</span>
                            </span>
                          </div>

                          {/* Edited By */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide w-14 shrink-0">
                              Edited:
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold text-orange-800 bg-orange-50 border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                              <span>{getDisplayName(job.updatedBy || job.createdBy)}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Change Date (Replaces Created Date) */}
                      <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {statusChangeDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {statusChangeDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                        {/* View Candidates */}
                        <Link
                          to={`/admin/jobs/${job.id}/candidates`}
                          className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Applied Candidates"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Link>

                        {/* View live public page if active */}
                        {isActive && (
                          <a
                            href={`/careers/${job.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="View Public Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Edit */}
                        <Link
                          to={`/admin/jobs/${job.id}/edit`}
                          className="inline-flex items-center p-1.5 text-[#EA580C] hover:text-[#C74E23] rounded-lg hover:bg-orange-50 transition-colors"
                          title="Edit Job Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setJobToDelete(job)}
                          className="inline-flex items-center p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      {jobToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3
              id="delete-dialog-title"
              className="text-lg font-black text-slate-900 tracking-tight"
            >
              Are you sure you want to delete this job?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              You are about to permanently delete <strong className="text-slate-900">"{jobToDelete.title}"</strong>. This will remove the posting from the database and the public Careers page. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Job</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;
