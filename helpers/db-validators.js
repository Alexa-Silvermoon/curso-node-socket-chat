
const Role = require('../models/role');
const Usuario  = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRoleValido = async( rol = '' ) => {

    const existeRol = await Role.findOne({ rol });

    if (!existeRol){ //si NO existe rol

        throw new Error(`El rol ${ rol } no esta registrado en la BD`);

    }

}

const emailExiste = async( correo = '') => {

    // Verificar si correo existe
    const existeEmail = await Usuario.findOne({correo});

    if (existeEmail){

        throw new Error(`El correo ${ correo }, ya estaba registrado`);

    }

}

const existeUsuarioPorId = async( id = '') => {

    // Verificar si id existe
    const existeUsuario = await Usuario.findById( id );

    if (!existeUsuario){

        throw new Error(`El id ${ id } de ese usuario no existe`);

    }

}

// aqui el existeCategoria
const existeCategoriaPorId = async( id = '') => {

    // Verificar si id existe
    const existeCategoria = await Categoria.findById( id );

    if (!existeCategoria){

        throw new Error(`El id ${ id } de esa categoria no existe`);

    }

}

const existeProductoPorId = async( id = '') => {

    // Verificar si id existe
    const existeProducto = await Producto.findById( id );

    if (!existeProducto){

        throw new Error(`El id ${ id } de ese producto no existe`);

    }

}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if ( !incluida ){

        throw new Error(`La coleccion ${coleccion} no es permitida, las permitidas son: ${colecciones}`);
    }

    return true; //todas deberian returnar true, pero de igual asi funciona xD
}

module.exports = {

    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas

}