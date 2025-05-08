const router = require('express').Router();
const { listarCategorias } = require('../controllers/categoriasController');

router.get('/', listarCategorias);

module.exports = router;
