# TesloShop - NestJS Backend

Proyecto Backend de Tienda Virtual construido con NestJS y PostgreSQL.

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:

* [Node.js](https://nodejs.org/) (versión v18+ recomendada)
* [Docker Desktop](https://www.docker.com/)

---

## 🛠️ Pasos para la configuración e instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias del proyecto
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
```

### 3. Levatamiento de la Base de Datos con Docker

Ejecuta el siguiente comando para iniciar el contenedor de PostgreSQL en segundo plano:

```bash
docker compose up -d
```

Para verificar que el contenedor se esté ejecutando:

```bash
docker compose ps
```

Para detener la base de datos:

```bash
docker compose down
```

---

## 🗄️ Conexión a la Base de Datos (TablePlus / DBeaver / PgAdmin)

Para conectarte a la base de datos desde un cliente GUI como TablePlus, utiliza las siguientes credenciales:

* **Host**: `127.0.0.1` (o `localhost`)
* **Puerto**: `5433` *(Mapeado hacia el puerto interno 5432 del contenedor)*
* **Usuario**: `postgres`
* **Contraseña**: Valor de `DB_PASSWORD` en tu `.env` (ej. `MySecr3tPassw0rd`)
* **Base de datos**: Valor de `DB_NAME` en tu `.env` (ej. `TesloDB`)
* **SSL Mode**: `DISABLE`

---

## 💻 Ejecución de la Aplicación NestJS

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```
