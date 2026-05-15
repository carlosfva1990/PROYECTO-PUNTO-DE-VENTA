# 🚀 Guía Rápida de Inicio - Tienda Online

## Opción 1: Con Docker (Recomendado)

### Requisitos
- Docker Desktop instalado
- Git

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd poyecto-Punto-De-Venta
```

2. **Iniciar MongoDB con Docker Compose**
```bash
docker-compose up -d
```

MongoDB estará disponible en: `mongodb://localhost:27017`
Mongo Express (UI) estará disponible en: `http://localhost:8081`

3. **Compilar y ejecutar la aplicación**
```bash
mvn clean install
mvn spring-boot:run
```

4. **Verificar que está funcionando**
```bash
curl http://localhost:8080/api/products
```

5. **Detener los contenedores**
```bash
docker-compose down
```

---

## Opción 2: Instalación Manual

### Requisitos
- Java 17+
- Maven 3.8+
- MongoDB 4.4+

### Pasos

1. **Instalar MongoDB**

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Descargar desde https://www.mongodb.com/try/download/community e instalar

2. **Clonar y compilar**
```bash
git clone <url-repositorio>
cd poyecto-Punto-De-Venta
mvn clean install
```

3. **Ejecutar la aplicación**
```bash
mvn spring-boot:run
```

---

## ✅ Verificación

La aplicación estará lista cuando veas:
```
... : Tienda Online started in X.XXX seconds (process running for X.XXX)
```

Acceso:
- API REST: `http://localhost:8080/api`
- MongoDB: `mongodb://localhost:27017/tienda_online`

---

## 🧪 Prueba rápida

### 1. Registrar un comprador
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+34123456789",
    "address": "Calle Test 1",
    "city": "Madrid",
    "country": "España",
    "zipCode": "28001",
    "role": "BUYER"
  }'
```

Guarda el `token` de la respuesta.

### 2. Ver productos
```bash
curl http://localhost:8080/api/products
```

### 3. Agregar al carrito
```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "productId": "<productId>",
    "quantity": 1
  }'
```

---

## 🐛 Solución de problemas

| Problema | Solución |
|----------|----------|
| `Connection refused` en MongoDB | Verificar que MongoDB está corriendo: `mongo` o `mongosh` |
| Puerto 8080 en uso | Cambiar puerto en `application.yml`: `server.port: 8081` |
| Error `Cannot resolve artifact` | Ejecutar: `mvn clean install` con conexión a internet |
| Token expirado | Hacer login nuevamente para obtener nuevo token |

---

## 📚 Documentación completa

Ver `README.md` para documentación completa de la API y arquitectura.

---

## 🎯 Próximos pasos

1. ✅ Instalar MongoDB
2. ✅ Ejecutar la aplicación
3. ✅ Registrar usuarios (Buyer, Seller, Admin)
4. ✅ Crear productos desde vendedor
5. ✅ Probar compras
6. ✅ Monitorear órdenes como admin

¡Bienvenido a Tienda Online! 🎉
