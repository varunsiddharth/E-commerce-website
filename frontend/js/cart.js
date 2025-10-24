// Shopping Cart Management
class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateCartUI();
        this.setupGlobalCartModal();
    }

    // Load cart from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product._id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stock: product.stock
            });
        }

        this.saveToStorage();
        this.updateCartUI();
        Toast.show(`${product.name} added to cart!`);
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartUI();
        Toast.show('Item removed from cart');
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartUI();
            }
        }
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateCartUI();
    }

    // Get cart count
    getCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Update cart UI elements
    updateCartUI() {
        this.updateCartCount();
        this.updateCartPage();
        this.updateCartModal();
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
        const count = this.getCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        });
    }

    // Update cart page if on cart.html
    updateCartPage() {
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Update cart modal if present
    updateCartModal() {
        const modal = document.getElementById('cartModal');
        const content = document.getElementById('cartModalContent');
        if (!modal || !content) return;

        if (this.isEmpty()) {
            content.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items yet.</p>
                </div>
            `;
            return;
        }

        const itemsHtml = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${ImageHelper.getSafeImage(item.image)}" alt="${item.name}" onerror="this.onerror=null;this.src=ImageHelper.DEFAULT_IMAGE;">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-product-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" data-product-id="${item.id}">
                            <button class="quantity-btn increase-btn" data-product-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotalAmount = this.getTotal();
        const shippingAmount = subtotalAmount >= 50 ? 0 : 9.99;
        const taxAmount = subtotalAmount * 0.08;
        const totalAmount = subtotalAmount + shippingAmount + taxAmount;

        content.innerHTML = `
            <div class="cart-items">${itemsHtml}</div>
            <div class="cart-summary" style="position:static;margin-top:24px;">
                <div class="summary-card">
                    <div class="summary-row"><span>Subtotal:</span><span>$${subtotalAmount.toFixed(2)}</span></div>
                    <div class="summary-row"><span>Shipping:</span><span>${shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}</span></div>
                    <div class="summary-row"><span>Tax:</span><span>$${taxAmount.toFixed(2)}</span></div>
                    <div class="summary-row total"><span>Total:</span><span>$${totalAmount.toFixed(2)}</span></div>
                    <div style="display:flex; gap:12px; margin-top:16px;">
                        <a href="cart.html" class="btn btn-outline" style="flex:1; text-align:center;">View Full Cart</a>
                        <button class="btn btn-primary" id="modalCheckoutBtn" style="flex:1;">
                            <i class="fas fa-credit-card"></i> Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.addCartItemEventListeners();
        const modalCheckoutBtn = document.getElementById('modalCheckoutBtn');
        if (modalCheckoutBtn) {
            modalCheckoutBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }

    // Setup modal open/close and icon click
    setupGlobalCartModal() {
        const cartIcon = document.getElementById('cartIcon');
        const modal = document.getElementById('cartModal');
        const closeBtn = document.getElementById('closeCartModal');
        if (!cartIcon || !modal || !closeBtn) return;

        const open = () => {
            this.updateCartModal();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        cartIcon.addEventListener('click', open);
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    }

    // Render cart page
    renderCartPage() {
        const emptyCart = document.getElementById('emptyCart');
        const cartContent = document.getElementById('cartContent');
        const cartItems = document.getElementById('cartItems');
        const itemCount = document.getElementById('itemCount');
        const subtotal = document.getElementById('subtotal');
        const shipping = document.getElementById('shipping');
        const tax = document.getElementById('tax');
        const total = document.getElementById('total');

        if (this.isEmpty()) {
            emptyCart.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartContent.style.display = 'block';

            // Update item count
            if (itemCount) {
                itemCount.textContent = this.getCount();
            }

            // Render cart items
            cartItems.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');

            // Calculate totals
            const subtotalAmount = this.getTotal();
            const shippingAmount = subtotalAmount >= 50 ? 0 : 9.99;
            const taxAmount = subtotalAmount * 0.08; // 8% tax
            const totalAmount = subtotalAmount + shippingAmount + taxAmount;

            // Update totals
            if (subtotal) subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
            if (shipping) shipping.textContent = shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`;
            if (tax) tax.textContent = `$${taxAmount.toFixed(2)}`;
            if (total) total.textContent = `$${totalAmount.toFixed(2)}`;

            // Add event listeners to cart items
            this.addCartItemEventListeners();
        }
    }

    // Create HTML for cart item
    createCartItemHTML(item) {
        const imgSrc = ImageHelper.getSafeImage(item.image);
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null;this.src=ImageHelper.DEFAULT_IMAGE;">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-product-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock}" data-product-id="${item.id}">
                            <button class="quantity-btn increase-btn" data-product-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listeners to cart items
    addCartItemEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Quantity increase buttons
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const item = this.items.find(item => item.id === productId);
                if (item && item.quantity < item.stock) {
                    this.updateQuantity(productId, item.quantity + 1);
                } else {
                    Toast.show('Maximum stock reached', 'error');
                }
            });
        });

        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.value);
                const item = this.items.find(item => item.id === productId);
                
                if (quantity > item.stock) {
                    Toast.show('Quantity exceeds available stock', 'error');
                    e.target.value = item.stock;
                    this.updateQuantity(productId, item.stock);
                } else if (quantity < 1) {
                    this.removeItem(productId);
                } else {
                    this.updateQuantity(productId, quantity);
                }
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeItem(productId);
            });
        });
    }

    // Prepare order data for checkout
    prepareOrderData(shippingAddress) {
        return {
            items: this.items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            shippingAddress
        };
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
    
    // Update auth UI
    Auth.updateAuthUI();
});

// Export for use in other files
window.Cart = Cart;
