//Solicitud de endopints
const express = require('express');
// router para manejar las rutas de la API y express para crear el servidor
const router = express.Router();
//multer para manejo de archivos
const multer = require('multer');
//path para manejar rutas de archivos
const path = require('path');
//Importamos el controlador de empleados para manejar la lógica de las rutas
const employeeController = require('../controllers/employeeController');

// Configuración de Multer (Almacenamiento)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `emp-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Rutas existentes para empleados y departamentos
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeDetail);
router.get('/departments', employeeController.getDepartments);
// Nueva ruta para subir foto de empleado. Se usa el middleware de multer para manejar la subida del archivo con el campo 'photo'.
router.post('/employees/:id/photo', upload.single('photo'), employeeController.uploadPhoto);

// Se exporta el router para que pueda ser usado en index.js y así integrar estas rutas a la aplicación principal
module.exports = router;