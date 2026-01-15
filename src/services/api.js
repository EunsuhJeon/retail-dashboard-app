// API service for communicating with the backend server
// 모든 api 호출 처리 중앙 관리
// api: communication with server (control server data)
// cartStorage: manage localStorage < 브라우저의 독립된 로컬스토리지 (개별적으로 관리됨). 브라우저 캐시 삭제 시 초기화됨

const API_BASE_URL = 'http://localhost:3001/api'; // 서버단 포트번호(index.js에서 정의)
const SERVER_BASE_URL = 'http://localhost:3001'; // 서버 기본 URL (이미지 파일 제공용)

/**
 * 이미지 URL을 완전한 경로로 변환
 * @param {string} imagePath - products.json에 정의된 이미지 경로
 * @returns {string} - 완전한 이미지 URL 또는 placeholder 이미지
 */
export function getImageUrl(imagePath) {
  // 빈 문자열이거나 경로가 없으면 placeholder 반환
  if (!imagePath || imagePath.trim() === '') {
    // SVG placeholder 이미지 반환
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 상대 경로인 경우 서버 URL 추가
  // 경로가 /로 시작하면 그대로 사용, 아니면 / 추가
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SERVER_BASE_URL}${normalizedPath}`;
}

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

  // Update product stock
  async updateStock(productId, quantity) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update stock');
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
