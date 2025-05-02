// models/productoModel.js
const db = require('./db');

exports.findAll = () =>
  db
    .query('SELECT id, nombre, precio, imagen FROM productos')
    .then(([rows]) => rows);

exports.findById = (id) =>
  db
    .query('SELECT id, nombre, precio, imagen FROM productos WHERE id = ?', [id])
    .then(([rows]) => rows[0]);

exports.create = ({ nombre, precio, imagen }) =>
  db
    .execute(
      'INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)',
      [nombre, precio, imagen]
    )
    .then(([result]) => result.insertId);


