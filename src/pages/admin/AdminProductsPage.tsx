import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import type { Product, Price } from '../../types';
import { formatPrice } from '../../utils/formatCurrency';
import { SeedFirestoreTool } from '../../components/admin/SeedFirestoreTool';

export const AdminProductsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Firebase Cloud Sync Panel */}
      <SeedFirestoreTool />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900 font-medium">Atelier Catalog Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage multi-currency prices, collections, imagery, and product variants across all categories.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center space-x-1.5 bg-[#5B6955] text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-[#4a5645] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-subtle border-b border-stone-200">
            <tr>
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Price (INR)</th>
              <th className="py-3 px-4 font-semibold">Available Attributes</th>
              <th className="py-3 px-4 font-semibold text-right">Storefront Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {MOCK_PRODUCTS.map((prod: Product) => (
              <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.gallery[0]}
                      alt={prod.name}
                      className="w-10 h-12 object-cover rounded bg-stone-100"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{prod.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">ID: {prod.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 capitalize text-stone-600">
                  {prod.category}
                </td>
                <td className="py-3.5 px-4 font-medium text-stone-900">
                  {formatPrice(prod.prices.find((p: Price) => p.currency.symbol === '₹')?.amount || 0, '₹')}
                </td>
                <td className="py-3.5 px-4 text-stone-500">
                  {prod.attributes.map((a: any) => a.name).join(', ')}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/product/${prod.id}`}
                    target="_blank"
                    className="inline-flex items-center space-x-1 text-xs text-[#5B6955] hover:underline font-medium"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
