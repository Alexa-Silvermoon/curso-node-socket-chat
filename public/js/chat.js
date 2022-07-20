
const url = (window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'heroku.com aqui mi link de heroku';

let usuario = null;
let socket = null;

// Referencias HTML:
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

// Validar el token del LocalStorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || ''; //si no encuentra el token, entonces lo pone como un string vacio

    if ( token.length < 10 ){

        window.location = 'index.html'; // si no encuntra el token, devuelve el usuario a index.html

        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {

        headers: { 'x-token': token}

    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    console.log( userDB, tokenDB );

    localStorage.setItem('token', tokenDB );
    usuario = userDB;

    document.title = usuario.nombre; // a la pestaña de chrome le pone el nombre del usuario

    await conectarSocket();

}

const conectarSocket = async() => {

    socket = io({

        'extraHeaders':{

            'x-token': localStorage.getItem( 'token' )
        }
    });

    socket.on('connect', () => {

        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {

        console.log('Sockets Offline');
    });

    // socket.on('recibir-mensaje', (payload) => { //desde  io.emit('recibir-mensaje', chatMensajes.ultimos10 );
    socket.on('recibir-mensaje', dibujarMensajes ); //desde  io.emit('recibir-mensaje', chatMensajes.ultimos10 );

        // console.log( payload );

        // dibujarMensajes( payload );


    // socket.on('usuarios-activos', ( payload ) => {

    //     console.log( payload );
    // });

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ( payload) => {

        console.log('Privado: ', payload );
        
    });

}

const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';

    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `

            <li>
                <p>

                    <h5 class="text-success"> ${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>

                </p>

            </li>
        `
    });

    ulUsuarios.innerHTML = usersHtml;

    // <h5 class="text-success"> ${ nombre }</h5> nombre aparece en texto verde
    // <span class="fs-6 text-muted">${ uid }</span> id del usuario en texto gris

}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHTML = '';

    mensajes.forEach( ( { nombre, mensaje } ) => {

        mensajesHTML += `

            <li>
                <p>

                    <span class="text-primary"> ${ nombre }: </span>
                    <span>${ mensaje } </span>

                </p>

            </li>
        `
    });

    ulMensajes.innerHTML = mensajesHTML;

    // <h5 class="text-success"> ${ nombre }</h5> nombre aparece en texto verde
    // <span class="fs-6 text-muted">${ uid }</span> id del usuario en texto gris

}

// txtMensaje.addEventListener('keyup', (evento) => {
txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    
    //console.logs( evento ); //keyup es presionar una tecla, en este caso nos interesa la tecla enter y su keyCode es 13

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if ( keyCode !== 13 ){ return; } //para enviar solo funciona presionando enter
    if ( mensaje.length === 0 ){ return; } // no enviar mensajes vacios

    socket.emit('enviar-mensaje',  { mensaje, uid } );
    // se emite hacia socket.on('enviar-mensaje', ({ uid, mensaje }) => {

    txtMensaje.value = '';

});

const main = async() => {

    // Validar JWT
    await validarJWT();

}

main();


// const socket = io();