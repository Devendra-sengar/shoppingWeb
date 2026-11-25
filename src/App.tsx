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
import { TrackOrderPage } from './pages/TrackOrderPage';

// Admin imports
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductEditorPage } from './pages/admin/AdminProductEditorPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminStorefrontCMSPage } from './pages/admin/AdminStorefrontCMSPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
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
      
      <Routes>
        {/* Admin Console Route Namespace */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductEditorPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="shipments" element={<AdminOrdersPage />} />
          <Route path="storefront" element={<AdminStorefrontCMSPage />} />
          <Route path="categories" element={<AdminInventoryPage />} />
          <Route path="returns" element={<AdminOrdersPage />} />
          <Route path="payments" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminOrdersPage />} />
          <Route path="staff" element={<AdminStorefrontCMSPage />} />
          <Route path="settings" element={<AdminStorefrontCMSPage />} />
        </Route>

        {/* Customer Storefront Routes */}
        <Route
          path="/*"
          element={
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
                  <Route path="/track-order" element={<TrackOrderPage />} />
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
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
