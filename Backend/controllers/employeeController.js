const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const employeeController = {
    //1.- Obtener lista de empleados para la tabla principal.
    getAllEmployees: async (req, res) => {
        try {
            // Consulta SQL que obtiene los datos básicos del empleado junto con su salario, puesto y foto más recientes. 
            // Se limita a 50 empleados para evitar sobrecargar la respuesta.
            const sql = `
                SELECT 
                    e.emp_no, 
                    e.first_name, 
                    e.last_name, 
                    e.gender, 
                    DATE_FORMAT(e.hire_date, '%Y-%m-%d') as hire_date,
                    (SELECT salary FROM salaries WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as salary,
                    (SELECT title FROM titles WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as puesto,
                    (SELECT photo_url FROM employee_photos WHERE emp_no = e.emp_no LIMIT 1) as photo_url
                FROM employees e 
                LIMIT 50`;
            const [rows] = await db.query(sql);
            res.json(rows);
        } catch (err) { 
            // Si ocurre un error al obtener los empleados, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al obtener empleados: ' + err.message }); 
        }
    },

    // 2. Detalle del empleado sincroniza con el Frontend
    getEmployeeDetail: async (req, res) => {
        const { id } = req.params;
        try {
            // Usa 3 queries para obtener datos personales, salarios y puestos. Se ordenan por fecha para mostrar el más reciente primero.
            const [personal] = await db.query(` 
                SELECT e.*, p.photo_url 
                FROM employees e 
                LEFT JOIN employee_photos p ON e.emp_no = p.emp_no 
                WHERE e.emp_no = ?`, [id]);
            
            const [salariosDB] = await db.query('SELECT salary, from_date FROM salaries WHERE emp_no = ? ORDER BY from_date DESC', [id]);
            const [puestosDB] = await db.query('SELECT title, from_date FROM titles WHERE emp_no = ? ORDER BY from_date DESC', [id]);
            
            if (personal.length === 0) {
                // Si no se encuentra el empleado, responde  con un error 404
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            // Responde con un objeto que contiene los datos personales, salarios y puestos del empleado
            res.json({ 
                personal: personal[0], 
                salaries: salariosDB, 
                puestos: puestosDB 
            });
            // Si ocurre un error en cualquiera de las consultas, responde con un error 500 y el mensaje del error
        } catch (err) { 
            res.status(500).json({ error: 'Error en el detalle: ' + err.message }); 
        }
    },

    // 3. Subir o Actualizar Foto
    uploadPhoto: async (req, res) => {
        const { id } = req.params;
        // Si no se recibió un archivo, responde con un error 400
        if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

        // Construimos la URL relativa para guardar en la base de datos. El Frontend la usará para mostrar la imagen.
        const photoUrl = `/uploads/${req.file.filename}`;
        try {
            // Usamos una consulta SQL con ON DUPLICATE KEY UPDATE para insertar o actualizar la foto del empleado. 
            // Si el empleado ya tiene una foto, se actualizará la URL. Si no, se insertará un nuevo registro.
            const sql = `
                INSERT INTO employee_photos (emp_no, photo_url) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE photo_url = ?`;
            await db.query(sql, [id, photoUrl, photoUrl]);
            res.json({message: 'Foto registrada en base de datos', photo_url: photoUrl });
        } catch (err) { 
            // Si ocurre un error al guardar la foto en la base de datos, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al guardar foto: ' + err.message }); 
        }
    },

    // 4. Eliminar Foto (Archivo físico + Registro DB)
    deletePhoto: async (req, res) => {
        const { id } = req.params;
        try {
            // Obtener la ruta para borrar el archivo del disco
            const [rows] = await db.query('SELECT photo_url FROM employee_photos WHERE emp_no = ?', [id]);
            
            if (rows.length > 0) {
                // Contruye la ruta completa hacia la carpeta uploads
                const fullPath = path.join(__dirname, '..', rows[0].photo_url);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            
            // Borrar de la base de datos
            await db.query('DELETE FROM employee_photos WHERE emp_no = ?', [id]);
            res.json({ message: 'Foto eliminada correctamente' });
        } catch (err) { 
            // Si ocurre un error al eliminar la foto, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al eliminar foto: ' + err.message }); 
        }
    },

    // 5. Lista de Departamentos
    getDepartments: async (req, res) => {
        try {
            // Consulta SQL para obtener la lista de departamentos. Se ordena por nombre para facilitar la lectura.
            const [rows] = await db.query('SELECT * FROM departments');
            res.json(rows);
        } catch (err) {
            // Si ocurre un error al obtener los departamentos, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: err.message });
        }
    }
};
// Exportamos el controlador para que pueda ser usado en las rutas
module.exports = employeeController;