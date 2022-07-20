
const { response } = require('express');
const { body } = require('express-validator');
const { Producto } = require('../models');

// obtenerProductos metodo GET - paginado - total - populate
const obtenerProductos = async(req = request, res = response) => {

    // http://localhost:8080/api/productos/

    // PAGINACION
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }; //estado del producto activo o no?

    const [total_productos_activos, productos] = await Promise.all([ //esperar resolucion de ambas promesas

        Producto.countDocuments( query ),

        Producto.find( query )
        .populate('categoria', 'nombre') //referencia de la categoria
        .skip( Number(desde) ) //desde que elemento muestra
        .limit( Number(limite) ) //cantidad de datos a mostrar por pagina

    ]);

    res.json({

        total_productos_activos,
        productos

    });
    
}

// obtenerProducto metodo GET  - populate{}
const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;
    
    const producto = await Producto.findById( id ).populate('categoria', 'nombre');

    res.json( producto );

}

// crear producto metodo POST
const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body //estado y usuario son ignorados
    const nombre = req.body.nombre; //extrae el nombre del body pero sin extraerlo del const data

    //consulta si ya esxiste un producto con ese nombre
    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ){ // si producto ya existe

        return res.status(400).json({

            msg: `El producto ${ productoDB.nombre } ya existe`

        });

    }

    // generar la data a guardar:
    const data = {

        ...body,
        nombre: body.nombre.toUpperCase(), //nombre del producto
        usuario: req.usuario._id //id de mongo validado por JWT
    }

    const producto = new Producto( data );

    //guardar en DB
    await producto.save();

    res.status(201).json( producto );

}

//actualizarProducto
const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; ////lo que NO viene dentro de data se excluye

    if ( data.nombre ){

        data.nombre = data.nombre.toUpperCase();
    }

    data.precio = data.precio;
    data.categoria = data.categoria;
    // data.categoria = req.categoria._id;
    data.descripcion = data.descripcion;
    data.disponible = data.disponible;
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });

    res.json({

        producto//NOTA, si se esta actulizando en la BD, pero es la respuesta de postman trae los datos anteriores
        
    });
    
}

// borrarProducto
const borrarProducto = async(req, res = response) => {

    const { id } = req.params;

    //BORRAR CON ESTADO EN FALSE ( DESACTIVAR EL PRODUCTO ) MEDIANTE ACTUALIZACION EN LA BD
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true} );

    res.json(productoBorrado);
    
}


module.exports = {

    crearProducto, //post
    obtenerProductos, // GET
    obtenerProducto, //GET
    actualizarProducto, //PUT
    borrarProducto //DELETE
}