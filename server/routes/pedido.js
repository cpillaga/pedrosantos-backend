const express = require("express");
const mongoose = require('mongoose');

const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let Pedido = require("../models/pedido");

//=======================================
//mostrar todos los pedidos por usuario
//=======================================

app.get("/pedidos-usuario/:id", (req, res) => {
    let id = req.params.id;
    Pedido.find({
            usuario: id
        })
        .populate('usuario')
        .exec((err, pedidos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                pedidos,
            });
        });
});

//=====================================
//obtener un pedido por id
//=====================================

app.get("/pedidos/:id", (req, res) => {
    let id = req.params.id;
    Pedido.findById(id)
        .populate('usuario')
        .exec((err, pedidoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!pedidoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                pedido: pedidoDB,
            });
        });
});

//=====================================
//crear un nuevo pedido
//=====================================

app.post("/pedidos", (req, res) => {
    let body = req.body;
    let pedido = new Pedido({
        fecha: Date.now(),
        subtotal: body.subtotal,
        iva: body.iva,
        total: body.total,
        usuario: body.usuario,
    });

    pedido.save((err, pedidoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            pedido: pedidoBD,
        });
    });
});

module.exports = app;