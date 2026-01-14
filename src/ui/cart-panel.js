// CartPanel component

export function renderCartPanel({ items, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const cartEl = document.getElementById('cart-view');
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  if (items.length === 0) {
    cartEl.innerHTML = `
      <div class="space-y-6">
        <div class="section-header">
          <h2 class="section-title">Shopping Cart</h2>
          <p class="section-subtitle">0 items in your cart</p>
        </div>
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h3 class="empty-state-title">Your cart is empty</h3>
          <p class="empty-state-text">Add some products to get started</p>
        </div>
      </div>
    `;
    return;
  }
  
  const itemsHTML = items.map((item) => `
    <div class="cart-item">
      <div class="cart-item-content">
        <div class="cart-item-image">
          <img
            src="${item.image}"
            alt="${item.name}"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>

        <div class="cart-item-details">
          <h3 class="font-semibold text-primary truncate">${item.name}</h3>
          <p class="text-lg font-bold text-primary mb-3">$${item.price.toFixed(2)}</p>

          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button
                class="btn btn-outline btn-sm quantity-decrease-btn"
                data-item-id="${item.id}"
                style="width: 2rem; height: 2rem; padding: 0;"
              >
                <svg style="width: 0.75rem; height: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="quantity-display">${item.quantity}</span>
              <button
                class="btn btn-outline btn-sm quantity-increase-btn"
                data-item-id="${item.id}"
                style="width: 2rem; height: 2rem; padding: 0;"
              >
                <svg style="width: 0.75rem; height: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <button
              class="btn btn-ghost btn-sm remove-item-btn"
              data-item-id="${item.id}"
              style="color: var(--error);"
            >
              <svg style="width: 1rem; height: 1rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  cartEl.innerHTML = `
    <div class="space-y-6">
      <div class="section-header">
        <h2 class="section-title">Shopping Cart</h2>
        <p class="section-subtitle">
          ${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div class="grid grid-cols-1 cart-grid" style="gap: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${itemsHTML}
        </div>

        <div>
          <div class="order-summary sticky top-20">
            <h3 class="font-semibold text-primary mb-4">Order Summary</h3>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="order-summary-row">
                <span class="text-secondary">Subtotal</span>
                <span class="font-medium text-primary">$${subtotal.toFixed(2)}</span>
              </div>
              <div class="order-summary-row">
                <span class="text-secondary">Tax (8%)</span>
                <span class="font-medium text-primary">$${tax.toFixed(2)}</span>
              </div>
            </div>

            <div class="separator"></div>

            <div class="order-summary-total">
              <span class="font-semibold text-primary">Total</span>
              <span style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">$${total.toFixed(2)}</span>
            </div>

            <button
              id="checkout-btn"
              class="btn btn-primary btn-lg"
              style="width: 100%;"
            >
              Proceed to Checkout
            </button>

            <p class="text-xs text-secondary text-center mt-4">This is a demo checkout</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Setup event listeners
  const decreaseBtns = cartEl.querySelectorAll('.quantity-decrease-btn');
  const increaseBtns = cartEl.querySelectorAll('.quantity-increase-btn');
  const removeBtns = cartEl.querySelectorAll('.remove-item-btn');
  const checkoutBtn = cartEl.querySelector('#checkout-btn');
  
  decreaseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.itemId);
      const item = items.find(i => i.id === itemId);
      if (item) {
        onUpdateQuantity(itemId, Math.max(1, item.quantity - 1));
      }
    });
  });
  
  increaseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.itemId);
      const item = items.find(i => i.id === itemId);
      if (item) {
        onUpdateQuantity(itemId, item.quantity + 1);
      }
    });
  });
  
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.itemId);
      onRemoveItem(itemId);
    });
  });
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', onCheckout);
  }
}
