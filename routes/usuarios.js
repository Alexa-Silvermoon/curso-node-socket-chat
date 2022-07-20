
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelte, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// para optimizar, estas importaciones estan en middlewares > index.js
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares/index.js');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //no tiene que estar vacio
    check('password', 'La contraseña debe tener mas de 6 letras').isLength({ min:6 }), //longitud de caracteres minima 6
    // check('correo', 'El correo no es valido').isEmail(), //tiene que ser un correo
    check('correo').custom( emailExiste),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //isIn ¿existe en el arreglo?
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    // esAdminRole, //fuerza a que se tiene que ser admin para eliminar a otro usuario en la bd
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //<-- solo eso roles pueden eliminar a otro usuario en la bd
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelte);

router.patch('/', usuariosPatch);



module.exports = router;