// backend/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// --- IMPORTACIONES DE CONTROLADORES ---
const employeeController = require('../controllers/employeeController');
const incidenciaController = require('../controllers/incidenciaController');
const deptController = require('../controllers/deptController'); 

// --- CONFIGURACIÓN DE MULTER (Gestión de Fotos) ---
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `emp-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// --- RUTAS DE EMPLEADOS ---
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeDetail);
router.post('/employees/:id/photo', upload.single('photo'), employeeController.uploadPhoto);
router.delete('/employees/:id/photo', employeeController.deletePhoto);

// --- RUTAS DE DEPARTAMENTOS ---
router.get('/departments', deptController.getAll);
router.get('/departments/:id/employees', deptController.getEmployeesByDept);

// --- RUTAS DE INCIDENCIAS ---
router.get('/incidencias', incidenciaController.getAll);
router.post('/incidencias', incidenciaController.create);
router.patch('/incidencias/:id', incidenciaController.updateStatus);
router.delete('/incidencias/:id', incidenciaController.delete);

module.exports = router;