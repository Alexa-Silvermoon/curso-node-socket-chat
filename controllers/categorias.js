
const { response } = require('express');
const { Categoria } = require('../models');

// tarea
// NOTA: populate sirver para saber quien creo esa categoria

// obtenerCategorias metodo GET - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    // http://localhost:8080/api/categorias/

    // PAGINACION
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }; //estado de categoria activa o no?

    const [total_categorias_activas, categorias] = await Promise.all([ //esperar resolucion de ambas promesas

        Categoria.countDocuments( query ),

        Categoria.find( query )
        .populate('usuario', 'nombre') //referencia del usuario
        .skip( Number(desde) ) //desde que elemento muestra
        .limit( Number(limite) ) //cantidad de datos a mostrar por pagina

    ]);

    res.json({

        total_categorias_activas,
        categorias

    });
    
}


// obtenerCategoria metodo GET  - populate{}
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;
    
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json( categoria );

}


// crear categoria metodo POST
const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    //consulta si ya esxiste una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ){ // si categoria ya existe

        return res.status(400).json({

            msg: `La categoria ${ categoriaDB.nombre } ya existe`

        });

    }

    // generar la data a guardar:
    const data = {

        nombre, //nombre de la categoria
        usuario: req.usuario._id //id de mongo validado por JWT
    }

    const categoria = new Categoria( data );

    //guardar en DB
    await categoria.save();

    res.status(201).json( categoria );

}

//actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; ////lo que NO viene dentro de data se excluye

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // const categoria = await Categoria.findByIdAndUpdate( id, nombre);
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });

    res.json({

        categoria//NOTA, si se esta actulizando en la BD, pero es la respuesta de postman trae los datos anteriores
        
    });
    
}

// borrarCategoria
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;

    //BORRAR CON ESTADO EN FALSE ( DESACTIVAR LA CATEGORIA ) MEDIANTE ACTUALIZACION EN LA BD
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true} );

    res.json(categoria);
    
}

module.exports = {

    obtenerCategorias, //get
    obtenerCategoria, //get 
    crearCategoria, //post
    actualizarCategoria, //put
    borrarCategoria //delete
}

// udemy https://www.udemy.com/course/node-de-cero-a-experto/learn/lecture/24810826#questions