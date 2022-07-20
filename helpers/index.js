
const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {

    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo

}

// el operador rest ... en este caso es para expandir todo el contenido,
//  es decir traer todas las propiedades, funciones, variables, constantes requeridas