🎮 Runaria — Tu biblioteca personal de videojuegos

### Funcionalidades principales

- **Explorar videojuegos:** consultar un catálogo con información, imágenes, géneros, plataformas y calificaciones.
- **Búsqueda y filtros:** encontrar videojuegos por nombre, género o plataforma.
- **Biblioteca personal:** guardar videojuegos y organizarlos según su estado: pendiente, jugando, completado o abandonado.
- **Autenticación:** registrarse e iniciar sesión para acceder a una biblioteca privada (Etapa 2).
- **Gestión de biblioteca:** agregar, editar y eliminar videojuegos de la colección personal.

### API de terceros: RAWG Video Games Database

Runaria utiliza RAWG Video Games Database API para obtener información de videojuegos, incluyendo títulos, descripciones, portadas, fechas de lanzamiento, géneros, plataformas y puntuaciones.

Esta integración permitirá ofrecer un catálogo de videojuegos sin necesidad de almacenar toda esa información en nuestra propia base de datos.

- **Página oficial:** https://rawg.io/
- **Documentación de la API:** https://rawg.io/apidocs
- **URL base de la API:** https://api.rawg.io/api

Variables de entorno
Copiar el archivo .env.example como .env.
Obtener una API Key desde la página oficial de RAWG.
Configurar la variable VITE_RAWG_API_KEY en .env.
Reiniciar el servidor de Vite después de modificar las variables.

### Tecnologías

- **Frontend:** React, TypeScript y Vite.
- **Backend:** Node.js, Express y TypeScript.
- **Base de datos:** MongoDB con Mongoose.
- **API externa:** RAWG Video Games Database API.
