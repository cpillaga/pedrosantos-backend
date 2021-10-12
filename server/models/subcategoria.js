const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let subCategoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion de la subCategoria es necesaria']
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
});

module.exports = mongoose.model('SubCategoria', subCategoriaSchema);