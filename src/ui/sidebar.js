// Sidebar component

export function renderSidebar({ activeTab, onTabChange, isMobileOpen, onClose }) {
  const sidebarEl = document.getElementById('sidebar');
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'cart', label: 'Shopping Cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  ];
  
  sidebarEl.className = isMobileOpen ? 'open' : '';
  
  sidebarEl.innerHTML = `
    <div class="sidebar-content">
      <div class="sidebar-header">
        <span class="font-semibold">Menu</span>
        <button id="close-sidebar-btn" class="btn btn-ghost btn-icon">
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        ${navItems.map((item) => {
          const isActive = activeTab === item.id;
          return `
            <button
              data-tab="${item.id}"
              class="nav-item ${isActive ? 'active' : ''}"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
              </svg>
              <span class="font-medium">${item.label}</span>
            </button>
          `;
        }).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="rounded-lg bg-gray-100 p-4">
          <p class="text-sm font-medium text-primary">Eunsuh Jeon</p>
          <p class="text-xs text-secondary mt-1">lilyjun98@gmail.com</p>
        </div>
      </div>
    </div>
  `;
  
  // Setup event listeners
  const closeBtn = sidebarEl.querySelector('#close-sidebar-btn');
  const tabBtns = sidebarEl.querySelectorAll('.nav-item');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', onClose);
  }
  
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      onTabChange(tab);
    });
  });
}
