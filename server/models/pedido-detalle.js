const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let pedidoDetalleSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria'],
    },
    pedido: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
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

module.exports = mongoose.model('PedidoDetalle', pedidoDetalleSchema);