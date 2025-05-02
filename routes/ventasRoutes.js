// routes/ventasRoutes.js
const express = require('express');
const router  = express.Router();

const {
    listarVentas,
    registrarVenta
} = require('../controllers/ventasController');

// GET /api/ventas
router.get('/', listarVentas);

// POST /api/ventas/registrar
router.post('/registrar', registrarVenta);

module.exports = router;
