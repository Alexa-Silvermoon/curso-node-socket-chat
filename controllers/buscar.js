
const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

// cada una de estas colecciones sera un endpoint en postman
const coleccionesPermitidasEnBD = [

    'usuarios',
    'categorias',
    'productos',
    'producto-por-categoria',
    'roles'
];

// buscar ya sea por nombre de usuario o id valido de mongo
// http://localhost:8080/api/buscar/usuarios/62824b63abb717265fa6af99
const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //TRUE or FALSE

    // buscar solo por mongoID:
    if ( esMongoID ){

        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario )? [ usuario ] : [] //ternario
            // si no encuentra al usuario, me devuelve un array vacio
        });
    }

    // expresion regular, ya vienen de por si en javascript, no hay que importar nada
    // i = insensible a las busquedas por nombre
    // entonces regex me da flexibilidad a la hora de hacer busquedas por nombre
    const regex = new RegExp( termino, 'i' );

    // buscar solo por nombre:
    // const usuarios = await Usuario.find({ nombre: regex });

    // buscar por nombre o por correo:
    // http://localhost:8080/api/buscar/usuarios/prueba
    // http://localhost:8080/api/buscar/usuarios/@test
    const usuarios = await Usuario.find({ // const usuarios = await Usuario.count({ //para contar usuarios activos

        // operador $or para buscar flexiblemente por nombre or correo:
        $or: [{ nombre: regex }, { correo: regex }],

        // operador $and para que ambas busquedas solo muestren usuarios activos, es decir en true
        $and: [{ estado: true }]

    });

    res.json({
        results: usuarios
    });

}

// buscar ya sea por nombre de categoria o id valido de mongo
// http://localhost:8080/api/buscar/categorias/629fe395e1e648a5ebd1187e
const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //TRUE or FALSE

    // buscar solo por mongoID:
    if ( esMongoID ){

        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria )? [ categoria ] : [] //ternario
            // si no encuentra a la categoria, me devuelve un array vacio
        });
    }

    // expresion regular, ya vienen de por si en javascript, no hay que importar nada
    // i = insensible a las busquedas por nombre de la categoria
    // entonces regex me da flexibilidad a la hora de hacer busquedas por nombre de la categoria
    const regex = new RegExp( termino, 'i' );

    // buscar solo por nombre de la categoria:
    // const categorias = await Categoria.find({ nombre: regex });

    // buscar por nombre de la categoria:
    // http://localhost:8080/api/buscar/categorias/galletas
    const categorias = await Categoria.find({ // const categorias= await Categoria.count({ //para contar categorias activas

        // operador $or para buscar flexiblemente por nombre de la categoria:
        $or: [{ nombre: regex }],

        // operador $and para que ambas busquedas solo muestren categorias activas, es decir en true
        $and: [{ estado: true }]

    });

    res.json({
        results: categorias
    });

}

// buscar ya sea por nombre del producto o id valido de mongo
// http://localhost:8080/api/buscar/productos/62a2652812d174109d16d861
const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //TRUE or FALSE

    // buscar solo por mongoID:
    if ( esMongoID ){

        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json({
            results: ( producto )? [ producto ] : [] //ternario
            // si no encuentra el producto, me devuelve un array vacio
        });
    }

    // expresion regular, ya vienen de por si en javascript, no hay que importar nada
    // i = insensible a las busquedas por nombre del producto
    // entonces regex me da flexibilidad a la hora de hacer busquedas por nombre del producto
    const regex = new RegExp( termino, 'i' );

    // buscar solo por nombre del producto:
    // const productos = await Producto.find({ nombre: regex });

    // buscar por nombre del producto:
    // http://localhost:8080/api/buscar/productos/leche alqueria
    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');
    // const productos= await Producto.count({ //para contar los productos activas
    // populate() me permitira ver en postman la categoria de ese producto

    res.json({
        results: productos
    });

}

// buscar producto por nombre de la categoria
// http://localhost:8080/api/buscar/producto-por-categoria/golosinas
const buscarProductoPorCategoria = async( termino = '', res = response) => {

    try{

        const esMongoID = ObjectId.isValid( termino );
    
        if ( esMongoID ) {
            
            const producto = await Producto.find( { categoria: ObjectId( termino ), estado: true})
            .select('nombre precio descripcion disponible estado')
            .populate('categoria', 'nombre');
    
            return res.json( {
                results: ( producto ) ? [ producto ] : []
            });
        }
    
        const regex = new RegExp( termino, 'i' );
    
        const categorias = await Categoria.find({ nombre: regex, estado: true});

        if ( !categorias.length ){

            return res.status(400).json({

                msg: `No hay resultados para ${ termino }`

            });
        }
        
        const productos = await Producto.find({

            $or: [...categorias.map( categoria => ({

                categoria: categoria._id

            }))],

            $and: [{ estado: true }]

        }).populate('categoria', 'nombre');

        res.json({
            results: productos
        });

        
    } catch ( error ){

        res.status(400).json( error );

    }
 
}

const buscar = (req, res = response ) => {

    // http://localhost:8080/api/buscar/productos/LECHE ALQUERIA
    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidasEnBD.includes( coleccion ) ){ //si NO incluye, la negacion !

        return res.status(400).json({
            msg: `Las colecciones permitidas son ${ coleccionesPermitidasEnBD }, la coleccion ${ coleccion } no existe`
        });

    }
    
    // cada una de estos case sera un endpoint en postman
    switch ( coleccion ) {

        case 'usuarios':
            buscarUsuarios( termino, res );

        break;

        case 'categorias':
            buscarCategorias( termino, res );

        break;

        case 'productos':
            buscarProductos( termino, res );

        break;

        case 'producto-por-categoria':
            buscarProductoPorCategoria( termino, res );

        break;

        // case 'roles':

        // break;

        default:
            res.status(500).json({
                msg: 'Error servidor al buscar la coleccion'
            });
    }

    // res.json({
    //     // msg: 'Buscar...'
    //     coleccion, termino
    // });
}

module.exports = {

    buscar
}