import React, { useState } from 'react';

import { MapPin, Send, Mail, Phone, Globe, CheckCircle2, RotateCcw, ExternalLink, Copy } from 'lucide-react';

import { Breadcrumb } from '../../components/common/Breadcrumb';

import { SectionHeader } from '../../components/common/SectionHeader';

import { Button } from '../../components/buttons/Button';

import contactHeroSoftwareWebp from '../../assets/images/contact/contact-hero-software.webp';



export const ContactPage = () => {

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({

    name: '',

    email: '',

    company: '',

    subject: '',

    message: '',

  });



  const handleChange = (key) => (e) =>

    setFormData({ ...formData, [key]: e.target.value });



  const formatEmailBody = () => {

    return (

      `Hello Billmaster / Durgam Soft Team,\n\n` +

      `You have received a new inquiry from the Durgam Soft website contact form:\n\n` +

      `--------------------------------------------------\n` +

      `CONTACT DETAILS\n` +

      `--------------------------------------------------\n` +

      `Full Name:    ${formData.name}\n` +

      `Email:        ${formData.email}\n` +

      `Company:      ${formData.company ? formData.company : 'Not Provided'}\n` +

      `Subject:      ${formData.subject}\n\n` +

      `--------------------------------------------------\n` +

      `MESSAGE\n` +

      `--------------------------------------------------\n` +

      `${formData.message}\n\n` +

      `--------------------------------------------------\n` +

      `Sent via: Durgam Soft Contact Page (www.billmasterapp.com)`

    );

  };



  const emailSubject = `[Website Inquiry] ${formData.subject || 'General Inquiry'} - ${formData.name || 'Visitor'}`;



  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@billmasterapp.com&su=${encodeURIComponent(

    emailSubject

  )}&body=${encodeURIComponent(formatEmailBody())}`;



  const [copied, setCopied] = useState(false);



  const handleCopyDetails = async () => {

    const textToCopy = `To: contact@billmasterapp.com\nSubject: ${emailSubject}\n\n${formatEmailBody()}`;

    try {

      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);

      setTimeout(() => setCopied(false), 3000);

    } catch {

      // fallback

    }

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    try {

      // Directly open Web Email (Gmail Compose in browser) instead of desktop Outlook

      window.open(gmailComposeLink, '_blank', 'noopener,noreferrer');

    } catch {

      // Fallback handled smoothly by UI state

    }

    setSubmitted(true);

  };



  const handleReset = () => {

    setSubmitted(false);

    setCopied(false);

    setFormData({

      name: '',

      email: '',

      company: '',

      subject: '',

      message: '',

    });

  };



  const companyName = 'Durgam Soft Pvt. Ltd.';

  const address =

    'PNO 292, opposite Silver Oak Banglows, Chinna Cherlapalli, Hyderabad, Secunderabad, Telangana 500051';



  const mapQuery = `${companyName}, ${address}`;

  const mapEmbedUrl =

    'https://maps.google.com/maps?q=' +

    encodeURIComponent(mapQuery) +

    '&t=&z=16&ie=UTF8&iwloc=&output=embed';



  const googleMapsDirectionsUrl =

    'https://www.google.com/maps/dir/?api=1&destination=' +

    encodeURIComponent(mapQuery);



  return (

    <div className="bg-white min-h-screen">

      <Breadcrumb items={[{ label: 'Contact Us' }]} />



      <section className="py-8 sm:py-12 border-b border-brand-border bg-white animate-contact-header">

        <div className="container-custom">

          <SectionHeader

            badge="Get in Touch"

            title="Let's Connect and Innovate"

            subtitle="Reach out to our team for software solutions, billmaster demos, or custom technology inquiries."

            align="center"

          />

        </div>

      </section>



      {/* Contact Form & Software Showcase Section (Reference Techasoft Design) */}

      <section className="relative py-10 sm:py-14 md:py-18 overflow-hidden bg-gradient-to-b from-brand-light-gray via-brand-light-orange/40 to-white">

        {/* Soft decorative glows */}

        <div

          aria-hidden="true"

          className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-brand-orange/10 blur-3xl animate-pulse-subtle"

        />

        <div

          aria-hidden="true"

          className="pointer-events-none absolute -bottom-32 -right-20 w-[32rem] h-[32rem] rounded-full bg-brand-navy/10 blur-3xl animate-pulse-subtle"

        />

        {/* Faint dot grid */}

        <div

          aria-hidden="true"

          className="pointer-events-none absolute inset-0 opacity-[0.35]"

          style={{

            backgroundImage:

              'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',

            backgroundSize: '28px 28px',

            maskImage:

              'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',

            WebkitMaskImage:

              'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',

          }}

        />



        <div className="container-custom relative max-w-6xl">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

            {/* Left Column: Contact Form */}

            <div className="lg:col-span-7 animate-contact-form">

              <div className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white border border-brand-border shadow-[0_12px_40px_-15px_rgba(11,31,58,0.12)] hover:shadow-[0_24px_60px_-12px_rgba(11,31,58,0.22)] hover:-translate-y-1 sm:hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.995] transition-all duration-500 ease-out h-full flex flex-col justify-between">

                <div>

                  <div className="mb-6">

                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block mb-1.5">

                      Send Us a Message

                    </span>

                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">

                      Let&rsquo;s Start a Conversation

                    </h2>

                    <p className="text-sm text-brand-secondary-text mt-1.5 leading-relaxed">

                      Fill out the form below and our team will get back to you within 24 hours.

                    </p>

                  </div>



                  {submitted ? (

                    <div className="py-6 my-auto space-y-6 text-center animate-contact-form">

                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">

                        <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />

                      </div>



                      <div>

                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">

                          Email Dispatched

                        </span>

                        <h3 className="text-2xl font-black text-brand-navy tracking-tight mb-2">

                          Thank You, {formData.name || 'Valued Visitor'}!

                        </h3>

                        <p className="text-sm text-brand-secondary-text max-w-md mx-auto leading-relaxed">

                          Your inquiry details have been forwarded to{' '}

                          <strong className="text-brand-navy font-semibold">contact@billmasterapp.com</strong>.

                          Our team will review your message and get back to you within 24 hours.

                        </p>

                      </div>



                      {/* Structured Details Card */}

                      <div className="text-left bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">

                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">

                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">

                            Message Summary

                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">

                            Sent to contact@billmasterapp.com

                          </span>

                        </div>



                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                          <div>

                            <span className="text-slate-500 font-semibold block text-[11px]">FROM</span>

                            <span className="font-bold text-slate-800 break-words">{formData.name}</span>

                            <span className="text-slate-500 block truncate">{formData.email}</span>

                          </div>

                          <div>

                            <span className="text-slate-500 font-semibold block text-[11px]">COMPANY</span>

                            <span className="font-semibold text-slate-800">{formData.company || 'Not Specified'}</span>

                          </div>

                        </div>



                        <div className="text-xs pt-1">

                          <span className="text-slate-500 font-semibold block text-[11px]">SUBJECT</span>

                          <span className="font-bold text-brand-navy">{formData.subject}</span>

                        </div>



                        <div className="text-xs pt-1">

                          <span className="text-slate-500 font-semibold block text-[11px]">MESSAGE DETAILS</span>

                          <div className="mt-1 p-3 bg-white rounded-xl border border-slate-200/90 text-slate-700 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto font-normal">

                            {formData.message}

                          </div>

                        </div>

                      </div>



                      {/* Action buttons */}

                      <div className="space-y-3 pt-1">

                        <a

                          href={gmailComposeLink}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C74E23] hover:bg-[#d4582f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"

                        >

                          <Mail className="w-4 h-4" />

                          <span>Send via Web Email (Gmail)</span>

                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />

                        </a>



                        <button

                          type="button"

                          onClick={handleCopyDetails}

                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"

                        >

                          {copied ? (

                            <>

                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

                              <span className="text-emerald-700 font-bold">Details Copied to Clipboard!</span>

                            </>

                          ) : (

                            <>

                              <Copy className="w-3.5 h-3.5 text-slate-500" />

                              <span>Copy Message Details (For Any Email App)</span>

                            </>

                          )}

                        </button>



                        <button

                          type="button"

                          onClick={handleReset}

                          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-slate-500 hover:text-slate-800 font-medium text-xs transition-all cursor-pointer"

                        >

                          <RotateCcw className="w-3.5 h-3.5" />

                          <span>Send Another Message</span>

                        </button>

                      </div>

                    </div>

                  ) : (

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                      <div>

                        <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1.5">

                          Full Name *

                        </label>

                        <input

                          type="text"

                          required

                          value={formData.name}

                          onChange={handleChange('name')}

                          placeholder="Your full name"

                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-slate-400 hover:shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange focus:shadow-[0_4px_16px_rgba(249,115,22,0.14)] focus:-translate-y-0.5 active:translate-y-0 transition-all duration-200"

                        />

                      </div>



                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>

                          <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1.5">

                            Email Address *

                          </label>

                          <input

                            type="email"

                            required

                            value={formData.email}

                            onChange={handleChange('email')}

                            placeholder="name@company.com"

                            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-slate-400 hover:shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange focus:shadow-[0_4px_16px_rgba(249,115,22,0.14)] focus:-translate-y-0.5 active:translate-y-0 transition-all duration-200"

                          />

                        </div>



                        <div>

                          <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1.5">

                            Company Name

                          </label>

                          <input

                            type="text"

                            value={formData.company}

                            onChange={handleChange('company')}

                            placeholder="Your company name"

                            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-slate-400 hover:shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange focus:shadow-[0_4px_16px_rgba(249,115,22,0.14)] focus:-translate-y-0.5 active:translate-y-0 transition-all duration-200"

                          />

                        </div>

                      </div>



                      <div>

                        <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1.5">

                          Subject *

                        </label>

                        <input

                          type="text"

                          required

                          value={formData.subject}

                          onChange={handleChange('subject')}

                          placeholder="What is this regarding?"

                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-slate-400 hover:shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange focus:shadow-[0_4px_16px_rgba(249,115,22,0.14)] focus:-translate-y-0.5 active:translate-y-0 transition-all duration-200"

                        />

                      </div>



                      <div>

                        <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1.5">

                          Message *

                        </label>

                        <textarea

                          required

                          rows={4}

                          value={formData.message}

                          onChange={handleChange('message')}

                          placeholder="Tell us how we can help you..."

                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-slate-400 hover:shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange focus:shadow-[0_4px_16px_rgba(249,115,22,0.14)] focus:-translate-y-0.5 active:translate-y-0 transition-all duration-200 resize-none"

                        />

                      </div>



                      <div className="space-y-2">

                        <Button

                          type="submit"

                          variant="primary"

                          size="lg"

                          className="w-full gap-2 py-4 rounded-xl font-bold text-base shadow-md hover:shadow-[0_14px_30px_-6px_rgba(249,115,22,0.5)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out cursor-pointer"

                        >

                          <Send className="w-4 h-4" />

                          <span>Send Message</span>

                        </Button>



                        <p className="text-[11px] text-brand-secondary-text text-center flex items-center justify-center gap-1.5 pt-1">

                          <Mail className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />

                          <span>

                            Direct delivery to{' '}

                            <strong className="text-brand-navy font-semibold">contact@billmasterapp.com</strong>

                          </span>

                        </p>

                      </div>

                    </form>

                  )}

                </div>

              </div>

            </div>



            {/* Right Column: Software Image at the Top + Quote & Message (Reference Techasoft Design) */}

            <div className="lg:col-span-5 animate-contact-showcase">

              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-brand-border shadow-[0_12px_40px_-15px_rgba(11,31,58,0.12)] hover:shadow-[0_24px_60px_-12px_rgba(11,31,58,0.22)] hover:-translate-y-1 sm:hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.995] transition-all duration-500 ease-out h-full flex flex-col justify-between">

                <div>

                  {/* Image Related to Our Software at the Top with Gentle Floating Animation */}

                  <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-gradient-to-b from-[#FAF7F2] to-white p-3 mb-7 group hover:shadow-xl hover:border-orange-200 transition-all duration-500 cursor-pointer">

                    <picture>

                      <source srcSet={contactHeroSoftwareWebp} type="image/webp" />

                      <img

                        src={contactHeroSoftwareWebp}

                        alt="Durgam Soft & billmaster 3D Cloud Software Platform"

                        loading="lazy"

                        decoding="async"

                        width={480}

                        height={300}

                        className="w-full h-auto max-h-[300px] object-contain mx-auto block transition-transform duration-700 ease-out group-hover:scale-106 animate-float-gentle drop-shadow-md"

                      />

                    </picture>

                  </div>



                  {/* Quote and Supportive Text */}

                  <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block mb-2">

                    Durgam Soft &amp; billmaster

                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight mb-3">

                    We are here for you!

                  </h3>



                  {/* Simple and Neat Quote */}

                  <blockquote className="border-l-4 border-brand-orange pl-4 py-2.5 bg-orange-50/70 rounded-r-xl my-4 hover:shadow-xs hover:border-brand-orange-hover hover:bg-orange-50 transition-all duration-300">

                    <p className="text-base sm:text-lg font-semibold text-slate-800 italic leading-snug">

                      &ldquo;Practical, reliable software designed to simplify everyday business operations and power lasting growth.&rdquo;

                    </p>

                  </blockquote>



                  <p className="text-sm sm:text-base text-brand-secondary-text leading-relaxed font-normal mt-3">

                    Our team is ready to assist you. Have an idea, a question, or ready to elevate your business operations with <strong>billmaster</strong>? Let&rsquo;s bring it to reality together.

                  </p>

                </div>



                {/* Quick Trust Highlights */}

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">

                  <div className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">

                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                    <span>Fast Response</span>

                  </div>

                  <div className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">

                    <span className="w-2 h-2 rounded-full bg-brand-orange" />

                    <span>Live Product Demo</span>

                  </div>

                  <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">

                    <span className="w-2 h-2 rounded-full bg-blue-500" />

                    <span>Dedicated Support</span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Contact Details (Reference Techasoft Design - 3 Columns without WhatsApp) */}

      <section className="py-12 md:py-16 bg-brand-light-gray border-t border-brand-border animate-contact-details">

        <div className="container-custom max-w-6xl">

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-brand-border shadow-[0_12px_40px_-15px_rgba(11,31,58,0.08)] hover:shadow-[0_20px_50px_-12px_rgba(11,31,58,0.16)] transition-all duration-500">

            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight mb-8">

              Contact Details

            </h2>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">

              {/* Drop an Email - Interactive Tile with Hover & Active Click Shadow */}

              <a

                href="mailto:contact@billmasterapp.com"

                className="p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98] active:shadow-2xs transition-all duration-300 flex items-start gap-3.5 sm:gap-4 group cursor-pointer"

              >

                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#B83E15] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-2xs mt-0.5">

                  <Mail className="w-5 h-5 stroke-[2.2]" />

                </div>

                <div className="min-w-0">

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 group-hover:text-[#C74E23] transition-colors">

                    DROP AN EMAIL

                  </span>

                  <span className="text-base font-bold text-brand-navy group-hover:text-[#C74E23] transition-colors break-words block leading-snug">

                    contact@billmasterapp.com

                  </span>

                </div>

              </a>



              {/* Call Us - Interactive Tile with Hover & Active Click Shadow */}

              <a

                href="tel:+918374588099"

                className="p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98] active:shadow-2xs transition-all duration-300 flex items-start gap-3.5 sm:gap-4 group cursor-pointer"

              >

                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#B83E15] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-2xs mt-0.5">

                  <Phone className="w-5 h-5 stroke-[2.2]" />

                </div>

                <div className="min-w-0">

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 group-hover:text-[#C74E23] transition-colors">

                    CALL US (INDIA)

                  </span>

                  <span className="text-base font-bold text-brand-navy group-hover:text-[#C74E23] transition-colors break-normal block leading-snug">

                    +91 83745 88099

                  </span>

                </div>

              </a>



              {/* Official Website - Interactive Tile with Hover & Active Click Shadow */}

              <a

                href="https://www.billmasterapp.com"

                target="_blank"

                rel="noopener noreferrer"

                className="p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98] active:shadow-2xs transition-all duration-300 flex items-start gap-3.5 sm:gap-4 group cursor-pointer"

              >

                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#B83E15] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-2xs mt-0.5">

                  <Globe className="w-5 h-5 stroke-[2.2]" />

                </div>

                <div className="min-w-0">

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 group-hover:text-[#C74E23] transition-colors">

                    OFFICIAL WEBSITE

                  </span>

                  <span className="text-base font-bold text-brand-navy group-hover:text-[#C74E23] transition-colors break-words block leading-snug">

                    www.billmasterapp.com

                  </span>

                </div>

              </a>

            </div>

          </div>

        </div>

      </section>



      {/* Location */}

      <section className="py-16 bg-brand-light-gray border-t border-brand-border animate-contact-map">

        <div className="container-custom">

          <SectionHeader

            badge="Visit Us"

            title="Our Office"

            subtitle="Come see us at our Hyderabad office."

            align="center"

          />



          <div className="max-w-6xl mx-auto">

            {/* Map Frame with Floating Red Pin Company Badge */}

            <div className="relative rounded-2xl border border-brand-border overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 bg-slate-100 group">

              {/* Floating Red Pin Badge */}

              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-red-100 shadow-md group-hover:shadow-lg flex items-center gap-3 transition-shadow">

                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-sm shadow-red-500/40">

                  <MapPin className="w-4 h-4 fill-white text-white animate-pulse" />

                </div>

                <div>

                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">

                    <span>{companyName}</span>

                    <span className="w-2 h-2 rounded-full bg-red-600" />

                  </div>

                  <div className="text-[11px] text-slate-500">Corporate HQ • Cherlapalli, Hyderabad</div>

                </div>

              </div>



              <iframe

                title="Durgam Soft Pvt. Ltd. Office Location"

                src={mapEmbedUrl}

                width="100%"

                height="420"

                style={{ border: 0 }}

                loading="lazy"

                allowFullScreen

              />

            </div>



            {/* Office Information Card with Red Pin Highlight */}

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-7 bg-white rounded-xl sm:rounded-2xl border border-brand-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">

              <div className="flex items-start sm:items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">

                  <MapPin className="w-6 h-6 text-red-600 fill-red-100" />

                </div>

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />

                    <h3 className="text-lg font-bold text-brand-navy">

                      {companyName}

                    </h3>

                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">

                      Main Office

                    </span>

                  </div>

                  <p className="text-sm text-brand-secondary-text leading-relaxed max-w-xl">

                    {address}

                  </p>

                </div>

              </div>



              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">

                <a

                  href={googleMapsDirectionsUrl}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-sm hover:shadow-lg transition-all"

                >

                  <MapPin className="w-3.5 h-3.5 fill-white" />

                  <span>Get Directions</span>

                </a>

                <p className="text-xs text-brand-secondary-text">Mon–Sat, 9 AM – 6 PM IST</p>

              </div>

            </div>

          </div>

        </div>

      </section>



      <section className="py-16 border-t border-brand-border">

        <div className="container-custom">

          <div className="text-center">

            <p className="text-brand-secondary-text text-sm">

              Have questions? Email us or call us and we&rsquo;ll be happy to help.

            </p>

          </div>

        </div>

      </section>

    </div>

  );

};



export default ContactPage;

