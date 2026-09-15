# TesloShop - NestJS Backend 🛍️

Proyecto Backend profesional para tienda virtual e-commerce construido con **NestJS**, **TypeORM**, **PostgreSQL**, **WebSockets (Socket.IO)**, **Passport + JWT**, **Multer** y **Swagger**.

Incluye autenticación y autorización por roles, gestión relacional de productos e imágenes en cascada, carga/servidor de archivos multimedia, comunicación en tiempo real vía WebSockets con tokens JWT, transacciones en base de datos, paginación, búsqueda flexible, documentación interactiva OpenAPI/Swagger y un sistema de siembra masiva de datos (**SEED**).

---

## 🛠️ Tecnologías y Herramientas

- **Framework**: [NestJS 11](https://nestjs.com/)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL 17 (vía Docker)
- **ORM**: TypeORM
- **Autenticación y Seguridad**: Passport, JWT (`@nestjs/jwt`), Bcrypt
- **Carga de Archivos**: Multer (`@nestjs/platform-express`)
- **WebSockets / Real-Time**: Socket.IO (`@nestjs/websockets`, `@nestjs/platform-socket.io`)
- **Documentación API**: Swagger / OpenAPI (`@nestjs/swagger`)
- **Validación y Transformación**: `class-validator`, `class-transformer`
- **Contenedorización**: Docker & Docker Compose

---

## 📌 Novedades y Funcionalidades Desarrolladas

### 1. 🔑 Autenticación y Autorización (`AuthModule`)
- **Entidad `User`**: Campos `id` (UUID), `email` (único, normalizado a minúsculas), `password` (hash encriptado con Bcrypt, excluido por defecto en consultas `select: false`), `fullName`, `isActive` (boolean), y `roles` (`text[]`).
- **Relación `User` - `Product`**: Asociación `@OneToMany` / `@ManyToOne` entre el usuario que crea/modifica el producto y la entidad `Product`.
- **Estrategia JWT**: Implementación de `JwtStrategy` para la validación y firma de tokens JWT (`JwtPayload`).
- **Decoradores Personalizados**:
  - `@GetUser()`: Decorador de parámetro para extraer el objeto usuario (o una propiedad específica como el email) desde la petición.
  - `@RawHeaders()`: Extrae los headers de la petición HTTP.
  - `@RoleProtected(...)`: Establece la metadata de roles autorizados para un endpoint (`ValidRoles`: `admin`, `super-user`, `user`).
  - `@Auth(...)`: Decorador compuesto que agrupa `@UseGuards(AuthGuard(), UserRoleGuard)` y `@RoleProtected(...)`.
- **Guards de Roles**: `UserRoleGuard` para validar si el usuario autenticado posee los roles requeridos para el recurso.
- **Endpoints Auth**:
  - `POST /api/auth/register`: Registro de nuevos usuarios con hash de contraseña.
  - `POST /api/auth/login`: Autenticación de credenciales y generación de JWT.
  - `GET /api/auth/check-status`: Revalidación y renovación del JWT para el usuario autenticado (`@Auth()`).
  - Endpoints de prueba y verificación de guards/decoradores (`/api/auth/private`, `private2`, `private3`).

---

### 2. 📦 Módulo de Productos (`ProductsModule`)
- **Entidades Relacionales**:
  - **`Product`**: Campos `id` (UUID v4), `title`, `price`, `description`, `slug`, `stock`, `sizes`, `gender`, `tags`, relación `@OneToMany` con `ProductImage` (eager/cascade) y relación `@ManyToOne` con `User`.
  - **`ProductImage`**: Relación `@ManyToOne` con `Product` y eliminación en cascada (`onDelete: 'CASCADE'`).
- **Hooks de Entidad**: Normalización y autogeneración automática de `slug` mediante `@BeforeInsert` y `@BeforeUpdate`.
- **Protección de Endpoints**:
  - `POST /api/products`: Creación de productos restringida a usuarios autenticados (`@Auth()`), vinculando automáticamente el producto al usuario.
  - `PATCH /api/products/:id`: Actualización de producto restringida a usuarios con rol `admin` (`@Auth(ValidRoles.admin)`). Manejo transaccional de imágenes mediante `QueryRunner` (commit/rollback).
  - `DELETE /api/products/:id`: Eliminación física restringida a rol `admin` (`@Auth(ValidRoles.admin)`).
  - `GET /api/products`: Listado público con paginación (`limit`, `offset`) y respuesta con URLs de imágenes aplanadas.
  - `GET /api/products/:term`: Búsqueda pública por `UUID`, `slug` o coincidencia en `title` vía `QueryBuilder`.

---

### 3. 📁 Carga y Manejo de Archivos (`FilesModule`)
- **`POST /api/files/product`**: Carga de imágenes de productos mediante `FileInterceptor` de Multer.
  - Helper `fileFilter`: Permite exclusivamente archivos de imagen (`jpg`, `jpeg`, `png`, `gif`).
  - Helper `fileNamer`: Genera nombres únicos de archivo usando UUID para evitar colisiones.
  - Almacenamiento en disco (`./static/products`).
  - Retorna la propiedad `secureUrl` dinámica construida con la variable de entorno `HOST_API`.
- **`GET /api/files/product/:imageName`**: Serve directo de imágenes alojadas en servidor mediante `res.sendFile()`.

---

### 4. ⚡ WebSockets en Tiempo Real (`MessagesWsModule`)
- **Gateway de Socket.IO** (`MessagesWsGateway`): Puerto / namespace WebSocket configurado con soporte de CORS (`@WebSocketGateway({ cors: true })`).
- **Autenticación en Handshake**: Validación de tokens JWT enviados en el header `authentication` durante el establecimiento de la conexión WebSocket.
- **Control de Sesiones Únicas**: Desconexión automática de sockets previos si el mismo usuario inicia sesión desde otro dispositivo/pestaña.
- **Eventos**:
  - `clients-updated`: Emite a todos los clientes la lista de IDs de clientes conectados en tiempo real tras una conexión/desconexión.
  - `message-from-client`: Escucha mensajes enviados por los clientes (`NewMessageDto`).
  - `message-from-server`: Broadcast a todos los clientes conectados notificando el mensaje y el nombre del usuario emisor (`getUserFullName`).

---

### 5. 📄 Documentación con Swagger / OpenAPI
- Configuración de `@nestjs/swagger` (`DocumentBuilder`) accesible en `http://localhost:3000/api`.
- Anotación de DTOs y Entidades con `@ApiProperty`.
- Anotación de Controladores y Endpoints con `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiBody`, `@ApiConsumes` y `@ApiBearerAuth`.

---

### 6. 🌱 Módulo de Semilla (`SeedModule`)
- **`GET /api/seed`**: Endpoint para restablecimiento de base de datos de desarrollo.
- Elimina todos los productos e imágenes asociadas, limpia la tabla de usuarios, inserta usuarios de prueba (`admin` y `user` con contraseñas encriptadas con Bcrypt) y vuelve a poblar el catálogo de productos asociándolos al usuario Administrador creado.

---

## 🚀 Requisitos Previos

* [Node.js](https://nodejs.org/) (v18+ recomendado)
* [npm](https://www.npmjs.com/)
* [Docker Desktop](https://www.docker.com/) o Docker Engine activo

---

## 🛠️ Pasos para Levantar el Proyecto

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd teslo-shop
npm install
```

### 2. Configurar Variables de Entorno

Crea tu archivo `.env` basándote en `.env.template`:

```bash
cp .env.template .env
```

Configura las variables requeridas en tu `.env`:

```env
DB_PASSWORD=MySecr3tPassw0rd
DB_NAME=TesloDB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
PORT=3000
HOST_API=http://localhost:3000/api
JWT_SECRET=Est3EsMiS3cr3tOK3y12345
```

### 3. Levantar la Base de Datos con Docker

```bash
docker compose up -d
```

Verifica el estado del contenedor `teslo-db`:
```bash
docker compose ps
```

### 4. Ejecutar la Aplicación NestJS

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

---

## 🌐 Despliegue y Entornos de Producción

El proyecto se encuentra desplegado y disponible para pruebas en producción:

- 🚀 **Backend REST API / WebSockets (Render)**: [https://nest-tesloshop-ey13.onrender.com](https://nest-tesloshop-ey13.onrender.com)
- 📚 **Documentación Swagger en Producción**: [https://nest-tesloshop-ey13.onrender.com/api](https://nest-tesloshop-ey13.onrender.com/api)
- 🖥️ **Cliente Frontend de WebSockets (Netlify)**: [https://legendary-meerkat-bae0c8.netlify.app](https://legendary-meerkat-bae0c8.netlify.app/)

---

## 📚 Documentación Interactiva (Swagger)

Puedes acceder y probar los endpoints interactivos en cualquiera de los siguientes entornos:

- **Desarrollo Local**: `http://localhost:3000/api`
- **Producción (Render)**: 👉 [https://nest-tesloshop-ey13.onrender.com/api](https://nest-tesloshop-ey13.onrender.com/api)

Desde la interfaz de Swagger podrás explorar los esquemas de DTOs, entidades y ejecutar peticiones directamente utilizando el botón **Authorize** (con el token JWT obtenido al iniciar sesión).

---

## 🌱 Ejecución del SEED

El SEED restablece la base de datos limpiando registros y creando los usuarios e imágenes de prueba iniciales:

* **Endpoint Local**: `GET http://localhost:3000/api/seed`
* **Endpoint Producción**: `GET https://nest-tesloshop-ey13.onrender.com/api/seed`
* **cURL (Producción)**:
  ```bash
  curl https://nest-tesloshop-ey13.onrender.com/api/seed
  ```
* **Usuarios de prueba generados**:
  - **Admin**: `test1@google.com` / `Abc123`
  - **User**: `test2@google.com` / `Abc123`

---

## ⚡ Conexión a WebSockets (Socket.IO)

Para conectarte al servicio de chat/mensajes en tiempo real:

### 🖥️ Cliente Demo (Frontend en Netlify)
Puedes probar la funcionalidad del WebSocket en tiempo real utilizando la aplicación cliente desplegada en Netlify:
👉 **[https://legendary-meerkat-bae0c8.netlify.app](https://legendary-meerkat-bae0c8.netlify.app/)**

### 🔌 Servidor WebSocket (Backend):
- **Desarrollo Local**: `http://localhost:3000`
- **Producción (Render)**: `https://nest-tesloshop-ey13.onrender.com`

### 🔑 Headers de Handshake Requeridos:
```json
{
  "authentication": "<TU_JWT_TOKEN>"
}
```

### Eventos de WebSocket:
- **`clients-updated`** *(Escuchar)*: Devuelve el listado de clientes activos conectados.
- **`message-from-client`** *(Emitir)*: Envía un objeto `{ "message": "Texto del mensaje" }`.
- **`message-from-server`** *(Escuchar)*: Recibe mensajes emitidos por otros usuarios con el formato `{ "fullName": "Nombre Usuario", "message": "Texto" }`.

---

## 📋 Resumen de Endpoints REST Principal

| Módulo | Método | Endpoint | Protección / Rol | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Pública | Registrar nuevo usuario |
| **Auth** | `POST` | `/api/auth/login` | Pública | Iniciar sesión y obtener JWT |
| **Auth** | `GET` | `/api/auth/check-status` | `@Auth()` | Validar y renovar token JWT |
| **Products** | `GET` | `/api/products` | Pública | Listar productos con paginación |
| **Products** | `GET` | `/api/products/:term` | Pública | Buscar producto por ID, slug o título |
| **Products** | `POST` | `/api/products` | `@Auth()` | Crear un nuevo producto (asociado al usuario) |
| **Products** | `PATCH` | `/api/products/:id` | `@Auth(admin)` | Actualizar producto por ID |
| **Products** | `DELETE` | `/api/products/:id` | `@Auth(admin)` | Eliminar producto por ID |
| **Files** | `POST` | `/api/files/product` | Pública | Cargar imagen de producto (Multipart) |
| **Files** | `GET` | `/api/files/product/:imageName` | Pública | Obtener archivo de imagen estático |
| **Seed** | `GET` | `/api/seed` | Pública | Reiniciar base de datos e insertar datos de prueba |

---

## 🗄️ Conexión a Base de Datos (GUI)

* **Host**: `localhost`
* **Puerto**: `5432`
* **Usuario**: Valor de `DB_USERNAME` (ej. `postgres`)
* **Contraseña**: Valor de `DB_PASSWORD` (ej. `MySecr3tPassw0rd`)
* **Base de datos**: Valor de `DB_NAME` (ej. `TesloDB`)
