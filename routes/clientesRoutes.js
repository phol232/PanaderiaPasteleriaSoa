const express = require('express');
const router = express.Router();
const { registrarCliente, buscarClientePorEmail } = require('../controllers/clientesController');

router.post('/clientes', registrarCliente);
router.get('/clientes', buscarClientePorEmail);

module.exports = router;