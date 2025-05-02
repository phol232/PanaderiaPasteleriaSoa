const db = require('../models/db');

const listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(resultados);
  });
};

module.exports = { listarCategorias };