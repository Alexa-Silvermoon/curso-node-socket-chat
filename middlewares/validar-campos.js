
const { validationResult } = require('express-validator'); //validar errores

const validarCampos = (req, res, next) => { //middlewares usan 3 argumentos

    const errors = validationResult(req);
    if (!errors.isEmpty()){ //en caso de que SI hay errores (no esta vacio)
        return res.status(400).json(errors); //400 bad request
    }

    next(); //si supero los errores entonces continuar con siguiente punto


}

module.exports = {

    validarCampos
}