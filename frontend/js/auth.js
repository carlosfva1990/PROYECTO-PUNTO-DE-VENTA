// Authentication management
const Auth = {
    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            // Parse token to check expiry
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            // Check if token is expired (with buffer)
            return (payload.exp - CONFIG.CONSTANTS.TOKEN_EXPIRY_BUFFER / 1000) > currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return false;
        }
    },

    // Get stored token
    getToken() {
        return Utils.getFromStorage(CONFIG.STORAGE.TOKEN);
    },

    // Get stored user info
    getUserInfo() {
        return Utils.getFromStorage(CONFIG.STORAGE.USER);
    },

    // Store authentication data
    setAuthData(token, userInfo) {
        Utils.setInStorage(CONFIG.STORAGE.TOKEN, token);
        Utils.setInStorage(CONFIG.STORAGE.USER, userInfo);
    },

    // Clear authentication data
    clearAuthData() {
        Utils.removeFromStorage(CONFIG.STORAGE.TOKEN);
        Utils.removeFromStorage(CONFIG.STORAGE.USER);
        Utils.removeFromStorage(CONFIG.STORAGE.CART);
    },

    // Login user
    async login(email, password) {
        try {
            Utils.showLoading('authLoading');

            const response = await api.login({ email, password });

            this.setAuthData(response.token, {
                id: response.userId,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                role: response.role
            });

            Utils.showAlert(CONFIG.MESSAGES.SUCCESS.LOGIN, 'success');
            Utils.hideLoading('authLoading');

            // Update UI and redirect
            this.updateNavbar();
            this.redirectAfterLogin();

            return response;
        } catch (error) {
            Utils.hideLoading('authLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Register user
    async register(userData) {
        try {
            Utils.showLoading('authLoading');

            const response = await api.register(userData);

            this.setAuthData(response.token, {
                id: response.userId,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                role: response.role
            });

            Utils.showAlert(CONFIG.MESSAGES.SUCCESS.REGISTER, 'success');
            Utils.hideLoading('authLoading');

            // Update UI and redirect
            this.updateNavbar();
            this.redirectAfterLogin();

            return response;
        } catch (error) {
            Utils.hideLoading('authLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Logout user
    logout() {
        this.clearAuthData();
        this.updateNavbar();
        this.redirectToHome();
    },

    // Update navbar based on authentication status
    updateNavbar() {
        const userInfo = this.getUserInfo();
        const navbarMenu = document.querySelector('.navbar-menu');
        const userMenu = document.querySelector('.user-menu');

        if (!navbarMenu) return;

        if (this.isAuthenticated() && userInfo) {
            // Show authenticated menu
            navbarMenu.innerHTML = `
                <li><a href="#" onclick="main.renderHomePage()">Inicio</a></li>
                <li><a href="#" onclick="main.renderCart()">Carrito <span id="cartCount" class="cart-badge">0</span></a></li>
                <li><a href="#" onclick="main.renderDashboard()">Dashboard</a></li>
            `;

            // Show user dropdown
            if (userMenu) {
                userMenu.style.display = 'block';
                const userNameElement = userMenu.querySelector('.user-name');
                if (userNameElement) {
                    userNameElement.textContent = `${userInfo.firstName} ${userInfo.lastName}`;
                }
            }
        } else {
            // Show guest menu
            navbarMenu.innerHTML = `
                <li><a href="#" onclick="main.renderHomePage()">Inicio</a></li>
                <li><a href="#" onclick="auth.showLoginModal()">Iniciar Sesión</a></li>
                <li><a href="#" onclick="auth.showRegisterModal()">Registrarse</a></li>
            `;

            // Hide user dropdown
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }

        // Update cart badge
        cart.updateCartBadge();
    },

    // Redirect after successful login
    redirectAfterLogin() {
        const userInfo = this.getUserInfo();
        if (userInfo.role === CONFIG.ROLES.SELLER) {
            main.renderDashboard();
        } else if (userInfo.role === CONFIG.ROLES.ADMIN) {
            main.renderDashboard();
        } else {
            main.renderHomePage();
        }
    },

    // Redirect to home page
    redirectToHome() {
        window.location.hash = '';
        main.renderHomePage();
    },

    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('authModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');

        modalTitle.textContent = 'Iniciar Sesión';
        modalBody.innerHTML = `
            <form id="loginForm">
                <div class="form-group">
                    <input type="email" name="email" placeholder="Correo electrónico" required>
                    <div class="error-message"></div>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Contraseña" required>
                    <div class="error-message"></div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Iniciar Sesión</button>
            </form>
            <div class="auth-footer">
                <p>¿No tienes cuenta? <a href="#" onclick="auth.showRegisterModal()">Regístrate aquí</a></p>
            </div>
        `;

        // Add form submit handler
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = Utils.getFormData('loginForm');

            try {
                await this.login(formData.email, formData.password);
                Utils.hideModal('authModal');
            } catch (error) {
                // Error already shown by login method
            }
        });

        Utils.showModal('authModal');
    },

    // Show register modal
    showRegisterModal() {
        const modal = document.getElementById('authModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');

        modalTitle.textContent = 'Registrarse';
        modalBody.innerHTML = `
            <form id="registerForm">
                <div class="form-group">
                    <select name="role" required onchange="auth.toggleStoreFields()">
                        <option value="">Selecciona tu rol</option>
                        <option value="BUYER">Comprador</option>
                        <option value="SELLER">Vendedor</option>
                    </select>
                    <div class="error-message"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" name="firstName" placeholder="Nombre" required>
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="lastName" placeholder="Apellido" required>
                        <div class="error-message"></div>
                    </div>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Correo electrónico" required>
                    <div class="error-message"></div>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Contraseña" required>
                    <div class="error-message"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" name="phone" placeholder="Teléfono" required>
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="zipCode" placeholder="Código Postal" required>
                        <div class="error-message"></div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" name="city" placeholder="Ciudad" required>
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="country" placeholder="País" required>
                        <div class="error-message"></div>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" name="address" placeholder="Dirección" required>
                    <div class="error-message"></div>
                </div>
                <div class="store-info" id="storeFields" style="display: none;">
                    <h4>Información de la Tienda</h4>
                    <div class="form-group">
                        <input type="text" name="storeName" placeholder="Nombre de la Tienda">
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <textarea name="storeDescription" placeholder="Descripción de la Tienda" rows="3"></textarea>
                        <div class="error-message"></div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Registrarse</button>
            </form>
            <div class="auth-footer">
                <p>¿Ya tienes cuenta? <a href="#" onclick="auth.showLoginModal()">Inicia sesión aquí</a></p>
            </div>
        `;

        // Add form submit handler
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = Utils.getFormData('registerForm');

            try {
                await this.register(formData);
                Utils.hideModal('authModal');
            } catch (error) {
                // Error already shown by register method
            }
        });

        Utils.showModal('authModal');
    },

    // Toggle store fields based on role selection
    toggleStoreFields() {
        const roleSelect = document.querySelector('select[name="role"]');
        const storeFields = document.getElementById('storeFields');

        if (roleSelect.value === CONFIG.ROLES.SELLER) {
            storeFields.style.display = 'block';
            storeFields.querySelector('input[name="storeName"]').required = true;
        } else {
            storeFields.style.display = 'none';
            storeFields.querySelector('input[name="storeName"]').required = false;
        }
    },

    // Check authentication on page load
    checkAuthOnLoad() {
        if (this.isAuthenticated()) {
            this.updateNavbar();
        } else {
            this.updateNavbar();
        }
    }
};

// Create global instance
const auth = Auth;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = auth;
}
