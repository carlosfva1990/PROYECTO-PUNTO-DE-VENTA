// API client for communicating with the backend
class ApiClient {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
    }

    // Generic request method
    async request(method, endpoint, data = null, token = null) {
        const url = `${this.baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: method.toUpperCase(),
            headers
        };

        if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);

            // Handle unauthorized responses
            if (response.status === 401) {
                auth.logout();
                throw new Error(CONFIG.MESSAGES.ERROR.UNAUTHORIZED);
            }

            // Handle other error responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || CONFIG.MESSAGES.ERROR.SERVER);
            }

            // Return JSON response for successful requests
            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(CONFIG.MESSAGES.ERROR.NETWORK);
            }
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('POST', CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    }

    async login(credentials) {
        return this.request('POST', CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    }

    // Product methods
    async getAllProducts() {
        return this.request('GET', CONFIG.ENDPOINTS.PRODUCTS.GET_ALL);
    }

    async getProductById(productId) {
        const endpoint = CONFIG.ENDPOINTS.PRODUCTS.GET_BY_ID.replace('{id}', productId);
        return this.request('GET', endpoint);
    }

    async searchProducts(keyword) {
        const endpoint = `${CONFIG.ENDPOINTS.PRODUCTS.SEARCH}?keyword=${encodeURIComponent(keyword)}`;
        return this.request('GET', endpoint);
    }

    async getProductsByCategory(category) {
        const endpoint = CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY.replace('{category}', category);
        return this.request('GET', endpoint);
    }

    // Seller methods
    async getSellerProducts(token) {
        return this.request('GET', CONFIG.ENDPOINTS.SELLER.PRODUCTS, null, token);
    }

    async createProduct(productData, token) {
        return this.request('POST', CONFIG.ENDPOINTS.SELLER.CREATE_PRODUCT, productData, token);
    }

    async updateProduct(productId, productData, token) {
        const endpoint = CONFIG.ENDPOINTS.SELLER.UPDATE_PRODUCT.replace('{id}', productId);
        return this.request('PUT', endpoint, productData, token);
    }

    async deleteProduct(productId, token) {
        const endpoint = CONFIG.ENDPOINTS.SELLER.DELETE_PRODUCT.replace('{id}', productId);
        return this.request('DELETE', endpoint, null, token);
    }

    async getSellerOrders(token) {
        return this.request('GET', CONFIG.ENDPOINTS.SELLER.ORDERS, null, token);
    }

    // Cart methods
    async getCart(token) {
        return this.request('GET', CONFIG.ENDPOINTS.CART.GET, null, token);
    }

    async addToCart(cartData, token) {
        return this.request('POST', CONFIG.ENDPOINTS.CART.ADD, cartData, token);
    }

    async removeFromCart(productId, token) {
        const endpoint = CONFIG.ENDPOINTS.CART.REMOVE.replace('{productId}', productId);
        return this.request('DELETE', endpoint, null, token);
    }

    async updateCartItem(productId, quantity, token) {
        const endpoint = CONFIG.ENDPOINTS.CART.UPDATE.replace('{productId}', productId);
        return this.request('PUT', endpoint, { quantity }, token);
    }

    async clearCart(token) {
        return this.request('DELETE', CONFIG.ENDPOINTS.CART.CLEAR, null, token);
    }

    // Order methods
    async createOrder(orderData, token) {
        return this.request('POST', CONFIG.ENDPOINTS.ORDERS.CREATE, orderData, token);
    }

    async getBuyerOrders(token) {
        return this.request('GET', CONFIG.ENDPOINTS.ORDERS.GET_BUYER_ORDERS, null, token);
    }

    async getOrderById(orderId, token) {
        const endpoint = CONFIG.ENDPOINTS.ORDERS.GET_ORDER_BY_ID.replace('{id}', orderId);
        return this.request('GET', endpoint, null, token);
    }

    // Admin methods
    async getAllOrders(token) {
        return this.request('GET', CONFIG.ENDPOINTS.ADMIN.ORDERS, null, token);
    }

    async getOrdersByStatus(status, token) {
        const endpoint = CONFIG.ENDPOINTS.ADMIN.ORDER_BY_STATUS.replace('{status}', status);
        return this.request('GET', endpoint, null, token);
    }

    async updateOrderStatus(orderId, status, token) {
        const endpoint = CONFIG.ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS.replace('{id}', orderId);
        return this.request('PUT', endpoint, { status }, token);
    }
}

// Create singleton instance
const api = new ApiClient();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
