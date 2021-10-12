const express = require("express");
const mongoose = require('mongoose');
const fcm = require('../utils/fcm-managment');
const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let Solicitud = require("../models/solicitud");
let Usuario = require("../models/usuario");

//=======================================
//mostrar todos los pedidos por usuario
//=======================================
app.get("/solicitud", (req, res) => {
    let id = req.params.id;
    Solicitud.find()
        .populate('usuario')
        .exec((err, solicitud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                solicitud,
            });
        });
});

//=====================================
//obtener un pedido por id
//=====================================

app.get("/solicitud/id/:id", (req, res) => {
    let id = req.params.id;
    Solicitud.findById(id)
        .populate('usuario')
        .exec((err, solicitudDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!solicitudDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                solicitud: solicitudDB,
            });
        });
});

//=====================================
//crear un nuevo pedido
//=====================================

app.post("/solicitud", (req, res) => {
    let body = req.body;
    let solicitud = new Solicitud({
        fecha: Date.now(),
        subtotal: body.subtotal,
        iva: body.iva,
        total: body.total,
        usuario: body.usuario,
    });

    solicitud.save((err, solicitudBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            solicitud: solicitudBD,
        });
    });
});

app.put('/solicitud/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let solicitud = {
        estado: body.status,
        comentario: body.comment
    };

    Solicitud.findByIdAndUpdate(id, solicitud, { new: true, runValidators: true }, (err, solicitudDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.findOne({ _id: solicitudDB.usuario }).exec((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }

            let mensaje = "Su solicitud fue ";

            if (solicitud.estado === 'Aprobado'){
                mensaje = mensaje + solicitud.estado;
            }else{
                mensaje = mensaje + solicitud.estado + " por " + solicitud.comentario;
            }

            fcm.userNotification(usuarioDB.fcm, `Respuesta a Solicitud`, mensaje, { id: solicitudDB._id+"", comentario: mensaje, estado: solicitud.estado});

            res.json({
                ok: true,
                solicitud: solicitudDB,
                usuario: usuarioDB,
            });
        });
    });
});


app.delete('/solicitud/:id/:estado', function(req, res) {
    let id = req.params.id;
    let estado = req.params.estado;

    let cambiaEstado = {
        estado: estado
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Solicitud.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, solicitudBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!solicitudBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Solicitud no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            solicitud: solicitudBorrado
        });
    });
});

module.exports = app;