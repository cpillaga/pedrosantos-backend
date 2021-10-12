const express = require('express');
const cors = require('cors');

let ImagenAdd = require('../models/imagesAdd');

let app = express();
app.use(cors({ origin: '*' }));


//=====================================
//mostrar una imagen por producto.
//=====================================

app.get('/imagenAdd/:idProd', (req, res) => {
    let idP = req.params.idProd;

    ImagenAdd.find({ producto: idP }).exec((err, imagenAdd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!imagenAdd) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla categoria'
                }
            })
        }
        res.json({
            ok: true,
            imagenAdd
        })
    });
});

//=====================================
//crear nueva categoria
//=====================================

app.post('/imagenAdd', (req, res) => {
    let body = req.body;

    let imagenAdd = new ImagenAdd({
        url: body.url,
        producto: body.producto,
    });

    imagenAdd.save((err, imagenAdd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!imagenAdd) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            imagenAdd
        });
    });
});

//=====================================
//actualizar nueva categoria
//=====================================

app.put('/imagenAdd/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descImage = {
        url: body.url,
        producto: body.prducto,
    };

    ImagenAdd.findByIdAndUpdate(id, descImage, {
        new: true,
        runValidators: true
    }, (err, imagenAdd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!imagenAdd) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            imagenAdd: imagenAdd
        });
    });

});

//=====================================
//eliminar nueva categoria
//=====================================

app.delete('/imagenAdd/:id', (req, res) => {
    let id = req.params.id;

    ImagenAdd.findByIdAndRemove(id, (err, imagenAdd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!imagenAdd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        };
        res.json({
            ok: true,
            mensaje: 'categoria borrada'
        });
    });
});

module.exports = app;