const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes, Usuario } = require('../models');
const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => { //mala practica, io para emitir algo a todos

    // console.log('cliente conectado', socket.id );
    // console.log( socket.handshake.headers['x-token'] ); //recibo el token cuando el cliente se conecta
    // console.log( socket ); muestra mucha informacion sobre el socket( el cliente )

    const token = socket.handshake.headers['x-token']; // cada vez que el cliente se conecta, se verifica el token
    const usuario = await comprobarJWT( token );

    if ( !usuario ){

        return socket.disconnect(); //desconecta a la fuerza el usuario que no paso las pruebas de validacion
    }

    // console.log('Se conecto ', usuario.nombre );

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    socket.emit('recibir-mensaje', chatMensajes.ultimos10 );

    // Conectar a una sala especial
    socket.join( usuario.id ); // hay 3 salas: global, socket.id usuario.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {

        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr);

    });

    socket.emit('nombre-propio', usuario.nombre);

    // socket.on('enviar-mensaje', ( payload ) => {
    socket.on('enviar-mensaje', async({ uid = null , mensaje = null }) => {

        if ( uid ){ //si viene un uid entonces es un mensaje privado

            //mensaje privado en consola
            // socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje } );

            // mensaje privado en html
            // Nombre del destinatario
            const { nombre: para } = await Usuario.findById(uid);

            chatMensajes.enviarMensajePrivado(usuario.id, usuario.nombre, mensaje, uid, para);
            socket.to(uid).emit('mensaje-privado', chatMensajes.misMensajesPrivados(uid));
            socket.emit('mensaje-privado', chatMensajes.misMensajesPrivados(uid));
            

        } else {

            // mensaje publico global
            chatMensajes.enviarMensaje( usuario.id,  usuario.nombre,  mensaje );
            io.emit('recibir-mensaje', chatMensajes.ultimos10 ); // hacia socket.on('recibir-mensaje', (payload) => {
        
        }

    });

}

module.exports = {

    socketController
}