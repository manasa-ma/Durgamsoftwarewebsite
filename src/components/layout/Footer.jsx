import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../data/navigation';
import { COMPANY_NAME } from '../../utils/constants';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';
import durgamSoftTextLogoWhite from '../../assets/logos/durgamsoft-text-logo-white.webp';
import { FacebookIcon, InstagramIcon } from '../common/FollowOnSocial';

export const Footer = () => {
  const location = useLocation();

  const getEmail = () => {
    const path = location.pathname;
    if (path.startsWith('/careers') || path.startsWith('/jobs')) {
      return 'careers@durgamsoft.com';
    }
    if (path.startsWith('/contact') || path.startsWith('/products/billmaster')) {
      return 'contact@billmasterapp.com';
    }
    return 'info@durgamsoft.com';
  };

  const email = getEmail();
  const navLinks = NAVIGATION_ITEMS.filter((item) => !item.isButton);

  return (
    <footer className="bg-brand-dark-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 pb-12 border-b border-slate-800">
          {/* Company branding */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <img
                src={durgamSoftLogo}
                alt={COMPANY_NAME}
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <img
                src={durgamSoftTextLogoWhite}
                alt="Durgam Soft Private Limited - Innovate | Develop | Deliver"
                width={162}
                height={40}
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </Link>

            <div className="space-y-2.5 text-xs text-slate-400 mb-6">
              <div>
                <span className="font-semibold text-slate-300">Address: </span>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Durgam%20Soft%20Pvt.%20Ltd.%2C%20PNO%20292%2C%20opposite%20Silver%20Oak%20Banglows%2C%20Chinna%2C%20Cherlapalli%2C%20Hyderabad%2C%20Secunderabad%2C%20Telangana%20500051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors leading-relaxed inline"
                >
                  PNO 292, opposite Silver Oak Banglows, Chinna, Cherlapalli, Hyderabad, Secunderabad, Telangana 500051
                </a>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Email: </span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-brand-orange transition-colors"
                >
                  {email}
                </a>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Phone: </span>
                <a
                  href="tel:+918374588099"
                  className="hover:text-brand-orange transition-colors"
                >
                  83745 88099
                </a>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Products
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-brand-orange transition-colors">
                  Our Products
                </Link>
              </li>
            </ul>

            {/* Social Media App Icons below Our Products */}
            <div className="flex items-center gap-2.5 mt-4">
              <a
                href="https://www.facebook.com/people/Billmaster/61569207380121/?rdid=vTqZqnHUQO3l293t&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1VVSTddrSZ%2F"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Billmaster on Facebook"
                title="Facebook"
                className="w-8 h-8 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 block"
              >
                <FacebookIcon className="w-full h-full" />
              </a>
              <a
                href="https://www.instagram.com/billmasterapp?dlrf=MTdubDB1d3p1dDQ5OA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Billmaster on Instagram"
                title="Instagram"
                className="w-8 h-8 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300 block"
              >
                <InstagramIcon className="w-full h-full" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Services
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-brand-orange transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link
                  to="/services/web-development"
                  className="hover:text-brand-orange transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/mobile-development"
                  className="hover:text-brand-orange transition-colors"
                >
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/desktop-development"
                  className="hover:text-brand-orange transition-colors"
                >
                  Desktop Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/services/digital-marketing"
                  className="hover:text-brand-orange transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </p>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/book-demo"
                  className="hover:text-orange-300 transition-colors font-semibold text-[#FB923C]"
                >
                  Book a Demo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Legal &amp; Policies
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/legal#privacy-policy"
                  className="hover:text-brand-orange transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal#terms-and-conditions"
                  className="hover:text-brand-orange transition-colors"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/legal#cookie-policy"
                  className="hover:text-brand-orange transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal#disclaimer"
                  className="hover:text-brand-orange transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400">
            <Link to="/legal#privacy-policy" className="hover:text-brand-orange transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link to="/legal#terms-and-conditions" className="hover:text-brand-orange transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link to="/legal" className="hover:text-brand-orange transition-colors">
              Legal Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
