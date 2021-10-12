const express = require('express');

let SubCategoria = require('../models/subcategoria');


const cors = require('cors');
let app = express();
app.use(cors({ origin: '*' }));

//=====================================
//mostrar todas las categorias
//=====================================

app.get('/subcategoria', (req, res) => {
    let id = req.params.idCategoria;
    SubCategoria.find({})
        .populate('categoria')
        .sort('descripcion')
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                subcategoria
            })
        })
});

app.get('/subcategoria/cat/:idCategoria', (req, res) => {
    let id = req.params.idCategoria;
    SubCategoria.find({ categoria: id })
        .sort('descripcion')
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                subcategoria
            })
        })
});

//=====================================
//mostrar una categoria por id.
//=====================================

app.get('/subcategoria/id/:id', (req, res) => {
    let id = req.params.id;

    SubCategoria.findById(id, (err, subcategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!subcategoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'el id no existe en la tabla subcategoria'
                }
            })
        }
        res.json({
            ok: true,
            subcategoria: subcategoriaDB
        })
    });
});

//=====================================
//crear nueva subcategoria
//=====================================

app.post('/subcategoria', (req, res) => {
    let body = req.body;

    let subcategoria = new SubCategoria({
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    subcategoria.save((err, subcategoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!subcategoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            subcategoria: subcategoriaBD
        });
    });
});

//=====================================
//actualizar nueva subcategoria
//=====================================

app.put('/subcategoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    SubCategoria.findByIdAndUpdate(id, descCategoria, {
        new: true,
        runValidators: true
    }, (err, subcategoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!subcategoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            subcategoria: subcategoriaBD
        });
    });

});

//=====================================
//eliminar nueva categoria
//=====================================

app.delete('/subcategoria/:id', (req, res) => {
    let id = req.params.id;

    SubCategoria.findByIdAndRemove(id, (err, subcategoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!subcategoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        };
        res.json({
            ok: true,
            mensaje: 'subcategoria borrada'
        });
    });
});

//=====================================
//Filtrar una subcategoria
//=====================================

app.get('/subcategoria/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    SubCategoria.find({
            descripcion: regex
        })
        .sort('descripcion')
        .exec((err, subcategoria) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                subcategoria
            });
        });
});

module.exports = app;