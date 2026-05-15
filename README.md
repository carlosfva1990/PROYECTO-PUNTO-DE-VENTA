# Tienda Online - Plataforma de E-commerce

Una plataforma completa de tienda online construida con **Spring Boot 3.2**, **Java 17** y **MongoDB**, que permite a vendedores subir productos, a compradores hacer compras y a administradores monitorear todas las transacciones.

## 🎯 Características principales

### 👥 Gestión de Usuarios
- **Autenticación JWT** segura
- Tres roles de usuario:
  - **BUYER**: Comprador - navega y compra productos
  - **SELLER**: Vendedor - sube y gestiona productos
  - **ADMIN**: Administrador - monitorea compras y usuarios

### 🛍️ Funcionalidades de Tienda
- **Productos**: Los vendedores pueden subir, editar y eliminar artículos
- **Búsqueda**: Búsqueda de productos por nombre, descripción o categoría
- **Carrito**: Sistema completo de carrito de compras
- **Órdenes**: Sistema de compras con estado de seguimiento
- **Dashboard Admin**: Vista de todas las órdenes y su estado

## 🛠️ Requisitos previos

- Java 17 o superior
- Maven 3.8.0 o superior
- MongoDB 4.4 o superior
- Git

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone <repositorio-url>
cd poyecto-Punto-De-Venta
```

### 2. Instalar MongoDB

#### En Windows:
Descargar desde https://www.mongodb.com/try/download/community

#### En Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### En macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 3. Configurar la base de datos

Editar `src/main/resources/application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/tienda_online
```

### 4. Compilar y ejecutar

```bash
mvn clean install
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080/api`

## 📡 Endpoints API

### Autenticación
```
POST   /api/auth/register     - Registrar nuevo usuario
POST   /api/auth/login        - Iniciar sesión
```

### Productos (Público)
```
GET    /api/products                    - Listar todos los productos
GET    /api/products/{productId}        - Obtener detalle de producto
GET    /api/products/search?keyword=... - Buscar productos
GET    /api/products/category/{name}    - Productos por categoría
```

### Carrito (Comprador)
```
GET    /api/cart                           - Ver carrito
POST   /api/cart/add                       - Agregar producto al carrito
DELETE /api/cart/remove/{productId}        - Remover producto del carrito
PUT    /api/cart/update/{productId}        - Actualizar cantidad de producto
DELETE /api/cart/clear                     - Vaciar carrito
```

### Órdenes (Comprador)
```
POST   /api/orders                    - Crear orden
GET    /api/orders                    - Ver mis órdenes
GET    /api/orders/{orderId}          - Detalle de orden
```

### Vendedor
```
POST   /api/seller/products           - Crear producto
GET    /api/seller/products           - Mis productos
PUT    /api/seller/products/{id}      - Editar producto
DELETE /api/seller/products/{id}      - Eliminar producto
GET    /api/seller/orders             - Órdenes de mis productos
GET    /api/seller/orders/{orderId}   - Detalle de orden
```

### Administrador
```
GET    /api/admin/orders                      - Todas las órdenes
GET    /api/admin/orders/status/{status}      - Órdenes por estado
GET    /api/admin/orders/{orderId}            - Detalle de orden
PUT    /api/admin/orders/{orderId}/status     - Cambiar estado de orden
```

## 🔐 Autenticación

Todas las peticiones (excepto auth y productos públicos) requieren un header:
```
Authorization: Bearer <jwt-token>
```

### Ejemplo de login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "abc123",
  "email": "buyer@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "BUYER"
}
```

## 📊 Estructura de Proyecto

```
src/
├── main/
│   ├── java/com/tienda/
│   │   ├── TiendaOnlineApplication.java    - Clase principal
│   │   ├── config/                         - Configuraciones
│   │   │   └── SecurityConfig.java         - Configuración de seguridad
│   │   ├── controller/                     - Controladores REST
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   ├── SellerController.java
│   │   │   └── AdminController.java
│   │   ├── dto/                            - Data Transfer Objects
│   │   ├── entity/                         - Entidades MongoDB
│   │   ├── repository/                     - Interfaces de repositorio
│   │   ├── security/                       - Autenticación JWT
│   │   └── service/                        - Servicios de negocio
│   └── resources/
│       └── application.yml                 - Configuración de la app
```

## 🗄️ Modelo de Datos

### Users
```javascript
{
  "_id": ObjectId,
  "email": string,
  "password": string (encrypted),
  "firstName": string,
  "lastName": string,
  "phone": string,
  "address": string,
  "role": "BUYER|SELLER|ADMIN",
  "storeName": string (si es SELLER),
  "storeDescription": string (si es SELLER),
  "storeStatus": "ACTIVE|INACTIVE|SUSPENDED",
  "enabled": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Products
```javascript
{
  "_id": ObjectId,
  "name": string,
  "description": string,
  "price": decimal,
  "stock": integer,
  "category": string,
  "images": [string],
  "sellerId": string (userId del vendedor),
  "sellerName": string,
  "active": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Orders
```javascript
{
  "_id": ObjectId,
  "buyerId": string,
  "buyerName": string,
  "buyerEmail": string,
  "items": [OrderItem],
  "subtotal": decimal,
  "tax": decimal,
  "shippingCost": decimal,
  "totalAmount": decimal,
  "status": "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED",
  "createdAt": timestamp,
  "updatedAt": timestamp,
  "shippedAt": timestamp,
  "deliveredAt": timestamp
}
```

## 🔐 Seguridad

- Contraseñas encriptadas con BCrypt
- Tokens JWT con expiración (24 horas por defecto)
- CORS habilitado para desarrollo
- Validación de entrada con Jakarta Validation
- Control de acceso basado en roles

## 📝 Variables de entorno

Puedes crear un archivo `.env` para variables sensibles:

```properties
MONGODB_URI=mongodb://localhost:27017/tienda_online
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura
JWT_EXPIRATION_MS=86400000
SERVER_PORT=8080
```

## 🧪 Testing

```bash
mvn test
```

## 📦 Construcción para producción

```bash
mvn clean package -DskipTests
java -jar target/tienda-online-1.0.0.jar
```

## 🐛 Troubleshooting

### "Connection refused" en MongoDB
- Verificar que MongoDB está corriendo: `mongosh`
- En Windows: Verificar que el servicio MongoDB está iniciado

### Error de puerto en uso
Cambiar puerto en `application.yml`:
```yaml
server:
  port: 8081
```

### Error de validación JWT
- Verificar el formato del token en el header Authorization
- Verificar que el token no haya expirado

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🤝 Soporte

Para soporte, abrir un issue en el repositorio o contactar directamente.

---

**Desarrollado con ❤️ usando Spring Boot**
