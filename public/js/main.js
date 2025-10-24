// Main application functionality for index.html
class ProductApp {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.isLoading = false;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.setupCategoryFilters();
    }

    // Load products from API
    async loadProducts(category = 'all', page = 1, append = false) {
        if (this.isLoading) return;

        this.isLoading = true;
        const loadingElement = document.getElementById('loading');
        const productsGrid = document.getElementById('productsGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        try {
            Loading.show(loadingElement);
            
            // Show skeleton loading
            if (!append) {
                productsGrid.innerHTML = Loading.createSkeleton(8);
            }
            
            console.log('Loading products...', { category, page });
            const response = await API.getProducts(category, page, 8);
            console.log('API Response:', response);
            const { products, totalPages, currentPage } = response;

            if (!append) {
                productsGrid.innerHTML = '';
            }

            if (products.length === 0) {
                productsGrid.innerHTML = `
                    <div class="no-products">
                        <h3>No products found</h3>
                        <p>Try selecting a different category or check back later.</p>
                    </div>
                `;
            } else {
                products.forEach(product => {
                    const productCard = this.createProductCard(product);
                    productsGrid.insertAdjacentHTML('beforeend', productCard);
                });

                // Add event listeners to new product cards
                this.addProductCardEventListeners();
            }

            // Update load more button
            if (loadMoreBtn) {
                if (currentPage >= totalPages) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }
            }

            this.currentPage = currentPage;
            this.currentCategory = category;

        } catch (error) {
            console.error('Error loading products:', error);
            Toast.show('Failed to load products. Please try again.', 'error');
            
            if (!append) {
                productsGrid.innerHTML = `
                    <div class="error-state">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Error Loading Products</h3>
                        <p>Something went wrong while loading products.</p>
                        <button class="btn btn-primary" onclick="productApp.loadProducts()">Try Again</button>
                    </div>
                `;
            }
        } finally {
            Loading.hide(loadingElement);
            this.isLoading = false;
        }
    }

    // Create product card HTML
    createProductCard(product) {
        const imgSrc = ImageHelper.getSafeImage(product.image);
        return `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image">
                    <img src="${imgSrc}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src=ImageHelper.DEFAULT_IMAGE;">
                    <div class="product-overlay">
                        <button class="btn btn-primary quick-view-btn" data-product-id="${product._id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-category">
                        <span class="category-badge">${product.category}</span>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product._id}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    // Add event listeners to product cards
    addProductCardEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
                await this.addToCart(productId);
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = e.target.closest('.quick-view-btn').dataset.productId;
                this.showProductDetails(productId);
            });
        });

        // Product card clicks (for navigation)
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't navigate if clicking on buttons
                if (e.target.closest('.add-to-cart-btn') || e.target.closest('.quick-view-btn')) {
                    return;
                }
                
                const productId = card.dataset.productId;
                this.navigateToProduct(productId);
            });
        });
    }

    // Add product to cart
    async addToCart(productId) {
        try {
            const product = await API.getProduct(productId);
            cart.addItem(product, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
            Toast.show('Failed to add item to cart', 'error');
        }
    }

    // Show product details modal (quick view)
    showProductDetails(productId) {
        // For now, navigate to product page
        // In a more advanced implementation, this could show a modal
        this.navigateToProduct(productId);
    }

    // Navigate to product page
    navigateToProduct(productId) {
        window.location.href = `product.html?id=${productId}`;
    }

    // Setup category filter event listeners
    setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load products for selected category
                const category = btn.dataset.category;
                this.loadProducts(category, 1, false);
            });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadProducts(this.currentCategory, this.currentPage + 1, true);
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Search functionality (if search input exists)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 500);
            });
        }
    }

    // Search products (basic implementation)
    async searchProducts(query) {
        if (!query.trim()) {
            this.loadProducts(this.currentCategory, 1, false);
            return;
        }

        // This is a basic client-side search
        // In a real application, you'd want server-side search
        const allProducts = await API.getProducts('all', 1, 100);
        const filteredProducts = allProducts.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>Try a different search term.</p>
                </div>
            `;
        } else {
            filteredProducts.forEach(product => {
                const productCard = this.createProductCard(product);
                productsGrid.insertAdjacentHTML('beforeend', productCard);
            });
            this.addProductCardEventListeners();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productApp = new ProductApp();
});

// Export for use in other files
window.ProductApp = ProductApp;
