const db = require('../models/db');

const registrarVenta = (req, res) => {
  const { cliente_id, productos } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query('INSERT INTO ventas (cliente_id, fecha) VALUES (?, NOW())', [cliente_id], (err, resultadoVenta) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      const venta_id = resultadoVenta.insertId;
      const detalle = productos.map(p => [venta_id, p.producto_id, p.cantidad, p.precio]);

      db.query('INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES ?', [detalle], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          res.json({ mensaje: 'Venta registrada correctamente', venta_id });
        });
      });
    });
  });
};

module.exports = { registrarVenta };