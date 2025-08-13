# ERP Multi-Cliente - Sistema de Gestión Empresarial

Un sistema ERP completo y listo para producción que permite gestionar inventarios, ventas online, POS local y múltiples clientes con configuraciones personalizables.

## 🚀 Características Principales

### ✅ Funcionalidades Core
- **Dashboard Multi-Tenant**: Panel de administración con métricas en tiempo real
- **Inventario Unificado**: Control de stock sincronizado entre todos los canales
- **Tienda Online**: E-commerce completo con carrito de compras
- **POS Local**: Sistema de punto de venta para tiendas físicas
- **Gestión de Clientes**: Administración multi-tenant con configuraciones personalizables
- **Reportes Avanzados**: Análisis de ventas con exportación de datos
- **Autenticación Segura**: Sistema de usuarios con roles y permisos

### 🔒 Seguridad de Producción
- Autenticación JWT con refresh tokens
- Rate limiting en endpoints críticos
- Validación de entrada con Zod
- Headers de seguridad (CSRF, XSS, etc.)
- Encriptación de contraseñas con bcrypt
- Sanitización de datos de entrada

### ⚡ Rendimiento
- Caché inteligente con Redis
- Optimización de imágenes automática
- Lazy loading de componentes
- Compresión gzip
- CDN ready para assets estáticos

### 🛠️ Infraestructura
- Dockerizado para fácil despliegue
- Base de datos PostgreSQL con Supabase
- Nginx como reverse proxy
- SSL/TLS configurado
- Health checks y monitoring

## 📋 Requisitos del Sistema

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recomendado)

## 🚀 Instalación Rápida

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd erp-system

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Levantar todos los servicios
docker-compose up -d

# La aplicación estará disponible en http://localhost
```

### Opción 2: Instalación Manual

```bash
# Instalar dependencias
npm install

# Configurar base de datos (Supabase)
# 1. Crear proyecto en Supabase
# 2. Configurar .env con las credenciales
# 3. Ejecutar migraciones (ver sección Database)

# Construir para producción
npm run build:prod

# Iniciar servidor
npm start
```

## 🗄️ Configuración de Base de Datos

### Usando Supabase (Recomendado)

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Obtener URL y API keys del dashboard
4. Configurar variables en `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. Ejecutar las migraciones SQL desde el editor de Supabase

### Schema de Base de Datos

```sql
-- Tenants (Clientes)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('basic', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'employee')),
  tenant_id UUID REFERENCES tenants(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  category TEXT,
  sku TEXT NOT NULL,
  image TEXT,
  tenant_id UUID REFERENCES tenants(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ventas
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  products JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  type TEXT CHECK (type IN ('online', 'pos')),
  customer TEXT,
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 Configuración

### Variables de Entorno

```env
# Base de Datos
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Seguridad
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=production

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🚀 Despliegue en Producción

### 1. Preparación

```bash
# Construir la aplicación
npm run build:prod

# Verificar que todos los archivos estén listos
ls -la dist/
```

### 2. Usando Docker

```bash
# Construir imagen
docker build -t erp-system .

# Ejecutar contenedor
docker run -d \
  --name erp-production \
  -p 3000:3000 \
  --env-file .env \
  erp-system
```

### 3. Con Docker Compose

```bash
# Producción completa con base de datos
docker-compose -f docker-compose.yml up -d
```

### 4. Configurar SSL

```bash
# Generar certificados SSL (ejemplo con Let's Encrypt)
certbot certonly --webroot -w /var/www/html -d your-domain.com

# Copiar certificados a la carpeta ssl/
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
```

## 📊 Monitoreo y Mantenimiento

### Health Checks

```bash
# Verificar estado de la aplicación
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Logs

```bash
# Ver logs de la aplicación
docker-compose logs -f erp-app

# Ver logs de base de datos
docker-compose logs -f postgres
```

### Backups

```bash
# Backup automático de base de datos
docker exec postgres pg_dump -U erp_user erp_database > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i postgres psql -U erp_user erp_database < backup_20240115.sql
```

## 🔐 Seguridad

### Checklist de Seguridad

- ✅ HTTPS configurado con certificados válidos
- ✅ Rate limiting en endpoints críticos
- ✅ Validación de entrada en todos los formularios
- ✅ Headers de seguridad configurados
- ✅ Contraseñas encriptadas con bcrypt
- ✅ JWT con expiración y refresh tokens
- ✅ CORS configurado correctamente
- ✅ SQL injection prevention
- ✅ XSS protection

### Configuración de Firewall

```bash
# Permitir solo puertos necesarios
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

## 📈 Escalabilidad

### Load Balancing

Para manejar más tráfico, puedes configurar múltiples instancias:

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  erp-app:
    deploy:
      replicas: 3
  
  nginx:
    # Configurar upstream con múltiples servidores
```

### Base de Datos

```sql
-- Índices para optimizar consultas
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_sales_tenant_id ON sales(tenant_id);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_products_sku ON products(sku);
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests de integración
npm run test:integration
```

## 📚 API Documentation

### Endpoints Principales

```
GET    /api/health              # Health check
POST   /api/auth/login          # Autenticación
GET    /api/products            # Listar productos
POST   /api/products            # Crear producto
PUT    /api/products/:id        # Actualizar producto
DELETE /api/products/:id        # Eliminar producto
GET    /api/sales               # Listar ventas
POST   /api/sales               # Crear venta
GET    /api/reports             # Generar reportes
```

## 🤝 Soporte

Para soporte técnico o consultas:

1. Revisar la documentación
2. Verificar los logs de la aplicación
3. Consultar issues conocidos
4. Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Tu ERP está listo para producción! 🚀**

El sistema incluye todas las características necesarias para un entorno empresarial real, con seguridad, escalabilidad y mantenibilidad como prioridades principales.