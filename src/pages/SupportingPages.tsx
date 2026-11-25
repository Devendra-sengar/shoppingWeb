import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-luxury text-sand-dark font-medium">Atelier Story</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-primary font-normal">Timeless Silhouette, Modern Spirit</h1>
        <p className="text-sm text-secondary max-w-xl mx-auto leading-relaxed">
          Founded on the conviction that women's wardrobe should be an enduring expression of quiet confidence and unforced elegance.
        </p>
      </div>

      <div className="aspect-[16/9] bg-background overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
          alt="Atelier craftsmanship"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-secondary leading-relaxed pt-4">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-primary font-normal">Our Craftsmanship Ethos</h2>
          <p>
            At ÉLAN, we reject ephemeral seasonal cycles. Each silhouette undergoes months of iterative fitting, fabric testing, and proportion tuning before a single garment enters our collection.
          </p>
          <p>
            We collaborate exclusively with heritage weaving houses across Biella, Como, and Okayama, safeguarding traditional textile arts while observing rigorous environmental benchmarks.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-primary font-normal">Everyday Elegance</h2>
          <p>
            Elegance is not reserved for gala halls. It lives in the weight of an organic silk slip dress worn with an oversized knit, the drape of wide-leg selvedge denim, and the clean architecture of handcrafted leather mules.
          </p>
          <p>
            Our pieces are designed to travel effortlessly from morning conferences to evening aperitifs, developing character with every wearing.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-luxury text-sand-dark font-medium">Concierge</span>
        <h1 className="font-serif text-4xl text-primary font-normal">Connect With Our Atelier</h1>
        <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
          Whether you seek private sizing counsel or styling advice, our dedicated concierge team is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface border border-border p-8">
        <div className="flex items-start space-x-3.5">
          <Mail className="w-5 h-5 text-sand-dark mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="uppercase tracking-luxury font-medium text-primary block">Email Inquiries</span>
            <p className="text-secondary">{BRAND_CONFIG.contact.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <Phone className="w-5 h-5 text-sand-dark mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="uppercase tracking-luxury font-medium text-primary block">Telephone Concierge</span>
            <p className="text-secondary">{BRAND_CONFIG.contact.phone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <MapPin className="w-5 h-5 text-sand-dark mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="uppercase tracking-luxury font-medium text-primary block">Flagship Atelier</span>
            <p className="text-secondary">{BRAND_CONFIG.contact.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <Clock className="w-5 h-5 text-sand-dark mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="uppercase tracking-luxury font-medium text-primary block">Consultation Hours</span>
            <p className="text-secondary">{BRAND_CONFIG.contact.hours}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'How do I choose the correct garment sizing?',
      a: 'Each product details page displays specific measurements and model proportions. Because our fabrics are naturally cut on the bias (especially our 19mm silk dresses), we recommend choosing your standard size for a relaxed drape or sizing down for a closer contour.',
    },
    {
      q: 'What shipping options are available?',
      a: 'All orders over $250 receive complimentary express courier delivery. Deliveries are packaged in our signature unbleached linen garment bags and rigid protective gift boxes.',
    },
    {
      q: 'What is your returns policy?',
      a: 'We accept returns of unworn, unwashed garments with all security tags attached within 14 calendar days of receipt.',
    },
    {
      q: 'How should I care for my silk and cashmere pieces?',
      a: 'We advise eco-conscious professional dry cleaning or delicate hand washing with pH-neutral silk detergent in cold water. Lay flat to dry away from direct sunlight.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-4xl text-primary font-normal">Frequently Asked Questions</h1>
        <p className="text-xs uppercase tracking-luxury text-secondary">Concierge Guidance</p>
      </div>

      <div className="divide-y divide-border border-t border-b border-border">
        {faqs.map((faq, i) => (
          <div key={i} className="py-6 space-y-2">
            <h3 className="font-serif text-lg text-primary font-medium">{faq.q}</h3>
            <p className="text-xs text-secondary leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 text-xs text-secondary leading-relaxed">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal mb-2">Shipping & Returns</h1>
        <p className="uppercase tracking-luxury text-[10px]">Policy Overview</p>
      </div>

      <div className="p-4 bg-background border border-border space-y-2">
        <span className="font-semibold text-primary block">Demonstration Notice:</span>
        <p>
          This storefront operates in a demonstration client mode. All delivery policies described herein represent illustrative retail parameters for client review.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-xl text-primary font-medium">Complimentary Global Delivery</h2>
        <p>Orders exceeding $250 receive complimentary express courier shipping with end-to-end tracking.</p>
        <p>Standard delivery arrives within 3 to 5 business days across North America and Europe.</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="font-serif text-xl text-primary font-medium">14-Day Considered Returns</h2>
        <p>Garments may be returned in their original condition within 14 days of delivery. All tags and seal ribbons must remain intact.</p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 text-xs text-secondary leading-relaxed">
      <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">Privacy Policy</h1>
      <p className="text-primary font-medium">Effective Date: Demonstration Storefront Edition</p>
      <p>
        At ÉLAN, we respect your privacy. This demonstration storefront does not persist personal financial data or transmit unencrypted payment records. Guest checkout details are stored locally in the current browser session only to simulate order receipt generation.
      </p>
      <p>
        No personal information collected during demonstration checkout is sold, shared, or transferred to third-party commercial marketing networks.
      </p>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 text-xs text-secondary leading-relaxed">
      <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">Terms of Service</h1>
      <p className="text-primary font-medium">Demonstration Terms</p>
      <p>
        Welcome to the ÉLAN demonstration storefront. By browsing this website, you acknowledge that this platform is an architectural demonstration of a premium fashion e-commerce storefront.
      </p>
      <p>
        Orders placed do not constitute binding commercial transactions, and no actual products will be manufactured or dispatched based on orders submitted through this demonstration.
      </p>
    </div>
  );
};
