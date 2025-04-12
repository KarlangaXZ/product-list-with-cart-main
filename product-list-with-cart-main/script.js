// Product data
const products = [
  {
    id: 1,
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.50,
    image: "./assets/images/image-waffle-desktop.jpg"
  },
  {
    id: 2,
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.00,
    image: "./assets/images/image-creme-brulee-desktop.jpg"
  },
  {
    id: 3,
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.00,
    image: "./assets/images/image-macaron-desktop.jpg"
  },
  {
    id: 4,
    name: "Classic Tiramisu",
    category: "Tiramisu",
    price: 5.50,
    image: "./assets/images/image-tiramisu-desktop.jpg"
  },
  {
    id: 5,
    name: "Pistachio Baklava",
    category: "Baklava",
    price: 4.00,
    image: "./assets/images/image-baklava-desktop.jpg"
  },
  {
    id: 6,
    name: "Lemon Meringue Pie",
    category: "Pie",
    price: 5.00,
    image: "./assets/images/image-meringue-desktop.jpg"
  },
  {
    id: 7,
    name: "Red Velvet Cake",
    category: "Cake",
    price: 4.50,
    image: "./assets/images/image-cake-desktop.jpg"
  },
  {
    id: 8,
    name: "Salted Caramel Brownie",
    category: "Brownie",
    price: 5.50,
    image: "./assets/images/image-brownie-desktop.jpg"
  },
  {
    id: 9,
    name: "Vanilla Panna Cotta",
    category: "Panna Cotta",
    price: 6.50,
    image: "./assets/images/image-panna-cotta-desktop.jpg"
  }
];

// Cart array to store selected items
let cart = [];

// DOM elements
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const confirmOrderBtn = document.getElementById('confirm-order');
const modal = document.getElementById('confirmation-modal');
const newOrderBtn = document.getElementById('new-order');

// Initialize the app
function init() {
  renderProducts();
  setupEventListeners();
}

// Render all products
function renderProducts() {
  productList.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    productList.appendChild(productCard);
  });
}

// Create a product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Find if product is in cart
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-details">
      <p class="product-category">${product.category}</p>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <div class="product-controls">
        ${quantity > 0 ? 
          `<div class="quantity-control" data-id="${product.id}">
            <button class="quantity-btn decrease" aria-label="Decrease quantity">-</button>
            <span class="quantity-display">${quantity}</span>
            <button class="quantity-btn increase" aria-label="Increase quantity">+</button>
          </div>` : 
          `<div></div>`
        }
        <button class="add-to-cart-btn" data-id="${product.id}">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Set up event listeners
function setupEventListeners() {
  // Event delegation for product grid
  productList.addEventListener('click', handleProductGridClick);
  
  // Confirm order button
  confirmOrderBtn.addEventListener('click', showConfirmationModal);
  
  // New order button
  newOrderBtn.addEventListener('click', startNewOrder);
}

// Handle clicks in the product grid
function handleProductGridClick(event) {
  // Handle increase button click
  if (event.target.classList.contains('increase')) {
    const productId = parseInt(event.target.closest('.quantity-control').dataset.id);
    updateQuantity(productId, 1);
  }
  
  // Handle decrease button click
  if (event.target.classList.contains('decrease')) {
    const productId = parseInt(event.target.closest('.quantity-control').dataset.id);
    updateQuantity(productId, -1);
  }
  
  // Handle add to cart button click
  if (event.target.classList.contains('add-to-cart-btn') || event.target.closest('.add-to-cart-btn')) {
    const button = event.target.classList.contains('add-to-cart-btn') ? 
      event.target : event.target.closest('.add-to-cart-btn');
    const productId = parseInt(button.dataset.id);
    addToCart(productId);
  }
}

// Update quantity of a product
function updateQuantity(productId, change) {
  const cartItemIndex = cart.findIndex(item => item.id === productId);
  
  if (cartItemIndex > -1) {
    // Item exists in cart
    const newQuantity = cart[cartItemIndex].quantity + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0
      cart.splice(cartItemIndex, 1);
    } else {
      // Update quantity
      cart[cartItemIndex].quantity = newQuantity;
    }
  } else if (change > 0) {
    // Item doesn't exist in cart and we're increasing
    const product = products.find(p => p.id === productId);
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  updateUI();
}

// Add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItemIndex = cart.findIndex(item => item.id === productId);
  
  if (cartItemIndex > -1) {
    // Item exists in cart, increase quantity
    cart[cartItemIndex].quantity += 1;
  } else {
    // Item doesn't exist in cart
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  updateUI();
}

// Update the UI
function updateUI() {
  renderProducts();
  renderCart();
}

// Render the cart
function renderCart() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <img src="./assets/images/cart-empty.png" alt="Empty cart" class="empty-cart-image">
        <p class="empty-cart-message">Your added items will appear here</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-quantity">${item.quantity}x <span>@ $${item.price.toFixed(2)}</span></p>
        </div>
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item" data-id="${item.id}" aria-label="Remove item">×</button>
      `;
      cartItems.appendChild(cartItem);
      
      // Add event listener to remove button
      const removeBtn = cartItem.querySelector('.remove-item');
      removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
      });
    });
  }
  
  // Update total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPrice.textContent = `$${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateUI();
}

// Show confirmation modal
function showConfirmationModal() {
  if (cart.length > 0) {
    // Populate the modal with order items
    const modalOrderItems = document.getElementById('modal-order-items');
    modalOrderItems.innerHTML = '';
    
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const orderItem = document.createElement('div');
      orderItem.className = 'modal-order-item';
      
      orderItem.innerHTML = `
        <img src="${product.image}" alt="${item.name}" class="modal-item-image">
        <div class="modal-item-details">
          <p class="modal-item-name">${item.name}</p>
          <p class="modal-item-quantity">${item.quantity}x @ $${item.price.toFixed(2)}</p>
        </div>
        <p class="modal-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
      `;
      
      modalOrderItems.appendChild(orderItem);
    });
    
    // Update the modal total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('modal-total-price').textContent = `$${total.toFixed(2)}`;
    
    // Show the modal
    modal.style.display = 'flex';
  }
}

// Start new order
function startNewOrder() {
  cart = [];
  modal.style.display = 'none';
  updateUI();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);