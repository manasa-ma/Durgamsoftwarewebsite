import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Copy,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck2,
  MessageSquare,
} from 'lucide-react';
import { COMPANY_NAME } from '../../utils/constants';

const ROUND_PRESETS = [
  {
    id: 'technical-assessment',
    name: 'Technical Assessment & Coding Task',
    icon: Code2,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    defaultSubject: (jobTitle) =>
      `Invitation to Next Round: Technical Assessment for ${jobTitle} - Durgam Soft Pvt. Ltd.`,
    defaultInstructions: (jobTitle, replyEmail, deadline) =>
      `Dear Candidate,

Thank you for your application for the position of ${jobTitle} at Durgam Soft Pvt. Ltd. We have reviewed your credentials and are pleased to invite you to the Next Round: Technical Assessment.

Assessment Overview & Instructions:
1. Scope: Implement a clean, well-structured module demonstrating best practices, modular code architecture, and proper error handling.
2. Deliverable: Please create a GitHub repository or prepare a zip archive of your source code along with a brief README explaining your approach and setup instructions.
3. Submission Deadline: ${deadline}

SUBMISSION / REPLY INSTRUCTIONS:
Please reply directly to this email (${replyEmail}) with your completed solution link or attachment before the deadline stated above.

Our technical evaluation team will review your submission and reach out regarding subsequent steps. If you have any technical questions or need clarification regarding the prompt, simply reply to this email.

Best regards,
Hiring & Technical Evaluation Team
Durgam Soft Pvt. Ltd.
Email: ${replyEmail} | Web: https://www.durgamsoft.com`,
  },
  {
    id: 'technical-interview',
    name: 'Round 2: Technical Interview (Live Discussion)',
    icon: Calendar,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    defaultSubject: (jobTitle) =>
      `Shortlisted for Round 2: Technical Interview for ${jobTitle} - Durgam Soft Pvt. Ltd.`,
    defaultInstructions: (jobTitle, replyEmail, deadline) =>
      `Dear Candidate,

Congratulations! We were impressed with your profile for the ${jobTitle} opening at Durgam Soft Pvt. Ltd. We would like to invite you to Round 2: Technical Interview.

Interview Details:
- Duration: 45 - 60 minutes
- Format: Google Meet / Online Video Conference
- Proposed Timing: ${deadline}
- Focus Areas: Technical problem solving, system design, modern architecture, and review of your past project experiences.

REPLY / CONFIRMATION REQUIRED:
Please reply to this email (${replyEmail}) confirming your availability for the proposed time slot or suggest two alternative windows that work best for your schedule.

Upon receiving your confirmation, our HR coordinator will send across the calendar invitation and meeting link.

Best regards,
Technical Recruitment Team
Durgam Soft Pvt. Ltd.
Email: ${replyEmail} | Web: https://www.durgamsoft.com`,
  },
  {
    id: 'managerial-round',
    name: 'Round 3: System Design & Leadership Round',
    icon: Sparkles,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultSubject: (jobTitle) =>
      `Shortlisted for Round 3: Leadership & Architecture Discussion - ${jobTitle} at Durgam Soft`,
    defaultInstructions: (jobTitle, replyEmail, deadline) =>
      `Dear Candidate,

We are happy to inform you that you have cleared the initial technical rounds for the ${jobTitle} opening at Durgam Soft Pvt. Ltd.

We are pleased to invite you to the next round: Leadership & Architecture Discussion with our senior engineering leadership.

Details:
- Schedule: ${deadline}
- Agenda: Scalable system architecture, product engineering mindset, and team leadership.

Please reply to this email (${replyEmail}) to confirm this time slot or propose an alternative time.

Warm regards,
Leadership Hiring Team
Durgam Soft Pvt. Ltd.
Email: ${replyEmail} | Web: https://www.durgamsoft.com`,
  },
  {
    id: 'final-hr',
    name: 'Final Round: Culture & HR Discussion',
    icon: FileCheck2,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultSubject: (jobTitle) =>
      `Invitation to Final HR Discussion: ${jobTitle} - Durgam Soft Pvt. Ltd.`,
    defaultInstructions: (jobTitle, replyEmail, deadline) =>
      `Dear Candidate,

We appreciate your engagement throughout our interview process for the ${jobTitle} position. We are pleased to invite you to the Final HR & Culture Discussion.

Details:
- Schedule: ${deadline}
- Duration: 30 minutes
- Focus: Career aspirations, compensation expectations, joining timelines, and company culture.

Please reply to this email (${replyEmail}) confirming your availability.

Warm regards,
Human Resources Team
Durgam Soft Pvt. Ltd.
Email: ${replyEmail} | Web: https://www.durgamsoft.com`,
  },
];

export const NextRoundEmailModal = ({ isOpen, onClose, candidate, job }) => {
  if (!isOpen || !candidate) return null;

  const jobTitle = job?.title || candidate.jobTitle || 'Role';
  const [selectedPresetId, setSelectedPresetId] = useState('technical-assessment');
  const [replyToEmail, setReplyToEmail] = useState('careers@durgamsoft.com');
  const [deadline, setDeadline] = useState('Within 48 hours (Sunday, 6:00 PM IST)');
  const [meetingLink, setMeetingLink] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync default subject and body whenever candidate, job, or selected preset changes
  useEffect(() => {
    const preset = ROUND_PRESETS.find((p) => p.id === selectedPresetId) || ROUND_PRESETS[0];
    const initialSubj = preset.defaultSubject(jobTitle);
    const initialBody = preset.defaultInstructions(jobTitle, replyToEmail, deadline);
    setCustomSubject(initialSubj);
    setCustomBody(initialBody);
  }, [selectedPresetId, jobTitle]);

  // Update body if deadline or reply-to email changes
  const handlePresetSelect = (presetId) => {
    setSelectedPresetId(presetId);
    const preset = ROUND_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCustomSubject(preset.defaultSubject(jobTitle));
      let bodyText = preset.defaultInstructions(jobTitle, replyToEmail, deadline);
      if (meetingLink.trim()) {
        bodyText += `\n\nMeeting / Assessment Link: ${meetingLink.trim()}`;
      }
      setCustomBody(bodyText);
    }
  };

  const handleDeadlineChange = (val) => {
    setDeadline(val);
    const preset = ROUND_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      setCustomBody(preset.defaultInstructions(jobTitle, replyToEmail, val));
    }
  };

  const handleReplyEmailChange = (val) => {
    setReplyToEmail(val);
    const preset = ROUND_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      setCustomBody(preset.defaultInstructions(jobTitle, val, deadline));
    }
  };

  // Gmail Web Compose URL
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    candidate.candidateEmail
  )}&su=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;

  // Mailto URL
  const mailtoUrl = `mailto:${candidate.candidateEmail}?subject=${encodeURIComponent(
    customSubject
  )}&body=${encodeURIComponent(customBody)}`;

  const handleCopyEmail = () => {
    const textToCopy = `To: ${candidate.candidateEmail}\nReply-To: ${replyToEmail}\nSubject: ${customSubject}\n\n${customBody}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Send Next Round / Assessment Email
                </h2>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  Candidate Selection
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Invite <strong className="text-white font-bold">{candidate.candidateName}</strong> (
                {candidate.candidateEmail}) to the next evaluation round with reply instructions.
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

        {/* Modal Body: Two-Column Layout */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 flex-1">
          {/* Left Column: Round Options & Configurations (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:pr-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                1. Select Evaluation Round
              </label>
              <div className="space-y-2">
                {ROUND_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 truncate">{preset.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#EA580C]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Candidate Email (Recipient)
                </label>
                <input
                  type="text"
                  readOnly
                  value={candidate.candidateEmail}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Reply-To Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={replyToEmail}
                    onChange={(e) => handleReplyEmailChange(e.target.value)}
                    placeholder="careers@durgamsoft.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Candidate will reply directly to this email with their test submission.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Submission Deadline / Interview Slot
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => handleDeadlineChange(e.target.value)}
                    placeholder="e.g. Within 48 hours / Sunday, 6:00 PM IST"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#EA580C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Meeting Link / Platform URL (Optional)
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-abc-def"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#EA580C] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Email Editor & Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3 lg:pl-6 pt-4 lg:pt-0">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                2. Review & Edit Email Message
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Editable content</span>
            </div>

            {/* Subject Line */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subject Line
              </span>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#EA580C] focus:bg-white"
              />
            </div>

            {/* Email Body */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Message Body (Candidate will receive this)
              </span>
              <textarea
                rows={12}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full p-3.5 text-xs font-mono sm:text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-[#EA580C] focus:bg-white resize-y"
              />
            </div>

            {/* Reply Info Box */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Candidate Instructions Included:</strong> The email clearly instructs the
                candidate to submit their response by directly replying to{' '}
                <strong className="underline">{replyToEmail}</strong> before the designated
                deadline.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Email Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Email Content</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {/* Mailto Default Mail Client */}
            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors shadow-xs"
              title="Open default email client (Outlook, Apple Mail, etc.)"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via Mail Client</span>
            </a>

            {/* Gmail Web Compose */}
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs font-black transition-colors shadow-sm"
              title="Compose directly in Gmail"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Send via Gmail</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextRoundEmailModal;
