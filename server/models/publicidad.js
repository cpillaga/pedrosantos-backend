const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let publicidadSchema = new Schema({
    img: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Publicidad', publicidadSchema);