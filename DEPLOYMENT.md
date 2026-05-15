# 🚀 Guía de Despliegue - Tienda Online

## Despliegue en diferentes plataformas

---

## 1. Heroku

### Requisitos
- Cuenta en Heroku
- Heroku CLI instalada

### Pasos

1. **Login en Heroku**
```bash
heroku login
```

2. **Crear aplicación**
```bash
heroku create tu-tienda-online
```

3. **Agregar MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox
```

4. **Configurar variables de entorno**
```bash
heroku config:set JWT_SECRET="tu-clave-secreta-muy-larga"
heroku config:set SERVER_PORT=8080
```

5. **Desplegar**
```bash
git push heroku main
```

6. **Verificar logs**
```bash
heroku logs --tail
```

---

## 2. AWS (EC2 + RDS/DocumentDB)

### Requisitos
- Cuenta AWS
- EC2 instance con Ubuntu 20.04+
- DocumentDB instance

### Instalación en EC2

1. **Conectar a la instancia**
```bash
ssh -i tu-key.pem ec2-user@tu-instancia
```

2. **Instalar Java**
```bash
sudo yum update -y
sudo yum install java-17-amazon-corretto -y
```

3. **Instalar Maven**
```bash
sudo yum install maven -y
```

4. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd poyecto-Punto-De-Venta
```

5. **Configurar conexión a DocumentDB**
```bash
export MONGODB_URI="mongodb://usuario:contraseña@tu-documentdb-endpoint:27017/tienda_online?ssl=true&retryWrites=false"
export JWT_SECRET="tu-clave-secreta"
```

6. **Compilar**
```bash
mvn clean package -DskipTests
```

7. **Ejecutar en background**
```bash
nohup java -jar target/tienda-online-1.0.0.jar > app.log 2>&1 &
```

---

## 3. Azure App Service

### Requisitos
- Cuenta Azure
- Azure CLI instalada

### Pasos

1. **Login en Azure**
```bash
az login
```

2. **Crear grupo de recursos**
```bash
az group create --name tienda-rg --location eastus
```

3. **Crear App Service Plan**
```bash
az appservice plan create --name tienda-plan --resource-group tienda-rg --sku B1 --is-linux
```

4. **Crear aplicación**
```bash
az webapp create --name tu-tienda-online --resource-group tienda-rg --plan tienda-plan --runtime "JAVA|17-java17"
```

5. **Desplegar JAR**
```bash
mvn clean package -DskipTests
az webapp deployment source config-zip --resource-group tienda-rg --name tu-tienda-online --src target/tienda-online-1.0.0.jar
```

---

## 4. DigitalOcean (App Platform)

### Requisitos
- Cuenta DigitalOcean
- Repositorio en GitHub

### Pasos

1. **Conectar repositorio GitHub**
   - Ir a DigitalOcean App Platform
   - Seleccionar "Create App"
   - Conectar tu repositorio GitHub

2. **Configurar la aplicación**
   - Seleccionar "Java" como tipo
   - Configurar comando de build: `mvn clean package -DskipTests`
   - Configurar comando de run: `java -jar target/tienda-online-1.0.0.jar`

3. **Agregar base de datos MongoDB**
   - Crear MongoDB cluster en DigitalOcean
   - Configurar variable de entorno: `MONGODB_URI`

4. **Desplegar**
   - Click en "Deploy"

---

## 5. Google Cloud Run

### Requisitos
- Cuenta Google Cloud
- Google Cloud CLI instalada
- Docker instalado

### Pasos

1. **Crear Dockerfile**

Ya incluido en el proyecto. Si no existe, crear:
```dockerfile
FROM openjdk:17-slim
COPY target/tienda-online-*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

2. **Construir imagen**
```bash
mvn clean package -DskipTests
gcloud builds submit --tag gcr.io/tu-proyecto/tienda-online
```

3. **Desplegar en Cloud Run**
```bash
gcloud run deploy tienda-online \
  --image gcr.io/tu-proyecto/tienda-online \
  --memory 512Mi \
  --timeout 3600 \
  --set-env-vars MONGODB_URI="tu-mongodb-connection-string",JWT_SECRET="tu-clave"
```

---

## 6. Docker + Kubernetes

### Dockerfile

```dockerfile
FROM openjdk:17-slim

WORKDIR /app

COPY target/tienda-online-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build y push

```bash
# Build
docker build -t tu-usuario/tienda-online:1.0.0 .

# Login en Docker Hub
docker login

# Push
docker push tu-usuario/tienda-online:1.0.0
```

### Kubernetes Deployment (deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tienda-online
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tienda-online
  template:
    metadata:
      labels:
        app: tienda-online
    spec:
      containers:
      - name: tienda-online
        image: tu-usuario/tienda-online:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: tienda-online-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: tienda-online
```

### Desplegar

```bash
# Crear secretos
kubectl create secret generic db-secret --from-literal=mongodb-uri="tu-mongodb-uri"
kubectl create secret generic app-secret --from-literal=jwt-secret="tu-jwt-secret"

# Desplegar
kubectl apply -f deployment.yaml

# Verificar
kubectl get pods
kubectl get services
```

---

## 7. Variables de entorno por plataforma

### Desarrollo
```
MONGODB_URI=mongodb://localhost:27017/tienda_online
JWT_SECRET=dev-secret-key
SERVER_PORT=8080
```

### Producción
```
MONGODB_URI=<tu-mongodb-atlas-connection-string>
JWT_SECRET=<clave-secreta-larga-y-segura>
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

---

## 8. Monitoreo y logs

### Ver logs en tiempo real
```bash
# Local
tail -f nohup.out

# Docker
docker logs -f container-id

# Kubernetes
kubectl logs -f pod-name

# Cloud
gcloud logging read "resource.labels.service_name=tienda-online"
```

### Alertas recomendadas

1. CPU > 80%
2. Memoria > 90%
3. Error rate > 5%
4. Response time > 5s
5. Disponibilidad < 99.9%

---

## 9. Backup y recuperación

### MongoDB Atlas
- Backups automáticos cada 6 horas
- Retención de 35 días
- Punto de restauración a cualquier momento

### Crear backup manual
```bash
mongodump --uri="mongodb://usuario:contraseña@host:27017/tienda_online"
```

### Restaurar backup
```bash
mongorestore --uri="mongodb://usuario:contraseña@host:27017/" dump/
```

---

## 10. Checklist de despliegue

- [ ] Cambiar JWT_SECRET a valor seguro
- [ ] Configurar MONGODB_URI correcto
- [ ] Cambiar a perfil de producción (spring.profiles.active=prod)
- [ ] Habilitar HTTPS/SSL
- [ ] Configurar CORS para dominios específicos
- [ ] Configurar alertas y monitoreo
- [ ] Hacer backup de base de datos
- [ ] Configurar CI/CD pipeline
- [ ] Documentar credenciales en lugar seguro
- [ ] Realizar pruebas de carga

---

Para más información sobre cada plataforma, consulta su documentación oficial.
