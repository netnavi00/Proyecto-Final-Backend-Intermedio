const db = require('../config/db');

const incidenciaController = {
    getAll: async (req, res) => {
        try {
            const sql = `
                SELECT i.*, e.first_name, e.last_name 
                FROM incidencias_rrhh i 
                JOIN employees e ON i.emp_no = e.emp_no 
                ORDER BY i.fecha DESC`;
            const [rows] = await db.query(sql);
            res.json(rows);
        } catch (err) {
            console.error("❌ Error en getAll:", err);
            res.status(500).json({ error: 'Error al obtener incidencias: ' + err.message });
        }
    },

    create: async (req, res) => {
        const { emp_no, tipo, fecha, descripcion } = req.body;
        const estatusInicial = 'Pendiente'; 
        try {
            const [result] = await db.query(
                'INSERT INTO incidencias_rrhh (emp_no, tipo, fecha, descripcion, estatus) VALUES (?, ?, ?, ?, ?)',
                [emp_no, tipo, fecha, descripcion, estatusInicial]
            );
            res.status(201).json({ message: 'Incidencia creada con éxito', id_incidencia: result.insertId });
        } catch (err) {
            console.error("❌ Error en create:", err);
            res.status(500).json({ error: 'Error al crear la incidencia: ' + err.message });
        }
    },

    updateStatus: async (req, res) => {
        const { id } = req.params;
        // Extraemos los datos del body
        const { emp_no, tipo, fecha, descripcion, estatus } = req.body;
        
        try {
            // Limpiamos la fecha solo si existe, si no, pasamos null
            const fechaLimpia = fecha ? fecha.split('T')[0] : null;

            // Usamos COALESCE: si el parámetro es NULL, mantiene el valor actual de la columna
            const sql = `
                UPDATE incidencias_rrhh 
                SET emp_no = COALESCE(?, emp_no), 
                    tipo = COALESCE(?, tipo), 
                    fecha = COALESCE(?, fecha), 
                    descripcion = COALESCE(?, descripcion), 
                    estatus = COALESCE(?, estatus) 
                WHERE id_incidencia = ?`;
                
            const [result] = await db.query(sql, [
                emp_no || null, 
                tipo || null, 
                fechaLimpia, 
                descripcion || null, 
                estatus || null, 
                id
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "No se encontró el registro" });
            }

            res.json({ success: true, message: 'Actualizado correctamente' });
        } catch (err) {
            console.error("❌ Error en Update:", err);
            res.status(500).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await db.query(
                'DELETE FROM incidencias_rrhh WHERE id_incidencia = ?', 
                [id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'No se encontró la incidencia' });
            }
            res.json({ message: 'Incidencia eliminada correctamente' });
        } catch (err) {
            console.error("❌ Error en delete:", err);
            res.status(500).json({ error: 'Error al eliminar: ' + err.message });
        }
    }
};

module.exports = incidenciaController;