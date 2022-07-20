
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID ); //desde .env

async function googleVerify( token = '' ) {
    
    const ticket = await client.verifyIdToken({
        
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    
    });
    
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log( payload );
    // payload es SUPER IMPORTANTE ya que me trae la informacion de la cuenta google que esta haciendo sign in

    const { name, picture, email } = ticket.getPayload();

    return {
        
        nombre: name,
        img: picture,
        correo: email
        // payload
    }

}
// verify().catch(console.error);

module.exports = {

    googleVerify
}

// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token