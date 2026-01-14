// API service for communicating with the backend server
// 모든 api 호출 처리 중앙 관리
// api: communication with server (control server data)
// cartStorage: manage localStorage < 브라우저의 독립된 로컬스토리지 (개별적으로 관리됨). 브라우저 캐시 삭제 시 초기화됨

const API_BASE_URL = 'http://localhost:3001/api'; // 서버단 포트번호(index.js에서 정의)

// API functions
export const api = {
  // Get all products
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`); // await 사용으로 Promise가 완료될 때까지 대기
    if (!response.ok) {
      throw new Error('Failed to fetch products'); // 호출한 함수, app.js 순으로 catch 블럭에서 에러 처리
    }
    return response.json();
  },

  // Get product by ID
  async getProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  // Submit a review
  async submitReview(productId, rating, comment) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 요청 본문의 데이터 형식을 서버단에 전달, 이를 토대로 서버에서 파싱
      },
      body: JSON.stringify({ rating, comment }), // 전달할 실제 데이터
    });
    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    return response.json();
  },

  // Checkout (purchase)
  async checkout(items) {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Checkout failed');
    }
    return response.json();
  },

  // Get dashboard data
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
  },
};

// LocalStorage helpers for cart
export const cartStorage = {
  getCart() {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return []; // 에러 발생 시에도 어플리케이션이 중단되지 않도록 처리함
    }
  },

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  clearCart() {
    localStorage.removeItem('cart');
  },
};
