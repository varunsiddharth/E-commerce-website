// API Configuration and Utility Functions
const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            console.log('Making API request to:', url);
            const response = await fetch(url, config);
            console.log('API Response status:', response.status);
            const data = await response.json();
            console.log('API Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: url,
                config: config
            });
            throw error;
        }
    }

    // Product API methods
    static async getProducts(category = 'all', page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (category !== 'all') {
            params.append('category', category);
        }

        return this.request(`/products?${params}`);
    }

    static async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // User API methods
    static async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Order API methods
    static async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    static async getUserOrders() {
        return this.request('/orders');
    }
}

// Image helper for safe image URLs and fallbacks
class ImageHelper {
	static DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format&q=70';

	static getSafeImage(src) {
		if (typeof src === 'string' && src.trim().length > 0) {
			// Check if it's a valid URL or path
			if (src.startsWith('http') || src.startsWith('/') || src.startsWith('./')) {
				return src;
			}
		}
		return ImageHelper.DEFAULT_IMAGE;
	}

	static preloadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(src);
			img.onerror = () => resolve(ImageHelper.DEFAULT_IMAGE);
			img.src = src;
		});
	}
}

// Toast notification utility
class Toast {
    static show(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('i');

        // Update message and icon based on type
        toastMessage.textContent = message;
        
        if (type === 'success') {
            toastIcon.className = 'fas fa-check-circle';
            toast.style.borderLeftColor = '#2ed573';
            toastIcon.style.color = '#2ed573';
        } else if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle';
            toast.style.borderLeftColor = '#ff4757';
            toastIcon.style.color = '#ff4757';
        } else if (type === 'info') {
            toastIcon.className = 'fas fa-info-circle';
            toast.style.borderLeftColor = '#3742fa';
            toastIcon.style.color = '#3742fa';
        }

        // Show toast
        toast.classList.add('show');

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Loading utility
class Loading {
    static show(element) {
        if (element) {
            element.style.display = 'block';
        }
    }

    static hide(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    static createSkeleton(count = 8) {
        return Array.from({ length: count }, () => `
            <div class="product-card skeleton">
                <div class="product-image skeleton-image"></div>
                <div class="product-info">
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-price"></div>
                    <div class="skeleton-line skeleton-description"></div>
                    <div class="skeleton-line skeleton-button"></div>
                </div>
            </div>
        `).join('');
    }
}

// Form validation utility
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validateName(name) {
        return name.trim().length >= 2;
    }

    static showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    static hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    static clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }
}

// Authentication utility
class Auth {
    static isLoggedIn() {
        return !!localStorage.getItem('authToken');
    }

    static getToken() {
        return localStorage.getItem('authToken');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static login(token, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateAuthUI();
    }

    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    static updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const isLoggedIn = this.isLoggedIn();
        const user = this.getUser();

        if (authButtons) {
            if (isLoggedIn && user) {
                authButtons.innerHTML = `
                    <div class="user-menu">
                        <span class="user-name">Welcome, ${user.name}</span>
                        <button class="btn btn-outline" onclick="Auth.logout()">Logout</button>
                    </div>
                `;
            } else {
                authButtons.innerHTML = `
                    <a href="login.html" class="btn btn-outline">Login</a>
                    <a href="register.html" class="btn btn-primary">Register</a>
                `;
            }
        }
    }
}

// URL utility
class URLUtils {
    static getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    static updateURL(productId) {
        const url = new URL(window.location);
        url.searchParams.set('id', productId);
        window.history.pushState({}, '', url);
    }
}

// Export for use in other files
window.API = API;
window.Toast = Toast;
window.Loading = Loading;
window.FormValidator = FormValidator;
window.Auth = Auth;
window.URLUtils = URLUtils;
window.ImageHelper = ImageHelper;
