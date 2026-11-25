import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, X, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { getProducts } from '../services/firebase/productService';
import type { Product } from '../types';
import { useCurrencyStore } from '../stores/useCurrencyStore';
import { getPriceAmount } from '../utils/formatCurrency';

export const CollectionsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const { selectedCurrency } = useCurrencyStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getProducts().then((data) => {
      setAllProducts(data);
      setIsLoading(false);
    });
  }, []);

  // Compute available sizes and colors from actual catalog
  const { availableSizes, availableColors } = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();

    allProducts.forEach((p) => {
      p.attributes.forEach((attr) => {
        if (attr.id.toLowerCase() === 'size') {
          attr.items.forEach((item) => sizes.add(item.value));
        }
        if (attr.id.toLowerCase() === 'color') {
          attr.items.forEach((item) => colors.add(item.id || item.value));
        }
      });
    });

    return {
      availableSizes: Array.from(sizes),
      availableColors: Array.from(colors),
    };
  }, [allProducts]);

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (category && category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false);
    }

    // Size filter
    if (selectedSize !== 'all') {
      result = result.filter((p) =>
        p.attributes.some(
          (attr) =>
            attr.id.toLowerCase() === 'size' &&
            attr.items.some((item) => item.value === selectedSize)
        )
      );
    }

    // Color filter
    if (selectedColor !== 'all') {
      result = result.filter((p) =>
        p.attributes.some(
          (attr) =>
            attr.id.toLowerCase() === 'color' &&
            attr.items.some((item) => item.id === selectedColor || item.value === selectedColor)
        )
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const pa = getPriceAmount(a.prices, selectedCurrency.symbol);
        const pb = getPriceAmount(b.prices, selectedCurrency.symbol);
        return pa - pb;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        const pa = getPriceAmount(a.prices, selectedCurrency.symbol);
        const pb = getPriceAmount(b.prices, selectedCurrency.symbol);
        return pb - pa;
      });
    } else if (sortBy === 'alpha-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'alpha-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [allProducts, category, searchQuery, inStockOnly, selectedSize, selectedColor, sortBy, selectedCurrency]);

  const resetFilters = () => {
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedSize !== 'all' || selectedColor !== 'all' || inStockOnly;

  const currentCategoryTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Collections';

  return (
    <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-secondary mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-border" />
            <span className="text-primary font-medium capitalize">{category}</span>
          </>
        )}
      </nav>

      {/* Category Hero & Title */}
      <div className="mb-10 pb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal">
              {searchQuery ? `Search Results for "${searchQuery}"` : currentCategoryTitle}
            </h1>
            <p className="text-xs uppercase tracking-luxury text-secondary mt-2">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-subtle">
            {['all', 'dresses', 'blouses', 'jeans', 'shoes'].map((catKey) => {
              const isActive = (category || 'all') === catKey;
              return (
                <Link
                  key={catKey}
                  to={catKey === 'all' ? '/collections' : `/collections/${catKey}`}
                  className={`px-3 py-1.5 border transition-colors ${
                    isActive
                      ? 'bg-primary text-surface border-primary'
                      : 'bg-surface text-secondary border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {catKey === 'all' ? 'All' : catKey}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls Bar: Filter trigger & Sort options */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border text-xs">
        
        {/* Desktop Filter Pills */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Size selector */}
          <div className="flex items-center space-x-2">
            <span className="text-secondary font-medium">Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-surface border border-border px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">All Sizes</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Color selector */}
          <div className="flex items-center space-x-2">
            <span className="text-secondary font-medium">Color:</span>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="bg-surface border border-border px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">All Colors</option>
              {availableColors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* In stock toggle */}
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-primary w-3.5 h-3.5"
            />
            <span className="text-secondary">In Stock Only</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center text-secondary hover:text-error transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-surface border border-border text-primary font-medium"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {hasActiveFilters && '• Active'}</span>
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-secondary font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="alpha-asc">Alphabetical: A to Z</option>
            <option value="alpha-desc">Alphabetical: Z to A</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-border/40" />
              <div className="h-4 bg-border/40 w-3/4" />
              <div className="h-3 bg-border/30 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <p className="font-serif text-2xl text-primary">No Garments Found</p>
          <p className="text-xs text-secondary leading-relaxed">
            There are no items matching your selected criteria. Try adjusting your size, color, or search parameters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-block bg-primary text-surface px-6 py-2.5 text-xs uppercase tracking-luxury hover:bg-sand-dark transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-surface shadow-drawer p-6 z-50 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="font-serif text-lg text-primary font-medium">Filter Garments</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-luxury font-medium text-secondary">Size</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`px-3 py-1 text-xs border ${
                      selectedSize === 'all' ? 'bg-primary text-surface border-primary' : 'border-border'
                    }`}
                  >
                    All
                  </button>
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 text-xs border ${
                        selectedSize === s ? 'bg-primary text-surface border-primary' : 'border-border'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-luxury font-medium text-secondary">Color</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor('all')}
                    className={`px-3 py-1 text-xs border ${
                      selectedColor === 'all' ? 'bg-primary text-surface border-primary' : 'border-border'
                    }`}
                  >
                    All
                  </button>
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 text-xs border ${
                        selectedColor === c ? 'bg-primary text-surface border-primary' : 'border-border'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <label className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-primary">In Stock Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-border space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-primary text-surface py-3 text-xs uppercase tracking-luxury font-medium"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full border border-border text-secondary py-2 text-xs uppercase tracking-luxury"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
