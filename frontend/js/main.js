// Main application logic and routing
const Main = {
    // Initialize the application
    init() {
        // Check authentication on load
        auth.checkAuthOnLoad();

        // Set up event listeners
        this.setupEventListeners();

        // Handle initial routing
        this.handleRouting();

        // Load initial data
        this.loadInitialData();
    },

    // Set up global event listeners
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('hashchange', () => this.handleRouting());

        // Handle logout from user menu
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn')) {
                e.preventDefault();
                auth.logout();
            }
        });
    },

    // Handle routing based on URL hash
    handleRouting() {
        const hash = window.location.hash.substring(1); // Remove #

        switch (hash) {
            case '':
            case 'home':
                this.renderHomePage();
                break;
            case 'cart':
                this.renderCart();
                break;
            case 'checkout':
                this.renderCheckout();
                break;
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'login':
                auth.showLoginModal();
                break;
            case 'register':
                auth.showRegisterModal();
                break;
            default:
                // Handle product detail pages
                if (hash.startsWith('product/')) {
                    const productId = hash.split('/')[1];
                    this.renderProductDetail(productId);
                } else {
                    this.renderHomePage();
                }
                break;
        }
    },

    // Load initial data
    async loadInitialData() {
        try {
            // Load products for home page
            await this.loadProducts();

            // Update cart badge
            if (auth.isAuthenticated()) {
                const cartData = await cart.getCart();
                cart.updateCartBadge(cartData.totalItems);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    },

    // Load products data
    async loadProducts() {
        try {
            const products = await api.getAllProducts();
            this.products = products; // Store for later use
            return products;
        } catch (error) {
            console.error('Error loading products:', error);
            Utils.showAlert(CONFIG.MESSAGES.ERROR.SERVER, 'danger');
            return [];
        }
    },

    // Render home page with product grid
    async renderHomePage() {
        const mainContent = document.getElementById('mainContent');

        // Show loading
        mainContent.innerHTML = '<div id="loading" class="text-center"><div class="spinner"></div></div>';

        try {
            const products = await this.loadProducts();

            mainContent.innerHTML = `
                <div class="products-header">
                    <h1>Tienda Online</h1>
                    <p>Descubre productos únicos de vendedores locales</p>
                </div>

                <div class="products-filter">
                    <input type="text" id="searchInput" placeholder="Buscar productos..." class="search-input">
                    <select id="categoryFilter" class="filter-select">
                        <option value="">Todas las categorías</option>
                        <option value="electronics">Electrónicos</option>
                        <option value="clothing">Ropa</option>
                        <option value="home">Hogar</option>
                        <option value="sports">Deportes</option>
                        <option value="books">Libros</option>
                    </select>
                </div>

                <div id="productsGrid" class="products-grid">
                    <!-- Products will be rendered here -->
                </div>
            `;

            this.renderProductGrid(products);

            // Set up search and filter listeners
            this.setupProductFilters();

        } catch (error) {
            mainContent.innerHTML = `
                <div class="text-center">
                    <h2>Error al cargar productos</h2>
                    <p>Por favor, intenta nuevamente más tarde.</p>
                    <button class="btn btn-primary" onclick="main.renderHomePage()">Reintentar</button>
                </div>
            `;
        }
    },

    // Render product grid
    renderProductGrid(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (!products || products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2>No se encontraron productos</h2>
                    <p>Intenta con otros términos de búsqueda.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" onclick="main.renderProductDetail('${product.id}')">
                <div class="product-image">
                    📦
                </div>
                <div class="product-info">
                    <div class="product-name">${Utils.truncateText(product.name, 50)}</div>
                    <div class="product-seller">${product.sellerName}</div>
                    <div class="product-price">${Utils.formatPrice(product.price)}</div>
                    <div class="product-stock ${product.stock < 5 ? 'low-stock' : ''}">
                        ${product.stock} disponibles
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); cart.addToCart('${product.id}', 1)">
                            Agregar al Carrito
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); main.renderProductDetail('${product.id}')">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Set up product search and filter
    setupProductFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        const filterProducts = Utils.debounce(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;

            let filteredProducts = this.products;

            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm)
                );
            }

            if (category) {
                filteredProducts = filteredProducts.filter(product =>
                    product.category === category
                );
            }

            this.renderProductGrid(filteredProducts);
        }, 300);

        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    },

    // Render product detail page
    async renderProductDetail(productId) {
        const mainContent = document.getElementById('mainContent');

        // Show loading
        mainContent.innerHTML = '<div id="loading" class="text-center"><div class="spinner"></div></div>';

        try {
            const product = await api.getProductById(productId);

            mainContent.innerHTML = `
                <div class="product-detail">
                    <div class="product-detail-image">
                        📦
                    </div>
                    <div class="product-detail-info">
                        <h1>${product.name}</h1>
                        <p class="product-seller">Vendido por: ${product.sellerName}</p>
                        <div class="product-price">${Utils.formatPrice(product.price)}</div>
                        <div class="product-stock ${product.stock < 5 ? 'low-stock' : ''}">
                            ${product.stock} disponibles
                        </div>
                        <div class="product-description">
                            <h3>Descripción</h3>
                            <p>${product.description}</p>
                        </div>
                        <div class="product-detail-actions">
                            <div class="quantity-selector">
                                <button id="decreaseQty">-</button>
                                <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                                <button id="increaseQty">+</button>
                            </div>
                            <button class="btn btn-primary btn-block" onclick="cart.addToCart('${product.id}', parseInt(document.getElementById('quantity').value))">
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Set up quantity controls
            this.setupQuantityControls(product.stock);

        } catch (error) {
            mainContent.innerHTML = `
                <div class="text-center">
                    <h2>Error al cargar el producto</h2>
                    <p>El producto podría no existir o haber sido eliminado.</p>
                    <button class="btn btn-primary" onclick="main.renderHomePage()">Volver al Inicio</button>
                </div>
            `;
        }
    },

    // Set up quantity controls
    setupQuantityControls(maxStock) {
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');

        const updateQuantity = (newValue) => {
            const value = Math.max(1, Math.min(maxStock, newValue));
            quantityInput.value = value;
            decreaseBtn.disabled = value <= 1;
            increaseBtn.disabled = value >= maxStock;
        };

        decreaseBtn.addEventListener('click', () => {
            updateQuantity(parseInt(quantityInput.value) - 1);
        });

        increaseBtn.addEventListener('click', () => {
            updateQuantity(parseInt(quantityInput.value) + 1);
        });

        quantityInput.addEventListener('change', () => {
            updateQuantity(parseInt(quantityInput.value));
        });

        // Initial state
        updateQuantity(1);
    },

    // Render cart page
    renderCart() {
        if (!auth.isAuthenticated()) {
            Utils.showAlert('Debes iniciar sesión para ver tu carrito', 'warning');
            auth.showLoginModal();
            return;
        }

        cart.renderCartPage();
    },

    // Render checkout page
    renderCheckout() {
        if (!auth.isAuthenticated()) {
            Utils.showAlert('Debes iniciar sesión para proceder al pago', 'warning');
            auth.showLoginModal();
            return;
        }

        cart.renderCheckoutForm();
    },

    // Render dashboard
    async renderDashboard() {
        if (!auth.isAuthenticated()) {
            Utils.showAlert('Debes iniciar sesión para acceder al dashboard', 'warning');
            auth.showLoginModal();
            return;
        }

        const userInfo = auth.getUserInfo();
        const mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = '<div id="loading" class="text-center"><div class="spinner"></div></div>';

        try {
            if (userInfo.role === CONFIG.ROLES.SELLER) {
                await this.renderSellerDashboard();
            } else if (userInfo.role === CONFIG.ROLES.ADMIN) {
                await this.renderAdminDashboard();
            } else {
                await this.renderBuyerDashboard();
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            Utils.showAlert(CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    },

    // Render buyer dashboard
    async renderBuyerDashboard() {
        const token = auth.getToken();
        const orders = await api.getBuyerOrders(token);

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-content">
                    <div class="dashboard-header">
                        <h1>Mis Pedidos</h1>
                    </div>

                    <div id="ordersContainer" class="buyer-orders">
                        <!-- Orders will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        this.renderBuyerOrders(orders);
    },

    // Render buyer orders
    renderBuyerOrders(orders) {
        const container = document.getElementById('ordersContainer');

        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No tienes pedidos aún</h2>
                    <p>¡Comienza comprando productos en nuestra tienda!</p>
                    <button class="btn btn-primary" onclick="main.renderHomePage()">Ver Productos</button>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-number">Pedido #${order.id}</div>
                    <div class="order-date">${Utils.formatShortDate(order.createdAt)}</div>
                </div>

                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.productName} (x${item.quantity})</span>
                            <span>${Utils.formatPrice(item.unitPrice * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="order-total">
                    <span>Total:</span>
                    <span>${Utils.formatPrice(order.totalAmount)}</span>
                </div>

                <div class="order-actions">
                    <button class="btn btn-outline btn-sm" onclick="main.showOrderDetails('${order.id}')">
                        Ver Detalles
                    </button>
                    <span class="order-status status-${order.status.toLowerCase()}">
                        ${Utils.formatOrderStatus(order.status)}
                    </span>
                </div>
            </div>
        `).join('');
    },

    // Render seller dashboard
    async renderSellerDashboard() {
        const token = auth.getToken();
        const products = await api.getSellerProducts(token);
        const orders = await api.getSellerOrders(token);

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-sidebar">
                    <ul class="sidebar-menu">
                        <li><a href="#" class="active" onclick="main.showSellerSection('products')">Mis Productos</a></li>
                        <li><a href="#" onclick="main.showSellerSection('orders')">Pedidos</a></li>
                        <li><a href="#" onclick="main.showSellerSection('add-product')">Agregar Producto</a></li>
                    </ul>
                </div>

                <div class="dashboard-content">
                    <div id="sellerContent">
                        <!-- Seller content will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        this.showSellerSection('products');
    },

    // Show seller dashboard section
    async showSellerSection(section) {
        const content = document.getElementById('sellerContent');
        const menuLinks = document.querySelectorAll('.sidebar-menu a');

        // Update active menu
        menuLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');

        try {
            if (section === 'products') {
                await this.renderSellerProducts();
            } else if (section === 'orders') {
                await this.renderSellerOrders();
            } else if (section === 'add-product') {
                this.renderAddProductForm();
            }
        } catch (error) {
            console.error('Error loading seller section:', error);
            Utils.showAlert(CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    },

    // Render seller products
    async renderSellerProducts() {
        const token = auth.getToken();
        const products = await api.getSellerProducts(token);

        const content = document.getElementById('sellerContent');
        content.innerHTML = `
            <div class="dashboard-header">
                <h1>Mis Productos</h1>
                <button class="btn btn-primary" onclick="main.showSellerSection('add-product')">Agregar Producto</button>
            </div>

            <div id="sellerProducts" class="seller-products">
                <!-- Products will be rendered here -->
            </div>
        `;

        this.renderSellerProductGrid(products);
    },

    // Render seller product grid
    renderSellerProductGrid(products) {
        const container = document.getElementById('sellerProducts');

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No tienes productos aún</h2>
                    <p>¡Comienza agregando tu primer producto!</p>
                    <button class="btn btn-primary" onclick="main.showSellerSection('add-product')">Agregar Producto</button>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="seller-product-card">
                <div class="seller-product-image">
                    📦
                </div>
                <div class="seller-product-info">
                    <div class="seller-product-name">${product.name}</div>
                    <div class="seller-product-price">${Utils.formatPrice(product.price)}</div>
                    <div class="seller-product-stock">Stock: ${product.stock}</div>
                    <div class="product-actions">
                        <button class="btn btn-outline btn-sm" onclick="main.editProduct('${product.id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="main.deleteProduct('${product.id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Render add product form
    renderAddProductForm(product = null) {
        const content = document.getElementById('sellerContent');
        const isEdit = product !== null;

        content.innerHTML = `
            <div class="dashboard-header">
                <h1>${isEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
            </div>

            <div class="product-form">
                <form id="productForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Nombre del producto" value="${product?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <input type="number" name="price" placeholder="Precio" step="0.01" value="${product?.price || ''}" required>
                        </div>
                        <div class="form-group">
                            <input type="number" name="stock" placeholder="Stock" value="${product?.stock || ''}" required>
                        </div>
                        <div class="form-group">
                            <select name="category" required>
                                <option value="">Selecciona categoría</option>
                                <option value="electronics" ${product?.category === 'electronics' ? 'selected' : ''}>Electrónicos</option>
                                <option value="clothing" ${product?.category === 'clothing' ? 'selected' : ''}>Ropa</option>
                                <option value="home" ${product?.category === 'home' ? 'selected' : ''}>Hogar</option>
                                <option value="sports" ${product?.category === 'sports' ? 'selected' : ''}>Deportes</option>
                                <option value="books" ${product?.category === 'books' ? 'selected' : ''}>Libros</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <textarea name="description" placeholder="Descripción del producto" rows="4" required>${product?.description || ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? 'Actualizar Producto' : 'Agregar Producto'}
                    </button>
                </form>
            </div>
        `;

        // Add form submit handler
        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProduct(isEdit ? product.id : null);
        });
    },

    // Save product
    async saveProduct(productId = null) {
        try {
            Utils.showLoading('productForm');

            const formData = Utils.getFormData('productForm');
            const token = auth.getToken();

            // Convert string values to appropriate types
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };

            if (productId) {
                await api.updateProduct(productId, productData, token);
                Utils.showAlert(CONFIG.MESSAGES.SUCCESS.PRODUCT_UPDATED, 'success');
            } else {
                await api.createProduct(productData, token);
                Utils.showAlert(CONFIG.MESSAGES.SUCCESS.PRODUCT_ADDED, 'success');
            }

            Utils.hideLoading('productForm');

            // Refresh products list
            this.showSellerSection('products');

        } catch (error) {
            Utils.hideLoading('productForm');
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    },

    // Delete product
    async deleteProduct(productId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            const token = auth.getToken();
            await api.deleteProduct(productId, token);
            Utils.showAlert(CONFIG.MESSAGES.SUCCESS.PRODUCT_DELETED, 'success');

            // Refresh products list
            this.showSellerSection('products');

        } catch (error) {
            Utils.showAlert(error.message || CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    },

    // Show order details modal
    async showOrderDetails(orderId) {
        try {
            const token = auth.getToken();
            const order = await api.getOrderById(orderId, token);

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Detalles del Pedido #${order.id}</h3>
                        <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="order-details">
                            <p><strong>Fecha:</strong> ${Utils.formatDate(order.createdAt)}</p>
                            <p><strong>Estado:</strong> ${Utils.formatOrderStatus(order.status)}</p>
                            <p><strong>Cliente:</strong> ${order.buyerInfo.firstName} ${order.buyerInfo.lastName}</p>
                            <p><strong>Email:</strong> ${order.buyerInfo.email}</p>
                            <p><strong>Teléfono:</strong> ${order.buyerInfo.phone}</p>
                            <p><strong>Dirección:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.country}</p>

                            <h4>Productos:</h4>
                            <div class="order-items">
                                ${order.items.map(item => `
                                    <div class="order-item">
                                        <span>${item.productName} (x${item.quantity})</span>
                                        <span>${Utils.formatPrice(item.unitPrice * item.quantity)}</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="order-total">
                                <span>Total:</span>
                                <span>${Utils.formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            modal.classList.add('show');

        } catch (error) {
            Utils.showAlert(CONFIG.MESSAGES.ERROR.SERVER, 'danger');
        }
    }
};

// Create global instance
const main = Main;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
}
