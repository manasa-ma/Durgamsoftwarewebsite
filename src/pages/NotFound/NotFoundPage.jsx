import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, ShoppingBag, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/buttons/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#FAF7F2]/60">
      <div className="max-w-2xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-semibold tracking-wide uppercase mb-6">
          <span>Error 404</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>Page Not Found</span>
        </div>

        {/* Big Code */}
        <h1 className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tight mb-4 select-none">
          4<span className="text-orange-500">0</span>4
        </h1>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-4">
          Oops! We couldn't find that page
        </h2>

        {/* Description */}
        <p className="text-base text-slate-600 max-w-lg mx-auto mb-10 leading-relaxed">
          The link you followed may be broken, or the page may have been moved or removed.
          You can return to our homepage or explore our main sections below.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button to="/" variant="primary" size="lg" className="gap-2 shadow-md">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Page
          </Button>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-left">
            Popular Destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              to="/products"
              className="group p-3.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Products
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">Billmaster & POS</p>
              </div>
            </Link>

            <Link
              to="/careers"
              className="group p-3.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Careers
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">Join our growing team</p>
              </div>
            </Link>

            <Link
              to="/contact"
              className="group p-3.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Contact Us
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">Get help & support</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
