const { response } = require("express");
// const req = require("express/lib/request"); NUNCA USADO

const esAdminRole = (req, res = response, next) => {

    if ( !req.usuario ){ //esta request de una vez trae las validaciones desde el archivo validar-jwt.js

        return res.status(500).json({ //500 error interno de mi servidor
            msg: 'Se esta intentando verificar el role sin validar el token primero'
        });

    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ){ //si el usuario no es ADMIN_ROLE desde la bd, entonces:

        return res.status(401).json({ //401 error, unauthorized
            msg: `${nombre} no es administrador - no tiene autorizacion`
        });

    }

    next();

}

const tieneRole = ( ...roles ) => { //operador rest ... hace que tieneRole('ADMIN_ROLE','VENTAS_ROLE') se vuelva un array

    return ( req, res = response, next) => {

        if ( !req.usuario ){ //esta request de una vez trae las validaciones desde el archivo validar-jwt.js

            return res.status(500).json({ //500 error interno de mi servidor
                msg: 'Se esta intentando verificar el rol sin validar el token primero'
            });
    
        }

        if ( !roles.includes( req.usuario.rol )){ //si usuario NO tiene rol apropiado, entonces da error

            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });

        }

        next();

    }

}

module.exports = {

    esAdminRole,
    tieneRole
}