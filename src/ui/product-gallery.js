// ProductGallery component

import { createProductCard } from './product-card.js';

export function renderProductGallery({ products, onAddToCart, onViewDetails }) {
  const galleryEl = document.getElementById('products-view');
  
  galleryEl.innerHTML = `
    <div class="space-y-6">
      <div class="section-header">
        <h2 class="section-title">Products</h2>
        <p class="section-subtitle">Browse our product catalog</p>
      </div>

      <div id="products-grid" class="grid grid-cols-1 grid-cols-sm-2 grid-cols-lg-3 grid-cols-xl-4">
      </div>
    </div>
  `;
  
  const productsGrid = galleryEl.querySelector('#products-grid');
  products.forEach((product) => {
    const card = createProductCard({ product, onAddToCart, onViewDetails });
    productsGrid.appendChild(card);
  });
}
