//Conexión a la base de datos MySQL usando mysql2 y dotenv para manejar variables de entorno
const mysql = require('mysql2');
require('dotenv').config();

// Pool de conexiones con MYSQL DB
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'employees',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión para dar un error claro si falla el password
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('❌ ERROR: Contraseña de MySQL incorrecta o no proporcionada.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('❌ ERROR: No se pudo conectar al servidor MySQL.');
        } else {
            console.error('❌ ERROR de Base de Datos:', err.message);
        }
    } else {
        console.log('✅ Conexión a la base de datos MySQL exitosa.');
        connection.release();
    }
});

// Exportamos el pool de conexiones usando la interfaz de promesas para facilitar el uso con async/await en los controladores
module.exports = pool.promise();

