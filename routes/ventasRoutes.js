const express = require('express');
const router = express.Router();
const { registrarVenta } = require('../controllers/ventasController');

router.post('/ventas', registrarVenta);

module.exports = router;