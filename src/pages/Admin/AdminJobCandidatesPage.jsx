import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Search,
  FileText,
  Download,
  Mail,
  Phone,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Send,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { NextRoundEmailModal } from '../../components/admin/NextRoundEmailModal';
import { OfferLetterModal } from '../../components/admin/OfferLetterModal';

export const AdminJobCandidatesPage = () => {
  const { jobId } = useParams();
  const { getAuthHeaders } = useAdminAuth();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // States for Next Round Email Modal and Offer Letter Modal
  const [activeNextRoundCandidate, setActiveNextRoundCandidate] = useState(null);
  const [activeOfferLetterCandidate, setActiveOfferLetterCandidate] = useState(null);
  const [sendingAckId, setSendingAckId] = useState(null);

  const handleSendAcknowledgment = async (candidate) => {
    setSendingAckId(candidate.id);
    try {
      const res = await fetch(`/api/admin/applications/${candidate.id}/send-acknowledgment`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(
          `Acknowledgment email dispatched to ${candidate.candidateEmail}!\n\nCandidate has been notified: "Thanks for applying for ${candidate.jobTitle}. We are currently reviewing your application and will get back to you when you are selected for the next round."`
        );
      } else {
        alert(data.message || 'Failed to dispatch acknowledgment email.');
      }
    } catch (err) {
      alert('Network error while dispatching acknowledgment email: ' + err.message);
    } finally {
      setSendingAckId(null);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/applications`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJob(data.job);
        setApplications(data.applications || []);
      } else {
        setError(data.message || 'Failed to load candidate applications.');
      }
    } catch {
      setError('Unable to reach backend server. Please verify network or API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchCandidates();
    }
  }, [jobId]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadResume = async (app) => {
    setDownloadingId(app.id);
    try {
      // 1. If base64 data URI is stored directly, trigger immediate local download
      if (app.resumeData && app.resumeData.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = app.resumeData;
        link.download = app.resumeName || `resume-${app.candidateName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 2. Otherwise download from secure backend endpoint
      const res = await fetch(`/api/admin/applications/${app.id}/resume`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Failed to download resume file from server');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = app.resumeName || `resume-${app.candidateName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download resume: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (app.candidateName && app.candidateName.toLowerCase().includes(term)) ||
      (app.candidateEmail && app.candidateEmail.toLowerCase().includes(term)) ||
      (app.candidatePhone && app.candidatePhone.toLowerCase().includes(term)) ||
      (app.experience && app.experience.toLowerCase().includes(term)) ||
      (app.coverNote && app.coverNote.toLowerCase().includes(term)) ||
      (app.resumeName && app.resumeName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jobs Management</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchCandidates}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Refresh candidate list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {job && job.status === 'published' && (
            <a
              href={`/careers/${job.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#EA580C] hover:bg-orange-100 transition-colors shadow-xs"
              title="Open public job posting"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Post</span>
            </a>
          )}
        </div>
      </div>

      {/* Job Details Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        {loading && !job ? (
          <div className="py-8 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#EA580C]" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading Job Details...</p>
          </div>
        ) : job ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {job.department}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {job.location}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {job.jobType}
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    job.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : job.status === 'draft'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {job.status === 'published' ? 'Active' : job.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                <span>
                  Experience Required: <strong className="text-slate-700">{job.experience}</strong>
                </span>
                <span>•</span>
                <span>
                  Created by: <strong className="text-slate-700">{job.createdBy || 'CEO'}</strong>
                </span>
                {job.updatedBy && job.updatedBy !== job.createdBy && (
                  <>
                    <span>•</span>
                    <span>
                      Edited by: <strong className="text-slate-700">{job.updatedBy}</strong>
                    </span>
                  </>
                )}
                <span>•</span>
                <span>
                  Status Changed:{' '}
                  <strong className="text-slate-700">
                    {new Date(job.statusChangedAt || job.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
              </div>
            </div>

            {/* Application Count Pill */}
            <div className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-200/80 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-blue-900 block leading-tight">
                  {applications.length}
                </span>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Total Candidates Applied
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-slate-500 text-sm">Job details not available.</div>
        )}
      </div>

      {/* Search Bar & Applicant Counter */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, email, phone, experience..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing {filteredApplications.length} of {applications.length} applied candidates
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchCandidates}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Candidate Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#EA580C]" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Candidates...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {searchTerm ? 'No candidates match your search' : 'No Candidates Applied Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto mb-5 leading-relaxed">
              {searchTerm
                ? 'Try searching with different keywords like candidate name or email.'
                : 'When candidates submit an application for this position from the public Careers page, their details and resume attachment will appear here.'}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-bold text-[#EA580C] hover:underline"
              >
                Clear Search Filter
              </button>
            ) : (
              job && (
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/admin/jobs"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Back to Jobs List
                  </Link>
                  {job.status === 'published' && (
                    <a
                      href={`/careers/${job.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      View Public Application Page
                    </a>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3.5 px-5">Candidate Name</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Resume Attachment</th>
                  <th className="py-3.5 px-5 text-right">Candidate Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const isDownloading = downloadingId === app.id;
                  const appliedDate = new Date(app.createdAt);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate Name & Summary */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {app.candidateName}
                          </span>
                          {(app.isViewed === 0 || app.isViewed === false) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              <span>New</span>
                            </span>
                          )}
                        </div>
                        {app.coverNote && (
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs italic">
                            "{app.coverNote}"
                          </p>
                        )}
                      </td>

                      {/* Contact Details (Email & Phone) */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${app.candidateEmail}`}
                              className="text-slate-700 hover:text-[#EA580C] font-medium text-xs hover:underline truncate max-w-[180px] block"
                              title="Send email"
                            >
                              {app.candidateEmail}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(app.candidateEmail, `email-${app.id}`)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                              title="Copy email"
                            >
                              {copiedField === `email-${app.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`tel:${app.candidatePhone}`}
                              className="text-slate-600 hover:text-slate-900 text-xs"
                              title="Call candidate"
                            >
                              {app.candidatePhone}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(app.candidatePhone, `phone-${app.id}`)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                              title="Copy phone"
                            >
                              {copiedField === `phone-${app.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                          {app.experience || 'Not specified'}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {appliedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {appliedDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Resume Attachment Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isDownloading}
                            onClick={() => handleDownloadResume(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] hover:text-[#C74E23] border border-orange-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs group disabled:opacity-50"
                            title={`Download ${app.resumeName || 'Resume attachment'}`}
                          >
                            {isDownloading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                            )}
                            <span className="truncate max-w-[140px] block">
                              {app.resumeName || 'Download Resume'}
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Action buttons with Next Round, Offer Letter, and View Details */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Next Round Email Action */}
                          <button
                            type="button"
                            onClick={() => setActiveNextRoundCandidate(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                            title="Send Next Round / Technical Assessment Email"
                          >
                            <Send className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Next Round</span>
                          </button>

                          {/* Offer Letter Action */}
                          <button
                            type="button"
                            onClick={() => setActiveOfferLetterCandidate(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                            title="Generate Offer Letter with manual salary & position"
                          >
                            <Award className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span>Offer Letter</span>
                          </button>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(app)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            title="View candidate details"
                          >
                            Details
                          </button>
                        </div>
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
      {/* CANDIDATE DETAILS MODAL                                  */}
      {/* ======================================================== */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-black text-sm">
                  {selectedCandidate.candidateName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedCandidate.candidateName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Applied for {job?.title || 'Job Opening'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Quick Action Bar for Next Round & Offer Letter */}
              <div className="p-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2.5 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  Actions for {selectedCandidate.candidateName.split(' ')[0]}:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={sendingAckId === selectedCandidate.id}
                    onClick={() => handleSendAcknowledgment(selectedCandidate)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                    title="Send 'Thanks for applying - Application Under Review' email"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      {sendingAckId === selectedCandidate.id
                        ? 'Dispatching...'
                        : 'Send Review Status Email'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveNextRoundCandidate(selectedCandidate);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Next Round</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveOfferLetterCandidate(selectedCandidate);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Offer Letter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedCandidate.candidateEmail}`}
                    className="font-semibold text-slate-800 hover:text-[#EA580C] truncate block"
                  >
                    {selectedCandidate.candidateEmail}
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${selectedCandidate.candidatePhone}`}
                    className="font-semibold text-slate-800 hover:text-[#EA580C] block"
                  >
                    {selectedCandidate.candidatePhone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Experience
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedCandidate.experience || 'Not specified'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Submission Time
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedCandidate.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Cover Note / Applicant Summary
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedCandidate.coverNote || 'No cover note provided by applicant.'}
                </p>
              </div>

              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#EA580C]" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedCandidate.resumeName || 'Resume Document'}
                    </span>
                    <span className="text-[10px] text-slate-500">Attachment Ready</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadResume(selectedCandidate)}
                  className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. NEXT ROUND SELECTION & ASSESSMENT EMAIL MODAL         */}
      {/* ======================================================== */}
      <NextRoundEmailModal
        isOpen={!!activeNextRoundCandidate}
        onClose={() => setActiveNextRoundCandidate(null)}
        candidate={activeNextRoundCandidate}
        job={job}
      />

      {/* ======================================================== */}
      {/* 2. OFFER LETTER GENERATOR & PDF DOWNLOADER MODAL         */}
      {/* ======================================================== */}
      <OfferLetterModal
        isOpen={!!activeOfferLetterCandidate}
        onClose={() => setActiveOfferLetterCandidate(null)}
        candidate={activeOfferLetterCandidate}
        job={job}
      />
    </div>
  );
};

export default AdminJobCandidatesPage;
