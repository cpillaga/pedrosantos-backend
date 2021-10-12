const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let detalleSolicitudSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria'],
    },
    solicitud: {
        type: Schema.Types.ObjectId,
        ref: 'Solicitud',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es necesario']
    },
});

module.exports = mongoose.model('DetalleSolicitud', detalleSolicitudSchema);