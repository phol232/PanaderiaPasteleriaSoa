const db = require('./db');

exports.findByUsuario = async (usuario) => {
  const [rows] = await db.query(
    'SELECT id, usuario, contrasena FROM clientes WHERE usuario = ?',
    [usuario]
  );
  return rows[0];
};

exports.create = async ({ nombre, apellido, usuario, contrasena }) => {
  const [result] = await db.query(
    `INSERT INTO clientes
      (nombre, apellido, usuario, contrasena, fecha_registro, estado)
     VALUES (?, ?, ?, ?, NOW(), 'activo')`,
    [nombre, apellido, usuario, contrasena]
  );
  return result.insertId;
};
