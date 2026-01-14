// ProductCard component

export function createProductCard({ product, onAddToCart, onViewDetails }) {
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;
  
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(product.rating);
    return filled ? 'star-filled' : 'star-empty';
  }).map((className) => `<span class="star ${className}">★</span>`).join('');
  
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  
  card.innerHTML = `
    <div class="product-image relative">
      <img
        src="${product.image}"
        alt="${product.name}"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
      ${isLowStock && !isOutOfStock ? `
        <span class="badge badge-orange absolute top-2 right-2">
          <svg style="width: 0.75rem; height: 0.75rem; margin-right: 0.25rem; display: inline-block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Low Stock
        </span>
      ` : ''}
      ${isOutOfStock ? `
        <span class="badge badge-red absolute top-2 right-2">
          Out of Stock
        </span>
      ` : ''}
      <span class="badge badge-white absolute top-2 left-2">
        ${product.category}
      </span>
    </div>

    <div class="product-info">
      <h3 class="product-name">
        ${product.name}
      </h3>
      <div class="product-rating">
        <div class="flex">
          ${stars}
        </div>
        <span class="text-xs text-secondary">(${product.reviews.length})</span>
      </div>

      <div class="product-actions">
        <div>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="product-stock">${product.stock} in stock</p>
        </div>
        <button
          class="btn btn-primary btn-sm add-to-cart-btn"
          ${isOutOfStock ? 'disabled' : ''}
        >
          <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Add
        </button>
      </div>
    </div>
  `;
  
  // Setup event listeners
  const imageEl = card.querySelector('.product-image');
  const nameEl = card.querySelector('.product-name');
  const addBtn = card.querySelector('.add-to-cart-btn');
  
  imageEl.addEventListener('click', () => onViewDetails(product));
  nameEl.addEventListener('click', () => onViewDetails(product));
  addBtn.addEventListener('click', () => onAddToCart(product));
  
  return card;
}

// Legacy function for backward compatibility
export function renderProductCard({ product, onAddToCart, onViewDetails }) {
  return createProductCard({ product, onAddToCart, onViewDetails }).outerHTML;
}
