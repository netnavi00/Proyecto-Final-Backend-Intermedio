// 1. Importaciones 
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const apiRoutes = require('./routes/api');

// IMPORTACIONES PARA SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// IMPORTANTE: Para Render usamos process.env.PORT, si no, usa el 3000 local
const PORT = process.env.PORT || 3000;

// 2. CONFIGURACIÓN DE SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataWork API',
      version: '1.0.0',
      description: 'Documentación de la API de Gestión de Recursos Humanos',
      contact: {
        name: 'Tu Nombre',
      },
    },
    servers: [
      {
        // Esto detectará automáticamente tu URL de Render una vez desplegado
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        description: 'Servidor de Desarrollo / Producción',
      },
    ],
  },
  // Apunta a donde tienes tus rutas para que Swagger lea los comentarios
  apis: ['./index.js', './routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// 3. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 4. RUTA DE LA DOCUMENTACIÓN
// Al entrar a http://localhost:3000/api-docs verás el Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 5. CARPETA ESTÁTICA PARA FOTOS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. RUTAS
app.use('/api', apiRoutes);

// 7. INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en:`);
    console.log(`- API: http://localhost:${PORT}/api`);
    console.log(`- Docs: http://localhost:${PORT}/api-docs`);
});