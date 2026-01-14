// Dashboard component

import { api } from '../services/api.js';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables); // registerables: 차트 타입과 스케일, 플러그인 등이 포함된 배열. 스프레드 연산자로 개별 인자로 펼침. register()로 등록해야 렌더링됨

let charts = {};

export async function renderDashboard(products, cartItems) { // 서버에서 데이터를 가져오므로 async 비동기 처리
  const dashboardEl = document.getElementById('dashboard-view');
  
  // Destroy existing charts
  Object.values(charts).forEach(chart => { // charts의 값들만 뽑아서 배열로 반환
    if (chart) chart.destroy(); // 이벤트리스터, 메모리 정리
  });
  charts = {};
  
  // Load dashboard data from server
  let dashboardData;
  try {
    dashboardData = await api.getDashboardData();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
  
  // Use server data for metrics
  const totalProducts = dashboardData.totalProducts || products.length;
  const totalStock = dashboardData.totalStock || products.reduce((sum, p) => sum + p.stock, 0);
  const totalSales = dashboardData.totalSales || 0; // Use server's total sales (actual sales, not cart)
  const avgRating = dashboardData.avgRating || products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length || 0;
  
  const categoryData = dashboardData.categoryData;
  const stockStatusData = dashboardData.stockStatusData;
  const reviewData = dashboardData.reviewData;
  const lowStockProducts = dashboardData.lowStockProducts || products.filter((p) => p.stock < 10).slice(0, 5);
  
  dashboardEl.innerHTML = `
    <div class="space-y-6">
      <div class="section-header">
        <h2 class="section-title">Dashboard</h2>
        <p class="section-subtitle">Overview of your retail metrics</p>
      </div>

      <div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4">
        <div class="summary-card">
          <div class="summary-card-content">
            <div>
              <p class="text-sm text-secondary mb-1">Total Sales</p>
              <p class="text-2xl font-bold text-primary">$${totalSales.toFixed(2)}</p>
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg style="width: 0.75rem; height: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                +12.5% from last month
              </p>
            </div>
            <div class="summary-card-icon bg-green-100">
              <svg style="width: 1.5rem; height: 1.5rem; color: var(--success);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-card-content">
            <div>
              <p class="text-sm text-secondary mb-1">Total Products</p>
              <p class="text-2xl font-bold text-primary">${totalProducts}</p>
              <p class="text-xs text-secondary mt-1">${totalStock} units in stock</p>
            </div>
            <div class="summary-card-icon bg-blue-100">
              <svg style="width: 1.5rem; height: 1.5rem; color: var(--primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-card-content">
            <div>
              <p class="text-sm text-secondary mb-1">Avg Rating</p>
              <p class="text-2xl font-bold text-primary">${avgRating.toFixed(1)}</p>
              <p class="text-xs text-secondary mt-1">
                ${products.reduce((sum, p) => sum + p.reviews.length, 0)} total reviews
              </p>
            </div>
            <div class="summary-card-icon bg-yellow-100">
              <svg style="width: 1.5rem; height: 1.5rem; color: #facc15;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-card-content">
            <div>
              <p class="text-sm text-secondary mb-1">Cart Items</p>
              <p class="text-2xl font-bold text-primary">${cartItems.length}</p>
              <p class="text-xs text-secondary mt-1">
                ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} total units
              </p>
            </div>
            <div class="summary-card-icon bg-purple-100">
              <svg style="width: 1.5rem; height: 1.5rem; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 grid-cols-lg-2">
        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Inventory by Category</h3>
          <div class="chart-container">
            <canvas id="category-chart"></canvas>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Stock Status</h3>
          <div class="chart-container">
            <canvas id="stock-status-chart"></canvas>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Review Distribution</h3>
          <div class="chart-container">
            <canvas id="review-chart"></canvas>
          </div>
        </div>

        ${dashboardData.reviewKeywordAnalysis ? `
          <div class="card">
            <h3 class="font-semibold text-primary mb-4">Review Sentiment Analysis</h3>
            <div class="chart-container">
              <canvas id="sentiment-chart"></canvas>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3 class="font-semibold text-primary mb-4">Low Stock Alert</h3>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${lowStockProducts.map((product) => `
                <tr>
                  <td>${product.name}</td>
                  <td class="text-secondary">${product.category}</td>
                  <td>${product.stock}</td>
                  <td>$${product.price.toFixed(2)}</td>
                  <td>
                    <span class="badge ${product.stock === 0 ? 'badge-red' : 'badge-orange'}">
                      ${product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  // Render charts after a small delay to ensure DOM is ready
  // html이 dom에 삽입된 뒤 canvas 요소가 존재하는지 확인하기 위해 렌더링을 의도적으로 지연시킴
  setTimeout(() => {
    renderCharts(categoryData, stockStatusData, reviewData, dashboardData.reviewKeywordAnalysis);
  }, 100);
}

function renderCharts(categoryData, stockStatusData, reviewData, sentimentData) {
  // Category Chart
  const categoryCtx = document.getElementById('category-chart');
  if (categoryCtx) {
    charts.category = new Chart(categoryCtx, {
      type: 'bar',
      data: {
        labels: categoryData.map((d) => d.category),
        datasets: [
          {
            label: 'Stock Units',
            data: categoryData.map((d) => d.stock),
            backgroundColor: '#3b82f6',
          },
          {
            label: 'Products',
            data: categoryData.map((d) => d.products),
            backgroundColor: '#8b5cf6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Stock Status Chart
  const stockCtx = document.getElementById('stock-status-chart');
  if (stockCtx) {
    charts.stock = new Chart(stockCtx, {
      type: 'pie',
      data: {
        labels: stockStatusData.map((d) => d.name),
        datasets: [
          {
            data: stockStatusData.map((d) => d.value),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  // Review Chart
  const reviewCtx = document.getElementById('review-chart');
  if (reviewCtx) {
    charts.review = new Chart(reviewCtx, {
      type: 'bar',
      data: {
        labels: reviewData.map((d) => d.rating),
        datasets: [
          {
            label: 'Products',
            data: reviewData.map((d) => d.count),
            backgroundColor: '#eab308',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // Sentiment Chart
  if (sentimentData) {
    const sentimentCtx = document.getElementById('sentiment-chart');
    if (sentimentCtx) {
      charts.sentiment = new Chart(sentimentCtx, {
        type: 'bar',
        data: {
          labels: ['Positive', 'Negative'],
          datasets: [
            {
              label: 'Keywords',
              data: [sentimentData.positive, sentimentData.negative],
              backgroundColor: ['#22c55e', '#ef4444'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }
}
