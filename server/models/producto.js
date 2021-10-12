const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio Unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    unidadMedida: {
        type: String,
        required: [true, 'La unidad de medida es necesaria'],
    },
    subcategoria: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategoria',
        required: true
    },
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, 'La cantidad es necesaria']
    }

});


module.exports = mongoose.model('Producto', productoSchema);