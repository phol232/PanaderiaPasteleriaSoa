const router = require('express').Router();
const { listarCategorias } = require('../controllers/categoriasController');

// Cambia '/categorias' por '/' para que quedes en /api/categorias
router.get('/', listarCategorias);

module.exports = router;
