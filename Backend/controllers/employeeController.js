const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const employeeController = {
    // 1. Lista general
    getAllEmployees: async (req, res) => {
        try {
            const sql = `
                SELECT 
                    e.emp_no, e.first_name, e.last_name, e.gender, 
                    DATE_FORMAT(e.hire_date, '%Y-%m-%d') as hire_date,
                    d.dept_name as department,
                    (SELECT salary FROM salaries WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as salary,
                    (SELECT title FROM titles WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as puesto,
                    (SELECT photo_url FROM employee_photos WHERE emp_no = e.emp_no LIMIT 1) as photo_url
                FROM employees e
                LEFT JOIN dept_emp de ON e.emp_no = de.emp_no AND de.to_date > CURDATE()
                LEFT JOIN departments d ON de.dept_no = d.dept_no
                ORDER BY e.emp_no ASC
                LIMIT 50`;
            const [rows] = await db.query(sql);
            res.json(rows);
        } catch (err) { 
            res.status(500).json({ error: err.message }); 
        }
    },

    // 2. DETALLE DEL EMPLEADO
    getEmployeeDetail: async (req, res) => {
        const { id } = req.params;
        try {
            // Datos personales y puesto actual
            const sqlPersonal = ` 
                SELECT e.*, d.dept_name as department,
                (SELECT title FROM titles WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as puesto,
                (SELECT photo_url FROM employee_photos WHERE emp_no = e.emp_no LIMIT 1) as photo_url
                FROM employees e
                LEFT JOIN dept_emp de ON e.emp_no = de.emp_no AND de.to_date > CURDATE()
                LEFT JOIN departments d ON de.dept_no = d.dept_no
                WHERE e.emp_no = ?
                LIMIT 1`;

            const [personalRows] = await db.query(sqlPersonal, [id]);
            
            // Validación correcta de existencia del empleado
            if (!personalRows || personalRows.length === 0) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }

            // Consultas de historial salarios, puestos, departamentos
            const [salaries] = await db.query('SELECT salary, from_date FROM salaries WHERE emp_no = ? ORDER BY from_date DESC', [id]);
            const [puestos] = await db.query('SELECT title, from_date FROM titles WHERE emp_no = ? ORDER BY from_date DESC', [id]);
            const [historialDepts] = await db.query(`
                SELECT d.dept_name, de.from_date, de.to_date 
                FROM dept_emp de 
                JOIN departments d ON de.dept_no = d.dept_no 
                WHERE de.emp_no = ? 
                ORDER BY de.from_date DESC`, [id]);

            // Respuesta estructurada para el Frontend
            res.json({ 
                personal: personalRows[0],
                salaries: salaries || [], 
                puestos: puestos || [],
                departments: historialDepts || [] 
            });

        } catch (err) { 
            console.error("Error en detalle:", err);
            res.status(500).json({ error: 'Error interno: ' + err.message }); 
        }
    },

    // 3. Subir Foto
    uploadPhoto: async (req, res) => {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
        const photoUrl = `/uploads/${req.file.filename}`;
        try {
            await db.query(`INSERT INTO employee_photos (emp_no, photo_url) VALUES (?, ?) 
                           ON DUPLICATE KEY UPDATE photo_url = ?`, [id, photoUrl, photoUrl]);
            res.json({ message: 'Foto guardada', photo_url: photoUrl });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    // 4. Eliminar Foto
    deletePhoto: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT photo_url FROM employee_photos WHERE emp_no = ?', [id]);
            if (rows.length > 0) {
                const fullPath = path.join(__dirname, '..', rows[0].photo_url);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            }
            await db.query('DELETE FROM employee_photos WHERE emp_no = ?', [id]);
            res.json({ message: 'Foto eliminada' });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    // 5. Departamentos por ID
    getEmployeesByDept: async (req, res) => {
        const { id } = req.params; 
        try {
            const sql = `
                SELECT e.emp_no, e.first_name, e.last_name, d.dept_name as department,
                (SELECT title FROM titles WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as puesto,
                (SELECT photo_url FROM employee_photos WHERE emp_no = e.emp_no LIMIT 1) as photo_url
                FROM employees e
                INNER JOIN dept_emp de ON e.emp_no = de.emp_no
                INNER JOIN departments d ON de.dept_no = d.dept_no
                WHERE de.dept_no = ? AND de.to_date > CURDATE() 
                ORDER BY e.emp_no ASC LIMIT 50`;
            const [rows] = await db.query(sql, [id]);
            res.json(rows);
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};

module.exports = employeeController;