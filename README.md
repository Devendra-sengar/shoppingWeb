# ÉLAN — Everyday Elegance | Premium Fashion Storefront

An ultra-modern, editorial, high-converting luxury women's fashion e-commerce storefront built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **Lucide React**, **Zustand**, and **Firebase Cloud Firestore**.

Designed as a modern replacement presentation layer compatible with the original `Shopping Time` database contracts and business logic.

---

## 1. Brand Identity & Design System
- **Brand Name:** ÉLAN
- **Tagline:** Everyday Elegance
- **Philosophy:** Timeless silhouettes, sustainable European craftsmanship, quiet luxury.
- **Palette:**
  - Main Background: `#F8F7F3`
  - Surface: `#FFFFFF`
  - Primary Text: `#20221F`
  - Secondary Text: `#71736D`
  - Accent Sand: `#C8B8A5`
  - Accent Olive: `#5B6955`
  - Border: `#E5E3DD`
  - Error: `#B54848`
- **Typography:** *Playfair Display* (Editorial serifs) and *Inter* (Interface & body).

---

## 2. Key Architecture & Features

### A. Data Layer & Dual Mode Connectivity
- **Cloud Firestore Lite Mode:** Uses the existing `products` and `currencies` Firestore collections when environment variables are supplied.
- **Instant Demo Mode:** When running without Firebase credentials or offline, seamlessly loads an authenticated high-fidelity fashion catalog with full multi-currency pricing, gallery, and attribute options.
- **In-Memory Caching:** Prevents excessive Firestore read operations during route navigation.

### B. E-Commerce Capabilities
1. **Dynamic Multi-Currency Engine:** Instant global currency switcher supporting `$ (USD)`, `€ (EUR)`, `£ (GBP)`, `¥ (JPY)`, and `A$ (AUD)` with automatic price re-evaluation.
2. **Attribute Guard & Uniqueness:** Size and color attribute selection is strictly enforced. The cart computes stable canonical composite keys (`${productId}-${attr1}-${attr2}`) so identical combinations increment quantity while different variants remain distinct.
3. **Slide-Over Bag Drawer:** Global mini-cart drawer with item thumbnail, attribute summary, quantity controls, and subtotal.
4. **Quick Shop Modal:** Instant attribute picker accessible directly from product listing cards.
5. **Persistent Wishlist:** Client-side local storage wishlist with header counter badge.
6. **Live Search Overlay:** Instant substring query matching across garments and categories with local recent search history.
7. **3-Step Guest Checkout:** Multi-step wizard with Zod schema validation (Contact -> Delivery Address -> Review & Simulated Payment).
8. **Printable Order Receipt:** UUID demo order number, itemized snapshot independent of cart state, and `window.print()` integration.

---

## 3. Getting Started

### Installation
```bash
# Navigate to the storefront directory
cd premium-storefront

# Install dependencies using pnpm
pnpm install
```

### Development Server
```bash
pnpm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
pnpm run build
pnpm run preview
```

---

## 4. Available Routes

| Route | View |
| :--- | :--- |
| `/` | Editorial Homepage (Hero, Shop by Category, Featured, Atelier Story) |
| `/collections` | All Collections Catalog with Filters & Sorting |
| `/collections/:category` | Category Catalog (`dresses`, `blouses`, `jeans`, `shoes`) |
| `/product/:id` | Product Details Page (Gallery, Swatches, Accordion, Related) |
| `/wishlist` | Saved Garments Grid |
| `/cart` | Full Shopping Bag & VAT Breakdown |
| `/checkout` | 3-Step Validated Checkout Wizard |
| `/order` | Order Confirmation & Printable Invoice |
| `/about` | Atelier Manifesto |
| `/contact` | Concierge & Atelier Details |
| `/faq` | Frequently Asked Questions |
| `/shipping-returns` | Verified Demo Delivery & Return Policies |
| `/privacy` | Privacy Policy |
| `/terms` | Demonstration Terms of Service |
| `*` | Custom 404 Fallback |
