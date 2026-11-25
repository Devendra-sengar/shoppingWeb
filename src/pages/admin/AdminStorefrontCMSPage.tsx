import React, { useState } from 'react';
import { Save, Check, Building, MessageCircle } from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';

export const AdminStorefrontCMSPage: React.FC = () => {
  const { cmsContent, updateCMS } = useAdminStore();
  const [formData, setFormData] = useState({ ...cmsContent });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900 font-medium">Storefront Content & Brand CMS</h1>
          <p className="text-xs text-stone-500 mt-1">
            Edit brand messaging, announcement bar texts, atelier address, and contact numbers without code edits.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-sm space-y-6 text-xs">
        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-800 border-b border-stone-200 pb-2 flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#5B6955]" />
            <span>Brand Identity</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-800 border-b border-stone-200 pb-2">
            Storefront Announcement Bar
          </h3>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Announcement Banner Message</label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded"
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.announcementEnabled}
              onChange={(e) => setFormData({ ...formData, announcementEnabled: e.target.checked })}
              className="rounded text-[#5B6955]"
            />
            <span className="text-stone-700">Display announcement bar on live storefront</span>
          </label>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-800 border-b border-stone-200 pb-2">
            Homepage Hero Campaign
          </h3>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Hero Headline</label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded font-serif text-sm"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Hero Sub-headline</label>
            <textarea
              rows={2}
              value={formData.heroSubheadline}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded"
            />
          </div>
        </div>

        {/* Contact & Concierge Information */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-800 border-b border-stone-200 pb-2 flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-[#5B6955]" />
            <span>Atelier Location & WhatsApp Concierge</span>
          </h3>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Flagship Atelier Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-stone-300 rounded"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">WhatsApp Number (e.g. 9131494302)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Concierge Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-[11px] text-stone-400">
            Changes are saved to local persistent storage immediately.
          </p>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-[#5B6955] text-white px-5 py-2.5 text-xs uppercase tracking-luxury font-medium rounded hover:bg-[#4a5645] transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Updates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
