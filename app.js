// Product Dataset
const products = [
  {
    id: 1,
    name: "Charcoal Wool Overcoat",
    category: "outerwear",
    price: 495.00,
    image: "images/jacket.jpg",
    description: "Expertly tailored single-breasted overcoat crafted from rich Italian virgin wool blend. Features structured shoulders, notch lapels, and interior luxury satin lining."
  },
  {
    id: 2,
    name: "Minimalist Linen Dress Shirt",
    category: "shirts",
    price: 185.00,
    image: "images/shirt.jpg",
    description: "Breathable pure linen button-up shirt designed with modern spread collar and slim tailored profile. Perfect for semi-formal layering or casual elegance."
  },
  {
    id: 3,
    name: "Italian Leather Sneakers",
    category: "footwear",
    price: 260.00,
    image: "images/sneakers.jpg",
    description: "Handcrafted in Florence using supple calfskin leather and durable rubber soles. Designed with subtle contrast suede panels for refined everyday footwear."
  },
  {
    id: 4,
    name: "Chronograph Automatic Watch",
    category: "accessories",
    price: 890.00,
    image: "images/watch.jpg",
    description: "Swiss-movement automatic chronograph encased in brushed stainless steel with matte black dial and sapphire crystal glass. Water resistant up to 100 meters."
  }
];

// Shopping Cart State
let cart = [];

// DOM Elements
const featuredGrid = document.getElementById('featuredGrid');
const shopGrid = document.getElementById('shopGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const toastContainer = document.getElementById('toastContainer');

// Render Products
function renderProducts() {
  const cardsHtml = products.map(product => `
    <div class="product-card" onclick="viewProduct(${product.id})">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');

  if (featuredGrid) featuredGrid.innerHTML = cardsHtml;
  if (shopGrid) shopGrid.innerHTML = cardsHtml;
}

// Single Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
}

// View Product Detail
function viewProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const detailContainer = document.getElementById('detailContainer');
  detailContainer.innerHTML = `
    <div class="detail-gallery">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-info">
      <p class="product-category" style="font-size: 0.9rem;">${product.category}</p>
      <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${product.name}</h1>
      <p style="font-size: 1.8rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 1.5rem;">$${product.price.toFixed(2)}</p>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">${product.description}</p>
      
      <p style="font-weight: 600; margin-bottom: 0.5rem;">Select Size:</p>
      <div class="size-selector">
        <button class="size-btn">S</button>
        <button class="size-btn selected">M</button>
        <button class="size-btn">L</button>
        <button class="size-btn">XL</button>
      </div>

      <button class="btn-primary" style="margin-top: 1rem; padding: 1.2rem;" onclick="addToCart(${product.id})">Add To Bag</button>
    </div>
  `;

  showPage('product-detail');
}

// Add To Cart Functionality
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`Added ${product.name} to your bag`);
  toggleCart(true);
}

// Update Cart UI
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 2rem;">Your cart is empty.</p>`;
    cartSubtotal.textContent = `$0.00`;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div style="font-weight: 600; font-size: 0.95rem;">${item.name}</div>
        <div style="color: var(--accent-gold); font-size: 0.9rem; margin-top: 0.2rem;">$${item.price.toFixed(2)} × ${item.quantity}</div>
      </div>
      <button class="icon-btn" onclick="removeFromCart(${item.id})" style="font-size: 0.9rem;">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// Toggle Cart Drawer
function toggleCart(forceOpen = false) {
  if (forceOpen) {
    cartDrawer.classList.add('open');
  } else {
    cartDrawer.classList.toggle('open');
  }
}

// Toast Notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Checkout simulation
function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  showToast("Order placed successfully! (Demo)");
  cart = [];
  updateCartUI();
  toggleCart();
}

// Filter Category
function filterCategory(cat) {
  showPage('shop');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
