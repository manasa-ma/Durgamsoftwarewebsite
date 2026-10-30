import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Cookie,
  AlertTriangle,
  Calendar,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { updatePageMeta } from '../../utils/seo';

export const LegalPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('privacy-policy');

  useEffect(() => {
    updatePageMeta({
      title: 'Legal Information & Policies — Privacy, Terms, Cookies & Disclaimer | Durgam Soft',
      description:
        'Official legal terms, privacy policy, cookie policy, and disclaimer for Durgam Soft Pvt. Ltd. and billmaster software products and services.',
    });
  }, []);

  // Smooth scroll to hash anchor on load or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 120);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash, location.pathname]);

  const navItems = [
    { id: 'privacy-policy', label: '1. Privacy Policy', icon: ShieldCheck },
    { id: 'terms-and-conditions', label: '2. Terms & Conditions', icon: FileText },
    { id: 'cookie-policy', label: '3. Cookie Policy', icon: Cookie },
    { id: 'disclaimer', label: '4. Disclaimer', icon: AlertTriangle },
    { id: 'contact-information', label: '5. Contact & Updates', icon: Building2 },
  ];

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <Breadcrumb items={[{ label: 'Legal & Policies' }]} />

      {/* Hero / Header Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border relative overflow-hidden">
        {/* Soft background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-orange/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-navy/5 blur-3xl"
        />

        <div className="container-custom relative max-w-5xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-4">
            Legal Information &amp; Policies
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-brand-secondary-text mb-6">
            <div className="flex items-center gap-1.5 font-bold text-brand-navy">
              <Building2 className="w-4 h-4 text-[#C74E23]" />
              <span>Durgam Soft Pvt. Ltd.</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-600">
              <Calendar className="w-4 h-4 text-[#C74E23]" />
              <span>Last Updated: October 26, 2026</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Welcome to <strong>Durgam Soft Pvt. Ltd.</strong> This Legal Information page explains the policies and conditions that apply when you visit our website, use our software products, purchase our hardware products, or engage our services.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto mt-2 leading-relaxed">
            Durgam Soft Pvt. Ltd. provides <strong>billmaster</strong> software and mobile applications, hardware products and supplies, custom software development, and digital marketing services. By accessing our website or using our products and services, you agree to the applicable terms and policies described below.
          </p>
        </div>
      </section>

      {/* Main Content Layout with Responsive Table of Contents Navigation */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Sticky Table of Contents Sidebar (Desktop) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-brand-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Table of Contents
                </span>
                <nav className="space-y-1.5" aria-label="Legal Sections Navigation">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={handleScrollTo(item.id)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-orange-50 text-[#B83E15] border border-orange-200/90 shadow-2xs'
                            : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C74E23]' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C74E23]' : 'text-slate-300'}`} />
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-brand-navy">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Legally Grounded &amp; Compliant</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Applicable to all website visitors, software licensees, and hardware customers.
                  </p>
                </div>
              </div>
            </aside>

            {/* Comprehensive Legal Content Body */}
            <main className="lg:col-span-8 space-y-10">
              {/* SECTION 1: PRIVACY POLICY */}
              <article
                id="privacy-policy"
                className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                      Section 1
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      Privacy Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.1 Information We Collect
                    </h3>
                    <p className="text-slate-600 mb-3">
                      We may collect the following types of information when you interact with our website, software, products, or services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 pl-1">
                      <li>
                        <strong className="text-brand-navy">Personal information:</strong> Name, email address, phone number, business name, and address.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Business information:</strong> Details provided when requesting quotations, purchasing products, or engaging our services.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Transaction information:</strong> Order details, invoices, payment status, and delivery information. Payment card or banking details are handled by the relevant payment provider where applicable.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Technical information:</strong> IP address, browser type, device information, website usage, and diagnostic logs.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Service information:</strong> Information you provide when using billmaster, requesting technical support, or engaging us for software development or digital marketing.
                      </li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-3 italic">
                      The information we collect depends on the product or service you use.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.2 How We Use Information
                    </h3>
                    <p className="text-slate-600 mb-2">We may use your information to:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                      <li>Respond to enquiries and provide quotations.</li>
                      <li>Create and manage customer accounts.</li>
                      <li>Provide, maintain, and support billmaster and other software products.</li>
                      <li>Process hardware orders, payments, shipping, and returns.</li>
                      <li>Deliver software development and digital marketing services.</li>
                      <li>Communicate service updates, invoices, and important notices.</li>
                      <li>Improve our website, products, and customer experience.</li>
                      <li>Prevent fraud, protect our systems, comply with legal obligations, and resolve disputes.</li>
                      <li>Send promotional communications where permitted by law and subject to applicable consent requirements.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.3 Sharing of Information
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We do not sell personal information as a business practice. We may share relevant information with authorized service providers, such as hosting companies, payment processors, delivery partners, analytics providers, and support tools, where necessary to operate our business.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Information may also be disclosed when legally required or necessary to protect our rights, customers, or systems.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.4 Data Security and Retention
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We use reasonable technical and organizational safeguards designed to protect information from unauthorized access, loss, misuse, or disclosure. However, no internet transmission or storage system can be guaranteed completely secure.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      We retain information only for as long as reasonably necessary for the relevant business purposes, contractual obligations, dispute resolution, and applicable legal requirements.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.5 Your Privacy Rights
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Depending on applicable law, you may have rights to access, correct, update, or request deletion of your personal information, withdraw consent, or raise a privacy-related complaint.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      To submit a privacy request, contact us using the details provided at the end of this page. We may need to verify your identity before processing certain requests.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.6 Third-Party Services
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our website, software, or services may use third-party platforms and integrations. Their privacy practices are governed by their respective policies. We encourage you to review those policies when using their services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      1.7 Children's Privacy
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our business services are not intentionally directed at children. If we become aware that personal information has been collected in circumstances that violate applicable law, we will take appropriate steps to address it.
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 2: TERMS & CONDITIONS */}
              <article
                id="terms-and-conditions"
                className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                      Section 2
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      Terms &amp; Conditions
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.1 Acceptance of Terms
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      By accessing our website, purchasing our products, subscribing to billmaster, or engaging our services, you agree to comply with these Terms &amp; Conditions and any applicable order forms, subscription agreements, or service contracts.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.2 Our Products and Services
                    </h3>
                    <p className="text-slate-600 mb-2">Durgam Soft Pvt. Ltd. may provide:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                      <li>billmaster billing, business management, and related software products.</li>
                      <li>Mobile applications and related digital tools.</li>
                      <li>Thermal printers, barcode scanners, label printers, paper rolls, labels, and other hardware or supplies.</li>
                      <li>Custom website, mobile application, and desktop application development.</li>
                      <li>Digital marketing, online advertising, and related services.</li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Specific features, pricing, delivery terms, subscriptions, and service commitments may be described separately in product listings, quotations, or agreements.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.3 billmaster Software
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Use of billmaster may be subject to a separate subscription, licence, or service agreement.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      You agree to provide accurate account information, keep your login credentials secure, and use the software lawfully. You are responsible for reviewing the accuracy of business records, invoices, tax settings, and other information generated or maintained through the software.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Software features, integrations, and availability may change as we maintain or improve our products. Where applicable, subscription charges, renewal terms, cancellation rules, and data export or retention arrangements will be stated in the relevant plan or agreement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.4 Hardware Orders and Payments
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Product prices, taxes, shipping charges, availability, and delivery estimates will be communicated through the relevant product listing, quotation, or order confirmation.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      An order may be subject to acceptance and stock availability. Customers must provide accurate billing, contact, and delivery details. Payment methods, cancellations, returns, refunds, replacement conditions, and warranty coverage will be governed by the applicable sales policy and the terms communicated at purchase.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.5 Shipping, Returns, and Warranty
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Delivery timelines are estimates unless expressly guaranteed in writing. Delays may occur due to courier operations, stock availability, or circumstances outside our reasonable control.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Products eligible for return, replacement, repair, or refund will be handled according to the applicable return policy, product condition requirements, and manufacturer or seller warranty terms. Nothing in this section limits rights that cannot lawfully be excluded.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.6 Custom Software Development
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Custom development projects will be governed by the agreed proposal, scope of work, milestones, fees, timelines, acceptance criteria, and support arrangements.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Changes outside the agreed scope may require additional charges and revised timelines. Ownership and licensing of source code, designs, documentation, third-party components, and other deliverables will be determined by the applicable written agreement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.7 Digital Marketing Services
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Digital marketing services may include search engine optimization, advertising campaign management, social media marketing, content, and related activities.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Results depend on factors such as market conditions, competition, platform algorithms, advertising budgets, and customer behaviour. We do not guarantee specific rankings, sales, leads, or revenue unless expressly agreed in writing. Third-party advertising and social platforms remain subject to their own policies and terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.8 Intellectual Property
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Unless otherwise stated in a written agreement, our website content, branding, logos, software, designs, and other proprietary materials are owned by or licensed to Durgam Soft Pvt. Ltd. You may not copy, distribute, modify, reverse engineer, or commercially exploit protected materials except as permitted by law or with appropriate authorization.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.9 Acceptable Use
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      You must not use our website, software, or services for unlawful activities, fraud, unauthorized access, malicious activity, infringement of third-party rights, or interference with our systems or other users.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.10 Service Availability and Liability
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We make reasonable efforts to provide reliable products and services, but uninterrupted or error-free availability cannot always be guaranteed.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      To the extent permitted by applicable law, Durgam Soft Pvt. Ltd. will not be liable for indirect or consequential losses arising from the use or inability to use our website, software, products, or services. Any applicable limitations are subject to mandatory legal rights and the terms of the relevant agreement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.11 Suspension and Termination
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We may suspend or terminate access where reasonably necessary due to a material breach of applicable terms, security concerns, unlawful activity, or legal requirements, subject to applicable contractual obligations and law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      2.12 Governing Law and Disputes
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      These Terms &amp; Conditions are governed by the laws of India, subject to applicable law. Disputes will be handled by the competent courts or other dispute-resolution forums having jurisdiction, as applicable.
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 3: COOKIE POLICY */}
              <article
                id="cookie-policy"
                className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs">
                    <Cookie className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                      Section 3
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      Cookie Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      3.1 What Are Cookies?
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Cookies are small text files stored on your device by a website. Similar technologies, such as local storage, pixels, and analytics identifiers, may also be used to support website functionality and understand usage.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      3.2 How We Use Cookies
                    </h3>
                    <p className="text-slate-600 mb-2">
                      We may use cookies and similar technologies for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                      <li>
                        <strong className="text-brand-navy">Essential cookies:</strong> Support website operation, security, and basic functionality.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Preference cookies:</strong> Remember settings or preferences.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Analytics cookies:</strong> Help us understand website traffic and improve the user experience.
                      </li>
                      <li>
                        <strong className="text-brand-navy">Marketing cookies:</strong> Where used and permitted, help measure advertising performance or provide relevant marketing.
                      </li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      The actual cookies used will depend on the tools and integrations enabled on our website.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      3.3 Managing Cookie Preferences
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Where required by law, non-essential cookies will be used only after the appropriate consent has been obtained. You can manage available preferences through our cookie banner or settings tool, if provided.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      You can also manage or delete cookies through your browser settings. Blocking certain cookies may affect website functionality.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      3.4 Third-Party Cookies
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Some cookies or similar technologies may be provided by third-party analytics, advertising, or embedded-content services. Their use is subject to the relevant providers' policies and applicable consent requirements.
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 4: DISCLAIMER */}
              <article
                id="disclaimer"
                className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs">
                    <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                      Section 4
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      Disclaimer
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.1 General Website Information
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      We make reasonable efforts to keep our website content accurate and current. However, descriptions, specifications, prices, availability, and other information may change. Website content is provided for general information unless a separate written agreement states otherwise.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.2 Software Disclaimer
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      billmaster and our other software products are tools intended to support business operations. Users remain responsible for reviewing their data, configuring the software appropriately, maintaining backups where applicable, and verifying that their use meets their business and legal requirements.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      Software outputs should be checked before being relied upon for important business decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.3 Accounting and Tax Information
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Any billing, reporting, accounting, or tax-related features are provided as software functionality and do not constitute professional legal, accounting, or tax advice. Customers should consult a qualified professional to confirm their obligations and the accuracy of their records and filings.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.4 Hardware Information
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Product images, specifications, compatibility details, and descriptions are provided for reference. Actual appearance, packaging, specifications, and availability may vary by model, supplier, or production revision. Please confirm compatibility and technical requirements before purchasing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.5 Marketing Results
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Digital marketing outcomes are not guaranteed. Search rankings, advertising costs, audience reach, enquiries, conversions, and revenue may fluctuate based on external factors and the customer's market, budget, and participation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.6 External Links and Services
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our website may link to third-party websites, applications, or services. We do not control all external content or practices and are not responsible for third-party terms, availability, or privacy practices, subject to applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      4.7 Limitation of Disclaimer
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      To the extent permitted by applicable law, information on this website is provided without guarantees that it will be complete, accurate, uninterrupted, or suitable for every purpose. Nothing in this Disclaimer excludes a legal responsibility or consumer right that cannot lawfully be excluded.
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 5: CONTACT INFORMATION AND LEGAL UPDATES */}
              <article
                id="contact-information"
                className="scroll-mt-24 bg-gradient-to-br from-white via-orange-50/20 to-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center shrink-0 shadow-2xs">
                    <Building2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                      Section 5
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      Contact Information &amp; Legal Updates
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <p className="text-slate-600 leading-relaxed">
                    If you have questions about this Legal Information page, wish to make a privacy request, or need assistance with our products or services, please contact us:
                  </p>

                  {/* Company Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Company Name
                      </span>
                      <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-brand-navy">
                        <Building2 className="w-4 h-4 text-[#C74E23] shrink-0" />
                        <span>Durgam Soft Pvt. Ltd.</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Official Websites
                      </span>
                      <div className="space-y-1">
                        <a
                          href="https://www.durgamsoft.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C74E23] hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>www.durgamsoft.com</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                        <a
                          href="https://www.billmasterapp.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C74E23] hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>www.billmasterapp.com</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        General &amp; Product Email
                      </span>
                      <a
                        href="mailto:info@durgamsoft.com"
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy hover:text-[#C74E23] transition-colors break-all"
                      >
                        <Mail className="w-4 h-4 text-[#C74E23] shrink-0" />
                        <span>info@durgamsoft.com</span>
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Privacy &amp; Grievance Contact
                      </span>
                      <a
                        href="mailto:info@durgamsoft.com"
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy hover:text-[#C74E23] transition-colors break-all"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C74E23] shrink-0" />
                        <span>info@durgamsoft.com</span>
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Business Phone Number
                      </span>
                      <a
                        href="tel:+918374588099"
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy hover:text-[#C74E23] transition-colors"
                      >
                        <Phone className="w-4 h-4 text-[#C74E23] shrink-0" />
                        <span>+91 83745 88099</span>
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs sm:col-span-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Registered Business Address
                      </span>
                      <div className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                        <MapPin className="w-4 h-4 text-[#C74E23] shrink-0 mt-0.5" />
                        <span>
                          PNO 292, opposite Silver Oak Banglows, Chinna, Cherlapalli, Hyderabad, Secunderabad, Telangana 500051
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      We may update these policies from time to time to reflect changes in our business, products, technologies, or applicable laws. The latest version will be published on this page with an updated revision date.
                    </p>
                    <p className="text-xs font-bold text-brand-navy">
                      Please review this page periodically to stay informed about our policies and terms.
                    </p>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
