// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'un-secreto-muy-seguro';

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, usuario, password } = req.body;
    if (!nombre || !apellido || !usuario || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    if (await User.findByUsuario(usuario)) {
      return res.status(400).json({ error: 'El usuario ya está en uso' });
    }
    const salt       = await bcrypt.genSalt(10);
    const hashPasswd = await bcrypt.hash(password, salt);
    const userId     = await User.create({ nombre, apellido, usuario, contrasena: hashPasswd });
    const token = jwt.sign({ id: userId, usuario }, JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await User.findByUsuario(usuario);
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.me = async (req, res) => {
    res.json({ usuario: req.user.usuario, id: req.user.id });
  };
