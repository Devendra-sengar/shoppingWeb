// Centralized brand configuration for ÉLAN

export const BRAND_CONFIG = {
  name: 'ÉLAN',
  tagline: 'Everyday Elegance',
  descriptor: "Women's Luxury Apparel & Accessories",
  logo: '/logo.png',
  
  announcement: {
    enabled: true,
    message: 'Complimentary express shipping on orders over $250 • Demonstration Store',
  },

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'All Collections', href: '/collections' },
    { label: 'Dresses', href: '/collections/dresses' },
    { label: 'Blouses', href: '/collections/blouses' },
    { label: 'Jeans', href: '/collections/jeans' },
    { label: 'Shoes', href: '/collections/shoes' },
    { label: 'About', href: '/about' },
  ],

  contact: {
    email: 'concierge@elan-fashion.demo',
    phone: '+1 (800) 555-ELAN',
    whatsapp: '919131494302',
    whatsappDisplay: '+91 9131494302',
    address: 'ÉLAN Flagship Atelier, Vijay Nagar, Indore, Madhya Pradesh 452010',
    hours: 'Monday – Saturday: 10:00 AM – 7:00 PM EST',
  },

  socials: [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Pinterest', href: 'https://pinterest.com' },
    { name: 'Vogue Runway', href: 'https://vogue.com' },
  ],

  policies: {
    demoNotice: 'Notice: This storefront is a demonstration client application. Orders placed are simulated and no real payments are charged.',
    taxRatePercent: 21, // 21% demo VAT from legacy Shopping Time logic
  },

  theme: {
    colors: {
      background: '#F8F7F3',
      surface: '#FFFFFF',
      primary: '#20221F',
      secondary: '#71736D',
      accentSand: '#C8B8A5',
      accentOlive: '#5B6955',
      border: '#E5E3DD',
    }
  }
};
