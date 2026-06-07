# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 as builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-slim

WORKDIR /app

# Copiar el JAR compilado del stage anterior
COPY --from=builder /app/target/tienda-online-*.jar app.jar

# Crear usuario no-root por seguridad
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD java -jar app.jar --health || exit 1

# Ejecutar aplicación
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
