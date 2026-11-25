import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <span className="text-xs uppercase tracking-luxury text-sand-dark font-medium">404 Page</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-primary font-normal">Page Not Found</h1>
        <p className="text-xs text-secondary leading-relaxed">
          The requested page could not be located. It may have moved or been updated in our latest collection.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-surface px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-border text-primary px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:border-primary transition-colors"
          >
            <span>Browse Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
