const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let solicitudSchema = new Schema({
    fecha: {
        type: Date,
        required: true,
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es necesario']
    },
    iva: {
        type: Number,
        required: [true, 'El iva es necesario']
    },
    total: {
        type: Number,
        required: [true, 'El total es necesario']
    },
    estado: {
        type: String,
        default: 'Pendiente',
    },
    comentario: {
        type: String,
        default: ''
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

module.exports = mongoose.model('Solicitud', solicitudSchema);