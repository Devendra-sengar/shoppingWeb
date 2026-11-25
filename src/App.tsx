import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileMenu } from './components/layout/MobileMenu';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickShopModal } from './components/product/QuickShopModal';
import { SearchOverlay } from './components/search/SearchOverlay';
import { Toast } from './components/layout/Toast';

import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import {
  AboutPage,
  ContactPage,
  FAQPage,
  ShippingReturnsPage,
  PrivacyPage,
  TermsPage,
} from './pages/SupportingPages';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <div className="min-h-screen flex flex-col bg-background text-primary font-sans antialiased">
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Global Sticky Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:category" element={<CollectionsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order" element={<OrderConfirmationPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Drawers, Modals & Alerts */}
        <CartDrawer />
        <MobileMenu />
        <QuickShopModal />
        <SearchOverlay />
        <Toast />
      </div>
    </BrowserRouter>
  );
};

export default App;
