const path = require('path'); // path ya es algo incluido en node
const fs = require('fs'); //file system es algo propio de node

const cloudinary = require('cloudinary').v2; // subir imagenes a cloudinary
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
// const { subirArchivo } = require("../helpers/subir-archivo");
const { subirArchivo } = require("../helpers");
// const path = require('path'); // esto es propio de node
// const { v4: uuidv4 } = require('uuid');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {
    
    // let sampleFile;
    // let uploadPath;

    // // si no hay archivos o al menos una propiedad, mostrar error msg, esto esta en validar-archivo.js
    // if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // archivo es como viene desde form-data en postman
        
    //     res.status(400).json({ msg: 'No hay archivos para subir'});

    //     return;
    // }

    // if ( !req.files.archivo ) { // archivo es como viene desde form-data en postman
    //     res.status(400).json({ msg: 'No hay archivos para subir'});
    //     return;
    // }

    // console.log('req.files >>>', req.files); // eslint-disable-line

    try {

        // const nombre = await subirArchivo( req.files, [ 'txt', 'md' ], 'textos' ); //para subir .txt o .md
        const nombre = await subirArchivo( req.files, undefined, 'imgs' ); //para subir imagenes

        res.json({ nombre }); //muestra el nombre nuevo del archivo, pero al usuario podria no interesarle eso
        
    } catch (msg) {

        res.status(400).json({ msg });
        
    }

    // console.log(req.files);
    // res.json({
    //     msg: 'hola cargarArchivo desde controllers uploads.js'
    // });

}

// actualizar la imagen del usuario o del producto, las imagenes se guardan en la carpeta uploads
const actualizarImagen = async( req, res = response ) => {

    // // si no hay archivos o al menos una propiedad, mostrar error msg, esto esta en validar-archivo.js
    // if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // archivo es como viene desde form-data en postman
        
    //     res.status(400).json({ msg: 'No hay archivos para subir'});

    //     return;
    // }

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ){

                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){

                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({ msg: 'Error del servidor al actualizar imagen'});

    }

    // limpiar imagenes previas en carpeta uploads
    if ( modelo.img ){

        // hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img ); //esta es una ruta

        // si el archivo existe
        if ( fs.existsSync( pathImagen ) ){ //si existe es true

            //si existe la imagen entonces borra la imagen anterior y solo deja la nueva:
            fs.unlinkSync( pathImagen );

        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );

}

const actualizarImagenCloudinary = async( req, res = response ) => {

    // // si no hay archivos o al menos una propiedad, mostrar error msg, esto esta en validar-archivo.js
    // if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // archivo es como viene desde form-data en postman
        
    //     res.status(400).json({ msg: 'No hay archivos para subir'});

    //     return;
    // }

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ){

                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){

                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({ msg: 'Error del servidor al actualizar imagen'});

    }

    // limpiar imagenes previas en carpeta uploads o bien en cloudinary
    if ( modelo.img ){

        // "img": "https://res.cloudinary.com/alexa-silvermoon/image/upload/v1655986193/ghqndrangqr6revnepc8.png"
        const nombreArr = modelo.img.split('/');

        const nombre = nombreArr[ nombreArr.length - 1 ];
        // tomando solo el nombre de la imagen con su extension ej: ghqndrangqr6revnepc8.png"

        const [ public_id ] = nombre.split('.');
        // console.log( public_id ); //este es el id de la imagen anterior que teniamos en cloudinary

        cloudinary.uploader.destroy( public_id );// borrar la imagen anterior en clodinary

    }

    // actualizar la imagen en cloudinary:
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}

const mostrarImagen = async( req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ){

                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){

                return res.status(400).json({

                    msg: `No existe un producto con el id ${ id }`
                });
            }
            
        break;
    
        default:
            return res.status(500).json({ msg: 'Error del servidor al actualizar imagen'});

    }

    if ( modelo.img ){

        // borrar la imagen del servidor:
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        if( fs.existsSync( pathImagen ) ){
            
            return res.sendFile( pathImagen ); //mostrar no-image en postman

        }
    }

    // en caso de no exister el modelo.img mostrar la imagen no-image.jpg
    const pathImagen = path.join( __dirname, '../assets', 'no-image.jpg' );
    return res.sendFile( pathImagen ); //mostrar no-image en postman

    // res.json({ mag: 'falta placeholder - mostrarImagen'}); //el producto no tiene imagen

}

module.exports = {

    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}