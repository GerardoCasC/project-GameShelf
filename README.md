🎮 GameShelf — Tu biblioteca personal de videojuegos

### Funcionalidades principales
- **Explorar videojuegos:** consultar un catálogo con información, imágenes, géneros, plataformas y calificaciones.
- **Búsqueda y filtros:** encontrar videojuegos por nombre, género o plataforma.
- **Biblioteca personal:** guardar videojuegos y organizarlos según su estado: pendiente, jugando, completado o abandonado.
- **Autenticación:** registrarse e iniciar sesión para acceder a una biblioteca privada (Etapa 2).
- **Valoraciones personales:** calificar videojuegos y añadir notas sobre la experiencia de juego.
- **Gestión de biblioteca:** agregar, editar y eliminar videojuegos de la colección personal.

### API de terceros: RAWG Video Games Database

GameShelf utilizará la **RAWG API** para obtener información de videojuegos, incluyendo títulos, descripciones, portadas, fechas de lanzamiento, géneros, plataformas y puntuaciones.

Esta integración permitirá ofrecer un catálogo de videojuegos sin necesidad de almacenar toda esa información en nuestra propia base de datos.

- **Página oficial:** https://rawg.io/
- **Documentación de la API:** https://rawg.io/apidocs
- **URL base de la API:** https://api.rawg.io/api

### Tecnologías
- **Frontend:** React, TypeScript y Vite.
- **Backend:** Node.js, Express y TypeScript.
- **Base de datos:** MongoDB con Mongoose.
- **API externa:** RAWG Video Games Database API.
