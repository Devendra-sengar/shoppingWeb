import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, ChevronDown, Check } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCurrencyStore } from '../../stores/useCurrencyStore';
import { useUIStore } from '../../stores/useUIStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const wishlistCount = useWishlistStore((s) => s.getWishlistCount());
  const { selectedCurrency, availableCurrencies, setCurrency, loadCurrencies } = useCurrencyStore();
  const { openCart, openSearch, openMobileMenu } = useUIStore();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  // Click outside listener for currency dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-store mx-auto px-3 sm:px-6 lg:px-12 h-20 sm:h-24 flex items-center justify-between gap-2">
        
        {/* Left: Mobile hamburger & Desktop Collections nav */}
        <div className="flex items-center space-x-2 sm:space-x-6 shrink-0">
          <button
            onClick={openMobileMenu}
            className="lg:hidden p-2 -ml-1 text-primary hover:text-sand-dark transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/collections"
              className={`text-sm uppercase tracking-subtle hover:text-sand-dark transition-colors ${
                location.pathname === '/collections' ? 'font-semibold text-primary' : 'text-secondary'
              }`}
            >
              Collections
            </Link>
            <Link
              to="/collections/dresses"
              className={`text-sm uppercase tracking-subtle hover:text-sand-dark transition-colors ${
                location.pathname === '/collections/dresses' ? 'font-semibold text-primary' : 'text-secondary'
              }`}
            >
              Dresses
            </Link>
            <Link
              to="/collections/blouses"
              className={`text-sm uppercase tracking-subtle hover:text-sand-dark transition-colors ${
                location.pathname === '/collections/blouses' ? 'font-semibold text-primary' : 'text-secondary'
              }`}
            >
              Blouses
            </Link>
            <Link
              to="/collections/jeans"
              className={`text-sm uppercase tracking-subtle hover:text-sand-dark transition-colors ${
                location.pathname === '/collections/jeans' ? 'font-semibold text-primary' : 'text-secondary'
              }`}
            >
              Jeans
            </Link>
            <Link
              to="/collections/shoes"
              className={`text-sm uppercase tracking-subtle hover:text-sand-dark transition-colors ${
                location.pathname === '/collections/shoes' ? 'font-semibold text-primary' : 'text-secondary'
              }`}
            >
              Shoes
            </Link>
          </nav>
        </div>

        {/* Center: Brand Logo - generously sized and responsive */}
        <div className="flex-1 flex items-center justify-center text-center px-1">
          <Link to="/" className="inline-flex items-center justify-center group py-1" aria-label="ÉLAN Homepage">
            <img
              src="/logo.png"
              alt="ÉLAN — Everyday Elegance"
              className="h-14 sm:h-16 md:h-20 max-w-[170px] sm:max-w-[220px] md:max-w-xs w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Right: Currency, Search, Wishlist, Bag */}
        <div className="flex items-center space-x-1 sm:space-x-4 shrink-0">
          {/* Currency Dropdown - compact on mobile so icons never collapse */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center space-x-0.5 sm:space-x-1 text-[11px] sm:text-xs uppercase tracking-subtle text-secondary hover:text-primary py-1 px-1.5 sm:px-2 rounded transition-colors"
              aria-label="Select store currency"
            >
              <span className="font-medium">{selectedCurrency.symbol}</span>
              <span className="hidden sm:inline">{selectedCurrency.label}</span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-surface border border-border shadow-lift py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {availableCurrencies.map((currency) => (
                  <button
                    key={currency.label}
                    onClick={() => {
                      setCurrency(currency);
                      setIsCurrencyOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-background transition-colors text-primary"
                  >
                    <span>{currency.symbol} {currency.label}</span>
                    {selectedCurrency.label === currency.label && (
                      <Check className="w-3.5 h-3.5 text-sand-dark" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="p-1.5 text-secondary hover:text-primary transition-colors"
            aria-label="Search collection"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-1.5 text-secondary hover:text-primary transition-colors"
            aria-label={`View wishlist (${wishlistCount} items)`}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-sand-dark text-surface text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Bag / Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-1.5 text-primary hover:text-sand-dark transition-colors"
            aria-label={`Open shopping bag (${totalCartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-surface text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-medium">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
