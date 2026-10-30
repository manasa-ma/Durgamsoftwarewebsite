import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Building,
  User,
  AlertCircle,
  MessageSquare,
  Check,
  X,
  FileText,
  Paperclip,
  Eye,
  Download,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const DEPARTMENTS = [
  'All Departments',
  'Software Engineer',
  'HR',
  'Sales',
  'Hardware & POS Support',
];

export const AdminLeavesPage = () => {
  const { getAuthHeaders, adminUser } = useAdminAuth();

  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'Pending' | 'Approved' | 'Rejected'
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');

  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Action modal state (Approve or Reject)
  const [activeModal, setActiveModal] = useState(null); // { item, action: 'Approved' | 'Rejected' }
  const [modalRemarks, setModalRemarks] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Document attachment modal state
  const [viewingAttachment, setViewingAttachment] = useState(null); // { url, name, item }

  const statusTabs = [
    { key: 'all', label: 'All Requests' },
    { key: 'Pending', label: 'Pending Approvals', badge: stats.pending },
    { key: 'Approved', label: 'Approved', badge: stats.approved },
    { key: 'Rejected', label: 'Rejected', badge: stats.rejected },
  ];

  const fetchLeaves = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedDepartment !== 'All Departments') params.append('department', selectedDepartment);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/admin/leaves?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setLeaves(data.leaves || []);
        if (data.stats) setStats(data.stats);
      } else if (!silent) {
        setError(data.message || 'Failed to retrieve leave requests.');
      }
    } catch {
      // Clean fallback for static mode
      setLeaves([]);
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();

    // Auto-polling every 12 seconds so employee leave applications reflect immediately for CEO
    const interval = setInterval(() => {
      fetchLeaves(true);
    }, 12000);

    const onFocus = () => fetchLeaves(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [selectedStatus, selectedDepartment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeaves();
  };

  // Open modal for decision
  const openDecisionModal = (item, action) => {
    setActiveModal({ item, action });
    if (action === 'Approved') {
      setModalRemarks(`Approved by ${adminUser?.name || 'CEO'}. Please ensure project deliverables are aligned.`);
    } else {
      setModalRemarks('Request cannot be accommodated at this time due to critical project milestones.');
    }
  };

  const submitDecision = async () => {
    if (!activeModal) return;
    setActionSubmitting(true);

    try {
      const res = await fetch(`/api/admin/leaves/${activeModal.item.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          status: activeModal.action,
          managerRemarks: modalRemarks.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Optimistically update list
        setLeaves((prev) =>
          prev.map((l) => (l.id === activeModal.item.id ? data.leave : l))
        );

        // Update counts
        setStats((prev) => {
          const wasPending = activeModal.item.status === 'Pending';
          return {
            ...prev,
            pending: wasPending ? Math.max(0, prev.pending - 1) : prev.pending,
            approved: activeModal.action === 'Approved' ? prev.approved + 1 : prev.approved,
            rejected: activeModal.action === 'Rejected' ? prev.rejected + 1 : prev.rejected,
          };
        });

        setToastMessage(data.message);
        setTimeout(() => setToastMessage(''), 4000);
        setActiveModal(null);
      } else {
        alert(data.message || 'Failed to update leave request status.');
      }
    } catch {
      alert('Network error while updating leave request status.');
    } finally {
      setActionSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              CEO Review Section
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
            Leave Requests & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review, approve, or reject employee leave applications across all departments. Updates in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchLeaves()}
            disabled={loading}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Refresh leave requests"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Live Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Requests</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All historical submissions</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/90 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Action</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            {stats.pending}
          </div>
          <p className="text-[11px] text-amber-600/80 mt-1">
            {stats.pending > 0 ? 'Requires CEO decision' : 'All caught up!'}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200/90 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.approved}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Granted time off</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-red-200/90 shadow-2xs bg-red-50/20">
          <div className="flex items-center justify-between text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-700">
            {stats.rejected}
          </div>
          <p className="text-[11px] text-red-600/80 mt-1">Declined applications</p>
        </div>
      </div>

      {/* Filter and Status Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected
                        ? tab.key === 'Pending'
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-white/20 text-white'
                        : tab.key === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Department Filter & Search */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-[#C74E23]"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID or reason..."
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#C74E23] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  fetchLeaves();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
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
            onClick={() => fetchLeaves()}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Leaves Card List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C74E23] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading leave applications...</p>
          </div>
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No Leave Requests Found</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            {selectedStatus !== 'all'
              ? `There are no ${selectedStatus.toLowerCase()} leave applications for the current filters.`
              : 'No leave applications have been submitted by employees yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((item) => {
            const isPending = item.status === 'Pending';
            const hasAttachment = Boolean(item.attachmentUrl);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  isPending
                    ? 'border-amber-300/80 bg-amber-50/10'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Top Row: Employee details + status badge + action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-sm shrink-0 shadow-2xs mt-0.5">
                      {item.employeeName?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900">
                          {item.employeeName}
                        </h3>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {item.department}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.employeeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Applied on {item.appliedOn} • Request Ref: <span className="font-mono">{item.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStatusBadge(item.status)}

                    {/* Actions if Pending */}
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openDecisionModal(item, 'Approved')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          title="Approve this leave request"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openDecisionModal(item, 'Rejected')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          title="Reject this leave request"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openDecisionModal(item, item.status === 'Approved' ? 'Rejected' : 'Approved')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer"
                      >
                        Change Decision
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
                      Leave Category
                    </span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {item.leaveType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
                      Duration & Dates
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm block mt-0.5">
                      {item.fromDate} to {item.toDate}{' '}
                      <span className="text-orange-600 font-sans font-bold">
                        ({item.daysCount} {item.daysCount === 1 ? 'day' : 'days'})
                      </span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
                      Review Authority
                    </span>
                    <span className="font-bold text-slate-700 block mt-0.5">
                      {item.reviewedBy || 'Pending CEO / HR Review'}
                    </span>
                  </div>
                </div>

                {/* Reason & Optional Attached Document */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                      Employee Stated Reason:
                    </span>
                    <p className="text-slate-700 font-normal leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  {/* Attachment Pill if employee attached document */}
                  {hasAttachment && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Attached Document:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setViewingAttachment({
                            url: item.attachmentUrl,
                            name: item.attachmentName || 'Attached Document',
                            item,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>View Attachment</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Manager Remarks (if present) */}
                {item.managerRemarks && (
                  <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    item.status === 'Approved'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : item.status === 'Rejected'
                        ? 'bg-red-50/60 border-red-200 text-red-950'
                        : 'bg-amber-50/60 border-amber-200 text-amber-950'
                  }`}>
                    <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                    <div>
                      <span className="font-bold block">
                        Official Decision Remarks:
                      </span>
                      <p className="text-[11px] mt-0.5 leading-relaxed font-medium">
                        {item.managerRemarks}
                      </p>
                      {item.reviewedAt && (
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Updated at {new Date(item.reviewedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Review Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white ${
                    activeModal.action === 'Approved' ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  {activeModal.action === 'Approved' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {activeModal.action === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeModal.item.employeeName} ({activeModal.item.department})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Leave Type:</span>
                <span className="font-bold text-slate-800">{activeModal.item.leaveType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dates:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {activeModal.item.fromDate} to {activeModal.item.toDate} ({activeModal.item.daysCount} days)
                </span>
              </div>
              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Employee Reason:</span>
                <p className="text-slate-700 italic">"{activeModal.item.reason}"</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Manager Remarks / Instructions for Employee
              </label>
              <textarea
                rows={3}
                value={modalRemarks}
                onChange={(e) => setModalRemarks(e.target.value)}
                placeholder="Enter remarks visible to the employee on their portal..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#C74E23] transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                disabled={actionSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDecision}
                disabled={actionSubmitting}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2 ${
                  activeModal.action === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    Confirm {activeModal.action === 'Approved' ? 'Approval' : 'Rejection'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal for CEO */}
      {viewingAttachment && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setViewingAttachment(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B1F3A] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-orange-400 flex items-center justify-center font-bold">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black">
                    Supporting Document
                  </h3>
                  <p className="text-xs text-slate-300">
                    {viewingAttachment.item.employeeName} • {viewingAttachment.name || 'Attachment'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingAttachment(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {viewingAttachment.url.startsWith('data:image/') || viewingAttachment.url.startsWith('http') ? (
                <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center max-h-[360px]">
                  <img
                    src={viewingAttachment.url}
                    alt="Supporting document preview"
                    className="w-full h-full object-contain max-h-[360px]"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <FileText className="w-12 h-12 text-[#C74E23] mx-auto" />
                  <p className="text-sm font-bold text-slate-800">{viewingAttachment.name || 'Document File'}</p>
                  <p className="text-xs text-slate-500">File attached by employee for this leave request.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <a
                  href={viewingAttachment.url}
                  download={viewingAttachment.name || 'leave_document'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>

                <button
                  type="button"
                  onClick={() => setViewingAttachment(null)}
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142845] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeavesPage;
