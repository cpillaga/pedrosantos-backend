const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let proveedorSchema = new Schema({
    ruc: {
        type: String,
        unique: true,
        required: [true, 'El ruc del proveedor es necesaria']
    },
    razonSoc: {
        type: String,
        required: [true, 'el razonSoc de la proveedor es necesaria']
    },
    telefono: {
        type: String,
        required: [true, 'el telefono de la proveedor es necesaria']
    },
    direccion: {
        type: String,
        required: [true, 'la direccion de la proveedor es necesaria']
    },
    correo: {
        type: String,
        required: [true, 'El correo del proveedor es necesaria']
    },
    representante: {
        type: String,
        required: [true, 'el representante es necesaria']
    },
    ciudad: {
        type: String,
        required: [true, 'la ciudad del proveedor es necesaria']
    }
});

module.exports = mongoose.model('Proveedor', proveedorSchema);