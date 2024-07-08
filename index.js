const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_curso_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type'); 
    next(); 
});


// Insertar persona
app.post('/insert', (req, res) => {
  const { cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
  pool.query(
    `INSERT INTO persona (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)`,
    [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al insertar persona' });
      }
      res.json({ idpersona: results.insertId, ...req.body });
    }
  );
});

// Actualizar persona
app.post('/update', (req, res) => {
  const { idpersona, cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
  pool.query(
    `UPDATE persona SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE idpersona = ?`,
    [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion, idpersona],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar persona' });
      }
      res.json({ message: 'Persona actualizada', affectedRows: results.affectedRows });
    }
  );
});

// Seleccionar todas las personas
app.post('/select', (req, res) => {
  pool.query(`SELECT * FROM persona`, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al seleccionar personas' });
    }
    res.json(results);
  });
});

// Eliminar persona
app.post('/delete', (req, res) => {
  const { idpersona } = req.body;
  pool.query(
    `DELETE FROM persona WHERE idpersona = ?`,
    [idpersona],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar persona' });
      }
      res.json({ message: 'Persona eliminada', affectedRows: results.affectedRows });
    }
  );
});

// Seleccionar persona por cedula
app.post('/select-where', (req, res) => {
  const { cedula } = req.body;
  pool.query(
    `SELECT * FROM persona WHERE cedula = ?`,
    [cedula],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al seleccionar persona por cedula' });
      }
      res.json(results);
    }
  );
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
