
// LOGIN MANUAL
const miFormulario = document.querySelector('form');
miFormulario.addEventListener('submit', ev => {

    ev.preventDefault(); //previene refrescar el navegador

    const formData = {};
    
    // leer cada uno de los elementos del formulario en public > js > index.html
    for ( let elemento of miFormulario.elements ){

        if ( elemento.name.length > 0 ){ //el boton no tiene name entonces se ignora con esta condicion

            formData[ elemento.name ] = elemento.value

        }
    }

    console.log( formData ); //correo y password

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {'Content-Type':'application/json'}

    })
    .then( resp => resp.json() )
    // .then( data => {
    .then( ({ msg, token }) => {

        // console.log( data );
        if ( msg ){

            return console.error( msg );
        }

        localStorage.setItem('token', token );

        window.location = 'chat.html'; //si el log in se hizo bien, redirigir a chat.html

    })
    .catch( err => {
        console.log( err );
    });

});


// LOGIN CON GOOGLE ( para usar con el socket chat)
function handleCredentialResponse(response) { //solo funciona como una function tradicional

    // Google Token: ID_TOKEN
    // console.log('id_token', response.credential);

    const body = {id_token: response.credential };

    // fetch por defecto hacer la peticion como get, entonces debemos transformarla a post
    // fetch('http://localhost:8080/api/auth/google', {
    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        console.log( token ); //token
        localStorage.setItem('token',  token);

        // localStorage.setItem('email', resp.usuario.correo );
        // localStorage.setItem('resp', resp); // token
        //guarda nuestro correo, util para luego sign out

        window.location = 'chat.html'; //si el log in se hizo bien, redirigir a chat.html

    })
    .catch( console.warn() );

}

const button = document.getElementById('google_signout');

button.onclick = () => {

    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();

    // google.accounts.id.revoke( localStorage.getItem('email'), done => {
    google.accounts.id.revoke( localStorage.getItem('token'), done => {

        localStorage.clear(); //limpia el local storage, es decir elimina el correo ahi almacenado
        location.reload(); // recarga la pagina

    });
}

/*
// LOGIN CON GOOGLE ( el siguiente login de google, es basico, no es el socket chat)
function handleCredentialResponse(response) { //solo funciona como una function tradicional

    // Google Token: ID_TOKEN
    // console.log('id_token', response.credential);

    const body = {id_token: response.credential };

    // fetch por defecto hacer la peticion como get, entonces debemos transformarla a post
    // fetch('http://localhost:8080/api/auth/google', {
    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( r => r.json() )
    .then( resp => {
        console.log(resp); //token
        localStorage.setItem('email', resp.usuario.correo );
        // localStorage.setItem('resp', resp); // token
        //guarda nuestro correo, util para luego sign out

        window.location = 'chat.html'; //si el log in se hizo bien, redirigir a chat.html

    })
    .catch( console.warn() );

}

*/