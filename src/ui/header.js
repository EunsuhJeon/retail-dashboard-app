// Header component

export function renderHeader({ cartItemCount, onCartClick, onMenuClick }) { // 구조 분해 할당 (Destructuring) < 객체 타입의 매개변수를 바로 분해하여 사용함.
  const headerEl = document.getElementById('header');
  
  headerEl.innerHTML = `
    <div class="header-content">
      <div class="header-left">
        <button id="menu-btn" class="btn btn-ghost btn-icon mobile-only">
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div style="width: 2.5rem; height: 2.5rem; background: linear-gradient(to bottom right, var(--primary), var(--primary-hover)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;">
            <svg style="width: 1.5rem; height: 1.5rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="font-semibold text-primary">RetailHub</h1>
          </div>
        </div>
      </div>

      <div class="header-center">
        <div class="relative" style="width: 100%;">
          <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            class="input input-search"
          />
        </div>
      </div>

      <div class="header-right">
        <button id="cart-btn" class="btn btn-outline btn-icon relative">
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          ${cartItemCount > 0 ? `
            <span style="position: absolute; top: -0.5rem; right: -0.5rem; width: 1.25rem; height: 1.25rem; display: flex; align-items: center; justify-content: center; padding: 0; background-color: var(--primary); color: white; font-size: 0.75rem; border-radius: 9999px;">
              ${cartItemCount}
            </span>
          ` : ''}
        </button>
      </div>
    </div>
  `;
  
  // Setup event listeners
  const menuBtn = headerEl.querySelector('#menu-btn');
  const cartBtn = headerEl.querySelector('#cart-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', onMenuClick);
  }
  
  if (cartBtn) {
    cartBtn.addEventListener('click', onCartClick);
  }
}
