

const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, borrarCategoria, actualizarCategoria, obtenerCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId, esRoleValido } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();


// localhost/api/categorias - esta es una prueba
// router.get('/', (req, res) => {

//     res.json('todo ok router.get() en categorias.js en carpeta routes');
// });

// obtener todas las categorias - servicio publico
// http://localhost:8080/api/categorias/
router.get('/', obtenerCategorias );

// obtener una categoria por id - servicio publico
// http://localhost:8080/api/categorias/123
router.get('/:id', [
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

// crear categoria -servicio privado - cualquier persona con token valido
// http://localhost:8080/api/categorias/
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// actualizar categoria por id - servicio privado - cualquier persona con token valido
// http://localhost:8080/api/categorias/123
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    // check('rol').custom( esRoleValido ),
    // tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //<-- solo eso roles pueden eliminar a una categoria en la bd
    validarCampos
], actualizarCategoria);


// borrar categoria por id - servicio privado - solo lo puede hacer un admin
// recodar que NO debe borrar de verdad, solo poner estado en false
// http://localhost:8080/api/categorias/123
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //<-- solo eso roles pueden eliminar a una categoria en la bd
    check('id', 'No es un ID valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

module.exports = router;