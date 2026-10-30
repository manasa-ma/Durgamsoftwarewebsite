import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminJobFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { getAuthHeaders, adminUser } = useAdminAuth();

  const getDisplayName = () => {
    return 'CEO';
  };

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering & Tech',
    location: 'Hyderabad',
    jobType: 'Full Time',
    experience: '1+ Years',
    salary: '',
    applicationLink: 'careers@durgamsoft.com',
    status: 'draft',
    createdBy: 'CEO',
    updatedBy: 'CEO',
    description: '',
    responsibilities: [''],
    requirements: [''],
    skills: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If editing, load job data
  useEffect(() => {
    if (!isEditing) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/jobs/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success && data.job) {
          const j = data.job;
          setFormData({
            title: j.title || '',
            department: j.department || 'Engineering & Tech',
            location: j.location || 'Hyderabad',
            jobType: j.jobType || 'Full Time',
            experience: j.experience || '1+ Years',
            salary: j.salary || '',
            applicationLink: j.applicationLink || 'careers@durgamsoft.com',
            status: j.status || 'draft',
            createdBy: j.createdBy || 'CEO',
            updatedBy: j.updatedBy || 'CEO',
            description: j.description || '',
            responsibilities:
              Array.isArray(j.responsibilities) && j.responsibilities.length > 0
                ? j.responsibilities
                : [''],
            requirements:
              Array.isArray(j.requirements) && j.requirements.length > 0
                ? j.requirements
                : [''],
            skills: Array.isArray(j.skills) ? j.skills.join(', ') : j.skills || '',
          });
        } else {
          setErrorMessage(data.message || 'Job not found.');
        }
      } catch {
        setErrorMessage('Failed to load job details from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Responsibilities list helpers
  const handleListChange = (field, index, value) => {
    setFormData((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const handleAddListItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveListItem = (field, index) => {
    setFormData((prev) => {
      const list = [...prev[field]];
      if (list.length <= 1) {
        list[0] = '';
        return { ...prev, [field]: list };
      }
      list.splice(index, 1);
      return { ...prev, [field]: list };
    });
  };

  const handleSubmit = async (targetStatus) => {
    setErrorMessage('');
    setSuccessMessage('');

    // Form validations
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a job title.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please specify job location(s).');
      return;
    }
    if (!formData.experience.trim()) {
      setErrorMessage('Please specify required experience.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Please provide a job overview/description.');
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      status: targetStatus,
      createdBy: 'CEO',
      updatedBy: 'CEO',
      responsibilities: formData.responsibilities.filter((item) => item.trim().length > 0),
      requirements: formData.requirements.filter((item) => item.trim().length > 0),
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = isEditing ? `/api/admin/jobs/${id}` : '/api/admin/jobs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isEditing
            ? `Job successfully updated (${targetStatus}).`
            : `Job successfully created (${targetStatus})!`
        );
        setTimeout(() => {
          navigate('/admin/jobs');
        }, 1200);
      } else {
        setErrorMessage(data.message || 'Failed to save job posting.');
      }
    } catch {
      setErrorMessage('Network error while saving job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        navigate('/admin/jobs');
      } else {
        setErrorMessage(data.message || 'Failed to delete job.');
        setShowDeleteModal(false);
      }
    } catch {
      setErrorMessage('Network error while deleting job.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Loading Job Information...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to all jobs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEditing ? `Edit Job: ${formData.title || 'Position'}` : 'Create New Job Opening'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update role specifications, requirements, and live publication status'
                : 'Fill in details to post a new opening on the Durgam Soft Careers portal'}
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isEditing && (
            <button
              type="button"
              disabled={submitting || isDeleting}
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
              title="Delete this job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('published')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish Job</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage} Redirecting...</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Section 1: Basic Role Meta */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C] mb-4">
            1. Role Overview & Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Senior React Developer, Field Marketing Executive"
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              >
                <option value="Engineering & Tech">Engineering & Tech</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => handleChange('jobType', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Hyderabad, or Hyderabad, Warangal, Vijayawada"
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Separate multiple locations with commas
              </span>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g. 1+ Years, Freshers, 2-4 Years"
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Salary / Compensation (Optional)
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="e.g. ₹20,000 – ₹50,000 / month, or Competitive"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              />
            </div>

            {/* Application Email or Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Application Email / Link
              </label>
              <input
                type="text"
                value={formData.applicationLink}
                onChange={(e) => handleChange('applicationLink', e.target.value)}
                placeholder="careers@durgamsoft.com"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
              />
            </div>

            {/* Created By Info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Created By
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 flex items-center justify-between">
                <span>CEO</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Management
                </span>
              </div>
            </div>

            {/* Edited By Info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Last Edited By
              </label>
              <div className="w-full px-4 py-2.5 text-sm bg-orange-50/60 border border-orange-200 rounded-xl font-semibold text-orange-950 flex items-center justify-between">
                <span>CEO</span>
                <span className="text-[10px] text-orange-600 uppercase tracking-wider font-bold">
                  Management
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Publication Status
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  {
                    val: 'draft',
                    label: 'Draft',
                    desc: 'Save privately. Hidden from public website.',
                  },
                  {
                    val: 'published',
                    label: 'Active (Live)',
                    desc: 'Visible immediately on public careers page.',
                  },
                  {
                    val: 'deactivated',
                    label: 'Deactivated',
                    desc: 'Deactivated role. Hidden from public careers.',
                  },
                  {
                    val: 'closed',
                    label: 'Closed / Archived',
                    desc: 'Applications closed. Hidden from public careers.',
                  },
                ].map((s) => (
                  <label
                    key={s.val}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all flex-1 min-w-[200px] ${
                      formData.status === s.val
                        ? 'border-[#EA580C] bg-orange-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.val}
                      checked={formData.status === s.val}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="mt-1 text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{s.label}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">{s.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Job Overview & Description */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C] mb-4">
            2. Role Overview & Description <span className="text-red-500">*</span>
          </h2>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Write a clear summary of the role, responsibilities, and how this individual will make an impact at Durgam Soft..."
            required
            className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all leading-relaxed"
          />
        </div>

        {/* Section 3: Responsibilities List */}
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C]">
              3. Key Responsibilities
            </h2>
            <button
              type="button"
              onClick={() => handleAddListItem('responsibilities')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:text-[#C74E23]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Responsibility</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleListChange('responsibilities', idx, e.target.value)}
                  placeholder="e.g. Architect and maintain performant cross-platform mobile apps"
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem('responsibilities', idx)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Requirements List */}
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C]">
              4. Requirements & Qualifications
            </h2>
            <button
              type="button"
              onClick={() => handleAddListItem('requirements')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:text-[#C74E23]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleListChange('requirements', idx, e.target.value)}
                  placeholder="e.g. 1+ years production experience with Dart and Flutter"
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveListItem('requirements', idx)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Preferred Skills */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C] mb-2">
            5. Preferred Skills & Technologies
          </h2>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            placeholder="e.g. Flutter, Dart, REST APIs, Git, POS Hardware, State Management"
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Enter skills separated by commas
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            {isEditing && (
              <button
                type="button"
                disabled={submitting || isDeleting}
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Job</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C74E23] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      {showDeleteModal && (
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
              You are about to permanently delete <strong className="text-slate-900">"{formData.title || 'this position'}"</strong>. This will remove the posting from the database and the public Careers page. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteJob}
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

export default AdminJobFormPage;
