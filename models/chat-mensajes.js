
class Mensaje {

    constructor( uid, nombre, mensaje ){

        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;

    }
}

class MensajePrivado {

    constructor(uid, mensaje, nombre, uidDestinatario, destinatario) {
        this.uid = uid;
        this.mensaje = mensaje;
        this.nombre = nombre;
        this.uidDestinatario = uidDestinatario;
        this.destinatario = destinatario;
    }

}

class ChatMensajes {

    constructor(){

        this.mensajes = [];
        this.usuarios = {};
        this.mensajesPrivados = [];

    }

    get ultimos10(){

        this.mensajes = this.mensajes.splice(0,10) // muestra de la posicion 0 al 10
        return this.mensajes;

    }

    get usuariosArr(){

        return Object.values( this.usuarios ); // de esta forma mis usuarios se nos retorna como un arreglo

    }

    misMensajesPrivados(uid = '') {
        let msgs = this.mensajesPrivados;

        let mensajePrivadísimo = msgs.find((msg) => msg.uidDestinatario === uid);

        return mensajePrivadísimo;
    }

    enviarMensaje( uid, nombre, mensaje ){

        this.mensajes.unshift(

            new Mensaje( uid, nombre, mensaje )

        );
    }

    enviarMensajePrivado(uid, nombre, mensaje, uidDestinatario, destinatario) {
        this.mensajesPrivados.unshift(
            new MensajePrivado(uid, nombre, mensaje, uidDestinatario, destinatario)
        );
    }

    conectarUsuario( usuario ){

        this.usuarios[ usuario.id ] = usuario;
    }

    desconectarUsuario( id ){

        delete this.usuarios[ id ];
    }

}

module.exports = ChatMensajes;