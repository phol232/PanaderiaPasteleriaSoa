const db = require('../models/db');

const registrarCliente = (req, res) => {
  const { nombre, email } = req.body;
  db.query('INSERT INTO clientes (nombre, email) VALUES (?, ?)', [nombre, email], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: resultado.insertId, mensaje: 'Cliente registrado correctamente' });
  });
};

const buscarClientePorEmail = (req, res) => {
  const { email } = req.query;
  db.query('SELECT * FROM clientes WHERE email = ?', [email], (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resultados.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(resultados[0]);
  });
};

module.exports = { registrarCliente, buscarClientePorEmail };