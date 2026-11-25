import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { getProducts } from '../services/firebase/productService';
import type { Product } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts().then((products) => {
      setFeaturedProducts(products.slice(0, 4));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28">
      
      {/* 1. HERO CAMPAIGN */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-primary text-surface overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="ÉLAN Spring Summer Campaign"
            className="w-full h-full object-cover object-center opacity-70 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-20 space-y-6">
          <p className="text-xs sm:text-sm uppercase tracking-luxury text-sand-light font-medium">
            Autumn / Winter Haute Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-luxury leading-tight">
            Everyday Elegance
          </h1>
          <p className="text-sm sm:text-base text-surface/80 max-w-xl mx-auto font-light leading-relaxed">
            Masterfully tailored silhouettes in pure mulberry silk, Japanese denim, and Tuscan leather. Designed to endure seasons, not trends.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-surface text-primary px-8 py-4 text-xs uppercase tracking-luxury hover:bg-sand-light transition-colors font-medium"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/collections/dresses"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-surface/50 text-surface px-8 py-4 text-xs uppercase tracking-luxury hover:bg-surface/10 transition-colors font-medium"
            >
              <span>Silk Dresses</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-store mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-luxury text-secondary font-medium">Curated Wardrobe</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-primary">Shop by Silhouette</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dresses */}
          <Link
            to="/collections/dresses"
            className="group relative aspect-[3/4] bg-background overflow-hidden block"
          >
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
              alt="Dresses"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-6 text-surface">
              <span className="text-xs uppercase tracking-luxury text-sand-light">01</span>
              <h3 className="font-serif text-2xl font-medium">Dresses</h3>
              <p className="text-xs text-surface/80 mt-1 flex items-center group-hover:translate-x-1 transition-transform">
                <span>View garments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </Link>

          {/* Blouses */}
          <Link
            to="/collections/blouses"
            className="group relative aspect-[3/4] bg-background overflow-hidden block"
          >
            <img
              src="https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80"
              alt="Blouses"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-6 text-surface">
              <span className="text-xs uppercase tracking-luxury text-sand-light">02</span>
              <h3 className="font-serif text-2xl font-medium">Blouses</h3>
              <p className="text-xs text-surface/80 mt-1 flex items-center group-hover:translate-x-1 transition-transform">
                <span>View garments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </Link>

          {/* Jeans */}
          <Link
            to="/collections/jeans"
            className="group relative aspect-[3/4] bg-background overflow-hidden block"
          >
            <img
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
              alt="Jeans"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-6 text-surface">
              <span className="text-xs uppercase tracking-luxury text-sand-light">03</span>
              <h3 className="font-serif text-2xl font-medium">Denim & Jeans</h3>
              <p className="text-xs text-surface/80 mt-1 flex items-center group-hover:translate-x-1 transition-transform">
                <span>View garments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </Link>

          {/* Shoes */}
          <Link
            to="/collections/shoes"
            className="group relative aspect-[3/4] bg-background overflow-hidden block"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
              alt="Shoes"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex flex-col justify-end p-6 text-surface">
              <span className="text-xs uppercase tracking-luxury text-sand-light">04</span>
              <h3 className="font-serif text-2xl font-medium">Footwear</h3>
              <p className="text-xs text-surface/80 mt-1 flex items-center group-hover:translate-x-1 transition-transform">
                <span>View garments</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION */}
      <section className="max-w-store mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border">
          <div>
            <span className="text-xs uppercase tracking-luxury text-secondary font-medium">The Atelier Edit</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-primary mt-1">Featured Creations</h2>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase tracking-luxury text-primary hover:text-sand-dark flex items-center mt-3 sm:mt-0 font-medium transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-border/40" />
                <div className="h-4 bg-border/40 w-3/4" />
                <div className="h-3 bg-border/30 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. EDITORIAL CAMPAIGN SPLIT */}
      <section className="max-w-store mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface border border-border p-6 sm:p-10 lg:p-16">
          <div className="lg:col-span-7 aspect-[4/3] bg-background overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
              alt="Editorial campaign"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-luxury text-secondary font-medium">Sustainable Atelier</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal leading-tight">
              Quiet Luxury, Consciously Crafted
            </h2>
            <p className="text-sm text-secondary leading-relaxed">
              Every ÉLAN creation begins with uncompromising raw materials. From GOTS-certified mulberry silk to non-toxic vegetable-tanned leather, we work exclusively with certified European family mills.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center text-xs uppercase tracking-luxury font-semibold text-primary border-b border-primary pb-1 hover:text-sand-dark hover:border-sand-dark transition-colors"
              >
                <span>Read Our Atelier Manifesto</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOPPING INFORMATION & GUARANTEES */}
      <section className="max-w-store mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-border py-12 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-surface border border-border rounded-full text-primary">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base text-primary font-medium">Complimentary Delivery</h3>
              <p className="text-xs text-secondary mt-1">Available on all demonstration orders exceeding $250.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-surface border border-border rounded-full text-primary">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base text-primary font-medium">Considered Exchanges</h3>
              <p className="text-xs text-secondary mt-1">14-day return window for unworn garments in original packaging.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-surface border border-border rounded-full text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base text-primary font-medium">Atelier Authenticity</h3>
              <p className="text-xs text-secondary mt-1">Verified handcrafted origins with artisan provenance documentation.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
