
const jwt = require('jsonwebtoken'); //jsonwebtoken trabaja en base a promesas
const { Usuario } = require('../models') // apunta al index de models

const generarJWT = ( uid = '' ) => { // uid user id

    return new Promise( (resolve, reject) => {

        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, { //mi firma para el token
            expiresIn: '4h' //<-- pueden ser horas, dias ej: 365  refiriendose a dias
        }, ( err, token ) => {

            if ( err ){
                console.log( err );
                reject( 'No se pudo generar el token');

            } else {
                resolve( token );
            }

        });

    });

}

const comprobarJWT = async( token = '' ) => {

    try {

        if ( token.length < 10 ){

            return null; // no vino ningun token

        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if ( usuario ){ //si el usuario existe hacer las siguientes comprobaciones

            if ( usuario.estado ){

                return usuario; // el usuario esta activo en la BD

            } else {

                return null;  // el estado del usuario esta en false en la BD
            }

        } else {

            return null; // el usuario no se encontro en la BD

        }
        
    } catch (error) {

        return null;
        
    }

}

module.exports = {

    generarJWT,
    comprobarJWT
}