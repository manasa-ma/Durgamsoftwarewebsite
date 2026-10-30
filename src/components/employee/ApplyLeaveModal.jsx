import React, { useState, useRef } from 'react';
import { X, Calendar, Send, CheckCircle2, AlertCircle, Paperclip, Trash2 } from 'lucide-react';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';

export const ApplyLeaveModal = ({ onClose, onSuccess }) => {
  const { leaveBalances, applyLeave } = useEmployeeAuth();

  const [leaveType, setLeaveType] = useState('Paid Leave');
  const [fromDate, setFromDate] = useState('2026-11-05');
  const [toDate, setToDate] = useState('2026-11-06');
  const [reason, setReason] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Attachment size exceeds 5MB limit.');
      return;
    }

    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Calculate days difference
  const calculateDays = () => {
    try {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const daysCount = calculateDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('Please provide a specific reason for your leave request.');
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setError('End date cannot precede the start date.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      applyLeave({
        leaveType,
        fromDate,
        toDate,
        daysCount,
        reason: reason.trim(),
        attachmentUrl,
        attachmentName,
      });
      setIsSubmitting(false);
      setSuccessMessage('Leave application submitted successfully! It has been forwarded to the CEO section for review.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#F97316]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">Apply for Leave</h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Submit a new leave request for manager review
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close leave modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Leave Type */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Leave Category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium cursor-pointer"
                >
                  <option value="Paid Leave">
                    Paid Leave (1 per month) — {leaveBalances.paid?.available ?? 8} days left
                  </option>
                  <option value="Unpaid Leave / LOP">Leave Without Pay (LOP)</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Days Count pill */}
              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200/60 text-xs flex items-center justify-between text-orange-900">
                <span className="font-medium">Total Duration Requested:</span>
                <span className="font-extrabold px-2 py-0.5 rounded-md bg-[#C74E23] text-white">
                  {daysCount} {daysCount === 1 ? 'Working Day' : 'Working Days'}
                </span>
              </div>

              {/* Reason */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for your time-off request (e.g. personal errands, medical appointment)..."
                  required
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium resize-none"
                />
              </div>

              {/* Optional Document Attachment */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-[#C74E23]" />
                    <span>Attach Document / Medical Slip (Optional)</span>
                  </label>
                  {attachmentName && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentUrl(null);
                        setAttachmentName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[11px] text-red-600 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachment}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                {!attachmentName ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/70 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span>Click to attach certificate or supporting document</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                    <span className="truncate max-w-[280px]">Attached: {attachmentName}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold">Ready</span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
