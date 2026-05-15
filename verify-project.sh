#!/bin/bash

# Script de verificación del proyecto - Tienda Online
# Este script verifica que todos los archivos necesarios están presentes

echo "═══════════════════════════════════════════════════════════════════════"
echo "   🏪 VERIFICACIÓN DEL PROYECTO TIENDA ONLINE"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Contador de archivos
total=0
encontrados=0

# Función para verificar archivo
verificar_archivo() {
    local ruta=$1
    local descripcion=$2
    total=$((total + 1))
    
    if [ -f "$ruta" ]; then
        echo "✅ $ruta"
        echo "   📝 $descripcion"
        encontrados=$((encontrados + 1))
    else
        echo "❌ $ruta (NO ENCONTRADO)"
    fi
}

# Función para verificar directorio
verificar_directorio() {
    local ruta=$1
    local descripcion=$2
    total=$((total + 1))
    
    if [ -d "$ruta" ]; then
        echo "✅ $ruta/"
        echo "   📁 $descripcion"
        encontrados=$((encontrados + 1))
    else
        echo "❌ $ruta/ (NO ENCONTRADO)"
    fi
}

echo "📦 ARCHIVOS DE CONFIGURACIÓN"
echo "───────────────────────────────────────────────────────────────────────"
verificar_archivo "pom.xml" "Configuración Maven con todas las dependencias"
verificar_archivo "Dockerfile" "Imagen Docker para containerización"
verificar_archivo "docker-compose.yml" "Orquestación de servicios"
verificar_archivo ".gitignore" "Archivos a ignorar en Git"
echo ""

echo "📚 DOCUMENTACIÓN"
echo "───────────────────────────────────────────────────────────────────────"
verificar_archivo "README.md" "Documentación principal completa"
verificar_archivo "QUICK-START.md" "Guía de inicio rápido"
verificar_archivo "API-EXAMPLES.md" "Ejemplos de APIs REST"
verificar_archivo "ARCHITECTURE.md" "Diseño arquitectónico"
verificar_archivo "DEPLOYMENT.md" "Guías de despliegue"
verificar_archivo "ROADMAP.md" "Plan de desarrollo futuro"
verificar_archivo "CONTRIBUTING.md" "Guía para contribuciones"
verificar_archivo "PROJECT-SUMMARY.md" "Resumen del proyecto"
echo ""

echo "☕ CÓDIGO JAVA - APLICACIÓN PRINCIPAL"
echo "───────────────────────────────────────────────────────────────────────"
verificar_archivo "src/main/java/com/tienda/TiendaOnlineApplication.java" "Clase principal Spring Boot"
echo ""

echo "🔧 CONFIGURACIÓN"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/config" "Configuraciones de seguridad"
verificar_archivo "src/main/java/com/tienda/config/SecurityConfig.java" "Spring Security + JWT"
echo ""

echo "🎮 CONTROLADORES REST"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/controller" "APIs REST"
verificar_archivo "src/main/java/com/tienda/controller/AuthController.java" "Autenticación"
verificar_archivo "src/main/java/com/tienda/controller/ProductController.java" "Productos (público)"
verificar_archivo "src/main/java/com/tienda/controller/CartController.java" "Carrito"
verificar_archivo "src/main/java/com/tienda/controller/OrderController.java" "Órdenes"
verificar_archivo "src/main/java/com/tienda/controller/SellerController.java" "Panel vendedor"
verificar_archivo "src/main/java/com/tienda/controller/AdminController.java" "Panel admin"
echo ""

echo "📋 TRANSFERENCIA DE DATOS (DTOs)"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/dto" "Data Transfer Objects"
verificar_archivo "src/main/java/com/tienda/dto/LoginRequestDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/LoginResponseDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/UserRegistrationDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/ProductDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/CreateProductDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/CartDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/CartItemDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/OrderDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/OrderItemDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/CreateOrderDTO.java" ""
verificar_archivo "src/main/java/com/tienda/dto/AddToCartDTO.java" ""
echo ""

echo "🗄️  ENTIDADES (MODELOS MONGODB)"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/entity" "Modelos de datos"
verificar_archivo "src/main/java/com/tienda/entity/User.java" "Usuario con roles"
verificar_archivo "src/main/java/com/tienda/entity/Product.java" "Producto"
verificar_archivo "src/main/java/com/tienda/entity/Cart.java" "Carrito"
verificar_archivo "src/main/java/com/tienda/entity/CartItem.java" "Item en carrito"
verificar_archivo "src/main/java/com/tienda/entity/Order.java" "Orden"
verificar_archivo "src/main/java/com/tienda/entity/OrderItem.java" "Item en orden"
verificar_archivo "src/main/java/com/tienda/entity/UserRole.java" "Enum de roles"
verificar_archivo "src/main/java/com/tienda/entity/OrderStatus.java" "Enum de estado de orden"
verificar_archivo "src/main/java/com/tienda/entity/StoreStatus.java" "Enum de estado de tienda"
echo ""

echo "🔍 REPOSITORIOS (ACCESO A DATOS)"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/repository" "MongoDB Repositories"
verificar_archivo "src/main/java/com/tienda/repository/UserRepository.java" "Acceso a usuarios"
verificar_archivo "src/main/java/com/tienda/repository/ProductRepository.java" "Acceso a productos"
verificar_archivo "src/main/java/com/tienda/repository/CartRepository.java" "Acceso a carritos"
verificar_archivo "src/main/java/com/tienda/repository/OrderRepository.java" "Acceso a órdenes"
echo ""

echo "🔐 SEGURIDAD"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/security" "JWT y autenticación"
verificar_archivo "src/main/java/com/tienda/security/JwtService.java" "Manejo de JWT"
verificar_archivo "src/main/java/com/tienda/security/JwtAuthenticationFilter.java" "Filtro de autenticación"
verificar_archivo "src/main/java/com/tienda/security/CustomUserDetails.java" "Detalles personalizados"
verificar_archivo "src/main/java/com/tienda/security/CustomAuthentication.java" "Autenticación personalizada"
echo ""

echo "⚙️  SERVICIOS (LÓGICA DE NEGOCIO)"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/main/java/com/tienda/service" "Servicios"
verificar_archivo "src/main/java/com/tienda/service/AuthService.java" "Autenticación"
verificar_archivo "src/main/java/com/tienda/service/UserService.java" "Gestión de usuarios"
verificar_archivo "src/main/java/com/tienda/service/ProductService.java" "Gestión de productos"
verificar_archivo "src/main/java/com/tienda/service/CartService.java" "Lógica del carrito"
verificar_archivo "src/main/java/com/tienda/service/OrderService.java" "Procesamiento de órdenes"
verificar_archivo "src/main/java/com/tienda/service/JwtService.java" "Manejo de JWT"
echo ""

echo "🧪 TESTS"
echo "───────────────────────────────────────────────────────────────────────"
verificar_directorio "src/test/java/com/tienda" "Tests unitarios"
verificar_archivo "src/test/java/com/tienda/controller/AuthControllerTest.java" "Tests de autenticación"
verificar_archivo "src/test/java/com/tienda/service/ProductServiceTest.java" "Tests de productos"
echo ""

echo "📋 RECURSOS"
echo "───────────────────────────────────────────────────────────────────────"
verificar_archivo "src/main/resources/application.yml" "Configuración de aplicación"
echo ""

echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 RESUMEN"
echo "───────────────────────────────────────────────────────────────────────"
echo "Total archivos/directorios esperados: $total"
echo "Encontrados: $encontrados"
porcentaje=$((encontrados * 100 / total))
echo "Completado: $porcentaje%"
echo ""

if [ $encontrados -eq $total ]; then
    echo "✅ ¡PROYECTO COMPLETADO AL 100%!"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "  1. mvn clean install"
    echo "  2. docker-compose up -d"
    echo "  3. mvn spring-boot:run"
    echo ""
    echo "📖 Para más información, ver:"
    echo "  - README.md: Documentación completa"
    echo "  - QUICK-START.md: Inicio rápido"
    echo "  - API-EXAMPLES.md: Ejemplos de APIs"
else
    echo "⚠️  Faltan $((total - encontrados)) archivos/directorios"
fi

echo "═══════════════════════════════════════════════════════════════════════"
