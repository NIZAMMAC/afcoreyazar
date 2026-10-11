// Shared persistent state & CMS data layer for afcore Qatar Storefront & Admin Console
const STORAGE_KEY = 'afcore_qatar_store_v1';

const FIGMA_IMAGE_LIBRARY = [
  { label: 'Hero — Sony WH-1000XM5 Editorial', url: 'assets/images/0bc2130c901207128f822f0a7300b85e4efcade3.png' },
  { label: 'Category — Audio', url: 'assets/images/73726645ae8c355a4091bdcf8d62d20359cdb628.png' },
  { label: 'Category — Computing', url: 'assets/images/6eadd7afe661e06369f09bea68b6e9999e169536.png' },
  { label: 'Category — Accessories', url: 'assets/images/45d5dfa73c6facc0bd0c81880e9da0ce7d91064e.png' },
  { label: 'Sony WH-1000XM5 (Main Studio)', url: 'assets/images/4140f884579f6f4ed29fc748d8e5a3a301958387.png' },
  { label: 'Sony WH-1000XM5 (Catalog)', url: 'assets/images/f2e290bdfee257371f36febae57f479d6663df5d.png' },
  { label: 'Sony WH-1000XM5 (Side Profile)', url: 'assets/images/b8d4413d39845663629aea0b2e018cb9be60d0e3.png' },
  { label: 'Sony WH-1000XM5 (Case & Cables)', url: 'assets/images/fc0d53b4ce9efedadf5520cfd7a228f752fdf54c.png' },
  { label: 'Marshall Acton III (Catalog)', url: 'assets/images/162dafa7605a8bf83b30ee1073416d8d5ab0e839.png' },
  { label: 'Marshall Acton III (Card)', url: 'assets/images/483c7b23a44a650ecbbda73e0c92b1f472ad7dd2.png' },
  { label: 'Logitech MX Keys S (Catalog)', url: 'assets/images/671bcd6c4afdc3eef08e685b8177e1cad9b8f417.png' },
  { label: 'Logitech MX Keys S (Card)', url: 'assets/images/594de8c07cb83c41c6ede48f9df29efcd297ed4a.png' },
  { label: 'Nothing Ear (Catalog)', url: 'assets/images/1b1fb962a1481dcdbf8a2845e71b038cf6436803.png' },
  { label: 'Nothing Ear (Card)', url: 'assets/images/06233fc361f02715c9a54a3a8b87cdb4103b9fa4.png' },
  { label: 'Logitech MX Master 3S', url: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png' },
  { label: 'Anker Prime 67W (Catalog)', url: 'assets/images/a2eac59e2ce6eac3c3ab3e1ea7755a20ebff888c.png' },
  { label: 'Anker Prime 67W (Square)', url: 'assets/images/db2ad74f42155a7dd29b8a448ad1c77baef41abb.png' }
];

const DEFAULT_STORE_DATA = {
  settings: {
    brandName: 'afcore',
    country: 'Qatar',
    currency: 'QAR',
    brandPromise: 'Good technology. Less noise. Delivered across Qatar.',
    copyrightText: '© 2026 afcore Qatar. All rights reserved.',
    announcementText: 'Thoughtfully selected tech in Qatar · Free same-day Doha delivery on orders over QAR 350.',
    announcementEnabled: true,
    freeShippingThreshold: 350,
    standardShippingFee: 35,
    primaryColor: '#2458DF',
    inkColor: '#202322',
    surfaceColor: '#F4F5F2',
    hero: {
      eyebrow: 'TECH FOR YOUR EVERYDAY · QATAR',
      headline: 'Less noise.\nMore possibility.',
      description: 'Discover considered electronics that make work, listening, and living feel a little better — with same-day delivery in Doha.',
      ctaLabel: 'Explore the collection',
      image: 'assets/images/0bc2130c901207128f822f0a7300b85e4efcade3.png',
      captionTitle: 'Sony WH-1000XM5',
      captionDesc: 'Your world, uninterrupted. — QAR 1,270',
      captionProductId: 'wh-1000xm5'
    },
    categoriesSectionHeading: 'Made for the way you live.',
    categories: [
      {
        id: 'Audio',
        name: 'Audio',
        description: 'A better way to listen',
        image: 'assets/images/73726645ae8c355a4091bdcf8d62d20359cdb628.png'
      },
      {
        id: 'Computing',
        name: 'Computing',
        description: 'Find your flow',
        image: 'assets/images/6eadd7afe661e06369f09bea68b6e9999e169536.png'
      },
      {
        id: 'Accessories',
        name: 'Accessories',
        description: 'The little essentials',
        image: 'assets/images/45d5dfa73c6facc0bd0c81880e9da0ce7d91064e.png'
      }
    ],
    favoritesHeading: 'Everyday favorites.',
    favoritesSubtext: 'Well-designed. Well-loved. Ready for same-day delivery in Doha.',
    catalogTitle: 'Good tech. Simply selected.',
    catalogSubtitle: 'Essentials for better listening, focused work, and everything in between — stocked in Qatar.',
    promises: [
      { title: 'Same-day Doha delivery', description: 'Free delivery across Qatar on orders over QAR 350.' },
      { title: 'Room to decide', description: 'Easy 14-day returns across Doha, Lusail & Al Wakrah.' },
      { title: 'Official Qatar warranty', description: 'Authentic products. Full local manufacturer warranty.' }
    ]
  },
  products: [
    {
      id: 'wh-1000xm5',
      brand: 'SONY',
      brandLabel: 'Sony',
      name: 'WH-1000XM5',
      price: 1270,
      category: 'Audio',
      badge: 'Bestseller',
      inStock: true,
      stockCount: 24,
      featuredOnHome: true,
      shortDesc: 'Wireless noise-canceling headphones',
      longDesc:
        'Meet your everyday escape. Exceptional noise cancellation, beautifully balanced sound, and all-day comfort in a light, considered design.',
      rating: 4.8,
      reviewsCount: 128,
      images: {
        homeCard: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
        catalogCard: 'assets/images/f2e290bdfee257371f36febae57f479d6663df5d.png',
        relatedCard: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
        cartThumb: 'assets/images/1e4be583be3e466b7d26d46305b01c06294d150b.png',
        gallery: [
          {
            main: 'assets/images/4140f884579f6f4ed29fc748d8e5a3a301958387.png',
            thumb: 'assets/images/c3bd1b9e91f27ecf79661187c7b76499b7fd4835.png',
            alt: 'Sony WH-1000XM5 three-quarter view'
          },
          {
            main: 'assets/images/b8d4413d39845663629aea0b2e018cb9be60d0e3.png',
            thumb: 'assets/images/b8d4413d39845663629aea0b2e018cb9be60d0e3.png',
            alt: 'Sony WH-1000XM5 side profile'
          },
          {
            main: 'assets/images/fc0d53b4ce9efedadf5520cfd7a228f752fdf54c.png',
            thumb: 'assets/images/fc0d53b4ce9efedadf5520cfd7a228f752fdf54c.png',
            alt: 'Sony WH-1000XM5 with carrying case and cables'
          }
        ]
      },
      colors: [
        { name: 'Black', hex: '#202322', className: 'black' },
        { name: 'Silver', hex: '#D4D0C7', className: 'silver' }
      ],
      defaultVariant: 'Black · Wireless noise-canceling headphones',
      specsLeft: [
        { label: 'Driver unit', value: '30 mm dynamic driver' },
        { label: 'Battery life', value: 'Up to 30 hours with noise canceling' },
        { label: 'Connectivity', value: 'Bluetooth 5.2 · Multipoint pairing' }
      ],
      specsRight: [
        { label: 'Weight', value: '250 g' },
        { label: 'Charging', value: 'USB-C · 3 min charge for 3 hours of listening' },
        { label: 'In the box', value: 'Carrying case, USB cable, audio cable' }
      ]
    },
    {
      id: 'acton-iii',
      brand: 'MARSHALL',
      brandLabel: 'Marshall',
      name: 'Acton III',
      price: 1020,
      category: 'Audio',
      badge: null,
      inStock: true,
      stockCount: 14,
      featuredOnHome: true,
      shortDesc: 'Compact Bluetooth home speaker',
      longDesc:
        'Room-filling Marshall signature sound in a pared-back, compact silhouette. Tactile brass controls and balanced acoustics built for everyday spaces.',
      rating: 4.9,
      reviewsCount: 94,
      images: {
        homeCard: 'assets/images/483c7b23a44a650ecbbda73e0c92b1f472ad7dd2.png',
        catalogCard: 'assets/images/162dafa7605a8bf83b30ee1073416d8d5ab0e839.png',
        relatedCard: 'assets/images/9d6efaf4b1c05b858ec1636edf10ef7f73623067.png',
        cartThumb: 'assets/images/9d6efaf4b1c05b858ec1636edf10ef7f73623067.png',
        gallery: [
          {
            main: 'assets/images/162dafa7605a8bf83b30ee1073416d8d5ab0e839.png',
            thumb: 'assets/images/9d6efaf4b1c05b858ec1636edf10ef7f73623067.png',
            alt: 'Marshall Acton III three-quarter view'
          }
        ]
      },
      colors: [
        { name: 'Black', hex: '#202322', className: 'black' },
        { name: 'Cream', hex: '#D4D0C7', className: 'silver' }
      ],
      defaultVariant: 'Black · Compact Bluetooth home speaker',
      specsLeft: [
        { label: 'Amplifiers', value: '30 W Class D woofer · 2 × 15 W tweeters' },
        { label: 'Frequency range', value: '45–20,000 Hz' },
        { label: 'Connectivity', value: 'Bluetooth 5.2 · 3.5 mm input' }
      ],
      specsRight: [
        { label: 'Weight', value: '2.85 kg' },
        { label: 'Dimensions', value: '260 × 170 × 150 mm' },
        { label: 'In the box', value: 'Acton III speaker, UK/Qatar mains lead, quick start guide' }
      ]
    },
    {
      id: 'mx-keys-s',
      brand: 'LOGITECH',
      brandLabel: 'Logitech',
      name: 'MX Keys S',
      price: 399,
      category: 'Computing',
      badge: null,
      inStock: true,
      stockCount: 38,
      featuredOnHome: true,
      shortDesc: 'Low-profile wireless keyboard',
      longDesc:
        'Fluid, quiet, laptop-like typing with spherically-dished keys shaped for your fingertips and smart illumination that adapts to your environment.',
      rating: 4.7,
      reviewsCount: 86,
      images: {
        homeCard: 'assets/images/594de8c07cb83c41c6ede48f9df29efcd297ed4a.png',
        catalogCard: 'assets/images/671bcd6c4afdc3eef08e685b8177e1cad9b8f417.png',
        relatedCard: 'assets/images/0c105b860d046f90b51f3c4d61dc0f3073b0b6d0.png',
        cartThumb: 'assets/images/0c105b860d046f90b51f3c4d61dc0f3073b0b6d0.png',
        gallery: [
          {
            main: 'assets/images/671bcd6c4afdc3eef08e685b8177e1cad9b8f417.png',
            thumb: 'assets/images/0c105b860d046f90b51f3c4d61dc0f3073b0b6d0.png',
            alt: 'Logitech MX Keys S wireless keyboard'
          }
        ]
      },
      colors: [
        { name: 'Graphite', hex: '#202322', className: 'black' },
        { name: 'Pale Gray', hex: '#D4D0C7', className: 'silver' }
      ],
      defaultVariant: 'Graphite · Low-profile wireless keyboard',
      specsLeft: [
        { label: 'Switch type', value: 'Low-profile scissor keys (Perfect Stroke)' },
        { label: 'Battery life', value: 'Up to 10 days backlit · 5 months illumination off' },
        { label: 'Connectivity', value: 'Bluetooth Low Energy · Logi Bolt USB receiver' }
      ],
      specsRight: [
        { label: 'Weight', value: '810 g' },
        { label: 'Charging', value: 'USB-C rechargeable' },
        { label: 'In the box', value: 'MX Keys S, Logi Bolt receiver, USB-C charging cable' }
      ]
    },
    {
      id: 'ear',
      brand: 'NOTHING',
      brandLabel: 'Nothing',
      name: 'Ear',
      price: 549,
      category: 'Audio',
      badge: 'New arrival',
      inStock: true,
      stockCount: 19,
      featuredOnHome: true,
      shortDesc: 'Wireless earbuds, reimagined',
      longDesc:
        'Iconic transparent design meets custom 11 mm ceramic drivers. High-resolution wireless audio with smart active noise cancellation up to 45 dB.',
      rating: 4.7,
      reviewsCount: 64,
      images: {
        homeCard: 'assets/images/06233fc361f02715c9a54a3a8b87cdb4103b9fa4.png',
        catalogCard: 'assets/images/1b1fb962a1481dcdbf8a2845e71b038cf6436803.png',
        relatedCard: 'assets/images/51663e961ab0476524899a9427292aaccdc13e2c.png',
        cartThumb: 'assets/images/51663e961ab0476524899a9427292aaccdc13e2c.png',
        gallery: [
          {
            main: 'assets/images/1b1fb962a1481dcdbf8a2845e71b038cf6436803.png',
            thumb: 'assets/images/51663e961ab0476524899a9427292aaccdc13e2c.png',
            alt: 'Nothing Ear wireless earbuds'
          }
        ]
      },
      colors: [
        { name: 'White', hex: '#D4D0C7', className: 'silver' },
        { name: 'Black', hex: '#202322', className: 'black' }
      ],
      defaultVariant: 'White · Wireless earbuds, reimagined',
      specsLeft: [
        { label: 'Driver unit', value: '11 mm custom ceramic diaphragm driver' },
        { label: 'Battery life', value: 'Up to 40.5 hours with case (ANC off)' },
        { label: 'Connectivity', value: 'Bluetooth 5.3 · LHDC 5.0 & LDAC' }
      ],
      specsRight: [
        { label: 'Weight', value: '4.62 g per earbud · 51.9 g case' },
        { label: 'Charging', value: 'USB-C & 2.5W Qi wireless charging' },
        { label: 'In the box', value: 'Pair of earbuds, charging case, ear tips (S/M/L), USB-C cable' }
      ]
    },
    {
      id: 'mx-master-3s',
      brand: 'LOGITECH',
      brandLabel: 'Logitech',
      name: 'MX Master 3S',
      price: 365,
      category: 'Computing',
      badge: null,
      inStock: true,
      stockCount: 31,
      featuredOnHome: false,
      shortDesc: 'Precision wireless mouse',
      longDesc:
        'An icon remastered for quiet clicks, 8,000 DPI any-surface tracking, and MagSpeed electromagnetic scrolling engineered for effortless flow.',
      rating: 4.9,
      reviewsCount: 215,
      images: {
        homeCard: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
        catalogCard: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
        relatedCard: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
        cartThumb: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
        gallery: [
          {
            main: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
            thumb: 'assets/images/8d2da794bb128bc9c5d008668e0530dfe3dad9f2.png',
            alt: 'Logitech MX Master 3S wireless mouse'
          }
        ]
      },
      colors: [
        { name: 'Graphite', hex: '#202322', className: 'black' },
        { name: 'Pale Gray', hex: '#D4D0C7', className: 'silver' }
      ],
      defaultVariant: 'Graphite · Precision wireless mouse',
      specsLeft: [
        { label: 'Sensor', value: 'Darkfield high precision · 200 to 8,000 DPI' },
        { label: 'Battery life', value: 'Up to 70 days on a single full charge' },
        { label: 'Connectivity', value: 'Bluetooth Low Energy · Logi Bolt USB receiver' }
      ],
      specsRight: [
        { label: 'Weight', value: '141 g' },
        { label: 'Charging', value: 'USB-C · 1 min quick charge for 3 hours of use' },
        { label: 'In the box', value: 'MX Master 3S mouse, Logi Bolt receiver, USB-C cable' }
      ]
    },
    {
      id: 'prime-67w',
      brand: 'ANKER',
      brandLabel: 'Anker',
      name: 'Prime 67W',
      price: 215,
      category: 'Accessories',
      badge: null,
      inStock: true,
      stockCount: 52,
      featuredOnHome: false,
      shortDesc: 'Three-port GaN wall charger',
      longDesc:
        'Ultra-compact GaNPrime power for up to three devices simultaneously. UK Type G Qatar plug and ActiveShield 2.0 temperature monitoring for travel and desk.',
      rating: 4.8,
      reviewsCount: 112,
      images: {
        homeCard: 'assets/images/a2eac59e2ce6eac3c3ab3e1ea7755a20ebff888c.png',
        catalogCard: 'assets/images/a2eac59e2ce6eac3c3ab3e1ea7755a20ebff888c.png',
        relatedCard: 'assets/images/67b1a351f5211e4982f23f8859e3d96932a8e78d.png',
        cartThumb: 'assets/images/db2ad74f42155a7dd29b8a448ad1c77baef41abb.png',
        gallery: [
          {
            main: 'assets/images/a2eac59e2ce6eac3c3ab3e1ea7755a20ebff888c.png',
            thumb: 'assets/images/67b1a351f5211e4982f23f8859e3d96932a8e78d.png',
            alt: 'Anker Prime 67W GaN wall charger'
          }
        ]
      },
      colors: [
        { name: 'Graphite', hex: '#202322', className: 'black' }
      ],
      defaultVariant: 'Graphite · 67W / 3 ports (Qatar UK plug)',
      specsLeft: [
        { label: 'Total output', value: '67 W max across 2 × USB-C and 1 × USB-A' },
        { label: 'Technology', value: 'GaNPrime with PowerIQ 4.0 & ActiveShield 2.0' },
        { label: 'Compatibility', value: 'MacBook Pro/Air, iPhone, iPad, USB-C notebooks' }
      ],
      specsRight: [
        { label: 'Weight', value: '136 g' },
        { label: 'Dimensions', value: '39.8 × 38.5 × 50 mm (Qatar Type G plug)' },
        { label: 'In the box', value: 'Anker Prime 67W GaN Wall Charger, welcome guide' }
      ]
    }
  ],
  cart: [
    {
      productId: 'wh-1000xm5',
      variant: 'Black · Wireless noise-canceling headphones',
      quantity: 1
    },
    {
      productId: 'prime-67w',
      variant: 'Graphite · 67W / 3 ports (Qatar UK plug)',
      quantity: 1
    }
  ],
  promos: [
    { code: 'QATAR10', discountPercent: 10, description: '10% off all orders across Qatar', active: true, uses: 36 },
    { code: 'AFCORE10', discountPercent: 10, description: '10% off entire afcore order', active: true, uses: 24 },
    { code: 'DOHA20', discountPercent: 20, description: 'VIP Doha Studio 20% discount', active: true, uses: 11 }
  ],
  orders: [
    {
      id: 'ORD-1048',
      customer: 'Tariq Al-Kuwari',
      email: 'tariq@qatarstudio.qa',
      phone: '+974 5512 4800',
      address: 'The Pearl-Qatar, Porto Arabia Tower 8, Doha',
      date: '2026-10-11 14:22',
      status: 'Processing',
      total: 1485,
      items: [
        { productId: 'wh-1000xm5', name: 'WH-1000XM5', brand: 'SONY', price: 1270, quantity: 1, variant: 'Black' },
        { productId: 'prime-67w', name: 'Prime 67W', brand: 'ANKER', price: 215, quantity: 1, variant: 'Graphite' }
      ]
    },
    {
      id: 'ORD-1047',
      customer: 'Noor Al-Sulaiti',
      email: 'noor@lusaildesign.qa',
      phone: '+974 6620 9110',
      address: 'Lusail Marina District, Tower 4, Lusail',
      date: '2026-10-11 11:05',
      status: 'Shipped',
      total: 1784,
      items: [
        { productId: 'acton-iii', name: 'Acton III', brand: 'MARSHALL', price: 1020, quantity: 1, variant: 'Black' },
        { productId: 'mx-keys-s', name: 'MX Keys S', brand: 'LOGITECH', price: 399, quantity: 1, variant: 'Graphite' },
        { productId: 'mx-master-3s', name: 'MX Master 3S', brand: 'LOGITECH', price: 365, quantity: 1, variant: 'Graphite' }
      ]
    },
    {
      id: 'ORD-1046',
      customer: 'Hamad Al-Marri',
      email: 'hamad@msheireb.qa',
      phone: '+974 3340 1200',
      address: 'Msheireb Downtown, Sikkat Wadi, Doha',
      date: '2026-10-10 18:40',
      status: 'Delivered',
      total: 549,
      items: [
        { productId: 'ear', name: 'Ear', brand: 'NOTHING', price: 549, quantity: 1, variant: 'White' }
      ]
    },
    {
      id: 'ORD-1045',
      customer: 'Dana Al-Dosari',
      email: 'dana@westbay.qa',
      phone: '+974 5590 7731',
      address: 'West Bay Diplomatic Area, Street 850, Doha',
      date: '2026-10-09 09:15',
      status: 'Delivered',
      total: 1270,
      items: [
        { productId: 'wh-1000xm5', name: 'WH-1000XM5', brand: 'SONY', price: 1270, quantity: 1, variant: 'Silver' }
      ]
    }
  ]
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
}

function loadStoreData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = cloneDefaults();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    const def = cloneDefaults();
    return {
      settings: { ...def.settings, ...(parsed.settings || {}), hero: { ...def.settings.hero, ...(parsed.settings?.hero || {}) } },
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : def.products,
      cart: Array.isArray(parsed.cart) ? parsed.cart : def.cart,
      promos: Array.isArray(parsed.promos) ? parsed.promos : def.promos,
      orders: Array.isArray(parsed.orders) ? parsed.orders : def.orders
    };
  } catch (e) {
    console.warn('Failed to load store data from localStorage, using defaults:', e);
    return cloneDefaults();
  }
}

function saveStoreData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('form-store-updated', { detail: data }));
  } catch (e) {
    console.error('Failed to save store data:', e);
  }
}

function resetStoreDataToDefaults() {
  const def = cloneDefaults();
  saveStoreData(def);
  return def;
}

function applyThemeTokens(settings) {
  if (!settings) return;
  const root = document.documentElement;
  if (settings.primaryColor) root.style.setProperty('--color-primary', settings.primaryColor);
  if (settings.inkColor) root.style.setProperty('--color-ink', settings.inkColor);
  if (settings.surfaceColor) root.style.setProperty('--color-surface', settings.surfaceColor);
}

window.FormStore = {
  STORAGE_KEY,
  FIGMA_IMAGE_LIBRARY,
  DEFAULT_STORE_DATA,
  loadStoreData,
  saveStoreData,
  resetStoreDataToDefaults,
  applyThemeTokens
};
