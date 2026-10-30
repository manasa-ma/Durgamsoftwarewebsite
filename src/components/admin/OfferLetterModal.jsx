import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Mail,
  Send,
  Printer,
  Copy,
  Check,
  X,
  ExternalLink,
  Building2,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Clock,
  Award,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { COMPANY_NAME } from '../../utils/constants';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';

export const OfferLetterModal = ({ isOpen, onClose, candidate, job }) => {
  if (!isOpen || !candidate) return null;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate default joining date (15 days from now)
  const defaultJoining = new Date();
  defaultJoining.setDate(defaultJoining.getDate() + 15);
  const defaultJoiningFormatted = defaultJoining.toISOString().split('T')[0];

  // Calculate default acceptance deadline (5 days from now)
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 5);
  const defaultDeadlineFormatted = defaultDeadline.toISOString().split('T')[0];

  // Generate a clean reference number
  const initialRefNo = `DS/${new Date().getFullYear()}/OFFER-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // Form states - all manually editable as requested
  const [candidateName, setCandidateName] = useState(candidate.candidateName || '');
  const [candidateEmail, setCandidateEmail] = useState(candidate.candidateEmail || '');
  const [candidatePhone, setCandidatePhone] = useState(candidate.candidatePhone || '');
  const [candidateAddress, setCandidateAddress] = useState('Hyderabad, Telangana, India');
  const [position, setPosition] = useState(job?.title || candidate.jobTitle || 'Software Engineer');
  const [department, setDepartment] = useState(job?.department || 'Engineering');
  const [salary, setSalary] = useState('₹7,50,000 per annum (CTC)');
  const [salaryBreakdown, setSalaryBreakdown] = useState(
    'Fixed Component: ₹6,75,000 | Annual Performance Bonus: ₹75,000'
  );
  const [joiningDate, setJoiningDate] = useState(defaultJoiningFormatted);
  const [workLocation, setWorkLocation] = useState('Hyderabad, Telangana, India (In-Office / Hybrid)');
  const [employmentType, setEmploymentType] = useState('Full-Time, Permanent');
  const [probationPeriod, setProbationPeriod] = useState('3 Months');
  const [reportingManager, setReportingManager] = useState('Durgam Venu Gopal (Founder & CEO)');
  const [acceptanceDeadline, setAcceptanceDeadline] = useState(defaultDeadlineFormatted);
  const [refNumber, setRefNumber] = useState(initialRefNo);
  const [issueDate, setIssueDate] = useState(todayFormatted);

  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'preview'
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Sync if candidate changes
  useEffect(() => {
    if (candidate) {
      setCandidateName(candidate.candidateName || '');
      setCandidateEmail(candidate.candidateEmail || '');
      setCandidatePhone(candidate.candidatePhone || '');
    }
    if (job) {
      setPosition(job.title || 'Software Engineer');
      setDepartment(job.department || 'Engineering');
    }
  }, [candidate, job]);

  // Quick salary presets
  const salaryPresets = [
    '₹4,50,000 per annum (CTC)',
    '₹6,00,000 per annum (CTC)',
    '₹7,50,000 per annum (CTC)',
    '₹9,50,000 per annum (CTC)',
    '₹12,00,000 per annum (CTC)',
    '₹15,00,000 per annum (CTC)',
  ];

  // Compose offer email text
  const emailSubject = `Job Offer: ${position} at Durgam Soft Pvt. Ltd.`;
  const emailBody = `Dear ${candidateName},

Congratulations! On behalf of Durgam Soft Pvt. Ltd., we are thrilled to formally offer you the position of ${position} in our ${department} department.

We were thoroughly impressed by your technical qualifications, problem-solving skills, and professional accomplishments. We are confident you will make a substantial contribution to our engineering organization.

Offer Summary:
- Position: ${position}
- Department: ${department}
- Annual Compensation (CTC): ${salary}
- Proposed Date of Joining: ${joiningDate}
- Employment Type: ${employmentType}
- Work Location: ${workLocation}
- Probation Period: ${probationPeriod}
- Reporting Authority: ${reportingManager}
- Offer Acceptance Deadline: ${acceptanceDeadline}

Attached with this email is your official Offer Letter document. To confirm your acceptance, please sign the acceptance endorsement section and reply to this email (careers@durgamsoft.com) on or before ${acceptanceDeadline}.

If you have any questions regarding the offer, please feel free to reach out directly to us.

We look forward to welcoming you aboard our team!

Warm regards,
Durgam Venu Gopal
Founder & Chief Executive Officer
Durgam Soft Pvt. Ltd.
Hyderabad, Telangana, India
careers@durgamsoft.com | https://www.durgamsoft.com`;

  // Gmail Web Compose Link
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    candidateEmail
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Default Mail Client Mailto Link
  const mailtoUrl = `mailto:${candidateEmail}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyEmailText = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Generate printable/downloadable HTML and invoke print-to-pdf
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);

    const printHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offer Letter - ${candidateName} - ${position} - Durgam Soft</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-size: 13px;
      background: #ffffff;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      padding-bottom: 12px;
      border-bottom: 3px solid #0B1F3A;
      margin-bottom: 16px;
    }
    .company-title {
      font-size: 22px;
      font-weight: 900;
      color: #0B1F3A;
      letter-spacing: -0.5px;
      margin: 0;
      text-transform: uppercase;
    }
    .company-tagline {
      font-size: 10px;
      font-weight: 700;
      color: #EA580C;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .company-info {
      text-align: right;
      font-size: 10px;
      color: #64748b;
      line-height: 1.4;
    }
    .brand-bar {
      height: 4px;
      background: linear-gradient(90deg, #0B1F3A 0%, #EA580C 100%);
      margin-top: 4px;
      margin-bottom: 16px;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 14px;
      font-size: 11px;
    }
    .candidate-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .offer-title {
      font-size: 15px;
      font-weight: 900;
      color: #0B1F3A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: center;
      padding: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      margin: 14px 0;
    }
    .terms-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 12px;
    }
    .terms-table th, .terms-table td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    .terms-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
      width: 32%;
    }
    .terms-table td {
      color: #0f172a;
      font-weight: 500;
    }
    .salary-highlight {
      font-size: 14px;
      font-weight: 900;
      color: #EA580C;
    }
    .clause-section {
      margin-top: 12px;
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }
    .clause-section ol {
      margin: 4px 0;
      padding-left: 18px;
    }
    .clause-section li {
      margin-bottom: 4px;
    }
    .sign-table {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
    }
    .sign-col {
      width: 50%;
      vertical-align: top;
      padding-right: 15px;
    }
    .sign-line {
      border-top: 1px solid #64748b;
      margin-top: 40px;
      padding-top: 6px;
      font-size: 11px;
    }
    .seal-badge {
      display: inline-block;
      padding: 4px 8px;
      border: 1.5px dashed #0B1F3A;
      border-radius: 4px;
      color: #0B1F3A;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .footer-note {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <table class="header-table">
    <tr>
      <td style="vertical-align: middle;">
        <h1 class="company-title">DURGAM SOFT PVT. LTD.</h1>
        <div class="company-tagline">Innovate • Develop • Deliver</div>
      </td>
      <td class="company-info" style="vertical-align: middle;">
        <strong>Durgam Soft Technologies Private Limited</strong><br>
        Hitech City, Hyderabad - 500081, Telangana, India<br>
        Email: careers@durgamsoft.com | Web: www.durgamsoft.com
      </td>
    </tr>
  </table>

  <!-- Meta Information -->
  <table class="meta-table">
    <tr>
      <td><strong>Ref No:</strong> ${refNumber}</td>
      <td style="text-align: right;"><strong>Date of Issue:</strong> ${issueDate}</td>
    </tr>
  </table>

  <!-- Candidate Information Box -->
  <div class="candidate-box">
    <strong>To:</strong><br>
    <strong style="font-size: 13px; color: #0B1F3A;">${candidateName}</strong><br>
    Email: ${candidateEmail} | Phone: ${candidatePhone}<br>
    Address: ${candidateAddress}
  </div>

  <!-- Subject Title -->
  <div class="offer-title">
    OFFER OF EMPLOYMENT: ${position.toUpperCase()}
  </div>

  <p>Dear <strong>${candidateName}</strong>,</p>

  <p style="margin-bottom: 8px;">
    On behalf of <strong>Durgam Soft Pvt. Ltd.</strong>, we are pleased to offer you the position of 
    <strong>${position}</strong> in our <strong>${department}</strong> division. Following your technical 
    evaluations and interview interactions, our leadership team was deeply impressed with your capabilities, 
    problem-solving acumen, and professional qualifications.
  </p>

  <p style="margin-bottom: 12px;">
    The terms and conditions governing your employment offer are summarized below:
  </p>

  <!-- Terms Table -->
  <table class="terms-table">
    <tr>
      <th>Position / Designation</th>
      <td><strong>${position}</strong></td>
    </tr>
    <tr>
      <th>Department</th>
      <td>${department}</td>
    </tr>
    <tr>
      <th>Total Compensation (CTC)</th>
      <td>
        <span class="salary-highlight">${salary}</span>
        ${salaryBreakdown ? `<br><span style="font-size: 10px; color: #64748b;">(${salaryBreakdown})</span>` : ''}
      </td>
    </tr>
    <tr>
      <th>Date of Joining</th>
      <td><strong>${joiningDate}</strong></td>
    </tr>
    <tr>
      <th>Employment Status</th>
      <td>${employmentType}</td>
    </tr>
    <tr>
      <th>Work Location</th>
      <td>${workLocation}</td>
    </tr>
    <tr>
      <th>Probation Period</th>
      <td>${probationPeriod}</td>
    </tr>
    <tr>
      <th>Reporting Authority</th>
      <td>${reportingManager}</td>
    </tr>
    <tr>
      <th>Offer Acceptance Deadline</th>
      <td><strong>${acceptanceDeadline}</strong></td>
    </tr>
  </table>

  <!-- Key Employment Clauses -->
  <div class="clause-section">
    <strong>Standard Employment Terms & Conditions:</strong>
    <ol>
      <li><strong>Duties & Responsibilities:</strong> You shall perform all professional duties aligned with the ${position} role and adhere to engineering standards established by Durgam Soft Pvt. Ltd.</li>
      <li><strong>Confidentiality & Non-Disclosure:</strong> You agree to preserve total confidentiality regarding company intellectual property, software architecture, client databases, and trade secrets during and after employment.</li>
      <li><strong>Notice Period:</strong> During probation, either party may terminate employment by providing 15 days written notice. Post confirmation, the mandatory notice period shall be 30 days.</li>
      <li><strong>Document Verification:</strong> This offer is conditional upon satisfactory verification of your professional references, educational records, and identity proofs.</li>
    </ol>
  </div>

  <!-- Signatures -->
  <table class="sign-table">
    <tr>
      <!-- Company Signatory -->
      <td class="sign-col">
        <div style="font-weight: 700; color: #0B1F3A; margin-bottom: 4px;">Authorized Signatory</div>
        <div style="font-size: 11px; color: #64748b;">For Durgam Soft Pvt. Ltd.</div>
        <div class="sign-line">
          <strong>Durgam Venu Gopal</strong><br>
          Founder & Chief Executive Officer<br>
          <div class="seal-badge">Durgam Soft Pvt. Ltd. • Corporate Seal</div>
        </div>
      </td>

      <!-- Candidate Acceptance -->
      <td class="sign-col" style="padding-left: 15px; padding-right: 0;">
        <div style="font-weight: 700; color: #0B1F3A; margin-bottom: 4px;">Acceptance of Offer</div>
        <div style="font-size: 11px; color: #64748b;">Candidate Endorsement</div>
        <div class="sign-line">
          Candidate Signature: _______________________<br>
          Name: <strong>${candidateName}</strong><br>
          Date: _____ / _____ / _________
        </div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div class="footer-note">
    Registered Office: Durgam Soft Pvt. Ltd., Hitech City, Hyderabad, Telangana, India • Confidential & Proprietary Document
  </div>

</body>
</html>
    `;

    // Open an isolated print window and invoke print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        setIsGeneratingPdf(false);
      }, 350);
    } else {
      // Fallback: download as an HTML document directly
      const blob = new Blob([printHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Offer_Letter_${candidateName.replace(/\s+/g, '_')}_${position.replace(
        /\s+/g,
        '_'
      )}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0B1F3A] to-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Generate & Send Official Offer Letter
                </h2>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-orange-500/30 text-orange-200 border border-orange-400/20">
                  Durgam Soft Letterhead
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Type position, salary & details manually. Updates the offer letter in real time with
                instant PDF download and email dispatch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle Tabs (For mobile & quick switching) */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Edit Offer Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-[#EA580C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Live Letterhead Preview
            </button>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {salary ? salary : 'No salary entered'}
          </span>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* ======================================================== */}
          {/* LEFT: FORM INPUTS (Manual Salary, Position, etc.)        */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-6 space-y-4 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Candidate & Position Information
              </span>
              <span className="text-[10px] font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-md">
                Type directly in fields below
              </span>
            </div>

            {/* Candidate Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Candidate Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Selected Position / Designation *
                </label>
                <div className="relative">
                  <Sparkles className="w-3.5 h-3.5 text-[#EA580C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/40 border border-orange-200 rounded-xl font-black text-[#EA580C] focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Salary / CTC Input (Critical requirement) */}
            <div className="p-3.5 bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-2xl border border-orange-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#EA580C]" />
                  <span>Salary / Compensation (CTC) *</span>
                </label>
                <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-wider">
                  Type Manually
                </span>
              </div>

              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹8,50,000 per annum (CTC)"
                className="w-full px-3.5 py-2.5 text-sm font-black bg-white border border-orange-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 shadow-2xs"
              />

              {/* Quick Salary Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-bold text-slate-500 mr-1">Quick Select:</span>
                {salaryPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSalary(preset)}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-white border border-orange-200 hover:bg-orange-100/70 text-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Compensation Breakdown / Note (Optional)
                </label>
                <input
                  type="text"
                  value={salaryBreakdown}
                  onChange={(e) => setSalaryBreakdown(e.target.value)}
                  placeholder="Fixed: ₹7,00,000 | Performance Bonus: ₹1,50,000"
                  className="w-full px-3 py-1.5 text-xs bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            {/* Department & Employment Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering / Product"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Employment Status
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white cursor-pointer"
                >
                  <option value="Full-Time, Permanent">Full-Time, Permanent</option>
                  <option value="Probationary Employment">Probationary Employment</option>
                  <option value="Contractual (1 Year)">Contractual (1 Year)</option>
                  <option value="Associate / Trainee">Associate / Trainee</option>
                </select>
              </div>
            </div>

            {/* Joining Date & Acceptance Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Date of Joining (DOJ)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Acceptance Deadline
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={acceptanceDeadline}
                    onChange={(e) => setAcceptanceDeadline(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Location & Reporting Manager */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Work Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    placeholder="Hyderabad, India"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Reporting Authority
                </label>
                <input
                  type="text"
                  value={reportingManager}
                  onChange={(e) => setReportingManager(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                />
              </div>
            </div>

            {/* Ref Number & Probation Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Offer Reference Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Probation Period
                </label>
                <select
                  value={probationPeriod}
                  onChange={(e) => setProbationPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white"
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="Nil (Direct Confirmation)">Nil (Direct Confirmation)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: LIVE LETTERHEAD PREVIEW                           */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-6 space-y-3 ${
              activeTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                2. Live Official Letterhead Preview
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ready for PDF & Email
              </span>
            </div>

            {/* Paper Document Container */}
            <div className="p-6 sm:p-7 bg-white rounded-2xl border-2 border-slate-200/90 shadow-lg font-sans text-slate-800 space-y-4 max-h-[520px] overflow-y-auto text-xs leading-relaxed">
              {/* Letterhead Header */}
              <div className="flex items-start justify-between border-b-2 border-[#0B1F3A] pb-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={durgamSoftLogo}
                    alt={COMPANY_NAME}
                    className="w-10 h-10 object-contain shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-black text-[#0B1F3A] uppercase tracking-tight">
                      Durgam Soft Pvt. Ltd.
                    </h3>
                    <span className="text-[9px] font-extrabold text-[#EA580C] tracking-widest uppercase block">
                      Innovate • Develop • Deliver
                    </span>
                  </div>
                </div>

                <div className="text-right text-[9px] text-slate-500 leading-tight">
                  <div className="font-bold text-slate-700">Corporate Headquarters</div>
                  <div>Hitech City, Hyderabad, India</div>
                  <div>careers@durgamsoft.com</div>
                </div>
              </div>

              {/* Ref & Date */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                <span>
                  Ref: <strong className="text-slate-700">{refNumber}</strong>
                </span>
                <span>
                  Date: <strong className="text-slate-700">{issueDate}</strong>
                </span>
              </div>

              {/* Recipient Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  To:
                </span>
                <div className="font-black text-slate-900 text-sm">{candidateName}</div>
                <div className="text-slate-600 text-[11px]">
                  {candidateEmail} • {candidatePhone}
                </div>
                <div className="text-slate-500 text-[11px]">{candidateAddress}</div>
              </div>

              {/* Offer Letter Title */}
              <div className="text-center py-2 px-3 bg-blue-50/80 border border-blue-200 text-[#0B1F3A] rounded-xl font-black uppercase tracking-wide text-xs">
                CONFIDENTIAL: OFFER OF EMPLOYMENT - {position.toUpperCase()}
              </div>

              {/* Salutation & Intro */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <p>
                  Dear <strong className="text-slate-900">{candidateName}</strong>,
                </p>
                <p>
                  On behalf of <strong className="text-slate-900">Durgam Soft Pvt. Ltd.</strong>, we
                  are delighted to extend this formal offer of employment for the position of{' '}
                  <strong className="text-[#EA580C]">{position}</strong> within our{' '}
                  <strong className="text-slate-900">{department}</strong> team.
                </p>
              </div>

              {/* Offer Summary Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="py-1.5 px-3 font-bold text-slate-600 w-2/5">Designation</td>
                      <td className="py-1.5 px-3 font-black text-slate-900">{position}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold text-slate-600">Department</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-800">{department}</td>
                    </tr>
                    <tr className="bg-orange-50/70">
                      <td className="py-2 px-3 font-bold text-orange-900">
                        Total Compensation (CTC)
                      </td>
                      <td className="py-2 px-3 font-black text-sm text-[#EA580C]">
                        {salary}
                        {salaryBreakdown && (
                          <span className="block text-[10px] font-normal text-slate-600">
                            {salaryBreakdown}
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold text-slate-600">Date of Joining</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900">{joiningDate}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-1.5 px-3 font-bold text-slate-600">Employment Status</td>
                      <td className="py-1.5 px-3 font-medium text-slate-800">{employmentType}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold text-slate-600">Work Location</td>
                      <td className="py-1.5 px-3 font-medium text-slate-800">{workLocation}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-1.5 px-3 font-bold text-slate-600">Probation Period</td>
                      <td className="py-1.5 px-3 font-medium text-slate-800">{probationPeriod}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold text-slate-600">Reporting Authority</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-800">{reportingManager}</td>
                    </tr>
                    <tr className="bg-amber-50/60">
                      <td className="py-1.5 px-3 font-bold text-amber-900">Acceptance Deadline</td>
                      <td className="py-1.5 px-3 font-bold text-amber-950">{acceptanceDeadline}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Standard clauses */}
              <div className="text-[10px] text-slate-500 space-y-1 pt-1">
                <div>
                  <strong>1. Confidentiality:</strong> You agree to protect all company source code,
                  proprietary architectures, and customer data.
                </div>
                <div>
                  <strong>2. Notice Period:</strong> 15 days during probation; 30 days post
                  confirmation.
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[10px]">
                <div>
                  <div className="font-bold text-slate-900">Authorized Signatory</div>
                  <div className="text-slate-500">For Durgam Soft Pvt. Ltd.</div>
                  <div className="mt-4 pt-1 border-t border-slate-300">
                    <strong className="text-slate-900">Durgam Venu Gopal</strong>
                    <div className="text-slate-500">Founder & CEO</div>
                    <span className="inline-block mt-1 text-[8px] font-black uppercase text-[#0B1F3A] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      Corporate Seal Verified
                    </span>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900">Candidate Acceptance</div>
                  <div className="text-slate-500">Endorsement</div>
                  <div className="mt-4 pt-1 border-t border-slate-300">
                    <div className="text-slate-400">Signature: __________________</div>
                    <div className="text-slate-700 font-bold">{candidateName}</div>
                    <div className="text-slate-400">Date: ____/____/_______</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Toolbar: Download PDF, Send Email, Copy */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEmailText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Offer Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Offer Email</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Download Official PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              title="Print or Save Official Offer Letter as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </button>

            {/* Send Offer Email via Gmail */}
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs font-black transition-colors shadow-sm"
              title="Compose and send offer letter via Gmail"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Send Offer via Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterModal;
