import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase';
import type { Product } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

// In-memory catalog cache to avoid duplicate reads on route navigation
let cachedCatalog: Product[] | null = null;

/**
 * Normalizes and validates incoming Firestore document data
 */
function normalizeProduct(docData: any, docId: string): Product {
  let prices = Array.isArray(docData.prices) && docData.prices.length > 0
    ? docData.prices
    : [{ currency: { symbol: '₹', label: 'INR' }, amount: 14900.00 }];

  // Ensure an INR price exists for seamless currency conversion
  if (!prices.some((p: any) => p.currency?.symbol === '₹' || p.currency?.label === 'INR')) {
    const basePrice = prices.find((p: any) => p.currency?.symbol === '$')?.amount || prices[0]?.amount || 150;
    prices = [
      { currency: { symbol: '₹', label: 'INR' }, amount: Math.round(basePrice * 84) },
      ...prices,
    ];
  }

  return {
    id: docData.id || docId,
    name: docData.name || 'Untitled Garment',
    category: docData.category || 'all',
    inStock: docData.inStock !== false,
    gallery: Array.isArray(docData.gallery) && docData.gallery.length > 0 
      ? docData.gallery 
      : ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
    description: docData.description || '<p>Crafted with premium materials and signature craftsmanship.</p>',
    attributes: Array.isArray(docData.attributes) ? docData.attributes : [],
    prices,
  };
}

/**
 * Retrieves the complete product catalog.
 * Uses Firebase Firestore when configured and reachable; otherwise transparently falls back to local demo catalog.
 */
export async function getProducts(forceRefresh = false): Promise<Product[]> {
  if (cachedCatalog && !forceRefresh) {
    return cachedCatalog;
  }

  if (db) {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      
      if (!snapshot.empty) {
        const products = snapshot.docs.map(doc => normalizeProduct(doc.data(), doc.id));
        cachedCatalog = products;
        return products;
      }
    } catch (error) {
      console.warn('[ProductService] Cloud Firestore read failed or unauthorized; using verified demo data mode.', error);
    }
  }

  // Graceful local demo fallback
  cachedCatalog = MOCK_PRODUCTS;
  return MOCK_PRODUCTS;
}

/**
 * Retrieves products filtered by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getProducts();
  if (!category || category === 'all') {
    return all;
  }
  return all.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Retrieves a single product by unique ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  const product = all.find((p) => p.id === id);
  return product || null;
}
