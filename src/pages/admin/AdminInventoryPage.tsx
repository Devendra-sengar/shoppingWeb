import React, { useState } from 'react';
import { Search, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';

export const AdminInventoryPage: React.FC = () => {
  const { inventory, adjustStock } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = inventory.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900 font-medium">Boutique Inventory & Stock Control</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time multi-variant inventory balances, reservation locks, and low-stock replenishment alerts.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Product Name or SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#5B6955]"
          />
        </div>
        <p className="text-xs text-stone-500">
          Showing <span className="font-semibold text-stone-800">{filtered.length}</span> SKU items
        </p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-subtle border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">Available Units</th>
                <th className="py-3 px-4 font-semibold">Reserved (In Orders)</th>
                <th className="py-3 px-4 font-semibold">Low-Stock Alert</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                const isLow = item.availableStock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-stone-800">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-900">
                      {item.productName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        isLow ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {item.availableStock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {item.reservedStock} locked
                    </td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center text-amber-700 text-[11px] font-medium space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Reorder needed</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Normal</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => adjustStock(item.id, -1, 'Manual reduction by staff')}
                          className="p-1 border border-stone-300 rounded hover:bg-stone-100 text-stone-600"
                          title="Deduct 1 unit"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 1, 'Manual restock by staff')}
                          className="p-1 border border-stone-300 rounded hover:bg-stone-100 text-stone-600"
                          title="Add 1 unit"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const add = prompt(`Add how many units for ${item.productName}?`, '5');
                            if (add && !isNaN(parseInt(add))) {
                              adjustStock(item.id, parseInt(add), 'Bulk restock arrival');
                            }
                          }}
                          className="ml-2 text-[10px] text-[#5B6955] font-semibold hover:underline"
                        >
                          + Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
