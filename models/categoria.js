
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre:{

        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true

    },

    estado:{

        type: Boolean,
        default: true,
        required: true
    },

    usuario:{ //para grabar una categoria, tambien se debe saber que usuario mando a guardarla

        type: Schema.Types.ObjectId,
        ref: 'Usuario', //Usuario con mayusculas tal cual como el modelo de usuario.js
        required: true

    }

});

CategoriaSchema.methods.toJSON = function() { //debe ser una funcion normal ya que usaremos objeto this adentro
    //el this hace referencia a la instancia creada

    const { __v, estado, ...data } = this.toObject(); // __v y password se almacenara en usuario
    // __v = version     ,     ... = operador rest

    // data.uid = _id; // modificacion visual de _id a uid y asi se vera en  postman

    return data;

}

module.exports = model('Categoria', CategoriaSchema);
