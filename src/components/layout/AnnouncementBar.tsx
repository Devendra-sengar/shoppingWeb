import React from 'react';
import { BRAND_CONFIG } from '../../config/brand';

export const AnnouncementBar: React.FC = () => {
  if (!BRAND_CONFIG.announcement.enabled) return null;

  return (
    <div className="bg-primary text-surface text-xs uppercase tracking-luxury py-2 px-4 text-center font-medium">
      {BRAND_CONFIG.announcement.message}
    </div>
  );
};
