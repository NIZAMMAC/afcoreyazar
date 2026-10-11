let store = window.FormStore.loadStoreData();
let currentSection = 'dashboard';
let productSearchQuery = '';
let orderStatusFilter = 'ALL';

const SECTION_META = {
  dashboard: {
    title: 'Overview',
    subtitle: 'Real-time control over products, storefront layout, orders, and promotions.'
  },
  products: {
    title: 'Products & Inventory',
    subtitle: 'Manage your product catalog, pricing, badges, specifications, and stock availability.'
  },
  orders: {
    title: 'Orders & Live Cart',
    subtitle: 'Manage customer order fulfillment and inspect or modify the active storefront shopping cart.'
  },
  cms: {
    title: 'Storefront CMS',
    subtitle: 'Edit the Hero banner, announcement bar, shipping thresholds, category cards, and headings.'
  },
  promos: {
    title: 'Promotions & Promo Codes',
    subtitle: 'Create and manage discount codes redeemable in the storefront cart.'
  },
  settings: {
    title: 'Theme & System Settings',
    subtitle: 'Customize design tokens, export or import store JSON, or reset to original Figma defaults.'
  }
};

function formatCurrency(val) {
  const n = Number(val || 0);
  const formatted = Number.isInteger(n)
    ? n.toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `QAR ${formatted}`;
}

function showAdminToast(msg) {
  const el = document.getElementById('admin-toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(window.__adminToastTimer);
  window.__adminToastTimer = setTimeout(() => {
    el.classList.remove('visible');
  }, 2600);
}

function persistAndRender(toastMessage) {
  window.FormStore.saveStoreData(store);
  window.FormStore.applyThemeTokens(store.settings);
  renderAdminAll();
  if (toastMessage) showAdminToast(toastMessage);
}

function switchAdminSection(sec) {
  currentSection = sec;
  document.querySelectorAll('.sidebar-link').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-section') === sec);
  });
  document.querySelectorAll('.admin-section').forEach((el) => {
    el.style.display = el.id === `section-${sec}` ? 'block' : 'none';
  });
  const meta = SECTION_META[sec] || SECTION_META.dashboard;
  document.getElementById('topbar-title').textContent = meta.title;
  document.getElementById('topbar-subtitle').textContent = meta.subtitle;
  renderAdminAll();
}
window.switchAdminSection = switchAdminSection;

function statusBadgeClass(status) {
  if (status === 'Delivered') return 'success';
  if (status === 'Shipped') return 'neutral';
  if (status === 'Cancelled') return 'danger';
  return 'warn';
}

function renderSidebarCounts() {
  document.getElementById('admin-brand-logo').textContent = store.settings.brandName || 'afcore';
  document.getElementById('nav-count-products').textContent = store.products.length;
  document.getElementById('nav-count-orders').textContent = store.orders.length;
  document.getElementById('nav-count-promos').textContent = store.promos.filter((p) => p.active).length;
}

function renderDashboard() {
  const activeOrders = store.orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const avgOrder = activeOrders.length ? Math.round(totalRevenue / activeOrders.length) : 0;

  document.getElementById('kpi-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('kpi-revenue-meta').textContent = `Across ${activeOrders.length} orders · Avg ${formatCurrency(avgOrder)}`;

  const inStockCount = store.products.filter((p) => p.inStock).length;
  const totalUnits = store.products.reduce((s, p) => s + Number(p.stockCount ?? 20), 0);
  document.getElementById('kpi-products').textContent = `${inStockCount} / ${store.products.length}`;
  document.getElementById('kpi-products-meta').textContent = `${inStockCount} in stock · ${totalUnits} total units`;

  const cartItemsCount = store.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = store.cart.reduce((s, i) => {
    const p = store.products.find((x) => x.id === i.productId);
    return s + (p ? p.price * i.quantity : 0);
  }, 0);
  document.getElementById('kpi-cart').textContent = formatCurrency(cartTotal);
  document.getElementById('kpi-cart-meta').textContent = `${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'items'} currently in cart`;

  const activePromos = store.promos.filter((p) => p.active).length;
  document.getElementById('kpi-promos').textContent = String(activePromos);
  document.getElementById('kpi-promos-meta').textContent = `Free Doha delivery over ${formatCurrency(store.settings.freeShippingThreshold)}`;

  // Recent Orders table
  const ordersTbody = document.getElementById('dashboard-orders-tbody');
  ordersTbody.innerHTML = store.orders
    .slice(0, 5)
    .map(
      (o) => `
      <tr>
        <td style="font-weight: 600;">${o.id}</td>
        <td>
          <div>${o.customer}</div>
          <div style="font-size: 11px; color: var(--color-muted);">${o.date}</div>
        </td>
        <td><span class="status-pill ${statusBadgeClass(o.status)}">${o.status}</span></td>
        <td style="font-weight: 500;">${formatCurrency(o.total)}</td>
      </tr>
    `
    )
    .join('');

  // Quick product toggles
  const prodTbody = document.getElementById('dashboard-products-tbody');
  prodTbody.innerHTML = store.products
    .map(
      (p) => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.images.catalogCard || p.images.homeCard}" class="table-thumb" alt="${p.name}" />
            <div>
              <div style="font-weight: 600;">${p.name}</div>
              <div style="font-size: 11px; color: var(--color-muted);">${p.brand} · ${p.category}</div>
            </div>
          </div>
        </td>
        <td>${formatCurrency(p.price)}</td>
        <td>
          <button class="switch ${p.inStock ? 'active' : ''}" data-toggle-stock="${p.id}" title="Toggle In Stock">
            <span class="switch-thumb"></span>
          </button>
        </td>
        <td>
          <button class="switch ${p.featuredOnHome ? 'active' : ''}" data-toggle-featured="${p.id}" title="Toggle Everyday Favorites on Home">
            <span class="switch-thumb"></span>
          </button>
        </td>
      </tr>
    `
    )
    .join('');
}

function renderProductsSection() {
  const q = productSearchQuery.trim().toLowerCase();
  const list = store.products.filter((p) => {
    if (!q) return true;
    return `${p.name} ${p.brand} ${p.category} ${p.shortDesc}`.toLowerCase().includes(q);
  });

  const tbody = document.getElementById('admin-products-tbody');
  tbody.innerHTML = list
    .map(
      (p) => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.images.catalogCard || p.images.homeCard}" class="table-thumb" alt="${p.name}" />
            <div>
              <div style="font-weight: 600;">${p.name}</div>
              <div style="font-size: 11px; color: var(--color-muted);">${p.brand} · ${p.shortDesc}</div>
            </div>
          </div>
        </td>
        <td><span class="status-pill neutral">${p.category}</span></td>
        <td>
          <input type="number" class="field-input" value="${p.price}" min="0" step="1" data-inline-price="${p.id}" style="width: 92px; height: 32px;" />
        </td>
        <td>
          <select class="field-select" data-inline-badge="${p.id}" style="width: 132px; height: 32px; font-size: 12px;">
            <option value="" ${!p.badge ? 'selected' : ''}>None</option>
            <option value="Bestseller" ${p.badge === 'Bestseller' ? 'selected' : ''}>Bestseller</option>
            <option value="New arrival" ${p.badge === 'New arrival' ? 'selected' : ''}>New arrival</option>
            <option value="Limited edition" ${p.badge === 'Limited edition' ? 'selected' : ''}>Limited edition</option>
            <option value="Staff pick" ${p.badge === 'Staff pick' ? 'selected' : ''}>Staff pick</option>
          </select>
        </td>
        <td>
          <input type="number" class="field-input" value="${p.stockCount ?? 20}" min="0" step="1" data-inline-stock-count="${p.id}" style="width: 76px; height: 32px;" />
        </td>
        <td>
          <button class="switch ${p.inStock ? 'active' : ''}" data-toggle-stock="${p.id}">
            <span class="switch-thumb"></span>
          </button>
        </td>
        <td>
          <button class="switch ${p.featuredOnHome ? 'active' : ''}" data-toggle-featured="${p.id}">
            <span class="switch-thumb"></span>
          </button>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" data-edit-product="${p.id}">Edit</button>
            <button class="btn btn-danger-outline btn-sm" data-delete-product="${p.id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');
}

function renderOrdersSection() {
  const list = store.orders.filter(
    (o) => orderStatusFilter === 'ALL' || o.status === orderStatusFilter
  );

  const ordersTbody = document.getElementById('admin-orders-tbody');
  if (list.length === 0) {
    ordersTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--color-muted);">No orders match this filter.</td></tr>`;
  } else {
    ordersTbody.innerHTML = list
      .map(
        (o) => `
        <tr>
          <td style="font-weight: 600;">${o.id}</td>
          <td style="color: var(--color-muted); font-size: 12px;">${o.date}</td>
          <td>
            <div style="font-weight: 500;">${o.customer}</div>
            <div style="font-size: 11px; color: var(--color-muted);">${o.email} · ${o.address}</div>
          </td>
          <td>
            <div style="font-size: 12px; line-height: 1.5;">
              ${(o.items || [])
                .map((i) => `${i.quantity}× ${i.name} (${formatCurrency(i.price)})`)
                .join('<br/>')}
            </div>
          </td>
          <td style="font-weight: 600;">${formatCurrency(o.total)}</td>
          <td>
            <select class="field-select" data-order-status="${o.id}" style="width: 136px; height: 32px; font-size: 12px;">
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-danger-outline btn-sm" data-delete-order="${o.id}">Delete</button>
          </td>
        </tr>
      `
      )
      .join('');
  }

  // Live Cart table
  const cartTbody = document.getElementById('admin-live-cart-tbody');
  if (store.cart.length === 0) {
    cartTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 28px; color: var(--color-muted);">Customer cart is currently empty.</td></tr>`;
  } else {
    cartTbody.innerHTML = store.cart
      .map((item, idx) => {
        const prod = store.products.find((p) => p.id === item.productId) || store.products[0];
        if (!prod) return '';
        return `
          <tr>
            <td>
              <div class="table-product-cell">
                <img src="${prod.images.cartThumb || prod.images.homeCard}" class="table-thumb" alt="${prod.name}" />
                <div>
                  <div style="font-weight: 600;">${prod.name}</div>
                  <div style="font-size: 11px; color: var(--color-muted);">${prod.brand}</div>
                </div>
              </div>
            </td>
            <td style="color: var(--color-muted);">${item.variant}</td>
            <td>${formatCurrency(prod.price)}</td>
            <td>
              <input type="number" class="field-input" value="${item.quantity}" min="1" max="99" data-admin-cart-qty="${idx}" style="width: 72px; height: 32px;" />
            </td>
            <td style="font-weight: 600;">${formatCurrency(prod.price * item.quantity)}</td>
            <td style="text-align: right;">
              <button class="btn btn-danger-outline btn-sm" data-admin-cart-remove="${idx}">Remove</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }
}

function renderCMSSection() {
  const s = store.settings;
  document.getElementById('cms-announcement-text').value = s.announcementText || '';
  const annToggle = document.getElementById('cms-announcement-toggle');
  annToggle.classList.toggle('active', s.announcementEnabled !== false);
  document.getElementById('cms-announcement-status').textContent =
    s.announcementEnabled !== false ? 'Visible' : 'Hidden';

  document.getElementById('cms-free-shipping-threshold').value = s.freeShippingThreshold ?? 100;
  document.getElementById('cms-shipping-fee').value = s.standardShippingFee ?? 10;

  // Hero
  document.getElementById('cms-hero-eyebrow').value = s.hero.eyebrow || '';
  document.getElementById('cms-hero-cta').value = s.hero.ctaLabel || '';
  document.getElementById('cms-hero-headline').value = s.hero.headline || '';
  document.getElementById('cms-hero-desc').value = s.hero.description || '';
  document.getElementById('cms-hero-image').value = s.hero.image || '';
  document.getElementById('cms-hero-caption-title').value = s.hero.captionTitle || '';
  document.getElementById('cms-hero-caption-desc').value = s.hero.captionDesc || '';

  const prodSelect = document.getElementById('cms-hero-product-select');
  prodSelect.innerHTML = store.products
    .map(
      (p) =>
        `<option value="${p.id}" ${s.hero.captionProductId === p.id ? 'selected' : ''}>${p.brandLabel} ${p.name} (${formatCurrency(p.price)})</option>`
    )
    .join('');

  // Section headings
  document.getElementById('cms-cat-heading').value = s.categoriesSectionHeading || '';
  document.getElementById('cms-fav-heading').value = s.favoritesHeading || '';
  document.getElementById('cms-fav-subtext').value = s.favoritesSubtext || '';
  document.getElementById('cms-catalog-title').value = s.catalogTitle || '';
  document.getElementById('cms-catalog-subtitle').value = s.catalogSubtitle || '';
  document.getElementById('cms-brand-promise').value = s.brandPromise || '';

  // Category cards
  const catContainer = document.getElementById('cms-categories-cards-editor');
  catContainer.innerHTML = (s.categories || [])
    .map(
      (c, idx) => `
      <div style="border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; background: var(--color-surface); display: flex; flex-direction: column; gap: 12px;">
        <img src="${c.image}" alt="${c.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 4px;" />
        <div class="field-group">
          <label class="field-label">Category Title</label>
          <input type="text" class="field-input" data-cat-name="${idx}" value="${c.name}" />
        </div>
        <div class="field-group">
          <label class="field-label">Card Description</label>
          <input type="text" class="field-input" data-cat-desc="${idx}" value="${c.description}" />
        </div>
        <div class="field-group">
          <label class="field-label">Card Image URL</label>
          <input type="text" class="field-input" data-cat-img="${idx}" value="${c.image}" />
        </div>
      </div>
    `
    )
    .join('');
}

function renderPromosSection() {
  const tbody = document.getElementById('admin-promos-tbody');
  tbody.innerHTML = store.promos
    .map(
      (p, idx) => `
      <tr>
        <td style="font-weight: 700; font-family: monospace; font-size: 14px;">${p.code}</td>
        <td><span class="status-pill success">${p.discountPercent}% OFF</span></td>
        <td style="color: var(--color-muted);">${p.description || 'Storewide discount'}</td>
        <td>${p.uses || 0} uses</td>
        <td>
          <button class="switch ${p.active ? 'active' : ''}" data-toggle-promo="${idx}">
            <span class="switch-thumb"></span>
          </button>
        </td>
        <td style="text-align: right;">
          <button class="btn btn-danger-outline btn-sm" data-delete-promo="${idx}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');
}

function renderSettingsSection() {
  const s = store.settings;
  document.getElementById('theme-brand-name').value = s.brandName || 'afcore';
  document.getElementById('theme-copyright').value = s.copyrightText || '';

  document.getElementById('theme-primary-picker').value = s.primaryColor || '#2458DF';
  document.getElementById('theme-primary-hex').value = s.primaryColor || '#2458DF';

  document.getElementById('theme-ink-picker').value = s.inkColor || '#202322';
  document.getElementById('theme-ink-hex').value = s.inkColor || '#202322';

  document.getElementById('theme-surface-picker').value = s.surfaceColor || '#F4F5F2';
  document.getElementById('theme-surface-hex').value = s.surfaceColor || '#F4F5F2';
}

function renderAdminAll() {
  renderSidebarCounts();
  renderDashboard();
  renderProductsSection();
  renderOrdersSection();
  renderCMSSection();
  renderPromosSection();
  renderSettingsSection();
}

function formatSpecsToText(specs) {
  return (specs || []).map((s) => `${s.label}: ${s.value}`).join('\n');
}

function parseTextToSpecs(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return { label: 'Feature', value: line };
      return {
        label: line.slice(0, idx).trim(),
        value: line.slice(idx + 1).trim()
      };
    });
}

function openProductModal(productId = null) {
  const modal = document.getElementById('product-modal');
  const titleEl = document.getElementById('product-modal-title');
  const libSelect = document.getElementById('edit-prod-figma-image');

  libSelect.innerHTML =
    `<option value="">— Select a studio photo —</option>` +
    window.FormStore.FIGMA_IMAGE_LIBRARY.map(
      (img) => `<option value="${img.url}">${img.label}</option>`
    ).join('');

  if (productId) {
    const p = store.products.find((x) => x.id === productId);
    if (!p) return;
    titleEl.textContent = `Edit Product — ${p.name}`;
    document.getElementById('edit-prod-id').value = p.id;
    document.getElementById('edit-prod-name').value = p.name;
    document.getElementById('edit-prod-brand').value = p.brandLabel || p.brand;
    document.getElementById('edit-prod-category').value = p.category;
    document.getElementById('edit-prod-price').value = p.price;
    document.getElementById('edit-prod-badge').value = p.badge || '';
    document.getElementById('edit-prod-stock').value = p.stockCount ?? 20;
    document.getElementById('edit-prod-short-desc').value = p.shortDesc;
    document.getElementById('edit-prod-variant').value = p.defaultVariant || '';
    document.getElementById('edit-prod-long-desc').value = p.longDesc;
    document.getElementById('edit-prod-image').value =
      p.images.catalogCard || p.images.homeCard || '';
    document.getElementById('edit-prod-specs-left').value = formatSpecsToText(p.specsLeft);
    document.getElementById('edit-prod-specs-right').value = formatSpecsToText(p.specsRight);
  } else {
    titleEl.textContent = 'Add New Product';
    document.getElementById('edit-prod-id').value = '';
    document.getElementById('edit-prod-name').value = '';
    document.getElementById('edit-prod-brand').value = '';
    document.getElementById('edit-prod-category').value = 'Audio';
    document.getElementById('edit-prod-price').value = 199;
    document.getElementById('edit-prod-badge').value = 'New arrival';
    document.getElementById('edit-prod-stock').value = 25;
    document.getElementById('edit-prod-short-desc').value = '';
    document.getElementById('edit-prod-variant').value = '';
    document.getElementById('edit-prod-long-desc').value = '';
    document.getElementById('edit-prod-image').value =
      'assets/images/f2e290bdfee257371f36febae57f479d6663df5d.png';
    document.getElementById('edit-prod-specs-left').value =
      'Connectivity: Bluetooth 5.3\nBattery life: Up to 24 hours';
    document.getElementById('edit-prod-specs-right').value =
      'Weight: 210 g\nIn the box: Product, USB-C cable, guide';
  }

  modal.classList.add('open');
}

function saveProductFromModal() {
  const existingId = document.getElementById('edit-prod-id').value;
  const name = document.getElementById('edit-prod-name').value.trim();
  const brandLabel = document.getElementById('edit-prod-brand').value.trim() || 'Form';
  const category = document.getElementById('edit-prod-category').value;
  const price = parseFloat(document.getElementById('edit-prod-price').value) || 0;
  const badge = document.getElementById('edit-prod-badge').value || null;
  const stockCount = parseInt(document.getElementById('edit-prod-stock').value, 10) || 0;
  const shortDesc =
    document.getElementById('edit-prod-short-desc').value.trim() || 'Considered everyday tech';
  const defaultVariant =
    document.getElementById('edit-prod-variant').value.trim() || `Black · ${shortDesc}`;
  const longDesc =
    document.getElementById('edit-prod-long-desc').value.trim() || shortDesc;
  const imgUrl =
    document.getElementById('edit-prod-image').value.trim() ||
    'assets/images/f2e290bdfee257371f36febae57f479d6663df5d.png';
  const specsLeft = parseTextToSpecs(document.getElementById('edit-prod-specs-left').value);
  const specsRight = parseTextToSpecs(document.getElementById('edit-prod-specs-right').value);

  if (!name) {
    showAdminToast('Please enter a product name.');
    return;
  }

  if (existingId) {
    const p = store.products.find((x) => x.id === existingId);
    if (p) {
      p.name = name;
      p.brandLabel = brandLabel;
      p.brand = brandLabel.toUpperCase();
      p.category = category;
      p.price = price;
      p.badge = badge;
      p.stockCount = stockCount;
      p.inStock = stockCount > 0;
      p.shortDesc = shortDesc;
      p.defaultVariant = defaultVariant;
      p.longDesc = longDesc;
      p.images.homeCard = imgUrl;
      p.images.catalogCard = imgUrl;
      p.images.relatedCard = imgUrl;
      p.images.cartThumb = imgUrl;
      if (p.images.gallery && p.images.gallery.length > 0) {
        p.images.gallery[0].main = imgUrl;
        p.images.gallery[0].thumb = imgUrl;
      }
      p.specsLeft = specsLeft;
      p.specsRight = specsRight;
    }
  } else {
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(Math.random() * 900 + 100);
    store.products.push({
      id: slug,
      brand: brandLabel.toUpperCase(),
      brandLabel,
      name,
      price,
      category,
      badge,
      inStock: stockCount > 0,
      stockCount,
      featuredOnHome: store.products.filter((x) => x.featuredOnHome).length < 4,
      shortDesc,
      longDesc,
      rating: 4.8,
      reviewsCount: 12,
      images: {
        homeCard: imgUrl,
        catalogCard: imgUrl,
        relatedCard: imgUrl,
        cartThumb: imgUrl,
        gallery: [{ main: imgUrl, thumb: imgUrl, alt: name }]
      },
      colors: [
        { name: 'Black', hex: '#202322', className: 'black' },
        { name: 'Silver', hex: '#D4D0C7', className: 'silver' }
      ],
      defaultVariant,
      specsLeft,
      specsRight
    });
  }

  document.getElementById('product-modal').classList.remove('open');
  persistAndRender(existingId ? `Updated ${name}` : `Added ${name} to catalog`);
}

function initAdminEvents() {
  // Sidebar navigation
  document.querySelectorAll('.sidebar-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchAdminSection(btn.getAttribute('data-section'));
    });
  });

  // Quick Add Product buttons
  document.getElementById('quick-add-product-btn').addEventListener('click', () => {
    switchAdminSection('products');
    openProductModal(null);
  });
  document.getElementById('add-product-btn').addEventListener('click', () => {
    openProductModal(null);
  });

  // Modal controls
  document.getElementById('close-product-modal').addEventListener('click', () => {
    document.getElementById('product-modal').classList.remove('open');
  });
  document.getElementById('cancel-product-modal').addEventListener('click', () => {
    document.getElementById('product-modal').classList.remove('open');
  });
  document.getElementById('save-product-modal').addEventListener('click', saveProductFromModal);

  document.getElementById('edit-prod-figma-image').addEventListener('change', (e) => {
    if (e.target.value) {
      document.getElementById('edit-prod-image').value = e.target.value;
    }
  });

  // Product search in admin
  document.getElementById('admin-product-search').addEventListener('input', (e) => {
    productSearchQuery = e.target.value;
    renderProductsSection();
  });

  // Delegated clicks & changes across tables
  document.body.addEventListener('click', (e) => {
    const stockBtn = e.target.closest('[data-toggle-stock]');
    if (stockBtn) {
      const pid = stockBtn.getAttribute('data-toggle-stock');
      const prod = store.products.find((p) => p.id === pid);
      if (prod) {
        prod.inStock = !prod.inStock;
        persistAndRender(`${prod.name} marked ${prod.inStock ? 'In Stock' : 'Out of Stock'}`);
      }
      return;
    }

    const featBtn = e.target.closest('[data-toggle-featured]');
    if (featBtn) {
      const pid = featBtn.getAttribute('data-toggle-featured');
      const prod = store.products.find((p) => p.id === pid);
      if (prod) {
        prod.featuredOnHome = !prod.featuredOnHome;
        persistAndRender(
          `${prod.name} ${prod.featuredOnHome ? 'added to' : 'removed from'} Home Everyday Favorites`
        );
      }
      return;
    }

    const editBtn = e.target.closest('[data-edit-product]');
    if (editBtn) {
      openProductModal(editBtn.getAttribute('data-edit-product'));
      return;
    }

    const delProdBtn = e.target.closest('[data-delete-product]');
    if (delProdBtn) {
      const pid = delProdBtn.getAttribute('data-delete-product');
      const prod = store.products.find((p) => p.id === pid);
      if (prod && store.products.length > 1) {
        store.products = store.products.filter((p) => p.id !== pid);
        store.cart = store.cart.filter((c) => c.productId !== pid);
        persistAndRender(`Deleted ${prod.name}`);
      } else {
        showAdminToast('At least one product must remain in the catalog.');
      }
      return;
    }

    const delOrderBtn = e.target.closest('[data-delete-order]');
    if (delOrderBtn) {
      const oid = delOrderBtn.getAttribute('data-delete-order');
      store.orders = store.orders.filter((o) => o.id !== oid);
      persistAndRender(`Deleted order ${oid}`);
      return;
    }

    const cartRemBtn = e.target.closest('[data-admin-cart-remove]');
    if (cartRemBtn) {
      const idx = Number(cartRemBtn.getAttribute('data-admin-cart-remove'));
      store.cart.splice(idx, 1);
      persistAndRender('Removed item from live customer cart');
      return;
    }

    const togglePromoBtn = e.target.closest('[data-toggle-promo]');
    if (togglePromoBtn) {
      const idx = Number(togglePromoBtn.getAttribute('data-toggle-promo'));
      if (store.promos[idx]) {
        store.promos[idx].active = !store.promos[idx].active;
        persistAndRender(
          `Promo ${store.promos[idx].code} ${store.promos[idx].active ? 'enabled' : 'disabled'}`
        );
      }
      return;
    }

    const delPromoBtn = e.target.closest('[data-delete-promo]');
    if (delPromoBtn) {
      const idx = Number(delPromoBtn.getAttribute('data-delete-promo'));
      if (store.promos[idx]) {
        const code = store.promos[idx].code;
        store.promos.splice(idx, 1);
        persistAndRender(`Deleted promo code ${code}`);
      }
      return;
    }
  });

  document.body.addEventListener('change', (e) => {
    const priceInput = e.target.closest('[data-inline-price]');
    if (priceInput) {
      const pid = priceInput.getAttribute('data-inline-price');
      const prod = store.products.find((p) => p.id === pid);
      if (prod) {
        prod.price = Math.max(0, parseFloat(priceInput.value) || 0);
        persistAndRender(`Updated ${prod.name} price to ${formatCurrency(prod.price)}`);
      }
      return;
    }

    const badgeSelect = e.target.closest('[data-inline-badge]');
    if (badgeSelect) {
      const pid = badgeSelect.getAttribute('data-inline-badge');
      const prod = store.products.find((p) => p.id === pid);
      if (prod) {
        prod.badge = badgeSelect.value || null;
        persistAndRender(`Updated ${prod.name} badge`);
      }
      return;
    }

    const stockInput = e.target.closest('[data-inline-stock-count]');
    if (stockInput) {
      const pid = stockInput.getAttribute('data-inline-stock-count');
      const prod = store.products.find((p) => p.id === pid);
      if (prod) {
        prod.stockCount = Math.max(0, parseInt(stockInput.value, 10) || 0);
        prod.inStock = prod.stockCount > 0;
        persistAndRender(`Updated ${prod.name} stock to ${prod.stockCount} units`);
      }
      return;
    }

    const orderStatusSel = e.target.closest('[data-order-status]');
    if (orderStatusSel) {
      const oid = orderStatusSel.getAttribute('data-order-status');
      const ord = store.orders.find((o) => o.id === oid);
      if (ord) {
        ord.status = orderStatusSel.value;
        persistAndRender(`Order ${oid} status updated to ${ord.status}`);
      }
      return;
    }

    const cartQtyInput = e.target.closest('[data-admin-cart-qty]');
    if (cartQtyInput) {
      const idx = Number(cartQtyInput.getAttribute('data-admin-cart-qty'));
      if (store.cart[idx]) {
        store.cart[idx].quantity = Math.max(1, parseInt(cartQtyInput.value, 10) || 1);
        persistAndRender('Updated live customer cart quantity');
      }
      return;
    }
  });

  // Orders filter & actions
  document.getElementById('admin-order-status-filter').addEventListener('change', (e) => {
    orderStatusFilter = e.target.value;
    renderOrdersSection();
  });

  document.getElementById('create-demo-order-btn').addEventListener('click', () => {
    const p = store.products[Math.floor(Math.random() * store.products.length)];
    const nextNum = 1049 + store.orders.length;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    store.orders.unshift({
      id: `ORD-${nextNum}`,
      customer: 'Khalid Al-Naimi',
      email: 'khalid@dohastudio.qa',
      phone: '+974 5541 2200',
      address: 'West Bay, Al Funduq Street, Doha, Qatar',
      date: dateStr,
      status: 'Processing',
      total: p.price,
      items: [{ productId: p.id, name: p.name, brand: p.brand, price: p.price, quantity: 1, variant: 'Standard' }]
    });
    persistAndRender(`Simulated new Qatar order ORD-${nextNum}`);
  });

  document.getElementById('admin-reset-figma-cart-btn').addEventListener('click', () => {
    store.cart = [
      { productId: 'wh-1000xm5', variant: 'Black · Wireless noise-canceling headphones', quantity: 1 },
      { productId: 'prime-67w', variant: 'Graphite · 67W / 3 ports (Qatar UK plug)', quantity: 1 }
    ];
    persistAndRender('Restored 2-item cart (QAR 1,485)');
  });

  document.getElementById('admin-clear-cart-btn').addEventListener('click', () => {
    store.cart = [];
    persistAndRender('Emptied live customer cart');
  });

  // CMS Save handlers
  document.getElementById('cms-announcement-toggle').addEventListener('click', () => {
    store.settings.announcementEnabled = store.settings.announcementEnabled === false ? true : false;
    persistAndRender(
      `Announcement bar ${store.settings.announcementEnabled ? 'shown' : 'hidden'}`
    );
  });

  document.getElementById('save-cms-top-btn').addEventListener('click', () => {
    store.settings.announcementText = document.getElementById('cms-announcement-text').value.trim();
    store.settings.freeShippingThreshold =
      parseFloat(document.getElementById('cms-free-shipping-threshold').value) || 0;
    store.settings.standardShippingFee =
      parseFloat(document.getElementById('cms-shipping-fee').value) || 0;
    persistAndRender('Saved announcement & shipping rules');
  });

  document.getElementById('save-cms-hero-btn').addEventListener('click', () => {
    store.settings.hero.eyebrow = document.getElementById('cms-hero-eyebrow').value.trim();
    store.settings.hero.ctaLabel = document.getElementById('cms-hero-cta').value.trim();
    store.settings.hero.headline = document.getElementById('cms-hero-headline').value;
    store.settings.hero.description = document.getElementById('cms-hero-desc').value.trim();
    store.settings.hero.image = document.getElementById('cms-hero-image').value.trim();
    store.settings.hero.captionProductId = document.getElementById('cms-hero-product-select').value;
    store.settings.hero.captionTitle = document.getElementById('cms-hero-caption-title').value.trim();
    store.settings.hero.captionDesc = document.getElementById('cms-hero-caption-desc').value.trim();
    persistAndRender('Saved Home Hero banner settings');
  });

  document.getElementById('save-cms-sections-btn').addEventListener('click', () => {
    store.settings.categoriesSectionHeading = document.getElementById('cms-cat-heading').value.trim();
    store.settings.favoritesHeading = document.getElementById('cms-fav-heading').value.trim();
    store.settings.favoritesSubtext = document.getElementById('cms-fav-subtext').value.trim();
    store.settings.catalogTitle = document.getElementById('cms-catalog-title').value.trim();
    store.settings.catalogSubtitle = document.getElementById('cms-catalog-subtitle').value.trim();
    store.settings.brandPromise = document.getElementById('cms-brand-promise').value.trim();

    document.querySelectorAll('[data-cat-name]').forEach((input) => {
      const idx = Number(input.getAttribute('data-cat-name'));
      if (store.settings.categories[idx]) {
        store.settings.categories[idx].name = input.value.trim();
      }
    });
    document.querySelectorAll('[data-cat-desc]').forEach((input) => {
      const idx = Number(input.getAttribute('data-cat-desc'));
      if (store.settings.categories[idx]) {
        store.settings.categories[idx].description = input.value.trim();
      }
    });
    document.querySelectorAll('[data-cat-img]').forEach((input) => {
      const idx = Number(input.getAttribute('data-cat-img'));
      if (store.settings.categories[idx]) {
        store.settings.categories[idx].image = input.value.trim();
      }
    });

    persistAndRender('Saved section headings & category cards');
  });

  // Promo form
  document.getElementById('add-promo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('new-promo-code').value.trim().toUpperCase();
    const pct = Math.min(95, Math.max(1, parseInt(document.getElementById('new-promo-pct').value, 10) || 10));
    const desc =
      document.getElementById('new-promo-desc').value.trim() || `${pct}% off entire order`;
    if (!code) return;

    const existing = store.promos.find((p) => p.code === code);
    if (existing) {
      existing.discountPercent = pct;
      existing.description = desc;
      existing.active = true;
    } else {
      store.promos.unshift({ code, discountPercent: pct, description: desc, active: true, uses: 0 });
    }
    document.getElementById('new-promo-code').value = '';
    document.getElementById('new-promo-pct').value = '';
    document.getElementById('new-promo-desc').value = '';
    persistAndRender(`Promo code ${code} (${pct}% off) saved`);
  });

  // Theme color sync
  const bindColorPair = (pickerId, hexId) => {
    const picker = document.getElementById(pickerId);
    const hex = document.getElementById(hexId);
    picker.addEventListener('input', () => {
      hex.value = picker.value.toUpperCase();
    });
    hex.addEventListener('input', () => {
      if (/^#[0-9A-Fa-f]{6}$/.test(hex.value.trim())) {
        picker.value = hex.value.trim();
      }
    });
  };
  bindColorPair('theme-primary-picker', 'theme-primary-hex');
  bindColorPair('theme-ink-picker', 'theme-ink-hex');
  bindColorPair('theme-surface-picker', 'theme-surface-hex');

  document.getElementById('save-theme-btn').addEventListener('click', () => {
    store.settings.brandName = document.getElementById('theme-brand-name').value.trim() || 'afcore';
    store.settings.copyrightText = document.getElementById('theme-copyright').value.trim();
    store.settings.primaryColor = document.getElementById('theme-primary-hex').value.trim() || '#2458DF';
    store.settings.inkColor = document.getElementById('theme-ink-hex').value.trim() || '#202322';
    store.settings.surfaceColor = document.getElementById('theme-surface-hex').value.trim() || '#F4F5F2';
    persistAndRender('Saved brand & design system tokens');
  });

  // Export / Import / Reset
  document.getElementById('export-json-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afcore-store-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showAdminToast('Exported store JSON');
  });

  document.getElementById('import-json-input').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.products && parsed.settings) {
          store = parsed;
          persistAndRender('Imported store configuration');
        } else {
          showAdminToast('Invalid store JSON file');
        }
      } catch (err) {
        showAdminToast('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  });

  const handleReset = () => {
    store = window.FormStore.resetStoreDataToDefaults();
    window.FormStore.applyThemeTokens(store.settings);
    renderAdminAll();
    showAdminToast('Restored all store data to original Figma defaults');
  };

  document.getElementById('factory-reset-btn').addEventListener('click', handleReset);
  document.getElementById('sidebar-reset-defaults').addEventListener('click', handleReset);

  // Listen for cross-tab updates from storefront
  window.addEventListener('storage', (e) => {
    if (e.key === window.FormStore.STORAGE_KEY) {
      store = window.FormStore.loadStoreData();
      window.FormStore.applyThemeTokens(store.settings);
      renderAdminAll();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  window.FormStore.applyThemeTokens(store.settings);
  initAdminEvents();
  renderAdminAll();
});
