const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try{ //validacion de log in

        // verificar si email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos -> correo'
            });
        }


        // verificar si el usuario esta activo en la BD
        if (!usuario.estado){ //si estado en la bd es === false entonces:
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos -> estado: false'
            });
        }


        // verificar la contraseña                  pass de req.body    contra pass en la bd
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos -> contraseña: false'
            })
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            //msg: 'Login OK'
            usuario,
            token
        });


    } catch (error){

        console.log(error);
        return res.status(500).json({ //en este caso return es opcional
            msg: 'Error, hable con el administrador'

        });
    }

}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body; // desde html data-client_id="304934559568-g1dk4v80jii1vi55bmfom028frf1icg6.apps.googleusercontent.com"

    try {

        // const googleUser = await googleVerify( id_token );
        // console.log( googleUser ); //payload personalizado

        const { correo, nombre, img } = await googleVerify( id_token );

        // si GOOGLE_CLIENT_ID de .env hace match con lo que llega en const { id_token } = req.body;
        // entonce se buscara en la bd un usuario con ese correo, si no existe, es decir si usuario es false
        // entonces lo creara

        let usuario = await Usuario.findOne({ correo }); //busca usuario en bd

        if ( !usuario ){ //si usuario no existe en bd, tengo que crearlo

            const data = {

                nombre,
                correo,
                password: "xD", //evalua hash pero no choca
                img, //si no hay imagen, entonces undefined
                rol: "USER_ROLE",
                // estado: true,
                google: true // sabre en la bd que usuarios fueron creados por google
            };

            usuario = new Usuario( data );
            await usuario.save();

        }

        if ( !usuario.estado ){ //si estado de usuario en bd es false

            return res.status(401).json({
                msg: 'Hable con administrador, usuario bloqueado'
            });
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            // msg: 'Todo bien google sign in id_token',
            usuario,
            token
        });
 
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El token de google no se pudo verificar'
        });
        
    }

}

const renovarToken = async( req, res = response) => {

    const { usuario } = req;

    // generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    });

}

module.exports = {

    login,
    googleSignIn,
    renovarToken

}