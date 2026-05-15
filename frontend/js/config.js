// Configuration file for the e-commerce frontend
const CONFIG = {
    // API Configuration
    API_BASE_URL: 'http://localhost:8080/api',

    // API Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login'
        },

        // Products
        PRODUCTS: {
            GET_ALL: '/products',
            GET_BY_ID: '/products/{id}',
            SEARCH: '/products/search',
            BY_CATEGORY: '/products/category/{category}'
        },

        // Seller Products
        SELLER: {
            PRODUCTS: '/seller/products',
            CREATE_PRODUCT: '/seller/products',
            UPDATE_PRODUCT: '/seller/products/{id}',
            DELETE_PRODUCT: '/seller/products/{id}',
            ORDERS: '/seller/orders'
        },

        // Cart
        CART: {
            GET: '/cart',
            ADD: '/cart/add',
            REMOVE: '/cart/remove/{productId}',
            UPDATE: '/cart/update/{productId}',
            CLEAR: '/cart/clear'
        },

        // Orders
        ORDERS: {
            CREATE: '/orders',
            GET_BUYER_ORDERS: '/orders',
            GET_ORDER_BY_ID: '/orders/{id}'
        },

        // Admin
        ADMIN: {
            ORDERS: '/admin/orders',
            ORDER_BY_STATUS: '/admin/orders/status/{status}',
            UPDATE_ORDER_STATUS: '/admin/orders/{id}/status'
        }
    },

    // Local Storage Keys
    STORAGE: {
        TOKEN: 'auth_token',
        USER: 'user_info',
        CART: 'cart_data'
    },

    // Constants
    CONSTANTS: {
        TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
        DEFAULT_PAGE_SIZE: 20,
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    },

    // UI Messages
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Inicio de sesión exitoso',
            REGISTER: 'Registro exitoso',
            PRODUCT_ADDED: 'Producto agregado al carrito',
            ORDER_CREATED: 'Pedido creado exitosamente',
            PRODUCT_UPDATED: 'Producto actualizado',
            PRODUCT_DELETED: 'Producto eliminado'
        },
        ERROR: {
            NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
            UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            FORBIDDEN: 'No tienes permisos para realizar esta acción.',
            NOT_FOUND: 'Recurso no encontrado.',
            VALIDATION: 'Por favor, verifica los datos ingresados.',
            SERVER: 'Error del servidor. Inténtalo nuevamente.',
            CART_EMPTY: 'El carrito está vacío.',
            INSUFFICIENT_STOCK: 'Stock insuficiente para este producto.'
        }
    },

    // Order Status Mapping
    ORDER_STATUS: {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmado',
        SHIPPED: 'Enviado',
        DELIVERED: 'Entregado',
        CANCELLED: 'Cancelado',
        RETURNED: 'Devuelto'
    },

    // User Roles
    ROLES: {
        BUYER: 'BUYER',
        SELLER: 'SELLER',
        ADMIN: 'ADMIN'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
