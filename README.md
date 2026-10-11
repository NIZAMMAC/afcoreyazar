# afcore Qatar — E-Commerce Storefront & Admin Console

**afcore** (*"Good technology. Less noise. Delivered across Qatar."*) is a complete e-commerce web application and real-time Admin Console built from the Figma design specification and localized for **Doha, Qatar (`QAR`)**.

## Features

### 1. Customer Storefront (`index.html`, `styles.css`, `app.js`)
- **4 Complete Screens:**
  1. **Storefront Home:** Editorial Hero banner, Shop by Category (`Audio`, `Computing`, `Accessories`), Everyday Favorites 4-column grid, and Qatar delivery/warranty promises.
  2. **Product Catalog:** Live search, category filter with dynamic counts, interactive QAR price range slider (`QAR 0` – `QAR 2,000`), brand checkboxes, in-stock toggle, and sorting. Includes a collapsible filter drawer for mobile phones.
  3. **Product Detail Page (PDP):** Multi-angle studio photo gallery, interactive color swatches, stock indicator, quantity selector, and tabbed Specifications / Qatar Delivery & Returns / Verified Reviews.
  4. **Shopping Cart & Qatar Checkout:** Free Doha delivery progress banner (`QAR 350` threshold), line-item quantity & removal controls, promo code redemption (`QATAR10`, `AFCORE10`, `DOHA20`), and Qatar Checkout Modal (`+974` phone, Doha/Lusail/Pearl address, Apple Pay / NAPS / Himyan / Cash on Delivery).

### 2. Full Admin Console (`admin.html`, `admin.css`, `admin.js`)
- **Overview Dashboard:** Live KPIs for Total Revenue (`QAR`), Catalog & Stock, Active Customer Cart, and Active Promotions, plus quick toggles for stock and Home featured placement.
- **Products & Inventory:** Inline price (`QAR`), badge, stock count, in-stock, and Home featured editing, plus a full Add/Edit Product modal with a Figma Studio Image Library picker.
- **Orders & Live Cart Inspector:** Filter and update order fulfillment statuses (`Processing`, `Shipped`, `Delivered`, `Cancelled`), simulate new Qatar orders, and inspect or modify the live customer shopping cart in real time.
- **Storefront CMS:** Edit the announcement bar, free delivery threshold (`QAR`), standard delivery fee (`QAR`), Hero banner copy/CTA/image/floating product card, category cards, and section headings.
- **Promotions:** Create, toggle, and delete percentage discount promo codes.
- **Theme & System:** Live color pickers for `--color-primary`, `--color-ink`, and `--color-surface`, brand wordmark customization, JSON store backup export/import, and Factory Reset.

## Running Locally

Serve the directory with any static HTTP server:

```bash
npx serve -l 3000 .
```

- **Storefront:** `http://localhost:3000/index.html`
- **Admin Console:** `http://localhost:3000/admin.html`
