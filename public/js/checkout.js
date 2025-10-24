// Checkout functionality for cart.html
class Checkout {
    constructor() {
        this.checkoutModal = document.getElementById('checkoutModal');
        this.orderSuccessModal = document.getElementById('orderSuccessModal');
        this.checkoutForm = document.getElementById('checkoutForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.openCheckoutModal();
            });
        }

        // Close modal buttons
        const closeModalBtn = document.getElementById('closeCheckoutModal');
        const cancelCheckoutBtn = document.getElementById('cancelCheckout');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeCheckoutModal();
            });
        }

        if (cancelCheckoutBtn) {
            cancelCheckoutBtn.addEventListener('click', () => {
                this.closeCheckoutModal();
            });
        }

        // Checkout form submission
        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }

        // Close modal when clicking outside
        if (this.checkoutModal) {
            this.checkoutModal.addEventListener('click', (e) => {
                if (e.target === this.checkoutModal) {
                    this.closeCheckoutModal();
                }
            });
        }

        if (this.orderSuccessModal) {
            this.orderSuccessModal.addEventListener('click', (e) => {
                if (e.target === this.orderSuccessModal) {
                    this.closeOrderSuccessModal();
                }
            });
        }

        // Form validation
        this.setupFormValidation();
    }

    // Open checkout modal
    openCheckoutModal() {
        if (!Auth.isLoggedIn()) {
            Toast.show('Please login to proceed with checkout', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        if (cart.isEmpty()) {
            Toast.show('Your cart is empty', 'error');
            return;
        }

        this.checkoutModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Pre-fill form with user data if available
        this.prefillForm();
    }

    // Close checkout modal
    closeCheckoutModal() {
        this.checkoutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.checkoutForm.reset();
    }

    // Pre-fill form with user data
    prefillForm() {
        const user = Auth.getUser();
        if (user) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = user.email;
            }
        }
    }

    // Setup form validation
    setupFormValidation() {
        const inputs = this.checkoutForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        if (!value) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        switch (fieldName) {
            case 'email':
                if (!FormValidator.validateEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'phone':
                if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'zipCode':
                if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    this.showFieldError(field, 'Please enter a valid ZIP code');
                    return false;
                }
                break;
            case 'cardNumber':
                if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value)) {
                    this.showFieldError(field, 'Please enter a valid card number');
                    return false;
                }
                break;
            case 'expiryDate':
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                    this.showFieldError(field, 'Please enter a valid expiry date (MM/YY)');
                    return false;
                }
                break;
            case 'cvv':
                if (!/^\d{3,4}$/.test(value)) {
                    this.showFieldError(field, 'Please enter a valid CVV');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    // Get field label
    getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            street: 'Street Address',
            city: 'City',
            state: 'State',
            zipCode: 'ZIP Code',
            country: 'Country',
            cardNumber: 'Card Number',
            expiryDate: 'Expiry Date',
            cvv: 'CVV'
        };
        return labels[fieldName] || fieldName;
    }

    // Show field error
    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#ff4757';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ff4757';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(field) {
        field.style.borderColor = '#e9ecef';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Validate entire form
    validateForm() {
        const inputs = this.checkoutForm.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Process checkout
    async processCheckout() {
        if (!this.validateForm()) {
            Toast.show('Please fix the errors in the form', 'error');
            return;
        }

        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const btnText = placeOrderBtn.querySelector('.btn-text');
        const btnSpinner = placeOrderBtn.querySelector('.btn-spinner');

        try {
            // Show loading state
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            placeOrderBtn.disabled = true;

            // Collect form data
            const formData = new FormData(this.checkoutForm);
            const shippingAddress = {
                street: formData.get('street'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            };

            // Prepare order data
            const orderData = cart.prepareOrderData(shippingAddress);

            // Create order
            const response = await API.createOrder(orderData);
            
            // Clear cart
            cart.clear();
            
            // Close checkout modal
            this.closeCheckoutModal();
            
            // Show success modal
            this.showOrderSuccess(response.order);

        } catch (error) {
            console.error('Checkout error:', error);
            Toast.show(error.message || 'Failed to process order. Please try again.', 'error');
        } finally {
            // Reset button state
            btnText.style.display = 'block';
            btnSpinner.style.display = 'none';
            placeOrderBtn.disabled = false;
        }
    }

    // Show order success modal
    showOrderSuccess(order) {
        const orderId = document.getElementById('orderId');
        const orderTotal = document.getElementById('orderTotal');

        if (orderId) orderId.textContent = order.id;
        if (orderTotal) orderTotal.textContent = `$${order.totalAmount.toFixed(2)}`;

        this.orderSuccessModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close order success modal
    closeOrderSuccessModal() {
        this.orderSuccessModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new Checkout();
});

// Export for use in other files
window.Checkout = Checkout;
