const express = require("express");

const bcrypt = require("bcryptjs");
const cors = require('cors');

let Usuario = require("../models/usuario");

let app = express();
app.use(cors({ origin: '*' }));

app.post("/login", (req, res) => {
    let body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                },
            });
        }

        usuarioDB.password = null;

        res.status(201).json({
            ok: true,
            usuario: usuarioDB,
        });
    });

});

module.exports = app;