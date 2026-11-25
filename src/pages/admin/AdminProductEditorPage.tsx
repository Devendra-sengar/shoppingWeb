import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Check, UploadCloud } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore/lite';
import { db } from '../../services/firebase/firebase';
import type { Product, Attribute } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

export const AdminProductEditorPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'dresses' | 'blouses' | 'jeans' | 'shoes'>('dresses');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  
  // Prices
  const [priceInr, setPriceInr] = useState<number>(19500);
  const [priceUsd, setPriceUsd] = useState<number>(240);
  const [priceEur, setPriceEur] = useState<number>(220);

  // Gallery
  const [galleryUrls, setGalleryUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Attributes (Sizes & Colors)
  const [sizes, setSizes] = useState<string[]>(['XS', 'S', 'M', 'L']);
  const [newSize, setNewSize] = useState('');
  const [colors, setColors] = useState<string[]>(['Ivory', 'Midnight Black']);
  const [newColor, setNewColor] = useState('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setGalleryUrls([...galleryUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, idx) => idx !== index));
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (galleryUrls.length === 0) {
      setErrorMsg('At least one gallery image URL is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const productId = 'elan-' + category.slice(0, 2) + '-' + Date.now().toString().slice(-6);

    const attributes: Attribute[] = [];
    if (sizes.length > 0) {
      attributes.push({
        id: 'Size',
        name: 'Size',
        items: sizes.map((s) => ({ id: s, value: s })),
      });
    }
    if (colors.length > 0) {
      attributes.push({
        id: 'Color',
        name: 'Color',
        items: colors.map((c) => ({ id: c, value: c })),
      });
    }

    const newProduct: Product = {
      id: productId,
      name: name.trim(),
      category,
      inStock,
      gallery: galleryUrls,
      description: description.trim() || `<p>${name.trim()} - crafted with exquisite silhouette and luxury atelier materials.</p>`,
      attributes,
      prices: [
        { currency: { symbol: '₹', label: 'INR' }, amount: Number(priceInr) },
        { currency: { symbol: '$', label: 'USD' }, amount: Number(priceUsd) },
        { currency: { symbol: '€', label: 'EUR' }, amount: Number(priceEur) },
      ],
    };

    // 1. Add to local memory catalog so storefront immediately reflects it
    MOCK_PRODUCTS.unshift(newProduct);

    // 2. Persist to Cloud Firestore if connected
    if (db) {
      try {
        const prodDoc = doc(db, 'products', productId);
        await setDoc(prodDoc, newProduct);
        console.log(`[ProductEditor] Product ${productId} saved to Firestore.`);
      } catch (err: any) {
        console.warn('[ProductEditor] Firestore write failed:', err);
      }
    }

    setIsSaving(false);
    setSuccessMsg(`"${name}" created successfully! Redirecting to products list...`);
    setTimeout(() => {
      navigate('/admin/products');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="p-1.5 bg-white border border-stone-200 rounded text-stone-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-stone-900 font-medium">Add New Garment to Catalog</h1>
            <p className="text-xs text-stone-500">Configure imagery, multi-currency prices, and variant attributes.</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Main Info & Imagery */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 text-xs">
              <h2 className="font-semibold text-stone-900 uppercase tracking-subtle text-xs border-b border-stone-100 pb-2">
                1. Garment Details
              </h2>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aurelia Silk Evening Gown"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#5B6955] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Collection Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded"
                  >
                    <option value="dresses">Dresses (Haute Couture & Evening)</option>
                    <option value="blouses">Blouses (Pure Mulberry Silk)</option>
                    <option value="jeans">Denim & Jeans (Japanese Selvedge)</option>
                    <option value="shoes">Shoes & Footwear (Tuscan Leather)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Inventory Availability</label>
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-[#5B6955]"
                    />
                    <span className="text-stone-700">Available in stock for purchase</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Description (HTML / Markdown supported)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="<p>Tailored from 100% pure silk...</p>"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#5B6955]"
                />
              </div>
            </div>

            {/* Gallery Imagery */}
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 text-xs">
              <h2 className="font-semibold text-stone-900 uppercase tracking-subtle text-xs border-b border-stone-100 pb-2">
                2. Imagery & Gallery ({galleryUrls.length})
              </h2>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (Unsplash, Cloudinary, Firebase Storage)..."
                  className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-stone-800 text-white px-3 py-2 rounded text-xs font-medium hover:bg-black transition-colors"
                >
                  + Add URL
                </button>
              </div>

              {/* Gallery Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded border border-stone-200 overflow-hidden aspect-[3/4] bg-stone-100">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Pricing & Variant Attributes */}
          <div className="space-y-6">
            
            {/* Multi-currency Pricing */}
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 text-xs">
              <h2 className="font-semibold text-stone-900 uppercase tracking-subtle text-xs border-b border-stone-100 pb-2">
                3. Multi-Currency Pricing
              </h2>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Price in Indian Rupee (₹ INR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-medium">₹</span>
                  <input
                    type="number"
                    required
                    value={priceInr}
                    onChange={(e) => setPriceInr(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Price in US Dollar ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-medium">$</span>
                  <input
                    type="number"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Price in Euro (€ EUR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-stone-400 font-medium">€</span>
                  <input
                    type="number"
                    value={priceEur}
                    onChange={(e) => setPriceEur(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Variant Attributes: Sizes & Colors */}
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 text-xs">
              <h2 className="font-semibold text-stone-900 uppercase tracking-subtle text-xs border-b border-stone-100 pb-2">
                4. Variant Attributes
              </h2>

              {/* Sizes */}
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Available Sizes</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {sizes.map((s) => (
                    <span key={s} className="inline-flex items-center space-x-1 px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-800">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveSize(s)} className="text-stone-400 hover:text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size (e.g. XL)..."
                    className="flex-1 p-1.5 bg-stone-50 border border-stone-200 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-2.5 py-1 rounded text-xs font-medium"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Available Colorways</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {colors.map((c) => (
                    <span key={c} className="inline-flex items-center space-x-1 px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-800">
                      <span>{c}</span>
                      <button type="button" onClick={() => handleRemoveColor(c)} className="text-stone-400 hover:text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color (e.g. Sage Green)..."
                    className="flex-1 p-1.5 bg-stone-50 border border-stone-200 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-2.5 py-1 rounded text-xs font-medium"
                  >
                    + Add
                  </button>
                </div>
              </div>

            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#5B6955] hover:bg-[#4a5645] text-white py-3 rounded text-xs uppercase tracking-luxury font-medium transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSaving ? 'Publishing to Catalog...' : 'Publish Product to Store'}</span>
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
