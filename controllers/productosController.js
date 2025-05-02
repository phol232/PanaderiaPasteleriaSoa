// controllers/productosController.js
const db = require('../models/db');

exports.listarProductos = async (req, res) => {
  try {
    // pool.query devuelve [rows, fields]
    const [rows] = await db.query('SELECT id, nombre, precio FROM productos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
