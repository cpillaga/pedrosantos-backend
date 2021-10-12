const express = require("express");

const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

let Publicidad = require("../models/publicidad");

//=====================================
//mostrar todas las publicidades
//=====================================

app.get("/publicidades", (req, res) => {
    Publicidad.find()
        .exec((err, publicidades) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                publicidades,
            });
        });
});


//=====================================
//obtener un publicidad por id
//=====================================

app.get("/publicidades/:id", (req, res) => {
    let id = req.params.id;
    Publicidad.findById(id)
        .exec((err, publicidadDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!publicidadDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "el id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                publicidad: publicidadDB,
            });
        });
});

//=====================================
//crear una nueva publicidad
//=====================================

app.post("/publicidades", (req, res) => {
    let body = req.body;
    let publicidad = new Publicidad({
        img: body.img,
    });

    publicidad.save((err, publicidadBD) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            publicidad: publicidadBD,
        });
    });
});

//=====================================
//borrar publicidad
//=====================================

app.delete("/publicidades/:id", (req, res) => {
    let id = req.params.id;
    Publicidad.findByIdAndRemove(id, (err, publicidadDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!publicidadDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "el id no existe",
                },
            });
        }
        res.json({
            ok: true,
            mensaje: "Publicidad eliminada",
        });
    });
});


module.exports = app;