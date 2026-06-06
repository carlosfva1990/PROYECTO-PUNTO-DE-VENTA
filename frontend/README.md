# Frontend - Tienda Online

Este es el frontend de la aplicación de e-commerce "Tienda Online", construido con JavaScript vanilla (sin frameworks) y diseñado para consumir la API REST del backend Spring Boot.

## 🚀 Características Implementadas

### ✅ Funcionalidades Completas
- **Autenticación completa**: Login, registro, logout con JWT
- **Gestión de productos**: Ver catálogo, buscar, filtrar por categoría
- **Carrito de compras**: Agregar, remover, actualizar cantidades
- **Proceso de checkout**: Formulario de envío y pago
- **Dashboard por roles**:
  - **Compradores**: Ver pedidos, historial de compras
  - **Vendedores**: Gestionar productos, ver pedidos de ventas
  - **Administradores**: Gestionar todos los pedidos
- **Responsive design**: Funciona en móvil, tablet y desktop
- **Interfaz moderna**: Diseño limpio con CSS Grid y Flexbox

### 🎨 Diseño y UX
- **Single Page Application (SPA)**: Navegación sin recargas
- **Sistema de alertas**: Notificaciones para acciones del usuario
- **Loading states**: Indicadores de carga durante operaciones
- **Modales**: Formularios de login/registro en modales
- **Dropdowns**: Menús desplegables para usuario autenticado

## 📁 Estructura de Archivos

```
frontend/
├── index.html          # Página principal (SPA)
├── test.html           # Página de pruebas para verificar JS
├── css/
│   ├── styles.css      # Estilos globales y componentes base
│   ├── navbar.css      # Estilos de navegación
│   ├── auth.css        # Estilos de formularios auth
│   ├── products.css    # Estilos de productos y catálogo
│   ├── cart.css        # Estilos de carrito y checkout
│   └── dashboard.css   # Estilos de dashboards
└── js/
    ├── config.js       # Configuración de API y constantes
    ├── utils.js        # Funciones de utilidad
    ├── api.js          # Cliente API para llamadas HTTP
    ├── auth.js         # Gestión de autenticación
    ├── cart.js         # Gestión del carrito de compras
    └── main.js         # Lógica principal y routing
```

## 🔧 Configuración

### 1. Backend API
El frontend está configurado para conectarse a `http://localhost:8080/api`. Si tu backend corre en un puerto diferente, modifica `js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api', // Cambia esta URL si es necesario
    // ... resto de configuración
};
```

### 2. Ejecutar la Aplicación

#### Opción A: Con Backend Completo (Recomendado)
1. **Inicia el backend** (Spring Boot + MongoDB)
2. **Abre `index.html`** en un navegador web
3. La aplicación funcionará completamente

### Servir el frontend localmente
Para desarrollo es conveniente servir los archivos estáticos con un servidor simple:

```bash
# Desde la carpeta frontend
cd frontend
# Opción 1: Python (rápido, sin dependencias extra)
python3 -m http.server 3000 --bind 127.0.0.1
# Opción 2: usando `serve` (npm) para rutas limpias
npm install -g serve
serve -s . -l 3000
```

Abre `http://localhost:3000` en tu navegador.

#### Opción B: Solo Frontend (Para Desarrollo)
1. **Abre `test.html`** en un navegador para verificar que los archivos JS cargan correctamente
2. **Abre `index.html`** - algunas funciones fallarán sin backend, pero la interfaz se mostrará

## 🎯 Uso de la Aplicación

### Para Usuarios No Registrados
- **Ver productos**: Navega el catálogo, busca y filtra
- **Ver detalles**: Click en cualquier producto
- **Registrarse**: Click en "Registrarse" para crear cuenta
- **Iniciar sesión**: Click en "Iniciar Sesión" para acceder

### Para Compradores
- **Todo lo anterior** más:
- **Agregar al carrito**: Botón en productos y página de detalle
- **Gestionar carrito**: Ver, modificar cantidades, remover items
- **Checkout**: Completar formulario de envío y pago
- **Ver pedidos**: En dashboard, historial de compras

### Para Vendedores
- **Todo lo de compradores** más:
- **Dashboard de vendedor**: Gestionar productos propios
- **Agregar productos**: Formulario para nuevos productos
- **Editar productos**: Modificar productos existentes
- **Ver pedidos**: Pedidos de productos vendidos

### Para Administradores
- **Ver todos los pedidos**: Gestión completa del sistema
- **Actualizar estados**: Cambiar estado de cualquier pedido

## 🔌 API Endpoints Utilizados

El frontend consume estos endpoints del backend:

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/products` - Lista todos los productos
- `GET /api/products/{id}` - Detalle de producto
- `GET /api/products/search?keyword=...` - Búsqueda
- `GET /api/products/category/{category}` - Por categoría

### Carrito
- `GET /api/cart` - Ver carrito del usuario
- `POST /api/cart/add` - Agregar producto
- `PUT /api/cart/update/{productId}` - Actualizar cantidad
- `DELETE /api/cart/remove/{productId}` - Remover producto

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders` - Pedidos del comprador

### Vendedor
- `GET /api/seller/products` - Productos del vendedor
- `POST /api/seller/products` - Crear producto
- `PUT /api/seller/products/{id}` - Actualizar producto
- `DELETE /api/seller/products/{id}` - Eliminar producto

### Admin
- `GET /api/admin/orders` - Todos los pedidos
- `PUT /api/admin/orders/{id}/status` - Cambiar estado

## 🛠️ Desarrollo y Debugging

### Verificar Carga de JavaScript
Abre `test.html` en el navegador para verificar que todos los módulos JS cargan correctamente.

### Consola del Navegador
- Abre las herramientas de desarrollo (F12)
- Revisa la pestaña "Console" para errores
- Revisa la pestaña "Network" para llamadas API

### Debugging Común
- **Error de CORS**: Asegúrate que el backend tenga `@CrossOrigin("*")`
- **Error 401**: Token expirado, refresca la página
- **Error de red**: Verifica que el backend esté corriendo

## 🎨 Personalización

### Colores
Los colores principales están definidos en `css/styles.css` en las variables CSS:

```css
:root {
    --primary-color: #007bff;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --light-color: #f8f9fa;
    --border-color: #dee2e6;
}
```

### API Base URL
Cambia la URL base en `js/config.js` si necesitas apuntar a un servidor diferente.

### Funcionalidades Adicionales
Para agregar nuevas funcionalidades:
1. Agrega métodos en `js/api.js`
2. Implementa lógica en el módulo correspondiente
3. Actualiza `js/main.js` para el routing
4. Agrega estilos en los archivos CSS correspondientes

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

Los breakpoints están definidos en cada archivo CSS con media queries.

## 🔒 Seguridad

- **JWT tokens**: Almacenados en localStorage
- **Validación automática**: Tokens verificados en cada request
- **Logout automático**: Al expirar tokens
- **Protección de rutas**: Verificación de autenticación por rol

## 🚀 Próximos Pasos

Para producción, considera:
- **HTTPS**: Implementar certificados SSL
- **Minificación**: Comprimir archivos JS/CSS
- **CDN**: Servir estáticos desde CDN
- **PWA**: Convertir en Progressive Web App
- **Testing**: Agregar tests unitarios
- **Error handling**: Mejorar manejo de errores
- **Performance**: Lazy loading de imágenes

---

¡El frontend está listo para usar! Conecta el backend y tendrás una tienda online completamente funcional. 🎉