// 1. Importaciones 
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const apiRoutes = require('./routes/api');

const app = express();
// Render usa process.env.PORT, localmente usa el 3000
const PORT = process.env.PORT || 3000;

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. CARPETA ESTÁTICA PARA FOTOS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. RUTAS
app.use('/api', apiRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de DataWork funcionando correctamente');
});

// 5. INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🚀 API lista en http://localhost:${PORT}/api`);
});