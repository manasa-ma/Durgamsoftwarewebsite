import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Building2,
  Store,
  Package,
  MessageSquare,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Copy,
  MapPin,
  Navigation,
  Hash,
  LocateFixed,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { openEmailClient } from '../../utils/applicationDispatch';
import { Button } from '../../components/buttons/Button';
import { updatePageMeta } from '../../utils/seo';
import { FollowOnSocial } from '../../components/common/FollowOnSocial';

/**
 * Reverse geocodes coordinates (latitude, longitude) into City/Town, State, and Pincode.
 * Uses OpenStreetMap Nominatim with BigDataCloud as a reliable fallback.
 */
async function reverseGeocode(latitude, longitude) {
  let detectedCity = '';
  let detectedState = '';
  let detectedPincode = '';

  // 1. Try OpenStreetMap Nominatim with a 6-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'DurgamSoft-Demo-App/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      detectedCity =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.city_district ||
        addr.county ||
        '';
      detectedState = addr.state || addr.state_district || '';
      detectedPincode = addr.postcode ? addr.postcode.replace(/\s+/g, '') : '';
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode attempt failed or timed out:', err);
  }

  // 2. Fallback to BigDataCloud client API if City or State could not be resolved
  if (!detectedCity || !detectedState) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (!detectedCity) {
          detectedCity = data.city || data.locality || '';
        }
        if (!detectedState) {
          detectedState = data.principalSubdivision || '';
        }
        if (!detectedPincode && data.postcode) {
          detectedPincode = data.postcode.replace(/\s+/g, '');
        }
      }
    } catch (err) {
      console.warn('BigDataCloud reverse geocode fallback failed:', err);
    }
  }

  return {
    city: detectedCity,
    state: detectedState,
    pincode: detectedPincode,
  };
}

export const BookDemoPage = ({ isLandingPage: propIsLandingPage }) => {
  const location = useLocation();
  const isLandingPage = Boolean(
    propIsLandingPage ||
    location.pathname === '/landingpage' ||
    location.pathname === '/landing-page'
  );

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state including City/Town, State, and Pincode
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    businessType: 'Retail Store',
    interestedProduct: 'Billmaster Billing Software',
    city: '',
    state: '',
    pincode: '',
    message: '',
  });

  // Location detection states
  const [showLocationAlert, setShowLocationAlert] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationAlertError, setLocationAlertError] = useState(null);
  const [locationSuccessNotice, setLocationSuccessNotice] = useState(null);

  useEffect(() => {
    updatePageMeta({
      title: isLandingPage
        ? 'Product Demo & Solutions | Durgam Soft'
        : 'Book a Demo — Request a Free Walkthrough | Durgam Soft',
      description:
        'Schedule a 1-on-1 personalized demo of Billmaster software, POS hardware peripherals, or custom solutions.',
    });
  }, [isLandingPage]);

  // Dismiss location alert on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLocationAlert) {
        setShowLocationAlert(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLocationAlert]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  /**
   * Triggers device geolocation and autofills City/Town, State, and Pincode
   */
  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationAlertError('Geolocation is not supported by your browser. Please enter details manually.');
      setIsDetectingLocation(false);
      return;
    }

    setIsDetectingLocation(true);
    setLocationAlertError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { city, state, pincode } = await reverseGeocode(latitude, longitude);

          setFormData((prev) => ({
            ...prev,
            city: city || prev.city,
            state: state || prev.state,
            pincode: pincode || prev.pincode,
          }));

          const parts = [city, state, pincode].filter(Boolean);
          setLocationSuccessNotice(
            parts.length > 0
              ? `Location detected (${parts.join(', ')}) and filled automatically! You can edit any field.`
              : 'Location detected! Please review and adjust the fields if needed.'
          );
          setIsDetectingLocation(false);
          setShowLocationAlert(false);
        } catch (err) {
          console.error('Error processing coordinates:', err);
          setLocationAlertError('Could not fetch address details automatically. Please enter them manually.');
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.warn('Geolocation permission error:', error);
        let errorMsg = 'Location permission was denied. You can fill in your City, State, and Pincode manually.';
        if (error.code === 1) {
          errorMsg = 'Location permission denied. Please enter your City, State, and Pincode manually.';
        } else if (error.code === 2) {
          errorMsg = 'Location unavailable on your device. Please enter manually.';
        } else if (error.code === 3) {
          errorMsg = 'Location request timed out. Please enter manually.';
        }
        setLocationAlertError(errorMsg);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const emailSubject = isLandingPage
    ? `[Landing Page Inquiry] ${formData.name || 'Client'}${formData.businessName ? ` (${formData.businessName})` : ''}`
    : `[Demo Request] ${formData.interestedProduct || 'Billmaster'} - ${formData.name || 'Client'}${formData.businessName ? ` (${formData.businessName})` : ''}`;

  const formatEmailBody = () => {
    return (
      `Hello Billmaster Team,\n\n` +
      `A new product demo request has been submitted through the website:\n\n` +
      `--------------------------------------------------\n` +
      `Full Name:          ${formData.name}\n` +
      `Phone Number:       ${formData.phone}\n` +
      `Email Address:      ${formData.email}\n` +
      `Business Name:      ${formData.businessName || 'Not specified'}\n` +
      `Business Type:      ${formData.businessType}\n` +
      (isLandingPage ? '' : `Interested Product: ${formData.interestedProduct}\n`) +
      `City / Town:        ${formData.city || 'Not specified'}\n` +
      `State:              ${formData.state || 'Not specified'}\n` +
      `Pincode:            ${formData.pincode}\n` +
      `--------------------------------------------------\n\n` +
      `Message / Requirements:\n` +
      `${formData.message || 'No additional message provided.'}\n\n` +
      `--------------------------------------------------\n` +
      `Destination: contact@billmasterapp.com\n` +
      `Sent via: Durgam Soft / Billmaster Demo Request Page\n`
    );
  };

  const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@billmasterapp.com&su=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(formatEmailBody())}`;

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
    openEmailClient({
      to: 'contact@billmasterapp.com',
      subject: emailSubject,
      body: formatEmailBody(),
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setCopied(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      businessName: '',
      businessType: 'Retail Store',
      interestedProduct: 'Billmaster Billing Software',
      city: '',
      state: '',
      pincode: '',
      message: '',
    });
    setSubmitted(false);
    setLocationSuccessNotice(null);
    setLocationAlertError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] flex flex-col justify-between relative overflow-hidden">
      {/* Location Permission Alert Box Modal */}
      {showLocationAlert && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="location-alert-title"
          aria-describedby="location-alert-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(11,31,58,0.3)] border border-stone-200 relative text-center max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowLocationAlert(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-brand-navy hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close location prompt"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Location Pin Icon */}
            <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-orange-100/80 animate-ping opacity-60" />
              <div className="relative w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-brand-orange shadow-xs">
                <MapPin className="w-8 h-8" />
              </div>
            </div>

            {/* Alert Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#B83E15] border border-orange-200 mb-2.5">
              <span>Location Request</span>
            </div>

            {/* Modal Heading & Description */}
            <h2 id="location-alert-title" className="text-xl sm:text-2xl font-bold text-brand-navy mb-2 tracking-tight">
              Allow Location Access?
            </h2>
            <p id="location-alert-desc" className="text-xs sm:text-sm text-brand-secondary-text mb-6 leading-relaxed">
              Allow DurgamSoft to access your device location to automatically detect and fill your{' '}
              <strong className="text-brand-navy font-semibold">City/Town</strong>,{' '}
              <strong className="text-brand-navy font-semibold">State</strong>, and{' '}
              <strong className="text-brand-navy font-semibold">Pincode</strong>. You can freely edit them anytime.
            </p>

            {/* Error notice if location permission fails */}
            {locationAlertError && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{locationAlertError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleRequestLocation}
                disabled={isDetectingLocation}
                className="w-full justify-center gap-2 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Allow Location</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setShowLocationAlert(false)}
                disabled={isDetectingLocation}
                className="w-full py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
              >
                Enter Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative soft ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[350px] sm:h-[500px] bg-gradient-to-b from-orange-100/40 to-stone-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div>
        <Breadcrumb items={[{ label: isLandingPage ? 'Landing Page' : 'Book a Demo' }]} className="bg-transparent border-b border-stone-200/60" />

        <main className="container-custom py-10 sm:py-14 md:py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* The Form Card with Shadow and Clean White Surface */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-stone-200/80 shadow-[0_20px_60px_-15px_rgba(11,31,58,0.12)] transition-shadow duration-300">
              {/* Form Title & Header */}
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#B83E15] border border-orange-200/70 mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Live Walkthrough</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight mb-2.5">
                  Book a Product Demo
                </h1>
                <p className="text-sm text-brand-secondary-text max-w-md mx-auto leading-relaxed">
                  Fill in your details below and our team will get in touch to schedule a personalized demonstration.
                </p>
              </div>

              {submitted ? (
                /* Success State */
                <div className="space-y-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-navy">
                      {isLandingPage ? 'Inquiry Submitted!' : 'Demo Request Submitted!'}
                    </h2>
                    <p className="text-sm text-brand-secondary-text max-w-md mx-auto leading-relaxed">
                      Thank you <strong className="text-brand-navy">{formData.name}</strong>. Your request{' '}
                      {!isLandingPage && (
                        <>
                          for <strong className="text-brand-navy">{formData.interestedProduct}</strong>{' '}
                        </>
                      )}
                      has been prepared for dispatch to{' '}
                      <strong className="text-[#C74E23]">contact@billmasterapp.com</strong>.
                    </p>
                  </div>

                  {/* Summary of submitted details */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-stone-200 text-left text-xs space-y-2.5 text-stone-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-stone-200/70">
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">NAME</span>
                        <span className="font-semibold text-brand-navy">{formData.name}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">PHONE</span>
                        <span className="font-semibold text-brand-navy">{formData.phone}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-stone-200/70">
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">EMAIL</span>
                        <span className="font-semibold text-brand-navy">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">BUSINESS</span>
                        <span className="font-semibold text-brand-navy">{formData.businessName || '—'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-stone-200/70">
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">BUSINESS TYPE</span>
                        <span className="font-semibold text-brand-navy">{formData.businessType}</span>
                      </div>
                      {!isLandingPage && (
                        <div>
                          <span className="text-stone-400 block text-[11px] font-semibold">PRODUCT</span>
                          <span className="font-semibold text-brand-navy">{formData.interestedProduct}</span>
                        </div>
                      )}
                    </div>
                    {/* Location Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">CITY / TOWN</span>
                        <span className="font-semibold text-brand-navy">{formData.city || '—'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">STATE</span>
                        <span className="font-semibold text-brand-navy">{formData.state || '—'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px] font-semibold">PINCODE</span>
                        <span className="font-semibold text-brand-navy">{formData.pincode || '—'}</span>
                      </div>
                    </div>
                    {formData.message && (
                      <div className="pt-2 border-t border-stone-200/70">
                        <span className="text-stone-400 block text-[11px] font-semibold">MESSAGE</span>
                        <span className="text-brand-navy">{formData.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
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
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Details Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy Demo Details (For Any Email App)</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-stone-500 hover:text-stone-800 font-medium text-xs transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Submit Another Request</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* The Demo Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name and Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="demo-name"
                        className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Name *</span>
                      </label>
                      <input
                        id="demo-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange('name')}
                        placeholder="Your full name"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demo-phone"
                        className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        id="demo-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        placeholder="e.g. +91 83745 88099"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email and Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="demo-email"
                        className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Email *</span>
                      </label>
                      <input
                        id="demo-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange('email')}
                        placeholder="name@company.com"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demo-business-name"
                        className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Business Name{isLandingPage ? '' : ' *'}</span>
                      </label>
                      <input
                        id="demo-business-name"
                        type="text"
                        required={!isLandingPage}
                        value={formData.businessName}
                        onChange={handleChange('businessName')}
                        placeholder="Store or enterprise name"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Row 3: Business Type and (for /book-demo) Interested Product */}
                  <div className={isLandingPage ? 'w-full' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
                    <div>
                      <label
                        htmlFor="demo-business-type"
                        className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Business Type *</span>
                      </label>
                      <select
                        id="demo-business-type"
                        value={formData.businessType}
                        onChange={handleChange('businessType')}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                      >
                        <option value="Retail Store">Retail Store</option>
                        <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                        <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                        <option value="Apparel & Clothing">Apparel & Clothing</option>
                        <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                        <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                        <option value="Other Commercial Business">Other Commercial Business</option>
                      </select>
                    </div>

                    {!isLandingPage && (
                      <div>
                        <label
                          htmlFor="demo-interested-product"
                          className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Interested Product *</span>
                        </label>
                        <select
                          id="demo-interested-product"
                          value={formData.interestedProduct}
                          onChange={handleChange('interestedProduct')}
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                        >
                          <option value="Billmaster Billing Software">Billmaster Billing Software</option>
                          <option value="Billmaster Mobile POS App">Billmaster Mobile POS App</option>
                          <option value="Complete POS & Hardware Bundle">Complete POS & Hardware Bundle</option>
                          <option value="Thermal Printers & Barcode Scanners">Thermal Printers & Barcode Scanners</option>
                          <option value="Custom Software / Web Development">Custom Software / Web Development</option>
                          <option value="Digital Marketing & SEO Services">Digital Marketing & SEO Services</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Location Details - City/Town, State, and Pincode (All Separate Fields) */}
                  <div className="pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Location Details</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRequestLocation}
                        disabled={isDetectingLocation}
                        className="text-xs font-semibold text-[#C74E23] hover:text-[#B83E15] inline-flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
                      >
                        {isDetectingLocation ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Detecting...</span>
                          </>
                        ) : (
                          <>
                            <LocateFixed className="w-3.5 h-3.5" />
                            <span>Auto-detect Location</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Inline Success Notice */}
                    {locationSuccessNotice && (
                      <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{locationSuccessNotice}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocationSuccessNotice(null)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold p-0.5 cursor-pointer"
                          aria-label="Dismiss notice"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Inline Error Notice */}
                    {locationAlertError && !showLocationAlert && (
                      <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{locationAlertError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocationAlertError(null)}
                          className="text-amber-700 hover:text-amber-900 font-bold p-0.5 cursor-pointer"
                          aria-label="Dismiss message"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Separate Fields for City/Town, State, and Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* Field 1: City / Town */}
                      <div>
                        <label
                          htmlFor="demo-city"
                          className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          <span>City / Town</span>
                        </label>
                        <input
                          id="demo-city"
                          type="text"
                          value={formData.city}
                          onChange={handleChange('city')}
                          placeholder="e.g. Hyderabad"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                        />
                      </div>

                      {/* Field 2: State */}
                      <div>
                        <label
                          htmlFor="demo-state"
                          className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-brand-orange" />
                          <span>State</span>
                        </label>
                        <input
                          id="demo-state"
                          type="text"
                          value={formData.state}
                          onChange={handleChange('state')}
                          placeholder="e.g. Telangana"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                        />
                      </div>

                      {/* Field 3: Pincode (Required) */}
                      <div>
                        <label
                          htmlFor="demo-pincode"
                          className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Hash className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Pincode *</span>
                        </label>
                        <input
                          id="demo-pincode"
                          type="text"
                          required
                          value={formData.pincode}
                          onChange={handleChange('pincode')}
                          placeholder="e.g. 500081"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label
                      htmlFor="demo-message"
                      className="text-xs sm:text-sm font-semibold text-brand-navy mb-1.5 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Message</span>
                    </label>
                    <textarea
                      id="demo-message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange('message')}
                      placeholder="Tell us about your billing counters, inventory requirements, or preferred demo time..."
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-border text-base sm:text-sm text-brand-primary-text bg-white hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 space-y-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full gap-2 py-4 rounded-xl font-bold text-base shadow-md hover:shadow-[0_14px_30px_-6px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Request Demo</span>
                    </Button>

                    <p className="text-[11px] text-brand-secondary-text text-center flex items-center justify-center gap-1.5 pt-1">
                      <Mail className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                      <span>
                        Direct delivery to{' '}
                        <strong className="text-brand-navy font-semibold">contact@billmasterapp.com</strong>
                      </span>
                    </p>
                  </div>

                  {/* Direct Contact Note */}
                  <p className="text-[12px] text-brand-secondary-text text-center pt-2">
                    Need instant assistance? Call us directly at{' '}
                    <a href="tel:+918374588099" className="font-semibold text-[#C74E23] hover:underline">
                      +91 83745 88099
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Follow on Social Media Section */}
        <FollowOnSocial />
      </div>
    </div>
  );
};

export default BookDemoPage;
