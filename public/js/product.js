// Product details page functionality
class ProductDetails {
    constructor() {
        this.productId = null;
        this.product = null;
        this.quantity = 1;
        this.init();
    }

    async init() {
        this.productId = URLUtils.getProductIdFromURL();
        
        if (!this.productId) {
            this.showError('Product ID not found');
            return;
        }

        await this.loadProduct();
        this.setupEventListeners();
        this.loadRelatedProducts();
    }

    // Load product details
    async loadProduct() {
        const loadingElement = document.getElementById('loading');
        const productContent = document.getElementById('productContent');
        const errorState = document.getElementById('errorState');

        try {
            Loading.show(loadingElement);
            
            this.product = await API.getProduct(this.productId);
            this.renderProduct();
            
            Loading.hide(loadingElement);
            productContent.style.display = 'block';
            errorState.style.display = 'none';

        } catch (error) {
            console.error('Error loading product:', error);
            Loading.hide(loadingElement);
            productContent.style.display = 'none';
            errorState.style.display = 'block';
        }
    }

    // Render product details
    renderProduct() {
        if (!this.product) return;

        // Update page title
        document.title = `${this.product.name} - E-Commerce Store`;

        // Update breadcrumb
        const breadcrumb = document.getElementById('productBreadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = this.product.name;
        }

        // Update product details
        const productImage = document.getElementById('productImage');
        const productTitle = document.getElementById('productTitle');
        const productPrice = document.getElementById('productPrice');
        const productDescription = document.getElementById('productDescription');
        const productCategory = document.getElementById('productCategory');
        const productStock = document.getElementById('productStock');

        if (productImage) productImage.src = ImageHelper.getSafeImage(this.product.image);
        if (productImage) productImage.onerror = () => { productImage.onerror = null; productImage.src = ImageHelper.DEFAULT_IMAGE; };
        if (productImage) productImage.alt = this.product.name;
        if (productTitle) productTitle.textContent = this.product.name;
        if (productPrice) productPrice.textContent = `$${this.product.price.toFixed(2)}`;
        if (productDescription) productDescription.textContent = this.product.description;
        if (productCategory) productCategory.textContent = this.product.category;
        
        if (productStock) {
            if (this.product.stock > 0) {
                productStock.textContent = `In Stock (${this.product.stock} available)`;
                productStock.style.color = '#2ed573';
            } else {
                productStock.textContent = 'Out of Stock';
                productStock.style.color = '#ff4757';
            }
        }

        // Update quantity input max value
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.max = this.product.stock;
            quantityInput.value = Math.min(this.quantity, this.product.stock);
        }

        // Disable buttons if out of stock
        this.updateButtonStates();
    }

    // Update button states based on stock
    updateButtonStates() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');
        const isOutOfStock = this.product.stock === 0;

        if (addToCartBtn) {
            addToCartBtn.disabled = isOutOfStock;
            addToCartBtn.textContent = isOutOfStock ? 'Out of Stock' : 'Add to Cart';
        }

        if (buyNowBtn) {
            buyNowBtn.disabled = isOutOfStock;
            buyNowBtn.textContent = isOutOfStock ? 'Out of Stock' : 'Buy Now';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Quantity controls
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityInput = document.getElementById('quantity');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    this.updateQuantityDisplay();
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                if (this.quantity < this.product.stock) {
                    this.quantity++;
                    this.updateQuantityDisplay();
                } else {
                    Toast.show('Maximum stock reached', 'error');
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1) {
                    this.quantity = 1;
                } else if (value > this.product.stock) {
                    this.quantity = this.product.stock;
                    Toast.show('Quantity exceeds available stock', 'error');
                } else {
                    this.quantity = value;
                }
                this.updateQuantityDisplay();
            });
        }

        // Add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        // Buy now button
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyNow();
            });
        }
    }

    // Update quantity display
    updateQuantityDisplay() {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }
    }

    // Add product to cart
    async addToCart() {
        if (!this.product || this.product.stock === 0) {
            Toast.show('Product is out of stock', 'error');
            return;
        }

        try {
            cart.addItem(this.product, this.quantity);
            Toast.show(`${this.product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            Toast.show('Failed to add item to cart', 'error');
        }
    }

    // Buy now functionality
    async buyNow() {
        if (!this.product || this.product.stock === 0) {
            Toast.show('Product is out of stock', 'error');
            return;
        }

        // Add to cart first
        await this.addToCart();
        
        // Navigate to cart page
        window.location.href = 'cart.html';
    }

    // Load related products
    async loadRelatedProducts() {
        if (!this.product) return;

        try {
            const response = await API.getProducts(this.product.category, 1, 4);
            const relatedProducts = response.products.filter(p => p._id !== this.product._id);
            
            this.renderRelatedProducts(relatedProducts);
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    }

    // Render related products
    renderRelatedProducts(products) {
        const relatedProductsGrid = document.getElementById('relatedProductsGrid');
        if (!relatedProductsGrid) return;

        if (products.length === 0) {
            relatedProductsGrid.innerHTML = `
                <div class="no-products">
                    <p>No related products found.</p>
                </div>
            `;
            return;
        }

        relatedProductsGrid.innerHTML = products.map(product => {
            const imgSrc = ImageHelper.getSafeImage(product.image);
            return `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image">
                    <img src="${imgSrc}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src=ImageHelper.DEFAULT_IMAGE;">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart-btn" data-product-id="${product._id}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        }).join('');

        // Add event listeners to related products
        this.addRelatedProductEventListeners();
    }

    // Add event listeners to related products
    addRelatedProductEventListeners() {
        const relatedProductsGrid = document.getElementById('relatedProductsGrid');
        if (!relatedProductsGrid) return;

        // Add to cart buttons
        relatedProductsGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
                
                try {
                    const product = await API.getProduct(productId);
                    cart.addItem(product, 1);
                    Toast.show(`${product.name} added to cart!`);
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    Toast.show('Failed to add item to cart', 'error');
                }
            });
        });

        // Product card clicks
        relatedProductsGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.add-to-cart-btn')) return;
                
                const productId = card.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }

    // Show error state
    showError(message) {
        const errorState = document.getElementById('errorState');
        if (errorState) {
            errorState.style.display = 'block';
            errorState.querySelector('p').textContent = message;
        }
    }
}

// Initialize product details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productDetails = new ProductDetails();
});

// Export for use in other files
window.ProductDetails = ProductDetails;
