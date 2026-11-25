import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { useUIStore } from '../../stores/useUIStore';

export const MobileMenu: React.FC = () => {
  const location = useLocation();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={closeMobileMenu}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface shadow-drawer flex flex-col justify-between p-6 z-50 animate-in slide-in-from-left duration-250">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <Link to="/" onClick={closeMobileMenu} className="inline-block">
              <img
                src="/logo.png"
                alt="ÉLAN — Everyday Elegance"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-1.5 text-secondary hover:text-primary transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-6 space-y-4">
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between text-base py-2 uppercase tracking-subtle border-b border-border/40 ${
                  location.pathname === item.href ? 'font-semibold text-primary' : 'text-secondary'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-border" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="pt-6 border-t border-border text-xs text-secondary space-y-2">
          <p className="font-medium text-primary">Atelier Concierge</p>
          <p>{BRAND_CONFIG.contact.email}</p>
          <p>{BRAND_CONFIG.contact.phone}</p>
        </div>
      </div>
    </div>
  );
};
