// backend/controllers/deptController.js
const db = require('../config/db');

const deptController = {
    // Obtener todos los departamentos
    getAll: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM departments ORDER BY dept_name');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    //Obtener empleados por ID de departamento
    getEmployeesByDept: async (req, res) => {
        const { id } = req.params; 
        console.log("--- SOLICITANDO EMPLEADOS PARA DEPTO:", id);
        try {
            // Card se llene correctamente con esta consulta
            const sql = `
                SELECT 
                    e.emp_no, 
                    e.first_name, 
                    e.last_name, 
                    DATE_FORMAT(e.hire_date, '%Y-%m-%d') as hire_date,
                    d.dept_name as department,
                    (SELECT title FROM titles WHERE emp_no = e.emp_no ORDER BY to_date DESC LIMIT 1) as puesto,
                    (SELECT photo_url FROM employee_photos WHERE emp_no = e.emp_no LIMIT 1) as photo_url
                FROM employees e
                INNER JOIN dept_emp de ON e.emp_no = de.emp_no
                INNER JOIN departments d ON de.dept_no = d.dept_no
                WHERE de.dept_no = ? AND de.to_date > CURDATE()
                ORDER BY e.emp_no ASC
                LIMIT 50`;

            const [rows] = await db.query(sql, [id]);
            console.log("--- FILAS DEVUELTAS:", rows.length);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: 'Error al filtrar: ' + err.message });
        }
    }
};

module.exports = deptController;