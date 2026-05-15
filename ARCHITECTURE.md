# 🏗️ Arquitectura y Diseño - Tienda Online

## Visión General

Tienda Online es una aplicación web construida con **arquitectura de capas** (Layered Architecture) que separa claramente la presentación, la lógica de negocio y el acceso a datos.

```
┌─────────────────────────────────────────────────┐
│          API REST (Controllers)                  │
│  /api/auth, /api/products, /api/cart, etc       │
└────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┼────────────────────────────┐
│   Security Layer    │  Validación & DTOs         │
│  (JWT, Roles)       │  (Validation, Conversion)  │
└────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┼────────────────────────────┐
│   Business Logic    │  (Services)                │
│  (AuthService,      │  - UserService             │
│   ProductService,   │  - ProductService          │
│   OrderService, etc) - CartService              │
└────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┼────────────────────────────┐
│   Data Access       │  (Repositories)            │
│   Layer             │  - UserRepository          │
│  (MongoDB)          │  - ProductRepository       │
│                     │  - OrderRepository, etc    │
└─────────────────────┼────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
      ┌───────┐            ┌─────────┐
      │MongoDB│            │  JWT    │
      │       │            │  Config │
      └───────┘            └─────────┘
```

---

## 📁 Estructura de Directorios

```
src/main/java/com/tienda/
├── TiendaOnlineApplication.java          # Clase principal
├── config/
│   └── SecurityConfig.java               # Configuración de Spring Security
├── controller/
│   ├── AuthController.java               # Autenticación
│   ├── ProductController.java            # Productos (público)
│   ├── CartController.java               # Carrito de compras
│   ├── OrderController.java              # Órdenes de comprador
│   ├── SellerController.java             # Panel de vendedor
│   └── AdminController.java              # Panel de administrador
├── dto/
│   ├── LoginRequestDTO.java
│   ├── LoginResponseDTO.java
│   ├── UserRegistrationDTO.java
│   ├── ProductDTO.java
│   ├── CreateProductDTO.java
│   ├── CartDTO.java
│   ├── OrderDTO.java
│   └── ...
├── entity/
│   ├── User.java                         # Usuario con roles
│   ├── Product.java                      # Producto de vendedor
│   ├── Cart.java                         # Carrito del comprador
│   ├── Order.java                        # Orden de compra
│   ├── CartItem.java                     # Item en carrito
│   ├── OrderItem.java                    # Item en orden
│   ├── UserRole.java                     # Enum: BUYER, SELLER, ADMIN
│   ├── OrderStatus.java                  # Enum: PENDING, SHIPPED, etc
│   └── StoreStatus.java                  # Enum: ACTIVE, INACTIVE, etc
├── repository/
│   ├── UserRepository.java               # MongoDB
│   ├── ProductRepository.java            # MongoDB
│   ├── CartRepository.java               # MongoDB
│   └── OrderRepository.java              # MongoDB
├── security/
│   ├── JwtService.java                   # Generación/validación JWT
│   ├── JwtAuthenticationFilter.java      # Filtro de autenticación
│   ├── CustomUserDetails.java            # UserDetails personalizado
│   └── CustomAuthentication.java         # Authentication personalizado
└── service/
    ├── AuthService.java                  # Lógica de autenticación
    ├── UserService.java                  # Gestión de usuarios
    ├── ProductService.java               # Gestión de productos
    ├── CartService.java                  # Lógica de carrito
    └── OrderService.java                 # Lógica de órdenes

src/test/java/com/tienda/
├── controller/
│   └── AuthControllerTest.java
└── service/
    └── ProductServiceTest.java

src/main/resources/
└── application.yml                       # Configuración de la app
```

---

## 🔄 Flujos Principales

### 1. Registro e Iniciar Sesión

```
Client                  Controller              Service               Repository
  │                        │                      │                        │
  ├──POST /register──────→ │                      │                        │
  │                        ├────register()───────→ │                        │
  │                        │                      ├──save(User)──────────→ │
  │                        │                      │←──User with ID────────┤
  │                        │←───LoginResponse────┤                        │
  │                        │                      │                        │
  │←─JWT Token────────────┤                      │                        │
  │                        │                      │                        │
```

### 2. Crear Producto (Vendedor)

```
Seller              Controller           Service           Repository
  │                    │                   │                   │
  ├─POST /seller/products──→ │                   │                   │
  │                    │                   │                   │
  │                    ├──createProduct()─→ │                   │
  │                    │                   ├──save(Product)──→ │
  │                    │                   │←──Product ID────┤
  │                    │←─ProductDTO───────┤                   │
  │                    │                   │                   │
  │←─Product Created──┤                   │                   │
  │                    │                   │                   │
```

### 3. Carrito y Compra (Comprador)

```
Buyer           Controller          Service           Repository
  │                  │                 │                  │
  ├─POST /cart/add──→ │                 │                  │
  │                  ├──addToCart()────→ │                  │
  │                  │                 ├──findCart()─────→ │
  │                  │                 │←──Cart────────────┤
  │                  │                 ├──addItem()       │
  │                  │                 ├──save(Cart)─────→ │
  │                  │←─CartDTO──────┤                  │
  │←─CartDTO────────┤                 │                  │
  │                  │                 │                  │
  ├─POST /orders────→ │                 │                  │
  │                  ├──createOrder()──→ │                  │
  │                  │                 ├──getCart()──────→ │
  │                  │                 ├──getUser()──────→ │
  │                  │                 ├──createOrder()   │
  │                  │                 ├──save(Order)────→ │
  │                  │                 ├──clearCart()────→ │
  │                  │←─OrderDTO──────┤                  │
  │←─Order Created───┤                 │                  │
  │                  │                 │                  │
```

---

## 🔐 Seguridad

### Autenticación JWT

1. **Registro/Login**: Cliente → Servidor → Recibe JWT Token
2. **Peticiones posteriores**: Cliente incluye `Authorization: Bearer <token>`
3. **Validación**: JwtAuthenticationFilter valida token antes de procesar
4. **Roles**: Spring Security valida permisos basados en rol

### Flujo de autenticación

```
Request con JWT
    ↓
JwtAuthenticationFilter
    ↓
¿Token válido?
    ├─ Sí → CustomUserDetails + CustomAuthentication
    │         ↓
    │      SecurityContext.setAuthentication()
    │         ↓
    │      Procesar request
    │
    └─ No → Rechazar con 401
```

---

## 📦 Entidades y Relaciones

```
┌────────────────┐
│      User      │
├────────────────┤
│ id             │◄─────────────────┐
│ email          │                  │
│ password       │                  │
│ firstName      │                  │
│ role           │                  │
│ storeName      │ (si es SELLER)   │
│ storeStatus    │                  │
└────────────────┘                  │
       │                            │
       │                            │
       ├─────────────────────────────┤
       │                             │
       ▼                             ▼
┌────────────────┐          ┌─────────────────┐
│    Product     │          │      Cart       │
├────────────────┤          ├─────────────────┤
│ id             │          │ id              │
│ name           │          │ userId          │◄─── Belongs to User
│ description    │          │ items[]         │
│ price          │          │ totalPrice      │
│ stock          │          └─────────────────┘
│ sellerId       │◄────────── Belongs to User
│ sellerName     │          
│ category       │          
└────────────────┘          
       │                    
       │ items              
       ▼                    
┌────────────────┐          
│   CartItem     │          
├────────────────┤          
│ productId      │          
│ quantity       │          
│ price          │          
└────────────────┘          

┌────────────────┐
│     Order      │
├────────────────┤
│ id             │
│ buyerId        │◄───────── Belongs to User (Buyer)
│ items[]        │
│ totalAmount    │
│ status         │
│ createdAt      │
│ shippedAt      │
│ deliveredAt    │
└────────────────┘
       │
       │ contains
       ▼
┌────────────────┐
│   OrderItem    │
├────────────────┤
│ productId      │
│ sellerId       │◄───────── Belongs to User (Seller)
│ quantity       │
│ unitPrice      │
└────────────────┘
```

---

## 🔌 APIs REST

### Convención de rutas

```
/api/auth/*              → Autenticación (pública)
/api/products/*          → Productos (pública, GET)
/api/seller/*            → Panel vendedor (requiere ROLE_SELLER)
/api/cart/*              → Carrito (requiere ROLE_BUYER)
/api/orders/*            → Órdenes (requiere ROLE_BUYER)
/api/admin/*             → Admin panel (requiere ROLE_ADMIN)
```

### Status HTTP

- `200` - OK / Success
- `201` - Created
- `400` - Bad Request (validación)
- `401` - Unauthorized (sin token/token inválido)
- `403` - Forbidden (sin permiso)
- `404` - Not Found
- `500` - Server Error

---

## 📊 Patrones de Diseño Utilizados

### 1. **Layered Architecture**
Separación clara entre controllers, services y repositories

### 2. **Data Transfer Object (DTO)**
Para transferir datos entre capas sin exponer entidades

### 3. **Repository Pattern**
Abstracción del acceso a datos con MongoDB

### 4. **Service Layer**
Concentra la lógica de negocio

### 5. **Dependency Injection**
Spring inyecta dependencias automáticamente

### 6. **Builder Pattern**
Construcción de objetos complejos (Lombok @Builder)

---

## 🗄️ MongoDB - Diseño de Colecciones

### users
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  zipCode: String,
  role: String (BUYER, SELLER, ADMIN),
  storeName: String,
  storeDescription: String,
  storeStatus: String,
  enabled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `email` (unique)
- `role`
- `createdAt`

### products
```javascript
{
  _id: ObjectId,
  name: String (indexed),
  description: String,
  price: Decimal128,
  stock: Integer,
  category: String (indexed),
  images: [String],
  sellerId: String (indexed),
  sellerName: String,
  rating: Integer,
  reviews: Integer,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `sellerId`
- `category`
- `active`
- Índice de texto para búsqueda

### carts
```javascript
{
  _id: ObjectId,
  userId: String (unique, indexed),
  items: [
    {
      productId: String,
      productName: String,
      quantity: Integer,
      price: Decimal128,
      sellerId: String,
      sellerName: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `userId` (unique)

### orders
```javascript
{
  _id: ObjectId,
  buyerId: String (indexed),
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  shippingAddress: String,
  shippingCity: String,
  shippingCountry: String,
  shippingZipCode: String,
  items: [
    {
      productId: String,
      productName: String,
      quantity: Integer,
      unitPrice: Decimal128,
      sellerId: String,
      sellerName: String
    }
  ],
  subtotal: Decimal128,
  tax: Decimal128,
  shippingCost: Decimal128,
  totalAmount: Decimal128,
  status: String (indexed),
  notes: String,
  createdAt: Date (indexed),
  updatedAt: Date,
  shippedAt: Date,
  deliveredAt: Date
}
```

**Índices:**
- `buyerId`
- `status`
- `createdAt`
- Índice compound: `items.sellerId`, `createdAt`

---

## 🚀 Ciclo de Vida de una Petición

1. **HTTP Request llega al servidor**
2. **Servlet container lo recibe**
3. **Spring Security Filter (JwtAuthenticationFilter)**
   - Valida JWT
   - Establece contexto de seguridad
4. **Router encuentra el Controller**
5. **Controller valida DTOs**
6. **Service ejecuta lógica de negocio**
7. **Repository accede a BD**
8. **Respuesta se devuelve en JSON**
9. **Client recibe response**

---

## 🔧 Configuración

### SecurityConfig
- Desactiva CSRF (para API REST)
- Stateless session (JWT)
- Autorización por rutas y roles
- Filtro de autenticación JWT

### application.yml
- Perfil dev/prod
- Conexión MongoDB
- Configuración JWT
- Logging

---

## 📈 Escalabilidad

### Consideraciones para producción

1. **Base de datos**: Usar MongoDB Atlas o cluster dedicado
2. **Caché**: Implementar Redis para caché de productos/usuarios
3. **Búsqueda**: Usar Elasticsearch para búsquedas complejas
4. **Colas**: Implementar RabbitMQ para procesar órdenes
5. **Notificaciones**: Integrar email (SendGrid) y SMS
6. **CDN**: Servir imágenes desde CDN (AWS S3 + CloudFront)
7. **Load Balancer**: Escalar horizontalmente
8. **Monitoreo**: ELK Stack o Datadog

---

## 🧪 Testing

- **Unit Tests**: Servicios y lógica de negocio
- **Integration Tests**: Controladores y repositorios
- **E2E Tests**: Flujos completos (recomendado con Postman/Selenium)

---

Esta arquitectura garantiza:
✅ Separación de responsabilidades
✅ Fácil mantenimiento
✅ Escalabilidad
✅ Seguridad
✅ Testabilidad
