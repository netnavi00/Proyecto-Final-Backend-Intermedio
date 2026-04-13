// 1. Importaciones 
const express = require('express');
// cors es necesario para permitir solicitudes desde el frontend (React) al backend (Node.js)
const cors = require('cors');
const path = require('path'); 
const apiRoutes = require('./routes/api');
// express es el framework para crear el servidor.
const app = express();
const PORT = 3000;

// 2. MIDDLEWARES: bloque entre servidor y peticiones, para procesar datos antes de llegar a las rutas.
app.use(cors());
app.use(express.json());

// 3. CARPETA ESTÁTICA PARA FOTOS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. RUTAS
app.use('/api', apiRoutes);

// 5. INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});