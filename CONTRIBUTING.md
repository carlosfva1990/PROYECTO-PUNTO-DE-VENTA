# 🤝 Guía de Contribución - Tienda Online

Gracias por tu interés en contribuir a Tienda Online. Este documento proporciona las pautas y procedimientos para contribuir al proyecto.

## Código de Conducta

Este proyecto adhiere a un código de conducta que esperamos que todos los participantes respeten:

- Sé respetuoso con los demás
- Crítica constructiva
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía con otros miembros

## 🚀 Cómo Empezar

### 1. Fork el Proyecto
```bash
# Haz fork del repositorio en GitHub
# Clona tu fork localmente
git clone https://github.com/tu-usuario/poyecto-Punto-De-Venta.git
cd poyecto-Punto-De-Venta
```

### 2. Crea una Rama
```bash
# Siempre crea una rama para tu cambio
git checkout -b feature/mi-nueva-feature
# o para bug fixes
git checkout -b bugfix/nombre-del-bug
```

### 3. Configurar el Entorno
```bash
# Instalar dependencias
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

### 4. Realizar Cambios
- Sigue las pautas de código del proyecto
- Escribe commits claros y descriptivos
- Incluye tests para nuevas funcionalidades

### 5. Hacer Commit
```bash
git add .
git commit -m "feat: descripción breve del cambio"
git push origin feature/mi-nueva-feature
```

### 6. Pull Request
- Abre un PR desde tu rama hacia `main`
- Descripción clara de los cambios
- Referencia a issues relacionados
- Incluir screenshots si es relevante

---

## 📋 Tipos de Contribuciones

### Reportar Bugs
Si encuentras un bug, por favor:

1. **Verifica** que no haya sido reportado
2. **Incluye**:
   - Descripción clara del bug
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Versión del proyecto
   - Sistema operativo y versión de Java
   - Logs si es posible

**Template**:
```markdown
### Descripción
[Descripción clara del bug]

### Pasos para reproducir
1. ...
2. ...
3. ...

### Comportamiento esperado
[Qué debería pasar]

### Comportamiento actual
[Qué está pasando]

### Información de entorno
- Versión del proyecto: 1.0.0
- Java: 17
- MongoDB: 7.0
- Sistema operativo: Windows 10
```

### Sugerir Mejoras
Para sugerir mejoras:

1. Usa el template de issue "Feature Request"
2. Describe claramente el caso de uso
3. Explica por qué es importante
4. Proporciona ejemplos si es posible

**Template**:
```markdown
### Descripción de la mejora
[Descripción clara]

### Caso de uso
[Cómo se usaría]

### Beneficios
[Por qué es importante]

### Posible implementación
[Cómo podrías imaginarlo implementado]
```

### Mejorar Documentación
- Correcciones de errores tipográficos
- Mejoras de claridad
- Ejemplos adicionales
- Traducciones

---

## 🎯 Guías de Estilo de Código

### Convenciones Java
```java
// ✅ Correcto
public class UserController {
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(
            @Valid @RequestBody UserRegistrationDTO registrationDTO) {
        // ...
    }
}

// ❌ Incorrecto
public class User_Controller{
    private UserService us;
    public void register(UserRegistrationDTO reg){
        // ...
    }
}
```

### Nombres
- **Clases**: PascalCase (`UserService`, `ProductController`)
- **Métodos**: camelCase (`createProduct`, `getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Variables**: camelCase (`userId`, `orderTotal`)

### Estructura de métodos
```java
public ProductDTO createProduct(String sellerId, CreateProductDTO dto) {
    // 1. Validaciones
    User seller = userRepository.findById(sellerId)
            .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
    
    // 2. Lógica de negocio
    Product product = Product.builder()
            .name(dto.getName())
            // ...
            .build();
    
    // 3. Persistencia
    Product saved = productRepository.save(product);
    
    // 4. Conversión a DTO
    return convertToDTO(saved);
}
```

### Documentación de código
```java
/**
 * Crea un nuevo producto para el vendedor.
 *
 * @param sellerId ID del vendedor
 * @param createProductDTO Datos del producto a crear
 * @return ProductDTO con los datos del producto creado
 * @throws RuntimeException si el vendedor no existe
 */
public ProductDTO createProduct(String sellerId, CreateProductDTO createProductDTO) {
    // ...
}
```

### Uso de Lombok
```java
// ✅ Usar @Data, @Builder, etc
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    // ...
}

// ❌ No escribir getters/setters manualmente
```

---

## 🧪 Pruebas

### Requerimientos de tests

- **Nuevas funcionalidades** deben tener tests
- **Bug fixes** deben incluir test que falle antes y pase después
- Mínimo 80% de cobertura de código

### Estructura de tests

```java
@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    @BeforeEach
    public void setUp() {
        // Setup común para todos los tests
    }
    
    @Test
    public void testCreateProductSuccess() {
        // Arrange
        // Given
        
        // Act
        // When
        
        // Assert
        // Then
        
        // Verify
    }
    
    @Test
    public void testCreateProductThrowsException() {
        // Test de caso negativo
    }
}
```

### Ejecutar tests

```bash
# Todos los tests
mvn test

# Un test específico
mvn test -Dtest=ProductServiceTest

# Con cobertura
mvn test jacoco:report
# Reporte en: target/site/jacoco/index.html
```

---

## 📝 Commits

### Mensaje de commit

Sigue la convención de [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción breve>

<descripción detallada>

<referencia a issue>
```

### Tipos de commits
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afecta funcionalidad)
- `refactor`: Refactorización de código
- `perf`: Mejora de rendimiento
- `test`: Agregar o actualizar tests
- `chore`: Cambios en dependencias, configuración, etc

### Ejemplos

```bash
# ✅ Correcto
git commit -m "feat(cart): agregar función para limpiar carrito"
git commit -m "fix(auth): corregir validación de token JWT expirado"
git commit -m "docs: actualizar instrucciones de instalación"
git commit -m "refactor(order): simplificar cálculo de totales"

# ❌ Incorrecto
git commit -m "cambios varios"
git commit -m "fix bug"
git commit -m "wip"
```

---

## 🔄 Proceso de PR

### Antes de hacer PR

1. **Sync con main**
```bash
git fetch origin
git rebase origin/main
```

2. **Ejecutar tests**
```bash
mvn clean test
```

3. **Verificar código**
```bash
# Lint (si aplica)
mvn checkstyle:check

# Análisis estático
mvn sonar:sonar
```

### Descripción del PR

```markdown
## Descripción
Breve resumen de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Mejora de documentación

## Cambios
- Listado de cambios específicos
- Detalles importantes
- Información técnica si aplica

## Testing
- [ ] Agregué tests
- [ ] Todos los tests pasan
- [ ] Cobertura >= 80%

## Checklist
- [ ] Código sigue guías de estilo
- [ ] Documentación actualizada
- [ ] No hay warnings
- [ ] Commits son claros

## Screenshots (si aplica)
[Imágenes de cambios visuales]

## Issues relacionados
Closes #123
```

### Proceso de revisión

Después de hacer PR:

1. **Code Review**: Otros desarrolladores revisan
2. **Cambios solicitados**: Si es necesario
3. **Aprobación**: Mínimo 2 approvals
4. **Merge**: Squash and merge o rebase

---

## 🔧 Desarrollo Local

### Estructura del workspace

```
poyecto-Punto-De-Venta/
├── src/
│   ├── main/
│   │   ├── java/com/tienda/
│   │   └── resources/
│   └── test/
├── target/
├── .git/
├── pom.xml
└── README.md
```

### Problema común: conflictos

```bash
# Si hay conflicto al hacer pull
git status
# Ver conflictos en archivos

# Resolver manualmente
# Luego:
git add .
git rebase --continue
```

---

## 📚 Recursos útiles

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Workflow](https://git-scm.com/book/en/v2)

---

## 🎓 Aprendizaje

### Para mejores contribuciones, estudia:

1. **Spring Boot**: Modelos, servicios, repositorios
2. **MongoDB**: Esquemas, indexación, agregaciones
3. **Seguridad**: JWT, roles, autenticación
4. **Testing**: Unit tests, mocking, assertions

### Documentación interna:

- [ARCHITECTURE.md](ARCHITECTURE.md) - Diseño y arquitectura
- [ROADMAP.md](ROADMAP.md) - Mejoras futuras
- [API-EXAMPLES.md](API-EXAMPLES.md) - Ejemplos de API

---

## ⭐ Reconocimiento

### Top Contributors

Reconocemos a todos los que contribuyen:

```
Contribuidores destacados:
- [Tu nombre aquí!]
```

### Cómo ser reconocido

1. Hacer contribuciones significativas
2. Ser consistente
3. Ayudar a otros
4. Reportar bugs de forma útil
5. Mejorar documentación

---

## 📞 Ayuda y Soporte

- **Preguntas**: Abre un issue o discussion
- **Chat**: Discussiones en GitHub
- **Email**: contacto@tiendaonline.com

---

## 📄 Licencia

Al contribuir, aceptas que tus cambios se publiquen bajo la misma licencia del proyecto (MIT).

---

## Gracias por contribuir! 🙌

Tu participación hace a Tienda Online mejor para todos.
