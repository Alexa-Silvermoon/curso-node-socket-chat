
const express = require('express');// servidor express
const cors = require('cors'); //autoriza o no paginas web que entren a mi server
const fileUpload  = require('express-fileupload'); // carga de archivos
const { createServer } = require('http');
const { dbConnection } = require('../database/config.js');
const { socketController } = require('../sockets/controller.js');

class Server {

    constructor(){

        this.app    = express();
        this.port   = process.env.PORT; //desde app.js require('dotenv').config();// trae los del archivo .env
        // this.server = require('http').createServer( this.app );
        this.server = createServer( this.app );
        this.io     = require('socket.io')( this.server );

        this.paths = {

            auth:        '/api/auth',
            buscar:      '/api/buscar',
            categorias:  '/api/categorias',
            productos:   '/api/productos',
            usuarios:    '/api/usuarios',
            uploads:     '/api/uploads' //cargar archivos
        }

        // this.usuariosPath = '/api/usuarios';
        // this.authPath     = '/api/auth';

        // Conectar a Base de Datos
        this.conectarDB();

        // Middlewares es una funcion que se ejecuta cada vez que levantamos el servidor
        this.middlewares();

        // Rutas de mi App
        this.routes();

        // sockets
        this.sockets();

    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares(){ //funcion que se ejecuta antes de llamar a un controlador o seguir con ejecucion de peticiones

        // CORS
        this.app.use( cors());

        // Lectura y Parseo del body
        this.app.use( express.json() );

        // Directorio Publico
        this.app.use( express.static('public') );//.use me ayuda a saber de se trata de un middleware
        //apuntando a la carpeta publica, es decir al index.html

        //FileUplad - carga de archivos
        this.app.use( fileUpload({

            useTempFiles : true, //archivos temporales
            tempFileDir : '/tmp/',
            createParentPath: true //crear carpetas segun se necesite

        }));

    }

    routes(){

        this.app.use( this.paths.auth, require('../routes/auth.js'));
        this.app.use( this.paths.buscar, require('../routes/buscar.js'));
        this.app.use( this.paths.categorias, require('../routes/categorias.js'));
        this.app.use( this.paths.productos, require('../routes/productos.js'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios.js'));
        this.app.use( this.paths.uploads, require('../routes/uploads.js'));

    }

    sockets(){

        this.io.on( 'connection', ( socket ) =>  socketController( socket, this.io ) );
        
    }

    listen(){

        this.server.listen(this.port, () => {

            console.log('Servidor corriendo en el puerto', this.port);

        });

    }
    
}

module.exports = Server;
