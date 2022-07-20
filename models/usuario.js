const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{

        type: String,
        required: [true, 'El nombre es obligatorio']

    },
    correo:{

        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true

    },
    password:{

        type: String,
        required: [true, 'La contraseña es obligatorio']

    },
    img:{

        type: String,
        // imagen no es obligatoria (no required)

    },
    rol:{

        type: String,
        required: true,
        // default: 'USER_ROLE', //importante al momento crear usuario usando google
        emun: ['ADMIN_ROLE', 'USER_ROLE']

    },
    estado:{

        type: Boolean,
        default: true //justo despues de crear el usuario, quedara activo

    },
    google:{

        type: Boolean,
        default: false //usuario creado por google???

    },

});

UsuarioSchema.methods.toJSON = function() { //debe ser una funcion normal ya que usaremos objeto this adentro
    //el this hace referencia a la instancia creada

    const { __v, password, _id, ...usuario } = this.toObject(); // __v y password se almacenara en usuario
    // __v = version     ,     ... = operador rest

    usuario.uid = _id; // modificacion visual de _id a uid y asi se vera en  postman

    // la version esta en la respuesta de postman

    return usuario;

    //gracias a eso, postman no mostrara ni la version ni la contraseña, pero lo contraseña si quedara
    //almacenada en la BD de mongo

}

module.exports = model( 'Usuario', UsuarioSchema );
