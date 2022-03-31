const express = require('express');

let Direccion = require('../models/direccion');

let app = express();

//=====================================
//crear nueva direccion
// //=====================================

app.post('/direccion', (req, res) => {
    let body = req.body;
    let direccion = new Direccion({
        principal: body.principal,
        secundaria: body.secundaria,
        referencia: body.referencia,
        lat: body.lat,
        lng: body.lng,
        usuario: body.usuario
    });

    direccion.save((err, direccionBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!direccionBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            direccion: direccionBD
        });
    });
});

//=====================================
//Lista direccion por usuario
// //=====================================
app.get('/direccion/:id', (req, res) => {
    let id = req.params.id;
    Direccion.findById(id, (err, direccionBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!direccionBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El id no existe en la tabla direccion'
                }
            })
        }
        res.json({
            ok: true,
            direccion: direccionBD
        })
    });
});

module.exports = app;