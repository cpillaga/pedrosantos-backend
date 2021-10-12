const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let imagenAddSchema = new Schema({
    url: {
        type: String,
        required: [true, 'la url es necesaria']
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }
});

module.exports = mongoose.model('ImagenAdd', imagenAddSchema);