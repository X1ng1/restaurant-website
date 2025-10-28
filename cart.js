let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Toggle cart sidebar visibility
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Add item to cart
function addToCart(name, price) {
    console.log('Adding to cart:', name, price);
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    const total = calculateTotal();
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            </div>
        `).join('');
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart script loaded'); // Debug log
    loadCart();
    
    // Add click event listeners to dish name buttons
    const dishNameButtons = document.querySelectorAll('.dish-name-btn');
    console.log('Found dish name buttons:', dishNameButtons.length); // Debug log
    
    dishNameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            console.log('Button clicked:', name, price); // Debug log
            addToCart(name, price);
        });
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartToggle = document.getElementById('cart-toggle');
        const mobileCartToggle = document.getElementById('mobile-cart-toggle');
        
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            const isClickInsideCart = cartSidebar.contains(event.target);
            const isClickOnToggle = cartToggle && cartToggle.contains(event.target);
            const isClickOnMobileToggle = mobileCartToggle && mobileCartToggle.contains(event.target);
            
            if (!isClickInsideCart && !isClickOnToggle && !isClickOnMobileToggle) {
                toggleCart();
            }
        }
    });
});
