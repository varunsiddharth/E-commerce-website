// Authentication functionality for login.html and register.html
class AuthApp {
    constructor() {
        this.isLoginPage = window.location.pathname.includes('login.html');
        this.isRegisterPage = window.location.pathname.includes('register.html');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggles();
        
        if (this.isRegisterPage) {
            this.setupPasswordStrength();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    // Setup password toggle functionality
    setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentNode.querySelector('input');
                const icon = toggle.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // Setup password strength indicator for register page
    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (passwordInput && strengthFill && strengthText) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                
                this.updatePasswordStrength(strength, strengthFill, strengthText);
            });
        }
    }

    // Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 3) return 'weak';
        if (score < 5) return 'medium';
        return 'strong';
    }

    // Update password strength display
    updatePasswordStrength(strength, strengthFill, strengthText) {
        strengthFill.className = `strength-fill ${strength}`;
        
        const strengthLabels = {
            weak: 'Weak',
            medium: 'Medium',
            strong: 'Strong'
        };
        
        strengthText.textContent = strengthLabels[strength];
    }

    // Setup real-time validation
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const nameInput = document.getElementById('name');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput);
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => {
                this.validatePassword(passwordInput);
            });
        }

        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                this.validateName(nameInput);
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', () => {
                this.validateConfirmPassword(confirmPasswordInput);
            });
        }
    }

    // Validate email field
    validateEmail(input) {
        const email = input.value.trim();
        const errorId = input.name + 'Error';
        
        if (!email) {
            FormValidator.showError(errorId, 'Email is required');
            return false;
        }
        
        if (!FormValidator.validateEmail(email)) {
            FormValidator.showError(errorId, 'Please enter a valid email address');
            return false;
        }
        
        FormValidator.hideError(errorId);
        return true;
    }

    // Validate password field
    validatePassword(input) {
        const password = input.value;
        const errorId = input.name + 'Error';
        
        if (!password) {
            FormValidator.showError(errorId, 'Password is required');
            return false;
        }
        
        if (!FormValidator.validatePassword(password)) {
            FormValidator.showError(errorId, 'Password must be at least 6 characters');
            return false;
        }
        
        FormValidator.hideError(errorId);
        return true;
    }

    // Validate name field
    validateName(input) {
        const name = input.value.trim();
        const errorId = input.name + 'Error';
        
        if (!name) {
            FormValidator.showError(errorId, 'Name is required');
            return false;
        }
        
        if (!FormValidator.validateName(name)) {
            FormValidator.showError(errorId, 'Name must be at least 2 characters');
            return false;
        }
        
        FormValidator.hideError(errorId);
        return true;
    }

    // Validate confirm password field
    validateConfirmPassword(input) {
        const confirmPassword = input.value;
        const password = document.getElementById('password').value;
        const errorId = input.name + 'Error';
        
        if (!confirmPassword) {
            FormValidator.showError(errorId, 'Please confirm your password');
            return false;
        }
        
        if (confirmPassword !== password) {
            FormValidator.showError(errorId, 'Passwords do not match');
            return false;
        }
        
        FormValidator.hideError(errorId);
        return true;
    }

    // Handle login form submission
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear previous errors
        FormValidator.clearAllErrors();

        // Validate form
        if (!this.validateEmail(document.getElementById('email')) ||
            !this.validatePassword(document.getElementById('password'))) {
            return;
        }

        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnSpinner = loginBtn.querySelector('.btn-spinner');

        try {
            // Show loading state
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            loginBtn.disabled = true;

            // Make API call
            const response = await API.login({ email, password });
            
            // Store auth data
            Auth.login(response.token, response.user);
            
            // Show success message
            Toast.show('Login successful! Welcome back.');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            
            // Show error message
            const errorMessage = error.message || 'Login failed. Please try again.';
            Toast.show(errorMessage, 'error');
            
            // Show field-specific errors if available
            if (error.message.includes('email') || error.message.includes('Email')) {
                FormValidator.showError('emailError', errorMessage);
            } else if (error.message.includes('password') || error.message.includes('Password')) {
                FormValidator.showError('passwordError', errorMessage);
            }

        } finally {
            // Reset button state
            btnText.style.display = 'block';
            btnSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    // Handle register form submission
    async handleRegister() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Clear previous errors
        FormValidator.clearAllErrors();

        // Validate form
        if (!this.validateName(document.getElementById('name')) ||
            !this.validateEmail(document.getElementById('email')) ||
            !this.validatePassword(document.getElementById('password')) ||
            !this.validateConfirmPassword(document.getElementById('confirmPassword'))) {
            return;
        }

        // Check terms agreement
        if (!agreeTerms) {
            Toast.show('Please agree to the terms and conditions', 'error');
            return;
        }

        const registerBtn = document.getElementById('registerBtn');
        const btnText = registerBtn.querySelector('.btn-text');
        const btnSpinner = registerBtn.querySelector('.btn-spinner');

        try {
            // Show loading state
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            registerBtn.disabled = true;

            // Make API call
            const response = await API.register({ name, email, password });
            
            // Store auth data
            Auth.login(response.token, response.user);
            
            // Show success message
            Toast.show('Registration successful! Welcome to ShopHub!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            
            // Show error message
            const errorMessage = error.message || 'Registration failed. Please try again.';
            Toast.show(errorMessage, 'error');
            
            // Show field-specific errors if available
            if (error.message.includes('email') || error.message.includes('Email')) {
                FormValidator.showError('emailError', errorMessage);
            } else if (error.message.includes('name') || error.message.includes('Name')) {
                FormValidator.showError('nameError', errorMessage);
            } else if (error.message.includes('password') || error.message.includes('Password')) {
                FormValidator.showError('passwordError', errorMessage);
            }

        } finally {
            // Reset button state
            btnText.style.display = 'block';
            btnSpinner.style.display = 'none';
            registerBtn.disabled = false;
        }
    }
}

// Initialize auth app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authApp = new AuthApp();
});

// Export for use in other files
window.AuthApp = AuthApp;
