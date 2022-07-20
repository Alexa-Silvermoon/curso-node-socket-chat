
const { response, request } = require('express'); //respuesta de mi server, solicitud del exterior
const Usuario = require('../models/usuario'); //traer modelo
const bcryptjs = require('bcryptjs'); //encriptar contraseñas

const usuariosGet = async(req = request, res = response) => {

    // http://localhost:8080/api/usuarios/

    // const query = req.query;

    // const {q, nombre = 'No Nombre', apikey, page = 1, limit} = req.query;
    // en caso de que no venga nada en nombre entonces nombre = 'No Nombre'
    // link en postman http://localhost:8080/api/usuarios?q=hola&nombre=alexander&apikey=123


    // PAGINACION
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }; //estado de usuario activo o no?

    // const usuarios = await Usuario.find( query )
    //     .skip( Number(desde) ) //desde que elemento muestra
    //     .limit( Number(limite) ); //cantidad de datos a mostrar por pagina
    //     // http://localhost:8080/api/usuarios?desde=1&limite=3       GET
    //     // http://localhost:8080/api/usuarios?desde=0&limite=5       GET

    // const totalUsuariosResgistradosActivos = await Usuario.countDocuments( query );

    const [total_usuarios_activos, usuarios] = await Promise.all([ //esperar resolucion de ambas promesas

        Usuario.countDocuments( query ),

        Usuario.find( query )
        .skip( Number(desde) ) //desde que elemento muestra
        .limit( Number(limite) ) //cantidad de datos a mostrar por pagina

    ]);

    res.json({

        total_usuarios_activos,
        usuarios

        // totalUsuariosResgistradosActivos,
        // usuarios


        // ok: true,
        // msg: 'todo bien GET API - controlador',//esto aparecera en postman
        // //query,
        // q,
        // nombre,
        // apikey,
        // page,
        // limit

        //lo que devuelve mi servidor en postman:
        // {
        //     "ok": true,
        //     "msg": "todo bien GET API - controlador",
        //     "query": {
        //         "q": "hola",
        //         "nombre": "alexander",
        //         "apikey": "123"
        //     }
        // }

        // http://localhost:8080/api/usuarios?q=hola&apikey=123
        //lo que devuelve mi servidor en postman si no hay nombre:
        // {
        //     "ok": true,
        //     "msg": "todo bien GET API - controlador",
        //     "q": "hola",
        //     "nombre": "No Nombre",
        //     "apikey": "123"
        // }

        //http://localhost:8080/api/usuarios?q=hola&apikey=123&page=1&limit=10
        //lo que devuelve mi servidor, en caso de que no haya page, pone por defeto 1
        // {
        //     "ok": true,
        //     "msg": "todo bien GET API - controlador",
        //     "q": "hola",
        //     "nombre": "No Nombre",
        //     "apikey": "123",
        //     "page": "1",
        //     "limit": "10"
        // }

    });
    
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params; //desde router.put('/:id', usuariosPut);
    //viene desde el link de postman http://localhost:8080/api/usuarios/10

    const { _id, password, google, ...resto } = req.body; //lo que NO viene dentro de resto se excluye
    // const { _id, password, google, correo, ...resto } = req.body; //lo que NO viene dentro de resto se excluye

    //Validar contra la base de datos:
    if ( password ){
        
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync(); //10 vueltas por encriptacion
        resto.password = bcryptjs.hashSync( password, salt ); //encriptacion envinado contraseña y vueltas

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json({ //status 400 bad request
        // ok: true,
        // msg: 'PUT API - controlador',//esto aparecera en postman
        // id
        usuario//NOTA, si se esta actulizando en la BD, pero es la respuesta de postman trae los datos anteriores

        //Lo que devuelve mi servidor en postman:
        // {
        //     "ok": true,
        //     "msg": "PUT API - controlador",
        //     "id": "10"
        // }
        
    });
    
}

const usuariosPost = async(req, res = response) => {

    // http://localhost:8080/api/usuarios/

    const {nombre, correo, password, rol} = req.body;

    const usuario = new Usuario( {nombre, correo, password, rol} ); // lo envia a const Usuario = require('../models/usuario');


    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync(); //10 vueltas por encriptacion
    usuario.password = bcryptjs.hashSync( password, salt ); //encriptacion envinado contraseña y vueltas


    // Guardar en DB
    await usuario.save();

    // const {nombre, edad} = req.body; //req es lo que el frontend esta enviando a mi servidor, la request entra por el body
    //para saber si funciona verificar el postman

    res.json({

        // msg: 'POST API - controlador',//esto aparecera en postman
        //body,
        usuario
        
    });

    //grabando en mongoDB compass:
    // lo que se envio en postman:
    // {
    //     "nombre": "prueba xd",
    //     "google": "true",
    //     "campomalo": "true",
    //     "correo": "test1_alexan@test.com",
    //     "password": "123456",
    //     "rol": "SUPER_ROLE"
    // }
    //lo que recibo de postman:
    // {
    //     "usuario": {
    //         "nombre": "prueba xd",
    //         "correo": "test1_alexan@test.com",
    //         "password": "123456",
    //         "rol": "SUPER_ROLE",
    //         "estado": true,
    //         "google": true,
    //         "_id": "627be0cb7b06df184d55d77a",
    //         "__v": 0
    //     }
    // }



    // lo que envio en postaman  POST:
    // {
    //     "nombre": "prueba xd",
    //     "google": "true",
    //     "campomalo": "true"
    // }
    //lo que recibo de postman: (tener en cuenta que campomalo fue ignorado ya que no sigue el modelo '../models/usuario' )
    // {
    //     "msg": "POST API - controlador",
    //     "usuario": {
    //         "nombre": "prueba xd",
    //         "estado": true,
    //         "google": true,
    //         "_id": "627bdb0d9f008f74526b7375" //ID CREADO POR MONGO
    //     }
    // }



    // res.status(201).json({ //status all ok
    //     ok: true,
    //     msg: 'POST API - controlador',//esto aparecera en postman
    //     nombre,
    //     edad   
    // });


    //Lo que entra a mi servidor desde postman: Body-raw-JSON   
    // {
    //     "nombre": "Alexander Martinez Millan",
    //     "edad": 27
    // }
    //Lo que mi servidor devuelve en postman:
    // {
    //     "ok": true,
    //     "msg": "POST API - controlador",
    //     "nombre": "Alexander Martinez Millan",
    //     "edad": 27
    // }
    
}

const usuariosDelte = async(req, res = response) => {

    const { id } = req.params;

    // const uid = req.uid;

    //Borrar fisicamente: NO HACER DE ESTA MANERA YA QUE SE PUEDE PERDER INTEGRIDAD REFERENCIAL DE OTROS DATOS
    //const usuario = await Usuario.findByIdAndDelete( id );
    //res.json( usuario );

    // http://localhost:8080/api/usuarios/6282d8df0f03aa96554e1f0d        DELETE EN POSTMAN
    // SE ENVIA EL ID 6282d8df0f03aa96554e1f0d  <-- este un id de ejemplo
    // y se comprueba la eliminacion ya sea en la BD o trayendo todo con un GET en postman



    //BORRAR CON ESTADO EN FALSE ( DESACTIVAR EL USUARIO ) MEDIANTE ACTUALIZACION EN LA BD
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    // const usuarioAutenticado = req.usuario;
    // res.json({usuario, usuarioAutenticado});
    res.json(usuario);

    // res.json({ usuario, uid });
    // http://localhost:8080/api/usuarios/6282d8df0f03aa96554e1f0d        DELETE EN POSTMAN
    // SE ENVIA EL ID 6282d8df0f03aa96554e1f0d  <-- este un id de ejemplo
    // y se comprueba la actualizacion ya sea en la BD el estado o trayendo todo con un GET en postman

    //depues de borrar, el total_usuarios_activos deberia haber disminuido





    // res.json({

    //     id
    //     //ok: true,
    //     //msg: 'DELETE API - controlador'//esto aparecera en postman
        
    // });
    
}

const usuariosPatch = (req, res = response) => {

    res.json({

        
        //ok: true,
        // msg: 'PATCH API - controlador'//esto aparecera en postman
        
    });
    
}

module.exports = {

    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelte,
    usuariosPatch
}