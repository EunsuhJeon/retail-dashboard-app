import { api, cartStorage } from './services/api.js';
import { renderHeader } from './ui/header.js';
import { renderSidebar } from './ui/sidebar.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderProductGallery } from './ui/product-gallery.js';
import { renderCartPanel } from './ui/cart-panel.js';
import { showToast } from './ui/toast.js';
import { renderProductModal } from './ui/product-modal.js';

// App State
const state = {
  activeTab: 'dashboard',
  products: [],
  cartItems: [],
  selectedProduct: null,
  isModalOpen: false,
  isMobileMenuOpen: false,
  loading: false,
};

// Initialize App
async function init() {
  await loadProducts();
  const savedCart = cartStorage.getCart();
  state.cartItems = savedCart;
  
  render();
  setupEventListeners();
}

// Load products from API
async function loadProducts() {
  try {
    state.loading = true;
    const data = await api.getProducts();
    state.products = data;
  } catch (error) {
    showToast('Failed to load products', 'error');
    console.error(error);
  } finally {
    state.loading = false;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Mobile overlay click
  document.getElementById('mobile-overlay').addEventListener('click', () => {
    state.isMobileMenuOpen = false;
    render();
  });

  // Product modal backdrop click
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
      closeModal();
    }
  });
}

// Render all components
function render() {
  const cartItemCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  renderHeader({
    cartItemCount,
    onCartClick: () => {
      state.activeTab = 'cart';
      render();
    },
    onMenuClick: () => {
      state.isMobileMenuOpen = true;
      render();
    },
  });

  renderSidebar({
    activeTab: state.activeTab,
    onTabChange: (tab) => {
      state.activeTab = tab;
      state.isMobileMenuOpen = false;
      render();
    },
    isMobileOpen: state.isMobileMenuOpen,
    onClose: () => {
      state.isMobileMenuOpen = false;
      render();
    },
  });

  // Render main content
  document.getElementById('dashboard-view').classList.toggle('hidden', state.activeTab !== 'dashboard');
  document.getElementById('products-view').classList.toggle('hidden', state.activeTab !== 'products');
  document.getElementById('cart-view').classList.toggle('hidden', state.activeTab !== 'cart');

  if (state.activeTab === 'dashboard') {
    renderDashboard({
      products: state.products,
      cartItems: state.cartItems,
      onUpdateStock: handleUpdateStock,
    });
  } else if (state.activeTab === 'products') {
    renderProductGallery({
      products: state.products,
      onAddToCart: handleAddToCart,
      onViewDetails: handleViewDetails,
    });
  } else if (state.activeTab === 'cart') {
    renderCartPanel({
      items: state.cartItems,
      onUpdateQuantity: handleUpdateQuantity,
      onRemoveItem: handleRemoveItem,
      onCheckout: handleCheckout,
    });
  }

  // Render modal
  const modal = document.getElementById('product-modal');
  if (state.isModalOpen && state.selectedProduct) {
    modal.classList.add('open');
    // Clear modal content first
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      renderProductModal({
        product: state.selectedProduct,
        isOpen: state.isModalOpen,
        onClose: closeModal,
        onAddToCart: handleAddToCart,
        onSubmitReview: handleSubmitReview,
      });
    }
  } else {
    modal.classList.remove('open');
  }

  // Mobile overlay
  const overlay = document.getElementById('mobile-overlay');
  if (state.isMobileMenuOpen) {
    overlay.classList.add('visible');
  } else {
    overlay.classList.remove('visible');
  }
}

// Handlers
function handleAddToCart(product) {
  if (product.stock === 0) {
    showToast('This product is out of stock', 'error');
    return;
  }

  const existingItem = state.cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      showToast(`Only ${product.stock} units available in stock`, 'error');
      return;
    }
    state.cartItems = state.cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity: newQuantity } : item
    );
    showToast(`Added another ${product.name} to cart`, 'success');
  } else {
    state.cartItems = [
      ...state.cartItems,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      },
    ];
    showToast(`${product.name} added to cart`, 'success');
  }
  cartStorage.saveCart(state.cartItems);
  render();
}

function handleUpdateQuantity(id, quantity) {
  const product = state.products.find((p) => p.id === id);
  if (product && quantity > product.stock) {
    showToast(`Only ${product.stock} units available in stock`, 'error');
    return;
  }
  state.cartItems = state.cartItems.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  cartStorage.saveCart(state.cartItems);
  render();
}

function handleRemoveItem(id) {
  const item = state.cartItems.find((item) => item.id === id);
  state.cartItems = state.cartItems.filter((item) => item.id !== id);
  cartStorage.saveCart(state.cartItems);
  showToast(`${item?.name} removed from cart`, 'error');
  render();
}

async function handleViewDetails(product) {
  try {
    const updatedProduct = await api.getProduct(product.id);
    state.selectedProduct = updatedProduct;
  } catch (error) {
    state.selectedProduct = product;
  }
  state.isModalOpen = true;
  render();
}

function closeModal() {
  state.isModalOpen = false;
  state.selectedProduct = null;
  render();
}

async function handleSubmitReview(productId, rating, comment) {
  try {
    const updatedProduct = await api.submitReview(productId, rating, comment);
    state.products = state.products.map((p) => (p.id === productId ? updatedProduct : p));
    
    if (state.selectedProduct?.id === productId) {
      state.selectedProduct = updatedProduct;
    }
    
    showToast('Review submitted successfully!', 'success');
    render();
  } catch (error) {
    showToast('Failed to submit review', 'error');
    console.error(error);
  }
}

async function handleCheckout() {
  if (state.cartItems.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }

  try {
    await api.checkout(state.cartItems);
    state.cartItems = [];
    cartStorage.clearCart();
    showToast('Checkout completed successfully!', 'success');
    state.activeTab = 'dashboard';
    await loadProducts();
    render();
  } catch (error) {
    showToast(error.message || 'Checkout failed', 'error');
    console.error(error);
  }
}

async function handleUpdateStock(productId, quantity) {
  try {
    const updatedProduct = await api.updateStock(productId, quantity);
    state.products = state.products.map((p) => (p.id === productId ? updatedProduct : p));
    
    if (state.selectedProduct?.id === productId) {
      state.selectedProduct = updatedProduct;
    }
    
    showToast(`Stock updated successfully`, 'success');
    await loadProducts();
    render();
  } catch (error) {
    showToast(error.message || 'Failed to update stock', 'error');
    console.error(error);
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export state for components
window.appState = state;
window.loadProducts = loadProducts;
