import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ChevronDown, X, ArrowRight } from 'lucide-react';
import { Button } from '../buttons/Button';
import { cn } from '../../utils/helpers';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';
import durgamSoftTextLogo from '../../assets/logos/durgamsoft-text-logo.webp';

export const MobileMenu = ({ isOpen, onClose, items }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const location = useLocation();

  // Automatically close mobile menu when navigating to another route or section
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, location.search, location.hash]);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark-navy/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-brand-border">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <img
                src={durgamSoftLogo}
                alt="Durgam Soft"
                className="w-9 h-9 object-contain"
              />
              <img
                src={durgamSoftTextLogo}
                alt="Durgam Soft Private Limited - Innovate | Develop | Deliver"
                width={130}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-brand-secondary-text hover:bg-brand-light-gray hover:text-brand-navy"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-1">
            {items
              .filter((item) => !item.isButton)
              .map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isSubmenuOpen = !!openSubmenus[item.label];

                return (
                  <div key={item.label} className="border-b border-slate-100 last:border-0 pb-1">
                    {hasChildren ? (
                      <div>
                        <div className="flex items-center justify-between py-2.5">
                          <NavLink
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                'text-base font-medium transition-colors',
                                isActive
                                  ? 'text-brand-orange font-semibold'
                                  : 'text-brand-navy hover:text-brand-orange'
                              )
                            }
                          >
                            {item.label}
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.label)}
                            className="p-2 text-slate-400 hover:text-brand-navy"
                            aria-label={`Toggle ${item.label} submenu`}
                          >
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 transition-transform duration-200',
                                isSubmenuOpen ? 'rotate-180 text-brand-orange' : ''
                              )}
                            />
                          </button>
                        </div>

                        {isSubmenuOpen && (
                          <div className="pl-4 pb-2 space-y-1.5 border-l-2 border-brand-light-orange ml-2 mb-2">
                            {item.children?.map((subItem) => (
                              <NavLink
                                key={subItem.title}
                                to={subItem.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  cn(
                                    'block py-1.5 text-sm transition-colors',
                                    subItem.isAction
                                      ? 'text-brand-orange font-semibold flex items-center justify-between pt-2'
                                      : isActive
                                        ? 'text-brand-orange font-semibold'
                                        : 'text-brand-secondary-text hover:text-brand-orange'
                                  )
                                }
                              >
                                <span>{subItem.title}</span>
                                {subItem.isAction && <ArrowRight className="w-3.5 h-3.5" />}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'block py-3 text-base font-medium transition-colors',
                            isActive
                              ? 'text-brand-orange font-semibold'
                              : 'text-brand-navy hover:text-brand-orange'
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </div>
                );
              })}
          </nav>
        </div>

        {/* Action Buttons in Mobile Drawer */}
        <div className="pt-6 border-t border-brand-border flex flex-col gap-3">
          {items
            .filter((item) => item.isButton)
            .map((btn) => (
              <Button
                key={btn.label}
                variant={btn.buttonVariant || 'primary'}
                to={btn.to}
                className="w-full"
                onClick={onClose}
              >
                {btn.label}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};
