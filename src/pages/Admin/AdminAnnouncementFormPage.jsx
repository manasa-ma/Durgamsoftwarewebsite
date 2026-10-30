import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  Pin,
  Calendar,
  Building,
  User,
  Sparkles,
  Eye,
  FileText,
  Clock,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const CATEGORIES = [
  'General Notice',
  'Holiday & Celebration',
  'HR Policy',
  'Emergency & Operations',
  'Technical Update',
  'Event & Meeting',
  'Company Milestone',
];

const DEPARTMENTS = [
  'All Departments',
  'Software Development',
  'Sales & Marketing',
  'Human Resources',
  'Hardware & POS Support',
];

const PRIORITIES = [
  { value: 'Normal', label: 'Normal Notice', color: 'blue', desc: 'Standard company updates & memos' },
  { value: 'High', label: 'High Priority', color: 'amber', desc: 'Important guidelines needing prompt attention' },
  { value: 'Urgent', label: 'Urgent Alert', color: 'red', desc: 'Critical notice with high-visibility banner' },
  { value: 'Info', label: 'Information', color: 'slate', desc: 'General informational notes' },
];

export const AdminAnnouncementFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { getAuthHeaders } = useAdminAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'General Notice',
    priority: 'Normal',
    targetDepartment: 'All Departments',
    isPinned: false,
    author: 'Venu Durgam (Managing Director)',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  // If editing, load announcement details
  useEffect(() => {
    if (!isEditing) return;

    const fetchAnnouncement = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(`/api/announcements/${id}`);
        const data = await res.json();
        if (res.ok && data.success && data.announcement) {
          const a = data.announcement;
          setFormData({
            title: a.title || '',
            category: a.category || 'General Notice',
            priority: a.priority || 'Normal',
            targetDepartment: a.targetDepartment || 'All Departments',
            isPinned: Boolean(a.isPinned),
            author: a.author || 'Venu Durgam (Managing Director)',
            date: a.date || new Date().toISOString().split('T')[0],
            summary: a.summary || '',
            content: a.content || '',
          });
        } else {
          setErrorMessage(data.message || 'Failed to load announcement details.');
        }
      } catch {
        setErrorMessage('Unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please provide an announcement title.');
      return;
    }

    if (!formData.content.trim()) {
      setErrorMessage('Please provide the announcement message content.');
      return;
    }

    setSubmitting(true);

    try {
      const url = isEditing ? `/api/admin/announcements/${id}` : '/api/admin/announcements';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...formData,
          isPinned: formData.isPinned ? 1 : 0,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessData(data.announcement || formData);
      } else {
        setErrorMessage(data.message || 'Failed to save announcement.');
      }
    } catch {
      setErrorMessage('A network error occurred while saving the announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C74E23] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading announcement details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          to="/admin/announcements"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Announcements</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 text-[#C74E23] flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
              {isEditing ? 'Edit Announcement' : 'Add New Announcement'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Broadcast company updates, holiday notices, and policy guidelines to the employee dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successData && (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-base font-black">
                {isEditing ? 'Announcement Updated!' : 'Announcement Published Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800">
                This notice is now live in the employee dashboard and all active staff will receive the notification alert.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/admin/announcements"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              View All Announcements
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccessData(null);
                if (!isEditing) {
                  setFormData({
                    title: '',
                    category: 'General Notice',
                    priority: 'Normal',
                    targetDepartment: 'All Departments',
                    isPinned: false,
                    author: 'Venu Durgam (Managing Director)',
                    date: new Date().toISOString().split('T')[0],
                    summary: '',
                    content: '',
                  });
                }
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition-colors cursor-pointer"
            >
              {isEditing ? 'Continue Editing' : 'Post Another Announcement'}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Announcement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Annual Diwali Bonus & Festive Holiday Schedule 2026"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 transition-all font-semibold"
                required
              />
            </div>

            {/* Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] bg-white transition-all font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Audience
                </label>
                <select
                  name="targetDepartment"
                  value={formData.targetDepartment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] bg-white transition-all font-medium"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRIORITIES.map((p) => {
                  const isSelected = formData.priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: p.value }))}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? p.value === 'Urgent'
                            ? 'bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/20'
                            : p.value === 'High'
                              ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                              : 'bg-orange-50 border-[#C74E23] text-slate-900 ring-2 ring-[#C74E23]/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black">{p.value}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#C74E23]" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">{p.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Summary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Summary (1-2 sentences for notification banner)
              </label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary visible on employee dashboard banner..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] transition-all"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Announcement Message / Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                rows={7}
                value={formData.content}
                onChange={handleChange}
                placeholder="Type your official announcement or notice here. Paragraphs and line breaks are formatted automatically for employees..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 transition-all font-normal leading-relaxed"
                required
              />
            </div>

            {/* Date & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Notice Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Author / Authority
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-[#C74E23] bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Pin to Top Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#C74E23] focus:ring-[#C74E23]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                    <Pin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pin Announcement to Top</span>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Pinned announcements stay fixed at the top of the Employee Portal announcements list.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                to="/admin/announcements"
                className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" />
                    <span>{isEditing ? 'Save Changes' : 'Publish Announcement'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Live Employee View Preview Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Eye className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Employee Preview
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This is a live preview of how this announcement appears in the Employee Workspace.
            </p>

            {/* Preview Box */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {formData.isPinned && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[9px]">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                    formData.priority === 'Urgent'
                      ? 'bg-red-100 text-red-700'
                      : formData.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formData.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[9px]">
                    {formData.category}
                  </span>
                </div>
                <span>{formData.date || 'Today'}</span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                {formData.title || 'Announcement Title Preview'}
              </h4>

              {formData.summary && (
                <p className="text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {formData.summary}
                </p>
              )}

              <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed line-clamp-4">
                {formData.content || 'Your detailed announcement message will appear here...'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                <span>By: {formData.author}</span>
                <span className="text-orange-600 font-bold">New Notification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementFormPage;
