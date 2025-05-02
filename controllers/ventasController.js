const db = require('../models/db');
const moment = require('moment');

exports.listarVentas = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [ventas] = await connection.query(`
      SELECT 
        id,
        cliente_id,
        fecha,
        total,
        tipo_pago,
        numero_comprobante,
        igv,
        descuento,
        estado,
        observaciones,
        empleado_id,
        forma_entrega
      FROM ventas
      ORDER BY fecha DESC
    `);
    res.json(ventas);
  } catch (error) {
    console.error('[ventasController.listarVentas]', error);
    res.status(500).json({ error: 'Error al listar ventas', detalles: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.registrarVenta = async (req, res) => {
  const {
    cliente_id,
    total,
    tipo_pago,
    numero_comprobante,
    igv,
    descuento,
    estado,
    observaciones,
    empleado_id,
    forma_entrega,
    carrito
  } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar venta
    const [venta] = await connection.query(`
      INSERT INTO ventas (cliente_id, total, tipo_pago, numero_comprobante, igv, descuento, estado, observaciones, empleado_id, forma_entrega)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cliente_id, total, tipo_pago, numero_comprobante, igv, descuento, estado, observaciones, empleado_id, forma_entrega]
    );

    const venta_id = venta.insertId;

    // Insertar productos
    for (let item of carrito) {
      await connection.query(`
        INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, descripcion)
        VALUES (?, ?, ?, ?, ?)`,
          [venta_id, item.id, item.cantidad, item.precio, item.nombre]
      );
    }

    await connection.commit();
    res.status(200).json({ success: true, venta_id });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Error al registrar venta', detalles: error.message });
  } finally {
    connection.release();
  }
};
