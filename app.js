let store = window.FormStore.loadStoreData();
window.FormStore.applyThemeTokens(store.settings);

const MAX_CATALOG_PRICE = 2000;

const state = {
  view: 'home', // 'home' | 'catalog' | 'product' | 'cart'
  activeNav: 'Home',
  catalog: {
    category: 'All products',
    search: '',
    minPrice: 0,
    maxPrice: MAX_CATALOG_PRICE,
    brands: new Set(),
    inStockOnly: false,
    sortBy: 'featured'
  },
  pdp: {
    productId: (store.products[0] && store.products[0].id) || 'wh-1000xm5',
    selectedPhotoIndex: 0,
    selectedColorIndex: 0,
    quantity: 1,
    activeTab: 'specs'
  },
  promoCode: '',
  discountRate: 0
};

function getProducts() {
  return store.products || [];
}

function getProduct(id) {
  const list = getProducts();
  return list.find((p) => p.id === id) || list[0] || {
    id: 'fallback',
    brand: 'AFCORE',
    brandLabel: 'afcore',
    name: 'Product',
    price: 0,
    category: 'Audio',
    inStock: true,
    shortDesc: '',
    longDesc: '',
    rating: 5.0,
    reviewsCount: 1,
    images: {
      homeCard: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
      catalogCard: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
      relatedCard: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
      cartThumb: 'assets/images/73c1a102034d231939a84a9350c63d1402b7ac77.png',
      gallery: [{
        main: 'assets/images/4140f884579f6f4ed29fc748d8e5a3a301958387.png',
        thumb: 'assets/images/c3bd1b9e91f27ecf79661187c7b76499b7fd4835.png',
        alt: 'Product'
      }]
    },
    colors: [{ name: 'Black', hex: '#202322', className: 'black' }],
    specsLeft: [],
    specsRight: []
  };
}

function saveStore() {
  window.FormStore.saveStoreData(store);
}

function formatPrice(num) {
  const n = Number(num || 0);
  const formatted = Number.isInteger(n)
    ? n.toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `QAR ${formatted}`;
}

function getTotalCartCount() {
  return (store.cart || []).reduce((sum, item) => sum + item.quantity, 0);
}

function showToast(message, showCartLink = true) {
  const toast = document.getElementById('toast');
  const textEl = document.getElementById('toast-text');
  const actionEl = document.getElementById('toast-action');
  if (!toast || !textEl || !actionEl) return;
  textEl.textContent = message;
  actionEl.style.display = showCartLink ? 'inline' : 'none';
  toast.classList.add('visible');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

function navigate(view, options = {}) {
  state.view = view;
  if (view === 'home') {
    state.activeNav = 'Home';
  } else if (view === 'catalog') {
    if (options.category) {
      state.catalog.category = options.category;
      state.activeNav = options.category === 'All products' ? 'Shop all' : options.category;
    } else {
      state.activeNav =
        state.catalog.category === 'All products' ? 'Shop all' : state.catalog.category;
    }
  } else if (view === 'product') {
    if (options.productId) {
      const prod = getProduct(options.productId);
      state.pdp.productId = prod.id;
      state.pdp.selectedPhotoIndex = 0;
      state.pdp.selectedColorIndex = 0;
      state.pdp.quantity = 1;
      state.pdp.activeTab = 'specs';
      state.activeNav = prod.category;
    } else {
      const prod = getProduct(state.pdp.productId);
      state.activeNav = prod.category;
    }
  } else if (view === 'cart') {
    state.activeNav = '';
  }

  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (options.focusSearch) {
    setTimeout(() => {
      const input = document.getElementById('catalog-search-input');
      if (input) input.focus();
    }, 100);
  }
}

function createProductCardHTML(product, mode = 'home') {
  const imgSrc =
    mode === 'catalog'
      ? product.images.catalogCard
      : mode === 'related'
      ? product.images.relatedCard
      : product.images.homeCard;
  const mediaClass = mode === 'related' ? 'product-media compact' : 'product-media';

  let badgeText = product.badge;
  if (!product.inStock) {
    badgeText = 'Out of stock';
  }
  const badgeHTML = badgeText
    ? `<div class="product-badge">${badgeText}</div>`
    : '';

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="${mediaClass}">
        <img src="${imgSrc}" alt="${product.brandLabel} ${product.name}" loading="lazy" />
        ${badgeHTML}
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand}</span>
        <div class="product-name-price">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <p class="product-desc">${product.shortDesc}</p>
      </div>
    </article>
  `;
}

function renderStorefrontCMS() {
  const s = store.settings;
  window.FormStore.applyThemeTokens(s);

  // Announcement bar
  const annBar = document.getElementById('site-announcement-bar');
  const annText = document.getElementById('site-announcement-text');
  if (annBar && annText) {
    const isVisible = s.announcementEnabled !== false && s.announcementVisible !== false;
    annBar.style.display = isVisible ? 'flex' : 'none';
    annText.textContent = s.announcementText || '';
  }

  // Brand logos & footer copy
  const brandName = s.brandName || 'afcore';
  const brandLogo = document.getElementById('site-brand-logo');
  if (brandLogo) brandLogo.textContent = brandName;
  const footerLogo = document.getElementById('footer-brand-logo');
  if (footerLogo) footerLogo.textContent = brandName;
  const checkoutTitle = document.getElementById('checkout-modal-title');
  if (checkoutTitle) checkoutTitle.textContent = `Checkout — ${brandName} Qatar`;
  const footerPromise = document.getElementById('footer-brand-promise');
  if (footerPromise) footerPromise.textContent = s.brandPromise || s.brandTagline || '';
  const footerCopy = document.getElementById('footer-copyright');
  if (footerCopy) footerCopy.textContent = s.copyrightText || '';

  // Hero section
  const hero = s.hero || {};
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
  };
  setTxt('home-hero-eyebrow', hero.eyebrow);
  setTxt('home-hero-headline', hero.headline);
  setTxt('home-hero-desc', hero.description);
  setTxt('home-hero-cta', hero.ctaLabel);
  setTxt('home-hero-caption-title', hero.captionTitle);
  setTxt('home-hero-caption-desc', hero.captionDesc || hero.captionSubtitle);

  const heroImg = document.getElementById('home-hero-img');
  if (heroImg && hero.image) {
    heroImg.src = hero.image;
  }

  // Home headings
  setTxt('home-categories-heading', s.categoriesSectionHeading || s.categoriesHeading);
  setTxt('home-favorites-heading', s.favoritesHeading);
  setTxt('home-favorites-subtext', s.favoritesSubtext);

  // Promise bar shipping threshold text
  const thresh = Number(s.freeShippingThreshold) || 350;
  setTxt('promise-shipping-desc', `Free delivery across Qatar on orders over ${formatPrice(thresh)}`);

  // Catalog page header
  setTxt('catalog-page-title', s.catalogTitle);
  setTxt('catalog-page-subtitle', s.catalogSubtitle);
}

function renderHeader() {
  const countEl = document.getElementById('nav-cart-count');
  if (countEl) countEl.textContent = `(${getTotalCartCount()})`;

  document.querySelectorAll('.browse-links .nav-link').forEach((link) => {
    const label = link.getAttribute('data-nav');
    link.classList.toggle('active', label === state.activeNav);
  });

  document.querySelectorAll('.figma-screen-switcher .switcher-btn').forEach((btn) => {
    const v = btn.getAttribute('data-screen');
    if (v) {
      btn.classList.toggle('active', v === state.view);
    }
  });
}

function renderHome() {
  // Categories grid from store.settings.categories using exact styles.css classes
  const catGrid = document.getElementById('home-categories-grid');
  if (catGrid) {
    const cats = store.settings.categories || [];
    catGrid.innerHTML = cats
      .map(
        (cat) => `
        <article class="category-card" data-category="${cat.name}">
          <div class="category-image">
            <img src="${cat.image}" alt="${cat.name} category" loading="lazy" />
          </div>
          <div class="category-info">
            <div class="category-link-row">
              <h3 class="category-name">${cat.name}</h3>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5.25 12.75L12.75 5.25M12.75 5.25H6M12.75 5.25V12" stroke="#202322" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <p class="category-desc">${cat.description || cat.subtitle || ''}</p>
          </div>
        </article>
      `
      )
      .join('');
  }

  // Everyday favorites grid (featuredOnHome products, or first 4 if none marked)
  const favGrid = document.getElementById('home-favorites-grid');
  if (favGrid) {
    const products = getProducts();
    let featured = products.filter((p) => p.featuredOnHome);
    if (featured.length === 0) {
      featured = products.slice(0, 4);
    }
    favGrid.innerHTML = featured.map((p) => createProductCardHTML(p, 'home')).join('');
  }
}

function getFilteredCatalogProducts() {
  const { category, search, minPrice, maxPrice, brands, inStockOnly, sortBy } = state.catalog;
  const q = search.trim().toLowerCase();

  let list = getProducts().filter((p) => {
    if (category !== 'All products' && p.category !== category) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (brands.size > 0 && !brands.has(p.brandLabel)) return false;
    if (inStockOnly && !p.inStock) return false;
    if (q) {
      const hay = `${p.name} ${p.brand} ${p.shortDesc} ${p.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sortBy === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-asc') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
}

function renderCatalog() {
  const products = getProducts();
  const bcCurrent = document.getElementById('catalog-breadcrumb-current');
  if (bcCurrent) {
    bcCurrent.textContent =
      state.catalog.category === 'All products' ? 'Shop all' : state.catalog.category;
  }

  // Dynamically populate Category Filter list with live counts
  const catListEl = document.getElementById('catalog-category-filter-list');
  if (catListEl) {
    const categories = ['All products', 'Audio', 'Computing', 'Accessories'];
    catListEl.innerHTML = categories
      .map((cat) => {
        const count =
          cat === 'All products'
            ? products.length
            : products.filter((p) => p.category === cat).length;
        const activeClass = state.catalog.category === cat ? 'active' : '';
        return `
          <button class="category-filter-option ${activeClass}" data-cat="${cat}">
            <span>${cat}</span>
            <span class="category-filter-count">${count}</span>
          </button>
        `;
      })
      .join('');
  }

  // Dynamically populate Brand checkboxes from current products
  const brandListEl = document.getElementById('catalog-brand-filter-list');
  if (brandListEl) {
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brandLabel).filter(Boolean)));
    brandListEl.innerHTML = uniqueBrands
      .map((brand) => {
        const checkedClass = state.catalog.brands.has(brand) ? 'checked' : '';
        return `
          <label class="brand-option ${checkedClass}" data-brand="${brand}">
            <span class="custom-checkbox">
              <svg viewBox="0 0 10 8" fill="none"><path d="M1 4L3.8 6.8L9 1" stroke="#FAF8F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="brand-name">${brand}</span>
          </label>
        `;
      })
      .join('');
  }

  // Update price slider & inputs
  const minInput = document.getElementById('price-min-input');
  const maxInput = document.getElementById('price-max-input');
  const minRange = document.getElementById('price-min-range');
  const maxRange = document.getElementById('price-max-range');
  const trackFill = document.getElementById('price-track-fill');

  if (minInput && document.activeElement !== minInput) {
    minInput.value = `QAR ${state.catalog.minPrice}`;
  }
  if (maxInput && document.activeElement !== maxInput) {
    maxInput.value = `QAR ${state.catalog.maxPrice.toLocaleString('en-US')}`;
  }
  if (minRange) minRange.value = state.catalog.minPrice;
  if (maxRange) maxRange.value = state.catalog.maxPrice;

  if (trackFill) {
    const leftPct = (state.catalog.minPrice / MAX_CATALOG_PRICE) * 100;
    const rightPct = 100 - (state.catalog.maxPrice / MAX_CATALOG_PRICE) * 100;
    trackFill.style.left = `${leftPct}%`;
    trackFill.style.right = `${rightPct}%`;
  }

  // Availability toggle
  const stockToggle = document.getElementById('stock-toggle');
  if (stockToggle) {
    stockToggle.classList.toggle('active', state.catalog.inStockOnly);
  }

  // Results
  const filtered = getFilteredCatalogProducts();
  const countEl = document.getElementById('catalog-results-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`;
  }

  const gridEl = document.getElementById('catalog-products-grid');
  if (gridEl) {
    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 64px 0; text-align: center; color: var(--color-muted); font-size: 14px;">
          No products match your selected filters. <button id="empty-reset-btn" style="color: var(--color-ink); font-weight: 600; text-decoration: underline; margin-left: 6px;">Reset filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('empty-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetCatalogFilters);
      }
    } else {
      gridEl.innerHTML = filtered.map((p) => createProductCardHTML(p, 'catalog')).join('');
    }
  }

  const endLabel = document.getElementById('catalog-end-label');
  if (endLabel) {
    if (filtered.length === products.length) {
      endLabel.textContent = `You've seen all ${products.length} products. Stocked in Doha, Qatar.`;
    } else {
      endLabel.textContent = `Showing ${filtered.length} of ${products.length} products. Stocked in Doha, Qatar.`;
    }
  }
}

function renderPDP() {
  const product = getProduct(state.pdp.productId);
  const gallery = product.images.gallery || [];
  const activePhoto = gallery[state.pdp.selectedPhotoIndex] || gallery[0] || {
    main: product.images.homeCard,
    thumb: product.images.homeCard,
    alt: product.name
  };
  const colors = product.colors || [{ name: 'Default', hex: '#202322', className: 'black' }];
  const activeColor = colors[state.pdp.selectedColorIndex] || colors[0];

  // Breadcrumb
  document.getElementById('pdp-bc-category').textContent = product.category;
  document.getElementById('pdp-bc-product').textContent = product.name;

  // Main gallery image
  const mainImg = document.getElementById('pdp-main-img');
  mainImg.src = activePhoto.main;
  mainImg.alt = activePhoto.alt;

  // Thumbnails
  const thumbsContainer = document.getElementById('pdp-thumbs-list');
  thumbsContainer.innerHTML = gallery
    .map(
      (item, idx) => `
      <button class="thumb-btn ${idx === state.pdp.selectedPhotoIndex ? 'active' : ''}" data-photo-idx="${idx}" aria-label="View angle ${idx + 1}">
        <img src="${item.thumb}" alt="${item.alt}" />
      </button>
    `
    )
    .join('');

  // Product Identity
  document.getElementById('pdp-brand').textContent = product.brand;
  document.getElementById('pdp-title').textContent = product.name;
  document.getElementById('pdp-subtitle').textContent = product.shortDesc;
  document.getElementById('pdp-rating-score').textContent = Number(product.rating || 4.8).toFixed(1);
  document.getElementById('pdp-reviews-link').textContent = `${product.reviewsCount || 0} reviews`;
  document.getElementById('pdp-price').textContent = formatPrice(product.price);
  document.getElementById('pdp-description').textContent = product.longDesc;

  // Stock status indicator
  const stockDot = document.getElementById('pdp-stock-dot');
  const stockLabel = document.getElementById('pdp-stock-label');
  if (stockDot && stockLabel) {
    if (product.inStock) {
      stockDot.style.backgroundColor = 'var(--color-primary)';
      stockLabel.textContent = 'In stock in Doha · Ready for same-day delivery';
    } else {
      stockDot.style.backgroundColor = '#B42318';
      stockLabel.textContent = 'Currently out of stock in Qatar';
    }
  }

  // Colors
  document.getElementById('pdp-color-label').textContent = `Color — ${activeColor.name}`;
  const swatchesEl = document.getElementById('pdp-color-options');
  swatchesEl.innerHTML = colors
    .map(
      (c, idx) => `
      <button class="swatch-btn ${idx === state.pdp.selectedColorIndex ? 'active' : ''}" data-color-idx="${idx}" aria-label="Select color ${c.name}">
        <span class="swatch-circle ${c.className || ''}" style="background-color: ${c.hex};"></span>
      </button>
    `
    )
    .join('');

  // Quantity & Add to Cart button
  document.getElementById('pdp-qty-value').textContent = state.pdp.quantity;
  const totalAddPrice = product.price * state.pdp.quantity;
  const addBtnLabel = document.getElementById('pdp-add-btn-label');
  const addBtn = document.getElementById('pdp-add-to-cart-btn');
  if (product.inStock) {
    addBtnLabel.textContent = `Add to cart — ${formatPrice(totalAddPrice)}`;
    addBtn.style.opacity = '1';
  } else {
    addBtnLabel.textContent = 'Out of stock';
    addBtn.style.opacity = '0.55';
  }

  // Tabs
  document.getElementById('pdp-tab-reviews').textContent = `Reviews (${product.reviewsCount || 0})`;
  document.querySelectorAll('.info-tabs .tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === state.pdp.activeTab);
  });

  const tabContentEl = document.getElementById('pdp-tab-content');
  if (state.pdp.activeTab === 'specs') {
    const renderCol = (rows) => `
      <div class="spec-col">
        ${(rows || [])
          .map(
            (r) => `
          <div class="spec-row">
            <span class="spec-label">${r.label}</span>
            <span class="spec-value">${r.value}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    tabContentEl.innerHTML = `
      <div class="spec-table">
        ${renderCol(product.specsLeft)}
        ${renderCol(product.specsRight)}
      </div>
    `;
  } else if (state.pdp.activeTab === 'shipping') {
    const thresh = Number(store.settings.freeShippingThreshold) || 350;
    tabContentEl.innerHTML = `
      <div class="tab-panel-Copy">
        <p><strong>Same-Day Doha &amp; Qatar Delivery:</strong> Orders over ${formatPrice(thresh)} ship free across Qatar. Orders placed before 6:00 PM arrive the same evening in Doha, Lusail, The Pearl-Qatar, Al Rayyan, and Al Wakrah.</p>
        <p style="margin-top: 12px;"><strong>14-Day Room to Decide &amp; Local Warranty:</strong> Every item includes an official 1-year Qatar manufacturer warranty and free doorstep return pickup within 14 days.</p>
      </div>
    `;
  } else {
    tabContentEl.innerHTML = `
      <div class="tab-panel-Copy">
        <p style="color: var(--color-ink); font-weight: 600;">★★★★★ ${Number(product.rating || 4.8).toFixed(1)} out of 5 (${product.reviewsCount || 0} verified buyers in Qatar)</p>
        <p style="margin-top: 10px;">"Delivered to West Bay in under 3 hours. Quiet, understated, and built with remarkable attention to detail."</p>
      </div>
    `;
  }

  // Related products
  const allProducts = getProducts();
  const defaultRelated = ['acton-iii', 'ear', 'mx-keys-s', 'prime-67w'];
  let relatedProducts = [];
  if (product.id === 'wh-1000xm5') {
    relatedProducts = defaultRelated
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);
  }
  if (relatedProducts.length < 4) {
    const others = allProducts.filter(
      (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...others].slice(0, 4);
  }

  document.getElementById('pdp-related-grid').innerHTML = relatedProducts
    .map((p) => createProductCardHTML(p, 'related'))
    .join('');
}

function renderCart() {
  const cart = store.cart || [];
  const totalItems = getTotalCartCount();
  document.getElementById('cart-header-count').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

  const subtotal = cart.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + prod.price * item.quantity;
  }, 0);

  const discount = subtotal * state.discountRate;
  const totalBeforeTax = Math.max(0, subtotal - discount);

  const freeThreshold = Number(store.settings.freeShippingThreshold) || 350;
  const flatFee = Number(store.settings.standardShippingFee) || 35;

  // Free shipping message
  const shippingBannerText = document.getElementById('cart-shipping-message');
  if (subtotal >= freeThreshold || subtotal === 0) {
    shippingBannerText.textContent = 'Good news. Your order qualifies for free same-day Doha & Qatar delivery.';
  } else {
    const diff = freeThreshold - subtotal;
    shippingBannerText.textContent = `Add ${formatPrice(diff)} more to qualify for free delivery across Qatar.`;
  }

  // Cart items list
  const listEl = document.getElementById('cart-items-list');
  if (cart.length === 0) {
    listEl.innerHTML = `
      <div style="padding: 56px 0; border-bottom: 1px solid var(--color-border); text-align: center;">
        <p style="font-size: 15px; color: var(--color-muted); margin-bottom: 20px;">Your cart is currently empty.</p>
        <button class="btn-primary" id="empty-cart-shop-btn">Explore the collection</button>
      </div>
    `;
    const btn = document.getElementById('empty-cart-shop-btn');
    if (btn) btn.addEventListener('click', () => navigate('catalog', { category: 'All products' }));
  } else {
    listEl.innerHTML = cart
      .map((item, idx) => {
        const prod = getProduct(item.productId);
        const lineTotal = prod.price * item.quantity;
        const unitText =
          item.quantity === 1
            ? '1 item'
            : `${item.quantity} × ${formatPrice(prod.price)}`;
        return `
          <div class="cart-item-row" data-cart-idx="${idx}">
            <div class="cart-item-media" data-open-product="${prod.id}">
              <img src="${prod.images.cartThumb}" alt="${prod.name}" />
            </div>
            <div class="cart-item-info">
              <span class="product-brand">${prod.brand}</span>
              <h3 class="cart-item-name" data-open-product="${prod.id}">${prod.name}</h3>
              <p class="cart-item-variant">${item.variant}</p>
              <div class="cart-item-controls">
                <div class="quantity-selector">
                  <button class="qty-btn" data-cart-qty-delta="-1" data-cart-idx="${idx}" aria-label="Decrease quantity">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11" stroke="#202322" stroke-width="1.3" stroke-linecap="round"/></svg>
                  </button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn" data-cart-qty-delta="1" data-cart-idx="${idx}" aria-label="Increase quantity">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3V11M3 7H11" stroke="#202322" stroke-width="1.3" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <button class="remove-btn" data-cart-remove="${idx}">Remove</button>
              </div>
            </div>
            <div class="cart-item-price-col">
              <span class="cart-line-total">${formatPrice(lineTotal)}</span>
              <span class="cart-unit-label">${unitText}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Order summary breakdown
  document.getElementById('summary-subtotal-label').textContent = `Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
  document.getElementById('summary-subtotal-amount').textContent = formatPrice(subtotal);
  document.getElementById('summary-shipping-amount').textContent =
    subtotal === 0 ? 'QAR 0' : subtotal >= freeThreshold ? 'Free' : formatPrice(flatFee);

  const shippingFee = subtotal > 0 && subtotal < freeThreshold ? flatFee : 0;
  document.getElementById('summary-total-amount').textContent = formatPrice(
    totalBeforeTax + shippingFee
  );
}

function renderAll() {
  renderStorefrontCMS();
  renderHeader();

  const views = ['home', 'catalog', 'product', 'cart'];
  views.forEach((v) => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      el.style.display = v === state.view ? 'block' : 'none';
    }
  });

  if (state.view === 'home') renderHome();
  else if (state.view === 'catalog') renderCatalog();
  else if (state.view === 'product') renderPDP();
  else if (state.view === 'cart') renderCart();
}

function resetCatalogFilters() {
  state.catalog.category = 'All products';
  state.catalog.search = '';
  state.catalog.minPrice = 0;
  state.catalog.maxPrice = MAX_CATALOG_PRICE;
  state.catalog.brands.clear();
  state.catalog.inStockOnly = false;
  state.catalog.sortBy = 'featured';
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) sortSelect.value = 'featured';
  state.activeNav = 'Shop all';
  renderAll();
}

function initEvents() {
  // Real-time sync when Admin Console updates localStorage in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === window.FormStore.STORAGE_KEY) {
      store = window.FormStore.loadStoreData();
      renderAll();
    }
  });

  // Brand logo -> Home
  document.querySelectorAll('[data-go-home]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('home');
    });
  });

  // Top navigation links
  document.querySelectorAll('.browse-links .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      if (target === 'Home') {
        navigate('home');
      } else if (target === 'Shop all') {
        navigate('catalog', { category: 'All products' });
      } else {
        navigate('catalog', { category: target });
      }
    });
  });

  // Header search icon
  document.getElementById('header-search-btn').addEventListener('click', () => {
    navigate('catalog', { focusSearch: true });
  });

  // Header cart icon
  document.getElementById('header-cart-btn').addEventListener('click', () => {
    navigate('cart');
  });

  // Hero CTA & caption card
  document.getElementById('hero-explore-btn').addEventListener('click', () => {
    navigate('catalog', { category: 'All products' });
  });
  document.getElementById('hero-caption-card').addEventListener('click', () => {
    const targetId = (store.settings.hero && store.settings.hero.captionProductId) || 'wh-1000xm5';
    navigate('product', { productId: targetId });
  });

  // Home "Shop all products" link
  document.getElementById('home-shop-all-link').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('catalog', { category: 'All products' });
  });

  // Mobile Filter Drawer Toggle
  const mobileFilterBtn = document.getElementById('mobile-filter-toggle-btn');
  const filtersSidebar = document.getElementById('catalog-filters-sidebar');
  if (mobileFilterBtn && filtersSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      filtersSidebar.classList.toggle('mobile-open');
      const isOpen = filtersSidebar.classList.contains('mobile-open');
      const label = document.getElementById('mobile-filter-toggle-label');
      if (label) {
        label.textContent = isOpen ? 'Hide Filters' : 'Filters & Categories';
      }
    });
  }

  // Delegated click for dynamic elements (product cards, category cards, filter options, brand options)
  document.body.addEventListener('click', (e) => {
    const catCard = e.target.closest('.category-card');
    if (catCard) {
      const cat = catCard.getAttribute('data-category');
      navigate('catalog', { category: cat });
      return;
    }

    const catFilterBtn = e.target.closest('.category-filter-option');
    if (catFilterBtn) {
      const cat = catFilterBtn.getAttribute('data-cat');
      state.catalog.category = cat;
      state.activeNav = cat === 'All products' ? 'Shop all' : cat;
      renderAll();
      return;
    }

    const brandOpt = e.target.closest('.brand-option');
    if (brandOpt) {
      e.preventDefault();
      const brand = brandOpt.getAttribute('data-brand');
      if (state.catalog.brands.has(brand)) {
        state.catalog.brands.delete(brand);
      } else {
        state.catalog.brands.add(brand);
      }
      renderCatalog();
      return;
    }

    const card = e.target.closest('.product-card');
    if (card) {
      const pid = card.getAttribute('data-product-id');
      navigate('product', { productId: pid });
      return;
    }

    const openProd = e.target.closest('[data-open-product]');
    if (openProd) {
      const pid = openProd.getAttribute('data-open-product');
      navigate('product', { productId: pid });
      return;
    }
  });

  // Catalog filter interactions
  document.getElementById('filter-reset-all').addEventListener('click', resetCatalogFilters);

  const searchInput = document.getElementById('catalog-search-input');
  searchInput.addEventListener('input', (e) => {
    state.catalog.search = e.target.value;
    renderCatalog();
  });

  const minRange = document.getElementById('price-min-range');
  const maxRange = document.getElementById('price-max-range');
  minRange.addEventListener('input', (e) => {
    const val = Math.min(Number(e.target.value), state.catalog.maxPrice - 25);
    state.catalog.minPrice = val;
    renderCatalog();
  });
  maxRange.addEventListener('input', (e) => {
    const val = Math.max(Number(e.target.value), state.catalog.minPrice + 25);
    state.catalog.maxPrice = val;
    renderCatalog();
  });

  const minInput = document.getElementById('price-min-input');
  const maxInput = document.getElementById('price-max-input');
  minInput.addEventListener('change', (e) => {
    const num = parseInt(String(e.target.value).replace(/[^0-9]/g, ''), 10) || 0;
    state.catalog.minPrice = Math.max(0, Math.min(num, state.catalog.maxPrice));
    renderCatalog();
  });
  maxInput.addEventListener('change', (e) => {
    const num = parseInt(String(e.target.value).replace(/[^0-9]/g, ''), 10) || MAX_CATALOG_PRICE;
    state.catalog.maxPrice = Math.min(MAX_CATALOG_PRICE, Math.max(num, state.catalog.minPrice));
    renderCatalog();
  });

  document.getElementById('stock-toggle').addEventListener('click', () => {
    state.catalog.inStockOnly = !state.catalog.inStockOnly;
    renderCatalog();
  });

  document.getElementById('catalog-sort-select').addEventListener('change', (e) => {
    state.catalog.sortBy = e.target.value;
    renderCatalog();
  });

  // PDP interactions
  document.getElementById('pdp-bc-category').addEventListener('click', () => {
    const prod = getProduct(state.pdp.productId);
    navigate('catalog', { category: prod.category });
  });

  document.getElementById('pdp-thumbs-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb-btn');
    if (btn) {
      state.pdp.selectedPhotoIndex = Number(btn.getAttribute('data-photo-idx'));
      renderPDP();
    }
  });

  document.getElementById('pdp-color-options').addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch-btn');
    if (btn) {
      state.pdp.selectedColorIndex = Number(btn.getAttribute('data-color-idx'));
      renderPDP();
    }
  });

  document.getElementById('pdp-qty-minus').addEventListener('click', () => {
    if (state.pdp.quantity > 1) {
      state.pdp.quantity--;
      renderPDP();
    }
  });

  document.getElementById('pdp-qty-plus').addEventListener('click', () => {
    state.pdp.quantity++;
    renderPDP();
  });

  document.getElementById('pdp-add-to-cart-btn').addEventListener('click', () => {
    const prod = getProduct(state.pdp.productId);
    if (!prod.inStock) {
      showToast(`${prod.name} is currently out of stock.`, false);
      return;
    }
    const colors = prod.colors || [{ name: 'Default' }];
    const color = colors[state.pdp.selectedColorIndex] || colors[0];
    const variantStr = `${color.name} · ${prod.shortDesc}`;

    const existing = store.cart.find(
      (item) => item.productId === prod.id && item.variant === variantStr
    );
    if (existing) {
      existing.quantity += state.pdp.quantity;
    } else {
      store.cart.push({
        productId: prod.id,
        variant: variantStr,
        quantity: state.pdp.quantity
      });
    }
    saveStore();
    renderHeader();
    showToast(`Added ${state.pdp.quantity} × ${prod.name} (${color.name}) to your cart.`);
  });

  document.querySelectorAll('.info-tabs .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.pdp.activeTab = btn.getAttribute('data-tab');
      renderPDP();
    });
  });

  document.getElementById('pdp-reviews-link').addEventListener('click', () => {
    state.pdp.activeTab = 'reviews';
    renderPDP();
    document.querySelector('.pdp-specs-section').scrollIntoView({ behavior: 'smooth' });
  });

  // Cart interactions
  document.getElementById('cart-continue-shopping').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('catalog', { category: 'All products' });
  });

  document.getElementById('cart-items-list').addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('[data-cart-qty-delta]');
    if (qtyBtn) {
      const idx = Number(qtyBtn.getAttribute('data-cart-idx'));
      const delta = Number(qtyBtn.getAttribute('data-cart-qty-delta'));
      if (store.cart[idx]) {
        store.cart[idx].quantity += delta;
        if (store.cart[idx].quantity <= 0) {
          store.cart.splice(idx, 1);
        }
        saveStore();
        renderAll();
      }
      return;
    }

    const remBtn = e.target.closest('[data-cart-remove]');
    if (remBtn) {
      const idx = Number(remBtn.getAttribute('data-cart-remove'));
      if (store.cart[idx]) {
        const prod = getProduct(store.cart[idx].productId);
        store.cart.splice(idx, 1);
        saveStore();
        renderAll();
        showToast(`Removed ${prod.name} from your cart.`, false);
      }
    }
  });

  document.getElementById('promo-apply-btn').addEventListener('click', () => {
    const code = document.getElementById('promo-code-input').value.trim().toUpperCase();
    if (!code) return;
    const matchedPromo = (store.promos || []).find(
      (p) => p.code.toUpperCase() === code && p.active
    );
    if (matchedPromo) {
      state.promoCode = matchedPromo.code;
      state.discountRate = (Number(matchedPromo.discountPercent) || 0) / 100;
      renderCart();
      showToast(
        `Promo code ${matchedPromo.code} applied (${matchedPromo.discountPercent}% off).`,
        false
      );
    } else {
      const activeCodes = (store.promos || []).filter((p) => p.active).map((p) => p.code);
      const hint = activeCodes.length ? `Try ${activeCodes[0]}` : 'Invalid or inactive code';
      showToast(`Promo code not recognized. ${hint}.`, false);
    }
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if ((store.cart || []).length === 0) {
      showToast('Your cart is empty.', false);
      return;
    }
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('open');
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('checkout-modal').classList.remove('open');
  });

  document.getElementById('confirm-order-btn').addEventListener('click', () => {
    const nameEl = document.getElementById('checkout-name-input');
    const emailEl = document.getElementById('checkout-email-input');
    const phoneEl = document.getElementById('checkout-phone-input');
    const addrEl = document.getElementById('checkout-address-input');
    const payEl = document.getElementById('checkout-payment-input');

    const customerName = (nameEl && nameEl.value.trim()) || 'Rashid Al-Thani';
    const customerEmail = (emailEl && emailEl.value.trim()) || 'rashid@afcore.qa';
    const phone = (phoneEl && phoneEl.value.trim()) || '+974 5512 8900';
    const address = (addrEl && addrEl.value.trim()) || 'The Pearl-Qatar, Porto Arabia Tower 14, Doha';
    const paymentMethod = (payEl && payEl.value) || 'Apple Pay / Card (QAR)';

    const subtotal = (store.cart || []).reduce((sum, item) => {
      const prod = getProduct(item.productId);
      return sum + prod.price * item.quantity;
    }, 0);
    const discount = subtotal * state.discountRate;
    const afterDiscount = Math.max(0, subtotal - discount);
    const freeThreshold = Number(store.settings.freeShippingThreshold) || 350;
    const flatFee = Number(store.settings.standardShippingFee) || 35;
    const shipping = afterDiscount >= freeThreshold ? 0 : flatFee;
    const total = afterDiscount + shipping;

    // Increment promo usage if applied
    if (state.promoCode) {
      const promoObj = (store.promos || []).find((p) => p.code === state.promoCode);
      if (promoObj) {
        promoObj.uses = (promoObj.uses || 0) + 1;
      }
    }

    // Decrement product stock counts & record order in store.orders
    const orderItems = (store.cart || []).map((item) => {
      const prod = getProduct(item.productId);
      if (typeof prod.stockCount === 'number' && prod.stockCount > 0) {
        prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
        if (prod.stockCount === 0) prod.inStock = false;
      }
      return {
        productId: prod.id,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        quantity: item.quantity,
        variant: item.variant
      };
    });

    const newOrderId = `ORD-${Math.floor(1049 + Math.random() * 8900)}`;
    store.orders.unshift({
      id: newOrderId,
      customer: customerName,
      customerName,
      email: customerEmail,
      customerEmail,
      phone,
      paymentMethod,
      date: new Date().toISOString().slice(0, 10),
      status: 'Processing',
      subtotal,
      shipping,
      discount,
      total,
      address,
      items: orderItems
    });

    store.cart = [];
    state.promoCode = '';
    state.discountRate = 0;
    saveStore();

    document.getElementById('checkout-modal').classList.remove('open');
    renderAll();
    showToast(`Order ${newOrderId} placed for delivery in Qatar!`, false);
  });

  // Toast View Cart
  document.getElementById('toast-action').addEventListener('click', () => {
    document.getElementById('toast').classList.remove('visible');
    navigate('cart');
  });

  // Footer category links
  document.querySelectorAll('[data-footer-cat]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-footer-cat');
      navigate('catalog', { category: cat });
    });
  });

  // Floating Figma Screen Switcher
  document.querySelectorAll('.figma-screen-switcher .switcher-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const screen = btn.getAttribute('data-screen');
      if (!screen) return; // e.g. Admin link
      if (screen === 'product') {
        const firstId = (store.products[0] && store.products[0].id) || 'wh-1000xm5';
        navigate('product', { productId: firstId });
      } else if (screen === 'catalog') {
        navigate('catalog', { category: 'All products' });
      } else {
        navigate(screen);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  renderAll();
});
