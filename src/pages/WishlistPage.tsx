import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '../stores/useWishlistStore';
import { getProducts } from '../services/firebase/productService';
import type { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts().then((all) => {
      const filtered = all.filter((p) => wishlistIds.includes(p.id));
      setWishlistProducts(filtered);
      setIsLoading(false);
    });
  }, [wishlistIds]);

  return (
    <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-12">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal">Personal Wishlist</h1>
        <p className="text-xs uppercase tracking-luxury text-secondary mt-2">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Curated Piece' : 'Curated Pieces'} Saved
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-border/40" />
              <div className="h-4 bg-border/40 w-3/4" />
            </div>
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-border mx-auto stroke-1" />
          <p className="font-serif text-2xl text-primary font-normal">Your Wishlist is Empty</p>
          <p className="text-xs text-secondary leading-relaxed">
            Save your favorite bespoke garments and accessories while you browse. They will be saved securely for your next visit.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center bg-primary text-surface px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            <span>Discover Collections</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
