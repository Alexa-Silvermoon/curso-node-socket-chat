const { response } = require("express")

const validarArchivoSubir = (req, res = response, next) => {

    // si no hay archivos o al menos una propiedad, mostrar error msg
    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // archivo es como viene desde form-data en postman
        
        res.status(400).json({ msg: 'No hay archivos para subir - validarArchivoSubir'});

        return;
    }

    next();

}

module.exports = {

    validarArchivoSubir
}