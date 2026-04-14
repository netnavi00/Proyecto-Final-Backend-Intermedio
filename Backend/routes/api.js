// backend/routes/api.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const employeeController = require('../controllers/employeeController');
const incidenciaController = require('../controllers/incidenciaController');
const deptController = require('../controllers/deptController'); 

// --- CONFIGURACIÓN DE MULTER ---
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `emp-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 * - name: Employees
 * description: Gestión de personal y perfiles
 * - name: Departments
 * description: Estructura organizacional
 * - name: Incidencias
 * description: Control de faltas, retardos y permisos
 */

// --- RUTAS DE EMPLEADOS ---

/**
 * @swagger
 * /api/employees:
 * get:
 * summary: Obtener lista completa de empleados
 * tags: [Employees]
 * responses:
 * 200:
 * description: Lista de empleados obtenida con éxito
 */
router.get('/employees', employeeController.getAllEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 * get:
 * summary: Obtener detalle completo de un empleado (incluye salarios y puestos)
 * tags: [Employees]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Detalle del empleado encontrado
 * 404:
 * description: Empleado no encontrado
 */
router.get('/employees/:id', employeeController.getEmployeeDetail);

/**
 * @swagger
 * /api/employees/{id}/photo:
 * post:
 * summary: Subir o actualizar foto de perfil
 * tags: [Employees]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * photo:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Foto subida exitosamente
 */
router.post('/employees/:id/photo', upload.single('photo'), employeeController.uploadPhoto);

/**
 * @swagger
 * /api/employees/{id}/photo:
 * delete:
 * summary: Eliminar foto de perfil
 * tags: [Employees]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Foto eliminada correctamente
 */
router.delete('/employees/:id/photo', employeeController.deletePhoto);

// --- RUTAS DE DEPARTAMENTOS ---

/**
 * @swagger
 * /api/departments:
 * get:
 * summary: Listar todos los departamentos
 * tags: [Departments]
 * responses:
 * 200:
 * description: Lista de departamentos
 */
router.get('/departments', deptController.getAll);

/**
 * @swagger
 * /api/departments/{id}/employees:
 * get:
 * summary: Obtener empleados pertenecientes a un departamento
 * tags: [Departments]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * description: Código del departamento (ej. d001)
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Empleados filtrados por departamento
 */
router.get('/departments/:id/employees', deptController.getEmployeesByDept);

// --- RUTAS DE INCIDENCIAS ---

/**
 * @swagger
 * /api/incidencias:
 * get:
 * summary: Listar historial de incidencias
 * tags: [Incidencias]
 * responses:
 * 200:
 * description: Lista de todas las incidencias registradas
 */
router.get('/incidencias', incidenciaController.getAll);

/**
 * @swagger
 * /api/incidencias:
 * post:
 * summary: Registrar una nueva incidencia (Falta, Retraso, etc.)
 * tags: [Incidencias]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [emp_no, tipo, fecha, descripcion]
 * properties:
 * emp_no: { type: integer }
 * tipo: { type: string, example: "Falta" }
 * fecha: { type: string, format: date }
 * descripcion: { type: string }
 * responses:
 * 201:
 * description: Incidencia creada
 */
router.post('/incidencias', incidenciaController.create);

/**
 * @swagger
 * /api/incidencias/{id}:
 * patch:
 * summary: Actualizar estatus de una incidencia
 * tags: [Incidencias]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: integer }
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * estatus: { type: string, example: "Aprobado" }
 * responses:
 * 200:
 * description: Estatus actualizado
 */
router.patch('/incidencias/:id', incidenciaController.updateStatus);

/**
 * @swagger
 * /api/incidencias/{id}:
 * delete:
 * summary: Eliminar registro de incidencia
 * tags: [Incidencias]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: integer }
 * responses:
 * 200:
 * description: Registro eliminado
 */
router.delete('/incidencias/:id', incidenciaController.delete);

module.exports = router;