
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    nombre:{

        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true

    },

    precio:{

        type: Number,
        default: 0, //no se obliga a dar un precio especifico al momento de ingresar el producto

    },

    categoria:{ //para grabar un producto, tambien se debe saber a que categoria se asignara

        type: Schema.Types.ObjectId,
        ref: 'Categoria', //Categoria con mayusculas tal cual como el modelo de categoria.js
        required: true
    },

    descripcion:{ type: String }, //detalles del producto

    disponible:{ type: Boolean, default: true }, // disponibilidad del producto
    //NOTA: que la disponiblidad sea 0 NO significa que el producto este eliminado,
    // solo significa que estamos sin stock

    estado:{ // para saber si el producto esta eliminado o no de la BD

        type: Boolean,
        default: true,
        required: true
    },

    img:{ type: String},

    usuario:{ //para grabar un producto, tambien se debe saber que usuario mando a guardarlo

        type: Schema.Types.ObjectId,
        ref: 'Usuario', //Usuario con mayusculas tal cual como el modelo de usuario.js
        required: true //DEBE venir ese usuario

    }

});

ProductoSchema.methods.toJSON = function() { //debe ser una funcion normal ya que usaremos objeto this adentro
    //el this hace referencia a la instancia creada

    const { __v, estado, ...data } = this.toObject();

    return data;

}

module.exports = model('Producto', ProductoSchema);
