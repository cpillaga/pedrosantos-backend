const express = require("express");
const mongoose = require('mongoose');

const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let PedidoDetalle = require("../models/pedido-detalle");

//=======================================
//mostrar todos los detalles de un pedido
//=======================================

app.get("/pedidos-detalle/:id", (req, res) => {
    let id = req.params.id;
    PedidoDetalle.find({
            pedido: id
        })
        .populate({
            path: 'producto',
            populate: {
                path: 'categoria'
            }
        }).populate('pedido')
        .exec((err, pedidosDetalle) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                pedidosDetalle,
            });
        });
});


//=====================================
//crear un nuevo pedido detalle
//=====================================

app.post("/pedidos-detalle", (req, res) => {
    let body = req.body;
    let pedido = new PedidoDetalle({
        cantidad: body.cantidad,
        producto: body.producto,
        subtotal: body.subtotal,
        pedido: body.pedido,
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