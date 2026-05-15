// Shopping cart management
const Cart = {
    // Get cart from API
    async getCart() {
        if (!auth.isAuthenticated()) {
            return { items: [], totalItems: 0, totalPrice: 0 };
        }

        try {
            const token = auth.getToken();
            const cart = await api.getCart(token);
            this.updateCartBadge(cart.totalItems);
            return cart;
        } catch (error) {
            console.error('Error fetching cart:', error);
            Utils.showAlert(CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            return { items: [], totalItems: 0, totalPrice: 0 };
        }
    },

    // Add product to cart
    async addToCart(productId, quantity = 1) {
        if (!auth.isAuthenticated()) {
            Utils.showAlert('Debes iniciar sesión para agregar productos al carrito', 'warning');
            auth.showLoginModal();
            return;
        }

        try {
            Utils.showLoading('cartLoading');

            const token = auth.getToken();
            const cartData = { productId, quantity };

            const response = await api.addToCart(cartData, token);

            Utils.showAlert(CONFIG.MESSAGES.SUCCESS.PRODUCT_ADDED, 'success');
            Utils.hideLoading('cartLoading');

            // Update cart badge
            this.updateCartBadge(response.totalItems);

            return response;
        } catch (error) {
            Utils.hideLoading('cartLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Remove item from cart
    async removeFromCart(productId) {
        if (!auth.isAuthenticated()) return;

        try {
            Utils.showLoading('cartLoading');

            const token = auth.getToken();
            const response = await api.removeFromCart(productId, token);

            Utils.hideLoading('cartLoading');
            this.updateCartBadge(response.totalItems);

            // Refresh cart view if on cart page
            if (window.location.hash.includes('cart')) {
                main.renderCart();
            }

            return response;
        } catch (error) {
            Utils.hideLoading('cartLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Update cart item quantity
    async updateCartItemQuantity(productId, quantity) {
        if (!auth.isAuthenticated()) return;

        try {
            Utils.showLoading('cartLoading');

            const token = auth.getToken();
            const response = await api.updateCartItem(productId, quantity, token);

            Utils.hideLoading('cartLoading');
            this.updateCartBadge(response.totalItems);

            // Refresh cart view if on cart page
            if (window.location.hash.includes('cart')) {
                main.renderCart();
            }

            return response;
        } catch (error) {
            Utils.hideLoading('cartLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Clear entire cart
    async clearCart() {
        if (!auth.isAuthenticated()) return;

        try {
            Utils.showLoading('cartLoading');

            const token = auth.getToken();
            const response = await api.clearCart(token);

            Utils.hideLoading('cartLoading');
            this.updateCartBadge(0);

            // Refresh cart view if on cart page
            if (window.location.hash.includes('cart')) {
                main.renderCart();
            }

            return response;
        } catch (error) {
            Utils.hideLoading('cartLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            throw error;
        }
    },

    // Update cart badge in navbar
    updateCartBadge(count) {
        const cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
            cartBadge.textContent = count || 0;
            cartBadge.style.display = (count > 0) ? 'inline-block' : 'none';
        }
    },

    // Render cart items
    renderCartItems(cart) {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (!cart.items || cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Agrega algunos productos para comenzar!</p>
                    <button class="btn btn-primary" onclick="main.renderHomePage()">Ver Productos</button>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    📦
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.productName}</div>
                    <div class="cart-item-seller">Vendido por: ${item.sellerName}</div>
                    <div class="cart-item-price">${Utils.formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button onclick="cart.updateCartItemQuantity('${item.productId}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="cart.updateCartItemQuantity('${item.productId}', this.value)">
                        <button onclick="cart.updateCartItemQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${Utils.formatPrice(item.price * item.quantity)}</div>
                <button class="cart-item-remove" onclick="cart.removeFromCart('${item.productId}')">×</button>
            </div>
        `).join('');
    },

    // Render cart summary
    renderCartSummary(cart) {
        const cartSummary = document.getElementById('cartSummary');
        if (!cartSummary) return;

        const subtotal = cart.totalPrice || 0;
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
        const total = subtotal + tax + shipping;

        cartSummary.innerHTML = `
            <h3>Resumen del Pedido</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${Utils.formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Impuestos (8%):</span>
                <span>${Utils.formatPrice(tax)}</span>
            </div>
            <div class="summary-row">
                <span>Envío:</span>
                <span>${shipping === 0 ? 'Gratis' : Utils.formatPrice(shipping)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${Utils.formatPrice(total)}</span>
            </div>
            <button class="checkout-btn" onclick="main.renderCheckout()" ${cart.items.length === 0 ? 'disabled' : ''}>
                Proceder al Pago
            </button>
        `;
    },

    // Render complete cart page
    async renderCartPage() {
        const cart = await this.getCart();

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="cart-container">
                <h1>Carrito de Compras</h1>
                <div class="cart-layout">
                    <div id="cartItems" class="cart-items">
                        <!-- Cart items will be rendered here -->
                    </div>
                    <div id="cartSummary" class="cart-summary">
                        <!-- Cart summary will be rendered here -->
                    </div>
                </div>
                <div id="cartLoading" style="display: none;"></div>
            </div>
        `;

        this.renderCartItems(cart);
        this.renderCartSummary(cart);
    },

    // Render checkout form
    renderCheckoutForm() {
        const userInfo = auth.getUserInfo();

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="checkout-form">
                <h1>Finalizar Compra</h1>

                <div class="checkout-card">
                    <h3>Información de Envío</h3>
                    <form id="checkoutForm">
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" name="firstName" placeholder="Nombre" value="${userInfo?.firstName || ''}" required>
                            </div>
                            <div class="form-group">
                                <input type="text" name="lastName" placeholder="Apellido" value="${userInfo?.lastName || ''}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="email" name="email" placeholder="Correo electrónico" value="${userInfo?.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="phone" placeholder="Teléfono" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="address" placeholder="Dirección" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" name="city" placeholder="Ciudad" required>
                            </div>
                            <div class="form-group">
                                <input type="text" name="country" placeholder="País" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" name="zipCode" placeholder="Código Postal" required>
                            </div>
                            <div class="form-group">
                                <select name="paymentMethod" required>
                                    <option value="">Método de Pago</option>
                                    <option value="credit_card">Tarjeta de Crédito</option>
                                    <option value="debit_card">Tarjeta de Débito</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea name="notes" placeholder="Notas adicionales (opcional)" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-success btn-block">Confirmar Pedido</button>
                    </form>
                </div>

                <div id="checkoutLoading" style="display: none;"></div>
            </div>
        `;

        // Add form submit handler
        const form = document.getElementById('checkoutForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.processCheckout();
        });
    },

    // Process checkout
    async processCheckout() {
        try {
            Utils.showLoading('checkoutLoading');

            const formData = Utils.getFormData('checkoutForm');
            const token = auth.getToken();

            // Create order data
            const orderData = {
                shippingInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    zipCode: formData.zipCode
                },
                paymentMethod: formData.paymentMethod,
                notes: formData.notes || ''
            };

            const response = await api.createOrder(orderData, token);

            Utils.hideLoading('checkoutLoading');
            Utils.showAlert(CONFIG.MESSAGES.SUCCESS.ORDER_CREATED, 'success');

            // Show order confirmation
            this.renderOrderConfirmation(response);

        } catch (error) {
            Utils.hideLoading('checkoutLoading');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    },

    // Render order confirmation
    renderOrderConfirmation(order) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="order-confirmation">
                <div class="confirmation-icon">✅</div>
                <div class="confirmation-message">
                    <h2>¡Pedido Confirmado!</h2>
                    <p>Tu pedido ha sido procesado exitosamente.</p>
                </div>

                <div class="order-details">
                    <div class="order-details-row">
                        <span>Número de Pedido:</span>
                        <span>${order.id}</span>
                    </div>
                    <div class="order-details-row">
                        <span>Fecha:</span>
                        <span>${Utils.formatDate(order.createdAt)}</span>
                    </div>
                    <div class="order-details-row">
                        <span>Estado:</span>
                        <span>${Utils.formatOrderStatus(order.status)}</span>
                    </div>
                    <div class="order-details-row">
                        <span>Total:</span>
                        <span>${Utils.formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                <div class="order-actions">
                    <button class="btn btn-primary" onclick="main.renderDashboard()">Ver Mis Pedidos</button>
                    <button class="btn btn-secondary" onclick="main.renderHomePage()">Continuar Comprando</button>
                </div>
            </div>
        `;

        // Update cart badge to 0
        this.updateCartBadge(0);
    }
};

// Create global instance
const cart = Cart;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cart;
}
