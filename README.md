# 🎮 Runaria — Tu biblioteca personal de videojuegos

## Aplicación desplegada

- **Frontend:** https://runaria-web.vercel.app/
- **Backend:** https://runaria-api.vercel.app/
- **Estado de la API:** https://runaria-api.vercel.app/health

## Funcionalidades principales

- **Catálogo de videojuegos:** información, imágenes, géneros, plataformas y calificaciones obtenidas de RAWG.
- **Búsqueda y filtros:** búsqueda por nombre y filtrado por género y plataforma.
- **Autenticación:** registro, inicio de sesión y recuperación de sesión mediante JWT.
- **Biblioteca personal:** agregar y eliminar videojuegos asociados a cada cuenta.
- **Estados de videojuegos:** pendiente, jugando, completado y abandonado.
- **Favoritos:** marcar y desmarcar videojuegos favoritos independientemente de la biblioteca.
- **Rutas protegidas:** acceso a funcionalidades privadas únicamente para usuarios autenticados.
- **Persistencia:** almacenamiento de bibliotecas y favoritos en MongoDB Atlas.

## 🛠️ Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS Modules

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

### Servicios externos

- RAWG Video Games Database API
- Vercel (frontend y backend)

## API externa: RAWG Video Games Database

Runaria utiliza RAWG Video Games Database API para obtener información de videojuegos, incluyendo:

- Títulos y descripciones.
- Portadas e imágenes.
- Fechas de lanzamiento.
- Géneros y plataformas.
- Calificaciones.

La integración se realiza desde el backend de Express.

El frontend consulta nuestra API REST y el servidor se comunica con RAWG utilizando una clave privada.

**Enlaces oficiales:**

- **Página oficial:** https://rawg.io/
- **Documentación:** https://rawg.io/apidocs
- **URL base de RAWG:** https://api.rawg.io/api

## 📁 Estructura del proyecto

project-GameShelf/
├── client/ # Aplicación React + TypeScript
├── server/ # API REST con Express
├── README.md
└── .gitignore

## 💻 Configurtación local

Instalación de dependencias

Desde la raíz del proyecto:

```bash
npm run install:all
```

Crear un archivo `.env` utilizando `.env.example` como referencia:

Backend

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=tu_cadena_de_conexion
JWT_SECRET=tu_clave_secreta
RAWG_API_KEY=tu_clave_de_rawg
```

Frontend

```env
VITE_API_URL=http://localhost:3001
```

Iniciar en modo desarrollo:

```bash
npm run dev
```

## Validación del proyecto

El frontend y el backend incluyen comandos para comprobar la compilación y analizar posibles errores.

### Frontend

```bash
cd client
npm run lint
npm run build
```

### Backend

```bash
cd server
npm run lint
npm run build
npm test
npm run test:integration
```
