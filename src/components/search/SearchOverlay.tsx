import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { getProducts } from '../../services/firebase/productService';
import type { Product } from '../../types';
import { useCurrencyStore } from '../../stores/useCurrencyStore';
import { formatPrice, getPriceAmount } from '../../utils/formatCurrency';

const RECENT_SEARCHES_KEY = 'elan-recent-searches';

export const SearchOverlay: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchOpen, closeSearch } = useUIStore();
  const { selectedCurrency } = useCurrencyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      getProducts().then(setAllProducts);
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Save to recent
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    closeSearch();
    navigate(`/collections?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectRecent = (term: string) => {
    setSearchTerm(term);
    closeSearch();
    navigate(`/collections?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      />

      <div className="fixed inset-x-0 top-0 bg-surface shadow-lift p-6 sm:p-10 z-50 animate-in slide-in-from-top duration-250 border-b border-border">
        <div className="max-w-4xl mx-auto">
          {/* Header & Input */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center mr-4">
              <Search className="w-6 h-6 text-secondary mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dresses, blouses, denim, footwear..."
                autoFocus
                className="w-full text-lg sm:text-2xl font-serif text-primary placeholder:text-secondary/50 focus:outline-none bg-transparent"
              />
            </form>
            <button
              onClick={closeSearch}
              className="p-2 text-secondary hover:text-primary transition-colors"
              aria-label="Close search overlay"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Results & Quick categories */}
          <div className="py-6 max-h-[60vh] overflow-y-auto">
            {searchTerm.trim() ? (
              <div>
                <p className="text-xs uppercase tracking-luxury text-secondary mb-4">
                  Matching Items ({filteredProducts.length})
                </p>

                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-secondary py-6">
                    No garments found matching "{searchTerm}". Try searching for dresses, blouses, or silk.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.slice(0, 4).map((p) => {
                      const price = getPriceAmount(p.prices, selectedCurrency.symbol);
                      return (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={closeSearch}
                          className="group flex flex-col space-y-2 p-2 hover:bg-background transition-colors"
                        >
                          <div className="aspect-[3/4] bg-background overflow-hidden">
                            <img
                              src={p.gallery[0]}
                              alt={p.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <p className="text-xs font-medium text-primary line-clamp-1 group-hover:text-sand-dark">
                            {p.name}
                          </p>
                          <p className="text-xs text-secondary font-semibold">
                            {formatPrice(price, selectedCurrency.symbol)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-luxury text-secondary mb-3">Recent Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSelectRecent(term)}
                          className="text-xs px-3 py-1.5 bg-background hover:bg-sand/20 border border-border text-primary transition-colors rounded-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Collections */}
                <div>
                  <p className="text-xs uppercase tracking-luxury text-secondary mb-3">Popular Categories</p>
                  <div className="space-y-2 text-sm">
                    <Link
                      to="/collections/dresses"
                      onClick={closeSearch}
                      className="flex items-center justify-between text-secondary hover:text-primary py-1 border-b border-border/40"
                    >
                      <span>Silk Dresses & Gowns</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/collections/blouses"
                      onClick={closeSearch}
                      className="flex items-center justify-between text-secondary hover:text-primary py-1 border-b border-border/40"
                    >
                      <span>Tailored Blouses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/collections/jeans"
                      onClick={closeSearch}
                      className="flex items-center justify-between text-secondary hover:text-primary py-1 border-b border-border/40"
                    >
                      <span>Japanese Denim</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/collections/shoes"
                      onClick={closeSearch}
                      className="flex items-center justify-between text-secondary hover:text-primary py-1 border-b border-border/40"
                    >
                      <span>Italian Leather Shoes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
