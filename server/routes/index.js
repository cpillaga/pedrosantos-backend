const express = require('express');

const cors = require('cors');
const app = express();
app.use(cors({ origin: '*' }));

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./subcategoria'));
app.use(require('./producto'));
app.use(require('./carrito'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./publicidad'));
app.use(require('./pedido'));
app.use(require('./pedido-detalle'));
app.use(require('./proveedor'));
app.use(require('./imagesAdd'));
app.use(require('./solicitud'));
app.use(require('./detalleSolicitud'));

module.exports = app;