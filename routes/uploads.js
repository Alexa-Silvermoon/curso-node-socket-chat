

const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [ //actualizar imagenes
    validarArchivoSubir,
    check('id', 'El id debe ser un ID de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [ //traer imagenes a postman
    check('id', 'El id debe ser un ID de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
    validarCampos
], mostrarImagen);

module.exports = router;