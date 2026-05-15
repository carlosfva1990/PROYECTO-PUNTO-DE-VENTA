# Ejemplos de uso de la API - Tienda Online

## 1. AUTENTICACIÓN

### Registrar nuevo comprador
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "+34612345678",
    "address": "Calle Principal 123",
    "city": "Madrid",
    "country": "España",
    "zipCode": "28001",
    "role": "BUYER"
  }'
```

### Registrar nuevo vendedor
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tienda@example.com",
    "password": "password123",
    "firstName": "Carlos",
    "lastName": "García",
    "phone": "+34687654321",
    "address": "Avenida Comercio 456",
    "city": "Barcelona",
    "country": "España",
    "zipCode": "08002",
    "role": "SELLER",
    "storeName": "Mi Tienda Online",
    "storeDescription": "Tienda de productos electrónicos de calidad"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "BUYER"
}
```

---

## 2. PRODUCTOS

### Listar todos los productos (PÚBLICO)
```bash
curl -X GET http://localhost:8080/api/products
```

### Ver detalle de un producto
```bash
curl -X GET http://localhost:8080/api/products/507f1f77bcf86cd799439012
```

### Buscar productos
```bash
curl -X GET "http://localhost:8080/api/products/search?keyword=laptop"
```

### Productos por categoría
```bash
curl -X GET http://localhost:8080/api/products/category/Electrónica
```

---

## 3. VENDEDOR - GESTIÓN DE PRODUCTOS

### Crear producto (SELLER)
```bash
curl -X POST http://localhost:8080/api/seller/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "description": "Laptop ultradelgada de 13 pulgadas con procesador Intel i7",
    "price": 999.99,
    "stock": 50,
    "category": "Electrónica",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'
```

### Ver mis productos
```bash
curl -X GET http://localhost:8080/api/seller/products \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Actualizar producto
```bash
curl -X PUT http://localhost:8080/api/seller/products/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "name": "Laptop Dell XPS 13 - Actualizado",
    "description": "Nueva descripción",
    "price": 1099.99,
    "stock": 45,
    "category": "Electrónica",
    "images": ["https://example.com/image1.jpg"]
  }'
```

### Eliminar producto
```bash
curl -X DELETE http://localhost:8080/api/seller/products/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Ver órdenes de mis productos
```bash
curl -X GET http://localhost:8080/api/seller/orders \
  -H "Authorization: Bearer <tu-token-jwt>"
```

---

## 4. COMPRADOR - CARRITO

### Ver carrito
```bash
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "productId": "507f1f77bcf86cd799439012",
    "quantity": 2
  }'
```

### Actualizar cantidad en carrito
```bash
curl -X PUT "http://localhost:8080/api/cart/update/507f1f77bcf86cd799439012?quantity=5" \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Remover producto del carrito
```bash
curl -X DELETE http://localhost:8080/api/cart/remove/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Vaciar carrito
```bash
curl -X DELETE http://localhost:8080/api/cart/clear \
  -H "Authorization: Bearer <tu-token-jwt>"
```

---

## 5. COMPRADOR - ÓRDENES

### Crear orden (comprar)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "shippingAddress": "Calle Principal 123, Apartamento 4B",
    "shippingCity": "Madrid",
    "shippingCountry": "España",
    "shippingZipCode": "28001",
    "notes": "Entregar después de las 18:00"
  }'
```

### Ver mis órdenes
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### Ver detalle de una orden
```bash
curl -X GET http://localhost:8080/api/orders/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer <tu-token-jwt>"
```

---

## 6. ADMIN - MONITOREO

### Ver todas las órdenes
```bash
curl -X GET http://localhost:8080/api/admin/orders \
  -H "Authorization: Bearer <tu-token-admin>"
```

### Ver órdenes por estado
```bash
curl -X GET http://localhost:8080/api/admin/orders/status/PENDING \
  -H "Authorization: Bearer <tu-token-admin>"
```

**Estados disponibles:** PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, RETURNED

### Ver detalle de orden
```bash
curl -X GET http://localhost:8080/api/admin/orders/507f1f77bcf86cd799439015 \
  -H "Authorization: Bearer <tu-token-admin>"
```

### Actualizar estado de orden
```bash
curl -X PUT "http://localhost:8080/api/admin/orders/507f1f77bcf86cd799439015/status?status=SHIPPED" \
  -H "Authorization: Bearer <tu-token-admin>"
```

---

## 7. FLUJO COMPLETO DE COMPRA

1. **Registrarse como comprador**
   ```bash
   # POST /api/auth/register (role: BUYER)
   ```

2. **Ver productos disponibles**
   ```bash
   # GET /api/products
   ```

3. **Agregar productos al carrito**
   ```bash
   # POST /api/cart/add (requiere token)
   ```

4. **Ver carrito**
   ```bash
   # GET /api/cart (requiere token)
   ```

5. **Crear orden**
   ```bash
   # POST /api/orders (requiere token)
   ```

6. **Ver estado de la orden**
   ```bash
   # GET /api/orders/{orderId} (requiere token)
   ```

---

## Notas importantes

- Todos los tokens JWT deben estar precedidos por "Bearer " en el header Authorization
- Los tokens expiran después de 24 horas (configurable en application.yml)
- El servidor escucha en http://localhost:8080
- Las rutas públicas son /api/auth y /api/products
- Las demás rutas requieren autenticación y roles específicos
