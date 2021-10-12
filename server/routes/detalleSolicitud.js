const express = require("express");
const mongoose = require('mongoose');

const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let DetalleSolicitud = require("../models/detalleSolicitud");

//=======================================
//mostrar todos los detalles de un pedido
//=======================================
app.get("/detalleSolicitud/:id", (req, res) => {
    let id = req.params.id;

    DetalleSolicitud.find({ solicitud: id })
        .populate({
            path: 'producto',
            populate: {
                path: 'categoria'
            }
        })
        .populate('solicitud')
        .exec((err, detalleSolicitud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                detalleSolicitud,
            });
        });
});


//=====================================
//crear un nuevo pedido detalle
//=====================================
app.post("/detalleSolicitud", (req, res) => {
    let body = req.body;
    let detalleSolicitud = new DetalleSolicitud({
        cantidad: body.cantidad,
        producto: body.producto,
        subtotal: body.subtotal,
        solicitud: body.solicitud,
    });

    detalleSolicitud.save((err, detalleSolicitudBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            detalleSolicitud: detalleSolicitudBD,
        });
    });
});

module.exports = app;