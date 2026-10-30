/**
 * Application & Inquiries Dispatch Helper for Durgam Soft
 * Ensures email opens properly on both laptop (Web Gmail / Desktop Client)
 * and mobile phones (Native Mail App / Gmail App via mailto:),
 * and dispatches messages to the company WhatsApp number in the footer (+91 83745 88099).
 */

export const COMPANY_RECRUITMENT_EMAIL = 'careers@durgamsoft.com';
export const COMPANY_GENERAL_EMAIL = 'info@durgamsoft.com';
export const COMPANY_WHATSAPP_NUMBER = '918374588099'; // Footer phone: 83745 88099 (+91 83745 88099)
export const COMPANY_PHONE_DISPLAY = '+91 83745 88099';

/**
 * Detect if visitor is on a mobile device (phone or tablet)
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return mobileRegex.test(ua) || (isTouch && isSmallScreen);
};

/**
 * Format human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Construct pre-formatted plain text email body for job application
 */
export const formatApplicationEmailBody = ({
  name,
  email,
  phone,
  position,
  experience,
  location,
  coverNote,
  resumeName,
  resumeSize,
  jobUrl,
}) => {
  const resumeInfo = resumeName
    ? `${resumeName} ${resumeSize ? `(${resumeSize})` : ''}`
    : 'Not Attached (Will attach to email)';

  return (
    `Hello Durgam Soft Recruitment Team,\n\n` +
    `A new job application has been submitted via the Durgam Soft Careers portal:\n\n` +
    `--------------------------------------------------\n` +
    `CANDIDATE DETAILS\n` +
    `--------------------------------------------------\n` +
    `Full Name:           ${name || 'Applicant'}\n` +
    `Email Address:       ${email || 'Not Provided'}\n` +
    `Phone Number:        ${phone || 'Not Provided'}\n` +
    (location ? `Current Location:    ${location}\n` : '') +
    `Position Applied:    ${position || 'Open Position'}\n` +
    `Relevant Experience: ${experience || 'Not Specified'}\n\n` +
    `--------------------------------------------------\n` +
    `RESUME ATTACHMENT\n` +
    `--------------------------------------------------\n` +
    `Uploaded Resume:     ${resumeInfo}\n\n` +
    `--------------------------------------------------\n` +
    `COVER NOTE / MESSAGE\n` +
    `--------------------------------------------------\n` +
    `${coverNote || 'Not Provided'}\n\n` +
    `--------------------------------------------------\n` +
    `Sent via: Durgam Soft Careers Portal ${jobUrl ? `(${jobUrl})` : ''}\n` +
    `Applicant Note: Please attach the selected resume file (${resumeName || 'resume'}) to this email before sending.`
  );
};

/**
 * Construct pre-formatted WhatsApp message for job application
 */
export const formatApplicationWhatsAppMessage = ({
  name,
  email,
  phone,
  position,
  experience,
  location,
  coverNote,
  resumeName,
  resumeSize,
}) => {
  const resumeInfo = resumeName
    ? `${resumeName}${resumeSize ? ` (${resumeSize})` : ''}`
    : 'Will attach via WhatsApp';

  return (
    `*NEW JOB APPLICATION - DURGAM SOFT PVT. LTD.*\n\n` +
    `*Position:* ${position || 'Open Position'}\n` +
    `*Candidate Name:* ${name || 'Applicant'}\n` +
    `*Email:* ${email || 'Not Provided'}\n` +
    `*Phone:* ${phone || 'Not Provided'}\n` +
    (location ? `*Location:* ${location}\n` : '') +
    `*Experience:* ${experience || 'Not Specified'}\n` +
    `*Resume File:* ${resumeInfo}\n` +
    (coverNote ? `\n*Message / Cover Note:*\n${coverNote}\n` : '') +
    `\n---\n_Sent via Durgam Soft Careers Portal_`
  );
};

/**
 * Generate standard mailto link
 */
export const getMailtoLink = ({ to = COMPANY_RECRUITMENT_EMAIL, subject, body }) => {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate Web Gmail Compose link
 */
export const getGmailWebLink = ({ to = COMPANY_RECRUITMENT_EMAIL, subject, body }) => {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate WhatsApp direct chat link to company number in footer
 */
export const getWhatsAppLink = (messageText, phone = COMPANY_WHATSAPP_NUMBER) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
};

/**
 * Open email client reliably across both laptop and phone mode:
 * - On Mobile: Triggers mailto: so iOS Mail, Android Gmail, or default mail app opens immediately.
 * - On Laptop: Opens Web Gmail in a new tab with fallback to mailto.
 */
export const openEmailClient = ({
  to = COMPANY_RECRUITMENT_EMAIL,
  subject,
  body,
}) => {
  const mailtoUrl = getMailtoLink({ to, subject, body });
  const gmailWebUrl = getGmailWebLink({ to, subject, body });

  if (isMobileDevice()) {
    // Mobile mode: Use mailto anchor click to launch native email app
    const a = document.createElement('a');
    a.href = mailtoUrl;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        // silent
      }
    }, 500);
  } else {
    // Laptop / Desktop mode: Open Web Gmail in a new tab
    try {
      const newWin = window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        // Popup was blocked, trigger mailto directly
        window.location.href = mailtoUrl;
      }
    } catch {
      window.location.href = mailtoUrl;
    }
  }
};

/**
 * Open WhatsApp directly on phone or laptop
 */
export const openWhatsApp = (messageText, phone = COMPANY_WHATSAPP_NUMBER) => {
  const url = getWhatsAppLink(messageText, phone);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      document.body.removeChild(a);
    } catch {
      // silent
    }
  }, 500);
};

/**
 * Helper to submit application to backend API and local storage
 */
export const submitApplicationData = async ({
  jobId = '',
  jobTitle = 'General Application',
  name,
  email,
  phone,
  experience = '',
  resumeName = '',
  coverNote = '',
}) => {
  // 1. Submit to backend API if available
  try {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        jobTitle,
        candidateName: name,
        candidateEmail: email,
        candidatePhone: phone,
        experience,
        resumeName,
        coverNote,
      }),
    });
  } catch {
    // Handled smoothly
  }

  // 2. Also persist in localStorage for offline/static deployment access in Admin Portal
  try {
    const existing = JSON.parse(localStorage.getItem('durgam_admin_applications') || '[]');
    const record = {
      id: 'app-' + Date.now(),
      jobId,
      jobTitle,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      experience,
      resumeName,
      coverNote,
      isViewed: 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('durgam_admin_applications', JSON.stringify([record, ...existing]));
  } catch {
    // silent
  }
};
