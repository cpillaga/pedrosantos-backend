const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion de la categoria es necesaria']
    },
    img: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Categoria', categoriaSchema);