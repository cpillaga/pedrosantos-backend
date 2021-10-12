const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es necesario'],
    },
    correo: {
        type: String,
        required: [true, 'El correo del usuario es necesario'],
        unique: true,
    },
    password: {
        type: String,
        required: false
    },
    tipo: {
        type: String,
        default: 'CLIENTE'
    },
    facebook: {
        type: Boolean,
        default: false,
    },
    fcm: [{
        type: String
    }]
});

// usuarioSchema.methods.toJSON = function() {
//     let user = this;
//     let userObject = user.toObject();
//     delete userObject.password;
//     return userObject;
// }

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});
module.exports = mongoose.model('Usuario', usuarioSchema);