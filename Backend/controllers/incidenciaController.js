// Controlador para manejar las operaciones relacionadas con las incidencias de RRHH
const db = require('../config/db');

const incidenciaController = {
    // Listar todas las incidencias con nombres de empleados (JOIN)
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

    // Crear incidencia
    create: async (req, res) => {
        const { emp_no, tipo, fecha, descripcion } = req.body;
        // Por defecto, toda nueva incidencia nace como 'Pendiente'
        const estatusInicial = 'Pendiente'; 
        
        try {
            const [result] = await db.query(
                'INSERT INTO incidencias_rrhh (emp_no, tipo, fecha, descripcion, estatus) VALUES (?, ?, ?, ?, ?)',
                [emp_no, tipo, fecha, descripcion, estatusInicial]
            );
            res.status(201).json({ 
                message: 'Incidencia creada con éxito', 
                id_incidencia: result.insertId 
            });
        } catch (err) {
            console.error("❌ Error en create:", err);
            res.status(500).json({ error: 'Error al crear la incidencia: ' + err.message });
        }
    },

    // Actualizar estatus (Aprobado, Rechazado, Pendiente)
    updateStatus: async (req, res) => {
        const { id } = req.params; // Este 'id' viene de la ruta /incidencias/:id
        const { estatus } = req.body;

        try {
            const [result] = await db.query(
                'UPDATE incidencias_rrhh SET estatus = ? WHERE id_incidencia = ?', 
                [estatus, id]
            );

            // Verificamos si realmente se encontró y actualizó la fila
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'No se encontró la incidencia con ID: ' + id });
            }

            res.json({ message: 'Estatus actualizado correctamente' });
        } catch (err) {
            console.error("❌ Error en updateStatus:", err);
            res.status(500).json({ error: 'Error al actualizar: ' + err.message });
        }
    },

    // Eliminar incidencia
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await db.query(
                'DELETE FROM incidencias_rrhh WHERE id_incidencia = ?', 
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'No se pudo eliminar: Incidencia no encontrada' });
            }

            res.json({ message: 'Incidencia eliminada correctamente' });
        } catch (err) {
            console.error("❌ Error en delete:", err);
            res.status(500).json({ error: 'Error al eliminar: ' + err.message });
        }
    }
};

module.exports = incidenciaController;