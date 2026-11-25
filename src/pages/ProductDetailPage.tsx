import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronRight, Check, ChevronDown, Plus, Minus, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import { getProductById, getProductsByCategory } from '../services/firebase/productService';
import type { Product, SelectedAttribute } from '../types';
import { useCartStore } from '../stores/useCartStore';
import { useCurrencyStore } from '../stores/useCurrencyStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useUIStore } from '../stores/useUIStore';
import { formatPrice, getPriceAmount } from '../utils/formatCurrency';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  const { addToCart } = useCartStore();
  const { selectedCurrency } = useCurrencyStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { showToast, openCart } = useUIStore();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    getProductById(id).then((item) => {
      setProduct(item);
      setSelectedAttributes([]);
      setActiveImageIndex(0);
      setQuantity(1);
      setIsLoading(false);

      if (item) {
        getProductsByCategory(item.category).then((related) => {
          setRelatedProducts(related.filter((r) => r.id !== item.id).slice(0, 4));
        });
      }
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-[3/4] bg-border/40" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-border/40 w-1/4" />
            <div className="h-8 bg-border/40 w-3/4" />
            <div className="h-6 bg-border/40 w-1/3" />
            <div className="h-20 bg-border/30 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <p className="font-serif text-3xl text-primary font-normal">Garment Not Found</p>
        <p className="text-xs text-secondary leading-relaxed">
          The requested creation may have retired from our collection or the link is incorrect.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center text-xs uppercase tracking-luxury bg-primary text-surface px-6 py-3 hover:bg-sand-dark transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>Return to Collections</span>
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const price = getPriceAmount(product.prices, selectedCurrency.symbol);
  const isOutOfStock = product.inStock === false;

  // Validation: Every attribute defined in product must have a selected value
  const allAttributesSelected =
    product.attributes.length === 0 ||
    product.attributes.every((attr) =>
      selectedAttributes.some((s) => s.attributeId === attr.id)
    );

  const handleSelectAttribute = (attributeId: string, attributeValue: string) => {
    setSelectedAttributes((prev) => {
      const filtered = prev.filter((a) => a.attributeId !== attributeId);
      return [...filtered, { attributeId, attributeValue }];
    });
  };

  const handleAddToCart = () => {
    if (!allAttributesSelected || isOutOfStock) return;
    addToCart(product, selectedAttributes, quantity);
    showToast(`Added ${quantity} × ${product.name} to your shopping bag.`);
    openCart();
  };

  const sanitizedDescription = DOMPurify.sanitize(product.description || '');

  return (
    <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-16">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-secondary">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <Link to={`/collections/${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-border" />
        <span className="text-primary font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left: Gallery (Thumbnails + Main) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails list */}
          {product.gallery.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 sm:max-h-[750px] flex-shrink-0">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[3/4] w-16 sm:w-full bg-background overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image thumbnail ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Showcase Image */}
          <div className="flex-1 aspect-[3/4] bg-background overflow-hidden relative group">
            <img
              src={product.gallery[activeImageIndex] || product.gallery[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-surface/90 text-primary text-xs uppercase tracking-luxury font-medium py-1.5 px-3">
                Sold Out
              </div>
            )}
          </div>

        </div>

        {/* Right: Details & Purchase Column */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          <div>
            <span className="text-xs uppercase tracking-luxury text-sand-dark font-semibold">
              Atelier Garment • {product.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-primary mt-1">
              {product.name}
            </h1>
            <p className="font-serif text-2xl text-primary font-medium mt-3">
              {formatPrice(price, selectedCurrency.symbol)}
            </p>
          </div>

          <div className="border-t border-b border-border py-4 flex items-center justify-between text-xs text-secondary">
            <span>Availability:</span>
            <span className={`font-medium ${isOutOfStock ? 'text-error' : 'text-olive-light'}`}>
              {isOutOfStock ? 'Currently Unavailable' : 'In Stock • Ready to Dispatch'}
            </span>
          </div>

          {/* Dynamic Attributes (Colors & Sizes) */}
          <div className="space-y-5">
            {product.attributes.map((attr) => {
              const selectedVal = selectedAttributes.find((s) => s.attributeId === attr.id)?.attributeValue;
              const isColor = attr.id.toLowerCase() === 'color';

              return (
                <div key={attr.id} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="uppercase tracking-luxury text-secondary font-medium">
                      Select {attr.name}:
                    </span>
                    <span className="font-semibold text-primary">{selectedVal || 'Required'}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {attr.items.map((item) => {
                      const isSelected = selectedVal === item.value;

                      if (isColor) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectAttribute(attr.id, item.value)}
                            className={`w-8 h-8 rounded-full border transition-all relative ${
                              isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'border-border'
                            }`}
                            style={{ backgroundColor: item.value }}
                            title={item.id}
                          >
                            {isSelected && (
                              <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                                item.value === '#FFFFFF' || item.value.toLowerCase() === 'white' ? 'text-primary' : 'text-surface'
                              }`} />
                            )}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectAttribute(attr.id, item.value)}
                          className={`min-w-[44px] h-11 px-4 text-xs uppercase font-medium border transition-colors ${
                            isSelected
                              ? 'bg-primary text-surface border-primary'
                              : 'bg-surface text-primary border-border hover:border-primary'
                          }`}
                        >
                          {item.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs uppercase tracking-luxury text-secondary font-medium">Quantity:</span>
              <div className="flex items-center border border-border bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-background transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 text-secondary" />
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-background transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 text-secondary" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={!allAttributesSelected || isOutOfStock}
                className={`flex-1 py-4 text-xs uppercase tracking-luxury font-medium transition-colors ${
                  !allAttributesSelected || isOutOfStock
                    ? 'bg-border text-secondary cursor-not-allowed'
                    : 'bg-primary text-surface hover:bg-sand-dark'
                }`}
              >
                {isOutOfStock
                  ? 'Sold Out'
                  : !allAttributesSelected
                  ? 'Please Choose Options'
                  : 'Add to Shopping Bag'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border transition-colors ${
                  isFavorite ? 'border-sand-dark text-sand-dark bg-sand/10' : 'border-border text-primary hover:border-primary'
                }`}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Accordion (Description, Care, Shipping) */}
          <div className="border-t border-border pt-6 space-y-4 text-sm">
            
            {/* Description Tab */}
            <div className="border-b border-border pb-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-luxury font-medium text-primary text-left"
              >
                <span>Design & Craftsmanship</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'description' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'description' && (
                <div
                  className="mt-3 text-xs text-secondary leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
              )}
            </div>

            {/* Materials & Provenance */}
            <div className="border-b border-border pb-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-luxury font-medium text-primary text-left"
              >
                <span>Materials & Origin</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'materials' && (
                <div className="mt-3 text-xs text-secondary leading-relaxed space-y-2">
                  <p>• Hand-finished with French seams and mother-of-pearl buttons.</p>
                  <p>• Sourced responsibly from certified European artisan ateliers.</p>
                  <p>• Professional dry clean or gentle hand wash recommended.</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="border-b border-border pb-4">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-luxury font-medium text-primary text-left"
              >
                <span>Delivery & Returns</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'delivery' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'delivery' && (
                <div className="mt-3 text-xs text-secondary leading-relaxed space-y-2">
                  <p>• Orders dispatched within 24 to 48 business hours in signature ÉLAN packaging.</p>
                  <p>• 14-day complimentary returns on unworn items with tags attached.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-border">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-luxury text-secondary font-medium">Complete The Look</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-primary font-normal mt-1">You May Also Admire</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add to Bag Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-border p-3 z-30 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-primary truncate max-w-[150px]">{product.name}</p>
          <p className="text-xs font-semibold text-secondary">{formatPrice(price, selectedCurrency.symbol)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!allAttributesSelected || isOutOfStock}
          className={`py-3 px-6 text-xs uppercase tracking-luxury font-medium transition-colors ${
            !allAttributesSelected || isOutOfStock
              ? 'bg-border text-secondary'
              : 'bg-primary text-surface'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : !allAttributesSelected ? 'Select Options' : 'Add to Bag'}
        </button>
      </div>

    </div>
  );
};
