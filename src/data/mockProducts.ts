import type { Product, Currency } from '../types';

export const DEFAULT_CURRENCIES: Currency[] = [
  { symbol: '₹', label: 'INR' },
  { symbol: '$', label: 'USD' },
  { symbol: '€', label: 'EUR' },
  { symbol: '£', label: 'GBP' },
  { symbol: '¥', label: 'JPY' },
  { symbol: 'A$', label: 'AUD' }
];

export const MOCK_PRODUCTS: Product[] = [
  // ==================== DRESSES (6 Items) ====================
  {
    id: 'elan-dress-01',
    name: 'Aurelia Silk Slip Midi Dress',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Cut from luminous 19-momme mulberry silk satin, the Aurelia Dress falls with effortless grace against the silhouette. Features a subtle cowl neckline, delicate bias cut, and French seams for a couture finish.</p><p>Dry clean only. Responsibly crafted in Italy.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Champagne', value: '#E8D8C8' },
          { id: 'Midnight', value: '#1A1D20' },
          { id: 'Olive', value: '#5B6955' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 28900.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 345.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 315.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 275.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 52000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 530.00 }
    ]
  },
  {
    id: 'elan-dress-02',
    name: 'Seraphina Pleated Maxi Gown',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>An ethereal masterpiece featuring accordion micro-pleating through the bodice and a tiered skirt that catches the air with every movement. Designed with a deep V-neckline and detachable belt.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Noir', value: '#111111' },
          { id: 'Sand', value: '#C8B8A5' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 39500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 480.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 440.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 380.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 72000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 740.00 }
    ]
  },
  {
    id: 'elan-dress-03',
    name: 'Isolde Velvet Evening Wrap Dress',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Tailored in plush silk-rayon velvet with a rich midnight drape. Features a flattering wrap front, structured shoulders, and a self-tying sash that accentuates the waistline.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Emerald', value: '#134E4A' },
          { id: 'Burgundy', value: '#581C87' },
          { id: 'Black', value: '#0A0A0A' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 34500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 420.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 385.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 335.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 63000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 645.00 }
    ]
  },
  {
    id: 'elan-dress-04',
    name: 'Camilla Broderie Anglaise Linen Dress',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Bespoke Belgian linen adorned with artisanal eyelet embroidery. Complete with a scalloped hemline, Mother of Pearl front placket, and breathable cotton lawn slip lining.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Pure White', value: '#FFFFFF' },
          { id: 'Butter Sand', value: '#FEF08A' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 26500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 310.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 285.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 245.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 46500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 480.00 }
    ]
  },
  {
    id: 'elan-dress-05',
    name: 'Helena Ribbed Cashmere Knit Dress',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Spun from 100% two-ply Mongolian cashmere. Features fine vertical micro-ribbing that gently hugs the figure, a warm mock neck, and a subtle side slit for ease of movement.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Oatmeal', value: '#E7E2D7' },
          { id: 'Charcoal', value: '#262626' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 32000.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 385.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 350.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 305.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 58000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 590.00 }
    ]
  },
  {
    id: 'elan-dress-06',
    name: 'Elise Sculpted Trench Shirt Dress',
    category: 'dresses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>A modern reinterpretation of the classic trench coat as an evening shirt dress. Features double-breasted horn buttons, storm flaps, and a structured wide belt with gold buckle.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Khaki Beige', value: '#D2B48C' },
          { id: 'Dark Navy', value: '#0F172A' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 29500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 350.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 320.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 280.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 53000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 540.00 }
    ]
  },

  // ==================== BLOUSES (6 Items) ====================
  {
    id: 'elan-blouse-01',
    name: 'Celeste Silk Georgette Blouse',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Tailored from semi-sheer silk georgette with voluminous poet sleeves and structured mother-of-pearl button cuffs. Elegant self-tie neck sash can be styled as a bow or left undone.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Ivory', value: '#F4F1EA' },
          { id: 'Slate', value: '#4A5568' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 21900.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 260.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 238.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 205.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 39000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 400.00 }
    ]
  },
  {
    id: 'elan-blouse-02',
    name: 'Valeria Crisp Poplin Wrap Shirt',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Constructed in crisp organic Italian cotton poplin. Features an asymmetric wrap silhouette, extended pointed collar, and adjustable side tie for tailored definition.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Optic White', value: '#FFFFFF' },
          { id: 'Sky Stripe', value: '#90CDF4' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 18500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 220.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 200.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 175.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 33000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 340.00 }
    ]
  },
  {
    id: 'elan-blouse-03',
    name: 'Genevieve Satin Cowl Halter Top',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Liquid satin halter top featuring a cascading draped cowl neck and an open back with delicate criss-cross cord ties. The ultimate evening piece paired with tailored trousers.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Copper', value: '#B45309' },
          { id: 'Onyx', value: '#171717' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 16500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 195.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 180.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 155.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 29500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 305.00 }
    ]
  },
  {
    id: 'elan-blouse-04',
    name: 'Marianne Pintuck Victorian Blouse',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>A poetic Victorian-inspired silhouette featuring handmade pintucks across the yoke, subtle ruffled stand collar, and gathered blouson sleeves.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Linen Cream', value: '#FDFBF7' },
          { id: 'Dusty Rose', value: '#FDA4AF' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 19800.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 235.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 215.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 185.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 35000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 365.00 }
    ]
  },
  {
    id: 'elan-blouse-05',
    name: 'Astrid Tailored Tuxedo Silk Shirt',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Impeccably tailored tuxedo front bib shirt crafted in heavy silk crepe de chine. Concealed button placket, French turnback cuffs, and clean architectural lines.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Snow', value: '#FFFFFF' },
          { id: 'Midnight Black', value: '#09090B' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'XS', value: 'XS' },
          { id: 'S', value: 'S' },
          { id: 'M', value: 'M' },
          { id: 'L', value: 'L' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 24500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 290.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 265.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 230.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 43500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 450.00 }
    ]
  },
  {
    id: 'elan-blouse-06',
    name: 'Livia Linen Resort Kimono Top',
    category: 'blouses',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Relaxed breezy silhouette woven from Normandy flax linen. Features wide kimono-style sleeves, relaxed drop shoulders, and an easy loop closure.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Terracotta', value: '#9A3412' },
          { id: 'Natural Sand', value: '#D6D3D1' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: 'S/M', value: 'S/M' },
          { id: 'L/XL', value: 'L/XL' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 15500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 185.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 170.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 145.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 28000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 290.00 }
    ]
  },

  // ==================== JEANS & DENIM (5 Items) ====================
  {
    id: 'elan-jeans-01',
    name: 'Monaco High-Rise Wide Leg Denim',
    category: 'jeans',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Woven in Japan on vintage shuttle looms from 100% regenerative organic cotton. Features an elongated high waist, relaxed wide leg drape, and gentle vintage enzyme wash.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Vintage Indigo', value: '#2B4C7E' },
          { id: 'Ecru', value: '#EBE7DF' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '25', value: '25' },
          { id: '26', value: '26' },
          { id: '27', value: '27' },
          { id: '28', value: '28' },
          { id: '29', value: '29' },
          { id: '30', value: '30' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 24500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 290.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 265.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 230.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 43500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 450.00 }
    ]
  },
  {
    id: 'elan-jeans-02',
    name: 'Palermo Straight Leg Raw Hem Denim',
    category: 'jeans',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>A classic mid-rise straight silhouette designed to flatter every curve. Hand-finished with raw cut cuffs and subtle distressed whiskers.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Classic Blue', value: '#36537A' },
          { id: 'Faded Black', value: '#2C2C2C' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '26', value: '26' },
          { id: '27', value: '27' },
          { id: '28', value: '28' },
          { id: '29', value: '29' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 22800.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 270.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 245.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 215.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 40500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 415.00 }
    ]
  },
  {
    id: 'elan-jeans-03',
    name: 'Sorento Tailored Flared Trousers Denim',
    category: 'jeans',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Seventies elegance reworked for today. Form-fitting through the hips with a dramatic gradual flare at the knee. Contrast tobacco topstitching and custom brass rivets.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Deep Indigo', value: '#1E3A5F' },
          { id: 'Washed Stone', value: '#94A3B8' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '26', value: '26' },
          { id: '27', value: '27' },
          { id: '28', value: '28' },
          { id: '29', value: '29' },
          { id: '30', value: '30' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 25500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 300.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 275.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 240.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 45000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 465.00 }
    ]
  },
  {
    id: 'elan-jeans-04',
    name: 'Capri Relaxed Tapered Boyfriend Jeans',
    category: 'jeans',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Effortlessly slouchy with an authentic lived-in feel. 12.5oz non-stretch Kaihara Japanese denim with hand-abraded cuffs and a slight tapered ankle.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Light Sun Bleach', value: '#CBD5E1' },
          { id: 'Medium Wash', value: '#3B82F6' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '25', value: '25' },
          { id: '26', value: '26' },
          { id: '27', value: '27' },
          { id: '28', value: '28' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 21000.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 250.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 230.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 198.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 37500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 385.00 }
    ]
  },
  {
    id: 'elan-jeans-05',
    name: 'Biarritz High-Waisted White Selvedge Jeans',
    category: 'jeans',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Pure chalk white denim woven with a distinctive pink selvedge ID line. Clean front styling with welt coin pocket and pressed crease along the front leg.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Chalk White', value: '#FAF9F6' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '26', value: '26' },
          { id: '27', value: '27' },
          { id: '28', value: '28' },
          { id: '29', value: '29' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 23500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 280.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 255.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 220.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 42000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 435.00 }
    ]
  },

  // ==================== SHOES & FOOTWEAR (5 Items) ====================
  {
    id: 'elan-shoes-01',
    name: 'Verona Sculpted Heeled Mule',
    category: 'shoes',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Handcrafted in Tuscany from supple nappa leather. Features an architectural 65mm flared kitten heel, gently padded leather insole, and chisel square toe.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Biscotti', value: '#C8B8A5' },
          { id: 'Espresso', value: '#362B28' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '36', value: '36' },
          { id: '37', value: '37' },
          { id: '38', value: '38' },
          { id: '39', value: '39' },
          { id: '40', value: '40' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 34500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 410.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 375.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 325.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 61500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 630.00 }
    ]
  },
  {
    id: 'elan-shoes-02',
    name: 'Siena Leather Ankle Strap Sandal',
    category: 'shoes',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Refined minimalism meets day-to-night versatility. Ultra-fine leather straps cradle the foot, grounded on a supportive memory-foam lined leather sole.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Cognac', value: '#8C5835' },
          { id: 'Jet', value: '#1C1C1C' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '36', value: '36' },
          { id: '37', value: '37' },
          { id: '38', value: '38' },
          { id: '39', value: '39' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 29900.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 360.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 330.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 285.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 54000 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 555.00 }
    ]
  },
  {
    id: 'elan-shoes-03',
    name: 'Milanese Pointed Leather Slingback',
    category: 'shoes',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Sculpted with a sharp pointed toe, slender 45mm block kitten heel, and elasticized slingback strap. Crafted from glossy Italian box calf leather.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Cherry Burgundy', value: '#7F1D1D' },
          { id: 'Black Patent', value: '#0A0A0A' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '36', value: '36' },
          { id: '37', value: '37' },
          { id: '38', value: '38' },
          { id: '39', value: '39' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 36500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 430.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 395.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 345.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 64500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 660.00 }
    ]
  },
  {
    id: 'elan-shoes-04',
    name: 'Sorrento Woven Leather Ballet Flat',
    category: 'shoes',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>Intricately hand-woven strips of vegetable-tanned lambskin create a breathable, glove-like fit that molds to your feet with wear. Flexible leather sole.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Honey Tan', value: '#D97706' },
          { id: 'Alabaster', value: '#F3F4F6' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '36', value: '36' },
          { id: '37', value: '37' },
          { id: '38', value: '38' },
          { id: '39', value: '39' },
          { id: '40', value: '40' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 27500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 330.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 300.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 260.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 49500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 510.00 }
    ]
  },
  {
    id: 'elan-shoes-05',
    name: 'Firenze Minimalist Leather Loafer',
    category: 'shoes',
    inStock: true,
    gallery: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1000&q=85',
    ],
    description: '<p>The consummate tailored flat. Constructed with a Goodyear welt, stacked 20mm leather heel, and a clean penny keeper strap. Timeless understated sophistication.</p>',
    attributes: [
      {
        id: 'Color',
        name: 'Color',
        items: [
          { id: 'Polished Black', value: '#111827' },
          { id: 'Oxblood', value: '#450A0A' }
        ]
      },
      {
        id: 'Size',
        name: 'Size',
        items: [
          { id: '36', value: '36' },
          { id: '37', value: '37' },
          { id: '38', value: '38' },
          { id: '39', value: '39' },
          { id: '40', value: '40' }
        ]
      }
    ],
    prices: [
      { currency: { symbol: '₹', label: 'INR' }, amount: 32500.00 },
      { currency: { symbol: '$', label: 'USD' }, amount: 390.00 },
      { currency: { symbol: '€', label: 'EUR' }, amount: 355.00 },
      { currency: { symbol: '£', label: 'GBP' }, amount: 310.00 },
      { currency: { symbol: '¥', label: 'JPY' }, amount: 58500 },
      { currency: { symbol: 'A$', label: 'AUD' }, amount: 600.00 }
    ]
  }
];
