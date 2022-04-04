const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let pedidoSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  subtotal: {
    type: Number,
    required: [true, "El subtotal es necesario"],
  },
  iva: {
    type: Number,
    required: [true, "El iva es necesario"],
  },
  total: {
    type: Number,
    required: [true, "El total es necesario"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  delivery: {
    type: Boolean,
    default: false,
  },
  lat:{
    type:Number,
  },
  lng:{
    type:Number,
  },
  priceDelivery:{
    type:Number,
  }
});

module.exports = mongoose.model("Pedido", pedidoSchema);

