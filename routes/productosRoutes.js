const router = require('express').Router();
const { listarProductos } = require('../controllers/productosController');

// De '/productos' a '/'
router.get('/', listarProductos);

module.exports = router;
