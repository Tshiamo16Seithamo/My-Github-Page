 // DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const productGrid = document.querySelector('.product-grid');

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product Data
const products = [
  {
    id: 1,
    name: "BROKE SIGNATURE TEE",
    price: 180.95,
    category: "tees",
    img: "images/broke-logo-tee.png"
  },
  {
    id: 2,
    name: "BROKE GRAPHIC TEE",
    price: 250.00,
    category: "tees",
    img: "images/tee2.jpg"
  },
  {
    id: 3,
    name: "BROKE FINGER SPELL TEE",
    price: 1000.00,
    category: "tees",
    img: "images/tracksuit1.jpg"
  },
  {
    id: 4,
    name: "BROKE FIST TEE",
    price: 150.00,
    category: "tees",
    img: "images/cap1.jpg"
  },
  {
    id: 5,
    name: "BROKE VINTAGE CAP",
    price: 200.00,
    category: "caps",
    img: "images/vintage-cap.jpg"
  },
  {
    id: 6,
    name: "BROKE BASEBALL CAP",
    price: 150.00,
    category: "caps",
    img: "images/baseball-cap.jpg"
  },
  {
    id: 7,
    name: "BROKE CLASSIC CAP",
    price: 100.00,
    category: "caps",
    img: "images/classic-cap.jpg"
  },
  {
    id: 8,
    name: "BROKE RAINBOW HOODIE",
    price: 500.00,
    category: "hoodies",
    img: "images/rainbow-hoodie.jpg"
  },
  {
    id: 9,
    name: "BROKE ROYAL BLUE HOODIE",
    price: 600.00,
    category: "hoodies",
    img: "images/royal-blue-hoodie.jpg"
  }
];

// Initialize the shop
function initShop() {
  renderProducts(products);
  updateCartUI();
  
  // Event Delegation for Add to Cart buttons
  productGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
    }
  });
}

// Render products to the page
function renderProducts(productsToRender) {
  productGrid.innerHTML = productsToRender.map(product => `
    <div class="product-item" data-category="${product.category}">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">ADD TO CART</button>
    </div>
  `).join('');
}

// Filter products
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter products
    const category = button.dataset.category;
    const filteredProducts = category === 'all' 
      ? products 
      : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
  });
});

// Cart Functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  saveCartToStorage();
  
  // Visual feedback
  const addedButton = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
  addedButton.textContent = 'ADDED!';
  setTimeout(() => {
    addedButton.textContent = 'ADD TO CART';
  }, 1000);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  saveCartToStorage();
}

function updateCartUI() {
  // Update cart count
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        removeFromCart(parseInt(e.target.dataset.id));
      });
    });
  }
  
  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cart Modal Controls
cartIcon.addEventListener('click', () => {
  cartModal.style.display = 'block';
});

document.querySelector('.close-cart').addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

// Checkout Button
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
  } else {
    alert(`Order confirmed! Total: $${cartTotal.textContent}\nThank you for shopping with BROKE!`);
    cart = [];
    updateCartUI();
    saveCartToStorage();
  }
});

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', initShop);