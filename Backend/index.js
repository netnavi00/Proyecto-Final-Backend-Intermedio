// 1. Importaciones 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // Importamos el lector de YAML
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. CONFIGURACIÓN DE SWAGGER (Vía archivo externo)
// Cargamos el archivo que creaste en el paso anterior
const swaggerDocument = YAML.load('./swagger.yaml');

// 3. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 4. CARPETA ESTÁTICA PARA FOTOS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. RUTAS PARA LA DOCUMENTACIÓN
// Aquí servimos la documentación cargada desde el YAML
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 6. RUTAS DE LA API
app.use('/api', apiRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de DataWork funcionando. Visita /api-docs para ver la documentación.');
});

// 7. INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📖 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});