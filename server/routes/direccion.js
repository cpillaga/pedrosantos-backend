const express = require('express');

let Direccion = require('../models/direccion');

let app = express();

//=====================================
//Crear una nueva direccion
// //==================================
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
// //==================================
app.get('/direccion/:usuario', (req, res) => {
    let usuarioB = req.params.usuario;
    Direccion.find({usuario: usuarioB}, (err, direccionBD) => {
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

//=====================================
//Lista direccion por id
// //==================================
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
                    mensaje: 'el id no existe en la tabla direccion'
                }
            })
        }
        res.json({
            ok: true,
            direccion: direccionBD
        })
    });
});

//=====================================
//Listar todas las direcciones
//=====================================
app.get('/direcciones', (req, res) => {
    Direccion.find({})
        .sort('usuario')
        .exec((err, direccion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                direccion
            })
        })
});

module.exports = app;