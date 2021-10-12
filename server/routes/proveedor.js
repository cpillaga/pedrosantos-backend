const express = require('express');
const cors = require('cors');

let Proveedor = require('../models/proveedor');

let app = express();
app.use(cors({ origin: '*' }));

//=====================================
//mostrar todas las categorias
//=====================================

app.get('/proveedor', (req, res) => {
    Proveedor.find({})
        .sort('razonSoc')
        .exec((err, proveedor) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                proveedor
            })
        })
});

//=====================================
//mostrar una categoria por id.
//=====================================

app.get('/proveedor/:id', (req, res) => {
    let id = req.params.id;
    Proveedor.findById(id, (err, proveedorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!proveedorDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla proveedor'
                }
            })
        }
        res.json({
            ok: true,
            proveedor: proveedorDB
        })
    });
});

//=====================================
//crear nueva categoria
//=====================================

app.post('/proveedor', (req, res) => {
    let body = req.body;

    let proveedor = new Proveedor({
        ruc: body.ruc,
        razonSoc: body.razonSoc,
        telefono: body.telefono,
        direccion: body.direccion,
        correo: body.correo,
        representante: body.representante,
        ciudad: body.ciudad,
    });

    proveedor.save((err, proveedorBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!proveedorBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            proveedor: proveedorBD
        });
    });
});

//=====================================
//actualizar nueva categoria
//=====================================

app.put('/proveedor/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProveedor = {
        ruc: body.ruc,
        razonSoc: body.razonSoc,
        telefono: body.telefono,
        direccion: body.direccion,
        correo: body.correo,
        representante: body.representante,
        ciudad: body.ciudad,
    };

    Proveedor.findByIdAndUpdate(id, descProveedor, {
        new: true,
        runValidators: true
    }, (err, proveedorBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!proveedorBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            proveedor: proveedorBD
        });
    });

});

//=====================================
//eliminar nueva proveedor
//=====================================

app.delete('/proveedor/:id', (req, res) => {
    let id = req.params.id;

    Proveedor.findByIdAndRemove(id, (err, proveedorBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!proveedorBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        };
        res.json({
            ok: true,
            mensaje: 'proveedor borrada'
        });
    });
});

//=====================================
//Filtrar una proveedor
//=====================================

app.get('/proveedor/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Proveedor.find({
            razonSoc: regex
        })
        .sort('razonSoc')
        .exec((err, proveedor) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                proveedor
            });
        });
});

module.exports = app;