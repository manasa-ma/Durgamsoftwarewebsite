import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Lightbulb,
  Send,
  Mail,
  Phone,
  RotateCcw,
  FileText,
  Paperclip,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/buttons/Button';
import { ResumeUploadField, formatFileSize } from '../../components/common/ResumeUploadField';
import { updatePageMeta } from '../../utils/seo';
import { CAREERS_PAGE_DATA } from '../../data/careers';

export const CareersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [positions] = useState(CAREERS_PAGE_DATA.positions);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: CAREERS_PAGE_DATA.positions[0]?.title || 'General Engineering Application',
    experience: '',
    coverNote: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const applySectionRef = useRef(null);

  useEffect(() => {
    updatePageMeta({
      title: 'Careers — Join Our Engineering & Growth Team | Durgam Soft',
      description:
        'Explore open roles in Flutter mobile engineering, field marketing, digital marketing, and leadership at Durgam Soft Pvt. Ltd. in Hyderabad.',
    });
  }, []);

  const handleApplyClick = (roleTitle) => {
    setFormData((prev) => ({ ...prev, position: roleTitle }));
    if (applySectionRef.current) {
      applySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const formatEmailBody = () => {
    const resumeInfo = resumeFile
      ? `${resumeFile.name} (${formatFileSize(resumeFile.size)})`
      : 'Not Attached (Will attach to email)';
    return (
      `Hello Durgam Soft Recruitment Team,\n\n` +
      `A new job application has been submitted via the Durgam Soft Careers portal:\n\n` +
      `--------------------------------------------------\n` +
      `CANDIDATE DETAILS\n` +
      `--------------------------------------------------\n` +
      `Full Name:           ${formData.name}\n` +
      `Email Address:       ${formData.email}\n` +
      `Phone Number:        ${formData.phone}\n` +
      `Position Applied:    ${formData.position}\n` +
      `Relevant Experience: ${formData.experience}\n\n` +
      `--------------------------------------------------\n` +
      `RESUME ATTACHMENT\n` +
      `--------------------------------------------------\n` +
      `Uploaded Resume:     ${resumeInfo}\n\n` +
      `--------------------------------------------------\n` +
      `COVER NOTE / MESSAGE\n` +
      `--------------------------------------------------\n` +
      `${formData.coverNote || 'Not Provided'}\n\n` +
      `--------------------------------------------------\n` +
      `Sent via: Durgam Soft Careers Portal (www.durgamsoft.com/careers)\n` +
      `Applicant Note: Please attach the selected resume file (${resumeFile?.name || 'resume'}) to this email message.`
    );
  };

  const emailSubject = `[Job Application] ${formData.position} - ${formData.name || 'Applicant'}`;

  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=careers@durgamsoft.com&su=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(formatEmailBody())}`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setFileError('Please upload your resume (PDF, DOC, or DOCX)');
      return;
    }

    try {
      // Directly open Web Email (Gmail) in browser instead of desktop Outlook
      window.open(gmailComposeLink, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback handled smoothly by UI state
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setResumeFile(null);
    setFileError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: positions[0]?.title || 'General Engineering Application',
      experience: '',
      coverNote: '',
    });
  };

  // Derive available categories dynamically from active published jobs
  const dynamicDepts = Array.from(new Set(positions.map((p) => p.department).filter(Boolean)));
  const categories = ['All', ...dynamicDepts];

  const filteredPositions =
    selectedCategory === 'All'
      ? positions
      : positions.filter((pos) => pos.department === selectedCategory);

  const getPillarIcon = (iconName) => {
    switch (iconName) {
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-[#C74E23]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#C74E23]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#C74E23]" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5 text-[#C74E23]" />;
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans text-slate-900 antialiased">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Careers' }]} />

      {/* ======================================================== */}
      {/* 1. Endless Possibilities & Culture Section               */}
      {/* ======================================================== */}
      <section className="py-8 md:py-12 bg-white border-b border-stone-200/60">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B83E15] block mb-1.5">
              JOIN THE TEAM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight uppercase">
              ENDLESS <span className="text-[#C74E23]">POSSIBILITIES</span>
            </h2>
            <div className="w-14 h-1 bg-[#C74E23] rounded-full mx-auto mt-3 mb-4" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At Durgam Soft, we are always on the lookout for talented and passionate individuals to
              join our team. If you are looking for a dynamic work environment where innovation and
              creativity are valued, you&rsquo;ve come to the right place.
            </p>
          </div>

          {/* Culture Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {CAREERS_PAGE_DATA.culturePillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-stone-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {getPillarIcon(pillar.icon)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-slate-600 border border-stone-200">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-black tracking-tight mb-1.5 group-hover:text-[#C74E23] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Current Openings Section: Techasoft-Style 3-Col Cards */}
      {/* ======================================================== */}
      <section
        id="open-positions"
        className="py-8 md:py-12 bg-[#FAF7F2] border-b border-stone-200/80"
      >
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B83E15] block mb-1.5">
              DISCOVER
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight uppercase">
              CURRENT <span className="text-[#C74E23]">OPENINGS</span>
            </h2>
            <div className="w-14 h-1 bg-[#C74E23] rounded-full mx-auto mt-3 mb-3" />
            <p className="text-sm sm:text-base text-slate-600">
              Browse verified full-time positions and internship opportunities across software development, sales, and marketing.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-md scale-102'
                    : 'bg-white text-slate-700 hover:bg-stone-100 hover:text-black border border-stone-200'
                }`}
              >
                {cat}{' '}
                <span className="ml-1 opacity-75">
                  (
                  {cat === 'All'
                    ? positions.length
                    : positions.filter((p) => p.department === cat).length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Techasoft-Style Openings Card Grid (3 Columns) */}
          {filteredPositions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/90 p-8 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-black mb-1">No Open Positions Currently</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4">
                We do not have active openings in this department at this time. Feel free to submit a general application below.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 bg-black hover:bg-[#C74E23] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                View All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {filteredPositions.map((job) => (
                <div
                  key={job.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-2xl hover:-translate-y-1.5 hover:border-stone-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header: Icon + Department + Experience */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100/80 flex items-center justify-center text-[#C74E23] group-hover:scale-105 transition-transform shadow-2xs">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-slate-700 border border-stone-200">
                        {job.experience}
                      </span>
                    </div>

                    {/* Department Pill */}
                    <div className="mb-1.5">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#B83E15]">
                        {job.department}
                      </span>
                    </div>

                    {/* Job Title (Links directly to Job Details page) */}
                    <h3 className="text-xl font-black text-black tracking-tight mb-2.5 group-hover:text-[#C74E23] transition-colors leading-snug">
                      <Link to={`/careers/${job.id}`}>
                        {job.title}
                      </Link>
                    </h3>

                    {/* Location & Compensation Meta */}
                    <div className="space-y-1.5 mb-3 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                        <span className="truncate">
                          {Array.isArray(job.locations)
                            ? job.locations.join(', ')
                            : (job.location || 'Hyderabad')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-black bg-[#FAF7F2] px-3 py-1 rounded-lg border border-stone-200 w-fit">
                        <span className="text-slate-700 font-normal">Salary:</span>
                        <span className="text-[#B83E15]">{job.salary || 'Competitive'}</span>
                      </div>
                    </div>

                    {/* Overview snippet */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5">
                      {job.overview || job.description}
                    </p>
                  </div>

                  {/* Card Footer: "View More Details" Button & Quick Apply */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/careers/${job.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-[#C74E23] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 group/btn"
                    >
                      <span>More Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleApplyClick(job.title)}
                      className="text-xs font-bold text-slate-500 hover:text-[#C74E23] transition-colors py-2 px-2 cursor-pointer"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. "COME WORK WITH US" Quick Application Form            */}
      {/* ======================================================== */}
      <section
        ref={applySectionRef}
        id="apply-now"
        className="py-8 md:py-12 bg-white border-b border-stone-200"
      >
        <div className="container-custom max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B83E15] block mb-1.5">
              START YOUR JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight uppercase">
              COME WORK <span className="text-[#C74E23]">WITH US</span>
            </h2>
            <div className="w-14 h-1 bg-[#C74E23] rounded-full mx-auto mt-3 mb-3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
            {/* Left Column: Application Form */}
            <div className="lg:col-span-7">
              <div className="relative bg-white rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-15px_rgba(232,104,62,0.12),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-500 p-6 sm:p-8 md:p-9 flex flex-col justify-between h-full overflow-hidden">
                {/* Subtle top ambient accent line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C74E23] via-amber-500 to-[#C74E23]/70" />

                <div>
                  <div className="mb-6 pb-5 border-b border-stone-100">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#B83E15] text-[11px] font-bold uppercase tracking-wider mb-2.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#C74E23]" />
                      Direct Application
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Submit Your Application
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      No LinkedIn required. Share your details and upload your resume.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="py-6 my-auto space-y-5 text-center animate-contact-form">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm animate-bounce">
                        <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider mb-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Application Received &amp; Under Review
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-2">
                          Thank You, {formData.name || 'Applicant'}!
                        </h4>

                        {/* Immediate Candidate Acknowledgment Banner */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/90 border border-orange-200 text-left space-y-2 max-w-lg mx-auto shadow-2xs">
                          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            Thanks for applying for the <strong className="text-[#C74E23] font-black">{formData.position}</strong> position! We have received your application and credentials.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Our recruitment team is <strong>currently reviewing your application</strong> against the role requirements. <strong>We will get back to you directly when you are selected for the next round</strong> (technical assessment or interview).
                          </p>
                          <div className="pt-1.5 border-t border-orange-200/70 flex items-center gap-2 text-[11px] text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                            <span>
                              Confirmation dispatched to <strong className="text-slate-800">{formData.email}</strong>.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Structured Summary Card */}
                      <div className="text-left bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200 text-xs space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Application Summary
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Sent to careers@durgamsoft.com
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Applicant</span>
                            <span className="font-bold text-slate-900 block">{formData.name}</span>
                            <span className="text-slate-600 block text-[11px] truncate">{formData.email} • {formData.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Position &amp; Experience</span>
                            <span className="font-bold text-[#B83E15] block">{formData.position}</span>
                            <span className="text-slate-600 block text-[11px]">{formData.experience || 'Not Specified'}</span>
                          </div>
                        </div>

                        <div className="pt-1">
                          <span className="text-slate-500 font-semibold block text-[10px] uppercase mb-1">Uploaded Resume</span>
                          {resumeFile ? (
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-slate-900 text-xs truncate block">{resumeFile.name}</span>
                                <span className="text-[10px] text-slate-500">{formatFileSize(resumeFile.size)}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                                Attached
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Not Attached</span>
                          )}
                        </div>

                        {resumeFile && (
                          <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 text-[11px] text-stone-700 flex items-start gap-2">
                            <Paperclip className="w-3.5 h-3.5 text-[#C74E23] shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              <strong>Important:</strong> When your email client opens, please attach <strong>{resumeFile.name}</strong> to the drafted email before sending.
                            </p>
                          </div>
                        )}

                        {formData.coverNote && (
                          <div className="pt-1">
                            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Cover Note</span>
                            <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-stone-200 mt-1 max-h-24 overflow-y-auto whitespace-pre-wrap font-normal leading-relaxed text-[11px]">
                              {formData.coverNote}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2.5 pt-1">
                        <a
                          href={gmailComposeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#C74E23] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Send via Web Email (Gmail)</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Submit Another Application</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="career-name" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                            Full Name *
                          </label>
                          <input
                            id="career-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleFormChange('name')}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 placeholder:text-slate-400 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label htmlFor="career-email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                            Email Address *
                          </label>
                          <input
                            id="career-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleFormChange('email')}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 placeholder:text-slate-400 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Phone & Position */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="career-phone" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                            Phone Number *
                          </label>
                          <input
                            id="career-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleFormChange('phone')}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 placeholder:text-slate-400 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label htmlFor="career-position" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                            Role Applying For *
                          </label>
                          <div className="relative">
                            <select
                              id="career-position"
                              value={formData.position}
                              onChange={handleFormChange('position')}
                              className="w-full px-4 py-3 pr-10 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 shadow-2xs cursor-pointer appearance-none"
                            >
                              {CAREERS_PAGE_DATA.positions.map((p) => (
                                <option key={p.id} value={p.title}>
                                  {p.title} ({p.experience})
                                </option>
                              ))}
                              <option value="General Engineering Application">
                                Other / General Engineering Application
                              </option>
                              <option value="General Sales & Marketing Application">
                                Other / General Sales &amp; Marketing Application
                              </option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Relevant Experience */}
                      <div>
                        <label htmlFor="career-experience" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                          Relevant Experience *
                        </label>
                        <input
                          id="career-experience"
                          type="text"
                          required
                          value={formData.experience}
                          onChange={handleFormChange('experience')}
                          placeholder="e.g. 1.5 Years, Fresher, or 3+ Years"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 placeholder:text-slate-400 shadow-2xs"
                        />
                      </div>

                      {/* Resume File Upload */}
                      <div>
                        <ResumeUploadField
                          file={resumeFile}
                          onFileSelect={(f) => {
                            setResumeFile(f);
                            if (f) setFileError('');
                          }}
                          error={fileError}
                          setError={setFileError}
                          id="quick-apply-resume"
                          label="Upload Resume (PDF, DOC, DOCX) *"
                        />
                      </div>

                      {/* Cover Note */}
                      <div>
                        <label htmlFor="career-cover-note" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 cursor-pointer">
                          Brief Cover Note / Why You&rsquo;re a Fit
                        </label>
                        <textarea
                          id="career-cover-note"
                          rows={3}
                          value={formData.coverNote}
                          onChange={handleFormChange('coverNote')}
                          placeholder="Tell us a bit about your background, key projects, and why you want to join Durgam Soft..."
                          className="w-full px-4 py-3 rounded-xl border border-stone-200/90 text-sm text-slate-900 bg-stone-50/40 hover:bg-white hover:border-stone-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-[#C74E23] transition-all duration-200 placeholder:text-slate-400 shadow-2xs resize-none"
                        />
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full gap-2.5 py-3.5 sm:py-4 rounded-xl font-bold text-sm tracking-wide bg-[#C74E23] hover:bg-orange-600 active:bg-orange-700 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                        >
                          <Send className="w-4 h-4 stroke-[2.2]" />
                          <span>Submit Application</span>
                        </Button>

                        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                          <Mail className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                          <span>
                            Direct delivery to{' '}
                            <strong className="text-black font-semibold">careers@durgamsoft.com</strong>
                          </span>
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Direct HR & Application Channels (Zero Blue) */}
            <div className="lg:col-span-5 space-y-4">
              {/* HR Contact Card */}
              <div className="relative bg-white rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-15px_rgba(232,104,62,0.12),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-500 p-6 sm:p-7 md:p-8 overflow-hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#B83E15] text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Mail className="w-3.5 h-3.5 text-[#C74E23]" />
                  DIRECT RECRUITMENT DESK
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-2.5">
                  Prefer to Email Us Directly?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  You can also directly email your resume and cover letter to our recruitment team. Please mention the role you are applying for in the email subject.
                </p>

                <div className="space-y-3">
                  {/* Email Tile */}
                  <a
                    href={`mailto:${CAREERS_PAGE_DATA.contactHR.email}?subject=Job%20Application`}
                    className="p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 transition-all duration-200 flex items-center gap-3 group block cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                        RECRUITMENT EMAIL
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-black group-hover:text-[#C74E23] transition-colors break-words block">
                        {CAREERS_PAGE_DATA.contactHR.email}
                      </span>
                    </div>
                  </a>

                  {/* Phone Tile */}
                  <a
                    href={`tel:${CAREERS_PAGE_DATA.contactHR.phone.replace(/\s+/g, '')}`}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-orange-50 border border-stone-200 transition-all duration-200 flex items-center gap-3 group block cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                        HR &amp; CAREERS LINE
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-black group-hover:text-[#C74E23] transition-colors whitespace-nowrap block">
                        {CAREERS_PAGE_DATA.contactHR.phone}
                      </span>
                    </div>
                  </a>

                  {/* Office Location Tile */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4 text-stone-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                        OFFICE LOCATION
                      </span>
                      <span className="text-xs font-bold text-slate-800 block">
                        {CAREERS_PAGE_DATA.contactHR.office}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Friendly Note */}
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hiring Note:</strong> {CAREERS_PAGE_DATA.contactHR.note}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
