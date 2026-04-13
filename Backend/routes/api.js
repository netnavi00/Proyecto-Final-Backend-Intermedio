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
//Importamos el controlador de incidencias para manejar la lógica de las rutas relacionadas con incidencias
const incidenciaController = require('../controllers/incidenciaController');

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
router.get('/incidencias', incidenciaController.getAll);
// Nueva ruta para subir foto de empleado. Se usa el middleware de multer para manejar la subida del archivo con el campo 'photo'.
router.post('/employees/:id/photo', upload.single('photo'), employeeController.uploadPhoto);
// Nueva ruta para crear una incidencia. Se espera un JSON con los datos de la incidencia en el cuerpo de la solicitud.
router.post('/incidencias', incidenciaController.create);

router.patch('/incidencias/:id', incidenciaController.updateStatus);

router.delete('/incidencias/:id', incidenciaController.delete);

// Se exporta el router para que pueda ser usado en index.js y así integrar estas rutas a la aplicación principal
module.exports = router;