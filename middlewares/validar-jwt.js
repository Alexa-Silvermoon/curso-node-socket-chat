
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token'); //x-token es el key en postman para hacer delete
    console.log( token );

    if ( !token ){ //si no viene el token, se saca al usuario
        return res.status(401).json({ // error 401 unauthorized
            msg: 'No hay un token en la peticion'
        });
    }

    try {

        // const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); //verificar si el jwt es valido
        // console.log( payload );

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); //verificar si el jwt es valido

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if( !usuario ){ //si el usuario no existe, es decir si es undefined
            return res.status(401).json({ //error unauthorized
                msg: 'Token no valido - usuario no existe en BD'
            });
        }

        // verificar si el uid tiene estado en true, es decir que esta activo el usuario y no eliminado
        if ( !usuario.estado ){
            return res.status(401).json({ //error unauthorized
                msg: 'Token no valido - usuario con estado:false'
            });
        }

        req.usuario = usuario;

        next();

    } catch ( error ){
        console.log( error );
        res.status(401).json({
            msg: 'Token no valido'
        });
    }


    // next(); rompe la app si este next va despues del catch


}

module.exports = {

    validarJWT
}