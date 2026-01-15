// ProductDetailModal component
import { getImageUrl } from '../services/api.js';

export function renderProductModal({ product, isOpen, onClose, onAddToCart, onSubmitReview }) {
  if (!product || !isOpen) return;
  
  const modalEl = document.getElementById('product-modal');
  const modalContent = modalEl.querySelector('div');
  
  const isOutOfStock = product.stock === 0;
  
  const productStars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(product.rating);
    return filled ? 'star-filled' : 'star-empty';
  }).map((className) => `
    <svg class="star-icon ${className}" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
  `).join('');
  
  const reviewsHTML = product.reviews.length === 0 
    ? '<p class="text-sm text-secondary">No reviews yet. Be the first to review!</p>'
    : product.reviews.map((review) => {
        const reviewStars = Array.from({ length: 5 }, (_, i) => {
          const filled = i < review.rating;
          return filled ? 'star-filled' : 'star-empty';
        }).map((className) => `
          <svg class="star-icon ${className}" style="width: 1rem; height: 1rem;" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        `).join('');
        
        return `
          <div class="review-item">
            <div class="review-header">
              <span class="font-medium text-primary">${review.author}</span>
              <span class="text-xs text-secondary">${review.date}</span>
            </div>
            <div class="review-stars">
              ${reviewStars}
            </div>
            <p class="review-comment">${review.comment}</p>
          </div>
        `;
      }).join('');
  
  modalContent.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-primary">${product.name}</h2>
        <button id="close-modal-btn" class="btn btn-ghost btn-icon">
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 grid-cols-md-2" style="gap: 1.5rem;">
        <div class="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src="${getImageUrl(product.image)}"
            alt="${product.name}"
            style="width: 100%; height: 100%; object-fit: cover;"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22400%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2218%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'"
          />
          <span class="badge badge-white absolute top-3 left-3">
            ${product.category}
          </span>
        </div>

        <div>
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex">
                ${productStars}
              </div>
              <span class="text-sm text-secondary">
                ${product.rating.toFixed(1)} (${product.reviews.length} reviews)
              </span>
            </div>

            <p class="text-3xl font-bold text-primary mb-2">$${product.price.toFixed(2)}</p>

            <p class="text-sm text-secondary mb-4">
              Stock: ${product.stock} units
              ${product.stock < 10 && product.stock > 0 ? '<span class="badge badge-orange" style="margin-left: 0.5rem;">Low Stock</span>' : ''}
              ${isOutOfStock ? '<span class="badge badge-red" style="margin-left: 0.5rem;">Out of Stock</span>' : ''}
            </p>

            <p class="text-secondary" style="line-height: 1.75;">${product.description}</p>
          </div>

          <button
            id="modal-add-to-cart-btn"
            class="btn btn-primary"
            style="width: 100%;"
            ${isOutOfStock ? 'disabled' : ''}
          >
            <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
        <h3 class="font-semibold text-primary mb-4">Customer Reviews (${product.reviews.length})</h3>

        <div class="space-y-4 mb-6" style="max-height: 16rem; overflow-y: auto;">
          ${reviewsHTML}
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
          <h4 class="font-medium text-primary mb-4">Write a Review</h4>
          <div class="space-y-4">
            <div>
              <label class="label">Rating</label>
              <div class="flex gap-1 mt-2" id="rating-stars">
                ${Array.from({ length: 5 }, (_, i) => `
                  <button
                    type="button"
                    class="btn btn-ghost"
                    data-rating="${i + 1}"
                    style="padding: 0; transition: transform 0.2s;"
                  >
                    <svg class="star-icon star-filled" style="width: 1.5rem; height: 1.5rem;" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label for="review-comment" class="label">Your Review</label>
              <textarea
                id="review-comment"
                placeholder="Share your thoughts about this product..."
                rows="3"
                class="textarea"
              ></textarea>
            </div>

            <button
              id="submit-review-btn"
              class="btn btn-primary"
              data-product-id="${product.id}"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Setup rating stars
  let selectedRating = 5;
  const stars = modalContent.querySelectorAll('#rating-stars button');
  stars.forEach((star, index) => {
    star.querySelector('svg').classList.add('star-filled');
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      stars.forEach((s, i) => {
        const svg = s.querySelector('svg');
        svg.classList.remove('star-filled', 'star-empty');
        svg.classList.add(i < selectedRating ? 'star-filled' : 'star-empty');
        svg.style.color = i < selectedRating ? '#facc15' : '#e5e7eb';
      });
    });
  });
  
  // Setup event listeners
  const closeBtn = modalContent.querySelector('#close-modal-btn');
  const addToCartBtn = modalContent.querySelector('#modal-add-to-cart-btn');
  const submitBtn = modalContent.querySelector('#submit-review-btn');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', onClose);
  }
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => onAddToCart(product));
  }
  
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const commentEl = document.getElementById('review-comment');
      const comment = commentEl.value.trim();
      const productId = parseInt(submitBtn.dataset.productId);
      
      if (!comment) {
        return;
      }
      
      onSubmitReview(productId, selectedRating, comment);
      commentEl.value = '';
      selectedRating = 5;
      stars.forEach((s, i) => {
        const svg = s.querySelector('svg');
        svg.classList.remove('star-filled', 'star-empty');
        svg.classList.add('star-filled');
        svg.style.color = '#facc15';
      });
    });
  }
}
