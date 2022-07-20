const path = require('path'); // esto es propio de node
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ], carpeta = '' ) => {
    //si NO le mando una extension valida, por defecto sera alguna de las extensiones de arriba

    return new Promise( (resolve, reject) => {

        // const { archivo } = req.files; //viene del file que subimos en postman
        const { archivo } = files; //viene del file que subimos en postman

        const nombreCortado = archivo.name.split('.'); //cortar la extension del nombre del archivo
        // console.log(nombreCortado); // output: [ 'nombredelarchivo', 'jpg' ]
        const extension = nombreCortado[ nombreCortado.length - 1 ]; //ultimo elemento del array es la extension
        // console.log(extension);

        // VALIDAR LA EXTENSION:
        // const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        if ( !extensionesValidas.includes( extension ) ){ //si NO incluye la extension entonces:

            return reject(`La extension ${ extension } no es permitida, las extensiones permitidas son ${ extensionesValidas }`);

        }
        
        //res.json({ extension });

        const nombreTemp = uuidv4() + '.' + extension; // concatenacion, cambio del nombre de archivo

        //GUARDAR ARCHIVO EN CARPETA uploads:
        // const uploadPath = path.join( __dirname, '../uploads/', archivo.name );
        // ese name, es el name desde console.log en archivo

        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );
        // __dirname es el directorio donde estoy actualmente, en este caso helpers
        archivo.mv( uploadPath, (err) => {

            if (err) {
                
                // return res.status(500).json({err});
                reject( err );
            }

            // res.json({ msg: 'Archivo subido a ' + uploadPath });
            // resolve( uploadPath ); //toda la ruta la muestra al usuario, pero podria no interesarle eso
            resolve( nombreTemp ); // al usuario solo se le mostrara el nombre del archivo

        });

    });

}

module.exports = {

    subirArchivo
}