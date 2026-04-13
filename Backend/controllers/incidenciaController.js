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
            // Si ocurre un error al obtener las incidencias, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al obtener incidencias: ' + err.message });
        }
    },

    // Crear incidencia
    create: async (req, res) => {
        const { emp_no, tipo, fecha, descripcion } = req.body;
        try {
            // Inserta una nueva incidencia en la base de datos usando los datos proporcionados en el cuerpo de la solicitud.
            const [result] = await db.query(
                'INSERT INTO incidencias_rrhh (emp_no, tipo, fecha, descripcion) VALUES (?, ?, ?, ?)',
                [emp_no, tipo, fecha, descripcion]
            );
            // Responde con un mensaje de éxito y el ID de la nueva incidencia creada. 
            res.status(201).json({ message: 'Incidencia creada', id: result.insertId });
        } catch (err) {
            // Si ocurre un error al crear la incidencia, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al crear: ' + err.message });
        }
    },

    // Actualizar estatus (Justificada, Pendiente, etc.)
    updateStatus: async (req, res) => {
        const { id } = req.params;
        const { estatus } = req.body;
        try {
            // Actualiza el estatus de una incidencia específica usando su ID y el nuevo estatus proporcionado en el cuerpo de la solicitud.
            await db.query('UPDATE incidencias_rrhh SET estatus = ? WHERE id_incidencia = ?', [estatus, id]);
            res.json({ message: 'Estatus actualizado correctamente' });
        } catch (err) {
            // Si ocurre un error al actualizar el estatus, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al actualizar: ' + err.message });
        }
    },

    // Eliminar incidencia
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            // Elimina una incidencia específica usando su ID proporcionado en los parámetros de la solicitud.
            await db.query('DELETE FROM incidencias_rrhh WHERE id_incidencia = ?', [id]);
            res.json({ message: 'Incidencia eliminada' });
        } catch (err) {
            // Si ocurre un error al eliminar la incidencia, responde con un error 500 y el mensaje del error
            res.status(500).json({ error: 'Error al eliminar: ' + err.message });
        }
    }
};

// Exportamos el controlador para que pueda ser usado en las rutas
module.exports = incidenciaController;