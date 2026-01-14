# Retail Dashboard App (Client)

A client-side HTML/CSS/JavaScript application built with pure JavaScript (no React). It communicates with a server API to display product information and handle user interactions.

## Author

**Eunsuh Jeon**  
Design & Development

## Features

- **Product Browsing**: Browse products in a gallery view
- **Product Details**: View detailed product information and reviews by clicking on a product
- **Review System**: Submit reviews with 1-5 star ratings and text comments
- **Shopping Cart**: Add/remove products, adjust quantities
- **Checkout**: Purchase cart items with stock validation
- **Dashboard**: Data visualization using Chart.js
  - Product availability
  - Sales data
  - Review rating distribution
  - Review sentiment analysis

## Tech Stack

- HTML5
- CSS3 (Custom CSS)
- Vanilla JavaScript (ES6+)
- Chart.js (npm package)
- Vite (Build tool)

## Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will run at `http://localhost:5173`.

## Server Connection

This client app communicates with `retail-dashboard-app-server`. The server must be running.

## Data Storage

- **Shopping Cart**: Stored in browser using localStorage
- **Product Data**: Fetched from server API
- **Reviews**: Submitted and stored via server API

## Project Structure

```
retail-dashboard-app/
├── src/
│   ├── ui/                   # UI components
│   │   ├── dashboard.js      # Dashboard (Chart.js)
│   │   ├── product-card.js   # Product card
│   │   ├── product-gallery.js # Product gallery
│   │   ├── product-modal.js  # Product detail modal
│   │   ├── cart-panel.js     # Shopping cart panel
│   │   ├── header.js         # Header
│   │   ├── sidebar.js        # Sidebar
│   │   └── toast.js          # Toast notification
│   ├── services/
│   │   └── api.js            # API service (fetch)
│   ├── styles/
│   │   └── index.css         # Main stylesheet
│   └── app.js                # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

The client uses the following API endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products/:id/reviews` - Submit review
- `POST /api/checkout` - Process checkout
- `GET /api/dashboard` - Get dashboard data

## Key Features

- **Modular**: ES6 module system
- **Chart.js**: Charts implemented with Chart.js
- **Responsive Design**: Mobile and desktop support with custom CSS
- **localStorage**: Cart data persisted in browser

