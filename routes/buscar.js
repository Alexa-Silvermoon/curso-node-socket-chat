
const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

// // http://localhost:8080/api/buscar/productos/LECHE ALQUERIA
router.get('/:coleccion/:termino', buscar); //parametros a buscar

module.exports = router;