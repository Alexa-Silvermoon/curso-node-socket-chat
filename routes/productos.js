
const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

// obtener todos los productos - servicio publico
// http://localhost:8080/api/productos/
router.get('/', obtenerProductos );

// obtener un producto por id - servicio publico
// http://localhost:8080/api/productos/123
router.get('/:id', [
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID  de mongo valido').isMongoId(),
    //en el modelo de productos, categoria es obligatoria y debe ser validada
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
], crearProducto);

// actualizar producto por id - servicio privado - cualquier persona con token valido
// http://localhost:8080/api/productos/123
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID  de mongo valido').isMongoId(),
    //en el modelo de productos, categoria es obligatoria y debe ser validada
    check('categoria').custom( existeCategoriaPorId),
    // check('rol').custom( esRoleValido ),
    // tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //<-- solo eso roles pueden eliminar a una categoria en la bd
    validarCampos
], actualizarProducto);

// borrar producto por id - servicio privado - solo lo puede hacer un admin
// recodar que NO debe borrar de verdad, solo poner estado en false
// http://localhost:8080/api/productos/123
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //<-- solo eso roles pueden eliminar a un producto en la bd
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);



module.exports = router;