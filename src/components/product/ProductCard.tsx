import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useCurrencyStore } from '../../stores/useCurrencyStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useUIStore } from '../../stores/useUIStore';
import { formatPrice, getPriceAmount } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { selectedCurrency } = useCurrencyStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openQuickShop } = useUIStore();

  const isFavorite = isInWishlist(product.id);
  const price = getPriceAmount(product.prices, selectedCurrency.symbol);
  const primaryImage = product.gallery[0] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.gallery[1] || primaryImage;
  const isOutOfStock = product.inStock === false;

  return (
    <div className="group relative flex flex-col">
      {/* 3:4 Aspect Ratio Image Container */}
      <div className="relative aspect-[3/4] w-full bg-background overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          {/* Primary image */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
              secondaryImage !== primaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform duration-700'
            }`}
            loading="lazy"
          />

          {/* Secondary hover image */}
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternative perspective`}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          )}
        </Link>

        {/* Out of Stock overlay badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-surface/90 text-primary text-[10px] uppercase tracking-luxury font-medium py-1 px-2.5">
            Out of Stock
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur-sm rounded-full transition-colors ${
            isFavorite ? 'text-sand-dark' : 'text-primary hover:text-sand-dark'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Shop Action Bar on hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => openQuickShop(product)}
              className="w-full bg-surface/95 backdrop-blur-sm text-primary py-2.5 text-xs uppercase tracking-luxury font-medium shadow-subtle hover:bg-primary hover:text-surface transition-colors flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick Shop</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-3.5 pb-2 flex flex-col space-y-1">
        <Link
          to={`/product/${product.id}`}
          className="text-xs sm:text-sm font-medium text-primary hover:text-sand-dark transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs font-semibold text-secondary">
          {formatPrice(price, selectedCurrency.symbol)}
        </p>
      </div>
    </div>
  );
};
