import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../config/brand';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="ÉLAN — Everyday Elegance"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-secondary text-sm max-w-sm leading-relaxed">
              Curated women's fashion celebrating timeless silhouette, luxurious craftsmanship, and sustainable everyday elegance.
            </p>
            <div className="pt-2 text-xs text-secondary space-y-1">
              <p className="font-medium text-primary">{BRAND_CONFIG.contact.address}</p>
              <p>{BRAND_CONFIG.contact.email} • {BRAND_CONFIG.contact.phone}</p>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-primary">Collections</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/collections/dresses" className="hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link to="/collections/blouses" className="hover:text-primary transition-colors">Blouses</Link></li>
              <li><Link to="/collections/jeans" className="hover:text-primary transition-colors">Denim & Jeans</Link></li>
              <li><Link to="/collections/shoes" className="hover:text-primary transition-colors">Footwear & Shoes</Link></li>
              <li><Link to="/collections" className="hover:text-primary transition-colors">Complete Catalog</Link></li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-primary">Concierge</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/track-order" className="text-amber-900 font-medium hover:underline">Track Your Order</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Atelier</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/admin" className="text-stone-400 hover:text-stone-700 text-xs mt-1 block">Staff Admin Console →</Link></li>
            </ul>
          </div>

          {/* Legal & Demonstration Notice */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-primary">Information</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="pt-2 p-3 bg-background border border-border text-[11px] text-secondary leading-normal rounded">
              {BRAND_CONFIG.policies.demoNotice}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6">
            {BRAND_CONFIG.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
