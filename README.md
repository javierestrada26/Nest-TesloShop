# TesloShop - NestJS Backend 🛍️

Proyecto Backend para tienda virtual construido con **NestJS**, **TypeORM** y **PostgreSQL**. Incluye gestión completa de productos, manejo de imágenes en cascada, transacciones en base de datos, búsqueda flexible, paginación y un sistema de carga inicial de datos (**SEED**).

---

## 🛠️ Tecnologías y Herramientas

- **Framework**: [NestJS 11](https://nestjs.com/)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL 17 (vía Docker)
- **ORM**: TypeORM
- **Validación y Transformación**: `class-validator`, `class-transformer`
- **Contenedorización**: Docker & Docker Compose

---

## 📌 Lo que se ha realizado hasta ahora

1. **Configuración del Proyecto y Estructura Modular**:
   - Configuración de la aplicación NestJS con prefijo global de API `/api`.
   - Implementación de `ValidationPipe` global con opciones `whitelist: true` y `forbidNonWhitelisted: true`.
   - Gestión de variables de entorno mediante `@nestjs/config` (`ConfigModule`).

2. **Base de Datos y Modelado con TypeORM**:
   - Configuración del servicio PostgreSQL con Docker Compose (`postgres:17-alpine`).
   - Entidad **`Product`**: Campos `id` (UUID v4), `title`, `price`, `description`, `slug`, `stock`, `sizes`, `gender` y `tags`.
   - Entidad **`ProductImage`**: Relación `@ManyToOne` con `Product` y eliminación en cascada (`onDelete: 'CASCADE'`).
   - Normalización y autogeneración de `slug` mediante decoradores/hooks de TypeORM (`@BeforeInsert` y `@BeforeUpdate`).

3. **Módulo de Productos (`ProductsModule`)**:
   - **`POST /api/products`**: Creación de productos y guardado simultáneo de imágenes.
   - **`GET /api/products`**: Listado de productos con paginación (`limit`, `offset`) usando `PaginationDto` y formato aplanado para devolver únicamente las URLs de las imágenes.
   - **`GET /api/products/:term`**: Búsqueda flexible por `UUID`, `slug` o coincidencia insensible a mayúsculas/minúsculas en el `title` (vía `QueryBuilder`).
   - **`PATCH /api/products/:id`**: Actualización parcial de productos y reemplazo transaccional de imágenes utilizando `QueryRunner` de TypeORM (con commit y rollback en caso de error).
   - **`DELETE /api/products/:id`**: Eliminación de productos por ID (las imágenes asociadas se eliminan automáticamente en cascada).
   - **`deleteAllProducts()`**: Método helper para borrado masivo de productos.
   - **Manejo de Errores**: Captura de duplicados de clave única de PostgreSQL (`code 23505`) retornando `BadRequestException`, y manejo de excepciones `NotFoundException` e `InternalServerErrorException`.

4. **Módulo de Semilla (`SeedModule`)**:
   - Implementación del servicio y controlador de SEED.
   - Endpoint **`GET /api/seed`** que limpia la base de datos y la pobla con el catálogo de productos predefinidos (`initialData`).

---

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:

* [Node.js](https://nodejs.org/) (versión v18+ recomendada)
* [npm](https://www.npmjs.com/)
* [Docker Desktop](https://www.docker.com/) o Docker Engine activo

---

## 🛠️ Pasos para Levantar el Proyecto

### 1. Clonar el repositorio e instalar dependencias

```bash
# Clonar repositorio (si aplica)
git clone <URL_DEL_REPOSITORIO>
cd teslo-shop

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

Crea tu archivo `.env` basándote en la plantilla `.env.template`:

```bash
cp .env.template .env
```

Configura las variables dentro de tu `.env`:

```env
DB_PASSWORD=MySecr3tPassw0rd
DB_NAME=TesloDB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
PORT=3000
```

### 3. Levantar la Base de Datos con Docker

Ejecuta el siguiente comando para iniciar el contenedor de PostgreSQL en segundo plano:

```bash
docker compose up -d
```

Para verificar que el contenedor `teslo-db` esté corriendo correctamente:

```bash
docker compose ps
```

*(Para detener la base de datos en cualquier momento: `docker compose down`)*

### 4. Ejecutar la Aplicación NestJS

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run start:prod
```

La API estará disponible en: `http://localhost:3000/api`

---

## 🌱 Pasos para Aplicar el SEED

El SEED borra todos los productos e imágenes existentes en la base de datos y los reemplaza con el catálogo inicial de prueba.

### 1. Asegúrate de que la aplicación esté en ejecución
El servidor NestJS debe estar corriendo (ej. `npm run start:dev`).

### 2. Ejecutar la Semilla

Realiza una petición HTTP `GET` al endpoint `/api/seed`. Puedes hacerlo de cualquiera de las siguientes formas:

* **Desde el Navegador**:
  Ingresa a: `http://localhost:3000/api/seed`

* **Desde la Terminal (cURL)**:
  ```bash
  curl http://localhost:3000/api/seed
  ```

* **Desde Postman / Thunder Client / Insomnia**:
  Enviar una solicitud `GET` a `http://localhost:3000/api/seed`

### 3. Confirmación
Si la semilla se ejecutó correctamente, recibirás el mensaje:
```text
SEED EXECUTED
```

### 4. Verificar los Datos Insertados
Puedes verificar que los productos fueron creados consultando el endpoint de productos:

* **URL**: `http://localhost:3000/api/products`
* **cURL**:
  ```bash
  curl http://localhost:3000/api/products
  ```

---

## 🗄️ Conexión a la Base de Datos (TablePlus / DBeaver / PgAdmin)

Para conectarte a la base de datos desde un cliente GUI, utiliza las credenciales configuradas en tu `.env`:

* **Host**: `localhost` (o `127.0.0.1`)
* **Puerto**: `5432` *(o el puerto configurado en `DB_PORT`)*
* **Usuario**: `postgres` (o el valor de `DB_USERNAME`)
* **Contraseña**: Valor de `DB_PASSWORD` (ej. `MySecr3tPassw0rd`)
* **Base de datos**: Valor de `DB_NAME` (ej. `TesloDB`)
* **SSL Mode**: `DISABLE`

---

## 📋 Resumen de Endpoints Principales

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/seed` | Ejecutar el SEED (limpia e inserta datos iniciales) |
| `POST` | `/api/products` | Crear un nuevo producto con imágenes |
| `GET` | `/api/products` | Listar productos con paginación (`?limit=10&offset=0`) |
| `GET` | `/api/products/:term` | Buscar producto por `id` (UUID), `slug` o `title` |
| `PATCH` | `/api/products/:id` | Actualizar producto por `id` (manejo de imágenes transaccional) |
| `DELETE` | `/api/products/:id` | Eliminar producto por `id` (en cascada) |
